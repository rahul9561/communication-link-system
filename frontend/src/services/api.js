// src/api.js
import axios from 'axios';

// Base URL of your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------- LINKS --------------------

// Get all links
export const getAllLinks = async () => {
  const response = await api.get('/links');
  return response.data;
};

// Get single link by ID
export const getLinkById = async (id) => {
  const response = await api.get(`/links/${id}`);
  return response.data;
};

// Create new link
export const createLink = async (linkData) => {
  const response = await api.post('/links', linkData);
  return response.data;
};

// Update link by ID
export const updateLink = async (id, linkData) => {
  const response = await api.put(`/links/${id}`, linkData);
  return response.data;
};

// Delete link by ID
export const deleteLink = async (id) => {
  const response = await api.delete(`/links/${id}`);
  return response.data;
};

// -------------------- LOGS --------------------

// Get all logs
export const getAllLogs = async () => {
  const response = await api.get('/logs');
  return response.data;
};

// Get logs for a specific link by ID
export const getLogsByLinkId = async (id) => {
  const response = await api.get(`/logs/${id}`);
  return response.data;
};

// -------------------- USER PROFILE --------------------

// Get user profile
export const getUserProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  const response = await api.put('/user/profile', profileData);
  return response.data;
};

// Update user role (admin only)
export const updateUserRole = async (roleData) => {
  const response = await api.put('/user/profile/role', roleData);
  return response.data;
};

// -------------------- PASSWORD --------------------

// Change password
export const changePassword = async (passwordData) => {
  const response = await api.put('/user/password', passwordData);
  return response.data;
};

// -------------------- NOTIFICATIONS --------------------

// Get user notifications
export const getUserNotifications = async () => {
  const response = await api.get('/user/notifications');
  return response.data;
};

// Toggle notification
export const toggleNotification = async (key, enabled) => {
  const response = await api.put(`/user/notifications/${key}`, { enabled });
  return response.data;
};

// -------------------- SECURITY --------------------

// Toggle 2FA
export const toggleTwoFactorAuth = async (enabled) => {
  const response = await api.put('/user/security/2fa', { enabled });
  return response.data;
};

// Get user sessions
export const getUserSessions = async () => {
  const response = await api.get('/user/security/sessions');
  return response.data;
};

// Sign out specific session
export const signOutSession = async (device) => {
  const response = await api.delete(`/user/security/sessions/${encodeURIComponent(device)}`);
  return response.data;
};

// Sign out all sessions
export const signOutAllSessions = async () => {
  const response = await api.delete('/user/security/sessions');
  return response.data;
};

// -------------------- SYSTEM --------------------

// Get system preferences
export const getSystemPreferences = async () => {
  const response = await api.get('/user/system');
  return response.data;
};

// Update system preference
export const updateSystemPreference = async (key, value) => {
  const response = await api.put(`/user/system/${key}`, { value });
  return response.data;
};

export default api;