import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserLeaves: (id, params) => api.get(`/users/${id}/leaves`, { params }),
  getUserStats: () => api.get('/users/stats/overview'),
};

// Leaves API
export const leavesAPI = {
  getLeaves: (params) => api.get('/leaves', { params }),
  getLeave: (id) => api.get(`/leaves/${id}`),
  createLeave: (leaveData) => api.post('/leaves', leaveData),
  approveLeave: (id) => api.put(`/leaves/${id}/approve`),
  rejectLeave: (id, rejectionReason) => api.put(`/leaves/${id}/reject`, { rejectionReason }),
  cancelLeave: (id) => api.put(`/leaves/${id}/cancel`),
  addComment: (id, comment) => api.post(`/leaves/${id}/comments`, { comment }),
  getLeaveStats: (params) => api.get('/leaves/stats/summary', { params }),
};

// Departments API
export const departmentsAPI = {
  getDepartments: () => api.get('/departments'),
  getDepartment: (id) => api.get(`/departments/${id}`),
  createDepartment: (departmentData) => api.post('/departments', departmentData),
  updateDepartment: (id, departmentData) => api.put(`/departments/${id}`, departmentData),
  deleteDepartment: (id) => api.delete(`/departments/${id}`),
  getDepartmentUsers: (id, params) => api.get(`/departments/${id}/users`, { params }),
  getDepartmentStats: (id) => api.get(`/departments/${id}/stats`),
};

export default api;
