import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import VapeIcon from './VapeIcon';

const Footer = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <VapeIcon size="sm" className="vape-float" />
              <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Vape Capitole</h3>
            </div>
            <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t('footer.subtitle')}</p>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <a href="#" className={`vape-btn p-2 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} ${theme === 'dark' ? 'text-white' : 'text-gray-700'} hover:bg-white/20 transition-all duration-200`}><FaFacebook className="text-lg" /></a>
              <a href="#" className={`vape-btn p-2 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} ${theme === 'dark' ? 'text-white' : 'text-gray-700'} hover:bg-white/20 transition-all duration-200`}><FaTwitter className="text-lg" /></a>
              <a href="#" className={`vape-btn p-2 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} ${theme === 'dark' ? 'text-white' : 'text-gray-700'} hover:bg-white/20 transition-all duration-200`}><FaInstagram className="text-lg" /></a>
              <a href="#" className={`vape-btn p-2 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} ${theme === 'dark' ? 'text-white' : 'text-gray-700'} hover:bg-white/20 transition-all duration-200`}><FaWhatsapp className="text-lg" /></a>
            </div>
          </div>
          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('footer.quickLinks')}</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li><Link to="/" className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-400 transition-colors duration-200`}>{t('footer.home')}</Link></li>
              <li><Link to="/products" className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-400 transition-colors duration-200`}>{t('footer.products')}</Link></li>
              <li><Link to="/liquids" className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-400 transition-colors duration-200`}>{t('footer.liquids')}</Link></li>
              <li><Link to="/stores" className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-400 transition-colors duration-200`}>{t('nav.stores')}</Link></li>
            </ul>
          </div>
          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('footer.contact')}</h4>
            <div className={`space-y-1 sm:space-y-2 text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}> 
              <p>{t('footer.email')}: info@vape-capitole.com</p>
              <p>{t('footer.phone')}: +213 XXX XXX XXX</p>
              <p>Algiers, Algeria</p>
            </div>
          </div>
          {/* Newsletter */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('footer.newsletter')}</h4>
            <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t('footer.subscribeDesc')}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg sm:rounded-l-lg ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} border focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              <button className="vape-btn px-4 py-2 bg-blue-500 text-white rounded-lg sm:rounded-r-lg hover:bg-blue-600 transition-colors duration-200 w-full sm:w-auto">
                {t('footer.subscribe')}
              </button>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div className={`border-t ${theme === 'dark' ? 'border-white/20' : 'border-gray-300'} mt-6 sm:mt-8 pt-6 sm:pt-8 text-center`}>
          <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>© 2024 Vape Capitole. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
