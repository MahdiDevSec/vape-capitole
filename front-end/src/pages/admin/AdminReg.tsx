import React, { useState } from 'react';
import axios from 'axios';

const AdminRegModal: React.FC<{ isOpen: boolean; onClose: () => void; onSuccess?: () => void }> = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
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
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/admin/add-admin', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('تم إنشاء الأدمن بنجاح!');
      setForm({ email: '', name: '', password: '', secretAnswer: '' });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-center">تسجيل أدمن جديد</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-2">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">البريد الإلكتروني</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="input w-full" required />
          </div>
          <div>
            <label className="block mb-1">الاسم</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="input w-full" required />
          </div>
          <div>
            <label className="block mb-1">كلمة السر</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="input w-full" required />
          </div>
          <div>
            <label className="block mb-1">الإجابة السرية</label>
            <input type="text" name="secretAnswer" value={form.secretAnswer} onChange={handleChange} className="input w-full" required />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>{loading ? 'جاري الإرسال...' : 'تسجيل أدمن جديد'}</button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegModal; 