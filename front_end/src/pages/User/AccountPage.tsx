import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { CancelBookingForm } from '../../components/CancelBookingForm';
import { useToast } from '../../contexts/ToastContext';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Settings, 
  LogOut, 
  Edit3, 
  Save,
  MapPin,
  Users,
  Clock,
  CreditCard,
  ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { bookingService } from '../../services/bookingService';
import { Booking } from '../../types/booking';

export function AccountPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '0901234567', // Mock data
    address: '123 Đường ABC, Quận 1, TP.HCM' // Mock data
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      setProfileData({
        username: user.username,
        email: user.email,
        phone: '0901234567',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      });
      fetchUserBookings();
    }
  }, [user, isAuthenticated, navigate]);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const userBookings = await bookingService.getUserBookings();
      setBookings(userBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      addToast('Lỗi', 'Có lỗi xảy ra khi tải danh sách đặt phòng. Vui lòng thử lại.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
    addToast('Thành công', 'Cập nhật thông tin thành công!', 'success');
  };

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      await logout();
      addToast('Thành công', 'Đăng xuất thành công!', 'success');
      navigate('/');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    // Find the booking in the bookings array
    const booking = bookings.find(b => b.id === bookingId);
    
    // Check if booking exists
    if (!booking) {
      addToast('Lỗi', 'Không tìm thấy thông tin đặt phòng', 'error');
      return;
    }
    
    // For paid bookings, create a cancellation request instead of direct cancellation
    if (booking.paymentStatus === 'paid') {
      // Show cancellation form
      setSelectedBookingId(bookingId);
      setShowCancelForm(true);
      return;
    }
    
    // For unpaid bookings, check if booking is older than 24 hours
    const bookingTime = new Date(booking.createdAt).getTime();
    const currentTime = new Date().getTime();
    const hoursDifference = (currentTime - bookingTime) / (1000 * 60 * 60);
    
    if (hoursDifference > 24) {
      addToast('Lỗi', 'Không thể hủy đặt phòng sau 24 giờ kể từ thời điểm đặt', 'error');
      return;
    }
    
    // Confirm cancellation
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) {
      try {
        const success = await bookingService.cancelBooking(bookingId);
        if (success) {
          addToast('Thành công', 'Hủy đặt phòng thành công!', 'success');
          // Refresh bookings list
          fetchUserBookings();
        } else {
          addToast('Lỗi', 'Có lỗi xảy ra khi hủy đặt phòng. Vui lòng thử lại.', 'error');
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        addToast('Lỗi', 'Có lỗi xảy ra khi hủy đặt phòng. Vui lòng thử lại.', 'error');
      }
    }
  };

  const handleCancelBookingSubmit = async (reason: string) => {
    try {
      // Create cancellation request
      await bookingService.createCancellationRequest(selectedBookingId, reason);
      addToast('Thành công', 'Yêu cầu hủy đặt phòng đã được gửi. Vui lòng chờ quản trị viên duyệt.', 'success');
      // Close form
      setShowCancelForm(false);
      // Refresh bookings list
      fetchUserBookings();
    } catch (error: any) {
      console.error('Error creating cancellation request:', error);
      addToast('Lỗi', 'Có lỗi xảy ra khi gửi yêu cầu hủy đặt phòng: ' + (error.message || 'Vui lòng thử lại.'), 'error');
      // Close form even if there's an error
      setShowCancelForm(false);
    }
  };

  const canCancelBooking = (booking: any) => {
    // If there's already a cancellation request, cannot cancel again
    if (booking.cancellationRequest) {
      return false;
    }
    
    // For paid bookings, user can always request cancellation
    if (booking.paymentStatus === 'paid') {
      return booking.status !== 'cancelled' && booking.status !== 'completed';
    }
    
    // For unpaid bookings, only pending bookings can be cancelled within 24 hours
    if (booking.status !== 'pending') {
      return false;
    }
    
    // Check if booking is older than 24 hours
    const bookingTime = new Date(booking.createdAt).getTime();
    const currentTime = new Date().getTime();
    const hoursDifference = (currentTime - bookingTime) / (1000 * 60 * 60);
    
    return hoursDifference <= 24;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Đã xác nhận</Badge>;
      case 'pending':
        return <Badge variant="secondary">Chờ xác nhận</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Hoàn thành</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Đã thanh toán</Badge>;
      case 'pending':
        return <Badge variant="secondary">Chờ thanh toán</Badge>;
      case 'failed':
        return <Badge variant="destructive">Thanh toán thất bại</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Đã hoàn tiền</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCancellationStatusBadge = (cancellationRequest: any) => {
    if (!cancellationRequest) {
      return null;
    }
    
    switch (cancellationRequest.status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Đã duyệt</Badge>;
      case 'pending':
        return <Badge variant="secondary">Chờ duyệt</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Bị từ chối</Badge>;
      default:
        return <Badge variant="outline">{cancellationRequest.status}</Badge>;
    }
  };

  // Function to get room image URL
  const getRoomImageUrl = (booking: any) => {
    // If room is an object with images array
    if (booking.room && typeof booking.room === 'object' && 'images' in booking.room && Array.isArray(booking.room.images) && booking.room.images.length > 0) {
      // Assuming images are stored with full URLs or relative to the backend
      const image = booking.room.images[0];
      // If it's already a full URL, return as is
      if (image.startsWith('http')) {
        return image;
      }
      // Otherwise, construct the full URL
      return `${(import.meta as any).env?.VITE_API_BASE_URL || 'https://hotel-booking-web-project.onrender.com/api'}${image}`;
    }
    // Default placeholder
    return '';
  };

  // Function to get room name
  const getRoomName = (booking: any) => {
    if (booking.room && typeof booking.room === 'object' && 'name' in booking.room) {
      return booking.room.name;
    }
    return `Phòng ${booking.room}`;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Tài khoản của tôi</h1>
              <p className="text-gray-600">Quản lý thông tin cá nhân và đặt phòng</p>
            </div>
            <Button
              variant="outline"
              size="default"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Hồ sơ
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Đặt phòng
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Cài đặt
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Thông tin cá nhân
                    </CardTitle>
                    <CardDescription>
                      Quản lý thông tin tài khoản của bạn
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="default"
                    className=""
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Họ và tên</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Trạng thái tài khoản</Label>
                    <div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Hoạt động
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <div>
                    <Label className="text-sm text-gray-500">Ngày tham gia</Label>
                    <p className="font-medium">01/01/2024</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Tổng đặt phòng</Label>
                    <p className="font-medium">{bookings.length} lần</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Lịch sử đặt phòng
                </CardTitle>
                <CardDescription>
                  Xem và quản lý các đặt phòng của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg overflow-hidden">
                        <div className="p-4 border-b">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            {/* Room Info */}
                            <div className="flex gap-4">
                              <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                {getRoomImageUrl(booking) ? (
                                  <img 
                                    src={getRoomImageUrl(booking)} 
                                    alt={getRoomName(booking)} 
                                    className="w-full h-full object-cover rounded-lg"
                                    onError={(e) => {
                                      // Handle image loading error
                                      const target = e.target as HTMLImageElement;
                                      target.onerror = null;
                                      target.parentElement!.innerHTML = '<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                                    }}
                                  />
                                ) : (
                                  <ImageIcon className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                            
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {getRoomName(booking)}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Mã đặt phòng: {booking.id}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Đặt ngày: {format(new Date(booking.createdAt), 'dd/MM/yyyy', { locale: vi })}
                                </p>
                              </div>
                            </div>

                            {/* Status Badges */}
                            <div className="flex flex-wrap gap-2">
                              {getStatusBadge(booking.status)}
                              {getPaymentStatusBadge(booking.paymentStatus)}
                              {getCancellationStatusBadge(booking.cancellationRequest)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500">Check-in</p>
                                <p className="text-sm font-medium">{format(new Date(booking.checkInDate), 'dd/MM/yyyy', { locale: vi })}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500">Check-out</p>
                                <p className="text-sm font-medium">{format(new Date(booking.checkOutDate), 'dd/MM/yyyy', { locale: vi })}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500">Số khách</p>
                                <p className="text-sm font-medium">{booking.adultCount + booking.childCount}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500">Số đêm</p>
                                <p className="text-sm font-medium">{Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24))}</p>
                              </div>
                            </div>
                          </div>
                          
                          {booking.notes && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500 mb-1">Yêu cầu đặc biệt:</p>
                              <p className="text-sm">{booking.notes}</p>
                            </div>
                          )}
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-gray-500" />
                              <span className="text-lg font-bold text-primary">
                                {booking.totalPrice?.toLocaleString('vi-VN')}₫
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className=""
                                onClick={() => navigate(`/user/bookings/${booking.id}`)}
                              >
                                Xem chi tiết
                              </Button>
                              
                              {canCancelBooking(booking) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  Hủy đặt phòng
                                </Button>
                              )}
                              
                              {booking.status === 'confirmed' && booking.paymentStatus === 'paid' && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className=""
                                  onClick={() => navigate(`/rooms/${booking.room}`)}
                                >
                                  Đặt lại
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có đặt phòng nào</h3>
                    <p className="text-gray-600 mb-4">
                      Bạn chưa có đặt phòng nào. Hãy khám phá các phòng đẹp của chúng tôi!
                    </p>
                    <Button variant="default" size="default" className="" onClick={() => navigate('/rooms')}>
                      Khám phá phòng
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Cài đặt tài khoản
                </CardTitle>
                <CardDescription>
                  Quản lý cài đặt và bảo mật tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Thông báo email</h3>
                      <p className="text-sm text-gray-500">Nhận thông báo về đặt phòng qua email</p>
                    </div>
                    <Button variant="outline" size="sm" className="">
                      Bật
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Đổi mật khẩu</h3>
                      <p className="text-sm text-gray-500">Cập nhật mật khẩu để bảo mật tài khoản</p>
                    </div>
                    <Button variant="outline" size="sm" className="">
                      Đổi mật khẩu
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Xóa tài khoản</h3>
                      <p className="text-sm text-gray-500">Xóa vĩnh viễn tài khoản và dữ liệu</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                      Xóa tài khoản
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <CancelBookingForm 
          open={showCancelForm}
          onOpenChange={setShowCancelForm}
          onSubmit={handleCancelBookingSubmit}
          bookingId={selectedBookingId}
        />
      </div>
    </div>
  );
}