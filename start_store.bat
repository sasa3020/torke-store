@echo off
title Torke Store Local Server
echo Starting Torke Store at http://localhost:3000 ...
start http://localhost:3000
call npm.cmd run dev
pause
