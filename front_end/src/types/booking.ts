export interface Booking {
  _id: string;
  id: string;
  user: string | any; // User ID or User object
  room: string | any; // Room ID or Room object
  checkInDate: string;
  checkOutDate: string;
  adultCount: number;
  childCount: number;
  roomCount: number;
  totalPrice: number;
  tax: number;
  serviceFee: number;
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
  paymentMethod: 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  momoTransactionId?: string;
  momoReturnUrl?: string;
  bookingCode: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  cancellationPolicy?: string;
  cancellationRequest?: CancellationRequest | null;
  createdAt: string;
  updatedAt: string;
}

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

export interface CreateBookingData {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  adultCount: number;
  childCount: number;
  notes?: string;
}

export interface MoMoPaymentData {
  bookingId: string;
  returnUrl: string;
}