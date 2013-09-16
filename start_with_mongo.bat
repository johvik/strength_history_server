@ECHO OFF
SETLOCAL

if not "%1%"=="b" goto nobuild
rmdir /s /q public\
cd ..\strength_history_web\build\
call build.bat
xcopy /e /i output ..\..\strength_history_server\public

:nobuild
ENDLOCAL

start cmd /c "cd C:\mongodb\bin && mongod.exe"
start cmd /c "cd C:\mongodb\bin && mongo.exe db"
node app.js
taskkill /f /im mongod.exe
taskkill /f /im mongo.exe
