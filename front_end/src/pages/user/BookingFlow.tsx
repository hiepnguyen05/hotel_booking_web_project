import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { BookingPage } from '../../components/user/BookingPage';
import { BookingConfirmation } from '../../components/user/BookingConfirmation';
import { useAuthStore } from '../../store/authStore';

export function BookingFlow() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [booking, setBooking] = useState(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookingComplete = (bookingData: any) => {
    setBooking(bookingData);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleViewAccount = () => {
    navigate('/user/bookings');
  };

  if (booking) {
    return (
      <BookingConfirmation
        booking={booking}
        onBackToHome={handleBackToHome}
        onViewAccount={handleViewAccount}
      />
    );
  }

  if (!roomId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Không tìm thấy thông tin phòng</h2>
          <Button onClick={handleBack}>Quay lại</Button>
        </div>
      </div>
    );
  }

  // Ensure roomId is not empty
  if (!roomId.trim()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Không tìm thấy thông tin phòng</h2>
          <p className="text-gray-600 mb-4">ID phòng không hợp lệ.</p>
          <Button onClick={handleBack}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <BookingPage
      roomId={roomId}
      user={user}
      onBack={handleBack}
      onBookingComplete={handleBookingComplete}
    />
  );
}
