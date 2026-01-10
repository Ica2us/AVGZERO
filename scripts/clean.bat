@echo off
setlocal

echo Cleaning build artifacts...

:: Get project root
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."
cd /d "%PROJECT_ROOT%"

:: Remove build directories
if exist "build" (
    rmdir /s /q "build"
    echo Removed build directory
)

:: Remove web build directory
if exist "web\build" (
    rmdir /s /q "web\build"
    echo Removed web\build directory
)

echo Clean complete!

endlocal
