import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Thanh toán</CardTitle>
            <p className="text-gray-600">
              Vui lòng chọn phương thức thanh toán
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Thông tin đơn hàng</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Phòng đôi (2 đêm)</span>
                    <span>1.000.000₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dịch vụ bổ sung</span>
                    <span>200.000₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế và phí</span>
                    <span>300.000₫</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Tổng cộng</span>
                    <span>1.500.000₫</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Phương thức thanh toán</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                      <span>Thẻ tín dụng/Ghi nợ</span>
                    </div>
                    <div className="text-sm text-gray-500">Visa, Mastercard</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                      <span>MoMo</span>
                    </div>
                    <div className="text-sm text-gray-500">Ví điện tử</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                      <span>Chuyển khoản ngân hàng</span>
                    </div>
                    <div className="text-sm text-gray-500">ATM, Internet Banking</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="default" size="default" className="">
                  Tiếp tục
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}