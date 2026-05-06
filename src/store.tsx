import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Lang, Order } from './types';
import translations from './i18n';
import { getProducts, saveProducts, getOrders, saveOrders, getCoupons } from './data';
import toast from 'react-hot-toast';

interface StoreContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dark: boolean;
  toggleDark: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  isAdmin: boolean;
  adminLogin: (user: string, pass: string) => boolean;
  adminLogout: () => void;
  applyCoupon: (code: string) => { valid: boolean; discount: number; type: string };
}

const StoreContext = createContext<StoreContextType | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

// Admin credentials validated at login time

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('vantage_lang') as Lang) || 'en';
  });
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('vantage_dark') === 'true';
  });
  const [products, setProducts] = useState<Product[]>(() => getProducts());
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('vantage_cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const stored = localStorage.getItem('vantage_wishlist');
    return stored ? JSON.parse(stored) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => getOrders());
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('vantage_admin') === 'true';
  });

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vantage_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vantage_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('vantage_dark', String(dark));
    if (dark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [dark]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('vantage_lang', l);
    if (l === 'ar') {
      document.body.classList.add('rtl');
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.body.classList.remove('rtl');
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  };

  useEffect(() => {
    if (lang === 'ar') {
      document.body.classList.add('rtl');
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    }
  }, []);

  const t = (key: string): string => {
    return (translations[lang] as any)?.[key] || key;
  };

  const toggleDark = () => setDark(d => !d);

  const addToCart = (p: Product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === p.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === p.id
            ? { ...item, quantity: Math.min(item.quantity + qty, p.stock) }
            : item
        );
      }
      return [...prev, { product: p, quantity: qty }];
    });
    toast.success(t('itemAdded'), { style: { background: dark ? '#1A1A1A' : '#fff', color: dark ? '#fff' : '#0B0B0B', border: '1px solid #D4AF37' } });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
    toast.success(t('itemRemoved'), { style: { background: dark ? '#1A1A1A' : '#fff', color: dark ? '#fff' : '#0B0B0B' } });
  };

  const updateCartQty = (id: string, qty: number) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(item =>
      item.product.id === id ? { ...item, quantity: qty } : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      if (prev.includes(id)) {
        toast.success(t('removedFromWishlist'), { style: { background: dark ? '#1A1A1A' : '#fff', color: dark ? '#fff' : '#0B0B0B' } });
        return prev.filter(i => i !== id);
      }
      toast.success(t('addedToWishlist'), { style: { background: dark ? '#1A1A1A' : '#fff', color: dark ? '#fff' : '#0B0B0B', border: '1px solid #D4AF37' } });
      return [...prev, id];
    });
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const adminLogin = (user: string, pass: string): boolean => {
    // Simple auth: username "admin", password "admin123"
    // In production, this would be server-side
    if (user === 'admin' && pass === 'admin123') {
      setIsAdmin(true);
      sessionStorage.setItem('vantage_admin', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('vantage_admin');
  };

  const applyCoupon = (code: string) => {
    const coupons = getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (coupon) {
      return { valid: true, discount: coupon.discount, type: coupon.type };
    }
    return { valid: false, discount: 0, type: '' };
  };

  return (
    <StoreContext.Provider value={{
      lang, setLang, t, dark, toggleDark,
      products, setProducts,
      cart, addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount,
      wishlist, toggleWishlist, isInWishlist,
      orders, addOrder, updateOrderStatus,
      isAdmin, adminLogin, adminLogout,
      applyCoupon,
    }}>
      {children}
    </StoreContext.Provider>
  );
}
