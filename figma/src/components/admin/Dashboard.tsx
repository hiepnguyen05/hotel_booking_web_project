import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Bed, Calendar, Users, DollarSign, TrendingUp, Clock } from "lucide-react";

const stats = [
  {
    title: "Tổng phòng",
    value: "48",
    icon: Bed,
    description: "4 loại phòng khác nhau"
  },
  {
    title: "Đặt phòng hôm nay",
    value: "12",
    icon: Calendar,
    description: "+8% so với hôm qua"
  },
  {
    title: "Khách hàng",
    value: "1,245",
    icon: Users,
    description: "+125 khách mới tháng này"
  },
  {
    title: "Doanh thu tháng",
    value: "850M",
    icon: DollarSign,
    description: "+15% so với tháng trước"
  }
];

const recentBookings = [
  {
    id: "BK001",
    customer: "Nguyễn Văn A",
    room: "Deluxe Ocean View",
    checkIn: "2025-01-02",
    checkOut: "2025-01-05",
    status: "confirmed",
    total: "10,500,000"
  },
  {
    id: "BK002",
    customer: "Trần Thị B",
    room: "Junior Suite",
    checkIn: "2025-01-03",
    checkOut: "2025-01-07",
    status: "pending",
    total: "20,800,000"
  },
  {
    id: "BK003",
    customer: "Lê Văn C",
    room: "Family Suite",
    checkIn: "2025-01-04",
    checkOut: "2025-01-08",
    status: "confirmed",
    total: "31,200,000"
  },
  {
    id: "BK004",
    customer: "Phạm Thị D",
    room: "Presidential Suite",
    checkIn: "2025-01-05",
    checkOut: "2025-01-10",
    status: "confirmed",
    total: "75,000,000"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã xác nhận</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ xử lý</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã hủy</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hoạt động khách sạn</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Đặt phòng gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{booking.customer}</p>
                      <p className="text-sm text-gray-600">{booking.room}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{booking.checkIn} - {booking.checkOut}</p>
                    <p className="text-sm text-gray-600">{booking.total}₫</p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Bed className="h-8 w-8 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Quản lý phòng</h3>
            <p className="text-sm text-gray-600">Xem và cập nhật thông tin phòng</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Đặt phòng mới</h3>
            <p className="text-sm text-gray-600">Tạo đặt phòng cho khách hàng</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Khách hàng</h3>
            <p className="text-sm text-gray-600">Quản lý thông tin khách hàng</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}