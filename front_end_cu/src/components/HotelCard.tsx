import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star, MapPin, Wifi, Car, Utensils } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';

// Get the API base URL from environment variables or use default
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://hotel-booking-web-project.onrender.com/api';

interface HotelCardProps {
  hotel: {
    id: string;
    name: string;
    location: string;
    rating: number;
    price: number;
    originalPrice?: number;
    image: string;
    amenities: string[];
    discount?: number;
  };
}

export function HotelCard({ hotel }: HotelCardProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'parking':
        return <Car className="h-4 w-4" />;
      case 'restaurant':
        return <Utensils className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getFullImageUrl = (imagePath: string) => {
    // If the image path is already a full URL, return it as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path, prepend the API base URL
    // Remove leading slash if it exists to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <ImageWithFallback
          src={getFullImageUrl(hotel.image)}
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
        {hotel.discount && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
            -{hotel.discount}%
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{hotel.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm">{hotel.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{hotel.location}</span>
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          {hotel.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center text-gray-500">
              {getAmenityIcon(amenity)}
              <span className="ml-1 text-xs">{amenity}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">
              {hotel.price.toLocaleString('vi-VN')}₫
            </span>
            {hotel.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {hotel.originalPrice.toLocaleString('vi-VN')}₫
              </span>
            )}
            <span className="text-sm text-gray-600">/đêm</span>
          </div>
        </div>
        
        <Button className="w-full mt-4">
          Xem chi tiết
        </Button>
      </CardContent>
    </Card>
  );
}