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
  Bell,
  Palette
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Count pending review orders
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending Review').length;

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
    { path: '/admin/team', label: 'فريق العمل والصلاحيات', labelEn: 'Team Staff', icon: <Users size={19} /> },
    { path: '/admin/theme', label: 'تخصيص المظهر والخطوط', labelEn: 'Theme Customizer', icon: <Palette size={19} /> },
  ];

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
