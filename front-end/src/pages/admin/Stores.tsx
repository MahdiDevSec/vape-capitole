import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

interface Store {
  _id: string;
  name: string;
  location: string;
  phone: string;
  workingHours: string;
  image?: string;
}

const AdminStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    phone: '',
    workingHours: '',
    image: ''
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get('/api/admin/stores');
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleEdit = (store: Store) => {
    setSelectedStore(store);
    setEditForm({
      name: store.name,
      location: store.location,
      phone: store.phone,
      workingHours: store.workingHours,
      image: store.image || ''
    });
    setImageFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (storeId: string) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;
    try {
      await axios.delete(`/api/admin/stores/${storeId}`);
      setStores(stores.filter((s) => s._id !== storeId));
    } catch (err) {
      alert('Failed to delete store.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
    const formData = new FormData();
    formData.append('name', editForm.name);
    formData.append('location', editForm.location);
    formData.append('phone', editForm.phone);
    formData.append('workingHours', editForm.workingHours);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
    if (selectedStore) {
      await axios.put(`/api/admin/stores/${selectedStore._id}`, formData);
    } else {
      await axios.post('/api/admin/stores', formData);
    }
      
      fetchStores();
      setIsEditing(false);
      setSelectedStore(null);
      setImageFile(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save store.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stores Management</h1>
        <button
          className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2"
          onClick={() => {
            setSelectedStore(null);
            setEditForm({
              name: '',
              location: '',
              phone: '',
              workingHours: '',
              image: ''
            });
            setIsEditing(true);
          }}
        >
          <FaPlus />
          Add Store
        </button>
      </div>

      {/* Stores Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
      <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Working Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
          </tr>
        </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {stores.map((store) => (
            <tr key={store._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={store.image || '/images/default-store.jpg'}
                          alt={store.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {store.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {store.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {store.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {store.workingHours}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(store)}
                      className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(store._id)}
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
              {selectedStore ? 'Edit Store' : 'Add New Store'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-600 mb-2">{error}</div>}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Working Hours</label>
                <input
                  type="text"
                  value={editForm.workingHours}
                  onChange={(e) => setEditForm({ ...editForm, workingHours: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  placeholder="9:00 AM - 10:00 PM"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                />
                {editForm.image && !imageFile && (
                  <img src={editForm.image} alt="Store" className="mt-2 h-16" />
                )}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedStore(null);
                    setImageFile(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
                >
                  {selectedStore ? 'Save Changes' : 'Add Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStores; 