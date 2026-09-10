import React, { useState, useRef, useEffect } from 'react';
import {
  Palette,
  Type,
  RotateCcw,
  Save,
  ShoppingBag,
  Eye,
  CheckCircle2,
  ExternalLink,
  Megaphone,
  Zap,
  Share2,
  FileText,
  ChevronDown,
  ChevronUp,
  Globe,
  Truck,
  Phone,
  MessageCircle,
  Star,
  Tag,
  ToggleLeft,
  ToggleRight,
  Link2,
  Menu,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore, DEFAULT_THEME } from '../../context/StoreContext';

// ─── Accordion Section Wrapper ────────────────────────────────────────────────
const Section = ({ id, icon, color, title, subtitle, isOpen, onToggle, children }) => (
  <div className={`rounded-3xl border overflow-hidden transition-all ${isOpen ? 'border-slate-600 shadow-lg' : 'border-slate-700/60'}`}>
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={`w-full flex items-center justify-between p-5 text-right transition-colors ${isOpen ? 'bg-slate-800' : 'bg-slate-800/60 hover:bg-slate-800/90'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-sm font-black text-white">{title}</div>
          {subtitle && <div className="text-[11px] text-slate-400 mt-0.5">{subtitle}</div>}
        </div>
      </div>
      <div className="text-slate-400 flex-shrink-0">
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
    </button>
    {isOpen && (
      <div className="bg-slate-900/50 p-5 space-y-4 border-t border-slate-700">
        {children}
      </div>
    )}
  </div>
);

// ─── Input Field ──────────────────────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-xs font-bold text-slate-300 mb-1.5">{label}</label>
    {hint && <p className="text-[11px] text-slate-500 mb-1.5">{hint}</p>}
    {children}
  </div>
);

const TextInput = ({ value, onChange, placeholder, dir = 'rtl' }) => (
  <input
    type="text"
    value={value || ''}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white text-xs focus:outline-none focus:border-sky-500 transition-colors ${dir === 'ltr' ? 'dir-ltr text-left' : ''}`}
  />
);

const TextareaInput = ({ value, onChange, rows = 2 }) => (
  <textarea
    rows={rows}
    value={value || ''}
    onChange={onChange}
    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white text-xs focus:outline-none focus:border-sky-500 transition-colors resize-none"
  />
);

const NumberInput = ({ value, onChange, min, prefix }) => (
  <div className="flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 focus-within:border-sky-500 transition-colors">
    {prefix && <span className="text-xs text-slate-400 font-bold">{prefix}</span>}
    <input
      type="number"
      value={value || ''}
      onChange={onChange}
      min={min}
      className="flex-1 bg-transparent text-white text-xs focus:outline-none dir-ltr"
    />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const AdminTheme = () => {
  const { theme, updateTheme, resetTheme } = useStore();
  const [formTheme, setFormTheme] = useState(theme);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [openSections, setOpenSections] = useState({ fonts: true });

  const handleToggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const debounceRef = useRef(null);

  // Generic live-update helper with debouncing for text inputs to ensure 100% fluid typing
  const update = (field, value, immediate = false) => {
    const updated = { ...formTheme, [field]: value };
    setFormTheme(updated);
    if (immediate) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      updateTheme(updated);
    } else {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateTheme(updated);
      }, 350);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    updateTheme(formTheme);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('هل تريد استعادة كل الإعدادات الافتراضية؟')) {
      resetTheme();
      setFormTheme(DEFAULT_THEME);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // ── Font Options ─────────────────────────────────────────────────────────
  const fonts = [
    { id: 'Cairo', name: 'كايرو (Cairo)', desc: 'الأكثر شهرة واعتماداً في المواقع العربية' },
    { id: 'Alexandria', name: 'الإسكندرية (Alexandria)', desc: 'خط عصري وجريء يعطي طابعاً احترافياً وفخماً' },
    { id: 'Tajawal', name: 'تجوال (Tajawal)', desc: 'خط انسيابي وناعم ومريح جداً للعين' },
    { id: 'Almarai', name: 'المراعي (Almarai)', desc: 'خط أكاديمي رسمي يناسب بيئة التعليم' },
    { id: 'Readex Pro', name: 'ريديكس برو (Readex Pro)', desc: 'تصميم هندسي متوازن وفائق الحداثة' },
  ];

  // ── Color Palettes ────────────────────────────────────────────────────────
  const palettes = [
    { name: 'سماوي تورك', primary: '#0284c7', accent: '#00BFFF' },
    { name: 'كحلي ملكي', primary: '#1e40af', accent: '#38bdf8' },
    { name: 'فيروزي بحري', primary: '#0891b2', accent: '#06b6d4' },
    { name: 'أخضر زمردي', primary: '#059669', accent: '#10b981' },
    { name: 'بنفسجي علمي', primary: '#7c3aed', accent: '#a855f7' },
    { name: 'ليلي فخم', primary: '#0f172a', accent: '#38bdf8' },
  ];

  // ── Border Radius Options ─────────────────────────────────────────────────
  const radiuses = [
    { id: '8px', label: 'حواف بسيطة' },
    { id: '16px', label: 'عصرية (افتراضي)' },
    { id: '24px', label: 'دائرية ناعمة' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Palette size={16} />
            <span>محرر المظهر الكامل • Visual Theme Customizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">تخصيص شكل ومحتوى المتجر</h1>
          <p className="text-xs text-slate-400 mt-1">تحكم في كل شيء: الخط، الألوان، النصوص، الأسعار، التواصل — مع معاينة حية فورية!</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to="/" target="_blank" className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5">
            <ExternalLink size={14} />
            <span>شاهد المتجر</span>
          </Link>
          <button onClick={handleReset} className="btn btn-sm bg-slate-800 hover:bg-rose-900/60 text-rose-300 font-bold flex items-center gap-1.5">
            <RotateCcw size={14} />
            <span>استعادة</span>
          </button>
        </div>
      </div>

      {/* ── Save Success Banner ────────────────────────────────────────────── */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs rounded-2xl font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>تم حفظ جميع التعديلات وتطبيقها فوراً على كامل المتجر! ✅</span>
        </div>
      )}

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── LEFT: Accordion Form ──────────────────────────────────────────── */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-3">

          {/* ═══════════════════════════════════════════════════════════
              1. FONTS, COLORS & RADIUS
          ═══════════════════════════════════════════════════════════ */}
          <Section
            id="fonts"
            icon={<Type size={18} />}
            color="bg-sky-600"
            title="1. الخط والألوان وشكل الحواف"
            subtitle="تحكم في الهوية البصرية الأساسية للمتجر"
            isOpen={openSections.fonts}
            onToggle={handleToggleSection}
          >
            {/* Font Selector */}
            <Field label="نوع الخط العربي:">
              <div className="space-y-2">
                {fonts.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => update('fontFamily', f.id)}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      formTheme.fontFamily === f.id
                        ? 'border-sky-500 bg-sky-950/40'
                        : 'border-slate-700 bg-slate-900/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          {f.name}
                          {formTheme.fontFamily === f.id && (
                            <span className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px]">✔</span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-400">{f.desc}</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-800 text-xs text-sky-300 font-bold" style={{ fontFamily: `'${f.id}', sans-serif` }}>
                      معاينة: متجر تورك للثانوية العامة والبكالوريا
                    </div>
                  </div>
                ))}
              </div>
            </Field>

            {/* Color Palettes */}
            <Field label="باليتة الألوان الجاهزة:">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {palettes.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      const updated = { ...formTheme, primaryColor: p.primary, accentColor: p.accent };
                      setFormTheme(updated);
                      updateTheme(updated);
                    }}
                    className="p-3 rounded-xl border border-slate-700 bg-slate-900/70 hover:border-sky-400 text-right transition-all group space-y-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: p.primary }} />
                      <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: p.accent }} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-300 group-hover:text-white block">{p.name}</span>
                  </button>
                ))}
              </div>
            </Field>

            {/* Custom Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/50">
              <Field label="اللون الأساسي (Primary):">
                <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-600">
                  <input type="color" value={formTheme.primaryColor || '#0284c7'}
                    onChange={(e) => update('primaryColor', e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0" />
                  <input type="text" value={formTheme.primaryColor || '#0284c7'}
                    onChange={(e) => update('primaryColor', e.target.value)}
                    className="flex-1 bg-transparent text-xs text-white font-mono border-0 outline-none dir-ltr" />
                </div>
              </Field>
              <Field label="لون التأكيد (Accent):">
                <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-600">
                  <input type="color" value={formTheme.accentColor || '#00BFFF'}
                    onChange={(e) => update('accentColor', e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0" />
                  <input type="text" value={formTheme.accentColor || '#00BFFF'}
                    onChange={(e) => update('accentColor', e.target.value)}
                    className="flex-1 bg-transparent text-xs text-white font-mono border-0 outline-none dir-ltr" />
                </div>
              </Field>
            </div>

            {/* Border Radius */}
            <Field label="شكل الحواف:">
              <div className="grid grid-cols-3 gap-2">
                {radiuses.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => update('borderRadius', r.id)}
                    className={`p-3 border-2 cursor-pointer transition-all text-center text-xs font-bold ${
                      formTheme.borderRadius === r.id
                        ? 'border-sky-500 bg-sky-950/40 text-white'
                        : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500'
                    }`}
                    style={{ borderRadius: r.id }}
                  >
                    {r.label}
                  </div>
                ))}
              </div>
            </Field>
          </Section>

          {/* ═══════════════════════════════════════════════════════════
              2. BRAND & IDENTITY
          ═══════════════════════════════════════════════════════════ */}
          <Section
            id="brand"
            icon={<Tag size={18} />}
            color="bg-violet-600"
            title="2. الهوية والبراند"
            subtitle="اسم المتجر، الشعار، وتوصيف الهوية"
            isOpen={openSections.brand}
            onToggle={handleToggleSection}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="اسم المتجر بالإنجليزية:">
                <TextInput value={formTheme.storeName} onChange={(e) => update('storeName', e.target.value)} dir="ltr" />
              </Field>
              <Field label="اسم المتجر بالعربية:">
                <TextInput value={formTheme.storeNameAr} onChange={(e) => update('storeNameAr', e.target.value)} />
              </Field>
              <Field label="نص الشعار (الجزء الأول):">
                <TextInput value={formTheme.logoText} onChange={(e) => update('logoText', e.target.value)} dir="ltr" placeholder="Torke" />
              </Field>
              <Field label="نص الشعار (الجزء المميز):">
                <TextInput value={formTheme.logoHighlight} onChange={(e) => update('logoHighlight', e.target.value)} dir="ltr" placeholder="Store" />
              </Field>
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════════
              3. HEADER & NAVIGATION BAR (شريط التنقل العلوي والقوائم)
          ═══════════════════════════════════════════════════════════ */}
          <Section
            id="header_nav"
            icon={<Menu size={18} />}
            color="bg-cyan-600"
            title="3. شريط التنقل العلوي والقوائم (Header & Navigation)"
            subtitle="تعديل نصوص القوائم، الكشاكيل، الكتب، أكواد المنصات، والبحث"
            isOpen={openSections.header_nav}
            onToggle={handleToggleSection}
          >
            {/* Search Bar Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-800 rounded-2xl border border-slate-700">
              <div>
                <p className="text-xs font-bold text-white">شريط البحث في الهيدر</p>
                <p className="text-[11px] text-slate-400">إظهار أو إخفاء حقل البحث السريع للطلاب في القائمة العلوية</p>
              </div>
              <button
                type="button"
                onClick={() => update('showSearchInHeader', formTheme.showSearchInHeader === false ? true : false)}
                className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                  formTheme.showSearchInHeader !== false
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-700 text-slate-400 border border-slate-600'
                }`}
              >
                {formTheme.showSearchInHeader !== false ? (
                  <><ToggleRight size={18} /><span>مفعّل</span></>
                ) : (
                  <><ToggleLeft size={18} /><span>معطّل</span></>
                )}
              </button>
            </div>

            <Field label="نص توجيه البحث (Search Placeholder):">
              <TextInput 
                value={formTheme.searchPlaceholder} 
                onChange={(e) => update('searchPlaceholder', e.target.value)} 
                placeholder="ابحث عن كتاب، كشكول، أو كود مدرس (مثل المعاصر، عبد المعبود)..." 
              />
            </Field>

            {/* Nav Home Link */}
            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">رابط الصفحة الرئيسية</span>
                <button
                  type="button"
                  onClick={() => update('showNavHome', formTheme.showNavHome === false ? true : false)}
                  className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                    formTheme.showNavHome !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {formTheme.showNavHome !== false ? 'ظاهر' : 'مخفي'}
                </button>
              </div>
              <Field label="نص زر الرئيسية:">
                <TextInput value={formTheme.navHomeLabel} onChange={(e) => update('navHomeLabel', e.target.value)} placeholder="الرئيسية" />
              </Field>
            </div>

            {/* Nav Notebooks */}
            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">قسم الكشاكيل والملخصات (Notebooks)</span>
                <button
                  type="button"
                  onClick={() => update('showNavNotebooks', formTheme.showNavNotebooks === false ? true : false)}
                  className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                    formTheme.showNavNotebooks !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {formTheme.showNavNotebooks !== false ? 'ظاهر' : 'مخفي'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="الاسم بالإنجليزية (أو الرئيسي):">
                  <TextInput value={formTheme.navNotebooksLabel} onChange={(e) => update('navNotebooksLabel', e.target.value)} placeholder="Notebooks" dir="ltr" />
                </Field>
                <Field label="التسمية التوضيحية بالعربية:">
                  <TextInput value={formTheme.navNotebooksLabelAr} onChange={(e) => update('navNotebooksLabelAr', e.target.value)} placeholder="كشاكيل وملخصات" />
                </Field>
              </div>
            </div>

            {/* Nav Books */}
            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">قسم الكتب الخارجية (Books)</span>
                <button
                  type="button"
                  onClick={() => update('showNavBooks', formTheme.showNavBooks === false ? true : false)}
                  className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                    formTheme.showNavBooks !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {formTheme.showNavBooks !== false ? 'ظاهر' : 'مخفي'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="الاسم بالإنجليزية (أو الرئيسي):">
                  <TextInput value={formTheme.navBooksLabel} onChange={(e) => update('navBooksLabel', e.target.value)} placeholder="Books" dir="ltr" />
                </Field>
                <Field label="التسمية التوضيحية بالعربية:">
                  <TextInput value={formTheme.navBooksLabelAr} onChange={(e) => update('navBooksLabelAr', e.target.value)} placeholder="كتب خارجية" />
                </Field>
              </div>
            </div>

            {/* Nav Teacher Codes */}
            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">قسم أكواد المنصات والمدرسين (Teacher Codes)</span>
                <button
                  type="button"
                  onClick={() => update('showNavCodes', formTheme.showNavCodes === false ? true : false)}
                  className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                    formTheme.showNavCodes !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {formTheme.showNavCodes !== false ? 'ظاهر' : 'مخفي'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="الاسم بالإنجليزية:">
                  <TextInput value={formTheme.navCodesLabel} onChange={(e) => update('navCodesLabel', e.target.value)} placeholder="Teacher Codes" dir="ltr" />
                </Field>
                <Field label="التسمية التوضيحية بالعربية:">
                  <TextInput value={formTheme.navCodesLabelAr} onChange={(e) => update('navCodesLabelAr', e.target.value)} placeholder="أكواد المنصات" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="نص الشارة المميزة (Badge):" hint="النص في الشارة الملونة بجانب اسم القسم (مثل فوري ⚡)">
                    <TextInput value={formTheme.navCodesBadge} onChange={(e) => update('navCodesBadge', e.target.value)} placeholder="فوري ⚡" />
                  </Field>
                </div>
              </div>
            </div>

            {/* Nav All Products */}
            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">رابط كل المنتجات</span>
                <button
                  type="button"
                  onClick={() => update('showNavAllProducts', formTheme.showNavAllProducts === false ? true : false)}
                  className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                    formTheme.showNavAllProducts !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {formTheme.showNavAllProducts !== false ? 'ظاهر' : 'مخفي'}
                </button>
              </div>
              <Field label="نص الرابط:">
                <TextInput value={formTheme.navAllProductsLabel} onChange={(e) => update('navAllProductsLabel', e.target.value)} placeholder="كل المنتجات" />
              </Field>
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════════
              3. ANNOUNCEMENT BAR
          ═══════════════════════════════════════════════════════════ */}
          <Section
            id="announcement"
            icon={<Megaphone size={18} />}
            color="bg-amber-600"
            title="3. شريط الإعلانات العلوي"
            subtitle="الشريط المتحرك في أعلى صفحات المتجر"
            isOpen={openSections.announcement}
            onToggle={handleToggleSection}
          >
            {/* Toggle ON/OFF */}
            <div className="flex items-center justify-between p-3.5 bg-slate-800 rounded-2xl border border-slate-700">
              <div>
                <p className="text-xs font-bold text-white">تفعيل شريط الإعلانات</p>
                <p className="text-[11px] text-slate-400">إظهار أو إخفاء الشريط العلوي في المتجر</p>
              </div>
              <button
                type="button"
                onClick={() => update('showAnnouncement', !formTheme.showAnnouncement)}
                className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                  formTheme.showAnnouncement
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-700 text-slate-400 border border-slate-600'
                }`}
              >
                {formTheme.showAnnouncement ? (
                  <><ToggleRight size={18} /><span>مفعّل</span></>
                ) : (
                  <><ToggleLeft size={18} /><span>معطّل</span></>
                )}
              </button>
            </div>

            <Field label="نص شريط الإعلانات:">
              <TextareaInput value={formTheme.announcementText} onChange={(e) => update('announcementText', e.target.value)} />
            </Field>

            <Field label="لون خلفية الشريط:">
              <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-600">
                <input type="color" value={formTheme.announcementBg || '#0284c7'}
                  onChange={(e) => update('announcementBg', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0" />
                <input type="text" value={formTheme.announcementBg || '#0284c7'}
                  onChange={(e) => update('announcementBg', e.target.value)}
                  className="flex-1 bg-transparent text-xs text-white font-mono border-0 outline-none dir-ltr" />
              </div>
            </Field>
          </Section>

          {/* ═══════════════════════════════════════════════════════════
              SECTIONS VISIBILITY MANAGER (إظهار وإخفاء أي قسم)
          ═══════════════════════════════════════════════════════════ */}
          <Section
            id="sections_visibility"
            icon={<Eye size={18} />}
            color="bg-pink-600"
            title="التحكم في أقسام المتجر (إظهار / إخفاء أي قسم)"
            subtitle="شغّل أو أوقف أي جزء من الصفحة الرئيسية بنقرة واحدة"
            isOpen={openSections.sections_visibility}
            onToggle={handleToggleSection}
          >
            <div className="space-y-3">
              {[
                { key: 'showHero', title: 'البانر الرئيسي العلوي (Hero)', desc: 'العنوان الكبير والشعارات والأزرار' },
                { key: 'showCategories', title: 'بطاقات الأقسام السريعة (3 كروت)', desc: 'كتب خارجية، كشاكيل تورك، أكواد منصات' },
                { key: 'showBestSellers', title: 'قسم الأكثر طلباً والمنتجات', desc: 'كاتالوج المنتجات مع فلاتر المراحل الدراسية' },
                { key: 'showTeacherCodesBanner', title: 'بانر أكواد منصات المدرسين (الشريط الداكن)', desc: 'شحن رصيد منصات كبار المدرسين مع كروت المدرسين' },
                { key: 'showFaq', title: 'قسم الأسئلة الشائعة (FAQ)', desc: 'قائمة الأسئلة الأكثر تكراراً وحلولها' },
                { key: 'showAnnouncement', title: 'شريط الإعلانات العلوي', desc: 'الشريط المتحرك بأعلى الموقع' },
              ].map((sec) => (
                <div key={sec.key} className="flex items-center justify-between p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
                  <div>
                    <p className="text-xs font-bold text-white">{sec.title}</p>
                    <p className="text-[11px] text-slate-400">{sec.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => update(sec.key, formTheme[sec.key] === false ? true : false)}
                    className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                      formTheme[sec.key] !== false
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {formTheme[sec.key] !== false ? (
                      <><ToggleRight size={18} /><span>ظاهر</span></>
                    ) : (
                      <><ToggleLeft size={18} /><span>مخفي</span></>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-sky-400">تعديل عناوين ونصوص الأقسام:</h4>
              <Field label="عنوان قسم الأكثر طلباً:">
                <TextInput value={formTheme.bestSellersTitle} onChange={(e) => update('bestSellersTitle', e.target.value)} />
              </Field>
              <Field label="بادج قسم الأكثر طلباً (الشارة):">
                <TextInput value={formTheme.bestSellersBadge} onChange={(e) => update('bestSellersBadge', e.target.value)} />
              </Field>
              <Field label="عنوان قسم أكواد المدرسين:">
                <TextInput value={formTheme.teacherCodesTitle} onChange={(e) => update('teacherCodesTitle', e.target.value)} />
              </Field>
              <Field label="وصف قسم أكواد المدرسين:">
                <TextareaInput value={formTheme.teacherCodesSubtitle} onChange={(e) => update('teacherCodesSubtitle', e.target.value)} rows={2} />
              </Field>
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════════
              4. HERO SECTION
          ═══════════════════════════════════════════════════════════ */}
          <Section
            id="hero"
            icon={<Zap size={18} />}
            color="bg-sky-600"
            title="4. البنر الرئيسي (Hero Section)"
            subtitle="العنوان الكبير، الوصف، الأزرار، وبادجات الثقة"
            isOpen={openSections.hero}
            onToggle={handleToggleSection}
          >
            <Field label="بادج الهيدر (الشارة الصغيرة):" hint="النص داخل الشارة الصغيرة فوق العنوان">
              <TextInput value={formTheme.heroBadge} onChange={(e) => update('heroBadge', e.target.value)} />
            </Field>

            <Field label="العنوان الرئيسي:">
              <TextareaInput value={formTheme.heroTitle} onChange={(e) => update('heroTitle', e.target.value)} />
            </Field>

            <Field label="الجزء المتدرج من العنوان (Highlight):" hint="الجزء الملون بالتدرج داخل العنوان">
              <TextInput value={formTheme.heroHighlight} onChange={(e) => update('heroHighlight', e.target.value)} />
            </Field>

            <Field label="النص التوضيحي (Subtitle):">
              <TextareaInput value={formTheme.heroSubtitle} onChange={(e) => update('heroSubtitle', e.target.value)} rows={3} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="نص الزر الأول (الأساسي):">
                <TextInput value={formTheme.heroCtaPrimary} onChange={(e) => update('heroCtaPrimary', e.target.value)} />
              </Field>
              <Field label="نص الزر الثاني (الثانوي):">
                <TextInput value={formTheme.heroCtaSecondary} onChange={(e) => update('heroCtaSecondary', e.target.value)} />
              </Field>
            </div>

            <div className="pt-2 border-t border-slate-700/50">
              <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                <Star size={14} className="text-amber-400" />
                بادجات الثقة الأربعة (أسفل الأزرار):
              </p>
              <div className="space-y-2">
                {['badge1', 'badge2', 'badge3', 'badge4'].map((key, i) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 w-6 text-center font-bold">{i + 1}</span>
                    <TextInput value={formTheme[key]} onChange={(e) => update(key, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════════
              5. SHIPPING & PAYMENT
          ═══════════════════════════════════════════════════════════ */}
          <Section
            id="shipping"
            icon={<Truck size={18} />}
            color="bg-emerald-600"
            title="5. الشحن والدفع (فودافون كاش)"
            subtitle="أسعار الشحن، رقم فودافون كاش، والتعليمات"
            isOpen={openSections.shipping}
            onToggle={handleToggleSection}
          >
            <Field label="رقم محفظة فودافون كاش:">
              <TextInput value={formTheme.vodafoneNumber} onChange={(e) => update('vodafoneNumber', e.target.value)} dir="ltr" />
            </Field>

            <Field label="تعليمات الدفع للطالب:">
              <TextareaInput value={formTheme.vodafoneInstructions} onChange={(e) => update('vodafoneInstructions', e.target.value)} rows={3} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/50">
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  الشحن العادي (Standard)
                </p>
                <Field label="اسم الشحن العادي:">
                  <TextInput value={formTheme.standardShippingName} onChange={(e) => update('standardShippingName', e.target.value)} />
                </Field>
                <Field label="السعر (جنيه):">
                  <NumberInput value={formTheme.standardShippingRate} onChange={(e) => update('standardShippingRate', Number(e.target.value))} min={0} prefix="ج.م" />
                </Field>
                <Field label="وقت التوصيل:">
                  <TextInput value={formTheme.standardShippingTime} onChange={(e) => update('standardShippingTime', e.target.value)} />
                </Field>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-black text-slate-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  الشحن السريع (Express Rocket)
                </p>
                <Field label="اسم الشحن السريع:">
                  <TextInput value={formTheme.expressShippingName} onChange={(e) => update('expressShippingName', e.target.value)} />
                </Field>
                <Field label="السعر (جنيه):">
                  <NumberInput value={formTheme.expressShippingRate} onChange={(e) => update('expressShippingRate', Number(e.target.value))} min={0} prefix="ج.م" />
                </Field>
                <Field label="وقت التوصيل:">
                  <TextInput value={formTheme.expressShippingTime} onChange={(e) => update('expressShippingTime', e.target.value)} />
                </Field>
              </div>
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════════
              6. SOCIAL MEDIA & CONTACT
          ═══════════════════════════════════════════════════════════ */}
          <Section
            id="social"
            icon={<Share2 size={18} />}
            color="bg-pink-600"
            title="6. التواصل الاجتماعي والسوشيال"
            subtitle="روابط فيسبوك، انستجرام، واتساب، وبيانات التواصل"
            isOpen={openSections.social}
            onToggle={handleToggleSection}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label={<span className="flex items-center gap-1.5"><Phone size={12} />رقم واتساب الدعم:</span>}>
                <TextInput value={formTheme.whatsappNumber} onChange={(e) => update('whatsappNumber', e.target.value)} dir="ltr" placeholder="+20 1x xxxxxxxx" />
              </Field>
              <Field label={<span className="flex items-center gap-1.5"><Globe size={12} />رابط صفحة فيسبوك:</span>}>
                <TextInput value={formTheme.facebookUrl} onChange={(e) => update('facebookUrl', e.target.value)} dir="ltr" placeholder="https://facebook.com/..." />
              </Field>
              <Field label={<span className="flex items-center gap-1.5"><Share2 size={12} />رابط انستجرام:</span>}>
                <TextInput value={formTheme.instagramUrl} onChange={(e) => update('instagramUrl', e.target.value)} dir="ltr" placeholder="https://instagram.com/..." />
              </Field>
              <Field label={<span className="flex items-center gap-1.5"><MessageCircle size={12} />رابط قناة واتساب:</span>}>
                <TextInput value={formTheme.whatsappChannelUrl} onChange={(e) => update('whatsappChannelUrl', e.target.value)} dir="ltr" placeholder="https://whatsapp.com/channel/..." />
              </Field>
            </div>

            <div className="pt-2 border-t border-slate-700/50 space-y-3">
              <Field label="عنوان قسم السوشيال بروموشن:">
                <TextInput value={formTheme.socialPromoTitle} onChange={(e) => update('socialPromoTitle', e.target.value)} />
              </Field>
              <Field label="وصف قسم السوشيال بروموشن:">
                <TextareaInput value={formTheme.socialPromoSubtitle} onChange={(e) => update('socialPromoSubtitle', e.target.value)} />
              </Field>
              <Field label="نص البروموشن القصير (في البانر الصغير):">
                <TextInput value={formTheme.socialPromoText} onChange={(e) => update('socialPromoText', e.target.value)} />
              </Field>
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════════
              7. FOOTER
          ═══════════════════════════════════════════════════════════ */}
          <Section
            id="footer"
            icon={<FileText size={18} />}
            color="bg-slate-600"
            title="7. تذييل الصفحة (Footer)"
            subtitle="وصف الموقع ونص حقوق الملكية"
            isOpen={openSections.footer}
            onToggle={handleToggleSection}
          >
            <Field label="وصف المتجر في الفوتر:">
              <TextareaInput value={formTheme.footerDesc} onChange={(e) => update('footerDesc', e.target.value)} rows={3} />
            </Field>
            <Field label="نص حقوق الملكية (Copyright):">
              <TextInput value={formTheme.copyrightText} onChange={(e) => update('copyrightText', e.target.value)} />
            </Field>
          </Section>

          {/* ── Save Button ────────────────────────────────────────────────── */}
          <button
            type="submit"
            className="w-full btn btn-primary py-4 text-base font-black rounded-2xl shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
          >
            <Save size={18} />
            <span>حفظ جميع التعديلات وتثبيتها على المتجر</span>
          </button>

        </form>

        {/* ── RIGHT: Sticky Live Preview ─────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-white">
              <Eye size={16} className="text-sky-400" />
              <span>معاينة حية مباشرة (Live Preview)</span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
              محدث فورياً
            </span>
          </div>

          {/* Simulated Storefront */}
          <div
            className="bg-white shadow-2xl border border-slate-200 text-slate-900 space-y-4 overflow-hidden transition-all duration-300"
            style={{
              fontFamily: `'${formTheme.fontFamily}', sans-serif`,
              borderRadius: formTheme.borderRadius
            }}
          >
            {/* Announcement Banner */}
            {formTheme.showAnnouncement && (
              <div
                className="text-white text-[11px] p-2.5 text-center font-bold"
                style={{ backgroundColor: formTheme.announcementBg || formTheme.primaryColor }}
              >
                {formTheme.announcementText}
              </div>
            )}

            <div className="p-5 space-y-4">
              {/* Header Simulation */}
              <div className="pb-3 border-b border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 text-white flex items-center justify-center font-bold text-sm shadow-sm"
                      style={{ backgroundColor: formTheme.primaryColor, borderRadius: '8px' }}
                    >
                      {(formTheme.logoText || 'T').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-none">
                        <span>{formTheme.logoText}</span>
                        <span className="ml-1" style={{ color: formTheme.primaryColor }}>{formTheme.logoHighlight}</span>
                      </h3>
                      <span className="text-[10px] text-slate-400">{formTheme.storeNameAr}</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-slate-100">
                    <ShoppingBag size={14} className="text-slate-700" />
                  </div>
                </div>

                {/* Simulated Navbar Links */}
                <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-bold text-slate-600 pt-1 pb-0.5">
                  {formTheme.showNavHome !== false && (
                    <span className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md whitespace-nowrap">
                      {formTheme.navHomeLabel || 'الرئيسية'}
                    </span>
                  )}
                  {formTheme.showNavNotebooks !== false && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md whitespace-nowrap">
                      {formTheme.navNotebooksLabel || 'Notebooks'}
                    </span>
                  )}
                  {formTheme.showNavBooks !== false && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md whitespace-nowrap">
                      {formTheme.navBooksLabel || 'Books'}
                    </span>
                  )}
                  {formTheme.showNavCodes !== false && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md whitespace-nowrap flex items-center gap-1">
                      <span>{formTheme.navCodesLabel || 'Teacher Codes'}</span>
                      <span className="bg-sky-500 text-white text-[8px] px-1 rounded-full font-bold">{formTheme.navCodesBadge || 'فوري ⚡'}</span>
                    </span>
                  )}
                  {formTheme.showNavAllProducts !== false && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md whitespace-nowrap">
                      {formTheme.navAllProductsLabel || 'كل المنتجات'}
                    </span>
                  )}
                </div>
              </div>

              {/* Hero Preview */}
              <div className="text-center space-y-2 py-2">
                <div
                  className="inline-block text-[10px] font-bold px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: formTheme.primaryColor }}
                >
                  {(formTheme.heroBadge || '').substring(0, 40)}...
                </div>
                <h2 className="text-sm font-black text-slate-900 leading-snug">
                  {(formTheme.heroTitle || '').substring(0, 30)}{' '}
                  <span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: `linear-gradient(135deg, ${formTheme.accentColor}, ${formTheme.primaryColor})` }}
                  >
                    {formTheme.heroHighlight}
                  </span>
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 text-[10px] font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${formTheme.accentColor}, ${formTheme.primaryColor})`,
                      borderRadius: '8px'
                    }}
                  >
                    {formTheme.heroCtaPrimary}
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-[10px] font-bold text-slate-700 bg-slate-100"
                    style={{ borderRadius: '8px' }}
                  >
                    {formTheme.heroCtaSecondary}
                  </button>
                </div>
              </div>

              {/* Product Card Simulation */}
              <div
                className="border border-slate-200 p-3 space-y-2 bg-slate-50/80"
                style={{ borderRadius: formTheme.borderRadius }}
              >
                <div className="aspect-[16/9] bg-slate-200 rounded-xl overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80"
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <span
                    className="absolute top-1.5 right-1.5 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: formTheme.primaryColor }}
                  >
                    الأكثر مبيعاً
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500">كتب خارجية</span>
                  <h4 className="text-xs font-extrabold text-slate-900">كتاب المعاصر رياضيات بحتة 2025</h4>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                  <span className="text-sm font-black" style={{ color: formTheme.primaryColor }}>285 ج.م</span>
                  <button
                    type="button"
                    className="px-3 py-1 text-[10px] font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${formTheme.accentColor}, ${formTheme.primaryColor})`,
                      borderRadius: '8px'
                    }}
                  >
                    أضف للسلة
                  </button>
                </div>
              </div>

              {/* Shipping Rates Preview */}
              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-500 uppercase">أسعار الشحن:</p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-semibold">{formTheme.standardShippingName}</span>
                  <span className="font-black" style={{ color: formTheme.primaryColor }}>{formTheme.standardShippingRate} ج.م</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-semibold">{formTheme.expressShippingName}</span>
                  <span className="font-black text-amber-600">{formTheme.expressShippingRate} ج.م</span>
                </div>
              </div>

              {/* Footer Social Promo Preview */}
              <div
                className="p-2.5 text-center text-[10px] font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${formTheme.primaryColor}, ${formTheme.accentColor})`,
                  borderRadius: '10px'
                }}
              >
                {formTheme.socialPromoText}
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-bold text-slate-300">💡 ملاحظة:</p>
            <p>كل تعديل يحدث في المعاينة فوراً. اضغط "حفظ" لتثبيت التعديلات وضمان ظهورها عند إعادة تحميل الموقع.</p>
          </div>

        </div>
      </div>
    </div>
  );
};
