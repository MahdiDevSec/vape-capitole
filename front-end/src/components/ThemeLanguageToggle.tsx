import React, { useState } from 'react';
import { FaMoon, FaSun, FaGlobe } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const ThemeLanguageToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`vape-btn p-2 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-700/10'} ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:bg-white/20 transition-all duration-200 relative group`}
        aria-label={t('theme.' + theme)}
      >
        {theme === 'dark' ? (
          <FaMoon className="text-lg" />
        ) : (
          <FaSun className="text-lg" />
        )}
        {/* Vape smoke effect */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-blue-400/30 rounded-full vape-smoke opacity-0 group-hover:opacity-100"></div>
      </button>

      {/* Language Toggle */}
      <div className="relative">
        <button
          onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
          className={`vape-btn p-2 rounded-lg ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-700/10'} ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:bg-white/20 transition-all duration-200 flex items-center gap-2 relative group`}
          aria-label={t('lang.' + language)}
        >
          <FaGlobe className="text-lg" />
          <span className="text-sm font-medium">{language.toUpperCase()}</span>
          {/* Vape smoke effect */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-purple-400/30 rounded-full vape-smoke opacity-0 group-hover:opacity-100" style={{animationDelay: '0.5s'}}></div>
        </button>

        {isLangMenuOpen && (
          <div className={`absolute mt-2 min-w-[120px] z-50 ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-md rounded-lg border ${theme === 'dark' ? 'border-white/20' : 'border-gray-200/20'} shadow-lg`}>
            {(['ar', 'en', 'fr'] as const).map((lang) => (
              <button
                key={lang}
                className={`w-full text-start px-4 py-2 hover:bg-white/10 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${language === lang ? 'bg-blue-500/20 text-blue-400' : ''}`}
                onClick={() => {
                  setLanguage(lang);
                  setIsLangMenuOpen(false);
                }}
              >
                {t('lang.' + lang)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeLanguageToggle;
