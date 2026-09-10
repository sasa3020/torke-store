import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  MessageCircle, 
  Send, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Zap, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer = () => {
  const { theme } = useStore();
  return (
    <footer className="bg-slate-900 text-white mt-auto pt-14 pb-8 border-t-4 border-sky-400">
      <div className="container">
        
        {/* Promotional Social Media Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 rounded-2xl p-6 sm:p-8 mb-12 shadow-xl shadow-sky-900/30 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white">
              <Sparkles size={14} className="text-yellow-300 animate-spin" />
              <span>مفاجأة لطلبة الثانوية العامة والبكالوريا</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {theme?.socialPromoTitle || 'Follow us on social media—you might get a free gift with your package! 🌚'}
            </h3>
            
            <p className="text-sm text-sky-50 font-medium">
              {theme?.socialPromoSubtitle || 'تابعنا على صفحاتنا الرسمية وقناة الواتساب لتدخل السحب على هدايا مجانية وملازم حصرية مع كل أوردر!'}
            </p>

            {/* Social Media Link Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={theme?.facebookUrl || 'https://www.facebook.com/share/1GpZ82sdxr/'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white text-sky-700 hover:bg-sky-50 text-sm font-bold shadow-md hover:scale-105 transition-transform"
              >
                <span>فيسبوك (Facebook)</span>
              </a>

              <a
                href={theme?.instagramUrl || 'https://www.instagram.com/torke.stor?igsh=MWxleHRzcmZndm5tNg=='}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white text-pink-600 hover:bg-pink-50 text-sm font-bold shadow-md hover:scale-105 transition-transform"
              >
                <span>إنستجرام (Instagram)</span>
              </a>

              <a
                href={theme?.whatsappChannelUrl || 'https://whatsapp.com/channel/0029VbCCfr9EgGfHFSx37T2X'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-emerald-500 text-white hover:bg-emerald-600 text-sm font-bold shadow-md hover:scale-105 transition-transform"
              >
                <span>قناة الواتساب الرسمية (Channel)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white">
                <GraduationCap size={22} />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Torke <span className="text-sky-400">Store</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              المتجر الأول المتخصص لخدمة طلبة الثانوية العامة والبكالوريا في مصر. نوفر الكتب الخارجية، كشاكيل التلخيص بنظام كورنيل، وأكواد كبار مدرسي المنصات بأسرع توصيل.
            </p>
            <div className="flex items-center gap-4 text-xs text-sky-400 font-semibold pt-1">
              <span className="flex items-center gap-1.5"><Truck size={14} /> شحن لكل محافظات مصر</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> أصلي 100%</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-sky-400">أقسام المتجر</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/products?category=Notebooks" className="hover:text-sky-400 transition-colors">
                  كشاكيل وملخصات تورك
                </Link>
              </li>
              <li>
                <Link to="/products?category=Books" className="hover:text-sky-400 transition-colors">
                  كتب الثانوية العامة والبكالوريا
                </Link>
              </li>
              <li>
                <Link to="/products?category=Teacher%20Codes" className="hover:text-sky-400 transition-colors">
                  أكواد منصات المدرسين الفورية
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-sky-400 transition-colors">
                  عروض الباكدجات المخفضة
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Links & Policy */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-sky-400">خدمة الطلاب</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a href="#faq-section" className="hover:text-sky-400 transition-colors">
                  الأسئلة الشائعة (FAQ)
                </a>
              </li>
              <li>
                <Link to="/profile" className="hover:text-sky-400 transition-colors">
                  متابعة حالة طلبي
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-sky-400 transition-colors">
                  صفحة الدفع والشحن
                </Link>
              </li>
              <li>
                <span className="text-slate-400 text-xs">
                  سياسة الاستبدال: استبدال مجاني فوري في حال وجود أي عيب طباعة.
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-sky-400">تواصل مع الدعم الفني</h4>
            <p className="text-xs text-slate-300">
              فريق الدعم الفني والرد على استفسارات المناهج وأكواد المدرسين متاح يومياً:
            </p>
            
            {/* WhatsApp Contact Button */}
            <a
              href={`https://wa.me/${(theme?.whatsappNumber || '+201515856581').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <MessageCircle size={20} />
              </div>
              <div className="text-right">
                <span className="block text-xs text-emerald-300 font-medium">واتساب الدعم السريع (WhatsApp)</span>
                <span className="block text-base font-extrabold text-white dir-ltr text-left">
                  {theme?.whatsappNumber || '+20 15 15856581'}
                </span>
              </div>
            </a>

            <div className="pt-2 text-[11px] text-slate-500">
              * متاح للمحادثة من 9 صباحاً حتى 11 مساءً طوال أيام الأسبوع.
            </div>
          </div>

        </div>

        {/* Copyright & Discreet Admin Access Link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {theme?.copyrightText || 'Torke Store. All rights reserved. صنع بكل حب لطلبة الثانوية في مصر 🇪🇬'}</p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-slate-400 hover:text-sky-300 font-medium transition-colors">
              بوابة إدارة المتجر (Admin Portal)
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
