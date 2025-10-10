import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { Loader2, QrCode, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface MoMoPaymentProps {
  bookingId: string;
  amount: number;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export function MoMoPayment({ bookingId, amount, onPaymentSuccess, onBack }: MoMoPaymentProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    createPayment();
  }, []);

  const createPayment = async () => {
    try {
      setLoading(true);
      
      // Get the current origin (works for both localhost and network IP)
      const frontendOrigin = window.location.origin;
      
      // For notifyUrl, we need to use the backend URL
      // If accessing via IP, we assume backend is on the same machine
      const backendOrigin = frontendOrigin.replace(':3000', ':5000');
      
      // Create URLs
      const returnUrl = `${frontendOrigin}/payment-result`;
      const notifyUrl = `${backendOrigin}/api/bookings/momo/callback`;
      
      console.log('=== DEBUG PAYMENT URLS ===');
      console.log('Frontend origin:', frontendOrigin);
      console.log('Backend origin:', backendOrigin);
      console.log('Return URL:', returnUrl);
      console.log('Notify URL:', notifyUrl);
      
      const result: any = await bookingService.createMoMoPayment({ bookingId, returnUrl, notifyUrl });
      
      if (result.success) {
        setPaymentData(result.data);
      } else {
        toast.error('Failed to create payment', {
          description: result.error || 'Please try again later'
        });
        onBack();
      }
    } catch (error: any) {
      console.error('Payment creation error:', error);
      toast.error('Payment creation failed', {
        description: error.message || 'Please try again later'
      });
      onBack();
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSuccess = () => {
    // In a real application, this would be called after verifying payment
    onPaymentSuccess();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Đang tạo thanh toán MoMo...</p>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Không thể tạo thanh toán</h2>
          <Button variant="outline" size="default" onClick={onBack} className="">Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Button variant="outline" size="default" onClick={onBack} className="">
            ← Quay lại
          </Button>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Thanh toán MoMo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Số tiền cần thanh toán</p>
              <p className="text-3xl font-bold text-primary">{amount.toLocaleString('vi-VN')}₫</p>
            </div>
            
            <div className="border-t border-b border-gray-200 py-6">
              <h3 className="font-semibold mb-4 text-center">Quét mã QR để thanh toán</h3>
              
              {(paymentData as any).qrCodeUrl && (
                <div className="flex justify-center mb-6">
                  <div className="border p-4 rounded-lg bg-white">
                    <img 
                      src={(paymentData as any).qrCodeUrl} 
                      alt="MoMo QR Code" 
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Hoặc thanh toán bằng ứng dụng MoMo</p>
                  <Button 
                    className="w-full" 
                    size="default"
                    variant="default"
                    onClick={() => window.open((paymentData as any).deeplink || (paymentData as any).payUrl, '_blank')}
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    Mở ứng dụng MoMo
                  </Button>
                </div>
                
                {(paymentData as any).payUrl && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Liên kết thanh toán</p>
                    <div className="flex">
                      <input
                        type="text"
                        value={(paymentData as any).payUrl}
                        readOnly
                        className="flex-1 border rounded-l-lg px-3 py-2 text-sm"
                      />
                      <Button
                        variant="outline"
                        size="default"
                        className="rounded-l-none"
                        onClick={() => copyToClipboard((paymentData as any).payUrl)}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Hướng dẫn thanh toán</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>1. Mở ứng dụng MoMo trên điện thoại</li>
                <li>2. Quét mã QR hoặc nhấn "Mở ứng dụng MoMo"</li>
                <li>3. Kiểm tra thông tin và xác nhận thanh toán</li>
                <li>4. Hệ thống sẽ tự động cập nhật trạng thái đặt phòng</li>
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" size="default" onClick={onBack} className="flex-1">
                Hủy bỏ
              </Button>
              <Button variant="default" size="default" onClick={handlePaymentSuccess} className="flex-1">
                Đã thanh toán
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}