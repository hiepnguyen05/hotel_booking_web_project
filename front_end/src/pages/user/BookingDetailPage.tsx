import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../store/bookingStore';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  CreditCard, 
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

// Status badge component
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã xác nhận</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ xử lý</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã hủy</Badge>;
    case 'completed':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Đã hoàn thành</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

// Payment status badge component
const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã thanh toán</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chưa thanh toán</Badge>;
    case 'failed':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Thanh toán thất bại</Badge>;
    case 'refunded':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đã hoàn tiền</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedBooking, isLoading, error, fetchBookingById, clearError } = useBookingStore();
  const [roomImages, setRoomImages] = useState([] as string[]);

  useEffect(() => {
    if (id) {
      fetchBookingById(id);
    }
  }, [id, fetchBookingById]);

  useEffect(() => {
    if (selectedBooking && selectedBooking.room && typeof selectedBooking.room === 'object') {
      setRoomImages((selectedBooking.room as any).images || []);
    }
  }, [selectedBooking]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-600">Đang tải thông tin đặt phòng...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            variant="default" 
            size="default"
            className="mt-4" 
            onClick={() => {
              clearError();
              if (id) fetchBookingById(id);
            }}
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedBooking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin đặt phòng</h2>
          <Button variant="default" size="default" className="" onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </div>
    );
  }

  // Get room information
  const roomInfo = selectedBooking.room && typeof selectedBooking.room === 'object' ? selectedBooking.room as any : null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="default"
          className="p-2 mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Chi tiết đặt phòng</h1>
            <p className="text-gray-600">Mã đặt phòng: #{selectedBooking.bookingCode}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(selectedBooking.status)}
            {getPaymentStatusBadge(selectedBooking.paymentStatus)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Thông tin phòng
              </CardTitle>
              <CardDescription>
                Chi tiết về phòng bạn đã đặt
              </CardDescription>
            </CardHeader>
            <CardContent>
              {roomInfo ? (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {roomImages.length > 0 && (
                      <div className="md:w-1/3">
                        <img 
                          src={roomImages[0]} 
                          alt={roomInfo.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className={roomImages.length > 0 ? "md:w-2/3" : ""}>
                      <h3 className="text-xl font-bold">{roomInfo.name}</h3>
                      <p className="text-gray-600 mt-1">{roomInfo.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-600">Loại phòng</p>
                          <p className="font-medium">{roomInfo.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Sức chứa</p>
                          <p className="font-medium">{roomInfo.capacity} người</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Giá mỗi đêm</p>
                          <p className="font-medium">{(roomInfo.pricePerNight || 0).toLocaleString('vi-VN')}₫</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Trạng thái</p>
                          <p className="font-medium">{roomInfo.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Không có thông tin phòng</p>
              )}
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Thông tin đặt phòng
              </CardTitle>
              <CardDescription>
                Chi tiết về đơn đặt phòng của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Ngày nhận phòng</p>
                  <p className="font-medium">
                    {selectedBooking.checkInDate ? new Date(selectedBooking.checkInDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày trả phòng</p>
                  <p className="font-medium">
                    {selectedBooking.checkOutDate ? new Date(selectedBooking.checkOutDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số đêm</p>
                  <p className="font-medium">
                    {selectedBooking.checkInDate && selectedBooking.checkOutDate ? 
                      Math.ceil((new Date(selectedBooking.checkOutDate).getTime() - new Date(selectedBooking.checkInDate).getTime()) / (1000 * 60 * 60 * 24)) : 
                      'N/A'} đêm
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày đặt</p>
                  <p className="font-medium">
                    {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleString('vi-VN') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số lượng người</p>
                  <p className="font-medium">
                    {selectedBooking.adultCount + selectedBooking.childCount} khách 
                    ({selectedBooking.adultCount} người lớn, {selectedBooking.childCount} trẻ em)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số lượng phòng</p>
                  <p className="font-medium">{selectedBooking.roomCount} phòng</p>
                </div>
              </div>
              
              {selectedBooking.notes && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Ghi chú</p>
                  <p className="font-medium">{selectedBooking.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Tổng kết thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Giá phòng mỗi đêm</span>
                  <span>{roomInfo ? (roomInfo.pricePerNight || 0).toLocaleString('vi-VN') : 0}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Số đêm</span>
                  <span>
                    {selectedBooking.checkInDate && selectedBooking.checkOutDate ? 
                      Math.ceil((new Date(selectedBooking.checkOutDate).getTime() - new Date(selectedBooking.checkInDate).getTime()) / (1000 * 60 * 60 * 24)) : 
                      0} đêm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Số lượng phòng</span>
                  <span>{selectedBooking.roomCount}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
                  <span>Tổng tiền</span>
                  <span className="text-primary">{(selectedBooking.totalPrice || 0).toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Họ và tên</p>
                  <p className="font-medium">{selectedBooking.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedBooking.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-medium">{selectedBooking.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}