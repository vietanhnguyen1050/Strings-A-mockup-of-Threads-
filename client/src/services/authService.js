/**
 * Auth Service
 * 
 * API endpoints for authentication.
 * Connects to backend: POST /api/auth/login, POST /api/auth/signup
 */

import api from '@/api/axios';

// Login with email/username/phone and password
export const login = async (credential, password) => {
  try {
    const response = await api.post('/auth/login', { credential, password });
    const { user, token } = response.data;
    
    // Store token and user ID
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', user._id);
    
    return { success: true, data: { user, token } };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed';
    return { success: false, error: message };
  }
};

// Signup new user
export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    const { user, token } = response.data;
    
    // Store token and user ID
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', user._id);
    
    return { success: true, data: { user, token } };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Signup failed';
    return { success: false, error: message };
  }
};

// Logout
export const logout = async () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  return { success: true };
};

// Get current authenticated user
export const getCurrentUser = async () => {
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  
  if (!token || !userId) {
    return { success: false, error: 'Not authenticated' };
  }
  
  try {
    const response = await api.get(`/users/${userId}`);
    return { success: true, data: response.data.user };
  } catch (error) {
    // Clear invalid token
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    return { success: false, error: 'Session expired' };
  }
};

export default {
  login,
  signup,
  logout,
  getCurrentUser,
};
