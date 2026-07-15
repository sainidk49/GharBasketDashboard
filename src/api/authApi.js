import api from './axiosInstance';

const authApi = {
  login: (credentials) => api.post('/auth/dashboard-login', credentials),
  getProfile: () => api.get('/users/profile'),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  changePassword: (data) => api.put('/auth/change-password', data),
  forceChangePassword: (data) => api.put('/auth/force-change-password', data)
};

export default authApi;
