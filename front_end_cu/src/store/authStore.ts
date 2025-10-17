import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, User, LoginCredentials, RegisterData } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.login(credentials);
          
          if (response.accessToken && response.user) {
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            return true;
          } else {
            set({
              error: response.message || 'Đăng nhập thất bại',
              isLoading: false
            });
            return false;
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Đăng nhập thất bại',
            isLoading: false
          });
          return false;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.register(userData);
          
          if (response.message === 'User registered successfully') {
            set({
              isLoading: false,
              error: null
            });
            return true;
          } else {
            set({
              error: response.message || 'Đăng ký thất bại',
              isLoading: false
            });
            return false;
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Đăng ký thất bại',
            isLoading: false
          });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      getCurrentUser: async () => {
        if (!authService.isAuthenticated()) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
          return;
        }

        set({ isLoading: true });
        
        try {
          const user = await authService.getCurrentUser();
          
          if (user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Lỗi xác thực'
          });
        }
      },

      clearError: () => set({ error: null }),
      
      setLoading: (loading: boolean) => set({ isLoading: loading })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
