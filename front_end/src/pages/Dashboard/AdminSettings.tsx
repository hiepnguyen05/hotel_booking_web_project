import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Settings,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Bell,
  Shield,
  Database,
  Save,
  RefreshCw
} from 'lucide-react';

interface HotelSettings {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  bookingConfirmations: boolean;
  paymentAlerts: boolean;
  systemAlerts: boolean;
}

interface SystemSettings {
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  maxBookingDays: number;
  minBookingDays: number;
  autoConfirmBookings: boolean;
}

export function AdminSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null as { type: 'success' | 'error'; text: string } | null);

  const [hotelSettings, setHotelSettings] = useState({
    name: 'Luxury Beach Resort',
    description: 'Khu nghỉ dưỡng sang trọng bên bờ biển với dịch vụ đẳng cấp 5 sao',
    address: '123 Đường Biển, Phường Hải Châu, TP. Đà Nẵng',
    phone: '+84 236 123 4567',
    email: 'info@luxurybeachresort.com',
    website: 'https://luxurybeachresort.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    cancellationPolicy: 'Khách hàng có thể hủy đặt phòng miễn phí trước 24 giờ check-in.'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingConfirmations: true,
    paymentAlerts: true,
    systemAlerts: true
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    maxBookingDays: 30,
    minBookingDays: 1,
    autoConfirmBookings: false
  });

  const handleSaveHotelSettings = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({ type: 'success', text: 'Cài đặt khách sạn đã được lưu thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi lưu cài đặt khách sạn.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({ type: 'success', text: 'Cài đặt thông báo đã được lưu thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi lưu cài đặt thông báo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSystemSettings = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({ type: 'success', text: 'Cài đặt hệ thống đã được lưu thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi lưu cài đặt hệ thống.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupDatabase = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMessage({ type: 'success', text: 'Sao lưu cơ sở dữ liệu thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi sao lưu cơ sở dữ liệu.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Cài đặt hệ thống</h1>
        <p className="text-gray-600">Quản lý cài đặt khách sạn, thông báo và hệ thống</p>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="hotel" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hotel" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Khách sạn
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Hệ thống
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Sao lưu
          </TabsTrigger>
        </TabsList>

        {/* Hotel Settings */}
        <TabsContent value="hotel">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Thông tin khách sạn
              </CardTitle>
              <CardDescription>
                Cập nhật thông tin cơ bản về khách sạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hotelName">Tên khách sạn</Label>
                  <Input
                    id="hotelName"
                    value={hotelSettings.name}
                    onChange={(e) => setHotelSettings(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      className="pl-10"
                      value={hotelSettings.website}
                      onChange={(e) => setHotelSettings(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={hotelSettings.phone}
                      onChange={(e) => setHotelSettings(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      className="pl-10"
                      value={hotelSettings.email}
                      onChange={(e) => setHotelSettings(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkIn">Giờ check-in</Label>
                  <Input
                    id="checkIn"
                    type="time"
                    value={hotelSettings.checkInTime}
                    onChange={(e) => setHotelSettings(prev => ({ ...prev, checkInTime: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkOut">Giờ check-out</Label>
                  <Input
                    id="checkOut"
                    type="time"
                    value={hotelSettings.checkOutTime}
                    onChange={(e) => setHotelSettings(prev => ({ ...prev, checkOutTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    className="pl-10"
                    value={hotelSettings.address}
                    onChange={(e) => setHotelSettings(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={hotelSettings.description}
                  onChange={(e) => setHotelSettings(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellationPolicy">Chính sách hủy phòng</Label>
                <Textarea
                  id="cancellationPolicy"
                  rows={3}
                  value={hotelSettings.cancellationPolicy}
                  onChange={(e) => setHotelSettings(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
                />
              </div>

              <Button 
                className="" 
                variant="default" 
                size="default"
                onClick={handleSaveHotelSettings} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Lưu cài đặt
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Cài đặt thông báo
              </CardTitle>
              <CardDescription>
                Quản lý các loại thông báo gửi đến khách hàng và admin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Thông báo qua Email</Label>
                    <p className="text-sm text-gray-500">Gửi thông báo qua email cho khách hàng</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Thông báo qua SMS</Label>
                    <p className="text-sm text-gray-500">Gửi thông báo qua tin nhắn SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Xác nhận đặt phòng</Label>
                    <p className="text-sm text-gray-500">Gửi email xác nhận khi đặt phòng thành công</p>
                  </div>
                  <Switch
                    checked={notificationSettings.bookingConfirmations}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({ ...prev, bookingConfirmations: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cảnh báo thanh toán</Label>
                    <p className="text-sm text-gray-500">Thông báo khi có giao dịch thanh toán</p>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({ ...prev, paymentAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cảnh báo hệ thống</Label>
                    <p className="text-sm text-gray-500">Thông báo lỗi và cảnh báo hệ thống cho admin</p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))
                    }
                  />
                </div>
              </div>

              <Button 
                className="" 
                variant="default" 
                size="default"
                onClick={handleSaveNotificationSettings} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Lưu cài đặt
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Cài đặt hệ thống
              </CardTitle>
              <CardDescription>
                Quản lý các cài đặt bảo mật và hoạt động của hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Chế độ bảo trì</Label>
                    <p className="text-sm text-gray-500">Tạm thời tắt website để bảo trì</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cho phép đăng ký</Label>
                    <p className="text-sm text-gray-500">Khách hàng có thể tạo tài khoản mới</p>
                  </div>
                  <Switch
                    checked={systemSettings.allowRegistration}
                    onCheckedChange={(checked) =>
                      setSystemSettings(prev => ({ ...prev, allowRegistration: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Xác thực email</Label>
                    <p className="text-sm text-gray-500">Yêu cầu xác thực email khi đăng ký</p>
                  </div>
                  <Switch
                    checked={systemSettings.requireEmailVerification}
                    onCheckedChange={(checked) =>
                      setSystemSettings(prev => ({ ...prev, requireEmailVerification: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tự động xác nhận đặt phòng</Label>
                    <p className="text-sm text-gray-500">Tự động xác nhận đặt phòng sau khi thanh toán</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoConfirmBookings}
                    onCheckedChange={(checked) =>
                      setSystemSettings(prev => ({ ...prev, autoConfirmBookings: checked }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxBookingDays">Số ngày đặt phòng tối đa</Label>
                  <Input
                    id="maxBookingDays"
                    type="number"
                    min="1"
                    max="365"
                    value={systemSettings.maxBookingDays}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      maxBookingDays: parseInt(e.target.value) || 30
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minBookingDays">Số ngày đặt phòng tối thiểu</Label>
                  <Input
                    id="minBookingDays"
                    type="number"
                    min="1"
                    max="30"
                    value={systemSettings.minBookingDays}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      minBookingDays: parseInt(e.target.value) || 1
                    }))}
                  />
                </div>
              </div>

              <Button 
                className="" 
                variant="default" 
                size="default"
                onClick={handleSaveSystemSettings} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Lưu cài đặt
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Sao lưu dữ liệu
              </CardTitle>
              <CardDescription>
                Quản lý sao lưu và khôi phục dữ liệu hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Sao lưu cơ sở dữ liệu</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Tạo bản sao lưu đầy đủ của cơ sở dữ liệu hiện tại
                  </p>
                  <Button 
                    className="" 
                    variant="default" 
                    size="default"
                    onClick={handleBackupDatabase} 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Database className="h-4 w-4 mr-2" />
                    )}
                    Tạo bản sao lưu
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Lịch sử sao lưu</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Danh sách các bản sao lưu đã tạo
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">backup_2024_01_15_14_30.sql</span>
                      <span className="text-xs text-gray-500">15/01/2024 14:30</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">backup_2024_01_14_14_30.sql</span>
                      <span className="text-xs text-gray-500">14/01/2024 14:30</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">backup_2024_01_13_14_30.sql</span>
                      <span className="text-xs text-gray-500">13/01/2024 14:30</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}