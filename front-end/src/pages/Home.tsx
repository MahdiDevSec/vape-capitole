import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaVial, FaShoppingCart } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-page">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            {t('home.welcome')} <span className="text-primary">{t('home.vapeCapitole')}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="btn-main px-8 py-3 flex items-center justify-center gap-2"
            >
              <FaShoppingCart />
              {t('home.products')}
            </Link>
            <Link
              to="/liquids"
              className="btn-main px-8 py-3 flex items-center justify-center gap-2"
            >
              <FaVial />
              {t('home.liquids')}
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <FaStore className="text-4xl text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('home.stores')}</h3>
            <p className="text-gray-600">{t('home.storesDesc')}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <FaShoppingCart className="text-4xl text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('home.products')}</h3>
            <p className="text-gray-600">{t('home.productsDesc')}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <FaVial className="text-4xl text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('home.liquids')}</h3>
            <p className="text-gray-600">{t('home.liquidsDesc')}</p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg p-8 shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-4">{t('home.discover')}</h2>
          <p className="text-lg text-gray-600 mb-6">{t('home.quality')}</p>
          <Link
            to="/products"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t('common.view')} {t('home.products')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
