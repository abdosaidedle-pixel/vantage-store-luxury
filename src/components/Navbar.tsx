import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Menu, X, Sun, Moon, Globe, User } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { t, lang, setLang, dark, toggleDark, cartCount, wishlist } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: t('home'), icon: null },
    { to: '/products', label: t('products'), icon: null },
    { to: '/products?sale=true', label: t('offers'), icon: '🎉' },
    { to: '/wishlist', label: t('wishlist'), icon: '❤️' },
  ];

  const actionButtons = [
    { to: '/wishlist', icon: Heart, label: t('wishlist'), badge: wishlist.length, color: 'heart' },
    { to: '/cart', icon: ShoppingBag, label: t('cart'), badge: cartCount, color: 'cart' },
    { to: '/admin', icon: User, label: 'Admin', badge: 0, color: 'admin' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${dark ? 'bg-black-main/95 border-dark-border shadow-2xl' : 'bg-white/95 border-gray-100 shadow-lg'} backdrop-blur-xl border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group hover:scale-105 transition-transform duration-200">
              <span className="text-2xl lg:text-3xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span className="text-gold-gradient">V</span>
                <span className={dark ? 'text-white' : 'text-black-main'}>ANTAGE</span>
              </span>
              <span className={`text-[10px] lg:text-xs mt-2 tracking-[0.3em] uppercase font-bold ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Store</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-gold/10 hover:text-gold ${dark ? 'text-gray-300 hover:bg-dark-border' : 'text-gray-700 hover:bg-soft-gray'}`}
                >
                  {link.icon && <span className="mr-1">{link.icon}</span>}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button 
                onClick={() => setSearchOpen(true)} 
                className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-110 hover:bg-gold/10 ${dark ? 'text-gray-300 hover:text-gold' : 'text-gray-700 hover:text-gold'}`}
                aria-label={t('search')}
                title={t('search')}
              >
                <Search size={20} />
              </button>

              <button 
                onClick={toggleDark} 
                className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-110 hover:bg-gold/10 hidden sm:block ${dark ? 'text-gray-300 hover:text-gold' : 'text-gray-700 hover:text-gold'}`}
                aria-label="Toggle dark mode"
                title="Dark mode"
              >
                {dark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-110 hover:bg-gold/10 hidden sm:flex items-center gap-1 text-sm font-bold ${dark ? 'text-gray-300 hover:text-gold' : 'text-gray-700 hover:text-gold'}`}
                aria-label="Language toggle"
              >
                <Globe size={18} />
                <span className="hidden md:inline">{lang === 'en' ? 'عربي' : 'EN'}</span>
              </button>

              {/* Action Links with Badges */}
              <Link 
                to="/wishlist" 
                className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-110 hover:bg-gold/10 relative ${dark ? 'text-gray-300 hover:text-gold' : 'text-gray-700 hover:text-gold'}`}
                title={t('wishlist')}
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-gold to-gold-light text-black-main text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                    {wishlist.length > 99 ? '99+' : wishlist.length}
                  </span>
                )}
              </Link>

              <Link 
                to="/cart" 
                className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-110 hover:bg-gold/10 relative ${dark ? 'text-gray-300 hover:text-gold' : 'text-gray-700 hover:text-gold'}`}
                title={t('cart')}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-gold to-gold-light text-black-main text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              <Link 
                to="/admin" 
                className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-110 hover:bg-gold/10 hidden sm:block ${dark ? 'text-gray-300 hover:text-gold' : 'text-gray-700 hover:text-gold'}`}
                title="Admin Panel"
              >
                <User size={20} />
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileOpen(true)} 
                className={`p-2.5 rounded-xl lg:hidden transition-all duration-200 hover:scale-110 hover:bg-gold/10 ${dark ? 'text-gray-300 hover:text-gold' : 'text-gray-700 hover:text-gold'}`}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.form
              initial={{ y: -30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              onSubmit={handleSearch}
              className={`w-full max-w-2xl rounded-2xl overflow-hidden ${dark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-200'} shadow-2xl`}
            >
              <div className="flex items-center p-4 gap-3">
                <Search size={24} className="text-gold shrink-0" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('search')}
                  className={`flex-1 px-2 py-3 bg-transparent text-lg font-medium outline-none ${dark ? 'text-white placeholder-gray-500' : 'text-black-main placeholder-gray-400'}`}
                />
                <button 
                  type="button" 
                  onClick={() => setSearchOpen(false)} 
                  className={`p-2 rounded-lg transition-all hover:scale-110 ${dark ? 'text-gray-400 hover:text-gold hover:bg-dark-border' : 'text-gray-400 hover:text-gold hover:bg-soft-gray'}`}
                >
                  <X size={20} />
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: lang === 'ar' ? -100 : 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: lang === 'ar' ? -100 : 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
              className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-full max-w-sm h-full ${dark ? 'bg-dark-card border-l border-dark-border' : 'bg-white border-l border-gray-200'} shadow-2xl overflow-y-auto`}
            >
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: dark ? '#2A2A2A' : '#E5E5E5' }}>
                <Link 
                  to="/" 
                  onClick={() => setMobileOpen(false)}
                  className="text-xl font-bold"
                >
                  <span className="text-gold">V</span>
                  <span className={dark ? 'text-white' : 'text-black-main'}>ANTAGE</span>
                </Link>
                <button 
                  onClick={() => setMobileOpen(false)} 
                  className={`p-2 rounded-lg transition-all hover:scale-110 ${dark ? 'text-gray-300 hover:bg-dark-border' : 'text-gray-700 hover:bg-soft-gray'}`}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${dark ? 'text-gray-200 hover:bg-dark-border hover:text-gold' : 'text-gray-800 hover:bg-soft-gray hover:text-gold'}`}
                  >
                    {link.icon && <span className="text-xl">{link.icon}</span>}
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${dark ? 'text-gray-200 hover:bg-dark-border hover:text-gold' : 'text-gray-800 hover:bg-soft-gray hover:text-gold'}`}
                >
                  <User size={18} />
                  Admin Panel
                </Link>
              </div>

              <div className="p-4 border-t" style={{ borderColor: dark ? '#2A2A2A' : '#E5E5E5' }}>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => { toggleDark(); setMobileOpen(false); }} 
                    className={`py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${dark ? 'bg-dark-border text-gold hover:bg-gold hover:text-black-main' : 'bg-soft-gray text-gray-700 hover:bg-gold hover:text-black-main'}`}
                  >
                    {dark ? <Sun size={18} /> : <Moon size={18} />}
                    {dark ? 'Light' : 'Dark'}
                  </button>
                  <button
                    onClick={() => { setLang(lang === 'en' ? 'ar' : 'en'); setMobileOpen(false); }}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${dark ? 'bg-dark-border text-gold hover:bg-gold hover:text-black-main' : 'bg-soft-gray text-gray-700 hover:bg-gold hover:text-black-main'}`}
                  >
                    <Globe size={18} />
                    {lang === 'en' ? 'عربي' : 'EN'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
