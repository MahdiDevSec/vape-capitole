import React from 'react';
import { useParams } from 'react-router-dom';
import { FaStore, FaShoppingCart } from 'react-icons/fa';
import type { Product, Store } from '../../types';
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
  const { t } = useLanguage();
  // سيتم استبدال هذا بجلب البيانات من API
  const product: Product | null = null;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('common.error')}</h1>
          <p className="text-gray-600">{t('product.notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* صورة المنتج */}
          <div className="relative h-96 md:h-[600px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* تفاصيل المنتج */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
            
            <div className="text-3xl font-bold text-blue-600">
              {product.price} {t('common.currency')}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{t('product.availableInStores')}</h3>
              <div className="space-y-2">
                {product.availability?.map(({ storeId, inStock }: { storeId: string; inStock: boolean }) => {
                  const store = storesData.find(s => s._id === storeId);
                  if (!store) return null;

                  return (
                    <div 
                      key={storeId}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FaStore className="text-blue-600" />
                        <span>{store.name}</span>
                      </div>
                      <span className={inStock ? 'text-green-600' : 'text-red-600'}>
                        {inStock ? t('product.inStock') : t('product.outOfStock')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button className="btn btn-primary w-full flex items-center justify-center gap-2">
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
