import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useParams } from 'react-router-dom';

export function BookingsPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Nếu có id (truy cập chi tiết đặt phòng), chuyển hướng đến tab đặt phòng trong trang tài khoản
    if (id) {
      navigate(`/user/account?tab=bookings&bookingId=${id}`);
    } else {
      // Nếu không có id (truy cập danh sách đặt phòng), chuyển hướng đến tab đặt phòng trong trang tài khoản
      navigate('/user/account?tab=bookings');
    }
  }, [isAuthenticated, id, navigate]);

  // Component này chỉ dùng để chuyển hướng, không cần render gì
  return null;
}