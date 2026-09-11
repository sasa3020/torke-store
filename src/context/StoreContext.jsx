import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_STAFF, INITIAL_USER, INITIAL_FAQS } from '../data/initialData';

export const DEFAULT_THEME = {
  // Brand & Identity
  storeName: 'Torke Store',
  storeNameAr: 'متجر تركي لطلاب الثانوية',
  logoText: 'Torke',
  logoHighlight: 'Store',
  
  // Announcement Bar
  announcementText: 'خصومات بداية العام لطلبة الثانوية العامة والبكالوريا! شحن سريع لباب بيتك 🚀',
  announcementBg: '#0284c7',
  
  // Section Visibility Controls (إظهار وإخفاء أقسام المتجر)
  showAnnouncement: true,
  showHero: true,
  showCategories: true,
  showBestSellers: true,
  showTeacherCodesBanner: true,
  showFaq: true,
  showSocialPromo: true,

  // Customizable Section Headers
  bestSellersTitle: 'مستلزمات تفوقك في الثانوية العامة',
  bestSellersBadge: 'الأكثر طلباً هذا الأسبوع',
  teacherCodesTitle: 'اشحن رصيد منصات كبار المدرسين في دقائق',
  teacherCodesBadge: 'أكواد المنصات التعليمية الرسمية',
  teacherCodesSubtitle: 'لا داعي للانتظار في السنتر أو مشاكل الدفع الإلكتروني. اختر المدرس، أتمم طلبك، واستلم كود التفعيل الفوري مع الدعم الفني.',

  // Header & Navigation Bar Controls (شريط التنقل العلوي والقوائم)
  navHomeLabel: 'الرئيسية',
  showNavHome: true,
  navNotebooksLabel: 'Notebooks',
  navNotebooksLabelAr: 'كشاكيل وملخصات',
  showNavNotebooks: true,
  navBooksLabel: 'Books',
  navBooksLabelAr: 'كتب خارجية',
  showNavBooks: true,
  navCodesLabel: 'Teacher Codes',
  navCodesLabelAr: 'أكواد المنصات',
  navCodesBadge: 'فوري ⚡',
  showNavCodes: true,
  navAllProductsLabel: 'كل المنتجات',
  showNavAllProducts: true,
  showSearchInHeader: true,
  searchPlaceholder: 'ابحث عن كتاب، كشكول، أو كود مدرس (مثل المعاصر، عبد المعبود)...',

  // Typography & Aesthetics
  fontFamily: 'Cairo', // 'Cairo' | 'Alexandria' | 'Tajawal' | 'Almarai' | 'Readex Pro'
  fontSizeScale: '100%', // '90%' | '100%' | '110%'
  primaryColor: '#0284c7',
  accentColor: '#00BFFF',
  bgColor: '#f8fafc',
  borderRadius: '16px',

  // Hero Section
  heroBadge: 'الوجهة الرسمية لطلبة الثانوية العامة والبكالوريا في مصر 🎓',
  heroTitle: 'كل ما تحتاجه للثانوية في مكان واحد مع',
  heroHighlight: 'Torke Store',
  heroSubtitle: 'كتبك الخارجية المعتمدة، كشاكيل التلخيص بنظام كورنيل، وأكواد شحن منصات كبار مدرسي مصر بتوصيل صاروخي لباب بيتك!',
  heroCtaPrimary: 'تصفح كل المنتجات الآن',
  heroCtaSecondary: 'أكواد المنصات الفورية',
  badge1: 'شحن صاروخي خلال 24-48 ساعة',
  badge2: 'كتب أصلية معتمدة 100%',
  badge3: 'تفعيل فوري لأكواد المدرسين',
  badge4: 'استبدال مجاني في حال أي تلف',

  // Checkout & Payment (Vodafone Cash)
  vodafoneNumber: '01031361897',
  vodafoneInstructions: 'يرجى تحويل المبلغ الإجمالي عبر محفظة فودافون كاش إلى الرقم المعتمد أدناه، ثم رفع صورة إيصال التحويل (Screenshot) لتأكيد حجزك:',
  standardShippingRate: 85,
  expressShippingRate: 220,
  standardShippingName: 'الشحن القياسي (Standard)',
  standardShippingTime: 'التوصيل خلال يومين إلى 10 أيام عمل',
  expressShippingName: 'شحن صاروخ (Express Rocket)',
  expressShippingTime: 'خلال يوم إلى 3 أيام فقط',

  // Support & Social Media
  whatsappNumber: '+20 15 15856581',
  whatsappOrdersNumber: '+201515856581', // رقم استقبال إشعارات الطلبات الجديدة
  socialPromoTitle: 'Follow us on social media—you might get a free gift with your package! 🌚',
  socialPromoSubtitle: 'تابعنا على صفحاتنا الرسمية وقناة الواتساب لتدخل السحب على هدايا مجانية وملازم حصرية مع كل أوردر!',
  facebookUrl: 'https://www.facebook.com/share/1GpZ82sdxr/',
  instagramUrl: 'https://www.instagram.com/torke.stor?igsh=MWxleHRzcmZndm5tNg==',
  whatsappChannelUrl: 'https://whatsapp.com/channel/0029VbCCfr9EgGfHFSx37T2X',

  // Footer
  footerDesc: 'المتجر الأول المتخصص لخدمة طلبة الثانوية العامة والبكالوريا في مصر. نوفر الكتب الخارجية، كشاكيل التلخيص بنظام كورنيل، وأكواد كبار مدرسي المنصات بأسرع توصيل.',
  copyrightText: 'Torke Store. All rights reserved. صنع بكل حب لطلبة الثانوية في مصر 🇪🇬'
};

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // 0. Dynamic Theme & Appearance State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('torke_theme_settings');
    if (saved) {
      try { return { ...DEFAULT_THEME, ...JSON.parse(saved) }; } catch (e) { console.error(e); }
    }
    return DEFAULT_THEME;
  });

  useEffect(() => {
    localStorage.setItem('torke_theme_settings', JSON.stringify(theme));
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--site-font', `'${theme.fontFamily}', sans-serif`);
      document.documentElement.style.setProperty('--theme-primary', theme.primaryColor);
      document.documentElement.style.setProperty('--theme-accent', theme.accentColor);
      document.documentElement.style.setProperty('--theme-radius', theme.borderRadius);
    }
  }, [theme]);

  const updateTheme = (newSettings) => {
    setTheme(prev => ({ ...prev, ...newSettings }));
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
  };

  // 1. Products Catalog State (Synced with localStorage)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('torke_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('torke_products', JSON.stringify(products));
  }, [products]);

  // 2. Shopping Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('torke_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('torke_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart Helpers
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock || 99) }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // 3. User Authentication & Profile Persistence
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('torke_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Purge demo user "عمر خالد المصري" or "user-demo-1"
          return parsed.filter(u => u && u.id !== 'user-demo-1' && !u.fullName?.includes('عمر خالد'));
        }
      } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('torke_users', JSON.stringify(users));
  }, [users]);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('torke_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.id === 'user-demo-1' || parsed.fullName?.includes('عمر خالد'))) {
          localStorage.removeItem('torke_current_user');
          return null;
        }
        return parsed;
      } catch (e) { console.error(e); }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('torke_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('torke_current_user');
    }
  }, [currentUser]);

  const registerUser = (userData) => {
    // userData: { fullName, primaryPhone, altPhone, address, grade, password, email }
    const phone = userData.primaryPhone?.trim();
    if (!phone) {
      return { success: false, message: 'يرجى إدخال رقم هاتف أساسي صحيح' };
    }

    const phoneExists = users.some(u => u.primaryPhone && u.primaryPhone.trim() === phone);
    if (phoneExists) {
      return { success: false, message: 'رقم الهاتف مسجل مسبقاً! يمكنك تسجيل الدخول به مباشرة.' };
    }

    const newUser = {
      ...userData,
      primaryPhone: phone,
      id: `user-${Date.now()}`,
      registeredAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const loginUser = (phoneOrEmail, password) => {
    const cleanId = (phoneOrEmail || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'يرجى إدخال رقم الهاتف / البريد الإلكتروني وكلمة المرور' };
    }

    const found = users.find(u =>
      (u.primaryPhone === cleanId || (u.email && u.email.toLowerCase() === cleanId.toLowerCase())) &&
      u.password === cleanPass
    );

    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }

    return { 
      success: false, 
      message: 'رقم الهاتف أو كلمة المرور غير صحيحة! يرجى التحقق من البيانات أو إنشاء حساب جديد.' 
    };
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
  };

  // 4. Orders Management State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('torke_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out orders associated with the old demo user "عمر خالد المصري"
          return parsed.filter(o => !o.customer?.fullName?.includes('عمر خالد'));
        }
      } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('torke_orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = ({ customer, items, shippingMethod, shippingCost, subtotal, grandTotal, receiptImage, notes }) => {
    const newOrder = {
      id: `TRK-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      customer: {
        ...customer,
        notes: notes || ''
      },
      items: [...items],
      shippingMethod,
      shippingCost,
      subtotal,
      grandTotal,
      paymentMethod: 'Vodafone Cash',
      vodafoneTransferNumber: '01031361897',
      receiptImage: receiptImage || null,
      status: 'Preparing'
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev =>
      prev.map(order => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  // 5. Product Management (CRUD for Admin)
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (productId, updatedFields) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // 6. Staff / Team Management
  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('torke_staff');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_STAFF;
  });

  useEffect(() => {
    localStorage.setItem('torke_staff', JSON.stringify(staff));
  }, [staff]);

  const addStaff = (memberData) => {
    const newMember = {
      ...memberData,
      id: `staff-${Date.now()}`,
      dateJoined: new Date().toISOString().split('T')[0]
    };
    setStaff(prev => [...prev, newMember]);
    return newMember;
  };

  const updateStaff = (id, updatedFields) => {
    setStaff(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updatedFields } : m))
    );
  };

  const deleteStaff = (id) => {
    setStaff(prev => prev.filter(m => m.id !== id));
  };

  // 6b. Staff Authentication (Role-Based Access Control)
  // Permissions map: which pages each role can access
  const ROLE_PERMISSIONS = {
    'Super Admin':  { dashboard: true, orders: true, products: true, pages: true, team: true, theme: true },
    'Developer':    { dashboard: true, orders: true, products: true, pages: true, team: true, theme: true },
    'Management':   { dashboard: true, orders: true, products: true, pages: true, team: true, theme: true },
    'Sales':        { dashboard: true, orders: true, products: true, pages: false, team: false, theme: false },
    'Order Manager':       { dashboard: true, orders: true, products: false, pages: false, team: false, theme: false },
    'Catalog Specialist':  { dashboard: true, orders: false, products: true, pages: false, team: false, theme: false },
    'Customer Support':    { dashboard: true, orders: true, products: false, pages: false, team: false, theme: false },
  };

  const [currentStaff, setCurrentStaff] = useState(() => {
    const saved = localStorage.getItem('torke_current_staff');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  useEffect(() => {
    if (currentStaff) {
      localStorage.setItem('torke_current_staff', JSON.stringify(currentStaff));
    } else {
      localStorage.removeItem('torke_current_staff');
    }
  }, [currentStaff]);

  const staffLogin = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const found = staff.find(m =>
      m.email.toLowerCase() === cleanEmail && m.password === cleanPass
    );
    if (found) {
      setCurrentStaff(found);
      return { success: true, member: found };
    }
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة!' };
  };

  const staffLogout = () => {
    setCurrentStaff(null);
  };

  const getStaffPermissions = (role) => {
    return ROLE_PERMISSIONS[role] || { dashboard: true, orders: false, products: false, pages: false, team: false, theme: false };
  };

  // 7. UI Drawers & Modals
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  const openLoginModal = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  return (
    <StoreContext.Provider
      value={{
        // Dynamic Theme
        theme,
        updateTheme,
        resetTheme,

        // Products
        products,
        addProduct,
        updateProduct,
        deleteProduct,

        // Cart
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,

        // Auth & Users
        currentUser,
        users,
        registerUser,
        loginUser,
        logoutUser,
        updateProfile,

        // Orders
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,

        // Staff
        staff,
        addStaff,
        updateStaff,
        deleteStaff,

        // Staff Auth & RBAC
        currentStaff,
        staffLogin,
        staffLogout,
        getStaffPermissions,
        ROLE_PERMISSIONS,

        // Modals & Drawers
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openLoginModal,
        openRegisterModal
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
