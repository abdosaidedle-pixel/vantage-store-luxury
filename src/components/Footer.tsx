import { useStore } from '../store';
import { Heart } from 'lucide-react';

export default function Footer() {
  const { t, dark } = useStore();
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
