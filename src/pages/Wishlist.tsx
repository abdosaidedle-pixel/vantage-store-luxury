import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { t, lang, dark, products, wishlist } = useStore();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className={`min-h-screen pt-24 flex items-center justify-center ${dark ? 'bg-black-main' : 'bg-soft-gray'}`}>
        <div className="text-center">
          <Heart size={64} className={`mx-auto mb-4 ${dark ? 'text-gray-700' : 'text-gray-300'}`} />
          <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-white' : 'text-black-main'}`}>{t('wishlistEmpty')}</h2>
          <Link to="/products" className="inline-flex items-center gap-2 text-gold font-semibold mt-4 hover:underline">
            {t('continueShopping')} <Arrow size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 lg:pt-24 ${dark ? 'bg-black-main' : 'bg-soft-gray'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className={`text-3xl font-bold mb-8 ${dark ? 'text-white' : 'text-black-main'}`} style={{ fontFamily: lang === 'ar' ? "'Cairo'" : "'Playfair Display'" }}>
          {t('wishlist')} ({wishlistProducts.length})
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlistProducts.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
