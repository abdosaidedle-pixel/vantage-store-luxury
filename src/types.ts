export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  badge?: 'new' | 'sale' | 'bestseller' | 'limited';
  featured?: boolean;
  colors?: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: 'vodafone_cash' | 'cod';
  paymentScreenshot?: string;
  paymentRef?: string;
  status: 'pending' | 'approved' | 'rejected' | 'shipped' | 'delivered';
  coupon?: string;
  notes: string;
  createdAt: string;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  altPhone: string;
  address: string;
  governorate: string;
  city: string;
  notes: string;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  active: boolean;
}

export type Lang = 'en' | 'ar';
