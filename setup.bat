@echo off
REM Portfolio Project - Local Setup & Testing Script (Windows)

setlocal enabledelayedexpansion

echo ============================================
echo Portfolio Project - Local Setup (Windows)
echo ============================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%
echo.

echo ============================================
echo Installing Dependencies
echo ============================================
echo.

echo 📦 Installing root dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo 📦 Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ✅ All dependencies installed!
echo.

echo ============================================
echo Ready to Start Development!
echo ============================================
echo.
echo Run both frontend and backend concurrently:
echo    npm run dev:all
echo.
echo 📱 Frontend Development Server: http://localhost:5173
echo 🖥️  Backend Server: http://localhost:5000
echo.
echo ============================================
echo Testing the Application
echo ============================================
echo.
echo 1. 🌐 Check Frontend: http://localhost:5173
echo 2. 🔍 Health Check: curl http://localhost:5000/api/health
echo 3. 📋 List Projects: curl http://localhost:5000/api/projects
echo 4. 📷 List Photos: curl http://localhost:5000/api/media?category=photo
echo.
echo ============================================
echo ✅ Setup Complete!
echo ============================================
echo.
pause
