import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';

const ResetAdminModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    email: '',
    newName: '',
    newPassword: '',
    secretAnswer: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/reset-admin-credentials', {
        email: form.email,
        newName: form.newName,
        newPassword: form.newPassword,
        secretAnswer: form.secretAnswer
      });
      setSuccess(res.data?.message || 'Credentials updated successfully!');
      setForm({ email: '', newName: '', newPassword: '', secretAnswer: '' });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Admin Credentials</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-2">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Email (for confirmation)</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="input w-full" required />
          </div>
          <div>
            <label className="block mb-1">New Name</label>
            <input type="text" name="newName" value={form.newName} onChange={handleChange} className="input w-full" required />
          </div>
          <div>
            <label className="block mb-1">New Password</label>
            <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} className="input w-full" required />
          </div>
          <div>
            <label className="block mb-1">Secret Answer</label>
            <input type="text" name="secretAnswer" value={form.secretAnswer} onChange={handleChange} className="input w-full" required />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'Submitting...' : 'Reset Credentials'}</button>
        </form>
      </div>
    </div>
  );
};

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Email or password is incorrect.');
      }
    } catch (err: any) {
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="bg-background p-8 rounded-xl shadow-lg border border-border w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-text-secondary mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-text-secondary mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <button className="text-primary underline" onClick={() => setShowReset(true)}>
            Forgot password or want to change your name?
          </button>
        </div>
      </div>
      <ResetAdminModal isOpen={showReset} onClose={() => setShowReset(false)} />
    </div>
  );
};

export default AdminLogin;


