import { api } from './api';

export const estimationApi = {
  // Step 1: Create new estimation
  create: async (data) => {
    const response = await api.post('/estimation', data);
    return response.data;
  },
  
  // Step 2: Production Setup
  saveProductionSetup: async (id, data) => {
    try {
      const response = await api.patch(`/estimation/${id}/step-2`, data);
      return response.data;
    } catch (error) {
      console.error('saveProductionSetup error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Step 3: Housing
  saveHousing: async (id, data) => {
    const response = await api.patch(`/estimation/${id}/step-3`, data);
    return response.data;
  },
  
  // Step 4: Feed & Market
  saveFeedAndMarket: async (id, data) => {
    const response = await api.patch(`/estimation/${id}/step-4`, data);
    return response.data;
  },
  
  // Step 5: Health Management
  saveHealth: async (id, data) => {
    const response = await api.patch(`/estimation/${id}/step-5`, data);
    return response.data;
  },
  
  // Calculate Results
  calculate: async (id) => {
    const response = await api.post(`/estimation/${id}/calculate`);
    return response.data;
  },

  // Get User's Estimations
  getHistory: async () => {
    const response = await api.get('/estimation/user-estimation');
    return response.data;
  },

  // Get Specific Estimation
  getById: async (id) => {
    const response = await api.get(`/estimation/${id}`);
    return response.data;
  },

  // Delete Estimation
  delete: async (id) => {
    const response = await api.delete(`/estimation/${id}`);
    return response.data;
  }
};
