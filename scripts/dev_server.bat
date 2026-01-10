@echo off
setlocal

echo Starting development server...

:: Get project root
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."
cd /d "%PROJECT_ROOT%"

:: Check if npm is available
where npm >nul 2>&1
if errorlevel 1 (
    echo Error: npm not found. Please install Node.js.
    exit /b 1
)

:: Check if http-server is installed
call npx http-server --version >nul 2>&1
if errorlevel 1 (
    echo Installing http-server...
    call npm install -g http-server
)

:: Build first
echo Building project...
call "%SCRIPT_DIR%build.bat"
if errorlevel 1 (
    echo Build failed!
    exit /b 1
)

:: Start server
echo.
echo =========================================
echo Server running at http://localhost:8080
echo Press Ctrl+C to stop
echo =========================================
echo.
cd build\web
call npx http-server -p 8080 -c-1

endlocal
