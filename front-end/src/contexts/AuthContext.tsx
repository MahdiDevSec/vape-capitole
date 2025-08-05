import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// إعداد Axios base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// إعداد axios interceptor لإرسال التوكن تلقائياً
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// إعداد axios interceptor للتعامل مع أخطاء التوكن
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdminAuthenticated');
      // لا نقوم بإعادة التوجيه هنا لتجنب التكرار
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // التحقق من صحة التوكن عند تحميل التطبيق
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const isAuth = localStorage.getItem('isAdminAuthenticated');
      
      if (token && isAuth === 'true') {
        try {
          // التحقق من صحة التوكن مع الخادم
          await axios.get('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setIsAuthenticated(true);
        } catch (error) {
          // إذا كان التوكن غير صالح، قم بحذفه
          localStorage.removeItem('token');
          localStorage.removeItem('isAdminAuthenticated');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('isAdminAuthenticated', 'true');
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('isAdminAuthenticated');
  };

  // لا نعرض المحتوى حتى يتم التحقق من التوكن
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


