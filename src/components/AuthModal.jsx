import React, { useState } from 'react';
import { X, User, Phone, MapPin, GraduationCap, Lock, LogIn, UserPlus, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    registerUser, 
    loginUser 
  } = useStore();

  const [formData, setFormData] = useState({
    fullName: '',
    primaryPhone: '',
    altPhone: '',
    address: '',
    grade: 'الصف الثالث الثانوي',
    password: '',
    email: ''
  });

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!formData.fullName.trim()) {
      setErrorMsg('يرجى كتابة الاسم بالكامل');
      return;
    }
    if (!formData.primaryPhone.trim() || formData.primaryPhone.length < 10) {
      setErrorMsg('يرجى إدخال رقم هاتف أساسي صحيح');
      return;
    }
    if (!formData.altPhone.trim()) {
      setErrorMsg('يرجى إدخال رقم هاتف بديل (للطوارئ أو ولي الأمر)');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg('يرجى إدخال العنوان بالتفصيل (المحافظة، المنطقة، الشارع، رقم العقار والشقة)');
      return;
    }
    if (!formData.password || formData.password.length < 4) {
      setErrorMsg('كلمة المرور يجب أن لا تقل عن 4 خانات');
      return;
    }

    const result = registerUser(formData);
    if (result.success) {
      setSuccessMsg('تم إنشاء حساب الطالب بنجاح وحفظ بياناتك!');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMsg('');
      }, 1000);
    } else {
      setErrorMsg(result.message || 'تعذر إنشاء الحساب');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('يرجى إدخال رقم الهاتف أو البريد الإلكتروني');
      return;
    }

    const result = loginUser(loginIdentifier, loginPassword);
    if (result.success) {
      setSuccessMsg('أهلاً بك مجدداً في متجر تورك!');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMsg('');
      }, 800);
    } else {
      setErrorMsg(result.message || 'بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header Tabs */}
        <div className="bg-sky-50 border-b border-sky-100 p-4 flex items-center justify-between">
          <div className="flex bg-white p-1 rounded-xl border border-sky-200">
            <button
              onClick={() => { setAuthModalMode('login'); setErrorMsg(''); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                authModalMode === 'login'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-sky-600'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => { setAuthModalMode('register'); setErrorMsg(''); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                authModalMode === 'register'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-sky-600'
              }`}
            >
              طالب جديد (تسجيل)
            </button>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold flex items-center gap-2">
              <Check size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {authModalMode === 'register' ? (
            /* --- REGISTRATION FORM (Full student profile requirements) --- */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">تسجيل حساب طالب جديد</h3>
                  <p className="text-xs text-slate-500">احفظ بيانات التوصيل لتصلك شحناتك بأسرع وقت</p>
                </div>
                <button
                  type="button"
                  onClick={fillDemoStudent}
                  className="text-[11px] font-bold text-sky-600 hover:underline bg-sky-50 px-2 py-1 rounded-md"
                >
                  ⚡ تجربة بيانات جاهزة
                </button>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الاسم بالكامل (Full Name) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد محمد علي"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm pl-10"
                  />
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Phone Numbers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الهاتف الأساسي *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="01012345678"
                      value={formData.primaryPhone}
                      onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm pl-10 dir-ltr"
                    />
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم هاتف بديل (ولي الأمر) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="01198765432"
                      value={formData.altPhone}
                      onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm pl-10 dir-ltr"
                    />
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Detailed Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  العنوان بالتفصيل (Detailed Address) *
                </label>
                <div className="relative">
                  <textarea
                    required
                    rows={2}
                    placeholder="المحافظة، الحي/المنطقة، اسم الشارع، رقم العمارة والدور والشقة"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm pl-10"
                  />
                  <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                </div>
              </div>

              {/* Academic Grade / Year */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  السنة الدراسية (Academic Grade / Year) *
                </label>
                <div className="relative">
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white pl-10"
                  >
                    <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                    <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                    <option value="الصف الاول الثانوي">الصف الاول الثانوي</option>
                    <option value="بكالوريا">بكالوريا</option>
                  </select>
                  <GraduationCap size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  كلمة المرور (Password) *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm pl-10"
                  />
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary py-3 rounded-xl font-bold text-sm shadow-md"
              >
                <UserPlus size={18} />
                <span>حفظ البيانات وإنشاء الحساب</span>
              </button>
            </form>
          ) : (
            /* --- LOGIN FORM --- */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">تسجيل الدخول للطالب</h3>
                <p className="text-xs text-slate-500">أدخل رقم الهاتف المسجل للدخول ومتابعة طلباتك</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الهاتف أو البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="01012345678 أو email@example.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm pl-10"
                  />
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type="password"
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
                className="w-full btn btn-primary py-3 rounded-xl font-bold text-sm shadow-md"
              >
                <LogIn size={18} />
                <span>دخول إلى حسابي</span>
              </button>

              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <span className="text-xs text-slate-500 ml-1">طالب جديد في متجر تورك؟</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('register');
                    setErrorMsg('');
                  }}
                  className="text-xs text-sky-600 font-bold hover:underline"
                >
                  إنشاء حساب طالب الآن
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
