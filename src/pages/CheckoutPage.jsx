import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  Truck, 
  Zap, 
  Upload, 
  CheckCircle2, 
  FileText, 
  AlertCircle, 
  Copy, 
  Check, 
  Trash2, 
  ArrowRight,
  ShieldAlert,
  User,
  Phone,
  MapPin,
  Sparkles,
  MessageCircle,
  GraduationCap,
  Lock,
  LogIn,
  UserPlus,
  LogOut
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CheckoutPage = () => {
  const { 
    theme,
    cart, 
    cartSubtotal, 
    currentUser, 
    createOrder, 
    updateProfile,
    loginUser,
    registerUser,
    logoutUser
  } = useStore();

  const navigate = useNavigate();

  // Shipping Method selection (Standard vs Express)
  const [shippingMethod, setShippingMethod] = useState('Standard'); // 'Standard' | 'Express'

  const getGradeArabic = (g) => {
    if (!g) return 'الصف الثالث الثانوي';
    if (g.includes('3rd') || g.includes('الثالث')) return 'الصف الثالث الثانوي';
    if (g.includes('2nd') || g.includes('الثاني')) return 'الصف الثاني الثانوي';
    if (g.includes('1st') || g.includes('الاول') || g.includes('الأول')) return 'الصف الاول الثانوي';
    if (g.includes('Baccalaureate') || g.includes('بكالوريا')) return 'بكالوريا';
    return g;
  };

  // Form Fields (Pre-filled from currentUser if available)
  const [shippingDetails, setShippingDetails] = useState({
    fullName: currentUser?.fullName || '',
    primaryPhone: currentUser?.primaryPhone || '',
    altPhone: currentUser?.altPhone || '',
    address: currentUser?.address || '',
    grade: currentUser?.grade ? getGradeArabic(currentUser.grade) : 'الصف الثالث الثانوي',
    notes: ''
  });

  // Auth gate state when user is not logged in
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regData, setRegData] = useState({
    fullName: '',
    primaryPhone: '',
    altPhone: '',
    address: '',
    grade: 'الصف الثالث الثانوي',
    password: ''
  });

  // Sync shipping details when user logs in or registers
  useEffect(() => {
    if (currentUser) {
      setShippingDetails(prev => ({
        ...prev,
        fullName: currentUser.fullName || prev.fullName || '',
        primaryPhone: currentUser.primaryPhone || prev.primaryPhone || '',
        altPhone: currentUser.altPhone || prev.altPhone || '',
        address: currentUser.address || prev.address || '',
        grade: currentUser.grade ? getGradeArabic(currentUser.grade) : prev.grade || 'الصف الثالث الثانوي'
      }));
    }
  }, [currentUser]);

  const handleCheckoutLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!loginPhone.trim() || !loginPassword.trim()) {
      setAuthError('يرجى إدخال رقم الهاتف / البريد الإلكتروني وكلمة المرور');
      return;
    }
    const res = loginUser(loginPhone, loginPassword);
    if (!res.success) {
      setAuthError(res.message || 'بيانات الدخول غير صحيحة');
    } else {
      setAuthSuccess('تم تسجيل الدخول بنجاح! جاري متابعة الطلب...');
      setTimeout(() => setAuthSuccess(''), 2000);
    }
  };

  const handleCheckoutRegister = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!regData.fullName.trim()) {
      setAuthError('يرجى إدخال اسم الطالب بالكامل');
      return;
    }
    if (!regData.primaryPhone.trim() || regData.primaryPhone.length < 10) {
      setAuthError('يرجى إدخال رقم هاتف أساسي صحيح');
      return;
    }
    if (!regData.altPhone.trim()) {
      setAuthError('يرجى إدخال رقم هاتف ولي الأمر أو رقم بديل');
      return;
    }
    if (!regData.address.trim()) {
      setAuthError('يرجى إدخال العنوان بالتفصيل للتوصيل');
      return;
    }
    if (!regData.password || regData.password.length < 4) {
      setAuthError('كلمة المرور يجب أن لا تقل عن 4 خانات');
      return;
    }
    const res = registerUser(regData);
    if (!res.success) {
      setAuthError(res.message || 'تعذر إنشاء الحساب');
    } else {
      setAuthSuccess('تم إنشاء حساب الطالب بنجاح! تم نقل بياناتك لخطوة الشحن.');
      setTimeout(() => setAuthSuccess(''), 2000);
    }
  };

  const [lastWhatsappMsg, setLastWhatsappMsg] = useState('');

  // Receipt Upload State
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const isOnlyTeacherCodes = cart.length > 0 && cart.every(item => item.category === 'Teacher Codes');
  const hasPhysicalItems = cart.some(item => item.category !== 'Teacher Codes');

  const standardCost = Number(theme?.standardShippingRate) || 85;
  const expressCost = Number(theme?.expressShippingRate) || 220;
  const shippingCost = isOnlyTeacherCodes ? 0 : (shippingMethod === 'Express' ? expressCost : standardCost);
  const grandTotal = cartSubtotal + shippingCost;
  const VODAFONE_CASH_NUMBER = theme?.vodafoneNumber || '01031361897';

  // Copy Vodafone Cash Number
  const handleCopyNumber = () => {
    navigator.clipboard.writeText(VODAFONE_CASH_NUMBER);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  // Receipt File Handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('حجم الصورة كبير جداً، يرجى اختيار ملف أصغر من 10 ميجابايت');
        return;
      }
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setReceiptImage(event.target.result);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample Receipt Simulator (Helps users test without requiring a real file)
  const handleSimulateReceipt = () => {
    // Generate a clean mock receipt graphic
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 400, 300);
    ctx.fillStyle = '#e11d48'; // Vodafone red
    ctx.fillRect(0, 0, 400, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Vodafone Cash Transfer Receipt', 30, 38);
    ctx.fillStyle = '#0f172a';
    ctx.font = '16px sans-serif';
    ctx.fillText(`Amount: ${grandTotal} EGP`, 30, 110);
    ctx.fillText(`To: ${VODAFONE_CASH_NUMBER}`, 30, 145);
    ctx.fillText(`Date: ${new Date().toLocaleString()}`, 30, 180);
    ctx.fillText(`Status: Successful Transfer ✔`, 30, 215);
    ctx.fillStyle = '#0284c7';
    ctx.fillText(`Torke Store Student Order`, 30, 260);

    const dataUrl = canvas.toDataURL('image/png');
    setReceiptImage(dataUrl);
    setReceiptFileName('vodafone_cash_transfer_proof.png');
    setErrorMsg('');
  };

  // Form Submission
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('سلة مشترياتك فارغة!');
      return;
    }

    if (!shippingDetails.fullName.trim()) {
      setErrorMsg('يرجى إدخال اسم المستلم بالكامل');
      return;
    }

    if (!shippingDetails.primaryPhone.trim() || shippingDetails.primaryPhone.length < 10) {
      setErrorMsg('يرجى إدخال رقم هاتف أساسي صحيح');
      return;
    }

    if (!shippingDetails.altPhone.trim()) {
      setErrorMsg('يرجى إدخال رقم هاتف بديل (للطوارئ ومندوب الشحن)');
      return;
    }

    if (hasPhysicalItems && !shippingDetails.address.trim()) {
      setErrorMsg('يرجى كتابة العنوان بالتفصيل لضمان سرعة التوصيل');
      return;
    }

    if (!receiptImage) {
      setErrorMsg('يرجى إرفاق صورة أو لقطة شاشة لإيصال تحويل فودافون كاش لتأكيد طلبك');
      return;
    }

    setIsSubmitting(true);

    const finalAddress = shippingDetails.address.trim() || 'تسليم رقمي فوري عبر واتساب (أكواد منصات)';
    const finalShippingMethod = isOnlyTeacherCodes 
      ? 'تسليم رقمي فوري (بدون خدمة شحن)' 
      : (shippingMethod === 'Express' ? 'Express ("Rocket") Shipping' : 'Standard Shipping');

    // Save profile if updated
    if (currentUser) {
      updateProfile({
        fullName: shippingDetails.fullName,
        primaryPhone: shippingDetails.primaryPhone,
        altPhone: shippingDetails.altPhone,
        address: finalAddress
      });
    }

    // Create Order in Store Context
    const orderData = createOrder({
      customer: {
        ...shippingDetails,
        address: finalAddress
      },
      items: cart,
      shippingMethod: finalShippingMethod,
      shippingCost,
      subtotal: cartSubtotal,
      grandTotal,
      receiptImage,
      notes: shippingDetails.notes
    });

    // Trigger Confetti Celebration
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti triggered');
    }

    // ✨ Send WhatsApp Notification to Store Owner (+20 15 15856581)
    const studentGrade = getGradeArabic(shippingDetails.grade);
    const shippingMethodLabel = isOnlyTeacherCodes 
      ? '⚡ تسليم رقمي فوري لأكواد الدروس والمنصات (بدون خدمة شحن - 0 ج.م)' 
      : `${shippingMethod === 'Express' ? 'شحن صاروخ (سريع)' : 'شحن قياسي'} (${shippingCost} ج.م)`;
    const itemsList = cart.map((i, idx) => `  ${idx + 1}. ${i.title} (الكمية: ${i.quantity}) - ${i.price * i.quantity} ج.م`).join('\n');
    const fullMsg = `🛎️ *طلب شراء جديد من متجر تورك!*
━━━━━━━━━━━━━━━
📋 *رقم الطلب:* #${orderData.id}
👤 *اسم الطالب:* ${shippingDetails.fullName}
🎓 *الصف الدراسي:* ${studentGrade}
📱 *رقم الهاتف الأساسي:* ${shippingDetails.primaryPhone}
📞 *رقم هاتف بديل:* ${shippingDetails.altPhone || 'لا يوجد'}
📍 *العنوان:* ${finalAddress}
${shippingDetails.notes ? `📝 *ملاحظات:* ${shippingDetails.notes}\n` : ''}━━━━━━━━━━━━━━━
📦 *المنتجات المطلوبة:*
${itemsList}
━━━━━━━━━━━━━━━
🚚 *طريقة الشحن / الاستلام:* ${shippingMethodLabel}
💵 *الإجمالي النهائي:* ${grandTotal} ج.م
━━━━━━━━━━━━━━━
✅ مرفق إيصال تحويل فودافون كاش لتأكيد الطلب.`;

    setLastWhatsappMsg(fullMsg);

    try {
      const ownerPhone = '201515856581';
      const waUrl = `https://api.whatsapp.com/send?phone=${ownerPhone}&text=${encodeURIComponent(fullMsg)}`;
      window.open(waUrl, '_blank');
    } catch (err) {
      console.log('WhatsApp notification attempted', err);
    }

    setIsSubmitting(false);
    setSubmittedOrder(orderData);
  };

  // Success Modal State View
  if (submittedOrder) {
    const ownerPhone = '201515856581';
    const waUrl = `https://api.whatsapp.com/send?phone=${ownerPhone}&text=${encodeURIComponent(lastWhatsappMsg)}`;

    return (
      <div className="container py-16 max-w-2xl animate-fade-in">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-sky-100 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={46} />
          </div>

          <div className="space-y-2">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              تم تسجيل وتأكيد الطلب بنجاح 🚀
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              شكراً لاختيارك متجر تورك!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              رقم طلبك هو <strong className="text-sky-600 font-mono text-base">{submittedOrder.id}</strong>. جاري مراجعة إيصال فودافون كاش وتجهيز شحنتك فورياً.
            </p>
          </div>

          {/* Itemized Snapshot */}
          <div className="bg-sky-50/70 p-5 rounded-2xl text-right border border-sky-100 space-y-2 text-xs">
            <div className="flex justify-between font-bold text-slate-800 pb-2 border-b border-sky-200/60">
              <span>المستلم: {submittedOrder.customer.fullName}</span>
              <span className="text-sky-700">{submittedOrder.shippingMethod}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>الصف الدراسي:</span>
              <span className="font-semibold text-slate-800">{getGradeArabic(submittedOrder.customer.grade)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>العنوان:</span>
              <span className="font-semibold text-slate-800">{submittedOrder.customer.address}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>الهاتف:</span>
              <span className="font-semibold text-slate-800">{submittedOrder.customer.primaryPhone} {submittedOrder.customer.altPhone && `(بديل: ${submittedOrder.customer.altPhone})`}</span>
            </div>
            <div className="flex justify-between text-slate-800 pt-2 border-t border-sky-200/60 text-sm font-black">
              <span>الإجمالي المدفوع:</span>
              <span className="text-sky-700">{submittedOrder.grandTotal} ج.م</span>
            </div>
          </div>

          {/* Direct WhatsApp Order Action */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
            <a 
              href={waUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full btn bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 text-sm sm:text-base transition-all"
            >
              <MessageCircle size={20} />
              <span>إرسال تفاصيل الأوردر إلى واتساب المتجر (+20 15 15856581)</span>
            </a>
            <p className="text-[11px] text-emerald-700 font-medium">
              اضغط هنا لإرسال بيانات طلبك مباشرة إلى إدارة المتجر لتأكيد الإيصال وسرعة الشحن 💬
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to="/profile" className="btn btn-primary">
              <User size={16} />
              <span>متابعة حالة الطلب في حسابي</span>
            </Link>
            <Link to="/" className="btn btn-secondary">
              <span>العودة للصفحة الرئيسية</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If Cart is Empty
  if (cart.length === 0) {
    return (
      <div className="container py-20 text-center space-y-4 max-w-md">
        <div className="w-20 h-20 rounded-full bg-sky-50 text-sky-400 flex items-center justify-center mx-auto">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">سلة التسوق فارغة حالياً</h2>
        <p className="text-xs text-slate-500">
          لم تقم بإضافة أي كتب أو كشاكيل أو أكواد منصات بعد. تصفح المتجر وأضف مشترياتك لإتمام الطلب.
        </p>
        <Link to="/products" className="btn btn-primary">
          تصفح المتجر الآن
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 sm:py-12 space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-sky-100">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          إنهاء الطلب والشحن (Checkout)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          أدخل بيانات التوصيل وأتمم تأكيد الدفع عبر فودافون كاش
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-2xl font-bold flex items-center gap-3 animate-fade-in">
          <AlertCircle size={20} className="text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Left Side Summary & Right Side Shipping + Payment Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================
            LEFT SIDE: Order Summary (Itemized list, subtotal, shipping, total)
           ======================================================== */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-6 lg:sticky lg:top-24">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShoppingBag size={18} className="text-sky-600" />
              <span>ملخص مشترياتك (Order Summary)</span>
            </h2>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full">
              {cart.length} عناصر
            </span>
          </div>

          {/* Itemized List */}
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="py-3 flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-14 h-16 object-cover rounded-xl border border-sky-100 bg-sky-50 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    الكمية: <strong className="text-slate-700">{item.quantity}</strong> × {item.price} ج.م
                  </p>
                </div>
                <div className="text-xs font-extrabold text-slate-900 whitespace-nowrap">
                  {item.price * item.quantity} ج.م
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>المجموع الفرعي للمنتجات:</span>
              <span className="font-bold text-slate-800">{cartSubtotal} ج.م</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>
                {isOnlyTeacherCodes 
                  ? 'خدمة التوصيل (أكواد منصات فورية):' 
                  : `مصاريف الشحن (${shippingMethod === 'Express' ? 'شحن صاروخ' : 'شحن قياسي'}):`}
              </span>
              <span className={`font-bold ${isOnlyTeacherCodes ? 'text-emerald-600' : 'text-sky-600'}`}>
                {isOnlyTeacherCodes ? 'مجاناً (بدون شحن)' : `+${shippingCost} ج.م`}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
              <span className="font-black text-slate-900">المبلغ الإجمالي المطلوب تحويله:</span>
              <div className="text-right">
                <span className="text-2xl font-black text-sky-700">{grandTotal}</span>
                <span className="text-xs font-bold text-sky-600 mr-1">ج.م</span>
              </div>
            </div>
          </div>

          {/* Student Assurance Notice */}
          <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 text-[11px] text-sky-800 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              <span>هدية مفاجأة مع الطلبات المكتملة 🌚</span>
            </p>
            <p className="text-slate-500 leading-relaxed">
              يتم تغليف طلبك بعناية مع هدايا تشجيعية لطلبة الثانوية العامة والبكالوريا.
            </p>
          </div>

        </div>

        {/* ========================================================
            RIGHT SIDE: Student Auth Gate OR Shipping & Payment Form
           ======================================================== */}
        {!currentUser ? (
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-sm space-y-6 animate-fade-in">
            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-sky-600 mb-1.5">
                <Lock size={22} />
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  إتمام الطلب يتطلب حساب طالب
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                لكي نتمكن من شحن طلبك وتزويدك بأكواد المنصات ومتابعة شحنتك في أي وقت، يرجى تسجيل الدخول أو إنشاء حساب جديد.
              </p>
            </div>

            {/* Tabs Switcher */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
                  authMode === 'register'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-sky-600'
                }`}
              >
                <UserPlus size={16} />
                <span>طالب جديد (إنشاء حساب)</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-sky-600'
                }`}
              >
                <LogIn size={16} />
                <span>طالب مسجل (تسجيل الدخول)</span>
              </button>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold flex items-center gap-2">
                <Check size={16} className="flex-shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {authMode === 'register' ? (
              <form onSubmit={handleCheckoutRegister} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم الطالب بالكامل *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="مثال: أحمد محمد علي"
                      value={regData.fullName}
                      onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm pl-10"
                    />
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Primary Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      رقم الهاتف الأساسي (واتساب) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="01012345678"
                        value={regData.primaryPhone}
                        onChange={(e) => setRegData({ ...regData, primaryPhone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm pl-10 dir-ltr text-right"
                      />
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  {/* Alt Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      رقم هاتف بديل / ولي الأمر *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="01123456789"
                        value={regData.altPhone}
                        onChange={(e) => setRegData({ ...regData, altPhone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm pl-10 dir-ltr text-right"
                      />
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    عنوان التوصيل بالتفصيل *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="المحافظة - المنطقة - اسم الشارع - رقم العقار والشقة"
                      value={regData.address}
                      onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm pl-10"
                    />
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Grade */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      المرحلة الدراسية *
                    </label>
                    <div className="relative">
                      <select
                        value={regData.grade}
                        onChange={(e) => setRegData({ ...regData, grade: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white pl-10"
                      >
                        <option value="الصف الثالث الثانوي">الصف الثالث الثانوي (ثانوية عامة)</option>
                        <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                        <option value="الصف الاول الثانوي">الصف الاول الثانوي</option>
                        <option value="بكالوريا">بكالوريا / لغات</option>
                      </select>
                      <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      كلمة مرور لحسابك *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regData.password}
                        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm pl-10"
                      />
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn btn-primary py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 mt-2"
                >
                  <UserPlus size={18} />
                  <span>إنشاء الحساب ومتابعة إتمام الطلب</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleCheckoutLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الهاتف أو البريد الإلكتروني *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="01012345678 أو email@example.com"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm pl-10"
                    />
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    كلمة المرور *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm pl-10"
                    />
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn btn-primary py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 mt-2"
                >
                  <LogIn size={18} />
                  <span>تسجيل الدخول ومتابعة الطلب</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setAuthError(''); }}
                    className="text-xs text-slate-500 hover:text-sky-600 font-semibold"
                  >
                    طالب جديد ليس لديك حساب؟ <strong className="text-sky-600">إنشاء حساب جديد الآن</strong>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8 animate-fade-in">
            
            {/* Active Student Profile Header */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-500/20">
                  {currentUser.fullName ? currentUser.fullName[0] : 'ط'}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-extrabold text-emerald-950">
                    طالب مسجل: {currentUser.fullName} ({currentUser.primaryPhone})
                  </p>
                  <p className="text-[11px] text-emerald-700">تم تجهيز وتعبئة بيانات الشحن الخاصة بك تلقائياً</p>
                </div>
              </div>
              <button
                type="button"
                onClick={logoutUser}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 font-bold px-3 py-1.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
                title="تسجيل الخروج أو التبديل لحساب آخر"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">تبديل الحساب</span>
              </button>
            </div>
            
            {/* Section 1: Shipping Information */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Truck size={20} className="text-sky-600" />
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  1. بيانات الشحن والتوصيل (Shipping Details)
                </h2>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الاسم بالكامل للمستلم (Full Name) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد محمد علي"
                    value={shippingDetails.fullName}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm pl-10"
                  />
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

            {/* Academic Grade */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الصف الدراسي (Academic Grade) *
              </label>
              <div className="relative">
                <select
                  required
                  value={shippingDetails.grade}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, grade: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm pl-10 bg-white"
                >
                  <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                  <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                  <option value="الصف الاول الثانوي">الصف الاول الثانوي</option>
                  <option value="بكالوريا">بكالوريا</option>
                </select>
                <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Phone Numbers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم الهاتف الأساسي (Primary Phone) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="01012345678"
                    value={shippingDetails.primaryPhone}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, primaryPhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm pl-10 dir-ltr"
                  />
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">رقم للتواصل مع مندوب الشحن وتأكيد الكود</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم هاتف بديل (Alternate Phone) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="01198765432"
                    value={shippingDetails.altPhone}
                    onChange={(e) => setShippingDetails({ ...shippingDetails, altPhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm pl-10 dir-ltr"
                  />
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">رقم ولي الأمر أو هاتف بديل للطوارئ</span>
              </div>
            </div>

            {/* Detailed Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                العنوان بالتفصيل (Detailed Address) *
              </label>
              <div className="relative">
                <textarea
                  required
                  rows={2}
                  placeholder="المحافظة، الحي/المدينة، اسم الشارع، رقم العمارة، الدور، ورقم الشقة أو علامة مميزة"
                  value={shippingDetails.address}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm pl-10"
                />
                <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
              </div>
            </div>

            {/* Order Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ملاحظات إضافية على الطلب (Order Notes - اختياري)
              </label>
              <input
                type="text"
                placeholder="مثال: يرجى التسليم بعد الساعة 3 عصراً لانتهاء الدروس، أو الاتصال قبل الوصول"
                value={shippingDetails.notes}
                onChange={(e) => setShippingDetails({ ...shippingDetails, notes: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            {/* Shipping Method Options */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2.5">
                {isOnlyTeacherCodes ? 'طريقة الاستلام والتسليم:' : 'اختر وسيلة الشحن المناسبة:'}
              </label>

              {isOnlyTeacherCodes ? (
                <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/70 shadow-sm flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
                    <Zap size={20} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="text-sm font-black text-slate-800">
                        تسليم رقمي فوري لأكواد الدروس والمنصات (بدون خدمة شحن)
                      </div>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                        مجاناً (0 ج.م)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      طلبك يحتوي على أكواد منصات فقط، ولا توجد أي مصاريف أو خدمة شحن. سيتم إرسال الكود فورياً عبر الواتساب فور مراجعة الإيصال.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Standard Shipping */}
                  <div
                    onClick={() => setShippingMethod('Standard')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      shippingMethod === 'Standard'
                        ? 'border-sky-500 bg-sky-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-sky-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-black text-slate-800">{theme?.standardShippingName || 'الشحن القياسي (Standard)'}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{theme?.standardShippingTime || 'التوصيل خلال يومين إلى 10 أيام عمل'}</div>
                      </div>
                      <span className="text-sm font-extrabold text-sky-700">{standardCost} ج.م</span>
                    </div>
                    <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
                      <Check size={12} className="text-sky-500" />
                      <span>لجميع محافظات مصر</span>
                    </div>
                  </div>

                  {/* Express Shipping */}
                  <div
                    onClick={() => setShippingMethod('Express')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                      shippingMethod === 'Express'
                        ? 'border-sky-500 bg-sky-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-sky-200'
                    }`}
                  >
                    <span className="absolute top-0 left-0 bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-br-lg uppercase">
                      توصيل فائق السرعة ⚡
                    </span>
                    <div className="flex items-start justify-between mt-1">
                      <div>
                        <div className="text-sm font-black text-slate-800">{theme?.expressShippingName || 'شحن صاروخ (Express Rocket)'}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{theme?.expressShippingTime || 'خلال يوم إلى 3 أيام فقط'}</div>
                      </div>
                      <span className="text-sm font-extrabold text-sky-700">{expressCost} ج.م</span>
                    </div>
                    <div className="mt-3 text-[11px] text-amber-700 font-bold flex items-center gap-1">
                      <Zap size={12} />
                      <span>أولوية التجهيز والشحن المباشر</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* ========================================================
              Section 2: Payment Section (CRUCIAL: Vodafone Cash ONLY here)
             ======================================================== */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-200 shadow-md space-y-5 relative overflow-hidden">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                  VF
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  2. الدفع عبر فودافون كاش (Vodafone Cash)
                </h2>
              </div>
              <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                الدفع المعتمد الوحيد
              </span>
            </div>

            {/* Instruction Notice Box */}
            <div className="p-4 bg-gradient-to-br from-rose-50/80 to-sky-50/60 rounded-2xl border border-rose-200/70 space-y-3">
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                يرجى تحويل المبلغ الإجمالي <strong className="text-rose-600 text-base">({grandTotal} ج.م)</strong> عبر محفظة فودافون كاش إلى الرقم المعتمد أدناه، ثم رفع صورة إيصال التحويل (Screenshot) لتأكيد حجزك:
              </p>

              {/* Highlighted Vodafone Cash Number Box */}
              <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-inner">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block">رقم تحويل فودافون كاش (Vodafone Cash):</span>
                  <span className="text-xl sm:text-2xl font-black text-rose-600 font-mono tracking-wider dir-ltr inline-block">
                    {VODAFONE_CASH_NUMBER}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="btn btn-sm btn-secondary flex items-center gap-1.5"
                >
                  {copiedNumber ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span className="text-emerald-700 font-bold">تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>نسخ الرقم</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-slate-500 leading-normal">
                * يمكنك التحويل من أي محفظة إلكترونية (فودافون كاش، أورنج كاش، اتصالات، وي باي، إنستاباي، أو محفظة بنكية).
              </div>
            </div>

            {/* Receipt Upload Box */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                إرفاق لقطة شاشة إيصال التحويل (Payment Screenshot Receipt) *
              </label>

              {receiptImage ? (
                /* Uploaded Thumbnail Preview */
                <div className="p-4 bg-emerald-50/70 border-2 border-dashed border-emerald-300 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={receiptImage}
                      alt="Payment Receipt Preview"
                      className="w-16 h-16 object-cover rounded-xl border border-emerald-200 shadow-sm"
                    />
                    <div>
                      <span className="text-xs font-bold text-emerald-800 block">
                        تم إرفاق الإيصال بنجاح ✔
                      </span>
                      <span className="text-[11px] text-slate-500 truncate max-w-xs block">
                        {receiptFileName}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setReceiptImage(null);
                      setReceiptFileName('');
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-100 rounded-xl transition-colors"
                    title="حذف وتغيير الصورة"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ) : (
                /* File Input Area */
                <div className="space-y-2">
                  <label className="border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/40 hover:bg-sky-50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group text-center">
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Upload size={22} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      اضغط هنا لرفع صورة الإيصال (PNG, JPG, JPEG)
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      أو اسحب وأفلت لقطة الشاشة هنا
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {/* Quick Simulation Option for testing */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleSimulateReceipt}
                      className="text-[11px] text-sky-600 font-bold hover:underline bg-sky-50 px-3 py-1 rounded-lg border border-sky-200"
                    >
                      ⚡ تجربة رفع إيصال تحويل تجريبي فوري (Demo Simulation)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Order Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary py-4 text-base font-extrabold rounded-2xl shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <span>جاري تسجيل وتأكيد الطلب...</span>
                ) : (
                  <>
                    <span>تأكيد حجز الطلب ({grandTotal} ج.م)</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>

          </div>

        </form>
        )}

      </div>

    </div>
  );
};
