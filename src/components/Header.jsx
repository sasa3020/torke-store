import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Search, 
  ChevronDown, 
  BookOpen, 
  FileText, 
  KeyRound, 
  Menu, 
  X, 
  GraduationCap,
  LogOut,
  Sparkles,
  Palette
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header = () => {
  const { 
    theme,
    cartCount, 
    setIsCartDrawerOpen, 
    currentUser, 
    logoutUser, 
    openLoginModal, 
    openRegisterModal 
  } = useStore();
  
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const categories = [
    theme?.showNavNotebooks !== false && {
      name: theme?.navNotebooksLabel || 'Notebooks',
      originalCat: 'Notebooks',
      labelAr: theme?.navNotebooksLabelAr || 'كشاكيل وملخصات',
      icon: <FileText size={18} className="text-sky-500" />,
      subCategories: [
        { name: 'Wirebound Notebooks', labelAr: 'كشاكيل سلك مقسمة' },
        { name: 'Lecture Revision Pads', labelAr: 'كشاكيل كورنيل والملخصات' },
        { name: 'Grid & Graph Notes', labelAr: 'كشاكيل رسم بياني ومعامل' },
        { name: 'Pocket Formula Summaries', labelAr: 'دفاتر القوانين الجيبية' },
      ]
    },
    theme?.showNavBooks !== false && {
      name: theme?.navBooksLabel || 'Books',
      originalCat: 'Books',
      labelAr: theme?.navBooksLabelAr || 'كتب خارجية',
      icon: <BookOpen size={18} className="text-sky-500" />,
      subCategories: [
        { name: '3rd Secondary (Thanaweya Amma)', labelAr: 'الصف الثالث الثانوي' },
        { name: '2nd Secondary', labelAr: 'الصف الثاني الثانوي' },
        { name: '1st Secondary', labelAr: 'الصف الاول الثانوي' },
        { name: 'French & Languages / Baccalaureate', labelAr: 'بكالوريا' },
      ]
    },
    theme?.showNavCodes !== false && {
      name: theme?.navCodesLabel || 'Teacher Codes',
      originalCat: 'Teacher Codes',
      labelAr: theme?.navCodesLabelAr || 'أكواد المنصات',
      icon: <KeyRound size={18} className="text-sky-500" />,
      badge: theme?.navCodesBadge || 'فوري ⚡',
      subCategories: [
        { name: 'Physics / فيزياء', labelAr: 'فيزياء (مستر عبد المعبود وغيره)' },
        { name: 'Chemistry / كيمياء', labelAr: 'كيمياء (مستر خالد صقر)' },
        { name: 'Biology / أحياء', labelAr: 'أحياء (دكتور محمد أيمن)' },
        { name: 'Geology / جيولوجيا', labelAr: 'جيولوجيا (جيو ماجد إمام)' },
        { name: 'Arabic / لغة عربية', labelAr: 'عربي (مستر رضا الفاروق)' },
        { name: 'Math / رياضيات', labelAr: 'رياضيات بحتة وتطبيقية' },
      ]
    }
  ].filter(Boolean);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleSubCategoryClick = (categoryName, subCatName) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    navigate(`/products?category=${encodeURIComponent(categoryName)}&subCategory=${encodeURIComponent(subCatName)}`);
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header-wrapper sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm" ref={dropdownRef}>
      {/* Top Student Announcement Bar */}
      {theme?.showAnnouncement !== false && (
        <div 
          className="text-white text-xs sm:text-sm py-2 px-4 text-center font-bold flex items-center justify-center gap-2 shadow-sm"
          style={{ background: `linear-gradient(135deg, ${theme?.accentColor || '#00BFFF'}, ${theme?.primaryColor || '#0284c7'})` }}
        >
          <Sparkles size={16} className="animate-pulse text-amber-300" />
          <span>{theme?.announcementText || 'خصومات بداية العام لطلبة الثانوية العامة والبكالوريا! شحن سريع لباب بيتك 🚀'}</span>
        </div>
      )}

      <div className="container">
        <div className="header-content flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div 
              className="w-11 h-11 rounded-xl text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, ${theme?.primaryColor || '#0284c7'}, ${theme?.accentColor || '#00BFFF'})` }}
            >
              <GraduationCap size={24} />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>{theme?.storeName?.split(' ')[0] || 'Torke'}</span>
                <span style={{ color: theme?.primaryColor || '#0284c7' }}>{theme?.storeName?.split(' ')[1] || 'Store'}</span>
              </div>
              <p className="text-[11px] font-bold text-sky-600 tracking-wide">{theme?.storeNameAr || 'متجر طلاب الثانوية'}</p>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          {theme?.showSearchInHeader !== false && (
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative mx-2">
              <input
                type="text"
                placeholder={theme?.searchPlaceholder || "ابحث عن كتاب، كشكول، أو كود مدرس (مثل المعاصر، عبد المعبود)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-sky-200 bg-sky-50/50 text-sm focus:bg-white focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 hover:text-sky-700">
                <Search size={18} />
              </button>
            </form>
          )}

          {/* Desktop Navigation Links & Multi-level Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {theme?.showNavHome !== false && (
              <Link 
                to="/" 
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
              >
                {theme?.navHomeLabel || 'الرئيسية'}
              </Link>
            )}

            {categories.map((cat) => (
              <div key={cat.name} className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === cat.name ? null : cat.name)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                    activeDropdown === cat.name 
                      ? 'bg-sky-100 text-sky-700' 
                      : 'text-slate-700 hover:text-sky-600 hover:bg-sky-50'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.name}</span>
                  {cat.labelAr && <span className="text-xs text-slate-400 font-normal">({cat.labelAr})</span>}
                  {cat.badge && (
                    <span className="bg-sky-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {cat.badge}
                    </span>
                  )}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === cat.name ? 'rotate-180 text-sky-600' : ''}`} />
                </button>

                {/* Subcategory Dropdown */}
                {activeDropdown === cat.name && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-sky-100 py-3 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-sky-600">{cat.name} Categories</span>
                      <Link 
                        to={`/products?category=${encodeURIComponent(cat.originalCat || cat.name)}`}
                        onClick={() => setActiveDropdown(null)}
                        className="text-xs text-sky-500 hover:underline"
                      >
                        عرض الكل
                      </Link>
                    </div>
                    <div className="py-1">
                      {cat.subCategories.map((sub) => (
                        <button
                          key={sub.name}
                          onClick={() => handleSubCategoryClick(cat.originalCat || cat.name, sub.name)}
                          className="w-full text-right px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600 flex flex-col items-start transition-colors"
                        >
                          <span className="font-semibold text-slate-800">{sub.labelAr}</span>
                          <span className="text-[11px] text-slate-400">{sub.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {theme?.showNavAllProducts !== false && (
              <Link 
                to="/products" 
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
              >
                {theme?.navAllProductsLabel || 'كل المنتجات'}
              </Link>
            )}
          </nav>

          {/* User Auth & Cart Buttons */}
          <div className="flex items-center gap-3">
            
            {/* User Profile / Auth */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 text-sm font-semibold transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">{currentUser.fullName}</span>
                  <ChevronDown size={14} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-sky-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{currentUser.fullName}</p>
                      <p className="text-xs text-sky-600 font-medium">{currentUser.grade || 'طالب ثانوية'}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.primaryPhone}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-right px-4 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600 flex items-center justify-between"
                    >
                      <span>حسابي وطلباتي</span>
                      <User size={16} />
                    </Link>
                    <button
                      onClick={() => {
                        logoutUser();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-right px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center justify-between"
                    >
                      <span>تسجيل الخروج</span>
                      <LogOut size={16} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openLoginModal}
                  className="px-3.5 py-1.5 text-sm font-semibold text-sky-700 hover:text-sky-900 rounded-lg hover:bg-sky-50 transition-colors"
                >
                  دخول
                </button>
                <button
                  onClick={openRegisterModal}
                  className="px-3.5 py-1.5 text-sm font-semibold bg-sky-500 hover:bg-sky-600 text-white rounded-lg shadow-sm transition-all"
                >
                  إنشاء حساب
                </button>
              </div>
            )}

            {/* Customize Theme Button */}
            <Link
              to="/customize"
              className="p-2.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 transition-all hover:scale-105"
              title="تخصيص المظهر، الألوان والخطوط (Theme Customizer)"
            >
              <Palette size={20} />
            </Link>

            {/* Cart Drawer Trigger Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 transition-all hover:scale-105"
              aria-label="سلة التسوق"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-sky-600 text-white text-xs font-extrabold flex items-center justify-center animate-bounce shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-sky-600 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-sky-100 py-4 px-2 bg-white animate-fade-in space-y-4">
            {theme?.showSearchInHeader !== false && (
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder={theme?.searchPlaceholder || "ابحث عن كتاب، كشكول، أو كود..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-sky-200 bg-sky-50 text-sm"
                />
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500">
                  <Search size={18} />
                </button>
              </form>
            )}

            <div className="space-y-2">
              {theme?.showNavHome !== false && (
                <Link 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-bold text-slate-800 rounded-lg hover:bg-sky-50"
                >
                  {theme?.navHomeLabel || 'الرئيسية'}
                </Link>
              )}
              {theme?.showNavAllProducts !== false && (
                <Link 
                  to="/products" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-bold text-slate-800 rounded-lg hover:bg-sky-50"
                >
                  {theme?.navAllProductsLabel || 'كل المنتجات'}
                </Link>
              )}

              {categories.map((cat) => (
                <div key={cat.name} className="border-t border-slate-100 pt-2">
                  <div className="px-3 py-1 font-bold text-sky-700 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {cat.icon}
                      <span>{cat.name} {cat.labelAr && `(${cat.labelAr})`}</span>
                    </div>
                    {cat.badge && (
                      <span className="bg-sky-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <div className="pr-4 space-y-1 mt-1">
                    {cat.subCategories.map(sub => (
                      <button
                        key={sub.name}
                        onClick={() => handleSubCategoryClick(cat.originalCat || cat.name, sub.name)}
                        className="w-full text-right px-3 py-1.5 text-xs text-slate-600 hover:text-sky-600 block"
                      >
                        • {sub.labelAr}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
