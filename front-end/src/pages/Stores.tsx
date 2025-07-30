import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaClock, FaDirections, FaStore } from 'react-icons/fa';
import type { Store } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';

const Stores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/stores');
        setStores(response.data);
        setError('');
      } catch (err: any) {
        console.error('Error fetching stores:', err);
        setError(err?.response?.data?.message || t('stores.errorFetch'));
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('common.error')}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
          >
            {t('products.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {t('stores.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t('stores.findNearest')}
        </p>
      </div>

      {stores.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FaStore className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            {t('stores.noStores')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {t('stores.noStoresDesc')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <div
              key={store._id}
              className="bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {store.image && (
                <div className="relative h-48">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{store.name}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{t('store.address')}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{store.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <FaPhone className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{t('store.phone')}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{store.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <FaClock className="text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{t('store.hours')}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{store.workingHours}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Link
                    to={`/stores/${store._id}/products`}
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors text-center"
                  >
                    {t('store.viewProducts')}
                  </Link>
                  <button className="bg-gray-100 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
                    <FaDirections />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stores;
