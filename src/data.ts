import { Product, Coupon } from './types';

export const CATEGORIES = [
  { id: 'mens-fashion', en: "Men's Fashion", ar: "أزياء رجالية", icon: "👔" },
  { id: 'womens-fashion', en: "Women's Fashion", ar: "أزياء نسائية", icon: "👗" },
  { id: 'electronics', en: "Electronics", ar: "إلكترونيات", icon: "📱" },
  { id: 'home-decor', en: "Home & Living", ar: "المنزل والديكور", icon: "🏠" },
  { id: 'accessories', en: "Accessories", ar: "إكسسوارات", icon: "💎" },
  { id: 'shoes', en: "Shoes", ar: "أحذية", icon: "👟" },
  { id: 'bags', en: "Bags", ar: "حقائب", icon: "👜" },
  { id: 'watches', en: "Watches", ar: "ساعات", icon: "⌚" },
];

export const GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira",
  "Fayoum", "Gharbia", "Ismailia", "Menofia", "Minya", "Qalyubia",
  "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said",
  "Damietta", "Sharkia", "South Sinai", "Kafr El Sheikh", "Matrouh",
  "Luxor", "Qena", "North Sinai", "Sohag"
];

// Generate 200+ products programmatically
function generateProducts(): Product[] {
  return [];
}


export const DEFAULT_PRODUCTS: Product[] = generateProducts();

export const DEFAULT_COUPONS: Coupon[] = [
  { code: "VANTAGE10", discount: 10, type: "percentage", active: true },
  { code: "WELCOME20", discount: 20, type: "percentage", active: true },
  { code: "SAVE50", discount: 50, type: "fixed", active: true },
];

export function getProducts(): Product[] {
  const stored = localStorage.getItem('vantage_products');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('vantage_products', JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

export function saveProducts(products: Product[]) {
  localStorage.setItem('vantage_products', JSON.stringify(products));
}

export function getOrders() {
  const stored = localStorage.getItem('vantage_orders');
  return stored ? JSON.parse(stored) : [];
}

export function saveOrders(orders: any[]) {
  localStorage.setItem('vantage_orders', JSON.stringify(orders));
}

export function getCoupons(): Coupon[] {
  const stored = localStorage.getItem('vantage_coupons');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('vantage_coupons', JSON.stringify(DEFAULT_COUPONS));
  return DEFAULT_COUPONS;
}
