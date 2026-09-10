import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Star, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Zap, 
  Plus, 
  Minus,
  Check,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">عفواً، هذا المنتج غير متوفر حالياً</h2>
        <p className="text-sm text-slate-500">ربما تم تغيير الرابط أو نفاد الكمية.</p>
        <Link to="/products" className="btn btn-primary">
          العودة للكتالوج
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container py-8 sm:py-12 space-y-12">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <Link to="/" className="hover:text-sky-600">الرئيسية</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-sky-600">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-sky-100 shadow-sm">
        
        {/* Left/Image Area */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sky-50 border border-sky-100 relative">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 right-4 bg-sky-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100 flex flex-col items-center gap-1">
              <Truck size={18} className="text-sky-600" />
              <span className="font-bold text-slate-800">شحن سريع</span>
              <span className="text-[10px] text-slate-500">24-48 ساعة</span>
            </div>
            <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100 flex flex-col items-center gap-1">
              <ShieldCheck size={18} className="text-emerald-600" />
              <span className="font-bold text-slate-800">أصلي 100%</span>
              <span className="text-[10px] text-slate-500">طباعة معتمدة</span>
            </div>
            <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100 flex flex-col items-center gap-1">
              <Zap size={18} className="text-amber-500" />
              <span className="font-bold text-slate-800">دعم مباشر</span>
              <span className="text-[10px] text-slate-500">عبر الواتساب</span>
            </div>
          </div>
        </div>

        {/* Right/Details Area */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.subCategory && (
                <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
                  {product.subCategory}
                </span>
              )}
              {product.grade && (
                <span className="bg-sky-50 text-sky-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {product.grade}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.title}
            </h1>

            {/* English Title if available */}
            {product.titleEn && (
              <p className="text-xs text-slate-400 font-medium">
                {product.titleEn}
              </p>
            )}

            {/* Teacher Details Box */}
            {product.teacher && (
              <div className="p-4 bg-sky-50/80 rounded-2xl border border-sky-200/80 space-y-1">
                <div className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-sky-500" />
                  <span>المدرس المعتمد: {product.teacher}</span>
                </div>
                <p className="text-xs text-slate-600">
                  المنصة: <strong className="text-slate-800">{product.platform}</strong> - يتم إرسال كود التفعيل الفوري مع الدعم الفني بعد تأكيد الدفع.
                </p>
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-700">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewsCount} تقييم من الطلاب)</span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                متوفر بالمخزن ({product.stock || 50} قطعة)
              </span>
            </div>

            {/* Price Box */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                {product.price}
              </span>
              <span className="text-base font-bold text-sky-600">جنيه مصري (EGP)</span>
              {product.originalPrice && (
                <span className="text-base text-slate-400 line-through">
                  {product.originalPrice} ج.م
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Features List */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">مميزات هذا الإصدار:</h4>
                <ul className="space-y-1.5">
                  {product.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check size={14} className="text-emerald-500 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Actions: Quantity + Add to Cart */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              
              {/* Quantity selector */}
              <div className="flex items-center justify-between sm:justify-start border border-slate-200 rounded-xl p-1 bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-5 text-sm font-extrabold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-white rounded-lg text-slate-600 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 btn btn-primary py-3.5 text-base font-bold shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                <span>إضافة إلى السلة ({product.price * quantity} ج.م)</span>
              </button>
            </div>

            {addedToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
                <Check size={16} />
                <span>تمت الإضافة بنجاح إلى سلة المشتريات! يمكنك إتمام الطلب الآن.</span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">منتجات مقترحة لدفعتك</h3>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-xs font-bold text-sky-600 hover:underline">
              عرض المزيد من {product.category}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
