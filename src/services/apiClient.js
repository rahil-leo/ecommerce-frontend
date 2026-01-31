import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, ERROR_MESSAGES } from '@constants';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Always send cookies with requests
apiClient.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - just pass the error, don't redirect
          // Let the component/context handle the auth state
          break;
        case 404:
          error.message = ERROR_MESSAGES.NOT_FOUND;
          break;
        case 500:
          error.message = ERROR_MESSAGES.SERVER_ERROR;
          break;
        default:
          error.message = error.response.data?.message || ERROR_MESSAGES.SERVER_ERROR;
      }
    } else if (error.request) {
      // Request made but no response
      error.message = ERROR_MESSAGES.NETWORK_ERROR;
    }
    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: async (url, config = {}) => {
    const response = await apiClient.get(url, config);
    return response.data;
  },

  post: async (url, data, config = {}) => {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },

  put: async (url, data, config = {}) => {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },

  patch: async (url, data, config = {}) => {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  },

  delete: async (url, config = {}) => {
    const response = await apiClient.delete(url, config);
    return response.data;
  },
};

export default apiClient;
