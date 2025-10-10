import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { toast } from 'sonner';
import { isUsingNgrok } from '../../utils/networkUtils';

interface Booking {
  _id: string;
  bookingCode: string;
  totalPrice: number;
  paymentStatus: string;
  status: string;
  room: {
    name: string;
  };
}

export function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null as Booking | null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      loadBooking(id);
    }
  }, [id]);

  // Polling để kiểm tra trạng thái thanh toán
  useEffect(() => {
    if (!booking || booking.paymentStatus === 'paid') {
      return;
    }

    const interval = setInterval(() => {
      checkPaymentStatus();
    }, 3000); // Kiểm tra mỗi 3 giây

    return () => clearInterval(interval);
  }, [booking]);

  const loadBooking = async (bookingId: string) => {
    try {
      setLoading(true);
      const bookingData: any = await bookingService.getBookingById(bookingId);
      setBooking(bookingData);
    } catch (error) {
      console.error('Error loading booking:', error);
      toast.error('Có lỗi xảy ra khi tải thông tin đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      if (!id) return;
      
      const bookingData: any = await bookingService.getBookingById(id);
      if (bookingData && bookingData.paymentStatus === 'paid') {
        setBooking(bookingData);
        toast.success('Thanh toán thành công!');
        // Chuyển hướng đến trang chi tiết đặt phòng
        setTimeout(() => {
          navigate(`/user/bookings/${id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const handleMoMoPayment = async () => {
    try {
      setProcessing(true);
      
      // Get the current origin (works for both localhost and network IP)
      const frontendOrigin = window.location.origin;
      
      // Check if we're using ngrok
      const usingNgrok = frontendOrigin.includes('.ngrok.io') || frontendOrigin.includes('.ngrok-free.dev') || frontendOrigin.includes('.ngrok.app');
      
      let returnUrl, notifyUrl;
      
      if (usingNgrok) {
        // When using ngrok, we need to construct URLs differently
        console.log('[PAYMENT] Detected ngrok environment');
        
        // For returnUrl, we still want to use the frontend origin (ngrok URL)
        returnUrl = `${frontendOrigin}/payment-result`;
        
        // For notifyUrl, we need to use the ngrok URL for the backend
        // Assuming ngrok is running on port 5000 for the backend
        const ngrokBackendUrl = frontendOrigin.replace(':3000', ':5000');
        notifyUrl = `${ngrokBackendUrl}/api/bookings/momo/callback`;
      } else {
        // Standard behavior for localhost or IP access
        const backendOrigin = frontendOrigin.replace(':3000', ':5000');
        returnUrl = `${frontendOrigin}/payment-result`;
        notifyUrl = `${backendOrigin}/api/bookings/momo/callback`;
      }
      
      // Log the URLs for debugging
      console.log('[PAYMENT] Frontend origin:', frontendOrigin);
      console.log('[PAYMENT] Is ngrok:', usingNgrok);
      console.log('[PAYMENT] Return URL:', returnUrl);
      console.log('[PAYMENT] Notify URL:', notifyUrl);
      
      const result: any = await bookingService.createMoMoPayment({ 
        bookingId: id!, 
        returnUrl, 
        notifyUrl 
      });
      
      if (result.success) {
        // Redirect to MoMo payment page
        window.location.href = result.data.payUrl;
      } else {
        toast.error('Failed to create payment', {
          description: result.error || 'Please try again later'
        });
      }
    } catch (error: any) {
      console.error('Payment creation error:', error);
      toast.error('Payment creation failed', {
        description: error.message || 'Please try again later'
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy thông tin đặt phòng</p>
          <Button 
            variant="default"
            size="default"
            className=""
            onClick={() => navigate('/user/bookings')}
          >
            Quay lại danh sách đặt phòng
          </Button>
        </div>
      </div>
    );
  }

  // Nếu đã thanh toán thành công, chuyển hướng đến trang chi tiết
  if (booking.paymentStatus === 'paid') {
    navigate(`/user/bookings/${booking._id}`);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="default"
            className=""
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </Button>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Thanh toán đặt phòng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Mã đặt phòng</p>
              <p className="text-xl font-bold text-primary">{booking.bookingCode}</p>
            </div>
            
            <div className="border-t border-b border-gray-200 py-6">
              <h3 className="font-semibold mb-4">Thông tin thanh toán</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Phòng:</span>
                  <span className="font-medium">{booking.room.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tổng tiền:</span>
                  <span className="text-xl font-bold text-primary">
                    {booking.totalPrice.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Hướng dẫn thanh toán</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>1. Nhấn vào nút "Thanh toán với MoMo" bên dưới</li>
                <li>2. Hoàn tất thanh toán trên ứng dụng MoMo</li>
                <li>3. Sau khi thanh toán thành công, bạn sẽ được chuyển hướng về trang kết quả</li>
                <li>4. Trang này sẽ tự động cập nhật trạng thái thanh toán</li>
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="default"
                className="flex-1"
                onClick={() => navigate(`/user/bookings/${booking._id}`)}
              >
                Hủy bỏ
              </Button>
              <Button 
                variant="default" 
                size="default"
                className="flex-1"
                onClick={handleMoMoPayment}
                disabled={processing}
              >
                {processing ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Thanh toán với MoMo
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}