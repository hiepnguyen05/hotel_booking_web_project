import React from "react";
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { getRoomImageUrl } from '../../utils/imageUtils';
import { useEffect, useRef } from 'react';

interface Room {
  id: string;
  name: string;
  description: string;
  size: string;
  capacity: number;
  image: string;
  bedType: string;
  features: string[];
}

interface RoomTypeCardProps {
  room: Room;
  index: number;
  onViewRoom?: (roomId: string) => void;
}

export function RoomTypeCard({ room, index, onViewRoom }: RoomTypeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Kiểm tra xem có phải là vị trí lẻ không (1, 3, 5, ...)
  const isOdd = index % 2 === 1;

  return (
    <div 
      ref={cardRef}
      className="flex flex-col md:flex-row gap-8 items-center opacity-0 translate-y-10 transition-all duration-700"
      style={{ flexDirection: isOdd ? 'row-reverse' : 'row' } as React.CSSProperties}
    >
      {/* Image */}
      <div className="w-full md:w-1/2">
        <div className="relative overflow-hidden rounded-lg shadow-lg w-full" style={{ height: '300px' }}>
          <ImageWithFallback
            src={getRoomImageUrl(room.image)}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="w-full md:w-1/2">
        <div className="h-full flex flex-col justify-center">
          <h3 className="text-3xl mb-4">
            {room.name}
          </h3>
          
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {room.description}
          </p>

          {/* Đặc điểm nổi bật */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Đặc điểm nổi bật:</h4>
            <ul className="space-y-2">
              {room.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start text-gray-700">
                  <span className="text-primary mr-2">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}