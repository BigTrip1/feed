@echo off
echo.
echo ========================================
echo    🚀 Starting FEED - Solana Analytics
echo ========================================
echo.

echo 🔄 Killing any existing Node processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul

echo 📊 Starting FEED Server...
start "FEED Server" cmd /k "cd server && echo Starting FEED Server on port 5000 && node index.js"

echo ⏳ Waiting for server to initialize...
timeout /t 5 >nul

echo ⚛️  Starting React Client...
start "FEED Client" cmd /k "cd client && echo Starting React Client on port 3000 && npm start"

echo.
echo ✅ FEED is starting up!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔗 API:      http://localhost:5000
echo 📡 WebSocket: ws://localhost:8080
echo.
echo Press any key to exit this window...
pause >nul 