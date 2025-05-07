import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuth();
    } else {
      setLoading(false);
      setIsAuthenticated(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        throw new Error('Invalid user data');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      
      if (!response.data.access_token) {
        throw new Error('No access token received');
      }

      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });

      if (!response.data.access_token) {
        throw new Error('No access token received');
      }

      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error(error.response?.data?.error || 'Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 