import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHeart } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

import { useFavorites } from '../contexts/FavoritesContext';
import VapeIcon from './VapeIcon';
import ThemeLanguageToggle from './ThemeLanguageToggle';

const Navbar = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const { state: favoritesState } = useFavorites();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/liquids', label: t('nav.liquids') },
    { path: '/stores', label: t('nav.stores') },
    { path: '/mix', label: t('nav.mix') },
    { path: '/used-products', label: t('nav.usedProducts') || 'منتجات مستعملة' },
  ];

  const productCategories = [
    { path: '/products/vape-kits', label: 'Vape Kits' },
    { path: '/products/atomisers', label: 'Atomisers' },
    { path: '/products/coils', label: 'Coils' },
    { path: '/products/batteries', label: 'Batteries' },
    { path: '/products/cotton', label: 'Cotton' },
    { path: '/products/pyrex', label: 'Pyrex' },
    { path: '/products/resistors', label: 'Resistors' },
    { path: '/products/accessories', label: 'Accessories' },
  ];

  return (
    <nav className={`sticky top-0 z-50 border-b ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-x-6 group">
            <VapeIcon size="sm" className="vape-float" />
            <span className="text-xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">
              VAPE CAPITOL
            </span>
          </Link>

          {/* Navigation + Icons (كل شيء في نفس flex) */}
          <div className="hidden md:flex items-center gap-x-8">
            {/* الروابط */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-semibold transition-colors duration-200 relative ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:text-blue-400 ${location.pathname === item.path ? 'text-blue-400' : ''}`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400 vape-glow"></div>
                )}
              </Link>
            ))}
            {/* Products Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                className={`font-semibold transition-colors duration-200 relative flex items-center gap-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:text-blue-400`}
              >
                {t('nav.products')}
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {/* Vape smoke effect */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-blue-400/30 rounded-full vape-smoke opacity-0 group-hover:opacity-100"></div>
              </button>
              {isProductsDropdownOpen && (
                <div className={`absolute top-full left-0 mt-2 min-w-[200px] z-50 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} backdrop-blur-md rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-lg py-2`}>
                  {productCategories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      onClick={() => setIsProductsDropdownOpen(false)}
                      className={`block px-4 py-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:bg-blue-500/10 hover:text-blue-500 transition-colors ${location.pathname === category.path ? 'bg-blue-500/20 text-blue-400' : ''}`}
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* الأيقونات (كل واحدة مباشرة في نفس flex) */}
            <ThemeLanguageToggle />

            <Link
              to="/favorites"
              className={`vape-btn relative p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} hover:bg-pink-100 transition-all duration-200 group`}
            >
              <FaHeart className="text-lg" />
              {favoritesState.items && favoritesState.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center vape-pulse">
                  {favoritesState.items.length}
                </span>
              )}
              {/* Vape smoke effect */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-pink-400/30 rounded-full vape-smoke opacity-0 group-hover:opacity-100" style={{animationDelay: '0.5s'}}></div>
            </Link>
          </div>
          {/* زر القائمة يظهر فقط على الموبايل */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden vape-btn p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} hover:bg-blue-100 transition-all duration-200 group ml-2`}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
            {/* Vape smoke effect */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-green-400/30 rounded-full vape-smoke opacity-0 group-hover:opacity-100" style={{animationDelay: '1s'}}></div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} backdrop-blur-md rounded-lg mt-2 p-4 w-full shadow-lg z-50`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:text-blue-400 transition-colors ${location.pathname === item.path ? 'text-blue-400' : ''}`}
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile Products Dropdown */}
            <div className="mt-4">
              <button
                onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                className={`w-full text-left py-3 font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:text-blue-400 transition-colors flex items-center justify-between`}
              >
                {t('nav.products')}
                <svg className={`w-4 h-4 transition-transform duration-200 ${isProductsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isProductsDropdownOpen && (
                <div className="mt-2 ml-4 space-y-2">
                  {productCategories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      onClick={() => {
                        setIsProductsDropdownOpen(false);
                        setIsMenuOpen(false);
                      }}
                      className={`block py-2 font-medium text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:text-blue-400 transition-colors ${location.pathname === category.path ? 'text-blue-400' : ''}`}
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* أيقونات في الأسفل */}
            <div className="flex justify-around mt-6 gap-4">
              <ThemeLanguageToggle />

              <Link
                to="/favorites"
                className={`vape-btn relative p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} hover:bg-pink-100 transition-all duration-200 group`}
              >
                <FaHeart className="text-lg" />
                {favoritesState.items && favoritesState.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center vape-pulse">
                    {favoritesState.items.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


