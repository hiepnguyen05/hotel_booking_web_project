import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { bookingService } from '../../../services/bookingService';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { isUsingNgrok } from '../../../utils/networkUtils';
import { useAuthStore } from '../../../store/authStore';

interface MoMoPaymentProps {
  onBack: () => void;
}

export function MoMoPayment({ onBack }: MoMoPaymentProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Get booking data from location state
    const state: any = location.state;
    console.log('[MOMO PAYMENT] Location state:', state);
    
    if (state && state.booking) {
      setBooking(state.booking);
    } else {
      // If no booking data, redirect back
      toast.error('Không tìm thấy thông tin đặt phòng');
      onBack();
    }
  }, []);

  useEffect(() => {
    // Check authentication status
    console.log('[MOMO PAYMENT] Auth state:', { user, isAuthenticated });
    
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    console.log('[MOMO PAYMENT] Auth token from localStorage:', token ? 'Present' : 'Missing');
    
    if (!isAuthenticated || !token) {
      console.log('[MOMO PAYMENT] User not authenticated, redirecting to login');
      toast.error('Vui lòng đăng nhập để tiếp tục');
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const createPayment = async () => {
    if (!booking) return;
    
    try {
      setLoading(true);
      
      // Log booking data for debugging
      console.log('[MOMO PAYMENT] Booking data:', booking);
      
      // Check if booking has a valid ID
      if (!booking._id) {
        console.error('[MOMO PAYMENT] Invalid booking ID');
        toast.error('Thông tin đặt phòng không hợp lệ', {
          description: 'Không tìm thấy ID đặt phòng'
        });
        setLoading(false);
        return;
      }
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      console.log('[MOMO PAYMENT] Auth token present:', !!token);
      if (token) {
        console.log('[MOMO PAYMENT] Token length:', token.length);
      }
      
      // Check if we're using ngrok
      const usingNgrok = isUsingNgrok();
      console.log('[MOMO PAYMENT] Using ngrok:', usingNgrok);
      
      // Create returnUrl - this is where MoMo will redirect after payment
      let returnUrl;
      if (usingNgrok && typeof window !== 'undefined') {
        // If using ngrok, use the ngrok URL
        returnUrl = `${window.location.origin}/payment-result`;
      } else if (typeof window !== 'undefined') {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        
        // If accessing via IP, still use localhost for the returnUrl
        // because MoMo needs to redirect to a publicly accessible URL
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
          returnUrl = `http://localhost:3000/payment-result`;
        } else {
          returnUrl = `${protocol}//${hostname}:3000/payment-result`;
        }
      } else {
        // Fallback
        returnUrl = 'http://localhost:3000/payment-result';
      }
      
      console.log('[MOMO PAYMENT] Using returnUrl:', returnUrl);
      
      // Create payment - get payUrl from backend
      console.log('[MOMO PAYMENT] Creating payment for booking ID:', booking._id);
      const result: any = await bookingService.createMoMoPayment({ 
        bookingId: booking._id, 
        returnUrl
      });
      
      console.log('[MOMO PAYMENT] Payment creation result:', result);
      
      // If successful, redirect to MoMo payment page
      if (result.success && result.data?.payUrl) {
        console.log('[MOMO PAYMENT] Redirecting to MoMo payment page:', result.data.payUrl);
        window.location.href = result.data.payUrl;
      } else {
        console.error('[MOMO PAYMENT] Failed to create payment:', result.error || 'Unknown error');
        toast.error('Tạo thanh toán thất bại', {
          description: result.error || 'Vui lòng thử lại sau'
        });
        setLoading(false);
      }
      
    } catch (error: any) {
      console.error('[MOMO PAYMENT] Payment creation error:', error);
      toast.error('Tạo thanh toán thất bại', {
        description: error.message || 'Vui lòng thử lại sau'
      });
      setLoading(false);
    }
  };

  // Automatically initiate payment when booking is loaded
  useEffect(() => {
    if (booking) {
      createPayment();
    }
  }, [booking]);

  const handleBack = () => {
    navigate(-1);
  };

  const testPaymentConnection = async () => {
    try {
      setLoading(true);
      console.log('[MOMO PAYMENT] Testing payment connection');
      const result = await bookingService.testMoMoPayment();
      console.log('[MOMO PAYMENT] Test result:', result);
      
      if (result.success && result.data?.payUrl) {
        console.log('[MOMO PAYMENT] Test successful, redirecting to test URL');
        window.location.href = result.data.payUrl;
      } else {
        toast.error('Test kết nối thất bại', {
          description: result.error || 'Không thể kết nối đến dịch vụ thanh toán'
        });
      }
    } catch (error: any) {
      console.error('[MOMO PAYMENT] Test connection error:', error);
      toast.error('Test kết nối thất bại', {
        description: error.message || 'Vui lòng thử lại sau'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Đang chuyển hướng đến trang thanh toán MoMo...</p>
        </div>
      </div>
    );
  }

  // Instead of showing the form, redirect directly to success page
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Button variant="outline" size="default" onClick={handleBack} className="">
            ← Quay lại
          </Button>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Đang chuyển hướng đến trang thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Nếu bạn chưa được chuyển hướng tự động, vui lòng click vào nút bên dưới:
              </p>
              
              <div className="flex flex-col gap-3">
                <Button 
                  variant="default" 
                  size="default" 
                  onClick={createPayment}
                  className="w-full"
                >
                  Chuyển đến trang thanh toán MoMo
                </Button>
                
                {/* Test button for debugging */}
                <Button 
                  variant="outline" 
                  size="default" 
                  onClick={testPaymentConnection}
                  className="w-full"
                >
                  Test kết nối thanh toán
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Hướng dẫn thanh toán</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>1. Bạn sẽ được chuyển hướng đến trang thanh toán của MoMo</li>
                <li>2. Thực hiện thanh toán theo hướng dẫn trên trang MoMo</li>
                <li>3. Sau khi thanh toán thành công, bạn sẽ được chuyển trực tiếp đến trang xác nhận đặt phòng</li>
                <li>4. Trạng thái đặt phòng sẽ được cập nhật tự động</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MoMoPayment;