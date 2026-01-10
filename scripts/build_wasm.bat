@echo off
setlocal enabledelayedexpansion

echo Building WASM engine...

:: Get script directory and project root
set "SCRIPT_DIR=%~dp0"
pushd "%SCRIPT_DIR%.."
set "PROJECT_ROOT=%CD%"
popd

:: Check if emsdk exists locally
if exist "%PROJECT_ROOT%\emsdk\upstream\emscripten\emcc.bat" (
    set "EMSDK_ROOT=%PROJECT_ROOT%\emsdk"
) else if defined EMSDK (
    set "EMSDK_ROOT=%EMSDK%"
) else (
    echo Error: Emscripten SDK not found.
    echo Please install emsdk or set EMSDK environment variable.
    echo Run: git clone https://github.com/emscripten-core/emsdk.git
    echo Then: cd emsdk ^&^& emsdk install latest ^&^& emsdk activate latest
    exit /b 1
)

:: Set up Emscripten environment directly
echo Setting up Emscripten from %EMSDK_ROOT%...
set "EMSDK=%EMSDK_ROOT%"

:: Add CMake to PATH if it exists in Program Files
if exist "C:\Program Files\CMake\bin\cmake.exe" (
    set "PATH=C:\Program Files\CMake\bin;%PATH%"
)

:: Add Emscripten to PATH
set "PATH=%EMSDK_ROOT%;%EMSDK_ROOT%\upstream\emscripten;%EMSDK_ROOT%\node\22.16.0_64bit\bin;%PATH%"
set "EMSDK_NODE=%EMSDK_ROOT%\node\22.16.0_64bit\bin\node.exe"
set "EMSDK_PYTHON=%EMSDK_ROOT%\python\3.13.3_64bit\python.exe"

:: Verify cmake is available
where cmake >nul 2>&1
if errorlevel 1 (
    echo Error: cmake not found. Please install CMake and add it to PATH.
    echo Download from: https://cmake.org/download/
    exit /b 1
)

:: Verify emcc is available
where emcc >nul 2>&1
if errorlevel 1 (
    echo Error: emcc not found. Checking if emcc.bat exists...
    if exist "%EMSDK_ROOT%\upstream\emscripten\emcc.bat" (
        echo Found emcc.bat, continuing...
    ) else (
        echo Error: emcc.bat not found at %EMSDK_ROOT%\upstream\emscripten\emcc.bat
        exit /b 1
    )
)

:: Change to project root
cd /d "%PROJECT_ROOT%"

:: Create build directory
if not exist "build\wasm" mkdir "build\wasm"

:: Build with CMake and Emscripten
cd build\wasm

echo Running CMake configuration...
call "%EMSDK_ROOT%\upstream\emscripten\emcmake.bat" cmake "%PROJECT_ROOT%" -DCMAKE_BUILD_TYPE=Release -DBUILD_WASM=ON -G "MinGW Makefiles"
if errorlevel 1 (
    echo CMake configuration failed!
    cd /d "%PROJECT_ROOT%"
    exit /b 1
)

echo Building...
call "%EMSDK_ROOT%\upstream\emscripten\emmake.bat" mingw32-make
if errorlevel 1 (
    echo Build failed!
    cd /d "%PROJECT_ROOT%"
    exit /b 1
)

cd /d "%PROJECT_ROOT%"

:: Check if build succeeded
if exist "build\wasm\avg_engine.wasm" (
    echo WASM build successful!
    echo Output: build\wasm\avg_engine.js
    echo Output: build\wasm\avg_engine.wasm
) else (
    echo WASM build failed - output files not found!
    exit /b 1
)

:: Copy to web directory
if not exist "web\build\wasm" mkdir "web\build\wasm"
copy /y "build\wasm\avg_engine.js" "web\build\wasm\" >nul
copy /y "build\wasm\avg_engine.wasm" "web\build\wasm\" >nul
echo Copied WASM files to web\build\wasm\

endlocal
