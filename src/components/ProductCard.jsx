import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, CheckCircle2, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-sky-100 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Top Badges */}
      <div className="absolute top-3 right-3 left-3 z-10 flex items-center justify-between pointer-events-none">
        {product.badge ? (
          <span className="bg-sky-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {product.badge}
          </span>
        ) : <span />}

        {discountPercent > 0 && (
          <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-sky-50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.category === 'Teacher Codes' && (
          <div className="absolute bottom-2 left-2 bg-slate-900/85 backdrop-blur-sm text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-500/30">
            <Zap size={11} className="text-amber-400" />
            <span>كود منصة فوري (بدون شحن ⚡)</span>
          </div>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Category & Grade Tag */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            {product.grade && (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {product.grade}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Teacher Tag if applicable */}
          {product.teacher && (
            <p className="text-xs text-sky-700 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 size={13} className="text-sky-500" />
              <span>مدرس المادة: {product.teacher}</span>
            </p>
          )}

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900">
                {product.price}
              </span>
              <span className="text-xs font-bold text-sky-600">ج.م</span>
            </div>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                {product.originalPrice} ج.م
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-md shadow-sky-400/20 active:scale-95"
            title="إضافة إلى السلة"
          >
            <ShoppingBag size={15} />
            <span className="hidden xs:inline">أضف للسلة</span>
          </button>
        </div>

      </div>

    </div>
  );
};
