import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Phone, 
  MapPin, 
  GraduationCap, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  Edit3,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProfilePage = () => {
  const { currentUser, updateProfile, orders, openLoginModal } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: currentUser?.fullName || '',
    primaryPhone: currentUser?.primaryPhone || '',
    altPhone: currentUser?.altPhone || '',
    address: currentUser?.address || '',
    grade: currentUser?.grade || '3rd Secondary'
  });

  const [saveToast, setSaveToast] = useState(false);

  if (!currentUser) {
    return (
      <div className="container py-20 text-center space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mx-auto">
          <User size={36} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">يرجى تسجيل الدخول أولاً</h2>
        <p className="text-xs text-slate-500">
          سجل دخولك أو أنشئ حساب طالب جديد لتتمكن من متابعة طلباتك وتعديل عنوان التوصيل.
        </p>
        <button onClick={openLoginModal} className="btn btn-primary">
          تسجيل الدخول / حساب جديد
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Filter orders related to this student or show recent orders
  const userOrders = orders.filter(
    o => o.customer.primaryPhone === currentUser.primaryPhone || o.customer.fullName === currentUser.fullName
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid / Confirmed':
        return <span className="badge badge-success">تم تأكيد الدفع ✔</span>;
      case 'Shipped':
        return <span className="badge badge-sky">جاري التوصيل 🚚</span>;
      case 'Delivered':
        return <span className="badge badge-success">تم التسليم بنجاح 📦</span>;
      case 'Cancelled':
        return <span className="badge badge-warning">ملغي</span>;
      default:
        return <span className="badge badge-warning">قيد المراجعة ⏳</span>;
    }
  };

  return (
    <div className="container py-8 sm:py-12 space-y-10 max-w-5xl">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            ملف الطالب ومتابعة الشحنات
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            أهلاً بك يا {currentUser.fullName}! بياناتك محفوظة دائماً للتسوق السريع.
          </p>
        </div>
        {saveToast && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <Check size={16} />
            <span>تم حفظ التعديلات بنجاح!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Student Details Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <User size={18} className="text-sky-600" />
              <span>البيانات الشخصية المحفوظة</span>
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
            >
              <Edit3 size={14} />
              <span>{isEditing ? 'إلغاء' : 'تعديل'}</span>
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">الاسم بالكامل</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 mb-1 block">الهاتف الأساسي</label>
                <input
                  type="tel"
                  required
                  value={editForm.primaryPhone}
                  onChange={(e) => setEditForm({ ...editForm, primaryPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dir-ltr"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 mb-1 block">الهاتف البديل</label>
                <input
                  type="tel"
                  required
                  value={editForm.altPhone}
                  onChange={(e) => setEditForm({ ...editForm, altPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dir-ltr"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 mb-1 block">العنوان بالتفصيل</label>
                <textarea
                  rows={2}
                  required
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 mb-1 block">السنة الدراسية</label>
                <select
                  value={editForm.grade}
                  onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="3rd Secondary">الصف الثالث الثانوي (ثانوية عامة)</option>
                  <option value="2nd Secondary">الصف الثاني الثانوي</option>
                  <option value="1st Secondary">الصف الأول الثانوي</option>
                  <option value="Baccalaureate">البكالوريا الدولية / لغات</option>
                </select>
              </div>

              <button type="submit" className="w-full btn btn-primary py-2.5 text-xs font-bold rounded-xl mt-2">
                حفظ التعديلات
              </button>
            </form>
          ) : (
            <div className="space-y-3.5 text-xs text-slate-700">
              <div className="flex items-center gap-2.5 p-3 bg-sky-50/60 rounded-xl border border-sky-100">
                <User size={16} className="text-sky-600 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">اسم الطالب:</span>
                  <span className="font-bold text-slate-900 text-sm">{currentUser.fullName}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-sky-50/60 rounded-xl border border-sky-100">
                <GraduationCap size={16} className="text-sky-600 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">المرحلة الدراسية:</span>
                  <span className="font-bold text-slate-900">{currentUser.grade || 'ثانوية عامة'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-sky-50/60 rounded-xl border border-sky-100">
                <Phone size={16} className="text-sky-600 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">الهاتف الأساسي / البديل:</span>
                  <span className="font-bold text-slate-900 dir-ltr inline-block">{currentUser.primaryPhone}</span>
                  {currentUser.altPhone && (
                    <span className="text-slate-500 dir-ltr inline-block mr-2"> / {currentUser.altPhone}</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-sky-50/60 rounded-xl border border-sky-100">
                <MapPin size={16} className="text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block">العنوان المعتمد للشحن:</span>
                  <span className="font-medium text-slate-800 leading-relaxed">{currentUser.address}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShoppingBag size={18} className="text-sky-600" />
              <span>سجل الطلبات ومتابعة الشحن ({userOrders.length})</span>
            </h2>
          </div>

          {userOrders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Clock size={36} className="text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">لا توجد طلبات مسجلة بهذا الحساب بعد</p>
              <Link to="/products" className="btn btn-secondary btn-sm">
                تصفح المنتجات وأتمم أول طلب
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition-all space-y-3 bg-slate-50/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-sky-700">{order.id}</span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Items in order */}
                  <div className="divide-y divide-slate-100 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <span className="font-medium text-slate-800 line-clamp-1">{item.title}</span>
                        <span className="text-slate-500 whitespace-nowrap mr-2">
                          {item.quantity} × {item.price} ج.م
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">وسيلة الشحن: {order.shippingMethod}</span>
                    <span className="text-sm font-black text-slate-900">الإجمالي: {order.grandTotal} ج.م</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
