import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import { useAuthStore } from "../../store/authStore";
import { getFullImageUrl } from "../../utils/imageUtils";

interface Room {
  _id: string;
  id?: string;
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
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [room, setRoom] = useState(null as Room | null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const { selectedRoom } = useRoomStore();

  // Get search parameters from router state if available
  const searchParams = location.state as {
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
    searchTerm?: string;
    priceRange?: string;
    capacity?: string;
  } || {};

  // Log received parameters for debugging
  useEffect(() => {
    console.log('RoomDetailPage received parameters:', {
      id,
      searchParams,
      locationState: location.state
    });
  }, [id, searchParams, location.state]);

  // Booking form state
  const [bookingData, setBookingData] = useState({
    checkIn: searchParams.checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0], // Ngày mai hoặc từ search params
    checkOut: searchParams.checkOut || new Date(Date.now() + 172800000).toISOString().split('T')[0], // Ngày mốt hoặc từ search params
    adults: searchParams.adults || 2,
    children: searchParams.children || 0
  });

  // Load room data from backend
  useEffect(() => {
    const loadRoom = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Loading room with ID:', id);

        // First try to get from store
        if (selectedRoom && ((selectedRoom as any).id === id || selectedRoom._id === id)) {
          console.log('Found room in store:', selectedRoom);
          setRoom(selectedRoom);
          setLoading(false);
          return;
        }

        // Otherwise fetch from API
        const roomData = await roomService.getRoomById(id!);
        console.log('Room data from API:', roomData);

        if (roomData) {
          setRoom(roomData);
          // Reset selected image index when room changes
          setSelectedImageIndex(0);
        } else {
          setError('Không tìm thấy phòng');
        }
      } catch (err) {
        console.error('Error loading room:', err);
        setError('Có lỗi xảy ra khi tải thông tin phòng');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadRoom();
    } else {
      setError('Không tìm thấy ID phòng');
      setLoading(false);
    }
  }, [id, selectedRoom]);

  // Handle booking form changes
  const handleBookingDataChange = (field: string, value: string | number) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookNow = (roomId: string) => {
    if (!isAuthenticated) {
      // Redirect to login page
      navigate('/login');
      return;
    }

    // Log booking data for debugging
    console.log('Booking data being sent:', {
      roomId,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      adults: bookingData.adults,
      children: bookingData.children
    });

    // Navigate to booking page with form data
    navigate(`/user/booking/${roomId}`, {
      state: {
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        adults: bookingData.adults,
        children: bookingData.children
      }
    });
  };

  // Calculate number of nights
  const calculateNights = () => {
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const nights = calculateNights();
    const roomPrice = room ? room.price * nights : 0;
    const serviceFee = 200000;
    const tax = 350000;
    return roomPrice + serviceFee + tax;
  };

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

  // Ensure we have a valid room ID before rendering booking button
  const validRoomId = room._id || room.id;
  if (!validRoomId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Không tìm thấy thông tin phòng</h2>
          <p className="text-gray-600 mb-4">Không thể xác định ID phòng hợp lệ.</p>
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

  // Process images to handle duplicates appropriately
  const processImages = (images: string[]): string[] => {
    if (!images || images.length === 0) return [];

    // Remove duplicates while preserving order
    const uniqueImages = [...new Set(images)];

    // Return all unique images
    return uniqueImages;
  };

  const processedImages = processImages(room.images);
  console.log('Original images:', room.images);
  console.log('Processed images:', processedImages);

  // Calculate nights and total price
  const nights = calculateNights();
  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="default"
            onClick={() => {
              // Go back to the previous page with search parameters preserved
              if (window.history.length > 1) {
                // Check if we came from the rooms page with search params
                if (searchParams.searchTerm || searchParams.priceRange || searchParams.capacity) {
                  // Navigate back to rooms page with search parameters
                  navigate('/rooms', {
                    state: {
                      searchTerm: searchParams.searchTerm,
                      priceRange: searchParams.priceRange,
                      capacity: searchParams.capacity
                    }
                  });
                } else {
                  navigate(-1);
                }
              } else {
                // Fallback to rooms page with search params if available
                navigate('/rooms', {
                  state: searchParams.searchTerm || searchParams.priceRange || searchParams.capacity ? {
                    searchTerm: searchParams.searchTerm,
                    priceRange: searchParams.priceRange,
                    capacity: searchParams.capacity
                  } : undefined
                });
              }
            }}
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
                    src={processedImages && processedImages.length > 0
                      ? getFullImageUrl(processedImages[selectedImageIndex])
                      : "https://images.unsplash.com/photo-1632598024410-3d8f24daab57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTkyMjkwNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                    alt={room.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                {processedImages && processedImages.length > 1 && (
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-2">
                      {processedImages.map((image: string, index: number) => {
                        // Log each image for debugging
                        console.log(`Image ${index}:`, image);
                        const fullImageUrl = getFullImageUrl(image);
                        console.log(`Full URL for image ${index}:`, fullImageUrl);

                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`aspect-video rounded-lg overflow-hidden border-2 ${selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                              }`}
                          >
                            <ImageWithFallback
                              src={fullImageUrl}
                              alt={`${room.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      })}
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
                    room.amenities.map((amenity: string, index: number) => {
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

                {/* Booking Form */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Check-in</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={bookingData.checkIn}
                          onChange={(e) => handleBookingDataChange('checkIn', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Check-out</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={bookingData.checkOut}
                          onChange={(e) => handleBookingDataChange('checkOut', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                          min={bookingData.checkIn}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Người lớn</label>
                      <select
                        value={bookingData.adults}
                        onChange={(e) => handleBookingDataChange('adults', parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} người</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Trẻ em</label>
                      <select
                        value={bookingData.children}
                        onChange={(e) => handleBookingDataChange('children', parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        {[0, 1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} trẻ</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span>{nights} đêm × {room.price.toLocaleString('vi-VN')}₫</span>
                    <span>{(room.price * nights).toLocaleString('vi-VN')}₫</span>
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
                    <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                {isAuthenticated ? (
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => handleBookNow(validRoomId)}
                    className="w-full"
                  >
                    Đặt phòng ngay
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-center text-sm text-gray-600">
                      Đăng nhập để đặt phòng
                    </p>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => navigate('/login')}
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