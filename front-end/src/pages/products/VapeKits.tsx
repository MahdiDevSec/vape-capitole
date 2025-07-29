import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSmoking } from 'react-icons/fa';
import type { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import FavoriteButton from '../../components/FavoriteButton';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';

const VapeKits = () => {
  const [sortBy, setSortBy] = useState('price-asc');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { dispatch } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products/category/vapekits');
        setProducts(response.data);
        setError('');
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err?.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sortedProducts = products.sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const getSrc = (img: string) => img.startsWith('/uploads/') ? `http://localhost:5000${img}` : img;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل المنتجات...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
          >
            حاول مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t('category.vape-kits')}</h1>
        <select
          className="bg-white border border-gray-300 rounded-md px-4 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="price-asc">السعر: من الأقل إلى الأعلى</option>
          <option value="price-desc">السعر: من الأعلى إلى الأقل</option>
          <option value="name-asc">الإسم: أ-ي</option>
          <option value="name-desc">الإسم: ي-أ</option>
        </select>
      </div>
      {sortedProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-12 text-xl">لا توجد منتجات متاحة حالياً.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative aspect-w-1 aspect-h-1">
                <FavoriteButton item={product} />
                <img src={getSrc(product.image)} alt={product.name} className="w-full h-48 object-cover" />
              </div>
              <div className="p-4">
                <Link to={`/products/${product._id}`} className="block">
                  <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">{product.name}</h2>
                  <p className="mt-2 text-gray-600 line-clamp-2">{product.description}</p>
                </Link>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">{product.price?.toLocaleString('ar-DZ')} دج</span>
                  <span className="text-sm">متوفر: {product.inStock} قطعة</span>
                </div>
                <button className="mt-4 w-full btn btn-primary flex items-center justify-center gap-2" onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}>
                  <FaSmoking />
                  إضافة إلى السلة
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VapeKits;
