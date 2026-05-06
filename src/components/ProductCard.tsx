import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useStore } from '../store';
import { Product } from '../types';

export default function ProductCard({ product }: { product: Product }) {
  const { t, lang, dark, addToCart, toggleWishlist, isInWishlist } = useStore();
  const name = lang === 'ar' ? product.nameAr : product.nameEn;
  const inWish = isInWishlist(product.id);

  const badgeColors: Record<string, string> = {
    new: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50',
    sale: 'bg-red-500 text-white shadow-lg shadow-red-500/50',
    bestseller: 'bg-gold text-black-main shadow-lg shadow-gold/50',
    limited: 'bg-purple-600 text-white shadow-lg shadow-purple-600/50',
  };

  const badgeLabels: Record<string, string> = {
    new: lang === 'ar' ? 'جديد' : 'NEW',
    sale: lang === 'ar' ? 'تخفيض' : 'SALE',
    bestseller: lang === 'ar' ? 'الأكثر مبيعاً' : 'BEST',
    limited: lang === 'ar' ? 'محدود' : 'LIMITED',
  };

  return (
    <div className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:scale-105 ${dark ? 'bg-dark-card border border-dark-border hover:border-gold/50' : 'bg-white border border-gray-100 hover:border-gold/50 shadow-md hover:shadow-2xl'}`}>
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200 dark:bg-gray-700">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 ${lang === 'ar' ? 'right-3' : 'left-3'} px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${badgeColors[product.badge]} transform transition-all duration-300`}>
            {badgeLabels[product.badge]}
          </span>
        )}

        {/* Discount */}
        {product.discount && product.discount > 0 && (
          <span className={`absolute top-3 ${lang === 'ar' ? 'left-3' : 'right-3'} bg-red-500 text-white px-2.5 py-1.5 rounded-full text-[11px] font-bold shadow-lg transform transition-all duration-300 hover:scale-110`}>
            -{product.discount}%
          </span>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <div className="flex gap-2.5 scale-75 group-hover:scale-100 transition-transform duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="p-3 bg-gold hover:bg-gold-light text-black-main rounded-full transition-all hover:scale-110 shadow-lg hover:shadow-2xl transform active:scale-95"
              title={t('addToCart')}
              aria-label={t('addToCart')}
            >
              <ShoppingBag size={18} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
              }}
              className={`p-3 rounded-full transition-all hover:scale-110 shadow-lg hover:shadow-2xl transform active:scale-95 ${inWish ? 'bg-red-500 text-white' : 'bg-white text-black-main hover:bg-gray-100'}`}
              title={t('wishlist')}
              aria-label={t('wishlist')}
            >
              <Heart size={18} fill={inWish ? 'currentColor' : 'none'} />
            </button>
            <Link
              to={`/product/${product.id}`}
              className="p-3 bg-white hover:bg-gray-100 text-black-main rounded-full transition-all hover:scale-110 shadow-lg hover:shadow-2xl transform active:scale-95"
              title={t('quickView')}
            >
              <Eye size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className={`p-3.5 sm:p-4 ${dark ? 'bg-dark-card' : 'bg-white'}`}>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className={`font-semibold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-gold transition-colors ${dark ? 'text-white' : 'text-black-main'}`}>
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} filled={i < Math.round(product.rating)} />
            ))}
          </div>
          <span className={`text-xs ml-auto ${dark ? 'text-gray-500' : 'text-gray-400'}`}>({product.reviews})</span>
        </div>
        
        <div className="flex items-baseline gap-2 justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-gold font-bold text-lg">{product.price}</span>
            <span className="text-xs font-medium text-gray-400">{t('egp')}</span>
          </div>
          {product.oldPrice && (
            <span className={`text-xs line-through font-medium ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              {product.oldPrice}
            </span>
          )}
        </div>

        {/* Quick action button */}
        <Link
          to={`/product/${product.id}`}
          className="mt-3 w-full block text-center py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-gold/10 hover:bg-gold text-gold hover:text-black-main border border-gold/30 hover:border-gold"
        >
          {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
        </Link>
      </div>
    </div>
  );
}

function Star({ size, filled }: { size: number; filled: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#D4AF37' : 'none'} stroke="#D4AF37" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
