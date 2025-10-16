import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { ArrowLeft, Calendar, Users, CreditCard, Shield, Check } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface BookingPageProps {
  roomId: string;
  user: any;
  onBack: () => void;
  onBookingComplete: (booking: any) => void;
}

const roomsData = {
  "1": {
    id: "1",
    name: "Deluxe Ocean View",
    price: 3500000,
    image: "https://images.unsplash.com/photo-1632598024410-3d8f24daab57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTkyMjkwNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    capacity: "2 khách",
    size: "35m²"
  },
  "2": {
    id: "2",
    name: "Junior Suite",
    price: 5200000,
    image: "https://images.unsplash.com/photo-1632598024410-3d8f24daab57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTkyMjkwNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    capacity: "3 khách",
    size: "55m²"
  }
};

export function BookingPage({ roomId, user, onBack, onBookingComplete }: BookingPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    checkIn: "2025-01-02",
    checkOut: "2025-01-05",
    adults: 2,
    children: 0,
    specialRequests: "",
    paymentMethod: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: ""
  });
  
  const room = roomsData[roomId as keyof typeof roomsData];
  
  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy phòng</h2>
          <Button onClick={onBack}>Quay lại</Button>
        </div>
      </div>
    );
  }

  const nights = 3; // Calculate from dates
  const serviceFee = 200000;
  const tax = 350000;
  const total = room.price * nights + serviceFee + tax;

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteBooking = () => {
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const booking = {
        id: `BK${Date.now()}`,
        roomId: room.id,
        roomName: room.name,
        user: user,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.adults + bookingData.children,
        nights: nights,
        total: total,
        status: "confirmed",
        bookingDate: new Date().toISOString().split('T')[0],
        paymentStatus: "paid"
      };
      
      onBookingComplete(booking);
      setIsLoading(false);
    }, 2000);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > step ? <Check className="h-4 w-4" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              currentStep > step ? 'bg-primary' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold">Đặt phòng</h1>
          <p className="text-gray-600">Hoàn tất đặt phòng của bạn</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <StepIndicator />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Steps */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin đặt phòng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkIn">Ngày nhận phòng</Label>
                      <Input
                        type="date"
                        id="checkIn"
                        value={bookingData.checkIn}
                        onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOut">Ngày trả phòng</Label>
                      <Input
                        type="date"
                        id="checkOut"
                        value={bookingData.checkOut}
                        onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adults">Người lớn</Label>
                      <Select value={bookingData.adults.toString()} onValueChange={(value) => setBookingData({...bookingData, adults: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 người lớn</SelectItem>
                          <SelectItem value="2">2 người lớn</SelectItem>
                          <SelectItem value="3">3 người lớn</SelectItem>
                          <SelectItem value="4">4 người lớn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="children">Trẻ em</Label>
                      <Select value={bookingData.children.toString()} onValueChange={(value) => setBookingData({...bookingData, children: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 trẻ em</SelectItem>
                          <SelectItem value="1">1 trẻ em</SelectItem>
                          <SelectItem value="2">2 trẻ em</SelectItem>
                          <SelectItem value="3">3 trẻ em</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Yêu cầu đặc biệt (tùy chọn)</Label>
                    <Textarea
                      id="specialRequests"
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                      placeholder="Ví dụ: Phòng tầng cao, giường đôi, không hút thuốc..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleNextStep}>
                      Tiếp tục
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Phương thức thanh toán</Label>
                    <div className="grid grid-cols-1 gap-3">
                      <div className={`p-4 border rounded-lg cursor-pointer ${
                        bookingData.paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200'
                      }`} onClick={() => setBookingData({...bookingData, paymentMethod: 'card'})}>
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Thẻ tín dụng/ghi nợ</p>
                            <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                          </div>
                        </div>
                      </div>
                      <div className={`p-4 border rounded-lg cursor-pointer ${
                        bookingData.paymentMethod === 'transfer' ? 'border-primary bg-primary/5' : 'border-gray-200'
                      }`} onClick={() => setBookingData({...bookingData, paymentMethod: 'transfer'})}>
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Chuyển khoản ngân hàng</p>
                            <p className="text-sm text-gray-600">Thanh toán qua chuyển khoản</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {bookingData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Tên chủ thẻ</Label>
                        <Input
                          id="cardName"
                          value={bookingData.cardName}
                          onChange={(e) => setBookingData({...bookingData, cardName: e.target.value})}
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Số thẻ</Label>
                        <Input
                          id="cardNumber"
                          value={bookingData.cardNumber}
                          onChange={(e) => setBookingData({...bookingData, cardNumber: e.target.value})}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Ngày hết hạn</Label>
                          <Input
                            id="cardExpiry"
                            value={bookingData.cardExpiry}
                            onChange={(e) => setBookingData({...bookingData, cardExpiry: e.target.value})}
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCvv">CVV</Label>
                          <Input
                            id="cardCvv"
                            value={bookingData.cardCvv}
                            onChange={(e) => setBookingData({...bookingData, cardCvv: e.target.value})}
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Quay lại
                    </Button>
                    <Button onClick={handleNextStep} disabled={!bookingData.paymentMethod}>
                      Tiếp tục
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Xác nhận đặt phòng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Chính sách hủy phòng</h4>
                    <p className="text-sm text-blue-800">
                      Miễn phí hủy phòng trước 24 giờ check-in. Hủy sau thời gian này sẽ tính phí 1 đêm.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Thông tin khách hàng</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Họ tên:</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Email:</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Điện thoại:</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Số khách:</p>
                        <p className="font-medium">{bookingData.adults + bookingData.children} khách</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Quay lại
                    </Button>
                    <Button 
                      onClick={handleCompleteBooking} 
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? "Đang xử lý..." : "Xác nhận đặt phòng"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Chi tiết đặt phòng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{room.name}</h4>
                    <p className="text-sm text-gray-600">{room.capacity} • {room.size}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Check-in
                    </span>
                    <span>{bookingData.checkIn}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Check-out
                    </span>
                    <span>{bookingData.checkOut}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Khách
                    </span>
                    <span>{bookingData.adults} người lớn, {bookingData.children} trẻ em</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{nights} đêm × {room.price.toLocaleString('vi-VN')}₫</span>
                    <span>{(room.price * nights).toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí dịch vụ</span>
                    <span>{serviceFee.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Thuế</span>
                    <span>{tax.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng</span>
                    <span>{total.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-800">
                    <Shield className="h-3 w-3 inline mr-1" />
                    Đặt phòng được bảo vệ bởi SSL
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}