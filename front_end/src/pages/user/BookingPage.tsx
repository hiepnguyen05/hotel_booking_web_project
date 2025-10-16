import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function BookingPage() {
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    roomType: ""
  });
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking submission
    console.log("Booking data:", bookingData);
    // Navigate to customer info page
    navigate("/user/booking/customer");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Đặt phòng</CardTitle>
            <p className="text-gray-600">
              Vui lòng điền thông tin để đặt phòng
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Ngày nhận phòng *</Label>
                  <Input
                    id="checkIn"
                    name="checkIn"
                    type="date"
                    value={bookingData.checkIn}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="checkOut">Ngày trả phòng *</Label>
                  <Input
                    id="checkOut"
                    name="checkOut"
                    type="date"
                    value={bookingData.checkOut}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="guests">Số lượng khách *</Label>
                  <Input
                    id="guests"
                    name="guests"
                    type="number"
                    min="1"
                    value={bookingData.guests}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="roomType">Loại phòng *</Label>
                  <select
                    id="roomType"
                    name="roomType"
                    value={bookingData.roomType}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Chọn loại phòng</option>
                    <option value="single">Phòng đơn</option>
                    <option value="double">Phòng đôi</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
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