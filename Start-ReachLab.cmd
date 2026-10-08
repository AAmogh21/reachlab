@echo off
cd /d "%~dp0"
if exist "%~dp0..\..\work\tools\node-v24.21.0-win-x64\node.exe" ("%~dp0..\..\work\tools\node-v24.21.0-win-x64\node.exe" scripts\server.mjs) else (node scripts\server.mjs)
pause
