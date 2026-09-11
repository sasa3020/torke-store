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
  Mail,
  ArrowLeft,
  Crown,
  Code2,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

// Role badge colors & icons
const ROLE_META = {
  'Super Admin':       { color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',   icon: <Crown size={11} /> },
  'Developer':         { color: 'bg-violet-500/20 text-violet-300 border-violet-500/30', icon: <Code2 size={11} /> },
  'Management':        { color: 'bg-sky-500/20 text-sky-300 border-sky-500/30',           icon: <Briefcase size={11} /> },
  'Sales':             { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: <TrendingUp size={11} /> },
  'Order Manager':     { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',        icon: <ShoppingBag size={11} /> },
  'Catalog Specialist':{ color: 'bg-orange-500/20 text-orange-300 border-orange-500/30',  icon: <Package size={11} /> },
  'Customer Support':  { color: 'bg-teal-500/20 text-teal-300 border-teal-500/30',        icon: <Users size={11} /> },
};

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, currentStaff, staffLogin, staffLogout, getStaffPermissions } = useStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Staff Login form state
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError]       = useState('');
  const [isLoggingIn, setIsLoggingIn]     = useState(false);

  // Count pending / preparing orders
  const pendingOrdersCount = orders.filter(o => o.status === 'Preparing' || o.status === 'Pending Review').length;

  // Get current staff permissions
  const perms = currentStaff ? getStaffPermissions(currentStaff.role) : {};
  const roleMeta = currentStaff ? (ROLE_META[currentStaff.role] || ROLE_META['Sales']) : null;

  // All nav items — filtered by role permissions
  const ALL_NAV = [
    { path: '/admin',          label: 'لوحة المؤشرات العامة',      labelEn: 'Dashboard', icon: <LayoutDashboard size={19} />, key: 'dashboard' },
    { path: '/admin/orders',   label: 'إدارة طلبات الطلاب',        labelEn: 'Orders',    icon: <ShoppingBag size={19} />,    key: 'orders',
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { path: '/admin/products', label: 'إدارة المنتجات (CRUD)',      labelEn: 'Products',  icon: <Package size={19} />,        key: 'products' },
    { path: '/admin/pages',    label: 'إدارة صفحات الموقع',        labelEn: 'Pages',     icon: <FileText size={19} />,       key: 'pages' },
    { path: '/admin/team',     label: 'فريق العمل والصلاحيات',     labelEn: 'Team Staff',icon: <Users size={19} />,          key: 'team' },
    { path: '/admin/theme',    label: 'تخصيص المظهر والخطوط',      labelEn: 'Theme',     icon: <Palette size={19} />,        key: 'theme' },
  ];

  const navItems = ALL_NAV.filter(item => perms[item.key]);

  // ── Handle Staff Login ─────────────────────────────────────────────────────
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    setTimeout(() => {
      const result = staffLogin(loginEmail, loginPassword);
      if (!result.success) {
        setLoginError(result.message);
      } else {
        setLoginEmail('');
        setLoginPassword('');
      }
      setIsLoggingIn(false);
    }, 300);
  };

  const handleLogout = () => {
    staffLogout();
    navigate('/admin');
  };

  // ── Access Denied guard for current route ─────────────────────────────────
  const routeKeyMap = {
    '/admin/orders':   'orders',
    '/admin/products': 'products',
    '/admin/pages':    'pages',
    '/admin/team':     'team',
    '/admin/theme':    'theme',
  };
  const currentRouteKey = routeKeyMap[location.pathname];
  const accessDenied = currentStaff && currentRouteKey && !perms[currentRouteKey];

  // ── If NOT Authenticated: Render Staff Login Gate ─────────────────────────
  if (!currentStaff) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-sky-500 selection:text-white relative overflow-hidden font-sans" dir="rtl">

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
                الدخول مخصص لفريق العمل المعتمد فقط — ادخل بريدك وكلمة مرورك
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
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                البريد الإلكتروني (Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@torke.store"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-colors pl-11 dir-ltr text-left"
                  autoComplete="email"
                  autoFocus
                />
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
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
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-colors pl-11 dir-ltr"
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
              <ShieldCheck size={18} />
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
              <span>العودة إلى متجر تركي الرئيسي</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // ── Authenticated Admin Layout ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans" dir="rtl">
      
      {/* Admin Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-l border-slate-800 p-5 space-y-6 flex-shrink-0">
        
        {/* Brand Header */}
        <div className="pb-4 border-b border-slate-800">
          <Link to="/admin" className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white font-bold">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="font-black text-white text-base">Torke <span className="text-sky-400">Admin</span></span>
              <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">لوحة الإدارة المعزولة</p>
            </div>
          </Link>

          {/* Current staff badge */}
          <div className="bg-slate-900 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {currentStaff.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentStaff.name}</p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${roleMeta?.color}`}>
                  {roleMeta?.icon}
                  {currentStaff.role}
                </span>
              </div>
            </div>
          </div>
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

          {/* Locked items for this role */}
          {ALL_NAV.filter(item => !perms[item.key]).map((item) => (
            <div
              key={item.path}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold text-slate-600 cursor-not-allowed select-none"
              title={`${item.labelEn} — ليس لديك صلاحية الدخول`}
            >
              {item.icon}
              <span className="line-through">{item.label}</span>
              <Lock size={11} className="mr-auto text-slate-700" />
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
          <Link
            to="/"
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-400 hover:text-sky-400 hover:bg-slate-900 transition-colors font-semibold"
          >
            <ExternalLink size={16} />
            <span>عرض متجر تركي للطلاب</span>
          </Link>

          <button
            onClick={handleLogout}
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
          <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border ${roleMeta?.color}`}>
            {roleMeta?.icon} {currentStaff.role}
          </span>
          <button
            onClick={handleLogout}
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
          {/* Staff info */}
          <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-slate-900 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold text-xs">
              {currentStaff.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-white">{currentStaff.name}</p>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${roleMeta?.color}`}>
                {roleMeta?.icon} {currentStaff.role}
              </span>
            </div>
          </div>

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

          {/* Locked items */}
          {ALL_NAV.filter(item => !perms[item.key]).map((item) => (
            <div key={item.path} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 cursor-not-allowed">
              {item.icon}
              <span className="line-through">{item.label}</span>
              <Lock size={11} className="mr-auto text-slate-700" />
            </div>
          ))}
        </div>
      )}

      {/* Admin Main Content Container */}
      <main className="flex-1 bg-slate-900 overflow-y-auto p-5 sm:p-8 min-h-screen">
        {accessDenied ? (
          /* Access Denied Screen */
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-5 max-w-sm">
              <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto">
                <Lock size={40} className="text-rose-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white mb-2">صلاحية مرفوضة</h2>
                <p className="text-slate-400 text-sm">
                  رتبتك <span className={`font-bold px-2 py-0.5 rounded border ${roleMeta?.color}`}>{currentStaff.role}</span> لا تملك صلاحية الوصول لهذا القسم.
                </p>
              </div>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <LayoutDashboard size={16} />
                العودة للوحة الرئيسية
              </Link>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>

    </div>
  );
};
