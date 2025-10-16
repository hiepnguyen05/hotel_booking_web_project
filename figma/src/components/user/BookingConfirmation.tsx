import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { CheckCircle, Calendar, Users, MapPin, Phone, Mail, Download, Home } from "lucide-react";

interface BookingConfirmationProps {
  booking: any;
  onBackToHome: () => void;
  onViewAccount: () => void;
}

export function BookingConfirmation({ booking, onBackToHome, onViewAccount }: BookingConfirmationProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl text-green-600">Đặt phòng thành công!</CardTitle>
            <p className="text-gray-600">Cảm ơn bạn đã chọn NgocHiepHotel</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking ID */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">Mã đặt phòng của bạn</p>
              <p className="text-2xl font-bold text-green-800">{booking.id}</p>
            </div>

            {/* Hotel Info */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">NgocHiepHotel</h3>
              <p className="text-gray-600 flex items-center justify-center">
                <MapPin className="h-4 w-4 mr-1" />
                123 Đường Biển, Thành phố Nha Trang, Khánh Hòa
              </p>
            </div>

            <Separator />

            {/* Booking Details */}
            <div>
              <h4 className="font-semibold mb-4">Chi tiết đặt phòng</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Phòng</p>
                    <p className="font-medium">{booking.roomName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Khách hàng</p>
                    <p className="font-medium">{booking.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Khách</p>
                    <p className="font-medium">{booking.adults || 2} người lớn, {booking.children || 0} trẻ em</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {booking.checkIn}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {booking.checkOut}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số đêm</p>
                    <p className="font-medium">{booking.nights} đêm</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Info */}
            <div>
              <h4 className="font-semibold mb-4">Thông tin thanh toán</h4>
              <div className="flex justify-between items-center mb-2">
                <span>Tổng tiền</span>
                <span className="text-xl font-bold text-primary">{booking.total.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Trạng thái</span>
                <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>
              </div>
            </div>

            <Separator />

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Thông tin liên hệ</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Hotline: 1900-1000 (24/7)
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email: booking@ngochiepotel.vn
                </p>
              </div>
            </div>

            {/* Important Notes */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h5 className="font-semibold text-blue-900 mb-2">Lưu ý quan trọng:</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Check-in: 14:00 | Check-out: 12:00</li>
                <li>• Vui lòng mang theo CMND/CCCD khi check-in</li>
                <li>• Email xác nhận đã được gửi đến {booking.user.email}</li>
                <li>• Miễn phí hủy phòng trước 24h check-in</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3">
              <Button 
                onClick={onViewAccount}
                variant="outline" 
                className="flex-1"
              >
                <Users className="h-4 w-4 mr-2" />
                Xem tài khoản
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Tải xuống
              </Button>
              <Button 
                onClick={onBackToHome}
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Về trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}