import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function MoMoPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  // Lấy thông tin booking từ state
  useEffect(() => {
    if (location.state && location.state.booking) {
      setBooking(location.state.booking);
    } else {
      // Nếu không có thông tin booking, quay lại trang trước
      navigate(-1);
    }
  }, [location.state, navigate]);

  const createPayment = async () => {
    if (!booking) return;
    
    try {
      setLoading(true);
      
      // Get the current origin (works for both localhost and network IP)
      const frontendOrigin = window.location.origin;
      
      // Create returnUrl - this is where MoMo will redirect after payment
      const returnUrl = `${frontendOrigin}/payment-result`;
      
      // Create payment - get payUrl from backend
      const result: any = await bookingService.createMoMoPayment({ 
        bookingId: booking._id, 
        returnUrl
      });
      
      // If successful, redirect to MoMo payment page
      if (result.success && result.data?.payUrl) {
        window.location.href = result.data.payUrl;
      } else {
        toast.error('Payment creation failed', {
          description: result.error || 'Please try again later'
        });
        setLoading(false);
      }
      
    } catch (error: any) {
      console.error('Payment creation error:', error);
      toast.error('Payment creation failed', {
        description: error.message || 'Please try again later'
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
              Chuyển hướng đến MoMo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Nếu bạn chưa được chuyển hướng tự động, vui lòng click vào nút bên dưới:
              </p>
              
              <Button 
                variant="default" 
                size="default" 
                onClick={createPayment}
                className="w-full"
              >
                Chuyển đến trang thanh toán MoMo
              </Button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Hướng dẫn thanh toán</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>1. Bạn sẽ được chuyển hướng đến trang thanh toán của MoMo</li>
                <li>2. Thực hiện thanh toán theo hướng dẫn trên trang MoMo</li>
                <li>3. Sau khi thanh toán, bạn sẽ được chuyển về trang kết quả</li>
                <li>4. Trạng thái đặt phòng sẽ được cập nhật tự động</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}