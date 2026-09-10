import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const faqs = [
    {
      q: 'How to order? (كيفية الطلب من متجر تورك؟)',
      a: 'الطلب بسيط وسريع جداً:\n1. اختر الكتب، الكشاكيل، أو أكواد المدرسين التي تحتاجها واضغط "إضافة للسلة".\n2. افتح السلة واضغط على "المتابعة لإنهاء الطلب (Checkout)".\n3. اكتب بيانات التوصيل بدقة (الاسم، العنوان، ورقم الهاتف الأساسي والبديل).\n4. اختر وسيلة الشحن المناسبة (عادي أو صاروخ)، ثم اتبع تعليمات الدفع المعروضة في صفحة الدفع وارفع صورة إيصال التحويل لتأكيد حجزك فوراً.'
    },
    {
      q: 'Available payment methods? (ما هي طرق الدفع المتاحة؟)',
      a: 'الوسيلة المعتمدة والمفضلة لطلابنا هي التحويل الإلكتروني عبر (Vodafone Cash). يتم إظهار رقم التحويل المعتمد حصرياً في صفحة الدفع والتشيك آوت (Checkout Page) عند تأكيد الطلب فقط لضمان سلامة العمليات ومطابقة الإيصالات، حيث يقوم الطالب برفع لقطة شاشة (Screenshot) للإيصال ليتم مراجعتها واعتماد الطلب فورياً.'
    },
    {
      q: 'Delivery timeframes? (كم تستغرق مدة توصيل الشحنة؟)',
      a: 'نوفر خيارين للشحن بما يناسب جدول مذاكرتك:\n• الشحن السريع بالصاروخ (Express "Rocket" Shipping): يتم التوصيل خلال 24 إلى 48 ساعة كحد أقصى (تكلفة 220 ج.م).\n• الشحن القياسي (Standard Shipping): يتم التوصيل خلال 3 إلى 5 أيام عمل لجميع المحافظات (تكلفة 85 ج.م).\n* بالنسبة لأكواد المدرسين: يتم إرسال كود المنصة فور مراجعة إيصال التحويل خلال دقائق عبر الواتساب ورسائل الموقع!'
    },
    {
      q: 'Can I replace a damaged order? (هل يمكنني استبدال الطلب في حال وجود تلف؟)',
      a: 'نعم بكل تأكيد! نحن نضمن لك سلامة الكتب والكشاكيل 100%. إذا استلمت أي كتاب به خطأ في الطباعة أو كشكول تالف بسبب الشحن، تواصل فوراً مع خدمة العملاء عبر الواتساب مع تصوير التلف، وسنقوم بإرسال نسخة جديدة بديلة لك مجاناً بالكامل دون أي مصاريف إضافية.'
    },
    {
      q: 'How to contact support? (كيف أتواصل مع الدعم الفني لمتجر تورك؟)',
      a: 'فريق خدمة طلاب تورك متاح يومياً لمساعدتك:\n• عبر الواتساب المباشر: +20 15 15856581\n• عبر رسائل صفحتنا الرسمية على الفيسبوك أو الإنستجرام\n• قنوات التليجرام والواتساب لمتابعة كل جديد وأكواد الحصص.'
    }
  ];

  return (
    <section id="faq-section" className="py-16 bg-white border-t border-sky-100">
      <div className="container max-w-4xl">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide">
            <HelpCircle size={15} />
            <span>الأسئلة الأكثر شيوعاً بين طلابنا</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            كل ما يخص الشحن، الملازم، أكواد المنصات وضمان الاستبدال تجده هنا بالتفصيل.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-sky-300 bg-sky-50/40 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-sky-200'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full text-right px-6 py-4.5 flex items-center justify-between gap-4 font-bold text-slate-800 text-base sm:text-lg focus:outline-none"
                >
                  <span className="flex-1">{faq.q}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'bg-sky-500 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-sky-100/60 whitespace-pre-line animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
