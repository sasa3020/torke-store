@echo off
chcp 65001 > nul
title تسجيل الدخول ورفع المتجر إلى GitHub
cls
set "PATH=%USERPROFILE%\.mingit\cmd;%PATH%"

echo =========================================================
echo     جاري تسجيل الدخول ورفع متجر تورك إلى GitHub
echo =========================================================
echo.
echo 1. سيظهر لك الآن كود تأكيد، ثم اضغط Enter ليفتح لك المتصفح تلقائياً.
echo 2. الصق الكود في المتصفح واضغط Authorize (الموافقة).
echo.
call gh.exe auth login --web -h github.com -p https

echo.
echo =========================================================
echo جاري ربط Git ورفع كافة مجلدات وملفات المشروع...
echo =========================================================
call gh.exe auth setup-git

cd /d "c:\Users\ELMANYLY\Desktop\new edition"
git remote remove origin >nul 2>&1
git remote add origin https://github.com/sasa3020/torke-store.git
git branch -M main
git push -u origin main --force

echo.
echo =========================================================
if %errorlevel% equ 0 (
    echo [مبروك!] تم رفع كل ملفات ومجلدات المتجر بنجاح 100%% إلى GitHub!
    echo سيعمل الموقع أونلاين خلال ثوانٍ.
) else (
    echo حدث خطأ أثناء الرفع، يرجى المحاولة مجدداً.
)
echo =========================================================
pause
