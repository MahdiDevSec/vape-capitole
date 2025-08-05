import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSave } from 'react-icons/fa';
import axios from 'axios';
import { useLanguage } from '../../contexts/LanguageContext';

interface Translation {
  _id: string;
  key: string;
  translations: {
    ar: string;
    en: string;
    fr: string;
  };
  context?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

const AdminTranslations = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    key: '',
    translations: {
      ar: '',
      en: '',
      fr: ''
    },
    context: '',
    category: ''
  });

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/translations/translations');
      setTranslations(response.data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching translations:', err);
      setError(err?.response?.data?.message || 'Failed to fetch translations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/translations/translations/${editingId}`, formData);
      } else {
        await axios.post('/api/translations/translations', formData);
      }
      
      setFormData({
        key: '',
        translations: { ar: '', en: '', fr: '' },
        context: '',
        category: ''
      });
      setIsAdding(false);
      setEditingId(null);
      fetchTranslations();
    } catch (err: any) {
      console.error('Error saving translation:', err);
      setError(err?.response?.data?.message || 'Failed to save translation');
    }
  };

  const handleEdit = (translation: Translation) => {
    setFormData({
      key: translation.key,
      translations: translation.translations,
      context: translation.context || '',
      category: translation.category || ''
    });
    setEditingId(translation._id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this translation?')) {
      try {
        await axios.delete(`/api/translations/translations/${id}`);
        fetchTranslations();
      } catch (err: any) {
        console.error('Error deleting translation:', err);
        setError(err?.response?.data?.message || 'Failed to delete translation');
      }
    }
  };

  const filteredTranslations = translations.filter(translation =>
    translation.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    translation.translations.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
    translation.translations.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    translation.translations.fr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading translations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Smart Translations Management</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2"
        >
          <FaPlus />
          Add Translation
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search translations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Translation' : 'Add New Translation'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Key</label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Arabic</label>
                <input
                  type="text"
                  value={formData.translations.ar}
                  onChange={(e) => setFormData({
                    ...formData,
                    translations: { ...formData.translations, ar: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">English</label>
                <input
                  type="text"
                  value={formData.translations.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    translations: { ...formData.translations, en: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">French</label>
                <input
                  type="text"
                  value={formData.translations.fr}
                  onChange={(e) => setFormData({
                    ...formData,
                    translations: { ...formData.translations, fr: e.target.value }
                  })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Context</label>
                <input
                  type="text"
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({
                    key: '',
                    translations: { ar: '', en: '', fr: '' },
                    context: '',
                    category: ''
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2"
              >
                <FaSave />
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Translations List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arabic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">French</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Context</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTranslations.map((translation) => (
                <tr key={translation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {translation.key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {translation.translations.ar}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {translation.translations.en}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {translation.translations.fr}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {translation.context || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {translation.category || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(translation)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(translation._id)}
                        className="text-red-600 hover:text-red-900"
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

      {filteredTranslations.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-12">
          No translations found.
        </div>
      )}
    </div>
  );
};

export default AdminTranslations; 


