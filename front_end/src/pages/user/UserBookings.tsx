import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Calendar, MapPin, Users, Clock, CreditCard, Image as ImageIcon } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function UserBookings() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { userBookings, isLoading, error, fetchUserBookings, cancelBooking } = useBookingStore();

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user, fetchUserBookings]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Đã xác nhận</Badge>;
      case 'pending':
        return <Badge variant="secondary">Chờ xác nhận</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Hoàn thành</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Đã thanh toán</Badge>;
      case 'pending':
        return <Badge variant="secondary">Chờ thanh toán</Badge>;
      case 'failed':
        return <Badge variant="destructive">Thanh toán thất bại</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Đã hoàn tiền</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) {
      const success = await cancelBooking(bookingId);
      if (success) {
        alert('Hủy đặt phòng thành công!');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách đặt phòng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => fetchUserBookings()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Đặt phòng của tôi</h1>
        <p className="text-gray-600">Quản lý và theo dõi các đặt phòng của bạn</p>
      </div>

      {/* Bookings List */}
      {userBookings.length > 0 ? (
        <div className="space-y-6">
          {userBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  {/* Room Image and Info */}
                  <div className="flex gap-4">
                    {booking.room?.images && booking.room.images.length > 0 ? (
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={`http://localhost:5000${booking.room.images[0]}`}
                          alt={booking.room.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    
                    <div>
                      <CardTitle className="text-xl">
                        {booking.room?.name || `Phòng ${booking.roomId}`}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4" />
                        Đặt ngày: {formatDate(booking.createdAt)}
                      </CardDescription>
                    </div>
                  </div>
                  
                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(booking.status)}
                    {getPaymentStatusBadge(booking.paymentStatus)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Check-in</p>
                      <p className="font-medium">{formatDate(booking.checkIn)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Check-out</p>
                      <p className="font-medium">{formatDate(booking.checkOut)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Số khách</p>
                      <p className="font-medium">{booking.adults + booking.children} người</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Số đêm</p>
                      <p className="font-medium">{booking.nights} đêm</p>
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Yêu cầu đặc biệt:</p>
                    <p className="text-sm">{booking.notes}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {booking.status === 'pending' && (
                      <Button
                        variant="outline"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Hủy đặt phòng
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/user/booking/${booking.id}/details`)}
                    >
                      Xem chi tiết
                    </Button>
                    
                    {booking.status === 'confirmed' && booking.paymentStatus === 'paid' && (
                      <Button
                        onClick={() => navigate(`/rooms/${booking.roomId}`)}
                      >
                        Đặt lại
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chưa có đặt phòng nào</h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đặt phòng nào. Hãy khám phá các phòng đẹp của chúng tôi!
            </p>
            <Button onClick={() => navigate('/rooms')}>
              Khám phá phòng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}