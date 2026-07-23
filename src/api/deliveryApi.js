import api from './axiosInstance';

const deliveryApi = {
  getDashboardStats: (params) => api.get('/delivery', { params }),
  getOrders: (params) => api.get('/delivery/orders', { params }),
  getOrderById: (id) => api.get(`/delivery/orders/${id}`),
  updateDeliveryStatus: (id, data) => api.put(`/delivery/orders/${id}/status`, data),
  getProfile: () => api.get('/delivery/profile'),
  updateProfile: (data) => api.put('/delivery/profile', data),
  updateOnlineStatus: (data) => api.put('/delivery/status', data)
};

export default deliveryApi;
