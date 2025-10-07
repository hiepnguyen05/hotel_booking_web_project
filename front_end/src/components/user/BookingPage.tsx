import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { ArrowLeft, Calendar, Users, CreditCard, Shield, Check, User, Mail, Phone } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { roomService, Room } from "../../services/roomService";
import { bookingService } from "../../services/bookingService";
import { useAuthStore } from "../../store/authStore";

interface BookingPageProps {
  roomId: string;
  user: any;
  onBack: () => void;
  onBookingComplete: (booking: any) => void;
}

export function BookingPage({ roomId, user, onBack, onBookingComplete }: BookingPageProps) {
  const { user: currentUser } = useAuthStore();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomLoading, setRoomLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    adults: 2,
    children: 0,
    roomCount: 1,
    fullName: currentUser?.username || '',
    email: currentUser?.email || '',
    phone: '',
    notes: "",
    paymentMethod: "direct"
  });

  // Load room data
  useEffect(() => {
    const loadRoom = async () => {
      setRoomLoading(true);
      try {
        console.log('Loading room with ID:', roomId);
        const roomData = await roomService.getRoomById(roomId);
        console.log('Loaded room data:', roomData);
        setRoom(roomData);
      } catch (error) {
        console.error('Error loading room:', error);
      } finally {
        setRoomLoading(false);
      }
    };

    if (roomId) {
      loadRoom();
    }
  }, [roomId]);
  
  if (roomLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin phòng...</p>
        </div>
      </div>
    );
  }

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

  const calculateNights = () => {
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const serviceFee = 200000;
  const tax = 350000;
  const subtotal = room.price * nights * bookingData.roomCount;
  const total = subtotal + serviceFee + tax;

  const handleInputChange = (field: string, value: string | number) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const handleCompleteBooking = async () => {
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!bookingData.fullName || !bookingData.email || !bookingData.phone) {
        alert('Vui lòng điền đầy đủ thông tin liên hệ');
        setIsLoading(false);
        return;
      }

      if (!bookingData.paymentMethod) {
        alert('Vui lòng chọn phương thức thanh toán');
        setIsLoading(false);
        return;
      }

      // Debug: log room object
      console.log('Room object:', room);
      
      // Ensure we have a valid room ID
      const validRoomId = room?.id || room?._id;
      if (!validRoomId) {
        throw new Error('Không tìm thấy ID phòng hợp lệ');
      }

      // Debug: log booking payload
      const bookingPayload: any = {
        roomId: validRoomId,
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
        adultCount: bookingData.adults,
        childCount: bookingData.children,
        roomCount: bookingData.roomCount,
        fullName: bookingData.fullName,
        email: bookingData.email,
        phone: bookingData.phone,
        paymentMethod: bookingData.paymentMethod
      };
      
      // Only include notes if it's not empty
      const trimmedNotes = bookingData.notes?.trim();
      if (trimmedNotes) {
        bookingPayload.notes = trimmedNotes;
      }
      
      console.log('Booking payload:', bookingPayload);

      const booking = await bookingService.createBooking(bookingPayload);
      
      if (booking) {
        onBookingComplete({
          ...booking,
          roomName: room.name,
          nights: nights,
          total: total
        });
      } else {
        throw new Error('Không thể tạo đặt phòng');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
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
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Thông tin liên hệ</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Họ và tên *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="fullName"
                              value={bookingData.fullName}
                              onChange={(e) => handleInputChange('fullName', e.target.value)}
                              className="pl-10"
                              placeholder="Nguyễn Văn A"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              value={bookingData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="pl-10"
                              placeholder="nguyenvana@email.com"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Số điện thoại *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              value={bookingData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="pl-10"
                              placeholder="0901234567"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Ngày lưu trú</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="checkIn">Check-in</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="checkIn"
                              type="date"
                              value={bookingData.checkIn}
                              onChange={(e) => handleInputChange('checkIn', e.target.value)}
                              className="pl-10"
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="checkOut">Check-out</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="checkOut"
                              type="date"
                              value={bookingData.checkOut}
                              onChange={(e) => handleInputChange('checkOut', e.target.value)}
                              className="pl-10"
                              min={new Date(new Date(bookingData.checkIn).getTime() + 86400000).toISOString().split('T')[0]}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Số lượng khách</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="adults">Người lớn</Label>
                          <Select 
                            value={bookingData.adults.toString()} 
                            onValueChange={(value) => handleInputChange('adults', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} người
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="children">Trẻ em</Label>
                          <Select 
                            value={bookingData.children.toString()} 
                            onValueChange={(value) => handleInputChange('children', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4].map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} trẻ
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="roomCount">Số phòng</Label>
                          <Select 
                            value={bookingData.roomCount.toString()} 
                            onValueChange={(value) => handleInputChange('roomCount', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4].map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} phòng
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Yêu cầu đặc biệt</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú thêm</Label>
                        <Textarea
                          id="notes"
                          value={bookingData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          placeholder="Ví dụ: Phòng không hút thuốc, giường tầng..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Phương thức thanh toán</h3>
                    <div className="space-y-4">
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${
                          bookingData.paymentMethod === 'direct' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200'
                        }`}
                        onClick={() => handleInputChange('paymentMethod', 'direct')}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            bookingData.paymentMethod === 'direct' 
                              ? 'border-primary bg-primary' 
                              : 'border-gray-300'
                          }`}>
                            {bookingData.paymentMethod === 'direct' && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <CreditCard className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium">Thanh toán tại khách sạn</p>
                            <p className="text-sm text-gray-600">Thanh toán khi nhận phòng</p>
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${
                          bookingData.paymentMethod === 'online' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200'
                        }`}
                        onClick={() => handleInputChange('paymentMethod', 'online')}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            bookingData.paymentMethod === 'online' 
                              ? 'border-primary bg-primary' 
                              : 'border-gray-300'
                          }`}>
                            {bookingData.paymentMethod === 'online' && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <Shield className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium">Thanh toán trực tuyến</p>
                            <p className="text-sm text-gray-600">An toàn và bảo mật</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {bookingData.paymentMethod === 'online' && (
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-medium mb-3">Thông tin thẻ</h4>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Số thẻ</Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="cardExpiry">Ngày hết hạn</Label>
                              <Input
                                id="cardExpiry"
                                placeholder="MM/YY"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cardCvv">CVV</Label>
                              <Input
                                id="cardCvv"
                                placeholder="123"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardName">Tên chủ thẻ</Label>
                            <Input
                              id="cardName"
                              placeholder="NGUYEN VAN A"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Room Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết đặt phòng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-3">
                    {room.images && room.images.length > 0 && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${room.images[0]}`}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">{room.name}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(bookingData.checkIn).toLocaleDateString('vi-VN')} - {new Date(bookingData.checkOut).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{room.price.toLocaleString('vi-VN')}₫ × {nights} đêm × {bookingData.roomCount} phòng</span>
                      <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí dịch vụ</span>
                      <span>{serviceFee.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thuế</span>
                      <span>{tax.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng</span>
                    <span>{total.toLocaleString('vi-VN')}₫</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handlePrevStep} 
                  disabled={currentStep === 1}
                  className="flex-1"
                >
                  Quay lại
                </Button>
                {currentStep < 3 ? (
                  <Button 
                    onClick={handleNextStep} 
                    className="flex-1"
                    disabled={
                      (currentStep === 1 && (!bookingData.fullName || !bookingData.email || !bookingData.phone)) ||
                      (currentStep === 1 && new Date(bookingData.checkOut) <= new Date(bookingData.checkIn))
                    }
                  >
                    Tiếp theo
                  </Button>
                ) : (
                  <Button 
                    onClick={handleCompleteBooking} 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Hoàn tất đặt phòng'}
                  </Button>
                )}
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                <p>Bằng việc nhấn "Hoàn tất đặt phòng", bạn đồng ý với</p>
                <p className="mt-1">Điều khoản và Chính sách bảo mật của chúng tôi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}