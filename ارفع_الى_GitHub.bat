@echo off
chcp 65001 > nul
title رفع متجر تورك إلى GitHub
cls
set "PATH=%USERPROFILE%\.mingit\cmd;%PATH%"

echo =========================================================
echo       جاري رفع متجر تورك ستور إلى مستودعك:
echo       https://github.com/sasa3020/torke-store
echo =========================================================
echo.

git push -u origin main --force

echo.
echo =========================================================
if %errorlevel% equ 0 (
    echo [تهانينا!] تم رفع جميع ملفات المشروع بنجاح إلى GitHub!
    echo.
    echo الخطوة التالية لتفعيل الموقع الحي على GitHub Pages:
    echo 1. اجعل المستودع Public من Settings -> Change visibility
    echo 2. اذهب إلى Settings -> Pages -> Source واختر GitHub Actions
) else (
    echo.
    echo [ملاحظة] إذا طلب GitHub إدخال اسم المستخدم وكلمة المرور:
    echo - أدخل اسم حسابك: sasa3020
    echo - في خانة كلمة المرور: أدخل (Personal Access Token) من إعدادات GitHub.
)
echo =========================================================
pause
