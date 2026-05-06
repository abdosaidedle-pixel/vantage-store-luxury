import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Star, ChevronDown, ChevronUp, Send, ShoppingBag, Zap, Clock, Truck, Shield, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { CATEGORIES } from '../data';
import ProductCard from '../components/ProductCard';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};

const slideIn = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

export default function Home() {
  const { t, lang, dark, products } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const slides = [
    {
      title: lang === 'en' ? 'Elevate Your Style' : 'ارتقِ بأناقتك',
      sub: lang === 'en' ? 'Discover premium products crafted for excellence' : 'اكتشف منتجات فاخرة صُنعت للتميز',
      img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=900&fit=crop'
    },
    {
      title: lang === 'en' ? 'New Collection 2025' : 'مجموعة 2025 الجديدة',
      sub: lang === 'en' ? 'Luxury meets modern design' : 'الفخامة تلتقي بالتصميم العصري',
      img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=900&fit=crop'
    },
    {
      title: lang === 'en' ? 'Exclusive Deals' : 'عروض حصرية',
      sub: lang === 'en' ? 'Up to 40% off on premium items' : 'خصم حتى 40% على المنتجات الفاخرة',
      img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&h=900&fit=crop'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(c => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const featured = products.filter(p => p.featured).slice(0, 8);
  const bestSellers = products.filter(p => p.rating >= 4.5).slice(0, 4);
  const flashSale = products.filter(p => p.discount && p.discount >= 20).slice(0, 4);
  const newArrivals = products.slice(0, 4);

  const faqs = [
    { q: lang === 'en' ? 'How do I track my order?' : 'كيف أتابع طلبي؟', a: lang === 'en' ? 'You can track your order in your account dashboard' : 'يمكنك متابعة طلبك من لوحة التحكم' },
    { q: lang === 'en' ? 'What\'s your return policy?' : 'ما هي سياسة الإرجاع؟', a: lang === 'en' ? '30 days money back guarantee on all items' : 'ضمان استرجاع الأموال لمدة 30 يوم' },
    { q: lang === 'en' ? 'Do you offer international shipping?' : 'هل تقدمون الشحن الدولي؟', a: lang === 'en' ? 'Yes, we ship to over 150 countries' : 'نعم، نشحن إلى أكثر من 150 دولة' }
  ];

  return (
    <div className={`min-h-screen ${dark ? 'bg-black-main' : 'bg-white'}`}>
      {/* Hero Slider */}
      <motion.div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-b-3xl">
        {slides.map((slide, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === currentSlide ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img src={slide.img} alt={slide.title} className="w-full h-full object-cover hero-image-mobile" />
            <div className="absolute inset-0 bg-gradient-to-t from-black-main/80 via-black-main/20 to-transparent" />
            <motion.div 
              className="absolute inset-0 flex items-center justify-center text-center text-white px-6" 
              initial={{ opacity: 0, y: 30 }} 
              animate={i === currentSlide ? { opacity: 1, y: 0 } : {}} 
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="max-w-3xl">
                <motion.h1 
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight" 
                  style={{ fontFamily: lang === 'ar' ? "'Cairo'" : "'Playfair Display'" }}
                >
                  {slide.title}
                </motion.h1>
                <motion.p className="text-base md:text-xl lg:text-2xl mb-10 text-gray-200 font-light max-w-2xl mx-auto">{slide.sub}</motion.p>
                <Link to="/products" className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-black-main font-bold py-4 px-10 rounded-2xl transition-all hover:scale-110 shadow-2xl shadow-gold/20">
                  {t('shopNow')}
                  <Arrow size={20} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Slider Controls */}
        <button onClick={() => setCurrentSlide((c) => (c - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-gold/80 hover:bg-gold p-2 rounded-full transition-all"><ArrowLeft size={24} className="text-black-main" /></button>
        <button onClick={() => setCurrentSlide((c) => (c + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-gold/80 hover:bg-gold p-2 rounded-full transition-all"><ArrowRight size={24} className="text-black-main" /></button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-gold w-8' : 'bg-white/50'}`} />
          ))}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Features Bar */}
        <motion.div initial="hidden" whileInView="visible" variants={stagger} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { icon: <Truck className="text-gold" size={28} />, title: lang === 'en' ? 'Free Shipping' : 'شحن مجاني', desc: lang === 'en' ? 'Over 500 EGP' : 'للطلبات فوق 500 ج.م' },
            { icon: <Shield className="text-gold" size={28} />, title: lang === 'en' ? 'Secure Payment' : 'دفع آمن', desc: lang === 'en' ? 'Protected checkout' : 'عمليات دفع محمية' },
            { icon: <Clock className="text-gold" size={28} />, title: lang === 'en' ? 'Fast Delivery' : 'توصيل سريع', desc: lang === 'en' ? 'In 24-48 hours' : 'خلال 24-48 ساعة' },
            { icon: <Zap className="text-gold" size={28} />, title: lang === 'en' ? 'Premium Quality' : 'جودة فائقة', desc: lang === 'en' ? 'Luxury products' : 'منتجات فاخرة مختارة' }
          ].map((f, i) => (
            <motion.div key={i} variants={fadeUp} className={`p-8 rounded-3xl text-center transition-all hover:scale-105 ${dark ? 'bg-dark-card border border-dark-border hover:border-gold/30' : 'bg-white border border-gray-100 shadow-xl shadow-black/5 hover:border-gold/30'}`}>
              <div className="flex justify-center mb-4 p-4 bg-gold/10 w-16 h-16 rounded-2xl mx-auto luxury-transition">{f.icon}</div>
              <h3 className={`font-bold mb-2 text-base ${dark ? 'text-white' : 'text-black-main'}`}>{f.title}</h3>
              <p className={`text-xs leading-relaxed ${dark ? 'text-gray-500' : 'text-gray-500'}`}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Products */}
        <motion.div initial="hidden" whileInView="visible" variants={stagger} viewport={{ once: true }} className="mb-20">
          <div className="flex justify-between items-center mb-10">
            <h2 className={`text-3xl md:text-4xl font-bold ${dark ? 'text-white' : 'text-black-main'}`} style={{ fontFamily: lang === 'ar' ? "'Cairo'" : "'Playfair Display'" }}>{t('featured')} ⭐</h2>
            <Link to="/products" className="text-gold hover:underline font-bold flex items-center gap-2">{t('viewAll')} <Arrow size={20} /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p, i) => (
              <motion.div key={p.id} variants={fadeUp}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Discount Banner */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className={`p-12 rounded-3xl text-center mb-20 relative overflow-hidden ${dark ? 'bg-gradient-to-r from-gold/20 to-gold/10' : 'bg-gradient-to-r from-gold/10 to-gold/5'}`}>
          <div className="absolute inset-0 opacity-10">✨</div>
          <h2 className="text-4xl md:text-5xl font-bold text-gold mb-4 relative z-10">{lang === 'en' ? 'Flash Sale! 40% Off' : 'عرض فلاش! خصم 40%'}</h2>
          <p className={`text-lg mb-6 relative z-10 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{lang === 'en' ? 'Limited time offer on selected items' : 'عرض محدود الوقت على المنتجات المختارة'}</p>
          <Link to="/products?sale=true" className="inline-block bg-gold hover:bg-gold-light text-black-main font-bold py-3 px-10 rounded-xl transition-all hover:scale-110 relative z-10">{t('shopNow')}</Link>
        </motion.div>

        {/* Categories */}
        <motion.div initial="hidden" whileInView="visible" variants={stagger} viewport={{ once: true }} className="mb-20">
          <h2 className={`text-3xl md:text-4xl font-bold mb-10 ${dark ? 'text-white' : 'text-black-main'}`} style={{ fontFamily: lang === 'ar' ? "'Cairo'" : "'Playfair Display'" }}>{t('categories')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.slice(0, 8).map(cat => (
              <motion.div key={cat.id} variants={fadeUp}>
                <Link to={`/products?category=${cat.id}`} className={`block p-8 rounded-2xl text-center font-bold transition-all hover:scale-105 hover:shadow-lg ${dark ? 'bg-dark-card border border-dark-border text-white' : 'bg-soft-gray text-black-main'}`}>
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <p>{lang === 'ar' ? cat.ar : cat.en}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <motion.div initial="hidden" whileInView="visible" variants={stagger} viewport={{ once: true }} className="mb-20">
            <h2 className={`text-3xl md:text-4xl font-bold mb-10 ${dark ? 'text-white' : 'text-black-main'}`} style={{ fontFamily: lang === 'ar' ? "'Cairo'" : "'Playfair Display'" }}>{lang === 'en' ? 'Best Sellers' : 'الأكثر مبيعاً'} 🏆</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {bestSellers.map((p) => (
                <motion.div key={p.id} variants={fadeUp}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Flash Sale Products */}
        {flashSale.length > 0 && (
          <motion.div initial="hidden" whileInView="visible" variants={stagger} viewport={{ once: true }} className="mb-20">
            <h2 className={`text-3xl md:text-4xl font-bold mb-10 ${dark ? 'text-white' : 'text-black-main'}`} style={{ fontFamily: lang === 'ar' ? "'Cairo'" : "'Playfair Display'" }}>{lang === 'en' ? 'Flash Sale' : 'عرض فلاش'} 🔥</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {flashSale.map((p) => (
                <motion.div key={p.id} variants={fadeUp}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* New Arrivals */}
        <motion.div initial="hidden" whileInView="visible" variants={stagger} viewport={{ once: true }} className="mb-20">
          <h2 className={`text-3xl md:text-4xl font-bold mb-10 ${dark ? 'text-white' : 'text-black-main'}`} style={{ fontFamily: lang === 'ar' ? "'Cairo'" : "'Playfair Display'" }}>{lang === 'en' ? 'New Arrivals' : 'الوصول الحديث'} 🆕</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((p) => (
              <motion.div key={p.id} variants={fadeUp}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div initial="hidden" whileInView="visible" variants={stagger} viewport={{ once: true }} className="mb-20">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-10 ${dark ? 'text-white' : 'text-black-main'}`} style={{ fontFamily: lang === 'ar' ? "'Cairo'" : "'Playfair Display'" }}>{lang === 'en' ? 'Customer Reviews' : 'آراء العملاء'}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: lang === 'en' ? 'Sarah Anderson' : 'سارة أندرسون', rating: 5, text: lang === 'en' ? 'Amazing quality and fast shipping!' : 'جودة رائعة وشحن سريع!' },
              { name: lang === 'en' ? 'Ahmed Hassan' : 'أحمد حسن', rating: 5, text: lang === 'en' ? 'Best online shopping experience ever' : 'أفضل تجربة تسوق عبر الإنترنت' },
              { name: lang === 'en' ? 'Emma Wilson' : 'إيما ويلسون', rating: 4.5, text: lang === 'en' ? 'Great products and excellent service' : 'منتجات رائعة وخدمة ممتازة' }
            ].map((rev, i) => (
              <motion.div key={i} variants={fadeUp} className={`p-6 rounded-2xl ${dark ? 'bg-dark-card border border-dark-border' : 'bg-soft-gray'}`}>
                <div className="flex items-center gap-1 mb-3">
                  {Array(Math.floor(rev.rating)).fill(0).map((_, j) => <Star key={j} size={18} className="fill-gold text-gold" />)}
                </div>
                <p className={`mb-4 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{rev.text}</p>
                <p className="font-bold">{rev.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`p-12 rounded-3xl text-center mb-20 ${dark ? 'bg-gold/20 border border-gold/30' : 'bg-gold/10'}`}>
          <h2 className={`text-3xl font-bold mb-3 ${dark ? 'text-white' : 'text-black-main'}`}>{lang === 'en' ? 'Subscribe to our Newsletter' : 'اشترك في نشرتنا الإخبارية'}</h2>
          <p className={`mb-6 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{lang === 'en' ? 'Get exclusive deals and updates' : 'احصل على عروض وتحديثات حصرية'}</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('email')} className={`flex-1 px-4 py-3 rounded-xl border-2 outline-none transition-all ${dark ? 'bg-dark-card border-dark-border text-white focus:border-gold' : 'bg-white border-gray-200 focus:border-gold'}`} />
            <button 
              onClick={() => {
                if (email) {
                  import('react-hot-toast').then(t => t.default.success(lang === 'ar' ? 'تم الاشتراك بنجاح' : 'Subscribed successfully'));
                  setEmail('');
                }
              }}
              className="bg-gold hover:bg-gold-light text-black-main font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div initial="hidden" whileInView="visible" variants={stagger} viewport={{ once: true }} className="mb-20">
          <h2 className={`text-3xl md:text-4xl font-bold mb-10 text-center ${dark ? 'text-white' : 'text-black-main'}`} style={{ fontFamily: lang === 'ar' ? "'Cairo'" : "'Playfair Display'" }}>{lang === 'en' ? 'FAQs' : 'الأسئلة الشائعة'}</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} className={`rounded-2xl border-2 overflow-hidden ${dark ? 'border-dark-border' : 'border-gray-200'}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className={`w-full p-6 flex items-center justify-between font-bold transition-all ${openFaq === i ? (dark ? 'bg-dark-card' : 'bg-soft-gray') : (dark ? 'bg-black-main' : 'bg-white')}`}>
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={20} className="text-gold" /> : <ChevronDown size={20} className={dark ? 'text-gray-500' : 'text-gray-400'} />}
                </button>
                {openFaq === i && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`p-6 border-t-2 ${dark ? 'border-dark-border bg-dark-card text-gray-300' : 'border-gray-200 bg-soft-gray'}`}>
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div initial="hidden" whileInView="visible" variants={stagger} viewport={{ once: true }} className="mb-20">
          <h2 className={`text-3xl md:text-4xl font-bold mb-10 text-center ${dark ? 'text-white' : 'text-black-main'}`} style={{ fontFamily: lang === 'ar' ? "'Cairo'" : "'Playfair Display'" }}>{lang === 'en' ? 'Contact Us' : 'اتصل بنا'}</h2>
          <div className="max-w-2xl mx-auto">
            <form 
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name');
                const message = formData.get('message');
                const whatsappUrl = `https://wa.me/201027116120?text=${encodeURIComponent(`Name: ${name}\nMessage: ${message}`)}`;
                window.open(whatsappUrl, '_blank');
              }}
            >
              <input name="name" required type="text" placeholder={lang === 'en' ? 'Your Name' : 'اسمك'} className={`w-full px-5 py-3 rounded-xl border-2 outline-none transition-all ${dark ? 'bg-dark-card border-dark-border text-white focus:border-gold' : 'bg-white border-gray-200 focus:border-gold'}`} />
              <input name="email" required type="email" placeholder={t('email')} className={`w-full px-5 py-3 rounded-xl border-2 outline-none transition-all ${dark ? 'bg-dark-card border-dark-border text-white focus:border-gold' : 'bg-white border-gray-200 focus:border-gold'}`} />
              <textarea name="message" required placeholder={lang === 'en' ? 'Your Message' : 'رسالتك'} rows={4} className={`w-full px-5 py-3 rounded-xl border-2 outline-none transition-all ${dark ? 'bg-dark-card border-dark-border text-white focus:border-gold' : 'bg-white border-gray-200 focus:border-gold'}`} />
              <button type="submit" className="w-full bg-gold hover:bg-gold-light text-black-main font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-gold/20 flex items-center justify-center gap-2">
                <Send size={20} />
                {lang === 'en' ? 'Send Message via WhatsApp' : 'إرسال عبر واتساب'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
