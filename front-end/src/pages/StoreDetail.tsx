import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';
import type { Store } from '../types';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

const StoreDetail = () => {
  const { storeId } = useParams();
  const { t } = useLanguage();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/stores/${storeId}`);
        setStore(response.data);
        setError('');
      } catch (err: any) {
        console.error('Error fetching store:', err);
        setError(err?.response?.data?.message || t('store.notFound'));
      } finally {
        setLoading(false);
      }
    };
    if (storeId) fetchStore();
  }, [storeId]);

  if (loading) {
    return <div className="text-center py-12 dark:text-white">{t('common.loading')}</div>;
  }

  if (error || !store) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{t('common.error')}</h1>
        <p className="text-gray-600 dark:text-gray-300">{error || t('store.notFound')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 dark:text-white">{store.name}</h1>
        <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-primary text-xl" />
                <div>
                  <h3 className="font-semibold">{t('store.location')}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{store.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-primary text-xl" />
                <div>
                  <h3 className="font-semibold">{t('store.phone')}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{store.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-primary text-xl" />
                <div>
                  <h3 className="font-semibold">{t('store.hours')}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{store.workingHours}</p>
                </div>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <img src={store.image || '/stores/default-store.jpg'} alt={store.name} className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;


