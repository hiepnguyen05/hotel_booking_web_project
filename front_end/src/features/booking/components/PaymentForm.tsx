import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Loader2 } from 'lucide-react';
import { bookingService } from '../../../services/bookingService';
import { toast } from 'sonner';
import { isUsingNgrok } from '../../../utils/networkUtils';

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

export function PaymentForm() {
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

  const loadBooking = async (bookingId: string) => {
    try {
      setLoading(true);
      const bookingData: any = await bookingService.getBookingById(bookingId);
      if (bookingData) {
        setBooking(bookingData);
        // Automatically redirect to MoMo payment page
        handleMoMoPayment(bookingData);
      }
    } catch (error) {
      console.error('Error loading booking:', error);
      toast.error('Có lỗi xảy ra khi tải thông tin đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleMoMoPayment = async (bookingData = booking) => {
    try {
      setProcessing(true);
      
      if (!bookingData) {
        toast.error('Không tìm thấy thông tin đặt phòng');
        return;
      }
      
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
        bookingId: bookingData._id, 
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

  if (loading || processing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Đang chuyển hướng đến trang thanh toán MoMo...</p>
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

  // If already paid, redirect to payment result page
  if (booking.paymentStatus === 'paid') {
    // Redirect to payment result page with booking ID
    window.location.href = `http://localhost:3000/payment-result?orderId=${booking._id}&resultCode=0`;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Đang chuyển hướng đến trang xác nhận...</p>
        </div>
      </div>
    );
  }

  // Automatically redirect to MoMo payment page
  handleMoMoPayment();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-gray-600">Đang chuyển hướng đến trang thanh toán MoMo...</p>
        <p className="text-sm text-gray-500 mt-2">Nếu bạn chưa được chuyển hướng, vui lòng click vào nút bên dưới</p>
        <Button 
          variant="default" 
          size="default"
          className="mt-4"
          onClick={() => handleMoMoPayment()}
          disabled={processing}
        >
          {processing ? (
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
              Đang xử lý...
            </div>
          ) : (
            'Chuyển đến trang thanh toán MoMo'
          )}
        </Button>
      </div>
    </div>
  );
}