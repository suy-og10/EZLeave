@echo off
echo 🚀 Starting EZLeave Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd server
call npm install

echo 📦 Installing frontend dependencies...
cd ..\client
call npm install

echo 🌱 Seeding sample data...
cd ..\server
node seedData.js

echo 🎉 Setup complete!
echo.
echo To start the application:
echo 1. Open a terminal and run: cd server ^&^& npm run dev
echo 2. Open another terminal and run: cd client ^&^& npm start
echo.
echo Demo credentials:
echo Admin: admin@EZLeave.com / password123
echo HR: hr@EZLeave.com / password123
echo Employee: employee@EZLeave.com / password123
echo.
echo Application will be available at http://localhost:3000
pause
