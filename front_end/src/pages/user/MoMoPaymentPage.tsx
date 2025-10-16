import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export function MoMoPaymentPage() {
  const navigate = useNavigate();

  // In a real implementation, you would redirect to MoMo payment page
  // For now, we'll simulate the process
  useEffect(() => {
    // Simulate MoMo payment redirect after 3 seconds
    const timer = setTimeout(() => {
      // In a real app, this would be handled by MoMo's redirect
      console.log("Redirecting to MoMo payment page...");
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => {
    navigate("/user/account");
  };

  const handleContinue = () => {
    // In a real implementation, this would redirect to MoMo
    // For demo purposes, we'll navigate to a success page
    navigate("/user/booking/success");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Thanh toán qua MoMo</CardTitle>
            <p className="text-gray-600">
              Bạn đang được chuyển hướng đến ứng dụng MoMo để hoàn tất thanh toán
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Thông tin thanh toán</h3>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-bold">1.500.000₫</span>
                  
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span>#BOOK123456</span>
                  
                  <span className="text-gray-600">Thời gian:</span>
                  <span>01/01/2024 10:30</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-yellow-100 p-4 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-center text-gray-600">
                  Đang chuyển hướng đến ứng dụng MoMo...
                </p>
              </div>
              
              <div className="flex justify-center space-x-3">
                <Button variant="outline" size="default" className="" onClick={handleCancel}>
                  Hủy bỏ
                </Button>
                <Button variant="default" size="default" className="" onClick={handleContinue}>
                  Tiếp tục với MoMo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}