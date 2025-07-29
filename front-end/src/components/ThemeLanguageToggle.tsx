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
        className="p-2 rounded-full hover:bg-surface transition-colors"
        aria-label={t('theme.' + theme)}
      >
        {theme === 'dark' ? (
          <FaMoon className="text-primary" />
        ) : (
          <FaSun className="text-primary" />
        )}
      </button>

      {/* Language Toggle */}
      <div className="relative">
        <button
          onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
          className="p-2 rounded-full hover:bg-surface transition-colors flex items-center gap-2"
          aria-label={t('lang.' + language)}
        >
          <FaGlobe className="text-primary" />
          <span className="text-text-secondary">{language.toUpperCase()}</span>
        </button>

        {isLangMenuOpen && (
          <div className="dropdown absolute mt-2 min-w-[120px] z-50">
            {(['ar', 'en', 'fr'] as const).map((lang) => (
              <button
                key={lang}
                className="dropdown-item w-full text-start"
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
