import React from "react";
import { Button } from "../ui/button";
import { Bed, Users, Star } from "lucide-react";
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { getFullImageUrl } from '../../utils/imageUtils';

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  capacity: number;
  size?: string;
  amenities?: string[];
  bedType?: string;
}

interface RoomCardProps {
  room: Room;
  onViewRoom?: (roomId: string) => void;
}

export function RoomCard({ room, onViewRoom }: RoomCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48">
        <ImageWithFallback
          src={getFullImageUrl(room.image)}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-sm font-semibold text-primary">
          {room.price.toLocaleString('vi-VN')}₫/đêm
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{room.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>

        {/* Features */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{room.bedType || 'Phòng'}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{room.capacity} khách</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">4.8</span>
            <span className="text-gray-400 text-sm ml-1">(124)</span>
          </div>
        </div>

        {/* Button */}
        <Button
          variant="default"
          size="default"
          className="w-full"
          onClick={() => onViewRoom && onViewRoom(room.id)}
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}