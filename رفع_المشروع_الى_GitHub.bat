@echo off
chcp 65001 > nul
title رفع متجر تورك إلى GitHub
cls
echo =========================================================
echo       مساعد رفع متجر تورك ستور إلى مستودع GitHub
echo =========================================================
echo.

where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [تنبيه] لم يتم العثور على أداة Git مثبتة على هذا الجهاز.
    echo.
    echo يمكنك رفع المشروع بسهولة بإحدى الطرق التالية:
    echo 1) تثبيت Git من الرابط: https://git-scm.com/download/win
    echo 2) أو استخدام تطبيق GitHub Desktop السهل: https://desktop.github.com/
    echo 3) أو سحب وإفلات مجلدات المشروع مباشرة على موقع GitHub (باستثناء node_modules).
    echo.
    echo راجع ملف README.md للخطوات التفصيلية المصورة.
    echo =========================================================
    pause
    exit /b
)

echo تم العثور على أداة Git بنجاح!
echo.
set /p repo_url="أدخل رابط مستودع GitHub الخاص بك (مثال: https://github.com/username/torke-store.git): "

if "%repo_url%"=="" (
    echo لم يتم إدخال رابط المستودع. تم إلغاء العملية.
    pause
    exit /b
)

echo.
echo 1. جاري تهيئة مستودع Git محلي...
git init

echo 2. جاري إضافة وتجهيز الملفات...
git add .

echo 3. جاري عمل أول Commit...
git commit -m "Initial commit - Torke Store ready for GitHub Pages"

echo 4. ضبط الفرع الرئيسي main...
git branch -M main

echo 5. ربط المستودع البعيد...
git remote remove origin >nul 2>&1
git remote add origin %repo_url%

echo 6. جاري رفع المشروع إلى GitHub...
git push -u origin main

echo.
echo =========================================================
if %errorlevel% equ 0 (
    echo [تهانينا!] تم رفع المشروع بنجاح إلى GitHub.
    echo لتفعيل الموقع على GitHub Pages:
    echo اذهب إلى Settings -> Pages -> Source واختر GitHub Actions.
) else (
    echo [ملاحظة] حدث خطأ أو طلب Git تسجيل الدخول.
    echo يرجى التأكد من تسجيل الدخول في Git أو استخدام GitHub Desktop.
)
echo =========================================================
pause
