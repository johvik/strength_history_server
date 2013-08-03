@ECHO OFF
start cmd /c "cd C:\mongodb\bin && mongod.exe"
start cmd /c "cd C:\mongodb\bin && mongo.exe db"
node app.js
taskkill /f /im mongod.exe
taskkill /f /im mongo.exe
