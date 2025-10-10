import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Loader2, Calendar, Users, CreditCard } from 'lucide-react';
import { roomService } from '../../services/roomService';
import { bookingService } from '../../services/bookingService';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Room {
  _id: string;
  name: string;
  price: number;
  type: string;
  capacity: number;
}

export function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [room, setRoom] = useState(null as Room | null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Booking form state
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [roomCount, setRoomCount] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      loadRoom(id);
    }
    
    // Pre-fill user info if available
    if (user) {
      setFullName(user.username);
      setEmail(user.email);
    }
  }, [id, user]);

  const loadRoom = async (roomId: string) => {
    try {
      setLoading(true);
      const roomData = await roomService.getRoomById(roomId);
      setRoom(roomData);
    } catch (error) {
      console.error('Error loading room:', error);
      toast.error('Có lỗi xảy ra khi tải thông tin phòng');
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const calculateTotalPrice = () => {
    if (!room) return 0;
    
    const nights = calculateNights();
    return room.price * nights * roomCount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!room || !checkInDate || !checkOutDate) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkIn >= checkOut) {
      toast.error('Ngày trả phòng phải sau ngày nhận phòng');
      return;
    }
    
    // Validate guest counts
    const totalGuests = adultCount + childCount;
    if (totalGuests > room.capacity * roomCount) {
      toast.error(`Tổng số khách không được vượt quá ${room.capacity * roomCount} người`);
      return;
    }
    
    try {
      setBookingLoading(true);
      
      const bookingData = {
        roomId: room._id,
        checkInDate,
        checkOutDate,
        adultCount,
        childCount,
        roomCount,
        fullName,
        email,
        phone,
        notes,
        paymentMethod: 'online' as const
      };
      
      const result = await bookingService.createBooking(bookingData);
      
      if (result) {
        toast.success('Đặt phòng thành công!');
        // Navigate to payment page
        navigate(`/user/bookings/${result._id}/payment`);
      } else {
        toast.error('Có lỗi xảy ra khi đặt phòng');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Có lỗi xảy ra khi đặt phòng');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Đang tải thông tin phòng...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy thông tin phòng</p>
          <Button 
            variant="default"
            size="default"
            className=""
            onClick={() => navigate('/rooms')}
          >
            Quay lại danh sách phòng
          </Button>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="default"
            className=""
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin đặt phòng</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="checkInDate">Ngày nhận phòng</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="checkInDate"
                          type="date"
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          className="pl-10"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="checkOutDate">Ngày trả phòng</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="checkOutDate"
                          type="date"
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          className="pl-10"
                          min={checkInDate || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="adultCount">Người lớn</Label>
                      <Input
                        id="adultCount"
                        type="number"
                        min="1"
                        value={adultCount}
                        onChange={(e) => setAdultCount(parseInt(e.target.value) || 1)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="childCount">Trẻ em</Label>
                      <Input
                        id="childCount"
                        type="number"
                        min="0"
                        value={childCount}
                        onChange={(e) => setChildCount(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="roomCount">Số phòng</Label>
                      <Input
                        id="roomCount"
                        type="number"
                        min="1"
                        value={roomCount}
                        onChange={(e) => setRoomCount(parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Họ và tên</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Yêu cầu đặc biệt, giờ nhận phòng, v.v."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="default"
                    size="default"
                    className="w-full"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      'Tiếp tục thanh toán'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Booking Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Thông tin phòng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{room.name}</h3>
                  <p className="text-sm text-gray-500">{room.type}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Giá mỗi đêm:</span>
                    <span>{room.price.toLocaleString('vi-VN')}₫</span>
                  </div>
                  
                  {nights > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span>Số đêm:</span>
                        <span>{nights} đêm</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Số phòng:</span>
                        <span>{roomCount} phòng</span>
                      </div>
                      
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Tổng tiền:</span>
                          <span className="text-primary">{totalPrice.toLocaleString('vi-VN')}₫</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Tối đa {room.capacity * roomCount} người</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}