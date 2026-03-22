@echo off
echo ==========================================
echo       Relay Bloom Server Launcher
echo ==========================================
echo.
echo Starting Backend (Spring Boot) and Frontend (Next.js)...
echo Two new terminal windows will appear!
echo.

start "Relay Bloom - Backend" cmd /k "cd backend && gradlew.bat bootRun"
start "Relay Bloom - Frontend" cmd /k "cd frontend && npm run dev"

echo Both servers are booting up.
echo Please wait about 15 seconds, then open http://localhost:3000 in your browser.
echo You can safely close this launcher window now.
echo.
pause
