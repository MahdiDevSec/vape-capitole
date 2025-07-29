import { Link } from 'react-router-dom';
import { FaStore, FaVial, FaShoppingCart, FaHeart, FaBars, FaTimes, FaFlask, FaBox, FaBatteryFull, FaCogs, FaBoxOpen, FaSmoking, FaCircle, FaBolt } from 'react-icons/fa';
import { GiAtom, GiGlassShot } from 'react-icons/gi';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeLanguageToggle from './ThemeLanguageToggle';
import Search from './Search';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl sm:text-2xl font-bold text-primary flex items-center space-x-2"
            onClick={closeMobileMenu}
          >
            <span className="hidden sm:inline">Vape Capitole</span>
            <span className="sm:hidden">VC</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link
              to="/stores"
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary rounded-lg transition-colors text-sm xl:text-base"
            >
              <FaStore className="mr-2" />
              {t('nav.stores')}
            </Link>
            {/* منتجاتنا Dropdown */}
            <div className="relative group">
              <button className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary rounded-lg transition-colors text-sm xl:text-base focus:outline-none">
                <FaShoppingCart className="mr-2" />
                منتجاتنا
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity z-50">
                <Link to="/products/vapekits" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaSmoking />
                  {t('category.vape-kits')}
                </Link>
                <Link to="/products/vapeboxes" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaSmoking />
                  {t('category.vape-boxes')}
                </Link>
                <Link to="/products/atomisers" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <GiAtom />
                  {t('category.atomizers')}
                </Link>
                <Link to="/products/pyrex" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <GiGlassShot />
                  {t('category.pyrex')}
                </Link>
                <Link to="/products/batteries" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaBatteryFull />
                  {t('category.accus')}
                </Link>
                <Link to="/products/accessories" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaCogs />
                  {t('category.accessories')}
                </Link>
                <Link to="/products/cotton" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaFlask />
                  {t('category.cotton')}
                </Link>
                <Link to="/products/coils" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaCircle />
                  {t('category.coils')}
                </Link>
                <Link to="/products/resistors" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FaBolt />
                  {t('category.resistors')}
                </Link>
              </div>
            </div>
            <Link
              to="/liquids"
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary rounded-lg transition-colors text-sm xl:text-base"
            >
              <FaVial className="mr-2" />
              {t('nav.liquids')}
            </Link>
            <Link
              to="/mix"
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary rounded-lg transition-colors text-sm xl:text-base"
            >
              <FaFlask className="mr-2" />
              {t('nav.mix')}
            </Link>
            <div className="w-48 xl:w-64">
              <Search />
            </div>
            <Link
              to="/favorites"
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary rounded-lg transition-colors text-sm xl:text-base"
            >
              <FaHeart className="mr-2" />
              {t('nav.favorites')}
            </Link>

            <ThemeLanguageToggle />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-gray-700 dark:text-gray-300 p-2 hover:text-primary dark:hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
            <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 space-y-2">
            {/* Search in mobile menu */}
            <div className="mb-4">
              <Search />
            </div>
            
            <Link
              to="/stores"
              className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={closeMobileMenu}
            >
              <FaStore className="mr-3 text-primary" />
              {t('nav.stores')}
            </Link>
            <Link
              to="/products"
              className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={closeMobileMenu}
            >
              <FaShoppingCart className="mr-3 text-primary" />
              {t('nav.products')}
            </Link>
            <Link
              to="/liquids"
              className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={closeMobileMenu}
            >
              <FaVial className="mr-3 text-primary" />
              {t('nav.liquids')}
            </Link>
            <Link
              to="/mix"
              className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={closeMobileMenu}
            >
              <FaFlask className="mr-3 text-primary" />
              {t('nav.mix')}
            </Link>
            <Link
              to="/favorites"
              className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={closeMobileMenu}
            >
              <FaHeart className="mr-3 text-primary" />
              {t('nav.favorites')}
            </Link>
            
            {/* Theme and Language toggle in mobile */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <ThemeLanguageToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
