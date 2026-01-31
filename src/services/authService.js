import { api } from './apiClient';
import { STORAGE_KEYS } from '@constants';

export const authService = {
  // Login
  login: async (credentials) => {
    try {
      // Send credentials, expect cookie to be set
      const response = await api.post('/auth/login', credentials, { withCredentials: true });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData, { withCredentials: true });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    await api.post('/auth/logout', {}, { withCredentials: true });
  },

  // Get current user from cookie
  getMe: async () => {
    return await api.get('/auth/me', { withCredentials: true });
  },

  // No localStorage, rely on cookie
};

export default authService;
