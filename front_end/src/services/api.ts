import { getApiBaseUrl } from '../utils/networkUtils';

// API Configuration - automatically determined based on environment
const API_BASE_URL = getApiBaseUrl();
console.log('[API CLIENT] Base URL:', API_BASE_URL);

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    console.log('[API CLIENT] Initialized with base URL:', baseURL);
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setToken(token: string | null) {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('[API CLIENT] Making request to:', url);

    const token = this.getToken();
    console.log('[API CLIENT] Auth token present:', !!token);

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('[API CLIENT] Request config:', {
      method: config.method,
      headers: config.headers
    });

    try {
      const response = await fetch(url, config);
      console.log('[API CLIENT] Response received:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[API CLIENT] Response error data:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log('[API CLIENT] Response JSON data:', jsonData);
      return jsonData;
    } catch (error) {
      console.error('[API CLIENT] Request error:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload file
  async upload<T>(endpoint: string, formData: FormData, method: string = 'POST'): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('[API CLIENT] Making upload request to:', url);

    const config: RequestInit = {
      method: method,
      headers: {
        ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);