import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Loader2 } from 'lucide-react';
import { bookingService } from '../../../services/bookingService';
import { toast } from 'sonner';
import { isUsingNgrok } from '../../../utils/networkUtils';
import { useAuthStore } from '../../../store/authStore';

export function MoMoPaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Get booking data from location state
    const state: any = location.state;
    console.log('[MOMO PAYMENT PAGE] Location state:', state);
    
    if (state && state.booking) {
      setBooking(state.booking);
    } else {
      // If no booking data, redirect back
      toast.error('Không tìm thấy thông tin đặt phòng');
      navigate(-1);
    }
  }, [location.state, navigate]);

  useEffect(() => {
    // Check authentication status
    console.log('[MOMO PAYMENT PAGE] Auth state:', { user, isAuthenticated });
    
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    console.log('[MOMO PAYMENT PAGE] Auth token from localStorage:', token ? 'Present' : 'Missing');
    
    if (!isAuthenticated || !token) {
      console.log('[MOMO PAYMENT PAGE] User not authenticated, redirecting to login');
      toast.error('Vui lòng đăng nhập để tiếp tục');
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const createPayment = async () => {
    if (!booking) return;
    
    try {
      setLoading(true);
      
      // Log booking data for debugging
      console.log('[MOMO PAYMENT PAGE] Booking data:', booking);
      
      // Check if booking has a valid ID
      if (!booking._id) {
        console.error('[MOMO PAYMENT PAGE] Invalid booking ID');
        toast.error('Thông tin đặt phòng không hợp lệ', {
          description: 'Không tìm thấy ID đặt phòng'
        });
        setLoading(false);
        return;
      }
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      console.log('[MOMO PAYMENT PAGE] Auth token present:', !!token);
      if (token) {
        console.log('[MOMO PAYMENT PAGE] Token length:', token.length);
      }
      
      // Check if we're using ngrok
      const usingNgrok = isUsingNgrok();
      console.log('[MOMO PAYMENT PAGE] Using ngrok:', usingNgrok);
      
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
          returnUrl = `${(import.meta as any).env?.VITE_API_BASE_URL?.replace('/api', '') || 'https://hotel-booking-web-project.onrender.com'}/payment-result`;
        } else {
          returnUrl = `${protocol}//${hostname}:3000/payment-result`;
        }
      } else {
        // Fallback
        returnUrl = `${(import.meta as any).env?.VITE_API_BASE_URL?.replace('/api', '') || 'https://hotel-booking-web-project.onrender.com'}/payment-result`;
      }
      
      console.log('[MOMO PAYMENT PAGE] Using returnUrl:', returnUrl);
      
      // Create payment - get payUrl from backend
      console.log('[MOMO PAYMENT PAGE] Creating payment for booking ID:', booking._id);
      const result: any = await bookingService.createMoMoPayment({ 
        bookingId: booking._id, 
        returnUrl
      });
      
      console.log('[MOMO PAYMENT PAGE] Payment creation result:', result);
      
      // If successful, redirect to MoMo payment page
      if (result.success && result.data?.payUrl) {
        console.log('[MOMO PAYMENT PAGE] Redirecting to MoMo payment page:', result.data.payUrl);
        window.location.href = result.data.payUrl;
      } else {
        console.error('[MOMO PAYMENT PAGE] Failed to create payment:', result.error || 'Unknown error');
        
        // Special handling for result code 1006 (user denied payment)
        if (result.resultCode === 1006) {
          toast.error('Thanh toán bị từ chối', {
            description: 'Bạn đã từ chối xác nhận thanh toán trong ứng dụng MoMo. Vui lòng thử lại và xác nhận thanh toán để tiếp tục.'
          });
        } else {
          toast.error('Tạo thanh toán thất bại', {
            description: result.error || 'Vui lòng thử lại sau'
          });
        }
        
        setLoading(false);
      }
      
    } catch (error: any) {
      console.error('[MOMO PAYMENT PAGE] Payment creation error:', error);
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

  // Instead of showing a form, just show a loading state
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-gray-600">Đang chuyển hướng đến trang thanh toán MoMo...</p>
        <p className="text-sm text-gray-500 mt-2">Nếu bạn chưa được chuyển hướng, vui lòng click vào nút bên dưới</p>
        <Button 
          variant="default" 
          size="default" 
          onClick={createPayment}
          className="mt-4"
        >
          Chuyển đến trang thanh toán MoMo
        </Button>
      </div>
    </div>
  );
}