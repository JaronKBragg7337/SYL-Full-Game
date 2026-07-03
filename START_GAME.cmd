@echo off
REM SYL — one-click launcher for Jaron. Starts the local server and opens the game.
cd /d "%~dp0"
start "" http://localhost:8377
node server.js
