import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { 
  User, 
  Calendar, 
  CreditCard, 
  Settings, 
  Edit3, 
  Eye, 
  EyeOff,
  CheckCircle,
  Clock,
  XCircle,
  Star
} from "lucide-react";
import { useAuthStore } from '../../store/authStore';
import { bookingService } from '../../services/bookingService';
import { getFullImageUrl } from '../../utils/imageUtils';

interface Booking {
  _id: string;
  id: string;
  room: {
    _id: string;
    name: string;
    images: string[];
  };
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface Review {
  _id: string;
  room: {
    _id: string;
    name: string;
    images: string[];
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export function UserAccount() {
  const { user, logout } = useAuthStore();
  const [bookings, setBookings] = useState([] as Booking[]);
  const [reviews, setReviews] = useState([] as Review[]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load bookings
        const userBookings = await bookingService.getUserBookings();
        setBookings(userBookings);
        
        // Load reviews - for now we'll set empty array since reviewService doesn't exist
        setReviews([]);
      } catch (error) {
        console.error('Error loading data:', error);
        // Show error in console for now since toast doesn't exist
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Đã xác nhận
        </Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Chờ xử lý
        </Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Đã hủy
        </Badge>;
      default:
        return <Badge className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {status}
        </Badge>;
    }
  };

  const getRoomImage = (room: { images: string[] }) => {
    if (room.images && room.images.length > 0) {
      return getFullImageUrl(room.images[0]);
    }
    return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTkyMjkwNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem thông tin tài khoản</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Tài khoản của tôi</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và đặt phòng của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-gray-200 rounded-full p-3">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{user.username}</h2>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mật khẩu</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">
                        {showPassword ? '••••••••' : '********'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className=""
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="default"
                    className="w-full"
                    onClick={logout}
                  >
                    Đăng xuất
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bookings" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Đặt phòng
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Đánh giá
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Cài đặt
                </TabsTrigger>
              </TabsList>

              {/* Bookings Tab */}
              <TabsContent value="bookings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Lịch sử đặt phòng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    ) : bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex gap-4">
                              <img 
                                src={getRoomImage(booking.room)} 
                                alt={booking.room.name}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold">{booking.room.name}</h3>
                                    <p className="text-gray-600 text-sm">
                                      {new Date(booking.checkInDate).toLocaleDateString('vi-VN')} - {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p className="text-gray-900 font-semibold">{booking.totalPrice.toLocaleString('vi-VN')}₫</p>
                                  </div>
                                  {getStatusBadge(booking.status)}
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>Đặt ngày {new Date(booking.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Chưa có đặt phòng nào</h3>
                        <p className="text-gray-600">Bạn chưa thực hiện đặt phòng nào.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Đánh giá của tôi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    ) : reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex gap-4">
                              <img 
                                src={getRoomImage(review.room)} 
                                alt={review.room.name}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold">{review.room.name}</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star 
                                          key={i} 
                                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                        />
                                      ))}
                                      <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
                                    </div>
                                    <p className="text-gray-700 mt-2">{review.comment}</p>
                                  </div>
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>Đánh giá ngày {new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Chưa có đánh giá nào</h3>
                        <p className="text-gray-600">Bạn chưa đánh giá phòng nào.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Cài đặt tài khoản
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Thông tin cá nhân</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Tên người dùng</label>
                            <div className="p-3 bg-gray-50 rounded-md">{user.username}</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <div className="p-3 bg-gray-50 rounded-md">{user.email}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Bảo mật</h3>
                        <Button variant="outline" size="default" className="" disabled>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Thay đổi mật khẩu
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}