import apiClient from './apiClient';

export const userApi = {
  // Get user profile
  getProfile: () => apiClient.get('/user/profile'),
  
  // Update user profile
  updateProfile: (data) => apiClient.put('/user/profile', data),
  
  // Change password
  changePassword: (data) => apiClient.put('/user/change-password', data)
};
