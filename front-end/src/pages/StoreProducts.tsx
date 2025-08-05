import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import type { Product, Liquid } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { formatPrice } from '../utils/currency';
import FavoriteButton from '../components/FavoriteButton';
import { FaStore } from 'react-icons/fa';

const StoreProducts = () => {
  const { storeId } = useParams();
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [liquids, setLiquids] = useState<Liquid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // حاول استخدام endpoints مع فلترة المتجر، وإلا قم بالفلترة يدويًا
        const [prodRes, liqRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/liquids'),
        ]);
        const prodData: Product[] = prodRes.data;
        const liqData: Liquid[] = liqRes.data.liquids || liqRes.data;
        const filteredProd = prodData.filter(p => (p.store === storeId) || (p.stores && p.stores.some(s => s._id === storeId)));
        const filteredLiq = liqData.filter(l => (l.store === storeId) || (l.stores && l.stores.some(s => s._id === storeId)));
        setProducts(filteredProd);
        setLiquids(filteredLiq);
        setError('');
      } catch (err: any) {
        console.error(err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    if (storeId) fetchData();
  }, [storeId]);

  if (loading) {
    return <div className="text-center py-12 dark:text-white">{t('common.loading')}</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/stores" className="text-primary hover:underline flex items-center gap-1 mb-6">
        <FaStore /> {t('stores.title')}
      </Link>
      <h1 className="text-3xl font-bold mb-6 dark:text-white">{t('store.availableProducts')}</h1>

      {/* Products */}
      {products.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">{t('products.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {products.map(product => (
              <div key={product._id} className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <FavoriteButton item={product} />
                  <img src={product.image.startsWith('/uploads/')?`http://localhost:5000${product.image}`:product.image} alt={product.name} className="w-full h-48 object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <span className="text-primary font-bold">{formatPrice(product.price, language)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Liquids */}
      {liquids.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">{t('liquids.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {liquids.map(liquid => (
              <div key={liquid._id} className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <FavoriteButton item={liquid} />
                  <img src={liquid.image.startsWith('/uploads/')?`http://localhost:5000${liquid.image}`:liquid.image} alt={liquid.name} className="w-full h-48 object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{liquid.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">{liquid.description}</p>
                  <span className="text-primary font-bold">{formatPrice(liquid.price, language)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {products.length === 0 && liquids.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">{t('store.noProducts')}</p>
      )}
    </div>
  );
};

export default StoreProducts;


