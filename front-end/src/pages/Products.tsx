import { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  FaBox, 
  FaCube, 
  FaFlask, 
  FaBatteryFull, 
  FaCogs,
  FaShoppingCart,
  FaSmoking,
  FaBoxOpen,
  FaCircle,
  FaBolt,
  FaStore
} from 'react-icons/fa';
import { GiAtom, GiGlassShot } from 'react-icons/gi';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import FavoriteButton from '../components/FavoriteButton';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import { formatPrice } from '../utils/currency';

const categories = [
  { id: 'vapekits', name: 'category.vape-kits', icon: FaSmoking, color: 'bg-blue-500' },
  { id: 'vapeboxes', name: 'category.vape-boxes', icon: FaSmoking, color: 'bg-green-500' },
  { id: 'atomisers', name: 'category.atomizers', icon: GiAtom, color: 'bg-purple-500' },
  { id: 'pyrex', name: 'category.pyrex', icon: GiGlassShot, color: 'bg-yellow-500' },
  { id: 'batteries', name: 'category.accus', icon: FaBatteryFull, color: 'bg-red-500' },
  { id: 'accessories', name: 'category.accessories', icon: FaCogs, color: 'bg-gray-500' },
  { id: 'cotton', name: 'category.cotton', icon: FaFlask, color: 'bg-pink-500' },
  { id: 'coils', name: 'category.coils', icon: FaCircle, color: 'bg-indigo-500' },
  { id: 'resistors', name: 'category.resistors', icon: FaBolt, color: 'bg-orange-500' },
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const { dispatch } = useCart();
  const { t, language } = useLanguage();
  const { category } = useParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products');
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

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by category
    if (category && category !== 'all') {
      filtered = products.filter(product => product.category === category);
    } else if (selectedCategory !== 'all') {
      filtered = products.filter(product => product.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return filtered.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      case 'stock-asc':
        return filtered.sort((a, b) => a.inStock - b.inStock);
      case 'stock-desc':
        return filtered.sort((a, b) => b.inStock - a.inStock);
      default:
        return filtered;
    }
  }, [products, selectedCategory, category, sortBy]);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const getSrc = (img:string)=> img.startsWith('/uploads/')? `http://localhost:5000${img}`: img;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t('products.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t('products.error')}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            {t('products.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{t('products.title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{t('products.all')}</p>
      </div>

      {/* Categories Grid with Icons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`p-4 rounded-lg text-center transition-colors ${
            selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <FaBox className="text-2xl mx-auto mb-2" />
          <span className="text-sm font-medium">{t('products.allCategories')}</span>
        </button>
        
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <Link
              key={cat.id}
              to={`/products/${cat.id}`}
              className={`p-4 rounded-lg text-center transition-colors ${
                selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <IconComponent className={`text-2xl mx-auto mb-2 ${cat.color.replace('bg-', 'text-')}`} />
              <span className="text-sm font-medium">{t(cat.name)}</span>
            </Link>
          );
        })}
      </div>

      {/* Sort Options */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium">{t('products.sortBy')}:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="name-asc">{t('products.nameAsc')}</option>
            <option value="name-desc">{t('products.nameDesc')}</option>
            <option value="price-asc">{t('products.priceAsc')}</option>
            <option value="price-desc">{t('products.priceDesc')}</option>
            <option value="stock-asc">{t('products.sortByStock')} ↑</option>
            <option value="stock-desc">{t('products.sortByStock')} ↓</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {filteredAndSortedProducts.length} {t('common.pieces')}
        </div>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">{t('products.noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <div 
              key={product._id} 
              className="modern-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative flex items-center justify-center bg-gray-100 dark:bg-gray-900 aspect-[4/3] w-full">
                <img
                  src={getSrc(product.image)}
                  alt={product.name}
                  className="max-h-44 max-w-full object-contain transition-transform duration-300"
                  style={{ aspectRatio: '4/3' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <FavoriteButton item={product} />
                </div>
                {product.inStock > 0 ? (
                  <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold vape-pulse">
                    {t('product.inStock')}
                  </span>
                ) : (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {t('product.outOfStock')}
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.price, language)}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    product.inStock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock > 0 
                      ? `${t('product.inStock')}: ${product.inStock}` 
                      : t('product.outOfStock')
                    }
                  </span>
                  <span className="text-xs text-gray-500 block mt-1">
                    {t('product.availableInStores')}: {product.stores ? product.stores.length : 0}
                  </span>
                </div>
                
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.inStock === 0}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <FaShoppingCart />
                  <span>{t('product.addToCart')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Product Details */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-500 scale-95 hover:scale-100 mx-4 animate-slideUp">
            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedProduct.name}</h2>
                  <div className="flex items-center text-white/90">
                    <FaShoppingCart className="mr-2" />
                    <span className="text-sm">{t('product.premiumProduct')}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-white/80 hover:text-white text-2xl font-bold transition-colors duration-200 hover:scale-110"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Image Section */}
              <div className="mb-4 sm:mb-6 relative group">
                <div className="overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
                  <img
                    src={getSrc(selectedProduct.image)}
                    alt={selectedProduct.name}
                    className="w-full h-48 sm:h-64 object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
              </div>

              {/* Product Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-500 text-white p-2 rounded-lg mr-3">
                      <span className="text-lg font-bold">{selectedProduct.category}</span>
                    </div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">{t('product.category')}</h3>
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">{selectedProduct.category}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="flex items-center mb-2">
                    <div className="bg-green-500 text-white p-2 rounded-lg mr-3">
                      <span className="text-lg font-bold">{selectedProduct.inStock}</span>
                    </div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">{t('product.stock')}</h3>
                  </div>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    {selectedProduct.inStock > 0 ? `${selectedProduct.inStock} ${t('product.inStock')}` : t('product.outOfStock')}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{t('product.description')}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">{selectedProduct.description}</p>
              </div>

              {/* Stores */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">{t('product.availableInStores')}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.stores && selectedProduct.stores.length > 0 ? (
                    selectedProduct.stores.map((storeId) => {
                      const store = stores.find((s) => s._id === storeId);
                      return store ? (
                        <span key={storeId} className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                          <FaStore className="mr-2" />
                          {store.name}
                        </span>
                      ) : null;
                    })
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">{t('product.noStoresAssigned')}</span>
                  )}
                </div>
              </div>

              {/* Price and Action Buttons */}
              <div className="flex flex-col gap-3 mt-4 sm:mt-6">
                <div className="flex-1 bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-xl border border-primary/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{formatPrice(selectedProduct.price, language)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedProduct.inStock > 0 ? `${selectedProduct.inStock} ${t('product.inStock')}` : t('product.outOfStock')}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={selectedProduct.inStock === 0}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/90 text-white py-4 px-6 rounded-xl hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <FaShoppingCart className="mr-3 text-xl" />
                  <span className="text-lg">{t('product.addToCart')}</span>
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
                  <FaShoppingCart className="mr-2" />
                  <span>{t('product.premiumQuality')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
