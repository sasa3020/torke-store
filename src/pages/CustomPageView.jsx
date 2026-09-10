import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { FileText, ArrowRight, AlertCircle } from 'lucide-react';

export const CustomPageView = () => {
  const { slug } = useParams();
  const { theme } = useStore();
  const customPages = theme?.customPages || [];

  const rawSlug = slug || '';
  const searchSlug = rawSlug.startsWith('/') ? rawSlug : '/' + rawSlug;

  const page = customPages.find(p => p.slug === searchSlug || p.slug === rawSlug);

  if (!page || page.visible === false) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold mb-2">الصفحة غير موجودة</h1>
        <p className="text-slate-400 text-sm mb-6">قد تكون هذه الصفحة غير متوفرة حالياً أو تم تغيير مسارها.</p>
        <Link to="/" className="btn btn-primary inline-flex items-center gap-2">
          <ArrowRight size={16} />
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{page.title}</h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">{page.slug}</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
          {page.content || 'لا يوجد محتوى في هذه الصفحة بعد.'}
        </div>
      </div>
    </div>
  );
};
