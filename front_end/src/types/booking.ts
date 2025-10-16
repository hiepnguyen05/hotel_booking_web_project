export interface Booking {
  _id: string;
  user: string | any; // User ID or User object
  room: string | any; // Room ID or Room object
  checkInDate: string;
  checkOutDate: string;
  adultCount: number;
  childCount: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentMethod: 'momo' | 'cash';
  bookingCode: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  adultCount: number;
  childCount: number;
  specialRequests?: string;
}

export interface MoMoPaymentData {
  bookingId: string;
  returnUrl: string;
}