import { useEffect, useState } from 'react';
import { FaUsers, FaBox, FaStore, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalStores: number;
  totalOrders: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalStores: 0,
    totalOrders: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, productsRes, storesRes, ordersRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/products'),
        axios.get('/api/admin/stores'),
        axios.get('/api/admin/orders')
      ]);

      setStats({
        totalUsers: usersRes.data.length,
        totalProducts: productsRes.data.length,
        totalStores: storesRes.data.length,
        totalOrders: ordersRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <FaUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
              </div>

        {/* Products Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <FaBox className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalProducts}</p>
            </div>
          </div>
      </div>

        {/* Stores Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <FaStore className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Stores</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalStores}</p>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <FaShoppingCart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors">
            <FaUsers className="h-8 w-8 mx-auto mb-2" />
            <span className="block text-sm font-medium">Manage Users</span>
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors">
            <FaBox className="h-8 w-8 mx-auto mb-2" />
            <span className="block text-sm font-medium">Manage Products</span>
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-colors">
            <FaStore className="h-8 w-8 mx-auto mb-2" />
            <span className="block text-sm font-medium">Manage Stores</span>
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition-colors">
            <FaShoppingCart className="h-8 w-8 mx-auto mb-2" />
            <span className="block text-sm font-medium">View Orders</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
