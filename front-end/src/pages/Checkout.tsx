import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatPrice } from '../utils/currency';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { state: cartState } = useCart();
  const { t, language } = useLanguage();
  const total = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-10 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center dark:text-white">{t('checkout.title') || 'إتمام الطلب'}</h1>
        {cartState.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">{t('checkout.empty') || 'سلة الشراء فارغة.'}</p>
            <Link to="/products" className="vape-btn bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition">{t('checkout.shopNow') || 'تسوق الآن'}</Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartState.items.map((item) => (
                <div key={item._id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg dark:text-white">{item.name}</h3>
                    <p className="text-xs text-gray-500">{t('checkout.quantity') || 'الكمية'}: {item.quantity}</p>
                  </div>
                  <div className="text-blue-600 font-bold text-base sm:text-lg">{formatPrice(item.price * item.quantity, language)}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center border-t pt-4 mb-6">
              <span className="font-semibold text-lg dark:text-white">{t('checkout.total') || 'المجموع'}</span>
              <span className="text-xl font-bold text-green-600">{formatPrice(total, language)}</span>
            </div>
            <form className="space-y-4">
              <input type="text" placeholder={t('checkout.name') || 'الاسم الكامل'} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" required />
              <input type="tel" placeholder={t('checkout.phone') || 'رقم الهاتف'} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" required />
              <input type="text" placeholder={t('checkout.address') || 'العنوان'} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white" required />
              <button type="submit" className="w-full vape-btn bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">{t('checkout.placeOrder') || 'تأكيد الطلب'}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout; 