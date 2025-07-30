import { useState, useEffect } from 'react';
import { FaFlask, FaSearch, FaFilter, FaStar, FaThermometerHalf, FaCandyCane, FaLayerGroup, FaPlus } from 'react-icons/fa';
import type { Liquid } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ALL_FRUITS } from '../data/fruitList';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import { formatPrice } from '../utils/currency';

interface LiquidAnalysis {
  flavorProfile: {
    primary: string;
    secondary: string[];
    mentholLevel: number;
    sweetness: number;
    intensity: number;
    complexity: number;
    creaminess: number;
    fruitiness: number;
    spiciness: number;
  };
  compatibility: {
    compatibleWith: string[];
    incompatibleWith: string[];
    neutral: string[];
    recommendedPercentage: number;
  };
  chemicalProfile: {
    vgRatio: number;
    pgRatio: number;
    nicotineLevel: number;
    acidity: number;
    viscosity: number;
  };
  mixingRecommendations: string[];
}

const Liquids = () => {
  const [liquids, setLiquids] = useState<Liquid[]>([]);
  const [filteredLiquids, setFilteredLiquids] = useState<Liquid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedFruit, setSelectedFruit] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const { t, language } = useLanguage();
  const { dispatch } = useCart();

  const categories = [
    { value: 'all', label: t('liquids.allCategories') },
    { value: 'fruit', label: `🍎 ${t('mix.fruit')}` },
    { value: 'dessert', label: `🍰 ${t('mix.dessert')}` },
    { value: 'menthol', label: `❄️ ${t('mix.menthol')}` },
    { value: 'tobacco', label: `🚬 ${t('mix.tobacco')}` },
    { value: 'beverage', label: `☕ ${t('liquids.beverage')}` },
    { value: 'cream', label: `🥛 ${t('mix.cream')}` },
    { value: 'spice', label: `🌶️ ${t('mix.spice')}` }
  ];

  useEffect(() => {
    fetchLiquids();
  }, []);

  useEffect(() => {
    filterLiquids();
  }, [liquids, searchTerm, selectedCategory, selectedBrand, selectedFruit, sortBy]);

  const fetchLiquids = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/liquids');
      setLiquids(response.data.liquids || response.data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching liquids:', err);
      setError(err?.response?.data?.message || 'Failed to fetch liquids');
    } finally {
      setLoading(false);
    }
  };

  const filterLiquids = () => {
    let filtered = [...liquids];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(liquid =>
        liquid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        liquid.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        liquid.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(liquid => liquid.category === selectedCategory);
    }

    // Filter by brand
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(liquid => liquid.brand === selectedBrand);
    }

    // Filter by fruit type
    if (selectedFruit !== 'all') {
      filtered = filtered.filter(liquid => liquid.fruitTypes?.includes(selectedFruit));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case 'price':
          return a.price - b.price;
        case 'newest':
          return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
        default:
          return 0;
      }
    });

    setFilteredLiquids(filtered);
  };

  const addToCart = (liquid: Liquid) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        _id: liquid._id,
        name: liquid.name,
        description: `${liquid.volume}ml, ${liquid.nicotineLevel}mg nicotine`,
        price: liquid.price,
        image: liquid.image,
        category: 'liquids',
        inStock: liquid.inStock,
        store: liquid.store
      }
    });
  };

  const getFlavorIcon = (flavor: string) => {
    switch (flavor) {
      case 'fruit': return '🍎';
      case 'dessert': return '🍰';
      case 'menthol': return '❄️';
      case 'tobacco': return '🚬';
      case 'beverage': return '☕';
      case 'cream': return '🥛';
      case 'spice': return '🌶️';
      default: return '🧪';
    }
  };

  // override icon based on menthol level when primary not menthol
  const fruitEmojiMap: Record<string, string> = {
    strawberry: '🍓',
    mango: '🥭',
    blueberry: '🫐',
    apple: '🍏',
    banana: '🍌',
    peach: '🍑',
    watermelon: '🍉',
    pineapple: '🍍',
    grape: '🍇',
    orange: '🍊',
    lemon: '🍋'
  };

  const getIconForLiquid = (liquid: Liquid) => {
    const profile = (liquid as any).analysis?.flavorProfile;
    if (profile?.mentholLevel > 6 && profile?.primary !== 'menthol') {
      return '❄️';
    }

    const primary = profile?.primary || 'mixed';
    if (primary !== 'mixed') return getFlavorIcon(primary);

    // Try fruitTypes fallback
    if (liquid.fruitTypes && liquid.fruitTypes.length) {
      const fruit = liquid.fruitTypes[0].toLowerCase();
      return fruitEmojiMap[fruit] || '🍎';
    }
    return '🧪';
  };

  const getCompatibilityColor = (compatibility: string[]) => {
    if (compatibility.length >= 4) return 'text-green-600 bg-green-100';
    if (compatibility.length >= 2) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getBrands = () => {
    const brands = [...new Set(liquids.map(liquid => liquid.brand))];
    return brands.map(brand => ({ value: brand, label: brand }));
  };

  const fruitOptions = [{ value: 'all', label: 'All Fruits' }, ...ALL_FRUITS.map(f=>({value:f,label:f}))];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 dark:text-gray-400">Loading liquids...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-300 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchLiquids}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          {t('liquids.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 dark:text-gray-400 max-w-2xl mx-auto">
          Discover our premium e-liquids with smart flavor analysis and mixing recommendations
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search liquids..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <FaFilter />
            Filters
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="name">Sort by Name</option>
            <option value="brand">Sort by Brand</option>
            <option value="price">Sort by Price</option>
            <option value="newest">Sort by Newest</option>
          </select>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="all">All Brands</option>
                  {getBrands().map(brand => (
                    <option key={brand.value} value={brand.value}>
                      {brand.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fruit Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fruit Type
                </label>
                <select
                  value={selectedFruit}
                  onChange={(e)=>setSelectedFruit(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  {fruitOptions.map(opt=>(<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Filters */}
        <div className="hidden lg:block mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                <option value="all">All Brands</option>
                {getBrands().map(brand => (
                  <option key={brand.value} value={brand.value}>
                    {brand.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300 dark:text-gray-400">
          Showing {filteredLiquids.length} of {liquids.length} liquids
        </p>
      </div>

      {/* Liquids Grid */}
      {filteredLiquids.length === 0 ? (
        <div className="text-center py-12">
          <FaFlask className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 dark:text-gray-400 mb-2">
            No liquids found
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLiquids.map((liquid) => {
            const analysis = liquid.analysis as LiquidAnalysis;
            return (
              <div
                key={liquid._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={liquid.image.startsWith('/uploads/') ? `http://localhost:5000${liquid.image}` : liquid.image}
                    alt={liquid.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompatibilityColor(analysis?.compatibility?.compatibleWith || [])}`}>
                      {analysis?.compatibility?.compatibleWith?.length || 0} Compatible
                    </span>
                  </div>
                  {liquid.inStock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-2">
                      {liquid.name}
                    </h3>
                    <span className="text-2xl ml-2">
                      {getIconForLiquid(liquid)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 dark:text-gray-400 mb-2">
                    {liquid.brand}
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {liquid.description}
                  </p>

                  {/* Flavor Profile */}
                  {analysis && (
                    <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                      <div className="text-center">
                        <FaThermometerHalf className="mx-auto mb-1 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-300 dark:text-gray-400">Menthol</span>
                        <div className="font-bold text-gray-800 dark:text-white">
                          {analysis.flavorProfile.mentholLevel}/10
                        </div>
                      </div>
                      <div className="text-center">
                        <FaCandyCane className="mx-auto mb-1 text-pink-500" />
                        <span className="text-gray-600 dark:text-gray-300 dark:text-gray-400">Sweet</span>
                        <div className="font-bold text-gray-800 dark:text-white">
                          {analysis.flavorProfile.sweetness}/10
                        </div>
                      </div>
                      <div className="text-center">
                        <FaLayerGroup className="mx-auto mb-1 text-purple-500" />
                        <span className="text-gray-600 dark:text-gray-300 dark:text-gray-400">Complex</span>
                        <div className="font-bold text-gray-800 dark:text-white">
                          {analysis.flavorProfile.complexity}/10
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Specs */}
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-gray-600 dark:text-gray-300 dark:text-gray-400">
                      {liquid.volume}ml • {liquid.nicotineLevel}mg
                    </span>
                    <span className="text-gray-600 dark:text-gray-300 dark:text-gray-400">
                      {liquid.baseRatio.vg}/{liquid.baseRatio.pg}
                    </span>
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(liquid.price, language)}
                    </span>
                    <button
                      onClick={() => addToCart(liquid)}
                      disabled={liquid.inStock === 0}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <FaPlus />
                      Add
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {t('product.availableInStores')}: {liquid.stores ? liquid.stores.length : 0}
                  </div>

                  {/* Stock Status */}
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      liquid.inStock > 0 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {liquid.inStock > 0 ? `${liquid.inStock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Liquids;
