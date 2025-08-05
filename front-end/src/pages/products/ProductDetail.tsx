import React from 'react';
import { useParams } from 'react-router-dom';
import { FaStore, FaShoppingCart } from 'react-icons/fa';
import type { Product, Store } from '../../types';
import { formatPrice } from '../../utils/currency';
import { useLanguage } from '../../contexts/LanguageContext';

const storesData: Store[] = [
  {
    _id: '1',
    name: 'Vape Capitole Pitonse',
    location: 'Pitonse Region',
    phone: '+213 XX XX XX XX',
    workingHours: '9:00 - 21:00',
  },
  {
    _id: '2',
    name: 'Vape Capitole Nouval Ville 1',
    location: 'Nouval Ville 1',
    phone: '+213 XX XX XX XX',
    workingHours: '9:00 - 21:00',
  },
  {
    _id: '3',
    name: 'Vape Capitole Ain Milia',
    location: 'Ain Milia Region',
    phone: '+213 XX XX XX XX',
    workingHours: '9:00 - 21:00',
  },
  {
    _id: '4',
    name: 'Vape Capitole Khenshla',
    location: 'Khenshla Region',
    phone: '+213 XX XX XX XX',
    workingHours: '9:00 - 21:00',
  },
];

const ProductDetail = () => {
  const { productId } = useParams();
  const { t, language } = useLanguage();
  // سيتم استبدال هذا بجلب البيانات من API
  const product: Product | null = null;

  if (!product) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-3 sm:mb-4">{t('common.error')}</h1>
          <p className="text-gray-600">{t('product.notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* صورة المنتج */}
          <div className="relative h-60 xs:h-72 sm:h-96 md:h-[600px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          {/* تفاصيل المنتج */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-4xl font-bold">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
            <div className="text-xl sm:text-3xl font-bold text-blue-600">{formatPrice(product.price, language)}</div>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold">{t('product.availableInStores')}</h3>
              <div className="space-y-2">
                {product.availability?.map(({ storeId, inStock }: { storeId: string; inStock: boolean }) => {
                  const store = storesData.find(s => s._id === storeId);
                  if (!store) return null;
                  return (
                    <div 
                      key={storeId}
                      className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-0 p-3 sm:p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <FaStore className="text-blue-600" />
                        <span className="dark:text-white">{store.name}</span>
                      </div>
                      <span className={inStock ? 'text-green-600' : 'text-red-600'}>
                        {inStock ? t('product.inStock') : t('product.outOfStock')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <button className="vape-btn w-full flex items-center justify-center gap-2 px-4 py-3 text-base sm:text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200">
              <FaShoppingCart />
              {t('product.addToCart')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


