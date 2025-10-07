import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar, Search, Eye, Edit, X } from "lucide-react";

const bookings = [
  {
    id: "BK001",
    customer: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      email: "nguyenvana@email.com"
    },
    room: {
      number: "101",
      type: "Deluxe Ocean View"
    },
    checkIn: "2025-01-02",
    checkOut: "2025-01-05",
    nights: 3,
    guests: 2,
    total: 10500000,
    status: "confirmed",
    bookingDate: "2024-12-25",
    paymentStatus: "paid"
  },
  {
    id: "BK002",
    customer: {
      name: "Trần Thị B",
      phone: "0907654321",
      email: "tranthib@email.com"
    },
    room: {
      number: "201",
      type: "Junior Suite"
    },
    checkIn: "2025-01-03",
    checkOut: "2025-01-07",
    nights: 4,
    guests: 3,
    total: 20800000,
    status: "pending",
    bookingDate: "2024-12-28",
    paymentStatus: "pending"
  },
  {
    id: "BK003",
    customer: {
      name: "Lê Văn C",
      phone: "0903456789",
      email: "levanc@email.com"
    },
    room: {
      number: "301",
      type: "Family Suite"
    },
    checkIn: "2025-01-04",
    checkOut: "2025-01-08",
    nights: 4,
    guests: 4,
    total: 31200000,
    status: "confirmed",
    bookingDate: "2024-12-30",
    paymentStatus: "paid"
  },
  {
    id: "BK004",
    customer: {
      name: "Phạm Thị D",
      phone: "0909876543",
      email: "phamthid@email.com"
    },
    room: {
      number: "401",
      type: "Presidential Suite"
    },
    checkIn: "2025-01-05",
    checkOut: "2025-01-10",
    nights: 5,
    guests: 4,
    total: 75000000,
    status: "confirmed",
    bookingDate: "2025-01-01",
    paymentStatus: "paid"
  },
  {
    id: "BK005",
    customer: {
      name: "Hoàng Văn E",
      phone: "0901111111",
      email: "hoangvane@email.com"
    },
    room: {
      number: "102",
      type: "Deluxe Ocean View"
    },
    checkIn: "2025-01-06",
    checkOut: "2025-01-09",
    nights: 3,
    guests: 2,
    total: 10500000,
    status: "cancelled",
    bookingDate: "2024-12-20",
    paymentStatus: "refunded"
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
    case 'checked-in':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đã check-in</Badge>;
    case 'checked-out':  
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Đã check-out</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã thanh toán</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ thanh toán</Badge>;
    case 'refunded':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Đã hoàn tiền</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export function BookingManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.room.number.includes(searchTerm) ||
                         booking.customer.phone.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const matchesPayment = filterPayment === "all" || booking.paymentStatus === filterPayment;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đặt phòng</h1>
          <p className="text-gray-600">Theo dõi và quản lý tất cả đặt phòng</p>
        </div>
        
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Đặt phòng mới
        </Button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <p className="text-sm text-gray-600">Đã xác nhận</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <p className="text-sm text-gray-600">Chờ xử lý</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.status === 'cancelled').length}
            </div>
            <p className="text-sm text-gray-600">Đã hủy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {bookings.reduce((sum, b) => sum + b.total, 0).toLocaleString('vi-VN')}₫
            </div>
            <p className="text-sm text-gray-600">Tổng doanh thu</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo mã booking, tên khách, số phòng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái booking" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
                <SelectItem value="checked-in">Đã check-in</SelectItem>
                <SelectItem value="checked-out">Đã check-out</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thanh toán</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
                <SelectItem value="pending">Chờ thanh toán</SelectItem>
                <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold text-lg">{booking.id}</h3>
                    <p className="text-sm text-gray-600">Đặt ngày: {booking.bookingDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    {getStatusBadge(booking.status)}
                    {getPaymentStatusBadge(booking.paymentStatus)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Xem
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1">
                    <X className="h-4 w-4 mr-1" />
                    Hủy
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Thông tin khách hàng</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Tên:</span> {booking.customer.name}</p>
                    <p><span className="text-gray-600">Điện thoại:</span> {booking.customer.phone}</p>
                    <p><span className="text-gray-600">Email:</span> {booking.customer.email}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Thông tin phòng</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Phòng:</span> {booking.room.number}</p>
                    <p><span className="text-gray-600">Loại:</span> {booking.room.type}</p>
                    <p><span className="text-gray-600">Số khách:</span> {booking.guests} người</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Thời gian & Giá</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Check-in:</span> {booking.checkIn}</p>
                    <p><span className="text-gray-600">Check-out:</span> {booking.checkOut}</p>
                    <p><span className="text-gray-600">Số đêm:</span> {booking.nights} đêm</p>
                    <p className="font-medium text-lg text-primary">
                      {booking.total.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Không tìm thấy đặt phòng nào phù hợp với bộ lọc.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}