import { useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { RoomTypes } from '../components/RoomTypes';
import { Services } from '../components/Services';
import { RoomSearchResults } from '../components/RoomSearchResults';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<{
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
  } | null>(null);

  const handleViewRoom = (roomId: string) => {
    navigate(`/rooms/${roomId}`);
  };

  const handleSearchRooms = (params: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
  }) => {
    setSearchParams(params);
  };

  const handleBackToHome = () => {
    setSearchParams(null);
  };

  const handleBookRoom = (roomId: string) => {
    navigate(`/user/booking/${roomId}`);
  };

  if (searchParams) {
    return (
      <RoomSearchResults
        searchParams={searchParams}
        onBack={handleBackToHome}
        onBookRoom={handleBookRoom}
      />
    );
  }

  return (
    <div>
      <HeroSection onSearchRooms={handleSearchRooms} />
      <RoomTypes onViewRoom={handleViewRoom} />
      <Services />
    </div>
  );
}
