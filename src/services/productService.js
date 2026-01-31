import { api } from './apiClient';

export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data || [];
    } catch (error) {
      throw error;
    }
  },

  // Get single product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      return await api.get(`/products/category/${category}`);
    } catch (error) {
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      return await api.get('/products/categories');
    } catch (error) {
      throw error;
    }
  },

  // Get limited products (for pagination)
  getLimitedProducts: async (limit = 10) => {
    try {
      return await api.get(`/products?limit=${limit}`);
    } catch (error) {
      throw error;
    }
  },

  // Sort products
  getSortedProducts: async (sort = 'asc') => {
    try {
      return await api.get(`/products?sort=${sort}`);
    } catch (error) {
      throw error;
    }
  },
};

export default productService;
