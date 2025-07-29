import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes';
import { optimizePerformance, storageOptimizer } from './utils/performance';

function App() {
  useEffect(() => {
    // تطبيق تحسينات الأداء
    optimizePerformance();
    
    // تنظيف التخزين المحلي
    storageOptimizer.cleanup();
    
    // تنظيف دوري للتخزين المحلي
    const cleanupInterval = setInterval(() => {
      storageOptimizer.cleanup();
    }, 300000); // كل 5 دقائق

    return () => {
      clearInterval(cleanupInterval);
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <RouterProvider router={router} />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
