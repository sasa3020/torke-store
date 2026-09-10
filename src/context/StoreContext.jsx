import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_STAFF, INITIAL_USER } from '../data/initialData';

export const DEFAULT_THEME = {
  // Brand & Identity
  storeName: 'Torke Store',
  storeNameAr: 'متجر تورك لطلاب الثانوية',
  logoText: 'Torke',
  logoHighlight: 'Store',
  
  // Announcement Bar
  showAnnouncement: true,
  announcementText: 'خصومات بداية العام لطلبة الثانوية العامة والبكالوريا! شحن سريع لباب بيتك 🚀',
  announcementBg: '#0284c7',
  
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
  standardShippingTime: 'التوصيل خلال 3 إلى 5 أيام عمل',
  expressShippingName: 'شحن صاروخ (Express Rocket)',
  expressShippingTime: 'خلال 24 إلى 48 ساعة فقط',

  // Support & Social Media
  whatsappNumber: '+20 15 15856581',
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
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [INITIAL_USER];
  });

  useEffect(() => {
    localStorage.setItem('torke_users', JSON.stringify(users));
  }, [users]);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('torke_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_USER; // Default to realistic student demo so checkout is ready to test immediately
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
    const newUser = {
      ...userData,
      id: `user-${Date.now()}`,
      registeredAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const loginUser = (phoneOrEmail, password) => {
    const found = users.find(u =>
      (u.primaryPhone === phoneOrEmail || u.email === phoneOrEmail) &&
      (!u.password || u.password === password || password === 'student123')
    );
    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }
    // Fallback allowing quick demo login
    const demoUser = {
      id: `user-${Date.now()}`,
      fullName: phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'طالب الثانوية',
      primaryPhone: phoneOrEmail,
      altPhone: '01122334455',
      address: 'القاهرة - مصر',
      grade: '3rd Secondary',
      registeredAt: new Date().toISOString()
    };
    setCurrentUser(demoUser);
    setUsers(prev => [...prev, demoUser]);
    return { success: true, user: demoUser };
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
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Realistic initial sample order for demonstration in admin
    return [
      {
        id: 'TRK-89241',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        customer: {
          fullName: 'عمر خالد المصري',
          primaryPhone: '01012345678',
          altPhone: '01198765432',
          address: 'عمارة 14، شارع جامعة القاهرة، حي الدقي، محافظة الجيزة - شقة 5',
          grade: '3rd Secondary',
          notes: 'يرجى الاتصال قبل الوصول بنصف ساعة'
        },
        items: [
          {
            id: 'prod-b1',
            title: 'كتاب المعاصر رياضيات بحتة - تالتة ثانوي (شرح وبنك أسئلة)',
            price: 285,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80'
          },
          {
            id: 'prod-n1',
            title: 'كشكول تورك الذكي المقسم سلك 200 صفحة (مقاوم للماء والتمزق)',
            price: 85,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=300&q=80'
          }
        ],
        shippingMethod: 'Standard Shipping',
        shippingCost: 85,
        subtotal: 455,
        grandTotal: 540,
        paymentMethod: 'Vodafone Cash',
        vodafoneTransferNumber: '01031361897',
        receiptImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
        status: 'Paid / Confirmed' // 'Pending Review' | 'Paid / Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
      }
    ];
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
      status: 'Pending Review'
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
