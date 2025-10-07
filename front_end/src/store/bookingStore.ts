import { create } from 'zustand';
import { bookingService, Booking, CreateBookingData, BookingSearchParams, PaymentData } from '../services/bookingService';

interface BookingState {
  bookings: Booking[];
  userBookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  stats: {
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    monthlyRevenue: number;
  };
  
  // Actions
  createBooking: (bookingData: CreateBookingData) => Promise<Booking | null>;
  fetchUserBookings: (userId?: string) => Promise<void>;
  fetchAllBookings: (params?: BookingSearchParams) => Promise<void>;
  fetchBookingById: (id: string) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<boolean>;
  cancelBooking: (id: string) => Promise<boolean>;
  processPayment: (paymentData: PaymentData) => Promise<{ success: boolean; transactionId?: string }>;
  fetchBookingStats: () => Promise<void>;
  clearError: () => void;
  setSelectedBooking: (booking: Booking | null) => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  userBookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,
  stats: {
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  },

  createBooking: async (bookingData: CreateBookingData) => {
    set({ isLoading: true, error: null });
    
    try {
      const newBooking = await bookingService.createBooking(bookingData);
      
      if (newBooking) {
        const currentUserBookings = get().userBookings;
        set({
          userBookings: [newBooking, ...currentUserBookings],
          selectedBooking: newBooking,
          isLoading: false
        });
        return newBooking;
      }
      
      set({ isLoading: false });
      return null;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi tạo đặt phòng',
        isLoading: false
      });
      return null;
    }
  },

  fetchUserBookings: async (userId?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const bookings = await bookingService.getUserBookings(userId);
      
      set({
        userBookings: bookings,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi tải danh sách đặt phòng',
        isLoading: false
      });
    }
  },

  fetchAllBookings: async (params?: BookingSearchParams) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await bookingService.getAllBookings(params);
      
      set({
        bookings: result.bookings,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi tải danh sách đặt phòng',
        isLoading: false
      });
    }
  },

  fetchBookingById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const booking = await bookingService.getBookingById(id);
      
      set({
        selectedBooking: booking,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi tải thông tin đặt phòng',
        isLoading: false
      });
    }
  },

  updateBookingStatus: async (id: string, status: Booking['status']) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedBooking = await bookingService.updateBookingStatus(id, status);
      
      if (updatedBooking) {
        const currentBookings = get().bookings;
        const updatedBookings = currentBookings.map(booking => 
          booking.id === id ? updatedBooking : booking
        );
        
        const currentUserBookings = get().userBookings;
        const updatedUserBookings = currentUserBookings.map(booking => 
          booking.id === id ? updatedBooking : booking
        );
        
        set({
          bookings: updatedBookings,
          userBookings: updatedUserBookings,
          selectedBooking: get().selectedBooking?.id === id ? updatedBooking : get().selectedBooking,
          isLoading: false
        });
        return true;
      }
      
      set({ isLoading: false });
      return false;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi cập nhật trạng thái đặt phòng',
        isLoading: false
      });
      return false;
    }
  },

  cancelBooking: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const success = await bookingService.cancelBooking(id);
      
      if (success) {
        const currentBookings = get().bookings;
        const updatedBookings = currentBookings.map(booking => 
          booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
        );
        
        const currentUserBookings = get().userBookings;
        const updatedUserBookings = currentUserBookings.map(booking => 
          booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
        );
        
        set({
          bookings: updatedBookings,
          userBookings: updatedUserBookings,
          isLoading: false
        });
        return true;
      }
      
      set({ isLoading: false });
      return false;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi hủy đặt phòng',
        isLoading: false
      });
      return false;
    }
  },

  processPayment: async (paymentData: PaymentData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await bookingService.processPayment(paymentData);
      
      if (result.success) {
        // Update booking payment status
        const currentUserBookings = get().userBookings;
        const updatedUserBookings = currentUserBookings.map(booking => 
          booking.id === paymentData.bookingId 
            ? { ...booking, paymentStatus: 'paid' as const, status: 'confirmed' as const }
            : booking
        );
        
        set({
          userBookings: updatedUserBookings,
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
      
      return result;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi xử lý thanh toán',
        isLoading: false
      });
      return { success: false };
    }
  },

  fetchBookingStats: async () => {
    try {
      const stats = await bookingService.getBookingStats();
      set({ stats });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi tải thống kê đặt phòng'
      });
    }
  },

  clearError: () => set({ error: null }),

  setSelectedBooking: (booking: Booking | null) => set({ selectedBooking: booking })
}));





