@echo off
cd /d "%~dp0server"
if not exist node_modules (
  echo Installing backend dependencies...
  call npm install
)
echo Starting RP FastFood API...
npm run dev
pause
