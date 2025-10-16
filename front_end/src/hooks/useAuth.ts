import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, register, logout, getCurrentUser, clearError, setLoading } = useAuthStore();

  useEffect(() => {
    // Check if user is already authenticated
    getCurrentUser();
  }, [getCurrentUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    getCurrentUser,
    clearError,
    setLoading
  };
};