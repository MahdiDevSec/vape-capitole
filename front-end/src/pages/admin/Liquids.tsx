import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useLanguage } from '../../contexts/LanguageContext';
import { ALL_FRUITS } from '../../data/fruitList';
import Select from 'react-select';

interface Liquid {
  _id: string;
  name: string;
  brand?: string;
  description: string;
  price: number;
  nicotineLevel: number;
  volume: number;
  baseRatio: { vg: number; pg: number };
  inStock: number;
  store: string;
  image: string;
  category: string;
  // الحقول الجديدة
  fruitTypes?: string[];
  coolingType?: string;
  type?: 'حلو' | 'كريمي';
  flavorProfile?: {
    primary: string;
    secondary: string[];
    mentholLevel: number;
    sweetness: number;
    intensity: number;
    complexity: number;
  };
}

interface Store {
  _id: string;
  name: string;
}

const AdminLiquids = () => {
  const { t } = useLanguage();
  const [liquids, setLiquids] = useState<Liquid[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedLiquid, setSelectedLiquid] = useState<Liquid | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const FLAVORS = [
    'fruit',
    'dessert',
    'menthol',
    'tobacco',
    'beverage',
    'cream',
    'spice'
  ];

  const [editForm, setEditForm] = useState({
    name: '',
    brand: 'Custom Brand',
    description: '',
    price: 0,
    nicotineLevel: 3,
    volume: 30,
    isAvailable: true, // متوفر افتراضيًا
    baseRatio: { vg: 70, pg: 30 },
    store: '',
    image: '',
    // الحقول الجديدة
    fruitTypes: [] as string[],
    coolingType: '',
    mentholLevel: 0,
    sweetness: 5,
    complexity: 5,
    flavorPrimary: 'fruit',
    flavorSecondary: [] as string[],
    type: 'حلو'
  });

  useEffect(() => {
    fetchLiquids();
    fetchStores();
  }, []);

  const fetchLiquids = async () => {
    try {
      const response = await axios.get('/api/liquids');
      setLiquids(response.data.liquids || response.data);
    } catch (error) {
      console.error('Error fetching liquids:', error);
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

  const handleEdit = (liquid: Liquid) => {
    setSelectedLiquid(liquid);
    setEditForm({
      name: liquid.name,
      brand: liquid.brand || 'Custom Brand',
      description: liquid.description,
      price: liquid.price,
      nicotineLevel: liquid.nicotineLevel,
      volume: liquid.volume,
      isAvailable: liquid.inStock > 0,
      baseRatio: liquid.baseRatio,
      store: liquid.store,
      image: liquid.image || '',
      fruitTypes: liquid.fruitTypes || [] as string[],
      coolingType: liquid.coolingType || '',
      mentholLevel: liquid.flavorProfile?.mentholLevel || 0,
      sweetness: liquid.flavorProfile?.sweetness || 5,
      complexity: liquid.flavorProfile?.complexity || 5,
      flavorPrimary: liquid.flavorProfile?.primary || 'fruit',
      flavorSecondary: liquid.flavorProfile?.secondary || [],
      type: liquid.type || 'حلو'
    });
    setImageFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (liquidId: string) => {
    if (!window.confirm('Are you sure you want to delete this liquid?')) return;
    try {
      await axios.delete(`/api/liquids/${liquidId}`);
      setLiquids(liquids.filter((l) => l._id !== liquidId));
    } catch (error) {
      console.error('Error deleting liquid:', error);
      setError('Failed to delete liquid.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', editForm.price.toString());
      formData.append('nicotineLevel', editForm.nicotineLevel.toString());
      formData.append('volume', editForm.volume.toString());
      formData.append('baseRatio', JSON.stringify(editForm.baseRatio));
      formData.append('inStock', editForm.isAvailable ? '1' : '0');
      formData.append('store', editForm.store);
      formData.append('category', 'fruit'); // إضافة category مطلوب
      formData.append('brand', 'Custom Brand'); // إضافة brand مطلوب
      formData.append('type', editForm.type); // إضافة type مطلوب
      formData.append('mentholLevel', editForm.mentholLevel.toString());
      formData.append('flavorProfile', JSON.stringify({
        primary: editForm.flavorPrimary,
        secondary: editForm.flavorSecondary,
        mentholLevel: editForm.mentholLevel,
        sweetness: editForm.sweetness,
        intensity: 5,
        complexity: editForm.complexity
      }));
      formData.append('mixingInfo', JSON.stringify({
        isMixable: true,
        recommendedPercentage: 50,
        compatibility: [],
        notes: ''
      }));
      formData.append('tags', JSON.stringify([]));
      // الحقول الجديدة
      formData.append('fruitTypes', JSON.stringify(editForm.fruitTypes));
      formData.append('coolingType', editForm.coolingType);

      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      if (selectedLiquid) {
        // تعديل سائل موجود عبر API السوائل
        await axios.put(`/api/liquids/${selectedLiquid._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // إضافة سائل جديد عبر API السوائل
        await axios.post('/api/liquids', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      fetchLiquids();
      setIsEditing(false);
      setSelectedLiquid(null);
      setImageFile(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save liquid.');
    }
  };

  // Emoji map for fruit icons
  const FRUIT_EMOJI: Record<string, string> = {
    apple: '🍎', apricot: '🍑', avocado: '🥑', banana: '🍌', blackberry: '🫐', blueberry: '🫐',
    cantaloupe: '🍈', cherry: '🍒', coconut: '🥥', cranberry: '🍒', date: '🍇', dragonfruit: '🐉',
    durian: '🟢', elderberry: '🫐', fig: '🫐', grape: '🍇', grapefruit: '🍊', guava: '🥝',
    honeydew: '🍈', jackfruit: '🍈', jujube: '🍎', kiwi: '🥝', kumquat: '🍊', lemon: '🍋', lime: '🍋',
    lychee: '🍒', mandarin: '🍊', mango: '🥭', mangosteen: '🥭', mulberry: '🫐', nectarine: '🍑',
    orange: '🍊', papaya: '🥭', passionfruit: '🥭', peach: '🍑', pear: '🍐', persimmon: '🍑',
    pineapple: '🍍', plum: '🍑', pomegranate: '🍎', quince: '🍋', raspberry: '🍓', starfruit: '🟡',
    strawberry: '🍓', tangerine: '🍊', tomato: '🍅', watermelon: '🍉'
  };

  const fruitOptions = ALL_FRUITS.map(f => ({ value: f, label: `${FRUIT_EMOJI[f.toLowerCase()] || '🍇'} ${f}` }));
  const storeOptions = stores.map(s=>({ value: s._id, label: s.name }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('Liquids Management')}</h1>
        <button
          className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2"
          onClick={() => {
            setSelectedLiquid(null);
            setEditForm({
              name: '',
              brand: 'Custom Brand',
              description: '',
              price: 0,
              nicotineLevel: 3,
              volume: 30,
              isAvailable: true,
              baseRatio: { vg: 70, pg: 30 },
              store: '',
              image: '',
              // الحقول الجديدة
              fruitTypes: [] as string[],
              coolingType: '',
              mentholLevel: 0,
              sweetness: 5,
              complexity: 5,
              flavorPrimary: 'fruit',
              flavorSecondary: [] as string[],
              type: 'حلو'
            });
            setIsEditing(true);
          }}
        >
          <FaPlus />
          {t('Add Liquid')}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Liquids Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('Liquid')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('Nicotine')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('Volume')}
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
              {liquids.map((liquid) => (
                <tr key={liquid._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={liquid.image.startsWith('/uploads/') ? `http://localhost:5000${liquid.image}` : liquid.image}
                          alt={liquid.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {liquid.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {liquid.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {liquid.nicotineLevel}mg
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {liquid.volume}ml
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ${liquid.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        liquid.inStock > 0
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {liquid.inStock > 0 ? t('Available') : t('Out of stock')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {typeof liquid.store === 'object' && liquid.store !== null
                      ? (liquid.store as any).name
                      : stores.find(s => s._id === liquid.store)?.name || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(liquid)}
                      className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(liquid._id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              {selectedLiquid ? t('Edit Liquid') : t('Add New Liquid')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="text-red-600 mb-2">{error}</div>}
              {/* BASIC INFO GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <label className="block text-sm font-medium mb-1 md:col-span-2">
                  {t('Name')}
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700 md:col-span-2"
                  required
                />
                {/* Availability */}
                <label className="block text-sm font-medium mb-1">
                  {t('Availability')}
                </label>
                <select
                  value={editForm.isAvailable ? 'available' : 'unavailable'}
                  onChange={(e) => setEditForm({ ...editForm, isAvailable: e.target.value === 'available' })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                >
                  <option value="available">{t('Available')}</option>
                  <option value="unavailable">{t('Out of stock')}</option>
                </select>
                {/* Brand */}
                <label className="block text-sm font-medium mb-1">
                  {t('Brand')}
                </label>
                <input
                  type="text"
                  value={editForm.brand}
                  onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                />
                {/* Price */}
                <label className="block text-sm font-medium mb-1">
                  {t('Price')}
                </label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  step="0.01"
                  required
                />
              </div>

              {/* DESCRIPTION FULL WIDTH */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">{t('Description')}</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  rows={3}
                  required
                />
              </div>
              {/* NUMERIC + SELECT GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('Nicotine Level (mg)')}</label>
                  <input
                    type="number"
                    value={editForm.nicotineLevel}
                    onChange={(e) => setEditForm({ ...editForm, nicotineLevel: Number(e.target.value) })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                    min="0"
                    max="18"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('Volume (ml)')}</label>
                  <select
                    value={editForm.volume}
                    onChange={(e) => setEditForm({ ...editForm, volume: Number(e.target.value) })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                    required
                  >
                    <option value={10}>10ml</option>
                    <option value={30}>30ml</option>
                    <option value={60}>60ml</option>
                    <option value={100}>100ml</option>
                  </select>
                </div>
              </div>
              {/* Menthol Level */}
              <div>
                <label className="block text-sm font-medium mb-1">{t('Menthol Level (0-10)')}</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={editForm.mentholLevel}
                  onChange={(e) => setEditForm({ ...editForm, mentholLevel: Number(e.target.value) })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                />
              </div>
              {/* Sweetness */}
              <div>
                <label className="block text-sm font-medium mb-1">{t('Sweetness (0-10)')}</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={editForm.sweetness}
                  onChange={(e) => setEditForm({ ...editForm, sweetness: Number(e.target.value) })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                />
              </div>
              {/* Complexity */}
              <div>
                <label className="block text-sm font-medium mb-1">{t('Complexity (0-10)')}</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={editForm.complexity}
                  onChange={(e) => setEditForm({ ...editForm, complexity: Number(e.target.value) })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                />
              </div>
              {/* Primary Flavor */}
              <div>
                <label className="block text-sm font-medium mb-1">{t('Primary Flavor')}</label>
                <select
                  value={editForm.flavorPrimary}
                  onChange={(e) => setEditForm({ ...editForm, flavorPrimary: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                >
                  {FLAVORS.map((fl) => (
                    <option key={fl} value={fl}>{t(fl)}</option>
                  ))}
                </select>
              </div>
              {/* Fruit Types */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Fruit Types</label>
                <Select
                  isMulti
                  options={fruitOptions}
                  value={fruitOptions.filter(o=>editForm.fruitTypes.includes(o.value))}
                  onChange={(vals)=> setEditForm({...editForm, fruitTypes: vals.map(v=>v.value)}) }
                  className="react-select-container text-sm"
                  classNamePrefix="react-select"
                  styles={{
                    control:(base)=>({...base,borderColor:'#d1d5db',backgroundColor:'#fff'}),
                    menu:(base)=>({...base,zIndex:100})
                  }}
                />
              </div>

              {/* Stores */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Stores</label>
                <Select
                  isMulti
                  options={storeOptions}
                  value={storeOptions.filter(o=>editForm.store.includes(o.value))}
                  onChange={(vals)=> setEditForm({...editForm, store: vals.map(v=>v.value)}) }
                  className="react-select-container text-sm"
                  classNamePrefix="react-select"
                  styles={{control:(b)=>({...b,borderColor:'#d1d5db'}),menu:(b)=>({...b,zIndex:100})}}
                />
              </div>
              {/* Image & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                  <label className="block text-sm font-medium mb-1">{t('Image')}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                />
                {editForm.image && !imageFile && (
                    <img src={editForm.image} alt={t('Liquid')} className="mt-2 h-16" />
                )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('Type')}</label>
                  <select
                    value={editForm.type}
                    onChange={e => setEditForm({ ...editForm, type: e.target.value as 'حلو' | 'كريمي' })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                    required
                  >
                    <option value="حلو">{t('حلو')}</option>
                    <option value="كريمي">{t('كريمي')}</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedLiquid(null);
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
                  {selectedLiquid ? t('Save Changes') : t('Add Liquid')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLiquids; 