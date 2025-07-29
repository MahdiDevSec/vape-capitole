import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useLanguage } from '../../contexts/LanguageContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: number;
  store: string;
  nicotineLevel?: number;
  volume?: number;
  baseRatio?: { vg: number; pg: number };
}

interface Store {
  _id: string;
  name: string;
}

const getSrc = (img:string)=> img.startsWith('/uploads/')? `http://localhost:5000${img}`: img;

const AdminProducts = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    inStock: 0,
    store: '',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchStores();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await axios.get('/api/admin/stores');
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      inStock: product.inStock,
      store: product.store,
      image: product.image || ''
    });
    setImageFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/admin/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', String(editForm.price));
      formData.append('category', editForm.category);
      formData.append('inStock', String(editForm.inStock));
      formData.append('store', editForm.store);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      if (selectedProduct) {
        await axios.put(`/api/admin/products/${selectedProduct._id}`, formData);
      } else {
        await axios.post('/api/admin/products', formData);
      }
      
      fetchProducts();
      setIsEditing(false);
      setSelectedProduct(null);
      setImageFile(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save product.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('Products Management')}</h1>
        <button
          className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2"
          onClick={() => {
            setSelectedProduct(null);
            setEditForm({
              name: '',
              description: '',
              price: 0,
              category: '',
              inStock: 0,
              store: '',
              image: ''
            });
            setIsEditing(true);
          }}
        >
          <FaPlus />
          {t('Add Product')}
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('Product')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('Category')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('Price')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('Stock')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('Store')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={getSrc(product.image)}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.inStock > 10
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {product.inStock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {stores.find(s => s._id === product.store)?.name || product.store}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {selectedProduct ? t('Edit Product') : t('Add New Product')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-600 mb-2">{error}</div>}
              <div>
                <label className="block text-sm font-medium mb-1">{t('Name')}</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('Description')}</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('Price')}</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('Stock')}</label>
                  <input
                    type="number"
                    value={editForm.inStock}
                    onChange={(e) => setEditForm({ ...editForm, inStock: Number(e.target.value) })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('Category')}</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  required
                >
                  <option value="">{t('Select Category')}</option>
                  <option value="vapekits">{t('category.vape-kits')}</option>
                  <option value="vapeboxes">{t('category.vape-boxes')}</option>
                  <option value="atomisers">{t('category.atomizers')}</option>
                  <option value="pyrex">{t('category.pyrex')}</option>
                  <option value="batteries">{t('category.accus')}</option>
                  <option value="accessories">{t('category.accessories')}</option>
                  <option value="cotton">{t('category.cotton')}</option>
                  <option value="coils">{t('category.coils')}</option>
                  <option value="resistors">{t('category.resistors')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('Store')}</label>
                <select
                  value={editForm.store}
                  onChange={(e) => setEditForm({ ...editForm, store: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  required
                >
                  <option value="">{t('Select Store')}</option>
                  {stores.map(store => (
                    <option key={store._id} value={store._id}>{store.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('Image')}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                />
                {editForm.image && !imageFile && (
                  <img src={editForm.image} alt="Product" className="mt-2 h-16" />
                )}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedProduct(null);
                    setImageFile(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  {t('Cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
                >
                  {selectedProduct ? t('Save Changes') : t('Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
