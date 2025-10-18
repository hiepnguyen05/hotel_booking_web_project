import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Users, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';
import { Booking } from '../services/bookingService';

interface BookingCardProps {
  booking: Booking;
}

// Status badge component
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã xác nhận</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ xử lý</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã hủy</Badge>;
    case 'completed':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Đã hoàn thành</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export function BookingCard({ booking }: BookingCardProps) {
  const navigate = useNavigate();
  const { cancelBooking, fetchUserBookings } = useBookingStore();

  const handleCancelBooking = async () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) {
      const success = await cancelBooking(booking.id || (booking as any)._id);
      if (success) {
        alert('Đã gửi yêu cầu hủy đặt phòng thành công!');
        // Refresh the bookings list
        fetchUserBookings();
      } else {
        alert('Không thể hủy đặt phòng. Vui lòng thử lại sau.');
      }
    }
  };

  // Get room name and images
  const roomName = booking.room && typeof booking.room === 'object' ? (booking.room as any).name : 'Phòng không xác định';
  const roomImages = booking.room && typeof booking.room === 'object' && (booking.room as any).images ? (booking.room as any).images : [];

  // Handle image URL - if it's a relative path, prepend with API base URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    // If it's already an absolute URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // If it's a relative path that starts with /uploads, serve it from the base URL without /api
    const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || 'https://hotel-booking-web-project.onrender.com/api';
    if (imagePath.startsWith('/uploads')) {
      // Handle case where baseUrl might end with /api or not
      const baseUrlWithoutApi = baseUrl.replace('/api', '');
      // Remove trailing slash if exists and ensure no double slashes
      const cleanBaseUrl = baseUrlWithoutApi.endsWith('/') ? baseUrlWithoutApi.slice(0, -1) : baseUrlWithoutApi;
      // Ensure imagePath starts with /
      const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      return `${cleanBaseUrl}${cleanPath}`;
    }
    // For other relative paths, prepend with API base URL
    return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row">
        {/* Room Image - Left side */}
        <div className="md:w-1/3">
          <div className="h-full">
            {roomImages && roomImages.length > 0 ? (
              <img
                src={getImageUrl(roomImages[0])}
                alt={roomName}
                className="w-full h-48 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-48 md:h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 mx-auto" />
                  <p className="mt-2 text-gray-500 text-xs">Không có ảnh</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Details - Right side */}
        <div className="md:w-2/3 p-4">
          <div className="flex flex-col h-full">
            <div className="flex-grow">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                  {roomName}
                </h3>
                {getStatusBadge(booking.status || 'pending')}
              </div>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Mã:</span> #{booking.bookingCode || 'N/A'}
              </p>
              <p className="text-gray-600 text-sm mb-3">
                <span className="font-medium">Ngày đặt:</span> {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span className="text-xs">
                    {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('vi-VN') : 'N/A'} -
                    {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Users className="h-3 w-3 mr-1" />
                  <span className="text-xs">
                    {((booking.adultCount || 0) + (booking.childCount || 0))} khách
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <CreditCard className="h-3 w-3 mr-1" />
                  <span className="text-xs">
                    {booking.paymentStatus === 'paid' ? (
                      <span className="text-green-600">Đã thanh toán</span>
                    ) : booking.paymentStatus === 'pending' ? (
                      <span className="text-yellow-600">Chưa thanh toán</span>
                    ) : (
                      <span className="text-red-600">Không thành công</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <span className="text-xs font-medium">
                    {booking.roomCount || 0} phòng
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <p className="font-bold text-lg text-primary">
                {(booking.totalPrice || 0).toLocaleString('vi-VN')}₫
              </p>
              <div className="flex gap-2">
                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50 text-xs h-8"
                    onClick={handleCancelBooking}
                  >
                    Hủy
                  </Button>
                )}
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => navigate(`/user/booking/${booking.id || (booking as any)._id}`)}
                >
                  Xem chi tiết
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}