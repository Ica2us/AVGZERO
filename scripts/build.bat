@echo off
echo =========================================
echo AVG Game Engine - Build Script (Windows)
echo =========================================

:: Build WASM
echo Building WASM engine...
call "%~dp0build_wasm.bat"
if errorlevel 1 (
    echo WASM build failed!
    exit /b 1
)

:: Build Web
echo Building web frontend...
call "%~dp0build_web.bat"
if errorlevel 1 (
    echo Web build failed!
    exit /b 1
)

echo =========================================
echo Build complete!
echo =========================================
