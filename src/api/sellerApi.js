import api from './axiosInstance';

const sellerApi = {
  getDashboardStats: (params) => api.get('/seller', { params }),
  
  // Products
  getCategories: (params) => api.get('/products/categories', { params }),
  getProducts: (params) => api.get('/seller/products', { params }),
  createProduct: (data) => api.post('/seller/products', data, data instanceof FormData ? {
    headers: { 'Content-Type': 'multipart/form-data' }
  } : undefined),
  getProductById: (id) => api.get(`/seller/products/${id}`),
  updateProduct: (id, data) => api.put(`/seller/products/${id}`, data, data instanceof FormData ? {
    headers: { 'Content-Type': 'multipart/form-data' }
  } : undefined),
  deleteProduct: (id) => api.delete(`/seller/products/${id}`),
  duplicateProduct: (id) => api.post(`/seller/products/${id}/duplicate`),
  
  // Orders
  getOrders: (params) => api.get('/seller/orders', { params }),
  getOrderById: (id) => api.get(`/seller/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/seller/orders/${id}/status`, data),
  assignDeliveryPartner: (orderId, data) => api.put(`/seller/orders/${orderId}/assign`, data),
  getDeliveryPartners: (params) => api.get('/seller/delivery-partners', { params }),
  
  // Profile
  getProfile: () => api.get('/seller/profile'),
  updateProfile: (data) => api.put('/seller/profile', data)
};

export default sellerApi;
