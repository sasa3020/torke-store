import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  Users, 
  Package, 
  ArrowUpRight, 
  CheckCircle2, 
  Eye,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminDashboard = () => {
  const { orders, products, users } = useStore();

  // Financial Metrics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending Review');
  const confirmedOrders = orders.filter(o => o.status === 'Paid / Confirmed' || o.status === 'Shipped' || o.status === 'Delivered');

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">لوحة المؤشرات والتحليلات العامة</h1>
          <p className="text-xs text-slate-400 mt-1">
            متابعة فورية للمبيعات، الإيرادات، وتحويلات فودافون كاش لطلبة الثانوية
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/orders" className="btn btn-sm bg-sky-500 hover:bg-sky-400 text-white font-bold">
            <ShoppingBag size={15} />
            <span>عرض كل الطلبات ({orders.length})</span>
          </Link>
          <Link to="/admin/products" className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white font-bold">
            <Package size={15} />
            <span>إدارة الكتالوج</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">إجمالي الإيرادات (EGP)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalRevenue.toLocaleString()} <span className="text-xs font-bold text-emerald-400">ج.م</span>
          </div>
          <p className="text-[11px] text-slate-400">
            شامل أسعار المنتجات ورسوم الشحن القياسي والصاروخ
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">إجمالي الطلبات</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {orders.length}
          </div>
          <p className="text-[11px] text-sky-400 font-semibold">
            {confirmedOrders.length} طلبات مؤكدة ومدفوعة
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">طلبات قيد مراجعة الإيصال</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {pendingOrders.length}
          </div>
          <p className="text-[11px] text-slate-400">
            تتطلب فحص لقطة شاشة تحويل فودافون كاش
          </p>
        </div>

        {/* Registered Students */}
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">حسابات الطلاب المسجلة</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {users.length}
          </div>
          <p className="text-[11px] text-slate-400">
            معلومات التوصيل محفوظة بشكل دائم
          </p>
        </div>

      </div>

      {/* Recent Orders Overview */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">أحدث طلبات الطلاب الواردة</h3>
            <p className="text-xs text-slate-400">معاينة مباشرة للإيصالات وحالة الشحن</p>
          </div>
          <Link to="/admin/orders" className="text-xs text-sky-400 font-bold hover:underline flex items-center gap-1">
            <span>فتح شاشة الطلبات الكاملة</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            لا توجد أي طلبات واردة حالياً.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 font-bold pb-2">
                  <th className="py-2.5 px-3">رقم الطلب</th>
                  <th className="py-2.5 px-3">اسم الطالب</th>
                  <th className="py-2.5 px-3">الهاتف</th>
                  <th className="py-2.5 px-3">نوع الشحن</th>
                  <th className="py-2.5 px-3">الإجمالي</th>
                  <th className="py-2.5 px-3">إيصال فودافون كاش</th>
                  <th className="py-2.5 px-3">الحالة</th>
                  <th className="py-2.5 px-3">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-300">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-sky-400">{order.id}</td>
                    <td className="py-3 px-3 font-bold text-white">{order.customer.fullName}</td>
                    <td className="py-3 px-3 dir-ltr text-right">{order.customer.primaryPhone}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.shippingMethod.includes('Rocket') 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {order.shippingMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-white">{order.grandTotal} ج.م</td>
                    <td className="py-3 px-3">
                      {order.receiptImage ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>مرفق ✔</span>
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold">غير مرفق ✖</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        order.status === 'Paid / Confirmed' ? 'bg-emerald-500/20 text-emerald-300' :
                        order.status === 'Shipped' ? 'bg-sky-500/20 text-sky-300' :
                        order.status === 'Delivered' ? 'bg-emerald-600/30 text-emerald-200' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Link
                        to={`/admin/orders?orderId=${order.id}`}
                        className="p-1.5 bg-slate-700 hover:bg-sky-500 hover:text-white rounded-lg inline-flex items-center gap-1 text-[11px]"
                      >
                        <Eye size={13} />
                        <span>فحص</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Catalog Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">قسم الكتب الخارجية (Books)</div>
          <div className="text-xl font-bold text-white">
            {products.filter(p => p.category === 'Books').length} كتاب متاح
          </div>
          <p className="text-[11px] text-slate-400">ثانوية عامة، أولى وتانية ثانوي، وبكالوريا</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">قسم الكشاكيل والملخصات (Notebooks)</div>
          <div className="text-xl font-bold text-white">
            {products.filter(p => p.category === 'Notebooks').length} إصدارات حصرية
          </div>
          <p className="text-[11px] text-slate-400">سلك مقسم، كورنيل، رسم بياني، وملاحظات جيبية</p>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase">أكواد المنصات التعليمية (Teacher Codes)</div>
          <div className="text-xl font-bold text-white">
            {products.filter(p => p.category === 'Teacher Codes').length} مدرسين معتمدين
          </div>
          <p className="text-[11px] text-slate-400">تفعيل فوري لمنصات كبار أساتذة الثانوية</p>
        </div>
      </div>

    </div>
  );
};
