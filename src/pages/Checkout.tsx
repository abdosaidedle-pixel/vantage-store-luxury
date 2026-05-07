import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Upload, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { GOVERNORATES } from '../data';
import { CustomerInfo, Order } from '../types';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { t, lang, dark, cart, cartTotal, clearCart, addOrder } = useStore();
  const navigate = useNavigate();
  const shipping = cartTotal >= 500 ? 0 : 50;
  const total = cartTotal + shipping;

  const [paymentMethod] = useState<'cod'>('cod');
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '', phone: '', altPhone: '', address: '', governorate: '', city: '', notes: ''
  });

  const updateCustomer = (field: keyof CustomerInfo, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
  };

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setScreenshotName(file.name);
  };

  const generateWhatsAppMessage = () => {
    const items = cart.map(item => {
      const name = lang === 'ar' ? item.product.nameAr : item.product.nameEn;
      const colorText = item.selectedColor ? ` [Color: ${item.selectedColor}]` : '';
      return `• ${name}${colorText} × ${item.quantity} = ${item.product.price * item.quantity} ${t('egp')}`;
    }).join('\n');

    const msg = `
🛍️ *${lang === 'ar' ? 'طلب جديد من فانتاج ستور' : 'New Order - VANTAGE Store'}*
━━━━━━━━━━━━━━━━━━━━

👤 *${t('fullName')}:* ${customer.fullName}
📱 *${t('phone')}:* ${customer.phone}
📱 *${t('altPhone')}:* ${customer.altPhone || '-'}
📍 *${t('address')}:* ${customer.address}
🏙️ *${t('governorate')}:* ${customer.governorate}
🏘️ *${t('city')}:* ${customer.city}

━━━━━━━━━━━━━━━━━━━━
📦 *${t('items')}:*
${items}

━━━━━━━━━━━━━━━━━━━━
💰 *${t('subtotal')}:* ${cartTotal} ${t('egp')}
🚚 *${t('shipping')}:* ${shipping === 0 ? t('free') : `${shipping} ${t('egp')}`}
💵 *${t('total')}:* ${total} ${t('egp')}

💳 *${t('paymentMethod')}:* ${paymentMethod === 'vodafone_cash' ? t('vodafoneCash') : t('cashOnDelivery')}


📝 *${t('notes')}:* ${customer.notes || '-'}
━━━━━━━━━━━━━━━━━━━━
    `.trim();

    return encodeURIComponent(msg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.fullName || !customer.phone || !customer.address || !customer.governorate || !customer.city) {
      toast.error(t('required'));
      return;
    }

    const order: Order = {
      id: `ORD-${Date.now()}`,
      customer,
      items: cart,
      subtotal: cartTotal,
      shipping,
      discount: 0,
      total,
      paymentMethod,
      paymentRef: '',
      paymentScreenshot: '',
      status: 'pending',
      notes: customer.notes,
      createdAt: new Date().toISOString(),
    };

    addOrder(order);

    const whatsappUrl = `https://wa.me/2001050107762?text=${generateWhatsAppMessage()}`;
    window.open(whatsappUrl, '_blank');

    clearCart();
    toast.success(t('orderPlaced'), { icon: '🎉', duration: 5000, style: { border: '1px solid #D4AF37' } });
    navigate('/');
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm transition-all ${dark ? 'bg-dark-card border-dark-border text-white placeholder-gray-500' : 'bg-soft-gray border-gray-200 text-black-main placeholder-gray-400'}`;

  return (
    <div className={`min-h-screen pt-20 lg:pt-24 ${dark ? 'bg-black-main' : 'bg-soft-gray'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className={`text-3xl font-bold mb-8 ${dark ? 'text-white' : 'text-black-main'}`} style={{ fontFamily: lang === 'ar' ? "'Cairo'" : "'Playfair Display'" }}>
          {t('checkout')}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Customer Info */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl ${dark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}
              >
                <h3 className={`font-bold text-lg mb-6 ${dark ? 'text-white' : 'text-black-main'}`}>{t('customerInfo')}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{t('fullName')} *</label>
                    <input required value={customer.fullName} onChange={e => updateCustomer('fullName', e.target.value)} placeholder={t('enterName')} className={inputClass} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{t('phone')} *</label>
                    <input required value={customer.phone} onChange={e => updateCustomer('phone', e.target.value)} placeholder={t('enterPhone')} className={inputClass} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{t('altPhone')}</label>
                    <input value={customer.altPhone} onChange={e => updateCustomer('altPhone', e.target.value)} placeholder={t('enterPhone')} className={inputClass} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{t('governorate')} *</label>
                    <select required value={customer.governorate} onChange={e => updateCustomer('governorate', e.target.value)} className={inputClass}>
                      <option value="">{t('selectGovernorate')}</option>
                      {GOVERNORATES.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{t('city')} *</label>
                    <input required value={customer.city} onChange={e => updateCustomer('city', e.target.value)} placeholder={t('enterCity')} className={inputClass} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{t('address')} *</label>
                    <input required value={customer.address} onChange={e => updateCustomer('address', e.target.value)} placeholder={t('enterAddress')} className={inputClass} />
                  </div>
                </div>
                <div className="mt-4">
                  <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{t('notes')}</label>
                  <textarea value={customer.notes} onChange={e => updateCustomer('notes', e.target.value)} placeholder={t('orderNotes')} rows={3} className={`${inputClass} resize-none`} />
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-6 rounded-2xl ${dark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}
              >
                <h3 className={`font-bold text-lg mb-6 ${dark ? 'text-white' : 'text-black-main'}`}>{t('paymentMethod')}</h3>
                <div className="space-y-3">
                  <div className={`flex items-center gap-4 p-4 rounded-xl border-2 ${dark ? 'border-gold bg-gold/5' : 'border-gold bg-gold/5'}`}>
                    <Truck size={22} className="text-gold" />
                    <div>
                      <p className={`font-semibold ${dark ? 'text-white' : 'text-black-main'}`}>{t('cashOnDelivery')}</p>
                      <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{lang === 'ar' ? 'ادفع عند استلام الطلب' : 'Pay when you receive your order'}</p>
                    </div>
                  </div>
                </div>

              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className={`p-6 rounded-2xl sticky top-24 ${dark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
                <h3 className={`font-bold text-lg mb-6 ${dark ? 'text-white' : 'text-black-main'}`}>{t('orderSummary')}</h3>

                <div className="space-y-3 mb-6 max-h-60 overflow-auto">
                  {cart.map(item => {
                    const name = lang === 'ar' ? item.product.nameAr : item.product.nameEn;
                    return (
                      <div key={item.product.id} className="flex gap-3">
                        <img src={item.product.images[0]} alt={name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${dark ? 'text-white' : 'text-black-main'}`}>{name}</p>
                          <div className="flex items-center gap-2">
                            <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>× {item.quantity}</p>
                            {item.selectedColor && (
                              <div className="w-3 h-3 rounded-full border border-gray-300" style={{ background: item.selectedColor }} />
                            )}
                          </div>
                        </div>
                        <span className="text-gold text-sm font-bold">{item.product.price * item.quantity}</span>
                      </div>
                    );
                  })}
                </div>

                <div className={`border-t pt-4 space-y-2 ${dark ? 'border-dark-border' : 'border-gray-200'}`}>
                  <div className="flex justify-between text-sm">
                    <span className={dark ? 'text-gray-400' : 'text-gray-600'}>{t('subtotal')}</span>
                    <span className={dark ? 'text-white' : 'text-black-main'}>{cartTotal} {t('egp')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={dark ? 'text-gray-400' : 'text-gray-600'}>{t('shipping')}</span>
                    <span className={shipping === 0 ? 'text-emerald-500' : dark ? 'text-white' : 'text-black-main'}>
                      {shipping === 0 ? t('free') : `${shipping} ${t('egp')}`}
                    </span>
                  </div>
                  <div className={`border-t pt-2 ${dark ? 'border-dark-border' : 'border-gray-200'}`}>
                    <div className="flex justify-between">
                      <span className={`font-bold text-lg ${dark ? 'text-white' : 'text-black-main'}`}>{t('total')}</span>
                      <span className="text-gold font-bold text-lg">{total} {t('egp')}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 flex items-center justify-center gap-3 bg-black-main hover:bg-black-main/90 text-white py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-xl border border-gold/30 group"
                >
                  <div className="bg-emerald-500 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                    <MessageCircle size={20} className="text-white" />
                  </div>
                  <span className="text-gold tracking-wide">{t('orderViaWhatsApp')}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
