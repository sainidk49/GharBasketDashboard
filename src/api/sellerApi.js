import api from './axiosInstance';

const sellerApi = {
  getDashboardStats: (params) => api.get('/seller', { params }),
  
  // Products
  getProducts: (params) => api.get('/seller/products', { params }),
  createProduct: (data) => api.post('/seller/products', data),
  getProductById: (id) => api.get(`/seller/products/${id}`),
  updateProduct: (id, data) => api.put(`/seller/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/seller/products/${id}`),
  duplicateProduct: (id) => api.post(`/seller/products/${id}/duplicate`),
  
  // Orders
  getOrders: (params) => api.get('/seller/orders', { params }),
  getOrderById: (id) => api.get(`/seller/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/seller/orders/${id}/status`, data),
  
  // Profile
  getProfile: () => api.get('/seller/profile'),
  updateProfile: (data) => api.put('/seller/profile', data)
};

export default sellerApi;
