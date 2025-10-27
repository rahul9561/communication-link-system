// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile, changePassword } from '../services/api'; // Import API functions as needed
import { updateUserProfile } from '../services/api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserProfile();
        if (response.success && response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      // TODO: Implement login API call
      // For now, simulate or use a login endpoint
      // const response = await api.post('/auth/login', { email, password });
      // if (response.success) {
      //   setUser(response.data.user);
      //   setIsAuthenticated(true);
      //   localStorage.setItem('token', response.data.token); // If using JWT
      //   return { success: true };
      // }
      // return { success: false, error: 'Invalid credentials' };
      
      // Demo: Assume success for john.doe@company.com / password123
      if (email === 'john.doe@company.com' && password === 'password123') {
        const demoUser = {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          phone: '+1 (555) 123-4567',
          role: 'Admin',
        };
        setUser(demoUser);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token'); // If using JWT
  };

  const updateUser = async (userData) => {
    try {
      const response = await updateUserProfile(userData);
      if (response.success) {
        setUser(response.data);
        return { success: true };
      }
      return { success: false, error: 'Update failed' };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: 'Update failed' };
    }
  };

  const changeUserPassword = async (passwordData) => {
    try {
      const response = await changePassword(passwordData);
      if (response.success) {
        return { success: true };
      }
      return { success: false, error: 'Password change failed' };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Password change failed' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    changeUserPassword,
  };

  return (
    <AuthContext.Provider value={value} user={user} logout={logout}>
      {children}
    </AuthContext.Provider>
  );
};