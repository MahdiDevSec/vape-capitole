import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import { GiCigarette, GiElectric } from 'react-icons/gi';
import { BsBoxSeam } from 'react-icons/bs';
import { useLanguage } from '../../contexts/LanguageContext';

interface UsedProduct {
  _id: string;
  name: string;
  nameAr: string;
  image: string;
  price: number;
  originalPrice: number;
  category: 'vape-kit' | 'box-vape' | 'atomizer';
  condition: 'excellent' | 'good' | 'fair';
  status: 'available' | 'sold' | 'reserved';
  description: string;
  descriptionAr: string;
  seller: string;
  rating: number;
  views: number;
  createdAt: string;
}

// بيانات وهمية للمنتجات المستعملة
const usedProductsData: UsedProduct[] = [
  {
    _id: 'u1',
    name: 'SMOK Alien 220W Kit',
    nameAr: 'كيت سموك إيلين 220 واط',
    image: '/uploads/used-vape-kit-1.jpg',
    price: 15000,
    originalPrice: 25000,
    category: 'vape-kit',
    condition: 'excellent',
    status: 'available',
    description: 'Complete vape kit with tank and coils, barely used',
    descriptionAr: 'كيت فايب كامل مع التانك والكويلات، مستعمل قليلاً',
    seller: 'أحمد محمد',
    rating: 4.8,
    views: 156,
    createdAt: '2024-01-15'
  },
  {
    _id: 'u2',
    name: 'GeekVape Aegis Legend',
    nameAr: 'جيك فايب إيجيس ليجند',
    image: '/uploads/used-box-vape-1.jpg',
    price: 12000,
    originalPrice: 18000,
    category: 'box-vape',
    condition: 'good',
    status: 'available',
    description: 'Waterproof and shockproof box mod, great condition',
    descriptionAr: 'بوكس مود مقاوم للماء والصدمات، حالة ممتازة',
    seller: 'سارة أحمد',
    rating: 4.5,
    views: 89,
    createdAt: '2024-01-10'
  },
  {
    _id: 'u3',
    name: 'Aspire Cleito Tank',
    nameAr: 'تانك أسباير كليتو',
    image: '/uploads/used-atomizer-1.jpg',
    price: 4500,
    originalPrice: 7000,
    category: 'atomizer',
    condition: 'good',
    status: 'sold',
    description: 'High-quality sub-ohm tank with excellent flavor',
    descriptionAr: 'تانك عالي الجودة مع نكهة ممتازة',
    seller: 'محمد علي',
    rating: 4.2,
    views: 234,
    createdAt: '2024-01-08'
  }
];

const AdminUsedProducts = () => {
  const { language } = useLanguage();
  const [products, setProducts] = useState<UsedProduct[]>(usedProductsData);
  const [filteredProducts, setFilteredProducts] = useState<UsedProduct[]>(usedProductsData);
  const [selectedProduct, setSelectedProduct] = useState<UsedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    price: 0,
    originalPrice: 0,
    category: 'vape-kit' as 'vape-kit' | 'box-vape' | 'atomizer',
    condition: 'excellent' as 'excellent' | 'good' | 'fair',
    status: 'available' as 'available' | 'sold' | 'reserved',
    description: '',
    descriptionAr: '',
    seller: '',
    image: ''
  });

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        (language === 'ar' ? product.nameAr : product.name)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, statusFilter, products, language]);

  const handleAdd = () => {
    setFormData({
      name: '',
      nameAr: '',
      price: 0,
      originalPrice: 0,
      category: 'vape-kit',
      condition: 'excellent',
      status: 'available',
      description: '',
      descriptionAr: '',
      seller: '',
      image: ''
    });
    setSelectedProduct(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (product: UsedProduct) => {
    setFormData({
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      condition: product.condition,
      status: product.status,
      description: product.description,
      descriptionAr: product.descriptionAr,
      seller: product.seller,
      image: product.image
    });
    setSelectedProduct(product);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p._id !== productId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p._id === selectedProduct._id 
          ? { ...p, ...formData }
          : p
      ));
    } else {
      // Add new product
      const newProduct: UsedProduct = {
        _id: 'u' + Date.now(),
        ...formData,
        rating: 0,
        views: 0,
        createdAt: new Date().toISOString()
      };
      setProducts([...products, newProduct]);
    }
    
    setIsModalOpen(false);
  };

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vape-kit':
        return <GiCigarette className="text-blue-500" />;
      case 'box-vape':
        return <BsBoxSeam className="text-purple-500" />;
      case 'atomizer':
        return <GiElectric className="text-green-500" />;
      default:
        return <GiCigarette className="text-gray-500" />;
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

  const getCategoryText = (category: string) => {
    if (language === 'ar') {
      switch (category) {
        case 'vape-kit': return 'كيت فايب';
        case 'box-vape': return 'بوكس مود';
        case 'atomizer': return 'أتومايزر';
        default: return category;
      }
    }
    switch (category) {
      case 'vape-kit': return 'Vape Kit';
      case 'box-vape': return 'Box Mod';
      case 'atomizer': return 'Atomizer';
      default: return category;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
          <GiCigarette className="text-blue-500" />
          {language === 'ar' ? 'إدارة المنتجات المستعملة' : 'Used Products Management'}
        </h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <FaPlus />
          {language === 'ar' ? 'إضافة منتج' : 'Add Product'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'ar' ? 'البحث عن منتج أو بائع...' : 'Search product or seller...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">{language === 'ar' ? 'جميع الفئات' : 'All Categories'}</option>
            <option value="vape-kit">{language === 'ar' ? 'كيتات الفايب' : 'Vape Kits'}</option>
            <option value="box-vape">{language === 'ar' ? 'بوكس مودز' : 'Box Mods'}</option>
            <option value="atomizer">{language === 'ar' ? 'الأتومايزر' : 'Atomizers'}</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
            <option value="available">{language === 'ar' ? 'متوفر' : 'Available'}</option>
            <option value="sold">{language === 'ar' ? 'تم البيع' : 'Sold'}</option>
            <option value="reserved">{language === 'ar' ? 'محجوز' : 'Reserved'}</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">{language === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <GiCigarette size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">{language === 'ar' ? 'متوفر' : 'Available'}</p>
              <p className="text-2xl font-bold">{products.filter(p => p.status === 'available').length}</p>
            </div>
            <FaEye size={32} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">{language === 'ar' ? 'تم البيع' : 'Sold'}</p>
              <p className="text-2xl font-bold">{products.filter(p => p.status === 'sold').length}</p>
            </div>
            <FaTrash size={32} className="text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">{language === 'ar' ? 'محجوز' : 'Reserved'}</p>
              <p className="text-2xl font-bold">{products.filter(p => p.status === 'reserved').length}</p>
            </div>
            <FaFilter size={32} className="text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'المنتج' : 'Product'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'الفئة' : 'Category'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'السعر' : 'Price'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'الحالة' : 'Condition'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'الوضع' : 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'البائع' : 'Seller'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={language === 'ar' ? product.nameAr : product.name}
                        className="w-12 h-12 object-cover rounded-lg mr-4"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/uploads/placeholder-vape.jpg';
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {language === 'ar' ? product.nameAr : product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {language === 'ar' ? product.descriptionAr.substring(0, 50) + '...' : product.description.substring(0, 50) + '...'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(product.category)}
                      <span className="text-sm text-gray-900 dark:text-white">
                        {getCategoryText(product.category)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="font-bold text-green-600">
                        {product.price.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}
                      </div>
                      <div className="text-xs text-gray-500 line-through">
                        {product.originalPrice.toLocaleString()} {language === 'ar' ? 'دج' : 'DA'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(product.condition)}`}>
                      {getConditionText(product.condition)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {product.seller}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                        title={language === 'ar' ? 'تعديل' : 'Edit'}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                        title={language === 'ar' ? 'حذف' : 'Delete'}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              {isEditing 
                ? (language === 'ar' ? 'تعديل المنتج' : 'Edit Product')
                : (language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')
              }
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    {language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Name Arabic */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    {language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    {language === 'ar' ? 'السعر الحالي' : 'Current Price'}
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    {language === 'ar' ? 'السعر الأصلي' : 'Original Price'}
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    {language === 'ar' ? 'الفئة' : 'Category'}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="vape-kit">{language === 'ar' ? 'كيت فايب' : 'Vape Kit'}</option>
                    <option value="box-vape">{language === 'ar' ? 'بوكس مود' : 'Box Mod'}</option>
                    <option value="atomizer">{language === 'ar' ? 'أتومايزر' : 'Atomizer'}</option>
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    {language === 'ar' ? 'الحالة' : 'Condition'}
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="excellent">{language === 'ar' ? 'ممتاز' : 'Excellent'}</option>
                    <option value="good">{language === 'ar' ? 'جيد' : 'Good'}</option>
                    <option value="fair">{language === 'ar' ? 'مقبول' : 'Fair'}</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    {language === 'ar' ? 'الوضع' : 'Status'}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="available">{language === 'ar' ? 'متوفر' : 'Available'}</option>
                    <option value="sold">{language === 'ar' ? 'تم البيع' : 'Sold'}</option>
                    <option value="reserved">{language === 'ar' ? 'محجوز' : 'Reserved'}</option>
                  </select>
                </div>

                {/* Seller */}
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">
                    {language === 'ar' ? 'البائع' : 'Seller'}
                  </label>
                  <input
                    type="text"
                    value={formData.seller}
                    onChange={(e) => setFormData({...formData, seller: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  {language === 'ar' ? 'رابط الصورة' : 'Image URL'}
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="/uploads/product-image.jpg"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  {language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Description Arabic */}
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                </label>
                <textarea
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                >
                  {isEditing 
                    ? (language === 'ar' ? 'تحديث' : 'Update')
                    : (language === 'ar' ? 'إضافة' : 'Add')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsedProducts;
