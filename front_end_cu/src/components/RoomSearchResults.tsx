import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Users,
  Bed,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Bath,
  Calendar,
  MapPin,
  Star,
  ArrowLeft
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { roomService, Room } from "../services/roomService";

// Get the API base URL from environment variables or use default
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://hotel-booking-web-project.onrender.com/api';

interface RoomSearchResultsProps {
  searchParams: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
  };
  onBack: () => void;
  onBookRoom: (roomId: string) => void;
}

export function RoomSearchResults({ searchParams, onBack, onBookRoom }: RoomSearchResultsProps) {
  const [rooms, setRooms] = useState([] as Room[]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const navigate = useNavigate();

  useEffect(() => {
    const searchRooms = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const availableRooms = await roomService.searchAvailableRooms({
          checkInDate: searchParams.checkIn,
          checkOutDate: searchParams.checkOut,
          adultCount: searchParams.adults,
          childCount: searchParams.children,
          roomCount: 10 // Set a reasonable default to get multiple rooms
        });

        setRooms(availableRooms);

        // Log kết quả tìm kiếm để debug
        console.log('Found rooms:', availableRooms.length, availableRooms);
      } catch (err) {
        // Hiển thị thông báo lỗi cụ thể nếu có
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tìm kiếm phòng';
        setError(errorMessage);
        console.error('Search rooms error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    searchRooms();
  }, [searchParams]);

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: any } = {
      'wifi': <Wifi className="h-4 w-4" />,
      'parking': <Car className="h-4 w-4" />,
      'breakfast': <Coffee className="h-4 w-4" />,
      'tv': <Tv className="h-4 w-4" />,
      'ac': <Wind className="h-4 w-4" />,
      'bathroom': <Bath className="h-4 w-4" />
    };
    return iconMap[amenity.toLowerCase()] || <Star className="h-4 w-4" />;
  };

  const getFullImageUrl = (imagePath: string) => {
    // If the image path is already a full URL, return it as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path that starts with /uploads, serve it from the base URL without /api
    if (imagePath.startsWith('/uploads')) {
      const baseUrlWithoutApi = API_BASE_URL.replace('/api', '');
      return `${baseUrlWithoutApi}${imagePath}`;
    }
    
    // For other relative paths, prepend the API base URL
    // Remove leading slash if it exists to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    // Ensure API_BASE_URL doesn't end with a slash
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${baseUrl}/${cleanPath}`;
  };

  const calculateNights = () => {
    const checkIn = new Date(searchParams.checkIn);
    const checkOut = new Date(searchParams.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tìm kiếm phòng trống...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            size="default"
            onClick={onBack}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại tìm kiếm
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kết quả tìm kiếm</h1>
              <p className="text-gray-600 mt-1">
                {rooms.length} phòng trống từ {new Date(searchParams.checkIn).toLocaleDateString('vi-VN')}
                đến {new Date(searchParams.checkOut).toLocaleDateString('vi-VN')}
              </p>
            </div>

            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {nights} đêm
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {searchParams.adults + searchParams.children} khách
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button variant="default" size="default" className="" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            </CardContent>
          </Card>
        ) : rooms.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Không tìm thấy phòng trống</h3>
              <p className="text-gray-600 mb-4">
                Không có phòng nào phù hợp với yêu cầu của bạn trong thời gian này.
              </p>
              <Button variant="default" size="default" className="" onClick={onBack}>
                Thử tìm kiếm khác
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {rooms.map((room) => (
              <Card key={room.id || room._id} className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Room Image */}
                  <div className="lg:col-span-1">
                    <div className="h-64 lg:h-full">
                      <ImageWithFallback
                        src={room.images?.[0] ? getFullImageUrl(room.images[0]) : 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb218ZW58MXx8fHwxNzU5MjI5MDY0fDA&ixlib=rb-4.1.0&q=80&w=1080'}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="lg:col-span-2 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {room.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {room.capacity}
                              </div>
                              <div className="flex items-center">
                                <Bed className="h-4 w-4 mr-1" />
                                {room.size}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {room.price.toLocaleString('vi-VN')}₫
                            </div>
                            <div className="text-sm text-gray-600">mỗi đêm</div>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Tiện nghi</h4>
                          <div className="flex flex-wrap gap-2">
                            {room.amenities?.slice(0, 6).map((amenity, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center">
                                {getAmenityIcon(amenity)}
                                <span className="ml-1 capitalize">{amenity}</span>
                              </Badge>
                            ))}
                            {room.amenities?.length > 6 && (
                              <Badge variant="outline">
                                +{room.amenities.length - 6} tiện nghi khác
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Separator className="my-4" />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="default"
                          className="flex-1"
                          onClick={() => {
                            // Debug: log the room object to see its properties
                            console.log('Room object:', room);
                            // Use id or _id depending on which is available
                            const roomId = room.id || room._id;
                            if (roomId) {
                              navigate(`/rooms/${roomId}`);
                            } else {
                              console.error('Room ID is missing:', room);
                            }
                          }}
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          variant="default"
                          size="default"
                          className="flex-1"
                          onClick={() => {
                            // Use id or _id depending on which is available
                            const roomId = room.id || room._id;
                            if (roomId) {
                              // Pass search parameters through router state
                              navigate(`/user/booking/${roomId}`, {
                                state: {
                                  checkIn: searchParams.checkIn,
                                  checkOut: searchParams.checkOut,
                                  adults: searchParams.adults,
                                  children: searchParams.children
                                }
                              });
                            } else {
                              console.error('Room ID is missing:', room);
                            }
                          }}
                        >
                          Đặt phòng ngay
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}