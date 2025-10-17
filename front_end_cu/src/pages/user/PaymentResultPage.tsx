import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { toast } from 'sonner';

export function PaymentResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [booking, setBooking] = useState(null);
  const [polling, setPolling] = useState(false);

  // Parse URL parameters
  const urlParams = new URLSearchParams(location.search);
  const resultCode = urlParams.get('resultCode');
  const orderId = urlParams.get('orderId');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        setLoading(true);
        
        // resultCode = 0 means success in MoMo
        if (resultCode === '0' && orderId) {
          // Start polling to get updated booking status from backend
          await pollBookingStatus(orderId);
        } else if (resultCode !== null) {
          setPaymentStatus('failed');
        } else {
          setPaymentStatus('checking');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('failed');
        toast.error('Có lỗi xảy ra khi kiểm tra kết quả thanh toán');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [resultCode, orderId]);

  // Poll booking status from backend
  const pollBookingStatus = async (bookingId: string) => {
    setPolling(true);
    let attempts = 0;
    const maxAttempts = 30; // Increase to 30 attempts (90 seconds)
    const pollInterval = 3000; // Poll every 3 seconds

    const poll = async () => {
      try {
        attempts++;
        console.log(`[POLLING] Attempt ${attempts}/${maxAttempts} for booking ${bookingId}`);
        
        // Fetch booking details directly from backend
        const updatedBooking: any = await bookingService.getBookingById(bookingId);
        
        if (updatedBooking) {
          console.log(`[POLLING] Booking data received:`, updatedBooking);
          setBooking(updatedBooking);
          
          // Check if payment status has been updated
          if (updatedBooking.paymentStatus === 'paid' && updatedBooking.status === 'confirmed') {
            console.log(`[POLLING] Payment successful detected!`);
            setPaymentStatus('success');
            setPolling(false);
            toast.success('Thanh toán thành công!');
            return;
          } else if (updatedBooking.paymentStatus === 'failed') {
            console.log(`[POLLING] Payment failed detected!`);
            setPaymentStatus('failed');
            setPolling(false);
            toast.error('Thanh toán thất bại');
            return;
          } else {
            console.log(`[POLLING] Payment status: ${updatedBooking.paymentStatus}, Booking status: ${updatedBooking.status}`);
          }
        } else {
          console.log(`[POLLING] No booking data received`);
        }
        
        // Continue polling if max attempts not reached
        if (attempts < maxAttempts) {
          console.log(`[POLLING] Scheduling next poll in 3 seconds...`);
          setTimeout(poll, pollInterval);
        } else {
          console.log(`[POLLING] Max attempts reached (${maxAttempts})`);
          // If we've reached max attempts, check the resultCode
          if (resultCode === '0') {
            // If resultCode was 0, assume payment was successful but there might be a delay
            console.log(`[POLLING] Assuming success due to resultCode=0`);
            setPaymentStatus('success');
            setPolling(false);
            toast.success('Thanh toán thành công!');
          } else {
            // Otherwise, show failed status
            console.log(`[POLLING] Showing failed status due to resultCode!=0`);
            setPaymentStatus('failed');
            setPolling(false);
            toast.error('Thanh toán thất bại');
          }
        }
      } catch (error) {
        console.error('[POLLING] Error polling booking status:', error);
        
        // Continue polling if max attempts not reached
        if (attempts < maxAttempts) {
          console.log(`[POLLING] Scheduling next poll in 3 seconds despite error...`);
          setTimeout(poll, pollInterval);
        } else {
          console.log(`[POLLING] Max attempts reached with errors`);
          // If we've reached max attempts, check the resultCode
          if (resultCode === '0') {
            // If resultCode was 0, assume payment was successful but there might be a delay
            console.log(`[POLLING] Assuming success due to resultCode=0 despite errors`);
            setPaymentStatus('success');
            setPolling(false);
            toast.success('Thanh toán thành công!');
          } else {
            // Otherwise, show failed status
            console.log(`[POLLING] Showing failed status due to resultCode!=0 and errors`);
            setPaymentStatus('failed');
            setPolling(false);
            toast.error('Thanh toán thất bại');
          }
        }
      }
    };

    // Start polling
    console.log(`[POLLING] Starting polling for booking ${bookingId}`);
    poll();
  };

  const handleViewBooking = () => {
    if (booking?._id) {
      navigate(`/user/bookings`);
    } else {
      navigate('/user/bookings');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Đang kiểm tra kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {paymentStatus === 'success' && (
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-green-600">Thanh toán thành công!</h2>
                </div>
              )}
              {paymentStatus === 'failed' && (
                <div className="flex flex-col items-center">
                  <XCircle className="h-16 w-16 text-red-500 mb-4" />
                  <h2 className="text-red-600">Thanh toán thất bại</h2>
                </div>
              )}
              {paymentStatus === 'checking' && (
                <div className="flex flex-col items-center">
                  <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
                  <h2 className="text-yellow-600">Đang kiểm tra kết quả</h2>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              {paymentStatus === 'success' && (
                <>
                  <p className="text-gray-600 mb-4">
                    Cảm ơn bạn đã thanh toán. Đặt phòng của bạn đã được xác nhận.
                  </p>
                  {orderId && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-green-700 mb-1">Mã đặt phòng</p>
                      <p className="font-mono text-lg font-bold text-green-800">{orderId}</p>
                    </div>
                  )}
                  {booking && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                      <h3 className="font-semibold text-blue-800 mb-2">Thông tin đặt phòng</h3>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Phòng:</span> {booking.room?.name || 'N/A'}</p>
                        <p><span className="font-medium">Ngày nhận:</span> {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
                        <p><span className="font-medium">Ngày trả:</span> {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
                        <p><span className="font-medium">Tổng tiền:</span> {(booking.totalPrice || booking.total || 0).toLocaleString('vi-VN')}₫</p>
                        <p><span className="font-medium">Trạng thái thanh toán:</span> <span className="font-medium text-green-600">Đã thanh toán</span></p>
                        <p><span className="font-medium">Trạng thái đặt phòng:</span> <span className="font-medium text-green-600">Đã xác nhận</span></p>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {paymentStatus === 'failed' && (
                <>
                  <p className="text-gray-600 mb-4">
                    Rất tiếc, thanh toán của bạn không thành công. Vui lòng thử lại.
                  </p>
                  {orderId && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-red-700 mb-1">Mã đặt phòng</p>
                      <p className="font-mono text-lg font-bold text-red-800">{orderId}</p>
                    </div>
                  )}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-yellow-800 mb-2">Hướng dẫn</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Kiểm tra lại số dư tài khoản MoMo của bạn</li>
                      <li>• Đảm bảo thông tin thẻ ngân hàng đã được liên kết đúng</li>
                      <li>• Thử lại quá trình thanh toán</li>
                      <li>• Liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn</li>
                    </ul>
                  </div>
                </>
              )}
              
              {paymentStatus === 'checking' && (
                <div>
                  <p className="text-gray-600 mb-4">
                    Đang kiểm tra kết quả thanh toán. Vui lòng đợi trong giây lát...
                  </p>
                  {polling && (
                    <div className="flex items-center justify-center mb-4">
                      <Loader2 className="h-6 w-6 animate-spin mr-2 text-primary" />
                      <span>Đang cập nhật trạng thái...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                size="default" 
                onClick={handleBackToHome}
                className="flex-1"
              >
                Về trang chủ
              </Button>
              <Button 
                variant="default" 
                size="default" 
                onClick={handleViewBooking}
                className="flex-1"
              >
                Xem chi tiết đặt phòng
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}