import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Bed,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ClockIcon
} from "lucide-react";
import { bookingService } from '../../services/bookingService';

interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  totalRevenue: number;
  monthlyRevenue: { year: number; month: number; revenue: number; count: number }[];
}

interface RecentBooking {
  _id: string;
  id: string;
  bookingCode: string;
  user: {
    username: string;
    email: string;
  };
  room: {
    name: string;
  };
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Đã xác nhận
      </Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
        <ClockIcon className="h-3 w-3" />
        Chờ xử lý
      </Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Đã hủy
      </Badge>;
    case 'completed':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Đã hoàn thành
      </Badge>;
    default:
      return <Badge className="flex items-center gap-1">
        <ClockIcon className="h-3 w-3" />
        {status}
      </Badge>;
  }
};

export function Dashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: []
  } as BookingStats);

  const [recentBookings, setRecentBookings] = useState([] as RecentBooking[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Loading dashboard data...');

        // Load booking stats
        console.log('Calling bookingService.getBookingStats()');
        const statsData = await bookingService.getBookingStats();
        console.log('Received booking stats data:', statsData);
        setStats(statsData);

        // Fetch recent bookings from API
        console.log('Fetching recent bookings from API');
        const bookingsData = await bookingService.getAllBookings({
          page: 1,
          limit: 5
        });
        console.log('Received recent bookings data:', bookingsData);

        // Transform bookings data to match RecentBooking interface
        const transformedBookings = bookingsData.bookings.map(booking => ({
          _id: booking._id,
          id: booking.id || booking._id,
          bookingCode: booking.bookingCode,
          user: typeof booking.user === 'string' ? { username: 'Unknown', email: '' } : booking.user,
          room: typeof booking.room === 'string' ? { name: 'Unknown Room' } : booking.room,
          checkInDate: booking.checkInDate,
          checkOutDate: booking.checkOutDate,
          status: booking.status,
          totalPrice: booking.totalPrice,
          createdAt: booking.createdAt
        }));

        setRecentBookings(transformedBookings);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set default stats in case of error
        setStats({
          totalBookings: 0,
          confirmedBookings: 0,
          pendingBookings: 0,
          cancelledBookings: 0,
          completedBookings: 0,
          totalRevenue: 0,
          monthlyRevenue: []
        });
        setRecentBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // Format number
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const statCards = [
    {
      title: "Tổng đặt phòng",
      value: stats.totalBookings?.toString() || "0",
      icon: Bed,
      description: "Tổng số đặt phòng",
      change: "",
      changeType: "positive"
    },
    {
      title: "Chờ xác nhận",
      value: stats.pendingBookings?.toString() || "0",
      icon: Calendar,
      description: "Đặt phòng chờ xử lý",
      change: "",
      changeType: "positive"
    },
    {
      title: "Đã xác nhận",
      value: stats.confirmedBookings?.toString() || "0",
      icon: CheckCircle,
      description: "Đặt phòng đã xác nhận",
      change: "",
      changeType: "positive"
    },
    {
      title: "Doanh thu",
      value: `${formatCurrency(stats.totalRevenue || 0)}₫`,
      icon: DollarSign,
      description: "Tổng doanh thu",
      change: "",
      changeType: "positive"
    }
  ];

  console.log('Rendering dashboard with stats:', stats);
  console.log('Stat cards:', statCards);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hoạt động khách sạn</p>
        </div>

        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <span className="ml-3">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hoạt động khách sạn</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-600">{stat.description}</p>
                <Badge
                  className={stat.changeType === "positive" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupancy Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Tỷ lệ lấp đầy theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Biểu đồ tỷ lệ lấp đầy sẽ hiển thị ở đây</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <div key={booking._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {booking.user?.username || 'Khách hàng'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {booking.room?.name || 'Phòng không xác định'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-xs font-medium">
                        {new Date(booking.checkInDate).toLocaleDateString('vi-VN')} - {new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatCurrency(booking.totalPrice)}₫
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              ))}

              {recentBookings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Không có dữ liệu đặt phòng gần đây</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="p-6 text-center">
            <Bed className="h-8 w-8 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold mb-2">Quản lý phòng</h3>
            <p className="text-sm text-gray-600">Xem và cập nhật thông tin phòng</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-green-500">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-4 text-green-600" />
            <h3 className="font-semibold mb-2">Đặt phòng mới</h3>
            <p className="text-sm text-gray-600">Tạo đặt phòng cho khách hàng</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-4 text-purple-600" />
            <h3 className="font-semibold mb-2">Khách hàng</h3>
            <p className="text-sm text-gray-600">Quản lý thông tin khách hàng</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}