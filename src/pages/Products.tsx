import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { CATEGORIES } from '../data';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const { t, lang, dark, products } = useStore();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const saleParam = searchParams.get('sale') === 'true';

  const [category, setCategory] = useState(categoryParam && categoryParam !== 'all' ? categoryParam : '');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.nameEn.toLowerCase().includes(q) ||
        p.nameAr.includes(q) ||
        p.descEn.toLowerCase().includes(q) ||
        p.descAr.includes(q)
      );
    }

    if (category) {
      result = result.filter(p => p.category === category);
    }

    if (saleParam) {
      result = result.filter(p => p.discount && p.discount > 0);
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }

    return result;
  }, [products, searchQuery, category, sortBy, priceRange, saleParam]);

  const categoryName = category ? CATEGORIES.find(c => c.id === category)?.[lang === 'ar' ? 'ar' : 'en'] : t('allProducts');

  return (
    <div className={`min-h-screen pt-20 lg:pt-24 ${dark ? 'bg-black-main' : 'bg-soft-gray'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${dark ? 'text-white' : 'text-black-main'}`} style={{ fontFamily: lang === 'ar' ? "'Cairo'" : "'Playfair Display'" }}>
            {saleParam ? t('offers') + ' 🔥' : categoryName}
          </h1>
          <div className="flex items-center justify-between">
            <p className={`text-lg font-medium ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              {filtered.length} {lang === 'ar' ? 'منتج متاح' : 'products available'}
            </p>
          </div>
        </motion.div>

        {/* Controls Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 sm:gap-3 flex-wrap mb-8">
          {/* Search */}
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('search')}
            className={`flex-1 min-w-[200px] px-5 py-3.5 rounded-xl text-sm font-medium border-2 transition-all ${dark ? 'bg-dark-card border-dark-border text-white placeholder-gray-500 focus:border-gold' : 'bg-white border-gray-200 text-black-main placeholder-gray-400 focus:border-gold'}`}
          />

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className={`px-5 py-3.5 rounded-xl text-sm font-medium border-2 appearance-none pr-10 cursor-pointer transition-all ${dark ? 'bg-dark-card border-dark-border text-white focus:border-gold' : 'bg-white border-gray-200 text-black-main focus:border-gold'}`}
            >
              <option value="newest">🆕 {t('newest')}</option>
              <option value="price-low">📉 {t('priceLowHigh')}</option>
              <option value="price-high">📈 {t('priceHighLow')}</option>
              <option value="rating">⭐ {t('rating')}</option>
            </select>
            <ChevronDown size={16} className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 pointer-events-none ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>

          {/* Filter toggle */}
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-3.5 rounded-xl text-sm font-bold border-2 flex items-center gap-2 transition-all duration-300 ${showFilters ? 'bg-gold text-black-main border-gold shadow-lg shadow-gold/30' : dark ? 'bg-dark-card border-dark-border text-white hover:border-gold' : 'bg-white border-gray-200 text-black-main hover:border-gold'}`}
          >
            <SlidersHorizontal size={18} /> {t('filters')}
          </motion.button>
        </motion.div>

        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: lang === 'ar' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: lang === 'ar' ? 20 : -20 }}
                className={`w-72 shrink-0 hidden lg:block`}
              >
                <div className={`p-6 rounded-2xl sticky top-28 border-2 ${dark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200 shadow-lg'}`}>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className={`font-bold text-lg ${dark ? 'text-white' : 'text-black-main'}`}>{t('filters')}</h3>
                    <button 
                      onClick={() => { setCategory(''); setPriceRange([0, 10000]); }} 
                      className="text-gold text-xs font-bold hover:underline hover:scale-110 transition-transform"
                    >
                      ↺ Reset
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="mb-8">
                    <h4 className={`font-bold mb-4 text-sm uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{t('categories')}</h4>
                    <div className="space-y-2.5">
                      <motion.button
                        onClick={() => setCategory('')}
                        whileHover={{ x: 5 }}
                        className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${!category ? 'bg-gold/20 text-gold border-2 border-gold' : dark ? 'text-gray-400 hover:text-white hover:bg-dark-border' : 'text-gray-600 hover:text-black hover:bg-soft-gray'}`}
                      >
                        {t('allCategories')}
                      </motion.button>
                      {CATEGORIES.map(cat => (
                        <motion.button
                          key={cat.id}
                          onClick={() => setCategory(cat.id)}
                          whileHover={{ x: 5 }}
                          className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${category === cat.id ? 'bg-gold/20 text-gold border-2 border-gold' : dark ? 'text-gray-400 hover:text-white hover:bg-dark-border' : 'text-gray-600 hover:text-black hover:bg-soft-gray'}`}
                        >
                          {cat.icon} {lang === 'ar' ? cat.ar : cat.en}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className={`font-bold mb-4 text-sm uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{t('priceRange')}</h4>
                    <input
                      type="range"
                      min={0}
                      max={10000}
                      step={100}
                      value={priceRange[1]}
                      onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-gold h-2 rounded-lg"
                    />
                    <div className="flex justify-between mt-4 px-1">
                      <span className={`text-xs font-bold ${dark ? 'text-gray-500' : 'text-gray-400'}`}>0 EGP</span>
                      <span className="text-sm text-gold font-bold">{priceRange[1].toLocaleString()} EGP</span>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end"
                onClick={() => setShowFilters(false)}
              >
                <motion.div
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{ type: 'spring', damping: 25 }}
                  className={`w-full rounded-t-3xl p-6 max-h-[75vh] overflow-auto ${dark ? 'bg-dark-card' : 'bg-white'}`}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className={`font-bold text-xl ${dark ? 'text-white' : 'text-black-main'}`}>{t('filters')}</h3>
                    <button onClick={() => setShowFilters(false)} className={`p-2 rounded-lg hover:scale-110 transition-transform ${dark ? 'hover:bg-dark-border' : 'hover:bg-soft-gray'}`}>
                      <X size={24} className={dark ? 'text-white' : 'text-black-main'} />
                    </button>
                  </div>

                  <div className="mb-8">
                    <h4 className={`font-bold mb-4 text-sm uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{t('categories')}</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setCategory('')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${!category ? 'bg-gold text-black-main shadow-lg' : dark ? 'bg-dark-border text-gray-300 border border-dark-border' : 'bg-soft-gray text-gray-700 border border-gray-200'}`}
                      >
                        {t('allCategories')}
                      </button>
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setCategory(cat.id)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${category === cat.id ? 'bg-gold text-black-main shadow-lg' : dark ? 'bg-dark-border text-gray-300 border border-dark-border' : 'bg-soft-gray text-gray-700 border border-gray-200'}`}
                        >
                          {cat.icon} {lang === 'ar' ? cat.ar : cat.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className={`font-bold mb-4 text-sm uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{t('priceRange')}</h4>
                    <input type="range" min={0} max={10000} step={100} value={priceRange[1]} onChange={e => setPriceRange([0, parseInt(e.target.value)])} className="w-full accent-gold h-2 rounded-lg" />
                    <div className="flex justify-between mt-4 px-1">
                      <span className={`text-xs font-bold ${dark ? 'text-gray-500' : 'text-gray-400'}`}>0 EGP</span>
                      <span className="text-sm text-gold font-bold">{priceRange[1].toLocaleString()} EGP</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowFilters(false)} 
                    className="w-full bg-gold hover:bg-gold-light text-black-main py-3.5 rounded-xl font-bold transition-all hover:scale-105"
                  >
                    {t('apply')} ✓
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-center py-24 rounded-2xl border-2 ${dark ? 'border-dark-border bg-dark-card' : 'border-gray-200 bg-white'}`}>
                <p className={`text-2xl font-bold mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>😢 {t('noProducts')}</p>
                <p className={`${dark ? 'text-gray-500' : 'text-gray-400'}`}>Try adjusting your filters or search term</p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                <AnimatePresence mode="popLayout">
                  {filtered.map((p, i) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
