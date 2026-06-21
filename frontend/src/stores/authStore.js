import { create } from 'zustand';
import client from '../api/client.js';

export const useAuthStore = create((set) => ({
  user: (() => {
    try {
      const savedUser = localStorage.getItem('eventflow-user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  })(),
  token: localStorage.getItem('eventflow-token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await client.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      localStorage.setItem('eventflow-token', token);
      localStorage.setItem('eventflow-user', JSON.stringify(user));
      set({ user, token, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await client.post('/auth/register', { name, email, password });
      const { user, token } = response.data.data;
      localStorage.setItem('eventflow-token', token);
      localStorage.setItem('eventflow-user', JSON.stringify(user));
      set({ user, token, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  logout: () => {
    localStorage.removeItem('eventflow-token');
    localStorage.removeItem('eventflow-user');
    set({ user: null, token: null, error: null });
  },

  fetchMe: async () => {
    const token = localStorage.getItem('eventflow-token');
    if (!token) return;
    set({ loading: true });
    try {
      const response = await client.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { user } = response.data.data;
      localStorage.setItem('eventflow-user', JSON.stringify(user));
      set({ user, loading: false });
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('eventflow-token');
        localStorage.removeItem('eventflow-user');
        set({ user: null, token: null });
      }
      set({ loading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  }
}));
