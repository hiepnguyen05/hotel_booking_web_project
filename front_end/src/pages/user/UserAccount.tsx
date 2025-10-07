import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useBookingStore } from '../../store/bookingStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
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
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function UserAccount() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuthStore();
  const { userBookings, fetchUserBookings, cancelBooking } = useBookingStore();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '0901234567', // Mock data
    address: '123 Đường ABC, Quận 1, TP.HCM' // Mock data
  });

  useEffect(() => {
    if (user) {
      fetchUserBookings();
      setProfileData({
        username: user.username,
        email: user.email,
        phone: '0901234567',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      });
    }
  }, [user, fetchUserBookings]);

  const handleSaveProfile = () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
    alert('Cập nhật thông tin thành công!');
  };

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      await logout();
      navigate('/');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) {
      const success = await cancelBooking(bookingId);
      if (success) {
        alert('Hủy đặt phòng thành công!');
      }
    }
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
          <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
        </div>
      </div>
    );
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
              onClick={handleLogout}
              className="text-red-600 border-red-600 hover:bg-red-50"
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
                    <p className="font-medium">{userBookings.length} lần</p>
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
                {userBookings.length > 0 ? (
                  <div className="space-y-4">
                    {userBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg overflow-hidden">
                        <div className="p-4 border-b">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            {/* Room Info */}
                            <div className="flex gap-4">
                              {booking.room?.images && booking.room.images.length > 0 ? (
                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                  <ImageWithFallback
                                    src={`http://localhost:5000${booking.room.images[0]}`}
                                    alt={booking.room.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <ImageIcon className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {booking.room?.name || `Phòng ${booking.roomId}`}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Mã đặt phòng: {booking.id}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Đặt ngày: {formatDate(booking.createdAt)}
                                </p>
                              </div>
                            </div>
                            
                            {/* Status Badges */}
                            <div className="flex flex-wrap gap-2">
                              {getStatusBadge(booking.status)}
                              {getPaymentStatusBadge(booking.paymentStatus)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500">Check-in</p>
                                <p className="text-sm font-medium">{formatDate(booking.checkIn)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500">Check-out</p>
                                <p className="text-sm font-medium">{formatDate(booking.checkOut)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500">Số khách</p>
                                <p className="text-sm font-medium">{booking.adults + booking.children}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500">Số đêm</p>
                                <p className="text-sm font-medium">{booking.nights}</p>
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
                                {formatCurrency(booking.totalAmount)}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/user/booking/${booking.id}/details`)}
                              >
                                Xem chi tiết
                              </Button>
                              
                              {booking.status === 'pending' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  Hủy đặt phòng
                                </Button>
                              )}
                              
                              {booking.status === 'confirmed' && booking.paymentStatus === 'paid' && (
                                <Button
                                  size="sm"
                                  onClick={() => navigate(`/rooms/${booking.roomId}`)}
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
                    <Button onClick={() => navigate('/rooms')}>
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
                    <Button variant="outline" size="sm">
                      Bật
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Đổi mật khẩu</h3>
                      <p className="text-sm text-gray-500">Cập nhật mật khẩu để bảo mật tài khoản</p>
                    </div>
                    <Button variant="outline" size="sm">
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
      </div>
    </div>
  );
}





