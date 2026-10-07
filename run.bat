@echo off
setlocal EnableExtensions

cd /d "%~dp0"

echo ==========================================
echo Kartzo - Integrated server (Spring + Next.js)
echo ==========================================
echo   API + legacy UI: http://localhost:8080
echo   New storefront:  http://localhost:3000
echo.
echo   Spring Boot starts Next.js automatically (profile: dev).
echo   Stop this window (Ctrl+C) to shut down BOTH.
echo ==========================================
echo.

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js/npm not found.
  echo Install Node.js LTS from https://nodejs.org then run this script again.
  pause
  exit /b 1
)

if not exist "web\.env.local" (
  if exist "web\.env.local.example" (
    echo Creating web\.env.local from .env.local.example ...
    copy /Y "web\.env.local.example" "web\.env.local" >nul
  ) else (
    echo Creating default web\.env.local ...
    > "web\.env.local" echo SPRING_BACKEND_URL=http://localhost:8080
    >> "web\.env.local" echo NEXT_PUBLIC_SITE_URL=http://localhost:3000
    >> "web\.env.local" echo NEXT_PUBLIC_MEDIA_ORIGIN=http://localhost:8080
  )
)

echo Downloading / updating npm packages ^(web^)...
pushd web
call npm install
if errorlevel 1 (
  echo [ERROR] npm install failed.
  popd
  pause
  exit /b 1
)
popd

echo.
echo Starting Spring Boot with profile [dev] ^(Next.js will start after the API is ready^)...
echo.

REM Open storefront after Spring + Next have had time to bind ports (adjust if machine is slow)
start /B powershell -WindowStyle Hidden -Command "Start-Sleep -Seconds 22; Start-Process 'http://localhost:3000'"

call mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=dev"

echo.
pause
