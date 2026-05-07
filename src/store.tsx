import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Lang, Order } from './types';
import translations from './i18n';
import { getProducts, getOrders, getCoupons } from './data';
import toast from 'react-hot-toast';

const DB_URL = "https://extendsclass.com/api/json-storage/bin/fcededc";

interface StoreContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dark: boolean;
  toggleDark: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (p: Product, qty?: number, color?: string) => void;
  removeFromCart: (id: string, color?: string) => void;
  updateCartQty: (id: string, qty: number, color?: string) => void;
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
  syncDb: (newProducts?: Product[], newOrders?: Order[]) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('vantage_lang') as Lang) || 'en';
  });
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('vantage_dark') === 'true';
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('vantage_products');
    return stored ? JSON.parse(stored) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('vantage_cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const stored = localStorage.getItem('vantage_wishlist');
    return stored ? JSON.parse(stored) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem('vantage_orders');
    return stored ? JSON.parse(stored) : [];
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('vantage_admin') === 'true';
  });

  const syncDb = async (newProducts?: Product[], newOrders?: Order[]) => {
    try {
      const payload = {
        products: newProducts || products,
        orders: newOrders || orders
      };
      await fetch(DB_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("DB Sync Error", e);
    }
  };

  // Sync from DB on mount
  useEffect(() => {
    fetch(DB_URL)
      .then(r => r.json())
      .then(data => {
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          localStorage.setItem('vantage_products', JSON.stringify(data.products));
        }
        if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
          setOrders(data.orders);
          localStorage.setItem('vantage_orders', JSON.stringify(data.orders));
        }
      })
      .catch(e => console.error("DB Fetch Error:", e));
  }, []);

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

  const addToCart = (p: Product, qty = 1, color?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === p.id && item.selectedColor === color);
      let updatedCart;
      if (existing) {
        updatedCart = prev.map(item =>
          (item.product.id === p.id && item.selectedColor === color)
            ? { ...item, quantity: Math.min(item.quantity + qty, p.stock) }
            : item
        );
      } else {
        updatedCart = [...prev, { product: p, quantity: qty, selectedColor: color }];
      }
      localStorage.setItem('vantage_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
    toast.success(t('itemAdded'), { style: { background: dark ? '#1A1A1A' : '#fff', color: dark ? '#fff' : '#0B0B0B', border: '1px solid #D4AF37' } });
  };

  const removeFromCart = (id: string, color?: string) => {
    setCart(prev => {
      const updatedCart = prev.filter(item => !(item.product.id === id && item.selectedColor === color));
      localStorage.setItem('vantage_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
    toast.success(t('itemRemoved'), { style: { background: dark ? '#1A1A1A' : '#fff', color: dark ? '#fff' : '#0B0B0B' } });
  };

  const updateCartQty = (id: string, qty: number, color?: string) => {
    if (qty < 1) return removeFromCart(id, color);
    setCart(prev => {
      const updatedCart = prev.map(item =>
        (item.product.id === id && item.selectedColor === color) ? { ...item, quantity: qty } : item
      );
      localStorage.setItem('vantage_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('vantage_cart');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      let updatedWishlist;
      if (prev.includes(id)) {
        toast.success(t('removedFromWishlist'), { style: { background: dark ? '#1A1A1A' : '#fff', color: dark ? '#fff' : '#0B0B0B' } });
        updatedWishlist = prev.filter(i => i !== id);
      } else {
        toast.success(t('addedToWishlist'), { style: { background: dark ? '#1A1A1A' : '#fff', color: dark ? '#fff' : '#0B0B0B', border: '1px solid #D4AF37' } });
        updatedWishlist = [...prev, id];
      }
      localStorage.setItem('vantage_wishlist', JSON.stringify(updatedWishlist));
      return updatedWishlist;
    });
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  const addOrder = async (order: Order) => {
    try {
      const updatedOrders = [order, ...orders];
      setOrders(updatedOrders);
      localStorage.setItem('vantage_orders', JSON.stringify(updatedOrders));
      await syncDb(products, updatedOrders);
    } catch (error) {
      console.error("Error adding order: ", error);
      toast.error("Failed to save order to server");
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const updatedOrders = orders.map(o => o.id === id ? { ...o, status } : o);
      setOrders(updatedOrders);
      localStorage.setItem('vantage_orders', JSON.stringify(updatedOrders));
      await syncDb(products, updatedOrders);
    } catch (error) {
      console.error("Error updating order: ", error);
    }
  };

  const adminLogin = (user: string, pass: string): boolean => {
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
      applyCoupon, syncDb
    }}>
      {children}
    </StoreContext.Provider>
  );
}
