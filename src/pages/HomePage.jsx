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
  Star
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { FAQSection } from '../components/FAQSection';

export const HomePage = () => {
  const { products, theme } = useStore();
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const grades = [
    { id: 'All', label: 'جميع المراحل (All)' },
    { id: '3rd Secondary', label: 'ثانوية عامة (3rd Sec)' },
    { id: '2nd Secondary', label: 'تانية ثانوي (2nd Sec)' },
    { id: '1st Secondary', label: 'أولى ثانوي (1st Sec)' },
    { id: 'Baccalaureate', label: 'بكالوريا (Baccalaureate)' },
  ];

  const filteredProducts = products.filter(item => {
    const matchesGrade = selectedGrade === 'All' || item.grade === selectedGrade || item.grade === 'All Grades';
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

      {/* Interactive FAQ Section */}
      {theme?.showFaq !== false && (
        <FAQSection />
      )}

    </div>
  );
};
