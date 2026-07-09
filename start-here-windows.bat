@echo off
setlocal

echo ==========================================
echo LoanHub - Windows Start Script
echo ==========================================

echo Cleaning old Next cache...
if exist .next rmdir /s /q .next

echo Installing dependencies without package-lock...
npm install --legacy-peer-deps --no-audit --no-fund --package-lock=false

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo npm install failed. Please install Node.js 20 LTS and try again.
  pause
  exit /b %ERRORLEVEL%
)

echo Starting development server...
npm run dev

endlocal
