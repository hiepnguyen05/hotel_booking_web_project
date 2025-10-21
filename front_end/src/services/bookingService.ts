import { apiClient } from './api';
import { User } from './authService';
import { Room } from './roomService';
import { apiConfig } from '../config/env';

// Interface cho dữ liệu user được populate từ backend (chỉ có username và email)
interface PopulatedUser {
  _id: string;
  username: string;
  email: string;
}

// Interface cho dữ liệu phòng trong booking
interface BookingRoom {
  _id: string;
  name: string;
  type: string;
  capacity: number;
  status: string;
  images?: string[];
  [key: string]: any; // Allow additional properties
}

// Interface cho yêu cầu hủy phòng
export interface CancellationRequest {
  _id: string;
  booking: string;
  user: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  refundStatus: 'not_requested' | 'pending' | 'completed' | 'failed';
  refundAmount: number;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface cho dữ liệu booking từ backend
export interface Booking {
  _id: string;
  id: string;
  user: string | PopulatedUser; // Có thể là ID hoặc object user đã populate (chỉ username, email)
  room: string | BookingRoom; // Có thể là ID hoặc object room đã populate
  checkInDate: string;
  checkOutDate: string;
  adultCount: number;
  childCount: number;
  roomCount: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  bookingCode: string;
  createdAt: string;
  updatedAt: string;
  momoTransactionId?: string; // Add MoMo transaction ID
  cancellationRequest?: CancellationRequest | null; // Add cancellation request info
  phone?: string; // Add phone field
  email?: string; // Add email field
  fullName?: string; // Add fullName field
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

// Interface cho dữ liệu thanh toán MoMo
export interface MoMoPaymentData {
  bookingId: string;
  returnUrl: string;
  notifyUrl?: string; // Make notifyUrl optional
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
      // Nếu có userId, gọi endpoint admin để lấy bookings của user cụ thể
      // Nếu không có userId, gọi endpoint /bookings/user để lấy bookings của user hiện tại (xác thực qua token)
      const endpoint = userId ? `/admin/bookings?userId=${userId}` : '/bookings/user';
      console.log('Fetching user bookings from endpoint:', endpoint);
      const response = await apiClient.get<{ status: number; message: string; data: Booking[] }>(endpoint);
      console.log('Booking service response:', response);

      if (response.status === 200) {
        console.log('Booking data:', response.data);
        // Map items to ensure id field is present (similar to getAllBookings)
        const bookingsWithId = response.data.map(booking => ({
          ...booking,
          id: booking.id || booking._id
        }));
        return bookingsWithId;
      } else {
        console.error('Failed to fetch bookings, status:', response.status);
        return [];
      }
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

      // Update to match the actual backend response format
      const response = await apiClient.get<{
        items: Booking[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        }
      }>(endpoint);

      // Transform the response to match expected format
      if (response.items) {
        // Map items to ensure id field is present
        const bookingsWithId = response.items.map(booking => ({
          ...booking,
          id: booking.id || booking._id
        }));

        return {
          bookings: bookingsWithId,
          total: response.pagination.total,
          page: response.pagination.page,
          totalPages: response.pagination.pages
        };
      } else {
        return { bookings: [], total: 0, page: 1, totalPages: 1 };
      }
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
      }>(`/admin/bookings/${paymentData.bookingId}/payment`, {
        paymentMethod: paymentData.paymentMethod
      });

      return {
        success: response.status === 200,
        transactionId: response.data?.transactionId
      };
    } catch (error) {
      console.error('Process payment error:', error);
      throw error;
    }
  }

  /**
   * Create cancellation request for booking
   */
  async createCancellationRequest(bookingId: string, reason: string): Promise<CancellationRequest> {
    try {
      console.log('Creating cancellation request with:', { bookingId, reason });

      const response = await apiClient.post<{
        status: number;
        message: string;
        data: CancellationRequest
      }>('/cancellation-requests', {
        bookingId,
        reason
      });

      console.log('Cancellation request response:', response);

      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create cancellation request');
      }
    } catch (error: any) {
      console.error('Create cancellation request error:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        throw new Error(error.response.data?.message || error.response.statusText || 'Failed to create cancellation request');
      }
      throw error;
    }
  }

  /**
   * Get all cancellation requests (admin)
   */
  async getAllCancellationRequests(): Promise<CancellationRequest[]> {
    try {
      console.log('Calling API: /cancellation-requests/admin');
      const response = await apiClient.get<{
        status: number;
        message: string;
        data: CancellationRequest[]
      }>('/cancellation-requests/admin');

      console.log('API Response:', response);
      if (response.status === 200) {
        console.log('Cancellation requests data:', response.data);
        return response.data;
      } else {
        console.error('API Error:', response.message);
        return [];
      }
    } catch (error) {
      console.error('Get cancellation requests error:', error);
      return [];
    }
  }

  /**
   * Update cancellation request status (admin)
   */
  async updateCancellationRequestStatus(requestId: string, status: 'approved' | 'rejected', adminNotes?: string): Promise<CancellationRequest> {
    try {
      const response = await apiClient.put<{
        status: number;
        message: string;
        data: CancellationRequest
      }>(`/cancellation-requests/${requestId}/status`, {
        status,
        adminNotes
      });

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update cancellation request');
      }
    } catch (error) {
      console.error('Update cancellation request status error:', error);
      throw error;
    }
  }

  /**
   * Process refund for cancellation request (admin)
   */
  async processRefund(requestId: string): Promise<CancellationRequest> {
    try {
      const response = await apiClient.post<{
        status: number;
        message: string;
        data: CancellationRequest
      }>(`/cancellation-requests/${requestId}/refund`);

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to process refund');
      }
    } catch (error) {
      console.error('Process refund error:', error);
      throw error;
    }
  }

  /**
   * Check booking payment status
   */
  async checkBookingPaymentStatus(bookingId: string): Promise<any> {
    try {
      // Sử dụng endpoint mới để lấy thông tin booking
      const response: any = await apiClient.get(`/bookings/${bookingId}/payment-status`);

      // Kiểm tra theo đúng format response của backend
      if (response.status === 200) {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: response.message || 'Failed to check booking payment status'
        };
      }
    } catch (error: any) {
      console.error('Check booking payment status error:', error);
      return {
        success: false,
        error: error.message || 'Failed to check booking payment status'
      };
    }
  }

  /**
   * Create MoMo payment for booking
   */
  async createMoMoPayment(paymentData: MoMoPaymentData): Promise<any> {
    try {
      console.log('[BOOKING SERVICE] Creating MoMo payment with data:', paymentData);

      // Call backend API to create MoMo payment
      const response = await apiClient.post<{ status: number; message: string; data?: { payUrl: string } }>(
        `/bookings/${paymentData.bookingId}/momo-payment`,
        {
          returnUrl: paymentData.returnUrl
        }
      );

      console.log('[BOOKING SERVICE] MoMo payment response:', response);

      // Return the payUrl to the caller
      return {
        success: response.status === 200,
        data: response.data
      };
    } catch (error: any) {
      console.error('[BOOKING SERVICE] Create MoMo payment error:', error);
      
      // Special handling for result code 1006
      if (error.response && error.response.data && error.response.data.resultCode === 1006) {
        console.log('[BOOKING SERVICE] Result code 1006: User denied payment confirmation');
        return {
          success: false,
          error: "User denied payment confirmation. Please try again and complete the payment process in MoMo app.",
          resultCode: 1006
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to create MoMo payment'
      };
    }
  }

  /**
   * Test MoMo payment connection
   */
  async testMoMoPayment(): Promise<any> {
    try {
      console.log('[BOOKING SERVICE] Testing MoMo payment connection');

      // Call backend API test route
      const response = await apiClient.post<{ status: number; message: string; data?: { payUrl: string } }>(
        `/bookings/test-momo-payment`,
        {
          test: true
        }
      );

      console.log('[BOOKING SERVICE] Test MoMo payment response:', response);

      // Return the response
      return {
        success: response.status === 200,
        data: response.data
      };
    } catch (error: any) {
      console.error('[BOOKING SERVICE] Test MoMo payment error:', error);
      return {
        success: false,
        error: error.message || 'Failed to test MoMo payment'
      };
    }
  }

  /**
   * Get completed bookings for user
   */
  async getCompletedBookings(): Promise<Booking[]> {
    try {
      console.log('Calling API: /bookings/user/completed');
      const response = await apiClient.get<{
        status: number;
        message: string;
        data: Booking[]
      }>('/bookings/user/completed');

      console.log('API Response:', response);
      if (response.status === 200) {
        console.log('Completed bookings data:', response.data);
        return response.data;
      } else {
        console.error('API Error:', response.message);
        return [];
      }
    } catch (error) {
      console.error('Get completed bookings error:', error);
      return [];
    }
  }

  async getBookingStats(): Promise<{
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    completedBookings: number;
    totalRevenue: number;
    monthlyRevenue: { year: number; month: number; revenue: number; count: number }[];
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
          completedBookings: number;
          totalRevenue: number;
          monthlyRevenue: { year: number; month: number; revenue: number; count: number }[];
        }
      }>('/admin/bookings/stats');

      return response.status === 200 ? response.data : {
        totalBookings: 0,
        confirmedBookings: 0,
        pendingBookings: 0,
        cancelledBookings: 0,
        completedBookings: 0,
        totalRevenue: 0,
        monthlyRevenue: []
      };
    } catch (error) {
      console.error('Get booking stats error:', error);
      return {
        totalBookings: 0,
        confirmedBookings: 0,
        pendingBookings: 0,
        cancelledBookings: 0,
        completedBookings: 0,
        totalRevenue: 0,
        monthlyRevenue: []
      };
    }
  }
}

export const bookingService = new BookingService();