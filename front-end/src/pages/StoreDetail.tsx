import React from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';
import type { Store } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

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

const StoreDetail = () => {
  const { storeId } = useParams();
  const store = storesData.find(s => s._id === storeId);
  const { t } = useLanguage();

  if (!store) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('common.error')}</h1>
          <p className="text-gray-600">{t('store.notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{store.name}</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-600 text-xl" />
                <div>
                  <h3 className="font-semibold text-gray-900">{t('store.address')}</h3>
                  <p className="text-gray-600">{store.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaPhone className="text-blue-600 text-xl" />
                <div>
                  <h3 className="font-semibold text-gray-900">{t('store.phone')}</h3>
                  <p className="text-gray-600">{store.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FaClock className="text-blue-600 text-xl" />
                <div>
                  <h3 className="font-semibold text-gray-900">{t('store.hours')}</h3>
                  <p className="text-gray-600">{store.workingHours}</p>
                </div>
              </div>
            </div>
            
            <div className="relative h-64 md:h-auto">
              <img 
                src={`/stores/${store._id}.jpg`}
                alt={store.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/stores/default-store.jpg';
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">{t('store.availableProducts')}</h2>
          <p className="text-gray-600">{t('store.productsComingSoon')}</p>
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;
