import { useState, useEffect } from 'react';
import { HeroSection } from '../../components/common/HeroSection';
import { RoomTypes } from '../../components/common/RoomTypes';
import { Services } from '../../components/common/Services';
import { RoomSearchResults } from '../../components/RoomSearchResults';
import { useNavigate, useLocation } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useState(null as {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
  } | null);

  // Check if we have search parameters in the location state
  useEffect(() => {
    console.log('HomePage location state:', location.state);
    if (location.state && location.state.fromSearch) {
      setSearchParams({
        checkIn: location.state.checkIn,
        checkOut: location.state.checkOut,
        adults: location.state.adults,
        children: location.state.children
      });
    }
  }, [location.state]);

  const handleViewRoom = (roomId: string) => {
    // Pass search parameters when navigating to room detail
    if (searchParams) {
      navigate(`/rooms/${roomId}`, {
        state: {
          ...searchParams,
          fromSearch: true
        }
      });
    } else {
      navigate(`/rooms/${roomId}`);
    }
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
    // Only set searchParams to null if we want to go back to homepage
    // Otherwise preserve search results
    setSearchParams(null);
  };
  
  const handleReturnToHomepage = () => {
    setSearchParams(null);
  };

  const handleBookRoom = (roomId: string) => {
    if (searchParams) {
      navigate(`/user/booking/${roomId}`, {
        state: {
          ...searchParams
        }
      });
    } else {
      navigate(`/user/booking/${roomId}`);
    }
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
    <div className="min-h-screen">
      <HeroSection onSearchRooms={handleSearchRooms} />
      <RoomTypes onViewRoom={handleViewRoom} />
      <Services />
    </div>
  );
}