// Environment configuration
export const env = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Luxury Beach Resort',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  
  // Upload Configuration
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880'), // 5MB
  ALLOWED_FILE_TYPES: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  
  // Payment Configuration
  PAYMENT_GATEWAY_URL: import.meta.env.VITE_PAYMENT_GATEWAY_URL || 'https://sandbox-payment.example.com',
  PAYMENT_PUBLIC_KEY: import.meta.env.VITE_PAYMENT_PUBLIC_KEY || 'pk_test_example_key',
  
  // External Services
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID || '',
  
  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_MAPS: import.meta.env.VITE_ENABLE_MAPS === 'true',
  ENABLE_PAYMENT: import.meta.env.VITE_ENABLE_PAYMENT !== 'false', // Default to true
  
  // Development
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Validation
export const validateEnv = () => {
  const requiredVars = [
    'VITE_API_BASE_URL'
  ];
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }
  
  return missing.length === 0;
};

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





