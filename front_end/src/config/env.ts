import { getApiBaseUrl } from '../utils/networkUtils';

// Environment configuration
export const env = {
  // API Configuration - automatically determined based on environment
  API_BASE_URL: getApiBaseUrl(),
  
  // App Configuration
  APP_NAME: 'Luxury Beach Resort',
  APP_VERSION: '1.0.0',
  NODE_ENV: (import.meta as any).env?.VITE_NODE_ENV || 'production',
  
  // Upload Configuration
  MAX_FILE_SIZE: 5242880, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Payment Configuration
  PAYMENT_GATEWAY_URL: 'https://sandbox-payment.example.com',
  PAYMENT_PUBLIC_KEY: 'pk_test_example_key',
  
  // External Services
  GOOGLE_MAPS_API_KEY: '',
  GA_TRACKING_ID: '',
  
  // Feature Flags
  ENABLE_ANALYTICS: false,
  ENABLE_MAPS: false,
  ENABLE_PAYMENT: true,
  
  // Development
  isDevelopment: (import.meta as any).env?.VITE_NODE_ENV === 'development',
  isProduction: (import.meta as any).env?.VITE_NODE_ENV === 'production',
} as const;

// Export individual configs for convenience
export const apiConfig = {
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  retries: 3
};

export const uploadConfig = {
  maxFileSize: env.MAX_FILE_SIZE,
  allowedTypes: env.ALLOWED_FILE_TYPES,
  maxFiles: 10
};

export const paymentConfig = {
  gatewayURL: env.PAYMENT_GATEWAY_URL,
  publicKey: env.PAYMENT_PUBLIC_KEY,
  currency: 'VND',
  locale: 'vi-VN'
};