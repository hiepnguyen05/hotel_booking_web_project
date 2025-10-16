import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ArrowLeft, Star, Wifi, Car, Coffee, Tv, Bath, AirVent, Users, Maximize, MapPin, Calendar, Clock } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface RoomDetailProps {
  roomId: string;
  onBack: () => void;
  onBookNow: (roomId: string) => void;
  user: any;
}

const roomsData = {
  "1": {
    id: "1",
    name: "Deluxe Ocean View",
    price: 3500000,
    originalPrice: 4000000,
    images: [
      "https://images.unsplash.com/photo-1632598024410-3d8f24daab57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTkyMjkwNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1677317156621-bd950e6ea734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhob3RlbCUyMHJvb20lMjBiYXRocm9vbSUyMGx1eHVyeXxlbnwxfHx8fDE3NTkzMjUzODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    size: "35m²",
    capacity: "2 khách",
    bedType: "Giường King",
    view: "Hướng biển",
    description: "Phòng Deluxe Ocean View mang đến trải nghiệm nghỉ dưỡng tuyệt vời với tầm nhìn ra biển xanh bескрайний. Được thiết kế hiện đại với đầy đủ tiện nghi cao cấp, phòng là lựa chọn hoàn hảo cho kỳ nghỉ lãng mạn.",
    amenities: [
      { icon: Wifi, name: "WiFi miễn phí" },
      { icon: AirVent, name: "Điều hòa không khí" },
      { icon: Tv, name: "TV màn hình phẳng" },
      { icon: Coffee, name: "Minibar" },
      { icon: Bath, name: "Phòng tắm riêng" },
      { icon: Car, name: "Đỗ xe miễn phí" }
    ],
    features: [
      "Ban công riêng hướng biển",
      "Giường King size cao cấp",
      "Phòng tắm với vòi sen và bồn tắm",
      "Khu vực làm việc",
      "Két sắt điện tử",
      "Dịch vụ phòng 24/7"
    ],
    reviews: 4.8,
    totalReviews: 124,
    checkInTime: "14:00",
    checkOutTime: "12:00"
  },
  "2": {
    id: "2",
    name: "Junior Suite",
    price: 5200000,
    originalPrice: 6000000,
    images: [
      "https://images.unsplash.com/photo-1632598024410-3d8f24daab57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTkyMjkwNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    size: "55m²",
    capacity: "3 khách",
    bedType: "Giường King + Sofa",
    view: "Hướng biển",
    description: "Junior Suite rộng rãi với khu vực tiếp khách riêng biệt, lý tưởng cho gia đình nhỏ hoặc nhóm bạn.",
    amenities: [
      { icon: Wifi, name: "WiFi miễn phí" },
      { icon: AirVent, name: "Điều hòa không khí" },
      { icon: Tv, name: "TV màn hình phẳng" },
      { icon: Coffee, name: "Minibar" },
      { icon: Bath, name: "Phòng tắm riêng" },
      { icon: Car, name: "Đỗ xe miễn phí" }
    ],
    features: [
      "Khu vực tiếp khách riêng",
      "Ban công lớn hướng biển",
      "Giường King size + Sofa bed",
      "Phòng tắm với jacuzzi",
      "Khu vực làm việc rộng rãi",
      "Dịch vụ butler"
    ],
    reviews: 4.9,
    totalReviews: 89,
    checkInTime: "14:00",
    checkOutTime: "12:00"
  }
};

export function RoomDetail({ roomId, onBack, onBookNow, user }: RoomDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const room = roomsData[roomId as keyof typeof roomsData];

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy phòng</h2>
          <Button onClick={onBack}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
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
              <h1 className="text-3xl font-bold">{room.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600 mt-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  <span>{room.reviews} ({room.totalReviews} đánh giá)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>NgocHiepHotel</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 line-through">{room.originalPrice?.toLocaleString('vi-VN')}₫</span>
                <span className="text-3xl font-bold text-primary">{room.price.toLocaleString('vi-VN')}₫</span>
              </div>
              <p className="text-gray-600">per đêm</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video relative">
                  <ImageWithFallback
                    src={room.images[selectedImageIndex]}
                    alt={room.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                {room.images.length > 1 && (
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-2">
                      {room.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`aspect-video rounded-lg overflow-hidden border-2 ${
                            selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                          }`}
                        >
                          <ImageWithFallback
                            src={image}
                            alt={`${room.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Room Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Thông tin phòng</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Maximize className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-gray-600">Diện tích</p>
                    <p className="font-semibold">{room.size}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-gray-600">Sức chứa</p>
                    <p className="font-semibold">{room.capacity}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-semibold">{room.checkInTime}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-semibold">{room.checkOutTime}</p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h4 className="font-semibold mb-3">Mô tả</h4>
                  <p className="text-gray-700 leading-relaxed">{room.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Tiện nghi</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <amenity.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Đặc điểm nổi bật</h3>
                <div className="space-y-2">
                  {room.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-gray-500 line-through">{room.originalPrice?.toLocaleString('vi-VN')}₫</span>
                    <Badge className="bg-red-100 text-red-800">-{Math.round(((room.originalPrice! - room.price) / room.originalPrice!) * 100)}%</Badge>
                  </div>
                  <div className="text-3xl font-bold text-primary">{room.price.toLocaleString('vi-VN')}₫</div>
                  <p className="text-gray-600">per đêm</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 border rounded-lg">
                      <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-xs text-gray-600">Check-in</p>
                      <p className="font-semibold text-sm">02/01/2025</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-xs text-gray-600">Check-out</p>
                      <p className="font-semibold text-sm">05/01/2025</p>
                    </div>
                  </div>
                  
                  <div className="text-center p-3 border rounded-lg">
                    <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-gray-600">Khách</p>
                    <p className="font-semibold text-sm">2 người lớn, 0 trẻ em</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span>3 đêm × {room.price.toLocaleString('vi-VN')}₫</span>
                    <span>{(room.price * 3).toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí dịch vụ</span>
                    <span>200,000₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế</span>
                    <span>350,000₫</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng</span>
                    <span>{(room.price * 3 + 200000 + 350000).toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
                
                {user ? (
                  <Button 
                    onClick={() => onBookNow(room.id)} 
                    className="w-full"
                    size="lg"
                  >
                    Đặt phòng ngay
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-center text-sm text-gray-600">
                      Đăng nhập để đặt phòng
                    </p>
                    <Button 
                      onClick={onBack} 
                      variant="outline"
                      className="w-full"
                    >
                      Đăng nhập
                    </Button>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Miễn phí hủy phòng trong 24h
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}