@echo off
echo.
echo ========================================
echo   Epic Food Assistant - Deployment
echo ========================================
echo.

REM Check if API key is provided as argument
if "%1"=="" (
    echo Error: No API key provided!
    echo.
    echo Usage: deploy.bat YOUR_GEMINI_API_KEY
    echo.
    echo Get your API key from: https://aistudio.google.com/app/apikey
    echo.
    pause
    exit /b 1
)

set API_KEY=%1

REM Validate API key format (basic check)
echo %API_KEY% | findstr /B "AIzaSy" >nul
if errorlevel 1 (
    echo Error: Invalid API key format!
    echo Valid Gemini API keys start with "AIzaSy"
    echo.
    pause
    exit /b 1
)

REM Check if source file exists
if not exist "simple-app.html" (
    echo Error: simple-app.html not found!
    echo Make sure you're running this script in the correct directory.
    echo.
    pause
    exit /b 1
)

REM Replace placeholder with actual API key
powershell -Command "(Get-Content 'simple-app.html') -replace 'GEMINI_API_KEY_PLACEHOLDER', '%API_KEY%' | Set-Content 'simple-app-deployed.html'"

if exist "simple-app-deployed.html" (
    echo.
    echo ✅ Deployment file created successfully!
    echo 📁 File: simple-app-deployed.html
    echo.
    echo 🚀 Next steps:
    echo 1. Upload simple-app-deployed.html to your hosting platform
    echo 2. Rename it to index.html ^(if needed^)
    echo 3. Your app is ready to use!
    echo.
    echo ⚠️  Security reminder:
    echo - Keep your API key secure
    echo - Monitor your API usage
    echo - Never commit the deployed file to version control
    echo.
) else (
    echo Error: Failed to create deployment file!
    echo.
)

pause