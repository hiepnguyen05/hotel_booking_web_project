import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Users, Bed, Wifi, Car, Utensils, Waves, Wind } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    description: string;
    size: string;
    capacity: number;
    price: number;
    originalPrice?: number;
    image: string;
    amenities: string[];
    discount?: number;
    bedType: string;
  };
  onViewRoom?: (roomId: string) => void;
}

export function RoomCard({ room, onViewRoom }: RoomCardProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      case 'restaurant':
        return <Utensils className="h-4 w-4" />;
      case 'ocean view':
        return <Waves className="h-4 w-4" />;
      case 'balcony':
        return <Wind className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <ImageWithFallback
          src={room.image}
          alt={room.name}
          className="w-full h-48 object-cover"
        />
        {room.discount && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
            -{room.discount}%
          </Badge>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-xl mb-2">{room.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{room.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>Tối đa {room.capacity} khách</span>
          </div>
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-2" />
            <span>{room.bedType}</span>
          </div>
          <div className="flex items-center col-span-2">
            <span className="font-medium">Diện tích: {room.size}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center text-gray-500 bg-gray-100 px-2 py-1 rounded-md text-xs">
              {getAmenityIcon(amenity)}
              <span className="ml-1">{amenity}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">
              {room.price.toLocaleString('vi-VN')}₫
            </span>
            {room.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {room.originalPrice.toLocaleString('vi-VN')}₫
              </span>
            )}
            <span className="text-sm text-gray-600">/đêm</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewRoom?.(room.id)}
          >
            Xem chi tiết
          </Button>
          <Button 
            className="flex-1"
            onClick={() => onViewRoom?.(room.id)}
          >
            Đặt phòng ngay
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}