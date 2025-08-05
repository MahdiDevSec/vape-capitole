import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { FaSearch, FaHeart, FaShoppingCart, FaEye, FaStar } from 'react-icons/fa';
import { GiElectric, GiCigarette } from 'react-icons/gi';
import { BsBoxSeam } from 'react-icons/bs';
import usedProductService, { type UsedProduct, type UsedProductFilters } from '../services/usedProductService';

const categories = [
  { id: 'all', name: 'All Categories', nameAr: 'جميع الفئات', icon: FaSearch },
  { id: 'vape-kit', name: 'Vape Kits', nameAr: 'كيتات الفايب', icon: GiCigarette },
  { id: 'box-vape', name: 'Box Mods', nameAr: 'بوكس مودز', icon: BsBoxSeam },
  { id: 'atomizer', name: 'Atomizers', nameAr: 'الأتومايزر', icon: GiElectric }
];

const conditions = [
  { id: 'all', name: 'All Conditions', nameAr: 'جميع الحالات' },
  { id: 'excellent', name: 'Excellent', nameAr: 'ممتاز' },
  { id: 'good', name: 'Good', nameAr: 'جيد' },
  { id: 'fair', name: 'Fair', nameAr: 'مقبول' }
];

const UsedProducts = () => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<UsedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<UsedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch used products from API on component mount
  useEffect(() => {
    const fetchUsedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch used products with better error handling
        const response = await usedProductService.getUsedProducts({
          status: 'available', // Only show available products
          sortBy: 'createdAt',
          sortOrder: 'desc',
          limit: 50 // Increase limit to show more products
        });
        
        console.log('Used products response:', response);
        
        if (response && response.products) {
          setProducts(response.products);
          setFilteredProducts(response.products);
        } else {
          // If no products structure, try direct array
          const productsArray = Array.isArray(response) ? response : [];
          setProducts(productsArray);
          setFilteredProducts(productsArray);
        }
      } catch (err: any) {
        console.error('Error fetching used products:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load used products. Please try again later.';
        setError(errorMessage);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsedProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by condition
    if (selectedCondition !== 'all') {
      filtered = filtered.filter(product => product.condition === selectedCondition);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        (language === 'ar' ? product.nameAr : product.name)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedCondition, searchTerm, sortBy, products, language]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'sold':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'fair':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'ar') {
      switch (status) {
        case 'available': return 'متوفر';
        case 'sold': return 'تم البيع';
        case 'reserved': return 'محجوز';
        default: return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getConditionText = (condition: string) => {
    if (language === 'ar') {
      switch (condition) {
        case 'excellent': return 'ممتاز';
        case 'good': return 'جيد';
        case 'fair': return 'مقبول';
        default: return condition;
      }
    }
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white flex items-center justify-center gap-3">
            <GiCigarette className="text-blue-500" />
            {language === 'ar' ? 'المنتجات المستعملة' : 'Used Vape Products'}
            <GiCigarette className="text-blue-500" />
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'اكتشف مجموعة رائعة من منتجات الفايب المستعملة بأسعار مميزة - كيتات، بوكس مودز، وأتومايزر'
              : 'Discover amazing used vape products at great prices - Kits, Box Mods, and Atomizers'
            }
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'البحث عن منتج...' : 'Search products...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {language === 'ar' ? category.nameAr : category.name}
                </option>
              ))}
            </select>

            {/* Condition Filter */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            >
              {conditions.map(condition => (
                <option key={condition.id} value={condition.id}>
                  {language === 'ar' ? condition.nameAr : condition.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            >
              <option value="newest">{language === 'ar' ? 'الأحدث' : 'Newest'}</option>
              <option value="price-low">{language === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price-high">{language === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              <option value="rating">{language === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
              <option value="views">{language === 'ar' ? 'الأكثر مشاهدة' : 'Most Viewed'}</option>
            </select>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {categories.slice(1).map(category => {
            const Icon = category.icon;
            const count = products.filter(p => p.category === category.id).length;
            return (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 ${
                  selectedCategory === category.id ? 'ring-4 ring-blue-300' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon size={32} />
                  <span className="text-2xl font-bold">{count}</span>
                </div>
                <h3 className="font-semibold text-lg">
                  {language === 'ar' ? category.nameAr : category.name}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg dark:text-white">{t('common.loading')}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* No Products Found */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">
              {t('nav.usedProducts')} - {language === 'ar' ? 'لا توجد منتجات' : 'No Products Found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {language === 'ar' ? 'لم يتم العثور على منتجات مستعملة متاحة حالياً' : 'No used products are currently available'}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={language === 'ar' ? product.nameAr : product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/uploads/placeholder-vape.jpg';
                  }}
                />
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
                    {getStatusText(product.status)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getConditionColor(product.condition)}`}>
                    {getConditionText(product.condition)}
                  </span>
                </div>
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 dark:text-white line-clamp-2">
                  {language === 'ar' ? product.nameAr : product.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                  {language === 'ar' ? product.descriptionAr : product.description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-green-600">
                    {product.price.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {product.originalPrice.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}
                  </span>
                </div>

                {/* Rating and Views */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" size={14} />
                    <span className="text-sm font-medium dark:text-white">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <FaEye size={14} />
                    <span className="text-sm">{product.views}</span>
                  </div>
                </div>

                {/* Seller */}
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {language === 'ar' ? 'البائع:' : 'Seller:'} <span className="font-medium">{product.seller}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {product.status === 'available' ? (
                    <>
                      <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                        <FaShoppingCart size={14} />
                        {language === 'ar' ? 'اشتري الآن' : 'Buy Now'}
                      </button>
                      <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-lg transition-colors">
                        <FaHeart size={16} />
                      </button>
                    </>
                  ) : (
                    <button disabled className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg font-medium cursor-not-allowed">
                      {product.status === 'sold' 
                        ? (language === 'ar' ? 'تم البيع' : 'Sold Out')
                        : (language === 'ar' ? 'محجوز' : 'Reserved')
                      }
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <GiCigarette className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'لا توجد منتجات' : 'No Products Found'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'ar' 
                  ? 'جرب تغيير المرشحات أو البحث عن شيء آخر'
                  : 'Try changing your filters or search for something else'
                }
              </p>
            </div>
          )}
        </div>
        )}

        {/* Back to Shop */}
        <div className="text-center mt-12">
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <GiCigarette />
            {language === 'ar' ? 'تسوق المنتجات الجديدة' : 'Shop New Products'}
            <GiCigarette />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UsedProducts;


