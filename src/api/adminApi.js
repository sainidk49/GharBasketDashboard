import api from './axiosInstance';

const adminApi = {
  getDashboardStats: (params) => api.get('/admin', { params }),
  
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, data) => api.put(`/admin/users/${id}/status`, data),
  
  // Sellers
  getSellers: (params) => api.get('/admin/sellers', { params }),
  createSeller: (data) => api.post('/admin/sellers', data),
  getSellerById: (id) => api.get(`/admin/sellers/${id}`),
  updateSeller: (id, data) => api.put(`/admin/sellers/${id}`, data),
  updateSellerStatus: (id, data) => api.put(`/admin/sellers/${id}/status`, data),
  deleteSeller: (id) => api.delete(`/admin/sellers/${id}`),
  resetSellerPassword: (id, data) => api.put(`/admin/sellers/${id}/reset-password`, data),
  getSellerPermissions: (id) => api.get(`/admin/sellers/${id}/permissions`),
  updateSellerPermissions: (id, data) => api.put(`/admin/sellers/${id}/permissions`, data),
  createSellerCredentials: (id, data) => api.post(`/admin/sellers/${id}/credentials`, data),
  
  // Orders
  getOrders: (params) => api.get('/admin/orders', { params }),
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),

  // Products
  getProducts: (params) => api.get('/admin/products', { params }),
  
  // Categories
  getCategories: (params) => api.get('/admin/categories', { params }),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getCategoryAttributes: (id) => api.get(`/admin/categories/${id}/attributes`),
  createCategoryAttribute: (id, data) => api.post(`/admin/categories/${id}/attributes`, data),
  
  // Audit Logs
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params })
};

export default adminApi;
