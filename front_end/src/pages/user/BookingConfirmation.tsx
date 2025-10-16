import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

export function BookingConfirmation() {
  const navigate = useNavigate();

  const handleConfirm = () => {
    // In a real app, this would create the booking and redirect to payment
    navigate("/user/payment/momo");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Xác nhận đặt phòng</CardTitle>
            <p className="text-gray-600">
              Vui lòng kiểm tra lại thông tin đặt phòng
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Thông tin phòng</h3>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Loại phòng:</span>
                  <span>Phòng đôi</span>
                  
                  <span className="text-gray-600">Ngày nhận phòng:</span>
                  <span>01/01/2024</span>
                  
                  <span className="text-gray-600">Ngày trả phòng:</span>
                  <span>03/01/2024</span>
                  
                  <span className="text-gray-600">Số lượng khách:</span>
                  <span>2</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Họ và tên:</span>
                  <span>Nguyễn Văn A</span>
                  
                  <span className="text-gray-600">Email:</span>
                  <span>nguyenvana@email.com</span>
                  
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span>0123456789</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Tổng tiền</h3>
                <div className="flex justify-between">
                  <span>Tổng tiền:</span>
                  <span className="font-bold text-lg">1.500.000₫</span>
                </div>
              </div>
              
              <div className="flex justify-between space-x-3">
                <Button variant="outline" size="default" className="" onClick={handleBack}>
                  Quay lại
                </Button>
                <Button variant="default" size="default" className="" onClick={handleConfirm}>
                  Thanh toán với MoMo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}