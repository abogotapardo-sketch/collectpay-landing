import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = checking, false = not auth, object = auth
  const [token, setToken] = useState(() => localStorage.getItem('collectpay_token'));

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setUser(false);
        return;
      }
      try {
        const { data } = await axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data);
      } catch (e) {
        localStorage.removeItem('collectpay_token');
        setToken(null);
        setUser(false);
      }
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem('collectpay_token', data.access_token);
    setToken(data.access_token);
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('collectpay_token');
    setToken(null);
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const apiClient = axios.create({
  baseURL: API,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('collectpay_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
