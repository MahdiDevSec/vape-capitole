import React, { useState, useEffect } from 'react';
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
  const [selectedStore, setSelectedStore] = useState<any | null>(null);

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
              className="bg-white dark:bg-gray-800 dark:text-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              onClick={() => setSelectedStore(store)}
            >
              {store.image ? (
                <div className="relative flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 aspect-[4/3] w-full overflow-hidden group">
                  <img
                    src={store.image.startsWith('/uploads/') ? `http://localhost:5000${store.image}` : store.image}
                    alt={store.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 aspect-[4/3] w-full">
                  <div className="text-center">
                    <FaStore className="text-6xl text-gray-400 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">لا توجد صورة</p>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{store.name}</h3>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    {t('stores.certifiedStore')}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {store.location && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                      <FaMapMarkerAlt className="mr-3 text-primary text-lg" />
                      <span className="text-sm">{store.location}</span>
                    </div>
                  )}
                  
                  {store.phone && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                      <FaPhone className="mr-3 text-primary text-lg" />
                      <span className="text-sm">{store.phone}</span>
                    </div>
                  )}
                  
                  {store.workingHours && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                      <FaClock className="mr-3 text-primary text-lg" />
                      <span className="text-sm">{store.workingHours}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://maps.google.com/?q=${encodeURIComponent(store.location)}`, '_blank');
                    }}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/90 text-white py-3 px-4 rounded-lg hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center justify-center font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  >
                    <FaDirections className="mr-2" />
                    {t('stores.directions')}
                  </button>
                  
                  <Link
                    to={`/stores/${store._id}/products`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-white py-3 px-4 rounded-lg hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 text-center font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  >
                    {t('stores.viewProducts')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Store Details Modal */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-500 scale-95 hover:scale-100 mx-4 animate-slideUp">
            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedStore.name}</h2>
                  <div className="flex items-center text-white/90">
                    <FaStore className="mr-2" />
                    <span className="text-sm">متجر معتمد</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStore(null)}
                  className="text-white/80 hover:text-white text-2xl font-bold transition-colors duration-200 hover:scale-110"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Image Section */}
              {selectedStore.image && (
                <div className="mb-4 sm:mb-6 relative group">
                  <div className="overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
                    <img
                      src={selectedStore.image.startsWith('/uploads/') ? `http://localhost:5000${selectedStore.image}` : selectedStore.image}
                      alt={selectedStore.name}
                      className="w-full h-48 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                </div>
              )}

              {/* Store Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {selectedStore.location && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-500 text-white p-2 rounded-lg mr-3">
                        <FaMapMarkerAlt className="text-lg" />
                      </div>
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200">الموقع</h3>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">{selectedStore.location}</p>
                  </div>
                )}
                
                {selectedStore.phone && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-700">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-500 text-white p-2 rounded-lg mr-3">
                        <FaPhone className="text-lg" />
                      </div>
                      <h3 className="font-semibold text-green-800 dark:text-green-200">الهاتف</h3>
                    </div>
                    <p className="text-green-700 dark:text-green-300 text-sm">{selectedStore.phone}</p>
                  </div>
                )}
                
                {selectedStore.workingHours && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700 md:col-span-2">
                    <div className="flex items-center mb-2">
                      <div className="bg-purple-500 text-white p-2 rounded-lg mr-3">
                        <FaClock className="text-lg" />
                      </div>
                      <h3 className="font-semibold text-purple-800 dark:text-purple-200">ساعات العمل</h3>
                    </div>
                    <p className="text-purple-700 dark:text-purple-300 text-sm">{selectedStore.workingHours}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-4 sm:mt-6">
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedStore.location)}`, '_blank')}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/90 text-white py-4 px-6 rounded-xl hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <FaDirections className="mr-3 text-xl" />
                  <span className="text-lg">{t('stores.directions')}</span>
                </button>
                
                <Link
                  to={`/stores/${selectedStore._id}/products`}
                  className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-white py-4 px-6 rounded-xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span className="text-lg">{t('stores.viewProducts')}</span>
                </Link>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                  <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
                    <FaStore className="mr-2" />
                    <span>{t('stores.certifiedQuality')}</span>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;