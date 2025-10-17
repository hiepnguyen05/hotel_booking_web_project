import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import { BookingForm } from '../components/BookingForm';

export function BookingPage() {
  const navigate = useNavigate();
  const { id: roomId } = useParams();
  const location = useLocation();
  const { user } = useAuthStore();
  
  // Lấy thông tin từ state nếu có
  const { checkInDate, checkOutDate, adults, children } = location.state || {};
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleBookingComplete = (booking: any) => {
    // Chuyển đến trang xác nhận đặt phòng
    navigate('/payment-result', { 
      state: { 
        booking,
        fromBooking: true
      } 
    });
  };

  // Kiểm tra nếu không có roomId thì quay lại
  useEffect(() => {
    if (!roomId) {
      navigate('/');
    }
  }, [roomId, navigate]);

  if (!roomId) {
    return null;
  }

  return (
    <BookingForm
      roomId={roomId}
      user={user}
      onBack={handleBack}
      onBookingComplete={handleBookingComplete}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      adults={adults}
      children={children}
    />
  );
}