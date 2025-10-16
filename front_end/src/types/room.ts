export interface Room {
  _id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  status: 'available' | 'occupied' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface RoomSearchFilters {
  checkInDate?: string;
  checkOutDate?: string;
  adultCount?: number;
  childCount?: number;
  roomCount?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
}