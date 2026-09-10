import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  KeyRound, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  ArrowRight,
  TrendingUp,
  Star,
  Search,
  Package,
  PackageCheck,
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { FAQSection } from '../components/FAQSection';

// Order status config (mirrors AdminOrders)
const ORDER_STATUSES = [
  { id: 'Preparing',  label: 'قيد التحضير',  emoji: '⏳', color: 'text-amber-500',  bg: 'bg-amber-500/10 border-amber-500/30'   },
  { id: 'Ready',      label: 'تم التحضير',   emoji: '📦', color: 'text-sky-400',    bg: 'bg-sky-500/10 border-sky-500/30'     },
  { id: 'Shipped',    label: 'تم الشحن',      emoji: '🚚', color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30'    },
  { id: 'Delivered',  label: 'تم التسليم',   emoji: '✅', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  { id: 'Cancelled',  label: 'ملغي',          emoji: '✖️',  color: 'text-rose-400',   bg: 'bg-rose-500/10 border-rose-500/30'    },
];

const OrderTracker = () => {
  const { orders } = useStore();
  const [trackId, setTrackId] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    const id = trackId.trim().toUpperCase();
    const found = orders.find(o => o.id.toUpperCase() === id);
    if (found) {
      setResult(found);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const statusInfo = result ? ORDER_STATUSES.find(s => s.id === result.status) : null;
  const statusIndex = statusInfo ? ORDER_STATUSES.findIndex(s => s.id === result?.status) : -1;

  return (
    <section id="track-order" className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container max-w-2xl">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-400 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border border-sky-500/20">
            <Package size={15} />
            <span>تتبع طلبك فوراً</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            اعرف حالة طلبك لحظة بلحظة
          </h2>
          <p className="text-slate-400 text-sm">
            ادخل كود الأوردر المكون من حروف TRK وأرقام الموجود في رسالة تأكيد طلبك
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleTrack} className="flex gap-3">
          <input
            type="text"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            placeholder="مثال: TRK-12345"
            className="flex-1 px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-white/40 text-base focus:outline-none focus:border-sky-400 transition-all"
            dir="ltr"
          />
          <button
            type="submit"
            className="px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-white font-black rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-sky-500/25 hover:scale-105"
          >
            <Search size={18} />
            <span>تتبع</span>
          </button>
        </form>

        {/* Not Found */}
        {notFound && (
          <div className="mt-6 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center">
            <p className="text-rose-300 font-bold">❌ لم يتم العثور على طلب بهذا الكود</p>
            <p className="text-slate-400 text-xs mt-1">تأكد من كتابة الكود بشكل صحيح مثل: TRK-12345</p>
          </div>
        )}

        {/* Result */}
        {result && statusInfo && (
          <div className="mt-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 space-y-5 animate-fade-in">
            {/* Order ID + Date */}
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sky-400 text-lg">{result.id}</span>
              <span className="text-xs text-slate-400">{new Date(result.createdAt).toLocaleDateString('ar-EG')}</span>
            </div>

            {/* Status Card */}
            <div className={`p-4 rounded-2xl border ${statusInfo.bg} text-center`}>
              <div className="text-4xl mb-2">{statusInfo.emoji}</div>
              <div className={`text-xl font-black ${statusInfo.color}`}>{statusInfo.label}</div>
              <div className="text-slate-400 text-xs mt-1">حالة طلبك الحالية</div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                {ORDER_STATUSES.filter(s => s.id !== 'Cancelled').map((s, i) => (
                  <span key={s.id} className={i <= statusIndex && result.status !== 'Cancelled' ? statusInfo.color : 'text-slate-600'}>
                    {s.emoji}
                  </span>
                ))}
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ 
                    width: result.status === 'Cancelled' ? '100%' : 
                           `${Math.min(100, ((statusIndex) / 3) * 100)}%`,
                    background: result.status === 'Cancelled' ? '#ef4444' : undefined
                  }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>قيد التحضير</span>
                <span>تم التحضير</span>
                <span>تم الشحن</span>
                <span>تم التسليم</span>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-xl">
                <span className="text-slate-400 block">اسم العميل</span>
                <strong className="text-white">{result.customer.fullName}</strong>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl">
                <span className="text-slate-400 block">الإجمالي</span>
                <strong className="text-white">{result.grandTotal} ج.م</strong>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl col-span-2">
                <span className="text-slate-400 block">طريقة الشحن</span>
                <strong className="text-white">{result.shippingMethod}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export const HomePage = () => {
  const { products, theme } = useStore();
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const normalizeGrade = (g) => {
    if (!g) return '';
    if (g.includes('3rd') || g.includes('الثالث') || g.includes('ثانوية عامة')) return '3rd';
    if (g.includes('2nd') || g.includes('الثاني') || g.includes('تانية')) return '2nd';
    if (g.includes('1st') || g.includes('الأول') || g.includes('الاول') || g.includes('أولى')) return '1st';
    if (g.includes('Baccalaureate') || g.includes('بكالوريا')) return 'bac';
    return g;
  };

  const grades = [
    { id: 'All', label: 'جميع الصفوف' },
    { id: '3rd Secondary', label: 'الصف الثالث الثانوي' },
    { id: '2nd Secondary', label: 'الصف الثاني الثانوي' },
    { id: '1st Secondary', label: 'الصف الاول الثانوي' },
    { id: 'Baccalaureate', label: 'بكالوريا' },
  ];

  const filteredProducts = products.filter(item => {
    const matchesGrade = selectedGrade === 'All' || item.grade === 'All Grades' || normalizeGrade(item.grade) === normalizeGrade(selectedGrade);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesGrade && matchesCategory;
  });

  const featuredTeacherCodes = products.filter(p => p.category === 'Teacher Codes').slice(0, 4);
  const featuredNotebooks = products.filter(p => p.category === 'Notebooks').slice(0, 4);

  return (
    <div className="home-page space-y-16 pb-12">
      
      {/* Hero Section */}
      {theme?.showHero !== false && (
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-100/70 via-white to-sky-50/40 pt-12 pb-20 border-b border-sky-100">
          
          {/* Background decorative glow circles */}
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-10 right-10 w-80 h-80 bg-sky-200/25 rounded-full blur-2xl pointer-events-none" />

          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              
              {/* Target Audience Badge */}
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-sky-700 shadow-sm border border-sky-200 animate-fade-in">
                <GraduationCap size={18} className="text-sky-500" />
                <span>{theme?.heroBadge || 'الوجهة الرسمية لطلبة الثانوية العامة والبكالوريا في مصر 🎓'}</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                {theme?.heroTitle || 'كل ما تحتاجه للثانوية في مكان واحد مع'}{' '}
                <span 
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: `linear-gradient(135deg, ${theme?.primaryColor || '#0284c7'}, ${theme?.accentColor || '#00BFFF'})` }}
                >
                  {theme?.heroHighlight || 'Torke Store'}
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                {theme?.heroSubtitle || 'كتبك الخارجية المعتمدة، كشاكيل التلخيص بنظام كورنيل، وأكواد شحن منصات كبار مدرسي مصر بتوصيل صاروخي لباب بيتك!'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link 
                  to="/products" 
                  className="btn btn-primary btn-lg shadow-xl shadow-sky-500/25 hover:scale-105"
                  style={{ borderRadius: theme?.borderRadius || '16px' }}
                >
                  <span>{theme?.heroCtaPrimary || 'تصفح كل المنتجات الآن'}</span>
                  <ArrowRight size={20} />
                </Link>
                <Link 
                  to="/products?category=Teacher%20Codes" 
                  className="btn btn-secondary btn-lg"
                  style={{ borderRadius: theme?.borderRadius || '16px' }}
                >
                  <KeyRound size={20} className="text-sky-500" />
                  <span>{theme?.heroCtaSecondary || 'أكواد المنصات الفورية'}</span>
                </Link>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm text-slate-700 font-semibold border-t border-sky-100/80">
                <div className="flex items-center justify-center gap-2">
                  <Truck className="text-sky-500" size={18} />
                  <span>{theme?.badge1 || 'شحن صاروخي خلال 24-48 ساعة'}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="text-emerald-500" size={18} />
                  <span>{theme?.badge2 || 'كتب أصلية معتمدة 100%'}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Zap className="text-amber-500" size={18} />
                  <span>{theme?.badge3 || 'تفعيل فوري لأكواد المدرسين'}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="text-sky-500" size={18} />
                  <span>{theme?.badge4 || 'استبدال مجاني في حال أي تلف'}</span>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 3 Main Category Cards */}
      {theme?.showCategories !== false && (
        <section className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Books */}
            <Link
              to="/products?category=Books"
              className="group relative bg-gradient-to-br from-sky-50 to-white p-7 rounded-3xl border border-sky-200/80 shadow-sm hover:shadow-xl hover:border-sky-400 transition-all overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">كتب الثانوية الخارجية</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                المعاصر، الامتحان، نيوتن، والوافي لجميع المواد العلمية والأدبية بالبابل شيت ونماذج الوزارة.
              </p>
              <div className="flex items-center text-xs font-bold text-sky-600 gap-1 group-hover:translate-x-1 transition-transform">
                <span>تصفح الكتب</span>
                <ArrowRight size={14} />
              </div>
            </Link>

            {/* Card 2: Notebooks */}
            <Link
              to="/products?category=Notebooks"
              className="group relative bg-gradient-to-br from-sky-50 to-white p-7 rounded-3xl border border-sky-200/80 shadow-sm hover:shadow-xl hover:border-sky-400 transition-all overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">كشاكيل وملخصات تورك</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                كشاكيل بنظام كورنيل العالمي، ورق 80 جرام لا يشف الحبر، فواصل مواد ملونة، ودفاتر القوانين.
              </p>
              <div className="flex items-center text-xs font-bold text-sky-600 gap-1 group-hover:translate-x-1 transition-transform">
                <span>تصفح الكشاكيل</span>
                <ArrowRight size={14} />
              </div>
            </Link>

            {/* Card 3: Teacher Codes */}
            <Link
              to="/products?category=Teacher%20Codes"
              className="group relative bg-gradient-to-br from-sky-50 to-white p-7 rounded-3xl border border-sky-200/80 shadow-sm hover:shadow-xl hover:border-sky-400 transition-all overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-700 text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform">
                <KeyRound size={28} />
              </div>
              <span className="absolute top-4 left-4 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                شحن كود فوري
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">أكواد منصات المدرسين</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                مستر عبد المعبود، د. محمد أيمن، جيو ماجد إمام، مستر رضا الفاروق، ومستر خالد صقر.
              </p>
              <div className="flex items-center text-xs font-bold text-sky-600 gap-1 group-hover:translate-x-1 transition-transform">
                <span>شحن الأكواد</span>
                <ArrowRight size={14} />
              </div>
            </Link>

          </div>
        </section>
      )}

      {/* Main Catalog & Interactive Filtering Section */}
      {theme?.showBestSellers !== false && (
        <section className="container">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-sky-600 text-xs font-extrabold uppercase tracking-wide">
                <TrendingUp size={16} />
                <span>{theme?.bestSellersBadge || 'الأكثر طلباً هذا الأسبوع'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {theme?.bestSellersTitle || 'مستلزمات تفوقك في الثانوية العامة'}
              </h2>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Books', 'Notebooks', 'Teacher Codes'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300'
                  }`}
                >
                  {cat === 'All' ? 'جميع الأقسام' : cat === 'Books' ? 'الكتب' : cat === 'Notebooks' ? 'الكشاكيل' : 'أكواد المدرسين'}
                </button>
              ))}
            </div>
          </div>

          {/* Academic Grade Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
            <span className="text-xs font-bold text-slate-400 whitespace-nowrap pl-2">اختر مرحلتك:</span>
            {grades.map((grade) => (
              <button
                key={grade.id}
                onClick={() => setSelectedGrade(grade.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedGrade === grade.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                }`}
              >
                {grade.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-sky-100">
              <p className="text-base font-bold text-slate-600">لا توجد منتجات مطابقة لهذا الفلتر حالياً.</p>
              <button
                onClick={() => { setSelectedGrade('All'); setSelectedCategory('All'); }}
                className="mt-3 text-xs text-sky-600 font-bold hover:underline"
              >
                إعادة تعيين الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </section>
      )}

      {/* Special Section: Teacher Codes Spotlight */}
      {theme?.showTeacherCodesBanner !== false && (
        <section className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 py-16 text-white relative overflow-hidden">
          <div className="container relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
              <div>
                <span className="text-sky-400 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={15} />
                  <span>{theme?.teacherCodesBadge || 'أكواد المنصات التعليمية الرسمية'}</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {theme?.teacherCodesTitle || 'اشحن رصيد منصات كبار المدرسين في دقائق'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
                  {theme?.teacherCodesSubtitle || 'لا داعي للانتظار في السنتر أو مشاكل الدفع الإلكتروني. اختر المدرس، أتمم طلبك، واستلم كود التفعيل الفوري مع الدعم الفني.'}
                </p>
              </div>
              <Link
                to="/products?category=Teacher%20Codes"
                className="btn bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm rounded-xl px-5 py-3 shadow-lg shadow-sky-500/30 flex-shrink-0"
              >
                عرض جميع المدرسين
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTeacherCodes.map((product) => (
                <div key={product.id} className="bg-slate-800/80 rounded-2xl border border-slate-700 p-4 flex flex-col justify-between hover:border-sky-400 transition-all">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-sky-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {product.subject}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-2">{product.title}</h4>
                  <p className="text-xs text-sky-400 font-semibold mt-1">المنصة: {product.platform || product.teacher}</p>
                  <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-lg font-black text-white">{product.price} ج.م</span>
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-sm bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold"
                    >
                      شحن الكود
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Order Tracking Section */}
      <OrderTracker />

      {/* Interactive FAQ Section */}
      {theme?.showFaq !== false && (
        <FAQSection />
      )}

    </div>
  );
};
