@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing frontend dependencies...
  call npm install
)
echo Starting RP FastFood website...
npm run dev
pause
