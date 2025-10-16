// Get the API base URL from environment variables or use default
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Helper function to get full image URL from relative path
 * @param imagePath - Relative image path (e.g., /uploads/rooms/filename.jpg)
 * @returns Full image URL
 */
export function getFullImageUrl(imagePath: string): string {
  // If imagePath is already a full URL, return it as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If imagePath is a relative path starting with /uploads, prepend base URL without /api
  if (imagePath.startsWith('/uploads')) {
    // Remove /api from the end of API_BASE_URL if it exists
    const baseUrlWithoutApi = API_BASE_URL.replace(/\/api$/, '');
    return `${baseUrlWithoutApi}${imagePath}`;
  }

  // If imagePath is a relative path, prepend API base URL
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }

  // If imagePath is a relative path without leading slash, add it
  return `${API_BASE_URL}/${imagePath}`;
}

/**
 * Helper function to get full image URL for room images
 * @param image - Image path or full URL
 * @returns Full image URL
 */
export function getRoomImageUrl(image: string): string {
  return getFullImageUrl(image);
}