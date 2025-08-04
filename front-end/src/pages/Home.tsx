import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import VapeIcon from '../components/VapeIcon';
import LiquidBottle from '../components/LiquidBottle';
import SmokeLoadingScreen from '../components/SmokeLoadingScreen';

const Home = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Check if this is the first time visiting the site
    const hasVisited = sessionStorage.getItem('hasVisitedHome');
    
    if (!hasVisited) {
      setShowLoading(true);
      sessionStorage.setItem('hasVisitedHome', 'true');
    }
    
    // Listen for beforeunload event (refresh)
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('hasVisitedHome');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <>
      {showLoading && <SmokeLoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <div className="relative min-h-screen">
      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-20 px-2 sm:px-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Animated Vape Icon */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <VapeIcon size="lg" />
            </div>
            <h1 className={`text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 vape-pulse ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}> 
              {t('home.welcome')} <span className="text-yellow-400">{t('home.vapeCapitole')}</span>
            </h1>
            <p className={`text-base xs:text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}> 
              {t('home.discover')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link 
                to="/products" 
                className="vape-btn bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                {t('home.products')}
              </Link>
              <Link 
                to="/liquids" 
                className="vape-btn bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
              >
                {t('home.liquids')}
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10 sm:py-16 px-2 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-2xl xs:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}> 
              {t('home.quality')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
              {/* Feature 1 */}
              <div className={`modern-card ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100/80'} backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center`}>
                <div className="flex justify-center mb-3 sm:mb-4">
                  <VapeIcon size="md" />
                </div>
                <h3 className={`text-lg sm:text-xl font-semibold mb-1 sm:mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>أجهزة عالية الجودة</h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>أفضل الأجهزة والملحقات من أشهر العلامات التجارية</p>
              </div>
              {/* Feature 2 */}
              <div className={`modern-card ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100/80'} backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center`}>
                <div className="flex justify-center mb-3 sm:mb-4">
                  <LiquidBottle color="#f093fb" level={85} />
                </div>
                <h3 className={`text-lg sm:text-xl font-semibold mb-1 sm:mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>سوائل مميزة</h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>تشكيلة واسعة من النكهات والسوائل المميزة</p>
              </div>
              {/* Feature 3 */}
              <div className={`modern-card ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100/80'} backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center`}>
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg vape-glow"></div>
                </div>
                <h3 className={`text-lg sm:text-xl font-semibold mb-1 sm:mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>خدمة مميزة</h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>خدمة عملاء على مدار الساعة ودعم فني متخصص</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Preview */}
        <section className="py-10 sm:py-16 px-2 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-2xl xs:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}> 
              {t('home.products')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { name: 'Vape Kits', icon: '🔋', color: 'from-blue-500 to-cyan-500', path: '/products/vape-kits' },
                { name: 'Liquids', icon: '💧', color: 'from-pink-500 to-purple-500', path: '/liquids' },
                { name: 'Accessories', icon: '🛠️', color: 'from-green-500 to-emerald-500', path: '/products/accessories' },
                { name: 'Stores', icon: '🏪', color: 'from-orange-500 to-red-500', path: '/stores' },
              ].map((category, index) => (
                <Link
                  key={index}
                  to={category.path}
                  className={`modern-card ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100/80'} backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300`}
                >
                  <div className={`text-3xl sm:text-4xl mb-3 sm:mb-4 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                    {category.icon}
                  </div>
                  <h3 className={`text-base sm:text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
};

export default Home;
