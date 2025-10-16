import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  ArrowLeft,
  Star,
  Wifi,
  Car,
  Coffee,
  Tv,
  Bath,
  AirVent,
  Users,
  Maximize,
  MapPin,
  Calendar,
  Clock,
  Bed,
  Utensils,
  Waves,
  Mountain
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useRoomStore } from "../../store/roomStore";
import { roomService } from "../../services/roomService";
import { getFullImageUrl } from "../../utils/imageUtils";

interface Room {
  _id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  bedType: string;
  capacity: number;
  status: string;
  amenities: string[];
  images: string[];
  size?: string;
  originalPrice?: number;
}

// Map room type to Vietnamese labels
const getRoomTypeLabel = (type: string) => {
  switch (type) {
    case 'single': return 'Phòng đơn';
    case 'double': return 'Phòng đôi';
    case 'suite': return 'Suite';
    case 'deluxe': return 'Deluxe';
    default: return type;
  }
};

// Map amenities to icons and labels
const amenityIcons: Record<string, any> = {
  'Wifi miễn phí': Wifi,
  'Điều hòa': AirVent,
  'TV màn hình phẳng': Tv,
  'Tủ lạnh mini': Coffee,
  'Két sắt': Car,
  'Phòng tắm riêng': Bath,
  'Máy sấy tóc': Bath,
  'Dép đi trong phòng': Bed,
  'Bàn làm việc': Utensils,
  'Ban công': Mountain,
  'Tầm nhìn ra biển': Waves,
  'Bồn tắm': Bath,
  'Vòi sen': Bath,
  'Đồ vệ sinh cá nhân': Bath,
  'Khăn tắm': Bed,
  'Nước uống miễn phí': Coffee,
  'wifi': Wifi,
  'parking': Car,
  'breakfast': Coffee,
  'tv': Tv,
  'ac': AirVent,
  'bathroom': Bath
};

export function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedRoom } = useRoomStore();

  // Load room data
  useEffect(() => {
    const loadRoom = async () => {
      try {
        setLoading(true);
        // First try to get from store
        if (selectedRoom && selectedRoom._id === id) {
          setRoom(selectedRoom);
        } else {
          // Otherwise fetch from API
          const roomData = await roomService.getRoomById(id!);
          if (roomData) {
            setRoom(roomData);
          } else {
            setError('Không tìm thấy phòng');
          }
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải thông tin phòng');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadRoom();
    }
  }, [id, selectedRoom]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin phòng...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">{error || 'Không tìm thấy phòng'}</h2>
          <Button variant="default" size="default" className="" onClick={() => navigate('/rooms')}>
            Quay lại danh sách phòng
          </Button>
        </div>
      </div>
    );
  }

  // Get amenity icon component
  const getAmenityIcon = (amenityName: string) => {
    // First try exact match
    if (amenityIcons[amenityName]) {
      return amenityIcons[amenityName];
    }

    // Then try partial match
    const matchedKey = Object.keys(amenityIcons).find(key =>
      amenityName.toLowerCase().includes(key.toLowerCase())
    );

    if (matchedKey) {
      return amenityIcons[matchedKey];
    }

    // Default to Wifi icon
    return Wifi;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="default"
            onClick={() => navigate('/rooms')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách phòng
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{room.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  <span>4.8 (124 đánh giá)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>NgocHiepHotel</span>
                </div>
                <Badge variant="secondary">{getRoomTypeLabel(room.type)}</Badge>
              </div>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="flex items-center justify-end space-x-2">
                {room.originalPrice && room.originalPrice > room.price && (
                  <span className="text-gray-500 line-through">{room.originalPrice?.toLocaleString('vi-VN')}₫</span>
                )}
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
                    src={getFullImageUrl(room.images[imageIndex])}
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
                          onClick={() => setImageIndex(index)}
                          className={`aspect-video rounded-lg overflow-hidden border-2 ${imageIndex === index ? 'border-primary' : 'border-gray-200'
                            }`}
                        >
                          <ImageWithFallback
                            src={getFullImageUrl(image)}
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
                    <p className="font-semibold">{room.size || '35m²'}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-gray-600">Sức chứa</p>
                    <p className="font-semibold">{room.capacity} khách</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-gray-600">Giường</p>
                    <p className="font-semibold">{getRoomTypeLabel(room.bedType)}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-semibold">12:00</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h4 className="font-semibold mb-3">Mô tả</h4>
                  <p className="text-gray-700 leading-relaxed">{room.description || 'Phòng sang trọng với đầy đủ tiện nghi hiện đại.'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Tiện nghi</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.amenities && room.amenities.length > 0 ? (
                    room.amenities.map((amenity, index) => {
                      const IconComponent = getAmenityIcon(amenity);
                      return (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 col-span-3">Không có tiện nghi nào được cung cấp.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {room.originalPrice && room.originalPrice > room.price && (
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-gray-500 line-through">{room.originalPrice?.toLocaleString('vi-VN')}₫</span>
                      <Badge className="bg-red-100 text-red-800">
                        -{Math.round(((room.originalPrice - room.price) / room.originalPrice) * 100)}%
                      </Badge>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-primary">{room.price.toLocaleString('vi-VN')}₫</div>
                  <p className="text-gray-600">per đêm</p>
                </div>

                <Button variant="default" size="lg" className="w-full">
                  Đặt phòng ngay
                </Button>

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