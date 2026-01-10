@echo off
setlocal

echo Deploying AVG Game...

:: Get project root
set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."
cd /d "%PROJECT_ROOT%"

:: Build for production
call "%SCRIPT_DIR%build.bat"
if errorlevel 1 (
    echo Build failed!
    exit /b 1
)

:: TODO: Add deployment commands here
:: For example:
:: - Upload to S3
:: - Deploy to GitHub Pages
:: - Deploy to Netlify/Vercel

echo.
echo Deployment package ready in: build\web
echo.
echo To deploy, copy the contents of build\web to your web server.
echo.

endlocal
