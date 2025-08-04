import React, { useState } from 'react';
import { FaTrash, FaPlus, FaMinus, FaCreditCard, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatPrice } from '../utils/currency';
import { Link } from 'react-router-dom';
import { createGuestOrder, type OrderData } from '../services/orderService';
import VapeAnimation from '../components/VapeAnimation';

const CartPage = () => {
  const { state: cartState, dispatch } = useCart();
  const { t, language } = useLanguage();
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const calculateTotal = () => {
    return cartState.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentInfoChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare order data
      const orderData: OrderData = {
        customerInfo,
        products: cartState.items,
        totalAmount: calculateTotal(),
        paymentInfo
      };

      // Submit order to backend
      const response = await createGuestOrder(orderData);
      
      // Clear cart after successful order
      dispatch({ type: 'CLEAR_CART' });
      
      // Show success message
      alert(language === 'ar' 
        ? `تم تأكيد طلبك بنجاح! رقم الطلب: ${response.orderId}` 
        : `Your order has been confirmed successfully! Order ID: ${response.orderId}`
      );
      
    } catch (error: any) {
      console.error('Error submitting order:', error);
      alert(language === 'ar' 
        ? `حدث خطأ في إرسال الطلب: ${error.message}` 
        : `Error submitting order: ${error.message}`
      );
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-10 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center dark:text-white">
            {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
          </h1>
          <div className="text-center py-12">
            <div className="mb-6">
              <VapeAnimation size="large" className="mx-auto" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
              {language === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty'}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {language === 'ar' 
                ? 'ابدأ رحلة الفايب الخاصة بك واكتشف منتجاتنا المميزة'
                : 'Start your vaping journey and discover our premium products'
              }
            </p>
            <Link 
              to="/products" 
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {language === 'ar' ? '🛍️ تسوق الآن' : '🛍️ Shop Now'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center dark:text-white">
          {language === 'ar' ? 'إتمام الطلب' : 'Complete Your Order'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Products Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
              🛍️ {language === 'ar' ? 'المنتجات المختارة' : 'Selected Products'}
            </h2>
            
            <div className="space-y-4 mb-6">
              {cartState.items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  {item.product.image ? (
                    <img
                      src={item.product.image.startsWith('http') ? item.product.image : `http://localhost:5000${item.product.image}`}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg dark:text-white">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.product.description}
                    </p>
                    {item.product.nicotineLevel && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {language === 'ar' ? 'نكهة:' : 'Flavor:'} {item.product.nicotineLevel}mg
                      </p>
                    )}
                    <p className="text-sm font-medium text-green-600">
                      {formatPrice(item.product.price, language)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="w-8 text-center font-medium dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      <FaPlus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded ml-2"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="dark:text-white">
                  {language === 'ar' ? 'المجموع:' : 'Total:'}
                </span>
                <span className="text-green-600">
                  {formatPrice(calculateTotal(), language)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information & Payment Section */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
                <FaUser className="mr-2" />
                {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) => handleCustomerInfoChange('fullName', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    <FaEnvelope className="inline mr-1" />
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    <FaPhone className="inline mr-1" />
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    <FaMapMarkerAlt className="inline mr-1" />
                    {language === 'ar' ? 'العنوان' : 'Address'}
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">
                      {language === 'ar' ? 'المدينة' : 'City'}
                    </label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">
                      {language === 'ar' ? 'الرمز البريدي' : 'Postal Code'}
                    </label>
                    <input
                      type="text"
                      value={customerInfo.postalCode}
                      onChange={(e) => handleCustomerInfoChange('postalCode', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
                <FaCreditCard className="mr-2" />
                {language === 'ar' ? 'معلومات الدفع - My TPE' : 'Payment Information - My TPE'}
              </h2>
              
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {language === 'ar' 
                    ? '💳 الدفع الآمن عبر خدمة My TPE - جميع المعاملات محمية ومشفرة'
                    : '💳 Secure payment via My TPE service - All transactions are protected and encrypted'
                  }
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    {language === 'ar' ? 'اسم حامل البطاقة' : 'Cardholder Name'}
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.cardholderName}
                    onChange={(e) => handlePaymentInfoChange('cardholderName', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder={language === 'ar' ? 'الاسم كما يظهر على البطاقة' : 'Name as it appears on card'}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    {language === 'ar' ? 'رقم البطاقة' : 'Card Number'}
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => handlePaymentInfoChange('cardNumber', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">
                      {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => handlePaymentInfoChange('expiryDate', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.cvv}
                      onChange={(e) => handlePaymentInfoChange('cvv', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <form onSubmit={handleSubmitOrder}>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
              >
                {language === 'ar' 
                  ? `🚀 تأكيد الطلب - ${formatPrice(calculateTotal(), language)}`
                  : `🚀 Confirm Order - ${formatPrice(calculateTotal(), language)}`
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
