import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Globe,
  CheckCircle2,
  Link2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

// ── Default pages that come pre-built ─────────────────────────────────────────
const DEFAULT_PAGES = [
  { id: 'home',     title: 'الصفحة الرئيسية', slug: '/',         builtin: true, visible: true },
  { id: 'products', title: 'صفحة المنتجات',   slug: '/products', builtin: true, visible: true },
  { id: 'checkout', title: 'صفحة الدفع',       slug: '/checkout', builtin: true, visible: true },
  { id: 'profile',  title: 'ملفي الشخصي',      slug: '/profile',  builtin: true, visible: true },
];

const emptyPage = { title: '', slug: '', content: '', visible: true };

export const AdminPages = () => {
  const { theme, updateTheme } = useStore();

  // Extra custom pages stored in theme
  const [customPages, setCustomPages] = useState(() => theme?.customPages || []);
  const [editing, setEditing] = useState(null); // { ...page } being edited
  const [isNew, setIsNew] = useState(false);
  const [saved, setSaved] = useState(false);

  const persistPages = (pages) => {
    setCustomPages(pages);
    updateTheme({ customPages: pages });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleStartNew = () => {
    setEditing({ ...emptyPage, id: `page-${Date.now()}` });
    setIsNew(true);
  };

  const handleEdit = (page) => {
    setEditing({ ...page });
    setIsNew(false);
  };

  const handleSavePage = () => {
    if (!editing.title.trim()) return alert('يرجى إدخال عنوان الصفحة');
    if (!editing.slug.trim()) return alert('يرجى إدخال مسار الصفحة (slug)');

    let slug = editing.slug.trim();
    if (!slug.startsWith('/')) slug = '/' + slug;

    const updated = isNew
      ? [...customPages, { ...editing, slug }]
      : customPages.map(p => p.id === editing.id ? { ...editing, slug } : p);

    persistPages(updated);
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('هل تريد حذف هذه الصفحة نهائياً؟')) return;
    persistPages(customPages.filter(p => p.id !== id));
  };

  const handleToggleVisible = (id) => {
    persistPages(customPages.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
  };

  const allPages = [...DEFAULT_PAGES, ...customPages];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Globe size={16} />
            <span>إدارة صفحات الموقع</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">صفحات المتجر</h1>
          <p className="text-xs text-slate-400 mt-1">أضف وعدّل الصفحات المخصصة التي تظهر في موقعك</p>
        </div>
        <button
          onClick={handleStartNew}
          className="btn bg-sky-500 hover:bg-sky-400 text-white font-bold flex items-center gap-2"
        >
          <Plus size={16} />
          <span>إضافة صفحة جديدة</span>
        </button>
      </div>

      {/* Success Banner */}
      {saved && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs rounded-2xl font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>تم حفظ التغييرات بنجاح ✅</span>
        </div>
      )}

      {/* Pages List */}
      <div className="space-y-3">

        {/* Built-in Pages */}
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">الصفحات الأساسية (مدمجة)</div>
        {DEFAULT_PAGES.map(page => (
          <div key={page.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-700 text-slate-400 flex items-center justify-center flex-shrink-0">
                <FileText size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{page.title}</p>
                <a
                  href={page.slug}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-sky-400 font-mono hover:underline flex items-center gap-1"
                >
                  <Link2 size={10} />
                  {page.slug}
                </a>
              </div>
            </div>
            <span className="bg-slate-700 text-slate-400 text-[10px] font-bold px-2.5 py-1 rounded-full">مدمجة</span>
          </div>
        ))}

        {/* Custom Pages */}
        {customPages.length > 0 && (
          <>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 pt-2">الصفحات المخصصة</div>
            {customPages.map(page => (
              <div key={page.id} className="flex items-center justify-between p-4 bg-slate-800/80 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    page.visible ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-700 text-slate-500'
                  }`}>
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${page.visible ? 'text-white' : 'text-slate-500'}`}>{page.title}</p>
                    <span className="text-[11px] text-sky-400 font-mono">{page.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Toggle Visibility */}
                  <button
                    onClick={() => handleToggleVisible(page.id)}
                    className={`p-2 rounded-xl transition-all text-xs font-bold flex items-center gap-1 ${
                      page.visible
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600 border border-slate-600'
                    }`}
                    title={page.visible ? 'إخفاء الصفحة' : 'إظهار الصفحة'}
                  >
                    {page.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    <span className="hidden sm:inline">{page.visible ? 'ظاهرة' : 'مخفية'}</span>
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(page)}
                    className="p-2 rounded-xl bg-slate-700 hover:bg-sky-500/20 text-slate-400 hover:text-sky-400 transition-all border border-slate-600 hover:border-sky-500/30"
                    title="تعديل"
                  >
                    <Edit3 size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="p-2 rounded-xl bg-slate-700 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all border border-slate-600 hover:border-rose-500/30"
                    title="حذف"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {customPages.length === 0 && (
          <div className="p-10 text-center text-slate-500 text-sm bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
            <FileText size={32} className="mx-auto mb-3 text-slate-600" />
            <p className="font-bold">لا توجد صفحات مخصصة بعد</p>
            <p className="text-xs mt-1">اضغط "إضافة صفحة جديدة" لإنشاء صفحة مخصصة كصفحة "عن المتجر" أو "سياسة الخصوصية"</p>
          </div>
        )}
      </div>

      {/* ── Edit / Create Modal ────────────────────────────────────────────── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-black text-white text-base">
                {isNew ? '➕ إضافة صفحة جديدة' : `✏️ تعديل: ${editing.title}`}
              </h3>
              <button
                onClick={() => { setEditing(null); setIsNew(false); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان الصفحة:</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing(p => ({ ...p, title: e.target.value }))}
                  placeholder="مثال: عن متجر تورك"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  مسار الصفحة (URL Slug):
                  <span className="text-slate-500 font-normal mr-1">مثال: /about أو /privacy</span>
                </label>
                <input
                  type="text"
                  value={editing.slug}
                  onChange={(e) => setEditing(p => ({ ...p, slug: e.target.value }))}
                  placeholder="/about"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm focus:outline-none focus:border-sky-500 transition-colors font-mono"
                  dir="ltr"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  محتوى الصفحة:
                  <span className="text-slate-500 font-normal mr-1">النص الذي يظهر في الصفحة</span>
                </label>
                <textarea
                  rows={8}
                  value={editing.content || ''}
                  onChange={(e) => setEditing(p => ({ ...p, content: e.target.value }))}
                  placeholder="اكتب محتوى الصفحة هنا..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm focus:outline-none focus:border-sky-500 transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-800 rounded-2xl border border-slate-700">
                <div>
                  <p className="text-xs font-bold text-white">ظهور الصفحة</p>
                  <p className="text-[11px] text-slate-400">إظهار أو إخفاء الصفحة من الموقع</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(p => ({ ...p, visible: !p.visible }))}
                  className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                    editing.visible
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-700 text-slate-400 border border-slate-600'
                  }`}
                >
                  {editing.visible ? <><Eye size={14} /><span>ظاهرة</span></> : <><EyeOff size={14} /><span>مخفية</span></>}
                </button>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => { setEditing(null); setIsNew(false); }}
                className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handleSavePage}
                className="btn bg-sky-500 hover:bg-sky-400 text-white font-bold flex items-center gap-2"
              >
                <Save size={15} />
                <span>{isNew ? 'إنشاء الصفحة' : 'حفظ التعديلات'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
