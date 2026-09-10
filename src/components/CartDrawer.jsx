import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer = () => {
  const { 
    cart, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal 
  } = useStore();

  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-fade-in">
          
          {/* Header */}
          <div className="px-6 py-5 bg-sky-50 border-b border-sky-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-sky-600" size={22} />
              <h2 className="text-lg font-bold text-slate-900">سلة المشتريات</h2>
              <span className="bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>
            <button 
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center text-sky-400">
                  <ShoppingBag size={40} />
                </div>
                <h3 className="text-base font-bold text-slate-700">سلتك فارغة حالياً</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  ابدأ بإضافة كتب الثانوية العامة، كشاكيل التلخيص، أو أكواد منصات مدرسي المواد المفضلة لديك!
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-start">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded-xl border border-sky-100 bg-sky-50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                      {item.category}
                    </span>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="text-sm font-extrabold text-sky-700">
                        {item.price} ج.م
                      </div>
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-sky-100 text-slate-600"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-sky-100 text-slate-600"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                    title="إزالة من السلة"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="px-6 py-5 bg-sky-50/50 border-t border-sky-100 space-y-4">
              <div className="flex items-center justify-between text-base">
                <span className="font-medium text-slate-600">المجموع الفرعي:</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {cartSubtotal} ج.م
                </span>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                * مصاريف الشحن ورقم فودافون كاش للتأكيد يتم احتسابها في خطوة إتمام الطلب.
              </p>
              <button
                onClick={handleCheckoutClick}
                className="w-full btn btn-primary py-3.5 text-base font-bold shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
              >
                <span>المتابعة لإنهاء الطلب (Checkout)</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
