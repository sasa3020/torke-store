import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  X, 
  Trash2, 
  Phone, 
  MapPin, 
  FileText, 
  User, 
  ExternalLink,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminOrders = () => {
  const { orders, updateOrderStatus, deleteOrder } = useStore();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [receiptLightbox, setReceiptLightbox] = useState(null);

  // Check if opened from Dashboard with ?orderId=
  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      const found = orders.find(o => o.id === orderIdParam);
      if (found) setSelectedOrder(found);
    }
  }, [searchParams, orders]);

  // Keep selected order in sync if status changes
  useEffect(() => {
    if (selectedOrder) {
      const refreshed = orders.find(o => o.id === selectedOrder.id);
      if (refreshed) setSelectedOrder(refreshed);
    }
  }, [orders]);

  const filteredOrders = orders.filter(o => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchSearch = !searchQuery.trim() ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.primaryPhone.includes(searchQuery) ||
      (o.customer.altPhone && o.customer.altPhone.includes(searchQuery));

    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid / Confirmed':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold">تم تأكيد الدفع ✔</span>;
      case 'Shipped':
        return <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold">جاري الشحن 🚚</span>;
      case 'Delivered':
        return <span className="bg-emerald-600/30 text-emerald-200 border border-emerald-600/40 px-2.5 py-0.5 rounded-full text-xs font-bold">تم التسليم 📦</span>;
      case 'Cancelled':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold">ملغي ✖</span>;
      default:
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold">قيد المراجعة ⏳</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">إدارة وفحص طلبات الطلاب</h1>
          <p className="text-xs text-slate-400 mt-1">
            مراجعة إيصالات تحويل فودافون كاش وتحديث حالات الشحن الفوري ({filteredOrders.length} طلب)
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث بالاسم، رقم الطلب، أو الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white pl-8 focus:border-sky-500"
            />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white cursor-pointer focus:border-sky-500"
          >
            <option value="All">جميع الحالات</option>
            <option value="Pending Review">قيد المراجعة (Pending)</option>
            <option value="Paid / Confirmed">تم تأكيد الدفع (Paid)</option>
            <option value="Shipped">جاري الشحن (Shipped)</option>
            <option value="Delivered">تم التسليم (Delivered)</option>
            <option value="Cancelled">ملغي (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <p className="font-bold text-sm">لم يتم العثور على طلبات مطابقة للبحث.</p>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
              className="text-sky-400 hover:underline"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-700 text-slate-400 font-bold">
                  <th className="py-3 px-4">رقم الطلب</th>
                  <th className="py-3 px-4">الطالب والمرحلة</th>
                  <th className="py-3 px-4">الهاتف والتواصل</th>
                  <th className="py-3 px-4">قيمة الطلب</th>
                  <th className="py-3 px-4">طريقة الشحن</th>
                  <th className="py-3 px-4">إيصال فودافون كاش</th>
                  <th className="py-3 px-4">حالة الطلب</th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-300">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                      {order.id}
                      <div className="text-[10px] text-slate-500 font-normal">
                        {new Date(order.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{order.customer.fullName}</div>
                      <div className="text-[11px] text-sky-400 font-medium">{order.customer.grade || 'ثانوية عامة'}</div>
                    </td>

                    <td className="py-3.5 px-4 dir-ltr text-right">
                      <div className="font-semibold text-slate-200">{order.customer.primaryPhone}</div>
                      {order.customer.altPhone && (
                        <div className="text-[10px] text-slate-400">بديل: {order.customer.altPhone}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-black text-white text-sm">{order.grandTotal} ج.م</span>
                      <div className="text-[10px] text-slate-400">{order.items.length} أصناف</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        order.shippingMethod.includes('Rocket')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {order.shippingMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {order.receiptImage ? (
                        <button
                          onClick={() => setReceiptLightbox(order.receiptImage)}
                          className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-700 rounded-lg hover:border-sky-400 transition-all text-[11px] text-sky-400 font-bold group"
                        >
                          <img
                            src={order.receiptImage}
                            alt="Receipt"
                            className="w-7 h-7 object-cover rounded"
                          />
                          <span className="group-hover:underline">معاينة الإيصال</span>
                        </button>
                      ) : (
                        <span className="text-rose-400 text-[11px] font-bold">لا يوجد إيصال</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn btn-sm bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white rounded-lg px-2.5 py-1.5 font-bold flex items-center gap-1 mx-auto transition-all"
                      >
                        <Eye size={13} />
                        <span>تفاصيل</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================
          Order Details Modal
         ======================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base font-mono font-black text-sky-400">{selectedOrder.id}</span>
                <span className="text-xs text-slate-400">|</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1 text-slate-300">
              
              {/* Quick Status Updater */}
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-white">تحديث حالة هذا الطلب:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'Pending Review', label: 'قيد المراجعة ⏳' },
                    { id: 'Paid / Confirmed', label: 'تم تأكيد الدفع ✔' },
                    { id: 'Shipped', label: 'جاري الشحن 🚚' },
                    { id: 'Delivered', label: 'تم التسليم 📦' },
                    { id: 'Cancelled', label: 'إلغاء الطلب ✖' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => updateOrderStatus(selectedOrder.id, s.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        selectedOrder.status === s.id
                          ? 'bg-sky-500 text-white shadow-md'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Details Box */}
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-2.5">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={14} />
                  <span>بيانات الطالب والشحن</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">اسم الطالب:</span>
                    <strong className="text-white text-sm">{selectedOrder.customer.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">المرحلة الدراسية:</span>
                    <strong className="text-white">{selectedOrder.customer.grade || 'ثانوية عامة'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">رقم الهاتف الأساسي:</span>
                    <strong className="text-white dir-ltr block">{selectedOrder.customer.primaryPhone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">رقم الهاتف البديل:</span>
                    <strong className="text-white dir-ltr block">{selectedOrder.customer.altPhone || 'غير متوفر'}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <span className="text-slate-400 block text-[11px]">العنوان التفصيلي:</span>
                  <p className="text-slate-200 font-medium">{selectedOrder.customer.address}</p>
                </div>

                {selectedOrder.customer.notes && (
                  <div className="pt-2 border-t border-slate-700">
                    <span className="text-amber-400 block text-[11px] font-bold">ملاحظات الطالب:</span>
                    <p className="text-amber-200">{selectedOrder.customer.notes}</p>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">الأصناف المطلوبة:</h4>
                <div className="divide-y divide-slate-700 bg-slate-800/40 rounded-2xl p-3 border border-slate-700">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img src={item.image} alt={item.title} className="w-10 h-12 object-cover rounded-lg bg-slate-900 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-white line-clamp-1">{item.title}</div>
                          <div className="text-[10px] text-slate-400">الكمية: {item.quantity} × {item.price} ج.م</div>
                        </div>
                      </div>
                      <div className="font-extrabold text-white whitespace-nowrap">
                        {item.price * item.quantity} ج.م
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>المجموع الفرعي:</span>
                  <span className="text-white">{selectedOrder.subtotal} ج.م</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>مصاريف الشحن ({selectedOrder.shippingMethod}):</span>
                  <span className="text-sky-400">+{selectedOrder.shippingCost} ج.م</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-white">
                  <span>المبلغ الإجمالي المدفوع:</span>
                  <span className="text-emerald-400 text-base">{selectedOrder.grandTotal} ج.م</span>
                </div>
              </div>

              {/* Vodafone Cash Receipt Screenshot Preview */}
              <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={15} />
                    <span>إيصال تحويل فودافون كاش المرفق (Vodafone Cash Receipt)</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    المحول إليه: {selectedOrder.vodafoneTransferNumber || '01031361897'}
                  </span>
                </div>

                {selectedOrder.receiptImage ? (
                  <div className="space-y-2 text-center">
                    <div
                      onClick={() => setReceiptLightbox(selectedOrder.receiptImage)}
                      className="cursor-pointer max-w-xs mx-auto border-2 border-slate-600 hover:border-sky-400 rounded-xl overflow-hidden relative group transition-all"
                    >
                      <img
                        src={selectedOrder.receiptImage}
                        alt="Payment Receipt"
                        className="w-full h-48 object-contain bg-black/40 group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-xs transition-opacity">
                        <span>🔍 اضغط للتكبير والفحص</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-rose-400 font-bold text-center py-2">
                    لم يقم الطالب برفع إيصال تحويل لهذا الطلب بعد.
                  </p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  if (window.confirm('هل أنت متأكد من حذف هذا الطلب نهائياً؟')) {
                    deleteOrder(selectedOrder.id);
                    setSelectedOrder(null);
                  }
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold"
              >
                <Trash2 size={15} />
                <span>حذف الطلب</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          Receipt Lightbox Modal (Full Screen View)
         ======================================================== */}
      {receiptLightbox && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in cursor-pointer"
          onClick={() => setReceiptLightbox(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-slate-900 p-2 rounded-2xl border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setReceiptLightbox(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
            >
              <X size={20} />
            </button>
            <img
              src={receiptLightbox}
              alt="Full Receipt"
              className="max-h-[85vh] max-w-full rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}

    </div>
  );
};
