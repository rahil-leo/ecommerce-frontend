import { api } from './apiClient';

export const categoryService = {
  // Get all active categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get featured categories for homepage
  getFeaturedCategories: async () => {
    try {
      const response = await api.get('/categories/featured/list');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching featured categories:', error);
      throw error;
    }
  },

  // Get single category by slug
  getCategoryBySlug: async (slug) => {
    try {
      const response = await api.get(`/categories/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${slug}:`, error);
      throw error;
    }
  },

  // Get products for a specific category with pagination
  getProductsByCategory: async (slug, page = 1, limit = 12, sort = '-createdAt', search = '') => {
    try {
      const params = { 
        page, 
        limit, 
        sort 
      };
      
      if (search) {
        params.search = search;
      }

      const response = await api.get(`/products/category/${slug}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${slug}:`, error);
      throw error;
    }
  }
};

