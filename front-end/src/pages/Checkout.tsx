import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { state: cartState, dispatch } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError(t('checkout.loginRequired'));
      return;
    }

    if (cartState.items.length === 0) {
      setError(t('cart.empty'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const orderData = {
        products: cartState.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: cartState.total,
        shippingAddress,
        paymentMethod
      };

      await axios.post('/api/orders', orderData);
      
      // Clear cart after successful order
      dispatch({ type: 'CLEAR_CART' });
      
      // Redirect to success page or orders page
      navigate('/orders');
    } catch (err: any) {
      setError(err?.response?.data?.message || t('checkout.orderFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('cart.empty')}</h1>
          <p className="text-gray-600 mb-4">{t('checkout.addProductsFirst')}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
          >
            {t('checkout.continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{t('checkout.orderSummary')}</h2>
          
          {cartState.items.map((item) => (
            <div key={item.product._id} className="flex justify-between items-center py-2 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">{t('checkout.quantity')}: {item.quantity}</p>
                </div>
              </div>
              <span className="font-semibold">{item.product.price * item.quantity} {t('common.currency')}</span>
            </div>
          ))}
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>{t('cart.subtotal')}:</span>
              <span>{cartState.total} {t('common.currency')}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('cart.shipping')}:</span>
              <span>{t('checkout.freeShipping')}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>{t('cart.grandTotal')}:</span>
              <span>{cartState.total} {t('common.currency')}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{t('checkout.shippingInfo')}</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('checkout.street')}</label>
              <input
                type="text"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.city')}</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.state')}</label>
                <input
                  type="text"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.zipCode')}</label>
                <input
                  type="text"
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('checkout.country')}</label>
                <input
                  type="text"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('checkout.paymentMethod')}</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="cash">{t('checkout.cashOnDelivery')}</option>
                <option value="card">{t('checkout.creditCard')}</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? t('checkout.processing') : t('checkout.placeOrder')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 