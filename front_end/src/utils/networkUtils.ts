// Utility functions for network-related operations

// Define the type for import.meta.env
interface ImportMetaEnv {
  MODE?: string;
  VITE_API_BASE_URL?: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env?: ImportMetaEnv;
}

// Access log storage
const accessLogs: any[] = [];

/**
 * Log access information
 */
export function logAccess(info: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...info
  };
  
  accessLogs.push(logEntry);
  console.log('[Frontend Access Log]', logEntry);
  
  // Keep only the last 100 logs to prevent memory issues
  if (accessLogs.length > 100) {
    accessLogs.shift();
  }
}

/**
 * Get recent access logs
 */
export function getAccessLogs() {
  return [...accessLogs];
}

/**
 * Check if we're using ngrok
 */
export function isUsingNgrok(): boolean {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    return origin.includes('.ngrok.io') || origin.includes('.ngrok.app') || origin.includes('.ngrok-free.dev');
  }
  return false;
}

/**
 * Get the local IP address of the current machine
 * Note: This function works in development environment with proper permissions
 * In production, this may not work due to browser security restrictions
 */
export async function getLocalIPAddress(): Promise<string | null> {
  try {
    // This is a trick to get the local IP address
    // It creates a connection to a remote address (but doesn't send data)
    // and gets the local IP address used for that connection
    const socket = new WebSocket('ws://localhost:80');
    
    // We can't actually get the IP this way in browsers due to security restrictions
    // So we'll return null and rely on environment variables or server-provided IP
    socket.close();
    return null;
  } catch (error) {
    console.warn('Could not determine local IP address:', error);
    return null;
  }
}

/**
 * Get API base URL based on environment
 * In development, it will try to use the local network IP if available
 * In production, it uses the deployed URL
 */
export function getApiBaseUrl(): string {
  // Check if we're running in development
  // @ts-ignore: import.meta.env is not properly typed in TypeScript
  const isDevelopment = import.meta.env?.MODE === 'development';
  
  // Check if we're using ngrok
  const usingNgrok = isUsingNgrok();
  
  // If we have a specific API base URL in environment variables, use it
  // @ts-ignore: import.meta.env is not properly typed in TypeScript
  if (import.meta.env?.VITE_API_BASE_URL) {
    // @ts-ignore: import.meta.env is not properly typed in TypeScript
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In development with ngrok, construct URLs appropriately
  if (isDevelopment && usingNgrok) {
    if (typeof window !== 'undefined') {
      const frontendOrigin = window.location.origin;
      // Replace frontend port (3000) with backend port (5000)
      const backendOrigin = frontendOrigin.replace(':3000', ':5000');
      return `${backendOrigin}/api`;
    }
  }
  
  // In development, try to construct a network-accessible URL
  if (isDevelopment) {
    // If we're accessing the frontend via IP, use the same IP for backend
    if (typeof window !== 'undefined') {
      const frontendOrigin = window.location.origin;
      // Replace frontend port (3000) with backend port (5000)
      const backendOrigin = frontendOrigin.replace(':3000', ':5000');
      return `${backendOrigin}/api`;
    }
    
    // Default to localhost if we can't determine the IP
    return 'http://localhost:5000/api';
  }
  
  // In production, you would typically use the deployed backend URL
  // This is just a placeholder - replace with your actual production API URL
  return '/api';
}

/**
 * Get the full URL for accessing the app from other devices
 * This is useful for displaying to users
 */
export function getNetworkAccessUrl(): string {
  if (typeof window !== 'undefined') {
    // In browser environment
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // If we're already accessing via IP (not localhost), return current URL
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.startsWith('172.16')) {
      return `${protocol}//${hostname}${port ? ':' + port : ''}`;
    }
    
    // If we're on localhost or 172.16.x.x, we can't easily determine the network IP from browser
    // User would need to check the backend console output
    return 'Check backend console for network access URL';
  }
  
  // In server environment (Node.js)
  return 'http://localhost:3000'; // Default Vite port
}

/**
 * Get network IP from backend API
 */
export async function getNetworkIP(): Promise<string> {
  try {
    // Try to get IP from backend
    const response = await fetch('/api/bookings/network-ip');
    if (response.ok) {
      const data = await response.json();
      return data.ip;
    }
  } catch (error) {
    console.error('Failed to get network IP from backend:', error);
  }
  
  // Fallback to window location hostname
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  
  // Final fallback
  return 'localhost';
}

export default {
  logAccess,
  getAccessLogs,
  isUsingNgrok,
  getLocalIPAddress,
  getApiBaseUrl,
  getNetworkAccessUrl,
  getNetworkIP
};