import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { BookingForm } from '../../features/booking/components/BookingForm';
import { useAuthStore } from '../../store/authStore';

export function BookingFlow() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [booking, setBooking] = useState(null);
  
  // Get search parameters from router state if available
  const searchParams = location.state as { 
    checkIn?: string; 
    checkOut?: string; 
    adults?: number; 
    children?: number 
  } || {};
  
  // Log received parameters for debugging
  useEffect(() => {
    console.log('BookingFlow received parameters:', {
      roomId,
      searchParams,
      locationState: location.state
    });
  }, [roomId, searchParams, location.state]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookingComplete = (bookingData: any) => {
    setBooking(bookingData);
    // Navigate to payment page with booking data
    navigate(`/user/bookings/${bookingData._id}/payment`, { 
      state: { booking: bookingData } 
    });
  };

  if (!roomId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy thông tin phòng</p>
          <Button 
            variant="default"
            size="default"
            className="mt-4"
            onClick={() => navigate('/')}
          >
            Quay về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <BookingForm
          roomId={roomId}
          user={user}
          onBack={handleBack}
          onBookingComplete={handleBookingComplete}
          checkInDate={searchParams.checkIn}
          checkOutDate={searchParams.checkOut}
          adults={searchParams.adults}
          children={searchParams.children}
        />
      </div>
    </div>
  );
}