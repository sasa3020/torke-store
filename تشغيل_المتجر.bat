@echo off
chcp 65001 > nul
title Torke Store - متجر تورك لطلاب الثانوية
echo ===================================================
echo     جاري تشغيل متجر تورك ستور (Torke Store)...
echo ===================================================
echo.
echo يتم الآن فتح المتجر في متصفحك تلقائياً: http://localhost:3000
echo.
start http://localhost:3000
call npm.cmd run dev
pause
