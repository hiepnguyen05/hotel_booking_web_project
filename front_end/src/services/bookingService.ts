import { apiClient } from './api';
import { User } from './authService';
import { Room } from './roomService';

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  nights: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  room?: Room;
}

export interface CreateBookingData {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  adultCount: number;
  childCount: number;
  roomCount: number;
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
  paymentMethod: 'direct' | 'online';
}

export interface BookingSearchParams {
  status?: string;
  paymentStatus?: string;
  userId?: string;
  roomId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaymentData {
  bookingId: string;
  paymentMethod: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
}

class BookingService {
  async createBooking(bookingData: CreateBookingData): Promise<Booking | null> {
    try {
      const response = await apiClient.post<{ status: number; message: string; data?: Booking }>('/bookings', bookingData);
      // Fix: Handle the correct backend response format
      return response.status === 201 ? response.data || null : null;
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  }

  async getUserBookings(userId?: string): Promise<Booking[]> {
    try {
      const endpoint = userId ? `/bookings/user/${userId}` : '/bookings/my';
      const response = await apiClient.get<{ status: number; message: string; data: Booking[] }>(endpoint);
      return response.status === 200 ? response.data : [];
    } catch (error) {
      console.error('Get user bookings error:', error);
      return [];
    }
  }

  async getAllBookings(params?: BookingSearchParams): Promise<{ bookings: Booking[]; total: number; page: number; totalPages: number }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/admin/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<{ 
        status: number; 
        message: string; 
        data: { 
          bookings: Booking[]; 
          total: number; 
          page: number; 
          totalPages: number; 
        } 
      }>(endpoint);
      
      return response.status === 200 ? response.data : { bookings: [], total: 0, page: 1, totalPages: 1 };
    } catch (error) {
      console.error('Get all bookings error:', error);
      return { bookings: [], total: 0, page: 1, totalPages: 1 };
    }
  }

  async getBookingById(id: string): Promise<Booking | null> {
    try {
      const response = await apiClient.get<{ status: number; message: string; data: Booking }>(`/bookings/${id}`);
      return response.status === 200 ? response.data : null;
    } catch (error) {
      console.error('Get booking by ID error:', error);
      return null;
    }
  }

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | null> {
    try {
      const response = await apiClient.put<{ status: number; message: string; data: Booking }>(`/admin/bookings/${id}/status`, { status });
      return response.status === 200 ? response.data : null;
    } catch (error) {
      console.error('Update booking status error:', error);
      throw error;
    }
  }

  async cancelBooking(id: string): Promise<boolean> {
    try {
      const response = await apiClient.put<{ status: number; message: string }>(`/bookings/${id}/cancel`);
      return response.status === 200;
    } catch (error) {
      console.error('Cancel booking error:', error);
      throw error;
    }
  }

  async processPayment(paymentData: PaymentData): Promise<{ success: boolean; transactionId?: string }> {
    try {
      const response = await apiClient.post<{ 
        status: number; 
        message: string; 
        data: { transactionId: string } 
      }>('/bookings/payment', paymentData);
      
      return {
        success: response.status === 200,
        transactionId: response.data?.transactionId
      };
    } catch (error) {
      console.error('Process payment error:', error);
      throw error;
    }
  }

  async getBookingStats(): Promise<{
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    monthlyRevenue: number;
  }> {
    try {
      const response = await apiClient.get<{ 
        status: number; 
        message: string; 
        data: {
          totalBookings: number;
          confirmedBookings: number;
          pendingBookings: number;
          cancelledBookings: number;
          totalRevenue: number;
          monthlyRevenue: number;
        }
      }>('/admin/bookings/stats');
      
      return response.status === 200 ? response.data : {
        totalBookings: 0,
        confirmedBookings: 0,
        pendingBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        monthlyRevenue: 0
      };
    } catch (error) {
      console.error('Get booking stats error:', error);
      return {
        totalBookings: 0,
        confirmedBookings: 0,
        pendingBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        monthlyRevenue: 0
      };
    }
  }
}

export const bookingService = new BookingService();
