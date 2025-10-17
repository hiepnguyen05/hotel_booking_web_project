import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle, Calendar, Users, CreditCard, Home } from 'lucide-react';
import { toast } from 'sonner';

interface BookingSuccessProps {
  onBackToHome: () => void;
  onViewAccount: () => void;
}

export function BookingSuccess({ onBackToHome, onViewAccount }: BookingSuccessProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.bookingConfirmation;
  const message = location.state?.message;

  useEffect(() => {
    // Hiển thị toast thông báo thành công nếu có message
    if (message) {
      toast.success(message);
    }
    
    // Nếu không có thông tin booking, chuyển về trang chủ
    if (!booking) {
      navigate('/');
    }
  }, [booking, message, navigate]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin đặt phòng</h2>
          <Button variant="default" size="default" onClick={onBackToHome} className="">Quay về trang chủ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold text-green-600">
                Đặt phòng thành công!
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Cảm ơn bạn đã đặt phòng tại Luxury Beach Resort
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Thông tin đặt phòng</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Mã đặt phòng</p>
                  <p className="font-medium">{booking.bookingCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <p className="font-medium text-green-600">Đã xác nhận</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày đặt</p>
                  <p className="font-medium">
                    {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng tiền</p>
                  <p className="font-medium">
                    {(booking.totalPrice || booking.total).toLocaleString('vi-VN')}₫
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Thông tin phòng
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phòng</span>
                  <span className="font-medium">{booking.roomName || 'Phòng Deluxe'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày nhận phòng</span>
                  <span className="font-medium">
                    {new Date(booking.checkInDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày trả phòng</span>
                  <span className="font-medium">
                    {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số đêm</span>
                  <span className="font-medium">{booking.nights || 1} đêm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số lượng khách</span>
                  <span className="font-medium">
                    {booking.adultCount || 2} người lớn, {booking.childCount || 0} trẻ em
                  </span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Thông tin thanh toán
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức</span>
                  <span className="font-medium">Thanh toán trực tuyến (MoMo)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái</span>
                  <span className="font-medium text-green-600">Đã thanh toán</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền</span>
                  <span className="font-medium text-lg">
                    {(booking.totalPrice || booking.total).toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Hướng dẫn tiếp theo</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Email xác nhận đã được gửi đến địa chỉ {booking.email}</li>
                <li>• Vui lòng mang theo CMND/CCCD khi nhận phòng</li>
                <li>• Nhận phòng từ 14:00 và trả phòng trước 12:00</li>
                <li>• Liên hệ lễ tân nếu có bất kỳ thắc mắc nào</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" size="default" onClick={onBackToHome} className="flex-1">
                Về trang chủ
              </Button>
              <Button variant="default" size="default" onClick={onViewAccount} className="flex-1">
                Xem tài khoản
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}