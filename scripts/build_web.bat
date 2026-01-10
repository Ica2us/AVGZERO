@echo off
setlocal

echo Building web frontend...

:: Get project root
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."
cd /d "%PROJECT_ROOT%"

:: Create build web directory
if not exist "build\web" mkdir "build\web"

:: Copy web source files
echo Copying web source files...
xcopy /s /e /y /q "web\src\*" "build\web\" >nul

:: Copy assets
if exist "web\assets" (
    echo Copying assets...
    xcopy /s /e /y /q "web\assets\*" "build\web\assets\" >nul
) else (
    echo No assets directory found, skipping...
)

:: Copy WASM files
if not exist "build\web\build\wasm" mkdir "build\web\build\wasm"
if exist "build\wasm\avg_engine.wasm" (
    echo Copying WASM files...
    copy /y "build\wasm\avg_engine.wasm" "build\web\build\wasm\" >nul
    copy /y "build\wasm\avg_engine.js" "build\web\build\wasm\" >nul
) else (
    echo Warning: WASM not built yet. Run build_wasm.bat first.
)

echo Web build complete!
echo Output directory: build\web

endlocal
