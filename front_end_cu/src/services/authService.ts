import { apiClient } from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isLocked: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
      // Store refresh token separately
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
    }
    
    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response;
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.setToken(null);
      localStorage.removeItem('refreshToken');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) return null;
      
      // Decode JWT token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Check if token is expired
        if (payload.exp && payload.exp < Date.now() / 1000) {
          // Try to refresh token
          const newToken = await this.refreshToken();
          if (!newToken) {
            return null;
          }
          // Decode new token
          const newPayload = JSON.parse(atob(newToken.split('.')[1]));
          // Validate required fields from refreshed token
          if (!newPayload.id || !newPayload.username || !newPayload.email) {
            apiClient.setToken(null);
            return null;
          }

          return {
            id: newPayload.id,
            username: newPayload.username,
            email: newPayload.email,
            role: newPayload.role || 'user',
            isLocked: false
          };
        }
        
        // Validate required fields from token
        if (!payload.id || !payload.username || !payload.email) {
          apiClient.setToken(null);
          return null;
        }

        return {
          id: payload.id,
          username: payload.username,
          email: payload.email,
          role: payload.role || 'user',
          isLocked: false
        };
      } catch (decodeError) {
        apiClient.setToken(null);
        return null;
      }
    } catch (error) {
      apiClient.setToken(null);
      return null;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return null;
      
      const response = await apiClient.post<{ accessToken: string }>('/auth/refresh', { refreshToken });
      
      if (response.accessToken) {
        apiClient.setToken(response.accessToken);
        return response.accessToken;
      }
      
      return null;
    } catch (error) {
      apiClient.setToken(null);
      localStorage.removeItem('refreshToken');
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}

export const authService = new AuthService();