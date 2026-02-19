import API from './api';

const userService = {
  // Password
  changePassword: async (data) => {
    const response = await API.put('/user/password', data);
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await API.get('/user/notifications');
    return response.data;
  },

  updateNotifications: async (preferences) => {
    const response = await API.put('/user/notifications', preferences);
    return response.data;
  },

  // Theme
  updateTheme: async (theme) => {
    const response = await API.put('/user/theme', { theme });
    return response.data;
  },

  // Login history
  getLoginHistory: async () => {
    const response = await API.get('/user/login-history');
    return response.data;
  },

  // Account deletion (PIN only)
  deleteAccount: async (pin) => {
    const response = await API.delete('/user', { data: { pin } });
    return response.data;
  }
};

export default userService;
