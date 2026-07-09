@echo off
setlocal

echo ==========================================
echo LoanHub - npm Windows Fix
echo ==========================================

echo Removing node_modules...
if exist node_modules rmdir /s /q node_modules

echo Removing Next cache...
if exist .next rmdir /s /q .next

echo Removing package-lock.json...
if exist package-lock.json del package-lock.json

echo Cleaning npm cache...
npm cache clean --force

echo Installing dependencies cleanly...
npm install --legacy-peer-deps --no-audit --no-fund --package-lock=false

echo Done. Now run: npm run dev
pause
endlocal
