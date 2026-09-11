import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  Check, 
  X,
  Shield
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminTeam = () => {
  const { staff, addStaff, updateStaff, deleteStaff } = useStore();

  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const initialForm = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Sales'
  };

  const [formData, setFormData] = useState(initialForm);

  const roles = [
    { id: 'Super Admin',        label: 'Super Admin — مدير عام بكافة الصلاحيات' },
    { id: 'Developer',          label: 'Developer — مبرمج بكافة الصلاحيات' },
    { id: 'Management',         label: 'Management — إدارة بكافة الصلاحيات' },
    { id: 'Sales',              label: 'Sales — مبيعات (منتجات + أوردرات فقط)' },
    { id: 'Order Manager',      label: 'Order Manager — متابعة الطلبات فقط' },
    { id: 'Catalog Specialist', label: 'Catalog Specialist — إدارة المنتجات فقط' },
    { id: 'Customer Support',   label: 'Customer Support — دعم وأوردرات' },
  ];

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setEditingStaffId(null);
    setModalMode('add');
  };

  const handleOpenEdit = (member) => {
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      password: member.password || '',
      role: member.role
    });
    setEditingStaffId(member.id);
    setModalMode('edit');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addStaff(formData);
      setToastMsg('تمت إضافة عضو الفريق الجديد بنجاح!');
    } else {
      updateStaff(editingStaffId, formData);
      setToastMsg('تم تحديث بيانات وصلاحية العضو بنجاح!');
    }
    setModalMode(null);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleDelete = (id, name) => {
    if (staff.length <= 1) {
      alert('لا يمكن حذف المسؤول الأخير في النظام!');
      return;
    }
    if (window.confirm(`هل أنت متأكد من إزالة "${name}" من فريق الإدارة؟`)) {
      deleteStaff(id);
      setToastMsg('تم حذف العضو من الفريق.');
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">فريق العمل وإدارة الصلاحيات (Team Management)</h1>
          <p className="text-xs text-slate-400 mt-1">
            إضافة وتعديل صلاحيات مسؤولي المتجر، مديري الشحن، وأخصائيي كتالوج الثانوية
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn btn-sm bg-sky-500 hover:bg-sky-400 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
        >
          <UserPlus size={16} />
          <span>إضافة عضو جديد (Add Staff)</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl font-bold flex items-center gap-2">
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {staff.map((member) => (
          <div key={member.id} className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-4 hover:border-slate-600 transition-all">
            
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center font-bold text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{member.name}</h3>
                    <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded text-[10px] font-bold inline-block mt-0.5">
                      {member.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-700 rounded-lg transition-colors"
                    title="تعديل الصلاحية"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-slate-500" />
                  <span className="text-slate-300 font-mono text-[11px]">{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-slate-500" />
                    <span className="text-slate-300 font-mono text-[11px] dir-ltr">{member.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-slate-500" />
                  <span className="text-[11px]">انضم في: {member.dateJoined || '2024-01-01'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck size={13} />
                <span>حساب مفعل</span>
              </span>
              <span className="text-[10px] text-slate-500">صلاحيات مخصصة</span>
            </div>

          </div>
        ))}
      </div>

      {/* ========================================================
          Staff Add / Edit Modal
         ======================================================== */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield size={16} className="text-sky-400" />
                <span>{modalMode === 'add' ? 'إضافة مسؤول جديد للفريق' : 'تعديل بيانات المسؤول'}</span>
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">الاسم بالكامل *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: يوسف السيد"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">البريد الإلكتروني للإدارة *</label>
                <input
                  type="email"
                  required
                  placeholder="name@torke.store"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">رقم الهاتف (للتواصل الداخلي)</label>
                <input
                  type="tel"
                  placeholder="+20 10 12345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white dir-ltr"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الدور والصلاحيات (Admin Access Role) *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white cursor-pointer"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">كلمة المرور *</label>
                <input
                  type="password"
                  required
                  placeholder="كلمة مرور مخصصة لهذا الموظف"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">سيستخدمها الموظف لتسجيل الدخول للوحة التحكم</p>
              </div>

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
                  {modalMode === 'add' ? 'إضافة المسؤول' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
