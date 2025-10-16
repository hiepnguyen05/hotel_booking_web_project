import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export function PaymentResultPage() {
  // In a real app, you would get the payment status from URL params or state
  const paymentSuccess = true; // This would be dynamic

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            {paymentSuccess ? (
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <CardTitle className="text-2xl font-bold">Thanh toán thành công!</CardTitle>
                <p className="text-gray-600">
                  Thanh toán của bạn đã được xử lý thành công. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <CardTitle className="text-2xl font-bold">Thanh toán thất bại!</CardTitle>
                <p className="text-gray-600">
                  Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {paymentSuccess && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Thông tin thanh toán</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-mono">#TXN123456</span>
                    
                    <span className="text-gray-600">Số tiền:</span>
                    <span>1.500.000₫</span>
                    
                    <span className="text-gray-600">Thời gian:</span>
                    <span>01/01/2024 10:30</span>
                    
                    <span className="text-gray-600">Phương thức:</span>
                    <span>MoMo</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center">
                <Button variant="default" size="default" className="">
                  {paymentSuccess ? "Về trang chủ" : "Thử lại"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}