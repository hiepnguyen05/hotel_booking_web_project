import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowLeft, User, Calendar, CreditCard, Settings, LogOut, Edit } from "lucide-react";

interface UserAccountProps {
  user: any;
  onBack: () => void;
  onLogout: () => void;
}

const mockBookings = [
  {
    id: "BK001",
    roomName: "Deluxe Ocean View",
    checkIn: "2025-01-02",
    checkOut: "2025-01-05",
    nights: 3,
    adults: 2,
    children: 0,
    guests: 2,
    total: 10500000,
    status: "confirmed", 
    bookingDate: "2024-12-25"
  },
  {
    id: "BK002",
    roomName: "Junior Suite", 
    checkIn: "2024-12-20",
    checkOut: "2024-12-23",
    nights: 3,
    adults: 2,
    children: 1,
    guests: 3,
    total: 15600000,
    status: "completed",
    bookingDate: "2024-11-15"
  },
  {
    id: "BK003",
    roomName: "Family Suite",
    checkIn: "2024-11-10", 
    checkOut: "2024-11-12",
    nights: 2,
    adults: 2,
    children: 2,
    guests: 4,
    total: 15600000,
    status: "cancelled",
    bookingDate: "2024-10-20"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã xác nhận</Badge>;
    case 'completed':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Hoàn thành</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã hủy</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ xử lý</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export function UserAccount({ user, onBack, onLogout }: UserAccountProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone
  });

  const handleSaveProfile = () => {
    // Save profile logic here
    setIsEditing(false);
    // Update user data
  };

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tài khoản của tôi</h1>
              <p className="text-gray-600">Quản lý thông tin cá nhân và đặt phòng</p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Hồ sơ
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Đặt phòng
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-600">Họ và tên</Label>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Email</Label>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Số điện thoại</Label>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-600">Trạng thái tài khoản</Label>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Ngày tham gia</Label>
                        <p className="font-medium">01/01/2024</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Tổng đặt phòng</Label>
                        <p className="font-medium">{mockBookings.length} lần</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editName">Họ và tên</Label>
                        <Input
                          id="editName"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editPhone">Số điện thoại</Label>
                        <Input
                          id="editPhone"
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editEmail">Email</Label>
                      <Input
                        id="editEmail"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile}>
                        Lưu thay đổi
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Hủy
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử đặt phòng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{booking.id}</h4>
                          <p className="text-sm text-gray-600">Đặt ngày: {booking.bookingDate}</p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Phòng</p>
                          <p className="font-medium">{booking.roomName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Thời gian</p>
                          <p className="font-medium">{booking.checkIn} - {booking.checkOut}</p>
                          <p className="text-xs text-gray-600">{booking.nights} đêm, {booking.adults} người lớn, {booking.children} trẻ em</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tổng tiền</p>
                          <p className="font-medium text-primary">{booking.total.toLocaleString('vi-VN')}₫</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">
                          Xem chi tiết
                        </Button>
                        {booking.status === 'confirmed' && (
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            Hủy đặt phòng
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt thông báo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email thông báo</p>
                      <p className="text-sm text-gray-600">Nhận thông báo về đặt phòng qua email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS thông báo</p>
                      <p className="text-sm text-gray-600">Nhận thông báo về đặt phòng qua SMS</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Khuyến mãi và ưu đãi</p>
                      <p className="text-sm text-gray-600">Nhận thông tin về các chương trình khuyến mãi</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bảo mật</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Đổi mật khẩu
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Xác thực hai bước
                  </Button>
                  <Separator />
                  <Button variant="destructive" className="w-full">
                    Xóa tài khoản
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}