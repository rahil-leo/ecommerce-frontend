import { api } from './apiClient';

export const staffService = {
  // Get all staff members
  getAllStaff: async () => {
    try {
      const response = await api.get('/users/staff', { withCredentials: true });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single staff member
  getStaffById: async (id) => {
    try {
      const response = await api.get(`/users/staff/${id}`, { withCredentials: true });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete staff member
  deleteStaff: async (id) => {
    try {
      const response = await api.delete(`/users/staff/${id}`, { withCredentials: true });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update staff member
  updateStaff: async (id, data) => {
    try {
      const response = await api.put(`/users/staff/${id}`, data, { withCredentials: true });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default staffService;
