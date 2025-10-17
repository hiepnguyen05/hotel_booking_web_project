import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { CheckCircle, Calendar, Users, MapPin, Phone, Mail, Download, Home, User, CreditCard } from "lucide-react";

interface BookingConfirmationProps {
  booking: any;
  onBackToHome: () => void;
  onViewAccount: () => void;
}

export function BookingConfirmation({ booking, onBackToHome, onViewAccount }: BookingConfirmationProps) {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Get payment method label
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'direct': return 'Thanh toán tại khách sạn';
      case 'online': return 'Thanh toán trực tuyến';
      default: return method;
    }
  };

  // Get payment status label
  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'pending': return 'Chờ thanh toán';
      case 'failed': return 'Thanh toán thất bại';
      case 'refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  };

  // Get payment status badge variant
  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl text-green-600">Đặt phòng thành công!</CardTitle>
            <p className="text-gray-600">Cảm ơn bạn đã chọn NgocHiepHotel</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking ID */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">Mã đặt phòng của bạn</p>
              <p className="text-2xl font-bold text-green-800">{booking.id || booking._id || 'BK001'}</p>
            </div>

            {/* Hotel Info */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">NgocHiepHotel</h3>
              <p className="text-gray-600 flex items-center justify-center">
                <MapPin className="h-4 w-4 mr-1" />
                123 Đường Biển, Thành phố Nha Trang, Khánh Hòa
              </p>
            </div>

            <Separator />

            {/* Booking Details */}
            <div>
              <h4 className="font-semibold mb-4">Chi tiết đặt phòng</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Phòng</p>
                    <p className="font-medium">{booking.room?.name || booking.roomName || 'Phòng Deluxe'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Khách hàng</p>
                    <p className="font-medium flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {booking.fullName || booking.user?.name || 'Nguyễn Văn A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Khách</p>
                    <p className="font-medium">
                      {booking.adults || booking.adultCount || 2} người lớn, {booking.children || booking.childCount || 0} trẻ em
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(booking.checkInDate || booking.checkIn || new Date().toISOString())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(booking.checkOutDate || booking.checkOut || new Date(Date.now() + 86400000).toISOString())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số đêm</p>
                    <p className="font-medium">{booking.nights || 1} đêm</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Info */}
            <div>
              <h4 className="font-semibold mb-4">Thông tin thanh toán</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Tổng tiền</span>
                  <span className="text-xl font-bold text-primary">
                    {(booking.totalAmount || booking.totalPrice || booking.total || 0).toLocaleString('vi-VN')}₫
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phương thức</span>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>{getPaymentMethodLabel(booking.paymentMethod || 'direct')}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Trạng thái</span>
                  <Badge className={getPaymentStatusVariant(booking.paymentStatus || 'pending')}>
                    {getPaymentStatusLabel(booking.paymentStatus || 'pending')}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Thông tin liên hệ</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Hotline: 1900-1000 (24/7)
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email: booking@ngochiepotel.vn
                </p>
              </div>
            </div>

            {/* Important Notes */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h5 className="font-semibold text-blue-900 mb-2">Lưu ý quan trọng:</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Check-in: 14:00 | Check-out: 12:00</li>
                <li>• Vui lòng mang theo CMND/CCCD khi check-in</li>
                <li>• Email xác nhận đã được gửi đến {booking.email || booking.user?.email || 'email@example.com'}</li>
                <li>• Miễn phí hủy phòng trước 24h check-in</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3">
              <Button 
                onClick={onViewAccount}
                variant="outline" 
                className="flex-1"
              >
                <Users className="h-4 w-4 mr-2" />
                Xem lịch sử đặt phòng
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Tải xuống
              </Button>
              <Button 
                onClick={onBackToHome}
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Về trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}