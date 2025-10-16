import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function BookingCustomerInfo() {
  const [customerData, setCustomerData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    notes: ""
  });
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle customer info submission
    console.log("Customer data:", customerData);
    // Navigate to confirmation page
    navigate("/user/booking/confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Thông tin khách hàng</CardTitle>
            <p className="text-gray-600">
              Vui lòng điền thông tin cá nhân để chúng tôi có thể liên hệ
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={customerData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={customerData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={customerData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    name="address"
                    value={customerData.address}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={customerData.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" size="default" className="" onClick={() => navigate(-1)}>
                  Quay lại
                </Button>
                <Button type="submit" variant="default" size="default" className="">
                  Tiếp tục
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}