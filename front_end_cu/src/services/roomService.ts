import { apiClient } from './api';

export interface Room {
  _id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  capacity: number;
  status: string;
  amenities: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchParams {
  checkInDate?: string;
  checkOutDate?: string;
  adultCount?: number;
  childCount?: number;
  roomCount?: number;
  roomType?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

class RoomService {
  async getAllRooms(): Promise<Room[]> {
    try {
      const response = await apiClient.get<{ status: number; message: string; data: Room[] }>('/rooms');
      return response.status === 200 ? response.data : [];
    } catch (error) {
      console.error('Get all rooms error:', error);
      return [];
    }
  }

  async getRoomById(id: string): Promise<Room | null> {
    try {
      const response = await apiClient.get<{ status: number; message: string; data: Room }>(`/rooms/${id}`);
      return response.status === 200 ? response.data : null;
    } catch (error) {
      console.error('Get room by ID error:', error);
      return null;
    }
  }

  async searchAvailableRooms(params: SearchParams): Promise<{ rooms: Room[]; total: number }> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await apiClient.get<{ 
        status: number; 
        message: string; 
        data: { rooms: Room[]; total: number } 
      }>(`/rooms/available?${queryParams.toString()}`);
      
      return response.status === 200 ? response.data : { rooms: [], total: 0 };
    } catch (error) {
      console.error('Search available rooms error:', error);
      return { rooms: [], total: 0 };
    }
  }

  async getRoomTypes(): Promise<string[]> {
    try {
      const response = await apiClient.get<{ status: number; message: string; data: string[] }>('/rooms/types');
      return response.status === 200 ? response.data : [];
    } catch (error) {
      console.error('Get room types error:', error);
      return [];
    }
  }

  async getRoomStats(): Promise<{
    totalRooms: number;
    availableRooms: number;
    roomTypes: { type: string; count: number }[];
  }> {
    try {
      const response = await apiClient.get<{ 
        status: number; 
        message: string; 
        data: {
          totalRooms: number;
          availableRooms: number;
          roomTypes: { type: string; count: number }[];
        }
      }>('/admin/rooms/stats');
      
      return response.status === 200 ? response.data : {
        totalRooms: 0,
        availableRooms: 0,
        roomTypes: []
      };
    } catch (error) {
      console.error('Get room stats error:', error);
      return {
        totalRooms: 0,
        availableRooms: 0,
        roomTypes: []
      };
    }
  }
}

export const roomService = new RoomService();