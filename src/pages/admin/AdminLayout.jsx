import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  Palette,
  FileText,
  Lock,
  User,
  AlertCircle,
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Admin Authentication State
  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return localStorage.getItem('torke_admin_auth') === 'true';
  });

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Count pending / preparing orders
  const pendingOrdersCount = orders.filter(o => o.status === 'Preparing' || o.status === 'Pending Review').length;

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const cleanUser = adminUsername.trim().toLowerCase();
    const cleanPass = adminPassword.trim();

    setTimeout(() => {
      if (cleanUser === 'torke' && cleanPass === 'torke506070') {
        localStorage.setItem('torke_admin_auth', 'true');
        setIsAdminAuth(true);
        setLoginError('');
      } else {
        setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة! يرجى التأكد من البيانات.');
      }
      setIsLoggingIn(false);
    }, 300);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('torke_admin_auth');
    setIsAdminAuth(false);
    setAdminUsername('');
    setAdminPassword('');
  };

  const navItems = [
    { path: '/admin', label: 'لوحة المؤشرات العامة', labelEn: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { 
      path: '/admin/orders', 
      label: 'إدارة طلبات الطلاب', 
      labelEn: 'Orders', 
      icon: <ShoppingBag size={19} />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null 
    },
    { path: '/admin/products', label: 'إدارة المنتجات (CRUD)', labelEn: 'Products', icon: <Package size={19} /> },
    { path: '/admin/pages', label: 'إدارة صفحات الموقع', labelEn: 'Pages', icon: <FileText size={19} /> },
    { path: '/admin/team', label: 'فريق العمل والصلاحيات', labelEn: 'Team Staff', icon: <Users size={19} /> },
    { path: '/admin/theme', label: 'تخصيص المظهر والخطوط', labelEn: 'Theme Customizer', icon: <Palette size={19} /> },
  ];

  // ── If NOT Authenticated: Render Admin Login Gate ─────────────────────────
  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-sky-500 selection:text-white relative overflow-hidden font-sans">
        
        {/* Background glowing ambient effects */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-7 sm:p-9 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-sky-500/25">
              <ShieldCheck size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                لوحة تحكم <span className="text-sky-400">Torke Admin</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-semibold">
                منطقة الإدارة المحمية لمتجر تورك لطلبة الثانوية
              </p>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-2xl font-bold flex items-center gap-2.5 animate-fade-in">
              <AlertCircle size={18} className="flex-shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                اسم المستخدم (Username)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="أدخل اسم المستخدم"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-colors pl-11 dir-ltr text-right"
                  autoComplete="username"
                  autoFocus
                />
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                كلمة المرور (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-colors pl-11 dir-ltr text-right"
                  autoComplete="current-password"
                />
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-black py-3.5 rounded-xl text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <KeyRound size={18} />
              <span>{isLoggingIn ? 'جاري التحقق...' : 'دخول لوحة التحكم'}</span>
            </button>
          </form>

          {/* Back to store */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-sky-400 transition-colors"
            >
              <ArrowLeft size={15} />
              <span>العودة إلى متجر الطلاب الرئيسي</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // ── Authenticated Admin Layout ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Admin Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-l border-slate-800 p-5 space-y-6 flex-shrink-0">
        
        {/* Brand Header */}
        <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white font-bold">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="font-black text-white text-base">Torke <span className="text-sky-400">Admin</span></span>
              <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">لوحة الإدارة المعزولة</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
          <Link
            to="/"
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-400 hover:text-sky-400 hover:bg-slate-900 transition-colors font-semibold"
          >
            <ExternalLink size={16} />
            <span>عرض المتجر للطلاب</span>
          </Link>

          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors font-bold text-right"
          >
            <LogOut size={16} />
            <span>تسجيل الخروج من الإدارة</span>
          </button>
        </div>

      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold">
            <ShieldCheck size={18} />
          </div>
          <span className="font-black text-white text-sm">Torke <span className="text-sky-400">Admin</span></span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAdminLogout}
            className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 bg-slate-900 rounded-lg font-bold flex items-center gap-1"
          >
            <LogOut size={13} />
            <span>خروج</span>
          </button>
          <Link to="/" className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-900 rounded-lg">
            المتجر
          </Link>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1.5 text-slate-400 hover:text-white"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileNavOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-900"
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Admin Main Content Container */}
      <main className="flex-1 bg-slate-900 overflow-y-auto p-5 sm:p-8 min-h-screen">
        <Outlet />
      </main>

    </div>
  );
};
