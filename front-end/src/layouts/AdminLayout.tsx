import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaStore, FaBox, FaVial, FaUsers, FaChartBar, FaCog, FaUserPlus, FaSignOutAlt, FaShoppingCart, FaSun, FaMoon, FaGlobe, FaLanguage } from 'react-icons/fa';
import React, { useState } from 'react';
import AdminRegModal from '../pages/admin/AdminReg';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const AdminLayout = () => {
  const [showAdminReg, setShowAdminReg] = useState(false);
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const toggleLanguage = () => {
    const languages = ['ar', 'en', 'fr'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex] as 'ar' | 'en' | 'fr');
  };

  return (
    <div className="flex h-screen bg-page">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
          <button
            className="ml-2 p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
            title="تسجيل أدمن جديد"
            onClick={() => setShowAdminReg(true)}
          >
            <FaUserPlus />
          </button>
        </div>
        
        {/* Theme and Language Toggle */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
              <span className="text-sm">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title={`Switch to ${language === 'ar' ? 'English' : language === 'en' ? 'French' : 'Arabic'}`}
            >
              <FaGlobe />
              <span className="text-sm">{language === 'ar' ? 'EN' : language === 'en' ? 'FR' : 'عربي'}</span>
            </button>
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin"
                className="flex items-center gap-3 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <FaChartBar />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/stores"
                className="flex items-center gap-3 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <FaStore />
                Stores
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className="flex items-center gap-3 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <FaBox />
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/admin/liquids"
                className="flex items-center gap-3 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <FaVial />
                Liquids
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center gap-3 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <FaUsers />
                Users
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="flex items-center gap-3 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <FaShoppingCart />
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/admin/translations"
                className="flex items-center gap-3 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <FaLanguage />
                Translations
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className="flex items-center gap-3 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <FaCog />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <button
            className="mb-4 btn btn-primary flex items-center gap-2"
            onClick={() => setShowAdminReg(true)}
          >
            <FaUserPlus />
            تسجيل أدمن جديد
          </button>
          <Outlet />
        </div>
      </main>
      <AdminRegModal isOpen={showAdminReg} onClose={() => setShowAdminReg(false)} />
    </div>
  );
};

export default AdminLayout;
