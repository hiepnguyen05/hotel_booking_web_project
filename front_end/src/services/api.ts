import { getApiBaseUrl } from '../utils/networkUtils';

// API Configuration - automatically determined based on environment
const API_BASE_URL = getApiBaseUrl();
console.log('[API CLIENT] Base URL:', API_BASE_URL);

// Validate the base URL
if (!API_BASE_URL || API_BASE_URL === 'your_api_base_url_here') {
  console.error('[API CLIENT] Invalid base URL detected:', API_BASE_URL);
  // Use a fallback URL
  const fallbackUrl = 'https://hotel-booking-web-project.onrender.com/api';
  console.log('[API CLIENT] Using fallback URL:', fallbackUrl);
}

// API Client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    // Validate the base URL
    if (!baseURL || baseURL === 'your_api_base_url_here') {
      console.warn('[API CLIENT] Invalid base URL, using fallback');
      this.baseURL = 'https://hotel-booking-web-project.onrender.com/api';
    } else {
      this.baseURL = baseURL;
    }
    console.log('[API CLIENT] Initialized with base URL:', this.baseURL);
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
    // Validate endpoint
    if (!endpoint) {
      throw new Error('Endpoint is required');
    }
    
    const url = `${this.baseURL}${endpoint}`;
    console.log('[API CLIENT] Making request to:', url);

    // Check if URL is valid
    if (url.includes('your_api_base_url_here')) {
      console.error('[API CLIENT] Invalid URL detected:', url);
      throw new Error('Invalid API base URL configuration');
    }

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
    // Validate endpoint
    if (!endpoint) {
      throw new Error('Endpoint is required');
    }
    
    const url = `${this.baseURL}${endpoint}`;
    console.log('[API CLIENT] Making upload request to:', url);

    // Check if URL is valid
    if (url.includes('your_api_base_url_here')) {
      console.error('[API CLIENT] Invalid URL detected:', url);
      throw new Error('Invalid API base URL configuration');
    }

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
const finalBaseUrl = API_BASE_URL && API_BASE_URL !== 'your_api_base_url_here' 
  ? API_BASE_URL 
  : 'https://hotel-booking-web-project.onrender.com/api';
  
export const apiClient = new ApiClient(finalBaseUrl);