import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Appointment API
export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getAll: () => api.get('/appointments'),
  getAllAdmin: () => api.get('/appointments/all'),
  updateStatus: (id, data) => api.put(`/appointments/${id}/status`, data),
};

// Message API
export const messageAPI = {
  send: (data) => api.post('/messages', data),
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  markAsRead: (userId) => api.put(`/messages/${userId}/read`),
};

// User API
export const userAPI = {
  getDoctors: (department) => api.get(`/users/doctors${department ? `?department=${department}` : ''}`),
  getPatients: () => api.get('/users/patients'),
  createRecord: (data) => api.post('/users/records', data),
  getRecords: (patientId) => api.get(patientId ? `/users/records/${patientId}` : '/users/records'),
  uploadDocument: (recordId, formData) => api.post(`/users/records/${recordId}/upload`, formData),
  getStats: () => api.get('/users/stats'),
};

// Admin API
export const adminAPI = {
  getPendingDoctors: () => api.get('/admin/doctors/pending'),
  getAllDoctors: () => api.get('/admin/doctors'),
  approveDoctor: (doctorId) => api.put(`/admin/doctors/${doctorId}/approve`),
  rejectDoctor: (doctorId, data) => api.put(`/admin/doctors/${doctorId}/reject`, data),
  getStats: () => api.get('/admin/stats'),
};

export default api;
