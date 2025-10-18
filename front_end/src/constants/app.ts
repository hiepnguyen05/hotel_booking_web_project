// Application constants
export const APP_NAME = 'NgocHiepHotel';
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://hotel-booking-web-project.onrender.com/api';

// Date and time formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Image paths
export const DEFAULT_ROOM_IMAGE = '/images/rooms/default-room.jpg';
export const DEFAULT_USER_AVATAR = '/images/users/default-avatar.png';

// Local storage keys
export const AUTH_TOKEN_KEY = 'authToken';
export const USER_INFO_KEY = 'userInfo';

// Role constants
export const ROLE_ADMIN = 'admin';
export const ROLE_USER = 'user';

// Booking statuses
export const BOOKING_STATUS_PENDING = 'pending';
export const BOOKING_STATUS_CONFIRMED = 'confirmed';
export const BOOKING_STATUS_CANCELLED = 'cancelled';
export const BOOKING_STATUS_COMPLETED = 'completed';

// Payment methods
export const PAYMENT_METHOD_MOMO = 'momo';
export const PAYMENT_METHOD_CASH = 'cash';

// Room statuses
export const ROOM_STATUS_AVAILABLE = 'available';
export const ROOM_STATUS_OCCUPIED = 'occupied';
export const ROOM_STATUS_MAINTENANCE = 'maintenance';