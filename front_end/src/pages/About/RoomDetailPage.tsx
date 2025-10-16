import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Loader2, Calendar, Users, Bed, Bath, Wifi, Car, Coffee, ArrowLeft } from 'lucide-react';
import { roomService } from '../../services/roomService';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getRoomImageUrl } from '../../utils/imageUtils';

interface Room {
  _id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  capacity: number;
  status: string;
  amenities: string[];
  images: string[];
}

export function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [room, setRoom] = useState(null as Room | null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadRoom(id);
    }
  }, [id]);

  const loadRoom = async (roomId: string) => {
    try {
      setLoading(true);
      const roomData = await roomService.getRoomById(roomId);
      setRoom(roomData);
    } catch (error) {
      console.error('Error loading room:', error);
      toast.error('Có lỗi xảy ra khi tải thông tin phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để đặt phòng');
      navigate('/login');
      return;
    }
    
    if (room) {
      navigate(`/rooms/${room._id}/book`);
    }
  };

  const nextImage = () => {
    if (room && room.images.length > 1) {
      setImageIndex((prev) => (prev + 1) % room.images.length);
    }
  };

  const prevImage = () => {
    if (room && room.images.length > 1) {
      setImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Đang tải thông tin phòng...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy thông tin phòng</p>
          <Button 
            variant="default"
            size="default"
            className=""
            onClick={() => navigate('/rooms')}
          >
            Quay lại danh sách phòng
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button 
          variant="outline" 
          size="default"
          className="mb-6"
          onClick={() => navigate('/rooms')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách phòng
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Room Images */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                {room.images && room.images.length > 0 ? (
                  <div className="relative">
                    <img 
                      src={getRoomImageUrl(room.images[imageIndex])} 
                      alt={room.name}
                      className="w-full h-96 object-cover rounded-t-lg"
                    />
                    {room.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                        >
                          ←
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
                        >
                          →
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {room.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-3 h-3 rounded-full ${
                                index === imageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-t-lg">
                    <span className="text-gray-500">Không có hình ảnh</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Info */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl">{room.name}</CardTitle>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{room.type}</Badge>
                  <span className="text-2xl font-bold text-primary">
                    {room.price.toLocaleString('vi-VN')}₫
                    <span className="text-sm font-normal text-gray-500">/đêm</span>
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>Tối đa {room.capacity} người</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Bed className="h-5 w-5 mr-2" />
                    <span>Phòng {room.type.toLowerCase()}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Tiện nghi</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {room.amenities && room.amenities.length > 0 ? (
                      room.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          {amenity === 'wifi' && <Wifi className="h-4 w-4 mr-2" />}
                          {amenity === 'parking' && <Car className="h-4 w-4 mr-2" />}
                          {amenity === 'breakfast' && <Coffee className="h-4 w-4 mr-2" />}
                          {amenity === 'bathroom' && <Bath className="h-4 w-4 mr-2" />}
                          <span>{amenity}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">Không có tiện nghi</p>
                    )}
                  </div>
                </div>

                <Button 
                  variant="default" 
                  size="default"
                  className="w-full"
                  onClick={handleBookNow}
                >
                  Đặt phòng ngay
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Room Description */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Mô tả phòng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{room.description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}