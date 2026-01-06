@echo off
echo Setting up SAT Blog Application...

REM Install dependencies
echo Installing frontend dependencies...
cd "D:\mock sat react\my-react-app"
npm install

echo Installing backend dependencies...
cd "D:\mock sat react\my-react-app\api"
if exist package.json npm install

REM Start backend
echo Starting Cloudflare Workers backend...
start cmd /k "cd /d "D:\mock sat react\my-react-app" && npx wrangler dev --port 8787"

timeout /t 5 /nobreak

REM Start frontend
echo Starting React frontend...
start cmd /k "cd /d "D:\mock sat react\my-react-app" && npm start"

echo Setup complete!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8787
pause