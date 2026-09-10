import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package, 
  X, 
  Check, 
  KeyRound, 
  BookOpen, 
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editingProductId, setEditingProductId] = useState(null);

  // Form State
  const initialForm = {
    title: '',
    titleEn: '',
    category: 'Books',
    subCategory: '3rd Secondary (Thanaweya Amma)',
    grade: '3rd Secondary',
    subject: 'General',
    price: 150,
    originalPrice: 180,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: '',
    badge: '',
    teacher: '',
    platform: '',
    features: ['نسخة أصلية جديدة', 'مراجعة وتدريبات شاملة']
  };

  const [formData, setFormData] = useState(initialForm);
  const [toastMsg, setToastMsg] = useState('');

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchSearch = !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.titleEn && p.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.teacher && p.teacher.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCat && matchSearch;
  });

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setEditingProductId(null);
    setModalMode('add');
  };

  const handleOpenEdit = (product) => {
    setFormData({
      title: product.title,
      titleEn: product.titleEn || '',
      category: product.category,
      subCategory: product.subCategory || '',
      grade: product.grade || 'All Grades',
      subject: product.subject || 'General',
      price: product.price,
      originalPrice: product.originalPrice || '',
      stock: product.stock || 50,
      image: product.image,
      description: product.description || '',
      badge: product.badge || '',
      teacher: product.teacher || '',
      platform: product.platform || '',
      features: product.features || []
    });
    setEditingProductId(product.id);
    setModalMode('edit');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addProduct(formData);
      setToastMsg('تمت إضافة المنتج الجديد إلى المتجر بنجاح!');
    } else {
      updateProduct(editingProductId, formData);
      setToastMsg('تم حفظ وتحديث بيانات المنتج بنجاح!');
    }
    setModalMode(null);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`هل أنت متأكد من حذف "${title}" نهائياً؟`)) {
      deleteProduct(id);
      setToastMsg('تم حذف المنتج بنجاح.');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">إدارة المنتجات والمخزون (CRUD)</h1>
          <p className="text-xs text-slate-400 mt-1">
            إضافة وتعديل كتب الثانوية العامة، الكشاكيل، وأكواد منصات المدرسين
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn btn-sm bg-sky-500 hover:bg-sky-400 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
        >
          <Plus size={16} />
          <span>إضافة منتج جديد (Add Product)</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl font-bold flex items-center gap-2">
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ابحث بالاسم، المادة، أو اسم المدرس..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white pl-8 focus:border-sky-500"
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold">القسم:</span>
          {['All', 'Books', 'Notebooks', 'Teacher Codes'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                categoryFilter === cat
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'All' ? 'الكل' : cat === 'Books' ? 'الكتب' : cat === 'Notebooks' ? 'الكشاكيل' : 'أكواد المدرسين'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-700 text-slate-400 font-bold">
                <th className="py-3 px-4">الصورة</th>
                <th className="py-3 px-4">اسم المنتج</th>
                <th className="py-3 px-4">القسم والتصنيف</th>
                <th className="py-3 px-4">المرحلة</th>
                <th className="py-3 px-4">السعر</th>
                <th className="py-3 px-4">المخزون المتاح</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-700/40 transition-colors">
                  <td className="py-3 px-4">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-11 h-13 object-cover rounded-lg bg-slate-900 border border-slate-700"
                    />
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-bold text-white text-xs line-clamp-1">{p.title}</div>
                    {p.teacher && (
                      <div className="text-[11px] text-sky-400 font-semibold mt-0.5">
                        كود: {p.teacher} ({p.platform})
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      {p.category}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">{p.subCategory}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-300 font-medium">
                    {p.grade || 'جميع المراحل'}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-black text-white text-sm">{p.price} ج.م</span>
                    {p.originalPrice && (
                      <span className="text-[10px] text-slate-400 line-through mr-1.5 block">
                        {p.originalPrice} ج.م
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      (p.stock || 0) < 10 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {p.stock || 50} قطعة
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 bg-slate-700 hover:bg-sky-500 text-slate-300 hover:text-white rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          Product Add / Edit Modal Form
         ======================================================== */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {modalMode === 'add' ? 'إضافة منتج جديد للكتالوج' : 'تعديل بيانات المنتج'}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              
              {/* Title */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">اسم المنتج بالعربية *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كتاب المعاصر رياضيات بحتة 3 ثانوي"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              {/* Title EN */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">الاسم بالإنجليزية (اختياري)</label>
                <input
                  type="text"
                  placeholder="El-Moasser Mathematics 3rd Sec"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              {/* Category & Subcategory Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">القسم الرئيسي *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white cursor-pointer"
                  >
                    <option value="Books">Books (كتب خارجية)</option>
                    <option value="Notebooks">Notebooks (كشاكيل وملخصات)</option>
                    <option value="Teacher Codes">Teacher Codes (أكواد مدرسين)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">المرحلة الدراسية</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white cursor-pointer"
                  >
                    <option value="3rd Secondary">الصف الثالث الثانوي (ثانوية عامة)</option>
                    <option value="2nd Secondary">الصف الثاني الثانوي</option>
                    <option value="1st Secondary">الصف الأول الثانوي</option>
                    <option value="Baccalaureate">البكالوريا الدولية / لغات</option>
                    <option value="All Grades">جميع المراحل (All)</option>
                  </select>
                </div>
              </div>

              {/* Sub-Category input */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">التصنيف الفرعي (Sub-Category)</label>
                <input
                  type="text"
                  placeholder="مثال: Wirebound Notebooks أو 3rd Secondary"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              {/* If Teacher Code: Teacher & Platform fields */}
              {formData.category === 'Teacher Codes' && (
                <div className="p-3 bg-sky-950/40 rounded-xl border border-sky-800 space-y-3">
                  <div className="text-sky-400 font-bold text-xs flex items-center gap-1.5">
                    <KeyRound size={15} />
                    <span>بيانات كود المدرس والمنصة التعليمية</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">اسم المدرس:</label>
                      <input
                        type="text"
                        placeholder="مستر محمد عبد المعبود"
                        value={formData.teacher}
                        onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">اسم المنصة أو الأكاديمية:</label>
                      <input
                        type="text"
                        placeholder="AbdelMaaboud Online"
                        value={formData.platform}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing & Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">السعر (ج.م) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">السعر الأصلي</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">المخزون *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">رابط صورة المنتج (Image URL) *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">وصف المنتج</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  placeholder="وصف مميزات ومحتوى الكتاب أو الكشكول..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn btn-sm bg-sky-500 hover:bg-sky-400 text-white font-bold"
                >
                  {modalMode === 'add' ? 'إضافة المنتج' : 'حفظ التعديلات'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
