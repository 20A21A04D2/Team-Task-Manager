import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login on load by calling refresh token
  const checkLoggedIn = useCallback(async () => {
    try {
      // First try refreshing access token (silent login)
      const res = await api.post('/auth/refresh');
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
      }
    } catch (error) {
      console.log('No active session / cookie not present');
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  // Set up periodic token refresh (every 10 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.post('/auth/refresh');
        if (res.data.success) {
          localStorage.setItem('token', res.data.token);
        }
      } catch (err) {
        console.error('Silent token refresh failed', err);
        logout();
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Try again.'
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout API failure', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'Admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
