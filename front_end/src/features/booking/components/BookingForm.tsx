import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Separator } from '../../../components/ui/separator';
import { Badge } from '../../../components/ui/badge';
import { ArrowLeft, Calendar, Users, CreditCard, Shield, Check, User, Mail, Phone } from 'lucide-react';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';
import { roomService } from '../../../services/roomService';
import { bookingService, CreateBookingData } from '../../../services/bookingService';
import { useAuthStore } from '../../../store/authStore';

import { isUsingNgrok } from '../../../utils/networkUtils';

interface Room {
  _id: string;
  name: string;
  price: number;
  type: string;
  capacity: number;
  images?: string[];
}

interface BookingFormProps {
  roomId: string;
  user: any;
  onBack: () => void;
  onBookingComplete: (booking: any) => void;
  checkInDate?: string;
  checkOutDate?: string;
  adults?: number;
  children?: number;
}

export function BookingForm({ roomId, user, onBack, onBookingComplete, checkInDate, checkOutDate, adults, children }: BookingFormProps) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [room, setRoom] = useState(null as Room | null);
  const [roomLoading, setRoomLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Booking form state - updated to use dynamic data with proper defaults
  const [bookingData, setBookingData] = useState({
    checkIn: checkInDate || new Date(Date.now() + 86400000).toISOString().split('T')[0], // Ngày mai
    checkOut: checkOutDate || new Date(Date.now() + 172800000).toISOString().split('T')[0], // Ngày mốt
    adults: adults || 2,
    children: children || 0,
    roomCount: 1,
    fullName: currentUser?.username || user?.username || '',
    email: currentUser?.email || user?.email || '',
    phone: '',
    notes: "",
    paymentMethod: "online" // Chỉ giữ lại phương thức thanh toán trực tuyến
  });

  // Load room data
  useEffect(() => {
    const loadRoom = async () => {
      setRoomLoading(true);
      try {
        console.log('Loading room with ID:', roomId);
        const roomData: any = await roomService.getRoomById(roomId);
        console.log('Loaded room data:', roomData);
        setRoom(roomData);
      } catch (error) {
        console.error('Error loading room:', error);
        alert('Có lỗi xảy ra khi tải thông tin phòng');
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
          <Button variant="default" size="default" className="" onClick={onBack}>Quay lại</Button>
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
  const subtotal = (room as any).price * nights * bookingData.roomCount;
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
      
      // Validate dates
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      
      if (checkIn >= checkOut) {
        alert('Ngày trả phòng phải sau ngày nhận phòng');
        setIsLoading(false);
        return;
      }
      
      // Validate guest counts
      const totalGuests = bookingData.adults + bookingData.children;
      if (totalGuests > (room as any).capacity * bookingData.roomCount) {
        alert(`Tổng số khách không được vượt quá ${(room as any).capacity * bookingData.roomCount} người`);
        setIsLoading(false);
        return;
      }

      // Debug: log room object
      console.log('Room object:', room);
      
      // Ensure we have a valid room ID
      const validRoomId = (room as any)?.id || (room as any)?._id;
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

      const booking: any = await bookingService.createBooking(bookingPayload);
      
      if (booking) {
        // Nếu là thanh toán trực tuyến, chuyển đến trang thanh toán MoMo
        if (bookingData.paymentMethod === 'online') {
          // Navigate to MoMo payment page with booking data
          navigate('/user/payment/momo', {
            state: {
              booking: {
                ...booking,
                roomName: (room as any).name,
                nights: nights,
                total: total
              }
            }
          });
        } else {
          // Luôn gọi onBookingComplete bất kể phương thức thanh toán
          onBookingComplete({
            ...booking,
            roomName: (room as any).name,
            nights: nights,
            total: total
          });
        }
      } else {
        alert('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      
      // Handle specific error messages
      if (error.message && error.message.includes('Selected dates are not available for this room')) {
        alert('Ngày đã chọn không còn available cho phòng này. Vui lòng chọn ngày khác.');
      } else if (error.message && error.message.includes('Invalid or expired token')) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        alert('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.');
      }
    } finally {
      // Đảm bảo trạng thái loading được reset
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
            size="default"
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
                      {/* Loại bỏ phương thức thanh toán trực tiếp, chỉ giữ lại thanh toán trực tuyến */}
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer ${
                          bookingData.paymentMethod === 'online' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200'
                        }`}
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
                    {(room as any).images && (room as any).images.length > 0 && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={
                            (room as any).images && (room as any).images.length > 0
                              ? (room as any).images[0].startsWith('http')
                                ? (room as any).images[0]
                                : (room as any).images[0].startsWith('/uploads')
                                ? `http://localhost:5000${(room as any).images[0]}`
                                : `http://localhost:5000${(room as any).images[0].startsWith('/') ? (room as any).images[0] : `/${(room as any).images[0]}`}`
                              : 'https://placehold.co/300x200?text=No+Image'
                          }
                          alt={(room as any).name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">{(room as any).name}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(bookingData.checkIn).toLocaleDateString('vi-VN')} - {new Date(bookingData.checkOut).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{(room as any).price.toLocaleString('vi-VN')}₫ × {nights} đêm × {bookingData.roomCount} phòng</span>
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
                  size="default"
                  onClick={handlePrevStep} 
                  disabled={currentStep === 1}
                  className="flex-1"
                >
                  Quay lại
                </Button>
                {currentStep < 3 ? (
                  <Button 
                    variant="default"
                    size="default"
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
                    variant="default"
                    size="default"
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