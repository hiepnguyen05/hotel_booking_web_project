import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Loader2, Calendar, Users, CreditCard, ArrowLeft, RefreshCw } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';

interface Booking {
  _id: string;
  bookingCode: string;
  room: {
    name: string;
    type: string;
    description: string;
    amenities: string[];
  };
  checkInDate: string;
  checkOutDate: string;
  adultCount: number;
  childCount: number;
  roomCount: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  notes?: string;
}

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null as Booking | null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (id) {
      loadBooking(id);
      
      // Start polling for updates
      const interval = setInterval(() => {
        checkForBookingUpdates(id);
      }, 5000); // Poll every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [id]);

  const loadBooking = async (bookingId: string) => {
    try {
      setLoading(true);
      const bookingData: any = await bookingService.getBookingById(bookingId);
      setBooking(bookingData);
    } catch (error) {
      console.error('Error loading booking:', error);
      toast.error('Có lỗi xảy ra khi tải thông tin đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  const checkForBookingUpdates = async (bookingId: string) => {
    try {
      setPolling(true);
      const bookingData: any = await bookingService.getBookingById(bookingId);
      
      // Check if booking status has changed
      if (booking && 
          (booking.status !== bookingData.status || 
           booking.paymentStatus !== bookingData.paymentStatus)) {
        // Show toast notification for updated booking
        if (bookingData.paymentStatus === 'paid' && bookingData.status === 'confirmed') {
          toast.success('Đặt phòng đã được xác nhận!');
        } else if (bookingData.paymentStatus === 'failed') {
          toast.error('Thanh toán thất bại!');
        }
        
        setBooking(bookingData);
      }
    } catch (error) {
      console.error('Error checking for booking updates:', error);
    } finally {
      setPolling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default">Đã xác nhận</Badge>;
      case 'pending':
        return <Badge variant="secondary">Chờ xử lý</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>;
      case 'completed':
        return <Badge variant="default">Đã hoàn thành</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default">Đã thanh toán</Badge>;
      case 'pending':
        return <Badge variant="secondary">Chờ thanh toán</Badge>;
      case 'failed':
        return <Badge variant="destructive">Thất bại</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Đang tải thông tin đặt phòng...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy thông tin đặt phòng</p>
          <Button 
            variant="outline" 
            size="default"
            className=""
            onClick={() => navigate('/user/bookings')}
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            size="default"
            className=""
            onClick={() => navigate('/user/bookings')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Button 
            variant="outline" 
            size="default"
            className=""
            onClick={() => checkForBookingUpdates(booking._id)}
            disabled={polling}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${polling ? 'animate-spin' : ''}`} />
            {polling ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Chi tiết đặt phòng</CardTitle>
                <p className="text-gray-500 mt-1">Mã đặt phòng: {booking.bookingCode}</p>
              </div>
              <div className="flex gap-2">
                {getStatusBadge(booking.status)}
                {getPaymentStatusBadge(booking.paymentStatus)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Thông tin phòng</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Tên phòng:</span> {booking.room.name}</p>
                  <p><span className="font-medium">Loại phòng:</span> {booking.room.type}</p>
                  <p><span className="font-medium">Số lượng:</span> {booking.roomCount} phòng</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Thời gian lưu trú</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày nhận</p>
                      <p className="font-medium">
                        {format(new Date(booking.checkInDate), 'dd/MM/yyyy', { locale: vi })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Ngày trả</p>
                      <p className="font-medium">
                        {format(new Date(booking.checkOutDate), 'dd/MM/yyyy', { locale: vi })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Thông tin khách</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Người lớn:</span> {booking.adultCount}</p>
                  <p><span className="font-medium">Trẻ em:</span> {booking.childCount}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Thông tin thanh toán</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Tổng tiền</p>
                      <p className="font-bold text-lg text-primary">
                        {booking.totalPrice.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {booking.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Ghi chú</h3>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{booking.notes}</p>
              </div>
            )}
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                Đặt ngày: {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}