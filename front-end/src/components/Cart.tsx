import React, { useState } from 'react';
import { FaTrash, FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { state, dispatch } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const calculateTotal = () => {
    return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  if (state.items.length === 0) {
    return (
      <div className="relative">
        <button
          className="fixed bottom-4 right-4 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="relative">
            <FaShoppingCart size={24} />
          </div>
        </button>

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t('cart.title')}</h2>
                <p className="text-gray-600 mb-6">{t('cart.empty')}</p>
                <p className="text-sm text-gray-500">{t('cart.addItems')}</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition-colors"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        className="fixed bottom-4 right-4 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
          <FaShoppingCart size={24} />
          {state.items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {state.items.length}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="bg-black bg-opacity-50 absolute inset-0" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white w-full max-w-md h-full shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{t('cart.title')}</h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-500">
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.product._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {item.product.image && (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-gray-600">{item.product.price} {t('common.currency')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">{t('cart.total')}:</span>
                  <span className="font-bold text-xl">{calculateTotal()} {t('common.currency')}</span>
                </div>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                  >
                    {t('common.close')}
                  </button>
                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/checkout');
                    }}
                    className="flex-1 bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors"
                  >
                    {t('cart.checkout')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
