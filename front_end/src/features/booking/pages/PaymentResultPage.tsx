import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { CheckCircle, Calendar, Users, CreditCard, Home, Loader2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { bookingService } from '../../../services/bookingService';

export function PaymentResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(true);

  // Parse URL parameters from MoMo
  const urlParams = new URLSearchParams(location.search);
  const orderId = urlParams.get('orderId');
  const resultCode = urlParams.get('resultCode');

  useEffect(() => {
    // Set payment success status based on resultCode from MoMo
    if (resultCode !== '0') {
      setPaymentSuccess(false);
    }
    
    // If we have an orderId from MoMo, fetch the booking data
    if (orderId) {
      fetchBookingData(orderId);
    } else {
      // If no orderId, show error
      setError('Không tìm thấy thông tin đặt phòng');
      setLoading(false);
    }
  }, [orderId, resultCode]);

  const fetchBookingData = async (id: string) => {
    try {
      setLoading(true);
      const bookingData: any = await bookingService.getBookingById(id);
      if (bookingData) {
        setBooking(bookingData);
        // Show success toast if payment was successful
        if (resultCode === '0') {
          toast.success('Đặt phòng và thanh toán thành công!');
        }
      } else {
        setError('Không tìm thấy thông tin đặt phòng');
      }
    } catch (err) {
      console.error('Error fetching booking data:', err);
      setError('Có lỗi xảy ra khi tải thông tin đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleViewAccount = () => {
    navigate('/user/account');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Đang tải thông tin đặt phòng...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin đặt phòng</h2>
          <Button variant="default" size="default" onClick={handleBackToHome} className="">Quay về trang chủ</Button>
        </div>
      </div>
    );
  }

  // If payment failed, show error message
  if (!paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="text-center">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold text-red-600">
                  Thanh toán thất bại!
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Rất tiếc, thanh toán của bạn không thành công.
                </p>
                {resultCode && resultCode !== '0' && (
                  <p className="text-gray-500 mt-2 text-sm">
                    Mã lỗi: {resultCode}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Thông tin đặt phòng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Mã đặt phòng</p>
                    <p className="font-medium">{booking.bookingCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái</p>
                    <p className="font-medium text-red-600">Thanh toán thất bại</p>
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

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Hướng dẫn</h4>
                {resultCode === '1006' ? (
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Bạn đã từ chối xác nhận thanh toán trong ứng dụng MoMo</li>
                    <li>• Vui lòng thử lại và xác nhận thanh toán để tiếp tục</li>
                    <li>• Đảm bảo bạn nhấn "Xác nhận" khi MoMo yêu cầu xác nhận giao dịch</li>
                  </ul>
                ) : (
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Kiểm tra lại số dư tài khoản MoMo của bạn</li>
                    <li>• Đảm bảo thông tin thẻ ngân hàng đã được liên kết đúng</li>
                    <li>• Thử lại quá trình thanh toán</li>
                    <li>• Liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn</li>
                  </ul>
                )}
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" size="default" onClick={handleBackToHome} className="flex-1">
                  Về trang chủ
                </Button>
                <Button variant="default" size="default" onClick={handleViewAccount} className="flex-1">
                  Xem tài khoản
                </Button>
              </div>
            </CardContent>
          </Card>
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
                Cảm ơn bạn đã đặt phòng tại NgocHiepHotel
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
                  <span className="font-medium">{booking.room?.name || booking.roomName || 'Phòng Deluxe'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày nhận phòng</span>
                  <span className="font-medium">
                    {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày trả phòng</span>
                  <span className="font-medium">
                    {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số đêm</span>
                  <span className="font-medium">
                    {booking.nights || 
                      (booking.checkInDate && booking.checkOutDate ? 
                        Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24)) : 
                        1)} đêm
                  </span>
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
              <Button variant="outline" size="default" onClick={handleBackToHome} className="flex-1">
                Về trang chủ
              </Button>
              <Button variant="default" size="default" onClick={handleViewAccount} className="flex-1">
                Xem tài khoản
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}