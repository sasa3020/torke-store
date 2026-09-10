import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, Search, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const ProductsPage = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('category') || 'All';
  const initialSubCat = searchParams.get('subCategory') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialSubCat);
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
    if (searchParams.get('subCategory')) {
      setSelectedSubCategory(searchParams.get('subCategory'));
    }
    if (searchParams.get('q')) {
      setSearchQuery(searchParams.get('q'));
    }
  }, [searchParams]);

  // Subcategories mapping
  const subCategoryOptions = {
    'Notebooks': ['Wirebound Notebooks', 'Lecture Revision Pads', 'Grid & Graph Notes', 'Pocket Formula Summaries'],
    'Books': ['3rd Secondary (Thanaweya Amma)', '2nd Secondary', '1st Secondary', 'French & Languages / Baccalaureate'],
    'Teacher Codes': ['Physics / فيزياء', 'Chemistry / كيمياء', 'Biology / أحياء', 'Geology / جيولوجيا', 'Arabic / لغة عربية', 'Math / رياضيات']
  };

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
    { id: 'Baccalaureate', label: 'بكالوريا' }
  ];

  // Filtering Logic
  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSubCategory = selectedSubCategory === 'All' || p.subCategory === selectedSubCategory;
    const matchGrade = selectedGrade === 'All' || p.grade === 'All Grades' || normalizeGrade(p.grade) === normalizeGrade(selectedGrade);
    const matchSearch = !searchQuery.trim() || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.titleEn && p.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.teacher && p.teacher.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.subject && p.subject.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchSubCategory && matchGrade && matchSearch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.reviewsCount || 0) - (a.reviewsCount || 0); // popular default
  });

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setSelectedGrade('All');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="container py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            كتالوج منتجات متجر تورك
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            كتب، كشاكيل مراجعة، وأكواد مدرسي الثانوية المعتمدة ({sortedProducts.length} منتج متاح)
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden btn btn-secondary btn-sm flex items-center gap-1.5"
          >
            <Filter size={15} />
            <span>الفلاتر</span>
          </button>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700">
            <ArrowUpDown size={14} className="text-sky-500" />
            <span>ترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-none bg-transparent outline-none font-bold text-sky-700 cursor-pointer"
            >
              <option value="popular">الأكثر شهرة وتقييماً</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Sidebar + Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className={`md:block ${mobileFiltersOpen ? 'block' : 'hidden'} bg-white p-5 rounded-2xl border border-sky-100 shadow-sm space-y-6 md:sticky md:top-24`}>
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <SlidersHorizontal size={16} className="text-sky-500" />
              <span>فلاتر البحث والتصنيف</span>
            </div>
            {(selectedCategory !== 'All' || selectedSubCategory !== 'All' || selectedGrade !== 'All' || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-500 hover:underline font-bold"
              >
                مسح الكل
              </button>
            )}
          </div>

          {/* Search within page */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">بحث بالاسم أو المدرس</label>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs pl-8"
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">القسم الرئيسي</label>
            <div className="space-y-1.5 text-xs font-medium">
              {['All', 'Books', 'Notebooks', 'Teacher Codes'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedSubCategory('All');
                  }}
                  className={`w-full text-right px-3 py-2 rounded-xl transition-all ${
                    selectedCategory === cat
                      ? 'bg-sky-500 text-white font-bold'
                      : 'text-slate-600 hover:bg-sky-50'
                  }`}
                >
                  {cat === 'All' ? 'جميع الأقسام' : cat === 'Books' ? 'الكتب الخارجية (Books)' : cat === 'Notebooks' ? 'كشاكيل وملخصات تورك' : 'أكواد المنصات والمدرسين'}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategories if category selected */}
          {selectedCategory !== 'All' && subCategoryOptions[selectedCategory] && (
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2">التصنيف الفرعي</label>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedSubCategory('All')}
                  className={`w-full text-right px-3 py-1.5 rounded-lg ${
                    selectedSubCategory === 'All' ? 'font-bold text-sky-600 bg-sky-50' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  • عرض كل التصنيفات الفرعية
                </button>
                {subCategoryOptions[selectedCategory].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`w-full text-right px-3 py-1.5 rounded-lg ${
                      selectedSubCategory === sub ? 'font-bold text-sky-600 bg-sky-50' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    • {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grade / Year Filter */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-2">المرحلة الدراسية</label>
            <div className="space-y-1.5 text-xs">
              {grades.map((g) => (
                <label key={g.id} className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900">
                  <input
                    type="radio"
                    name="gradeFilter"
                    checked={selectedGrade === g.id}
                    onChange={() => setSelectedGrade(g.id)}
                    className="text-sky-500 focus:ring-sky-400"
                  />
                  <span>{g.label}</span>
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* Product Grid Area */}
        <main className="md:col-span-3 space-y-6">
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-sky-100 p-12 text-center space-y-3">
              <p className="text-base font-bold text-slate-700">لم يتم العثور على نتائج تطابق معايير البحث.</p>
              <p className="text-xs text-slate-400">جرب البحث بكلمة أخرى أو إعادة تعيين الفلاتر.</p>
              <button onClick={resetFilters} className="btn btn-secondary btn-sm mt-2">
                عرض جميع المنتجات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};
