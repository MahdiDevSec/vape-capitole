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
  FaBolt
} from 'react-icons/fa';
import { GiAtom, GiGlassShot } from 'react-icons/gi';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import FavoriteButton from '../components/FavoriteButton';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';

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
          <p className="text-gray-600">{t('products.loading')}</p>
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
        <p className="text-lg text-gray-600">{t('products.all')}</p>
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
        
        <div className="text-sm text-gray-600">
          {filteredAndSortedProducts.length} {t('common.pieces')}
        </div>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">{t('products.noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={getSrc(product.image)}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <FavoriteButton item={product} />
                </div>
                {product.inStock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{t('product.outOfStock')}</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-primary">
                    {product.price} {t('common.currency')}
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
    </div>
  );
};

export default Products;
