import { useStore } from '../store';
import { Heart } from 'lucide-react';

export default function Footer() {
  const { t, lang, dark } = useStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-12 border-t ${dark ? 'bg-black-main border-dark-border' : 'bg-white border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-gold-gradient">V</span>
              <span className={dark ? 'text-white' : 'text-black-main'}>ANTAGE</span>
            </span>
          </div>
          
          <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'} max-w-md`}>
            {t('footerDesc') || 'Experience luxury and elegance with VANTAGE Store. Premium products curated for the discerning customer.'}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <a 
              href="https://www.facebook.com/share/18GgaFiqoW/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${dark ? 'bg-dark-card hover:bg-dark-border text-gray-300' : 'bg-soft-gray hover:bg-gray-200 text-gray-600'}`}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-xs font-bold">{lang === 'ar' ? 'فيسبوك' : 'Facebook'}</span>
            </a>
          </div>

          <div className={`pt-8 border-t w-full flex flex-col md:flex-row items-center justify-between gap-4 ${dark ? 'border-dark-border' : 'border-gray-50'}`}>
            <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              © {currentYear} VANTAGE Store. All rights reserved.
            </p>
            
            <div className={`flex items-center gap-1.5 text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              <span>Web Designer:</span>
              <a 
                href="https://abdosaidedle-pixel.github.io/Portofolio-Abdo-main/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold font-bold hover:text-gold-light transition-all border-b border-transparent hover:border-gold"
              >
                Abdo Said
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
