// Get the API base URL from environment variables or use default
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Get full image URL for displaying images from backend
 * @param imagePath - The image path from backend (could be relative or absolute)
 * @returns Full URL to the image
 */
export function getFullImageUrl(imagePath: string): string {
  // If no image path, return placeholder
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1632598024410-3d8f24daab57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTkyMjkwNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
  }

  // If the image path is already a full URL, return it as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If it's a relative path that starts with /uploads, serve it from the base URL without /api
  if (imagePath.startsWith('/uploads')) {
    // Handle case where API_BASE_URL might end with /api or not
    const baseUrlWithoutApi = API_BASE_URL.replace('/api', '');
    // Remove trailing slash if exists and ensure no double slashes
    const cleanBaseUrl = baseUrlWithoutApi.endsWith('/') ? baseUrlWithoutApi.slice(0, -1) : baseUrlWithoutApi;
    // Ensure imagePath starts with /
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${cleanBaseUrl}${cleanPath}`;
  }

  // For other relative paths, prepend the API base URL
  // Remove leading slash if it exists to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  // Ensure API_BASE_URL doesn't end with a slash
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Get optimized image URL with quality parameters
 * @param imagePath - The image path from backend
 * @param width - Desired width (optional)
 * @param height - Desired height (optional)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(imagePath: string, width?: number, height?: number): string {
  const baseUrl = getFullImageUrl(imagePath);

  // If it's a placeholder or external URL, return as is
  if (!imagePath || imagePath.startsWith('http') || !imagePath.startsWith('/uploads')) {
    return baseUrl;
  }

  // For local uploads, we can't add query parameters for optimization
  // The optimization should be done on the server side
  return baseUrl;
}