import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Bed, Maximize, Users } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RoomTypeIntroProps {
  roomType: {
    id: string;
    name: string;
    description: string;
    fullDescription: string;
    size: string;
    capacity: number;
    image: string;
    bedType: string;
    features: string[];
  };
  onViewRooms?: (roomTypeId: string) => void;
  reverse?: boolean;
}

export function RoomTypeIntro({ roomType, onViewRooms, reverse = false }: RoomTypeIntroProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      {/* Hình ảnh */}
      <div className={`${reverse ? 'lg:order-2' : ''}`}>
        <div className="relative overflow-hidden rounded-lg shadow-lg group">
          <ImageWithFallback
            src={roomType.image}
            alt={roomType.name}
            className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Nội dung */}
      <div className={`${reverse ? 'lg:order-1' : ''}`}>
        <h3 className="text-3xl mb-4">
          {roomType.name}
        </h3>
        
        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
          {roomType.fullDescription}
        </p>

        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-start p-4 bg-gray-50 rounded-lg">
            <Maximize className="h-5 w-5 text-primary mb-2" />
            <span className="text-sm text-gray-600">Diện tích</span>
            <span className="font-semibold">{roomType.size}</span>
          </div>
          
          <div className="flex flex-col items-start p-4 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 text-primary mb-2" />
            <span className="text-sm text-gray-600">Sức chứa</span>
            <span className="font-semibold">{roomType.capacity} khách</span>
          </div>
          
          <div className="flex flex-col items-start p-4 bg-gray-50 rounded-lg">
            <Bed className="h-5 w-5 text-primary mb-2" />
            <span className="text-sm text-gray-600">Loại giường</span>
            <span className="font-semibold text-sm">{roomType.bedType}</span>
          </div>
        </div>

        {/* Đặc điểm nổi bật */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Đặc điểm nổi bật:</h4>
          <ul className="space-y-2">
            {roomType.features.map((feature, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="text-primary mr-2">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button 
          size="lg"
          onClick={() => onViewRooms?.(roomType.id)}
          className="w-full sm:w-auto"
        >
          Xem phòng trống
        </Button>
      </div>
    </div>
  );
}
