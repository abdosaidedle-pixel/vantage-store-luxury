import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import toast from 'react-hot-toast';

export default function Cart() {
  const { t, lang, dark, cart, removeFromCart, updateCartQty, cartTotal, applyCoupon } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('');
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;
  const shipping = cartTotal >= 500 ? 0 : 50;

  const discountAmount = discountType === 'percentage' ? (cartTotal * discount) / 100 : discount;
  const total = cartTotal - discountAmount + shipping;

  const handleCoupon = () => {
    const result = applyCoupon(couponCode);
    if (result.valid) {
      setDiscount(result.discount);
      setDiscountType(result.type);
      toast.success(t('couponApplied'), { style: { border: '1px solid #D4AF37' } });
    } else {
      toast.error(t('invalidCoupon'));
    }
  };

  if (cart.length === 0) {
    return (
      <div className={`min-h-screen pt-24 flex items-center justify-center ${dark ? 'bg-black-main' : 'bg-soft-gray'}`}>
        <div className="text-center">
          <ShoppingBag size={64} className={`mx-auto mb-4 ${dark ? 'text-gray-700' : 'text-gray-300'}`} />
          <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-white' : 'text-black-main'}`}>{t('cartEmpty')}</h2>
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
          {t('cart')} ({cart.length})
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, i) => {
              const name = lang === 'ar' ? item.product.nameAr : item.product.nameEn;
              return (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex gap-4 p-4 rounded-2xl ${dark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}
                >
                  <Link to={`/product/${item.product.id}`} className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0">
                    <img src={item.product.images[0]} alt={name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className={`font-semibold mb-1 truncate hover:text-gold ${dark ? 'text-white' : 'text-black-main'}`}>{name}</h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-gold font-bold">{item.product.price} {t('egp')}</span>
                      {item.product.oldPrice && (
                        <span className={`text-xs line-through ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{item.product.oldPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center rounded-lg border ${dark ? 'border-dark-border' : 'border-gray-200'}`}>
                        <button onClick={() => updateCartQty(item.product.id, item.quantity - 1)} className="p-2">
                          <Minus size={14} className={dark ? 'text-white' : 'text-black-main'} />
                        </button>
                        <span className={`px-3 text-sm font-semibold ${dark ? 'text-white' : 'text-black-main'}`}>{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.product.id, item.quantity + 1)} className="p-2">
                          <Plus size={14} className={dark ? 'text-white' : 'text-black-main'} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${dark ? 'text-white' : 'text-black-main'}`}>{item.product.price * item.quantity} {t('egp')}</span>
                        <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-2xl sticky top-24 ${dark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
              <h3 className={`text-lg font-bold mb-6 ${dark ? 'text-white' : 'text-black-main'}`}>{t('orderSummary')}</h3>

              {/* Coupon */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Tag size={16} className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gold`} />
                  <input
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder={t('couponCode')}
                    className={`w-full ${lang === 'ar' ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2.5 rounded-xl text-sm border ${dark ? 'bg-black-main border-dark-border text-white' : 'bg-soft-gray border-gray-200 text-black-main'}`}
                  />
                </div>
                <button onClick={handleCoupon} className="px-4 py-2.5 bg-gold text-black-main rounded-xl text-sm font-bold hover:bg-gold-light transition-colors">
                  {t('apply')}
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className={dark ? 'text-gray-400' : 'text-gray-600'}>{t('subtotal')}</span>
                  <span className={`font-semibold ${dark ? 'text-white' : 'text-black-main'}`}>{cartTotal} {t('egp')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-emerald-500">{t('discount')}</span>
                    <span className="text-emerald-500 font-semibold">-{discountAmount} {t('egp')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={dark ? 'text-gray-400' : 'text-gray-600'}>{t('shipping')}</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-emerald-500' : dark ? 'text-white' : 'text-black-main'}`}>
                    {shipping === 0 ? t('free') : `${shipping} ${t('egp')}`}
                  </span>
                </div>
                <div className={`border-t pt-3 ${dark ? 'border-dark-border' : 'border-gray-200'}`}>
                  <div className="flex justify-between">
                    <span className={`font-bold text-lg ${dark ? 'text-white' : 'text-black-main'}`}>{t('total')}</span>
                    <span className="text-gold font-bold text-lg">{total} {t('egp')}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full text-center bg-gold hover:bg-gold-light text-black-main py-4 rounded-xl font-bold transition-all hover:scale-[1.02]"
              >
                {t('checkout')}
              </Link>
              <Link to="/products" className={`block text-center mt-3 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} hover:text-gold`}>
                {t('continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
