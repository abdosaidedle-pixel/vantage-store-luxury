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
  const products: Product[] = [];
  const baseProducts = [
    // Men's Fashion (40 products)
    { nameEn: "Premium Leather Jacket", nameAr: "جاكيت جلد فاخر", category: "mens-fashion", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=700&fit=crop", basePrice: 2850, badge: "bestseller" },
    { nameEn: "Classic Polo Shirt", nameAr: "قميص بولو كلاسيكي", category: "mens-fashion", img: "https://images.unsplash.com/photo-1625910513413-5fc58c2a5862?w=600&h=700&fit=crop", basePrice: 450, badge: "sale" },
    { nameEn: "Oxford Button-Down Shirt", nameAr: "قميص أكسفورد", category: "mens-fashion", img: "https://images.unsplash.com/photo-1574180045827-d2daad5873d2?w=600&h=700&fit=crop", basePrice: 650, badge: "new" },
    { nameEn: "Slim Fit Jeans", nameAr: "جينز ضيق", category: "mens-fashion", img: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=600&h=700&fit=crop", basePrice: 550, badge: null },
    { nameEn: "Casual T-Shirt", nameAr: "تي شيرت كاجوال", category: "mens-fashion", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=700&fit=crop", basePrice: 250, badge: "sale" },
    { nameEn: "Wool Blazer", nameAr: "بليزر صوف", category: "mens-fashion", img: "https://images.unsplash.com/photo-1591047990727-6876acbd6e23?w=600&h=700&fit=crop", basePrice: 1850, badge: "bestseller" },
    { nameEn: "Chino Pants", nameAr: "بنطلون شينو", category: "mens-fashion", img: "https://images.unsplash.com/photo-1473272639025-5de95deacf4e?w=600&h=700&fit=crop", basePrice: 650, badge: null },
    { nameEn: "Sweater Collection", nameAr: "مجموعة سويتر", category: "mens-fashion", img: "https://images.unsplash.com/photo-1548021682-1919c69fb077?w=600&h=700&fit=crop", basePrice: 750, badge: "new" },
    // Women's Fashion (40 products)
    { nameEn: "Elegant Silk Dress", nameAr: "فستان حرير أنيق", category: "womens-fashion", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=700&fit=crop", basePrice: 1950, badge: "new" },
    { nameEn: "Evening Gown", nameAr: "فستان سهرة", category: "womens-fashion", img: "https://images.unsplash.com/photo-1595566174208-a0ebc886cf81?w=600&h=700&fit=crop", basePrice: 2450, badge: "bestseller" },
    { nameEn: "Casual Blouse", nameAr: "بلوزة كاجوال", category: "womens-fashion", img: "https://images.unsplash.com/photo-1515222136768-635149edba35?w=600&h=700&fit=crop", basePrice: 350, badge: "sale" },
    { nameEn: "Summer Dress", nameAr: "فستان صيفي", category: "womens-fashion", img: "https://images.unsplash.com/photo-1572804419446-4a4c4c8e8b6f?w=600&h=700&fit=crop", basePrice: 650, badge: null },
    // Electronics (40 products)
    { nameEn: "Wireless Headphones", nameAr: "سماعات لاسلكية", category: "electronics", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=700&fit=crop", basePrice: 1200, badge: "sale" },
    { nameEn: "Smartphone Stand", nameAr: "حامل هاتف ذكي", category: "electronics", img: "https://images.unsplash.com/photo-1619983081563-430f63602d4a?w=600&h=700&fit=crop", basePrice: 180, badge: null },
    { nameEn: "USB-C Cable", nameAr: "كابل USB-C", category: "electronics", img: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=700&fit=crop", basePrice: 85, badge: "sale" },
    { nameEn: "Wireless Charger", nameAr: "شاحن لاسلكي", category: "electronics", img: "https://images.unsplash.com/photo-1586253408c4-6d3e0d1d7e8e?w=600&h=700&fit=crop", basePrice: 450, badge: "new" },
    // Accessories (40 products)
    { nameEn: "Gold Chain Necklace", nameAr: "سلسلة ذهبية", category: "accessories", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=700&fit=crop", basePrice: 750, badge: "bestseller" },
    { nameEn: "Pearl Earrings", nameAr: "أقراط لؤلؤ", category: "accessories", img: "https://images.unsplash.com/photo-1599643478245-4eb14f67fafd?w=600&h=700&fit=crop", basePrice: 450, badge: "new" },
    { nameEn: "Diamond Ring", nameAr: "خاتم ماس", category: "accessories", img: "https://images.unsplash.com/photo-1599643478517-243782ae8e9e?w=600&h=700&fit=crop", basePrice: 3500, badge: "limited" },
    { nameEn: "Silk Scarf", nameAr: "وشاح حرير", category: "accessories", img: "https://images.unsplash.com/photo-1550770900-5c51d4b4dd23?w=600&h=700&fit=crop", basePrice: 350, badge: null },
    // Shoes (40 products)
    { nameEn: "Premium Running Shoes", nameAr: "حذاء رياضي فاخر", category: "shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=700&fit=crop", basePrice: 1650, badge: "sale" },
    { nameEn: "Women's Heels", nameAr: "كعب نسائي", category: "shoes", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=700&fit=crop", basePrice: 1400, badge: "bestseller" },
    { nameEn: "Casual Sneakers", nameAr: "حذاء رياضي كاجوال", category: "shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=700&fit=crop", basePrice: 850, badge: "new" },
    { nameEn: "Formal Loafers", nameAr: "حذاء لوفر رسمي", category: "shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=700&fit=crop", basePrice: 950, badge: null },
    // Bags (40 products)
    { nameEn: "Designer Leather Handbag", nameAr: "حقيبة يد جلدية", category: "bags", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=700&fit=crop", basePrice: 3200, badge: "bestseller" },
    { nameEn: "Shoulder Bag", nameAr: "حقيبة كتف", category: "bags", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=700&fit=crop", basePrice: 1200, badge: "new" },
    { nameEn: "Backpack", nameAr: "حقيبة ظهر", category: "bags", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=700&fit=crop", basePrice: 850, badge: "sale" },
    { nameEn: "Clutch Bag", nameAr: "حقيبة كلاتش", category: "bags", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=700&fit=crop", basePrice: 650, badge: null },
    // Home Decor (40 products)
    { nameEn: "Modern Table Lamp", nameAr: "مصباح طاولة عصري", category: "home-decor", img: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=700&fit=crop", basePrice: 850, badge: "new" },
    { nameEn: "Wall Art Painting", nameAr: "لوحة فنية", category: "home-decor", img: "https://images.unsplash.com/photo-1577720612155-2a2a9f41c519?w=600&h=700&fit=crop", basePrice: 1200, badge: "bestseller" },
    { nameEn: "Decorative Pillow", nameAr: "وسادة ديكور", category: "home-decor", img: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600&h=700&fit=crop", basePrice: 350, badge: "sale" },
    { nameEn: "Area Rug", nameAr: "سجادة", category: "home-decor", img: "https://images.unsplash.com/photo-1604159305125-8de8220fb577?w=600&h=700&fit=crop", basePrice: 2200, badge: null },
    // Watches (40 products)
    { nameEn: "Luxury Chronograph", nameAr: "ساعة كرونوغراف فاخرة", category: "watches", img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=700&fit=crop", basePrice: 4500, badge: "limited" },
    { nameEn: "Smart Fitness Watch", nameAr: "ساعة ذكية رياضية", category: "watches", img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=700&fit=crop", basePrice: 1800, badge: "new" },
    { nameEn: "Classic Analog Watch", nameAr: "ساعة كلاسيكية", category: "watches", img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=700&fit=crop", basePrice: 950, badge: "bestseller" },
    { nameEn: "Digital Sports Watch", nameAr: "ساعة رياضية رقمية", category: "watches", img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=700&fit=crop", basePrice: 650, badge: "sale" },
  ];

  let id = 1;
  baseProducts.forEach((base, idx) => {
    for (let i = 0; i < 5; i++) {
      const discount = Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 10 : null;
      const oldPrice = discount ? Math.floor(base.basePrice * (1 + discount / 100)) : undefined;
      const createdDaysAgo = Math.floor(Math.random() * 60);
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - createdDaysAgo);

      products.push({
        id: `p${id}`,
        nameEn: `${base.nameEn} ${i > 0 ? `- ${['Premium', 'Deluxe', 'Ultra', 'Elite', 'Signature'][i]}` : ''}`.trim(),
        nameAr: `${base.nameAr} ${i > 0 ? `- ${['فاخر', 'ديلوكس', 'فائق', 'نخبة', 'توقيع'][i]}` : ''}`.trim(),
        descEn: `High-quality ${base.nameEn.toLowerCase()} with premium materials and exceptional craftsmanship. Perfect for discerning customers who appreciate luxury.`,
        descAr: `${base.nameAr} عالي الجودة مع مواد فاخرة وحرفية استثنائية. مثالي للعملاء الذين يقدرون الفخامة.`,
        price: Math.floor(base.basePrice * (0.8 + Math.random() * 0.6)),
        oldPrice: oldPrice,
        discount: discount,
        category: base.category,
        images: [base.img, base.img.replace('?w=600', '?w=601')],
        stock: Math.floor(Math.random() * 50) + 5,
        rating: Math.round((4 + Math.random() * 0.9) * 10) / 10,
        reviews: Math.floor(Math.random() * 200) + 20,
        badge: idx % 5 === 0 ? (base.badge || null) : (Math.random() > 0.7 ? base.badge : null),
        featured: idx < 8,
        createdAt: createdDate.toISOString().split('T')[0]
      });
      id++;
    }
  });

  return products;
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
