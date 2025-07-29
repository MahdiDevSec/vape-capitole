import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{t('footer.title')}</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              {t('footer.subtitle')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.home')}
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.products')}
                </Link>
              </li>
              <li>
                <Link to="/liquids" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.liquids')}
                </Link>
              </li>
              <li>
                <Link to="/stores" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <FaEnvelope className="mr-2" />
                <span>{t('footer.email')}: info@vape-capitole.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FaPhone className="mr-2" />
                <span>{t('footer.phone')}: +213 XXX XXX XXX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-2">{t('footer.newsletter')}</h4>
            <p className="text-gray-300 mb-4">{t('footer.subscribeDesc')}</p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('footer.email')}
                className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none"
              />
              <button className="bg-primary text-white px-6 py-2 rounded-r-lg hover:bg-primary/90 transition-colors">
                {t('footer.subscribe')}
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2024 Vape Capitole. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
