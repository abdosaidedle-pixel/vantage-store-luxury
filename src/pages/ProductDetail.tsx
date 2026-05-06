import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Minus, Plus, ChevronLeft, ChevronRight, Check, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, lang, dark, products, addToCart, toggleWishlist, isInWishlist } = useStore();
  const product = products.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');

  if (!product) {
    return (
      <div className={`min-h-screen pt-24 flex items-center justify-center ${dark ? 'bg-black-main text-white' : 'bg-white text-black-main'}`}>
        <div className="text-center">
          <p className="text-xl mb-4">{t('noProducts')}</p>
          <Link to="/products" className="text-gold hover:underline">{t('continueShopping')}</Link>
        </div>
      </div>
    );
  }

  const name = lang === 'ar' ? product.nameAr : product.nameEn;
  const desc = lang === 'ar' ? product.descAr : product.descEn;
  const inWish = isInWishlist(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    navigate('/checkout');
  };

  return (
    <div className={`min-h-screen pt-20 lg:pt-24 ${dark ? 'bg-black-main' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className={`flex items-center gap-2 text-sm mb-8 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          <Link to="/" className="hover:text-gold">{t('home')}</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gold">{t('products')}</Link>
          <span>/</span>
          <span className="text-gold">{name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div>
            <div
              className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-zoom-in mb-4 ${dark ? 'bg-dark-card' : 'bg-soft-gray'}`}
              onClick={() => setZoomed(!zoomed)}
            >
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImage]}
                alt={name}
                className={`w-full h-full object-cover transition-transform duration-500 ${zoomed ? 'scale-150' : 'scale-100'}`}
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(i => i > 0 ? i - 1 : product.images.length - 1); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-black-main shadow-lg"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(i => i < product.images.length - 1 ? i + 1 : 0); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-black-main shadow-lg"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              {product.discount && product.discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{product.discount}%
                </span>
              )}
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-gold' : dark ? 'border-dark-border' : 'border-gray-200'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.badge && (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${
                product.badge === 'new' ? 'bg-emerald-500/10 text-emerald-500' :
                product.badge === 'sale' ? 'bg-red-500/10 text-red-500' :
                product.badge === 'bestseller' ? 'bg-gold/10 text-gold' :
                'bg-purple-500/10 text-purple-500'
              }`}>
                {product.badge === 'new' ? (lang === 'ar' ? 'جديد' : 'NEW ARRIVAL') :
                 product.badge === 'sale' ? (lang === 'ar' ? 'تخفيض' : 'ON SALE') :
                 product.badge === 'bestseller' ? (lang === 'ar' ? 'الأكثر مبيعاً' : 'BESTSELLER') :
                 (lang === 'ar' ? 'إصدار محدود' : 'LIMITED EDITION')}
              </span>
            )}

            <h1 className={`text-2xl md:text-4xl font-bold mb-4 ${dark ? 'text-white' : 'text-black-main'}`} style={{ fontFamily: lang === 'ar' ? "'Cairo'" : "'Playfair Display'" }}>
              {name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className={i < Math.round(product.rating) ? 'fill-gold text-gold' : dark ? 'text-gray-600' : 'text-gray-300'} />
                ))}
              </div>
              <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                {product.rating} ({product.reviews} {t('reviews')})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 mb-6">
              <span className="text-3xl font-bold text-gold">{product.price} {t('egp')}</span>
              {product.oldPrice && (
                <span className={`text-lg line-through ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {product.oldPrice} {t('egp')}
                </span>
              )}
              {product.discount && product.discount > 0 && (
                <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-sm font-bold">
                  {t('off')} {product.discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className={`text-base leading-relaxed mb-8 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              {desc}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              {product.stock > 0 ? (
                <>
                  <Check size={16} className="text-emerald-500" />
                  <span className="text-emerald-500 font-medium text-sm">{t('inStock')} ({product.stock})</span>
                </>
              ) : (
                <>
                  <Package size={16} className="text-red-500" />
                  <span className="text-red-500 font-medium text-sm">{t('outOfStock')}</span>
                </>
              )}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <span className={`block font-medium mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {lang === 'ar' ? 'اختر اللون' : 'Select Color'}:
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all transform hover:scale-110 flex items-center justify-center ${selectedColor === color ? 'border-gold' : 'border-transparent shadow-sm'}`}
                      style={{ background: color }}
                    >
                      {selectedColor === color && (
                        <Check size={16} className={color.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{t('quantity')}:</span>
              <div className={`flex items-center rounded-xl border ${dark ? 'border-dark-border' : 'border-gray-200'}`}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className={`p-3 hover:bg-gold/10 transition-colors ${dark ? 'text-white' : 'text-black-main'}`}>
                  <Minus size={16} />
                </button>
                <span className={`px-5 font-semibold ${dark ? 'text-white' : 'text-black-main'}`}>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className={`p-3 hover:bg-gold/10 transition-colors ${dark ? 'text-white' : 'text-black-main'}`}>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => addToCart(product, quantity, selectedColor)}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-black-main py-4 rounded-xl font-bold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={20} /> {t('addToCart')}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${dark ? 'border-white text-white hover:bg-white hover:text-black-main' : 'border-black-main text-black-main hover:bg-black-main hover:text-white'}`}
              >
                {t('buyNow')}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${inWish ? 'border-red-500 bg-red-500/10 text-red-500' : dark ? 'border-dark-border text-gray-400' : 'border-gray-200 text-gray-400'}`}
              >
                <Heart size={20} fill={inWish ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 md:mt-24">
            <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${dark ? 'text-white' : 'text-black-main'}`} style={{ fontFamily: lang === 'ar' ? "'Cairo'" : "'Playfair Display'" }}>
              {t('relatedProducts')}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
