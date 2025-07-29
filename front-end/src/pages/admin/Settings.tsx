import { useState } from 'react';
import { FaCog, FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const AdminSettings = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [credentialsForm, setCredentialsForm] = useState({
    newName: '',
    newPassword: '',
    secretAnswer: ''
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await axios.put('/api/admin/change-credentials', profileForm);
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      await axios.put('/api/admin/change-credentials', {
        newPassword: passwordForm.newPassword,
        secretAnswer: 'admin' // This should be stored securely
      });
      setSuccess('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update password');
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await axios.post('/api/auth/reset-admin-credentials', credentialsForm);
      setSuccess('Admin credentials updated successfully');
      setCredentialsForm({
        newName: '',
        newPassword: '',
        secretAnswer: ''
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update credentials');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaUser className="inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'password'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaLock className="inline mr-2" />
              Password
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'admin'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaCog className="inline mr-2" />
              Admin Credentials
            </button>
          </nav>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
              >
                Update Profile
              </button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
              >
                Update Password
              </button>
            </form>
          )}

          {/* Admin Credentials Tab */}
          {activeTab === 'admin' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Admin Name</label>
                <input
                  type="text"
                  value={credentialsForm.newName}
                  onChange={(e) => setCredentialsForm({ ...credentialsForm, newName: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Admin Password</label>
                <input
                  type="password"
                  value={credentialsForm.newPassword}
                  onChange={(e) => setCredentialsForm({ ...credentialsForm, newPassword: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Secret Answer</label>
                <input
                  type="text"
                  value={credentialsForm.secretAnswer}
                  onChange={(e) => setCredentialsForm({ ...credentialsForm, secretAnswer: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700"
                  placeholder="Enter the secret answer to reset admin credentials"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md"
              >
                Reset Admin Credentials
              </button>
      </form>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
          <div className="border border-red-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Once you log out, you will need to log in again to access the admin panel.
            </p>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings; 