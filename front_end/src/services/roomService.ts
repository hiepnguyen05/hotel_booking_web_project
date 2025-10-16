import { apiClient } from './api';

export interface Room {
  _id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  bedType: string;
  capacity: number;
  status: string;
  amenities: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// Interface cho dữ liệu phòng trả về từ API tìm kiếm phòng trống
export interface SearchRoomResult {
  _id: string;
  id?: string;
  name: string;
  capacity: number;
  status: string;
  price?: number;
  type?: string;
  amenities?: string[];
  images?: string[];
  size?: string;
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

export interface CreateRoomData {
  name: string;
  description?: string;
  price: number;
  type: string;
  bedType: string;
  capacity: number;
  status: string;
  amenities: string[];
  images?: File[];
}

export interface UpdateRoomData {
  id: string;
  name: string;
  description?: string;
  price: number;
  type: string;
  bedType: string;
  capacity: number;
  status: string;
  amenities: string[];
  images?: File[];
  imagesToRemove?: string[]; // Add this field
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

  async searchAvailableRooms(params: SearchParams): Promise<{ rooms: SearchRoomResult[]; total: number }> {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      // apiClient.get sẽ trả về toàn bộ phản hồi JSON
      const response: {
        status: number;
        message: string;
        data: SearchRoomResult[]
      } = await apiClient.get(`/rooms/available?${queryParams.toString()}`);

      console.log('API Response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response));

      // Kiểm tra cấu trúc phản hồi
      if (response && response.status === 200) {
        console.log('Response.data:', response.data);
        console.log('Response.data type:', typeof response.data);
        if (response.data) {
          console.log('Response.data keys:', Object.keys(response.data));
        }

        // Backend trả về mảng các phòng trong trường data
        if (Array.isArray(response.data)) {
          console.log('Using response.data as array:', response.data);
          const roomsArray = response.data as SearchRoomResult[];
          // Đảm bảo mỗi phòng có cả _id và id
          const normalizedRooms = roomsArray.map(room => {
            // Đảm bảo _id luôn có giá trị
            const roomId = room._id || room.id || '';
            return {
              ...room,
              _id: roomId,
              id: room.id || room._id || ''
            };
          });
          return { rooms: normalizedRooms, total: normalizedRooms.length };
        }
      }

      console.log('Invalid response format, returning empty result');
      return { rooms: [], total: 0 };
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

  // Admin methods
  async getAdminRooms(params: any): Promise<{ items: Room[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await apiClient.get<{
        success: boolean;
        data: { items: Room[]; pagination: any }
      }>(`/admin/rooms?${queryParams.toString()}`);

      return response.success ? response.data : { items: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
    } catch (error) {
      console.error('Get admin rooms error:', error);
      return { items: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
    }
  }

  async deleteRoom(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(`/admin/rooms/${id}`);
      return response.success;
    } catch (error) {
      console.error('Delete room error:', error);
      return false;
    }
  }

  async createRoom(roomData: CreateRoomData): Promise<Room | null> {
    try {
      const formData = new FormData();

      // Add text fields
      Object.entries(roomData).forEach(([key, value]) => {
        if (key !== 'images') {
          if (key === 'amenities') {
            // Convert amenities array to JSON string
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Add images
      if (roomData.images) {
        roomData.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await apiClient.upload<{ success: boolean; data: Room }>(`/admin/rooms`, formData);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Create room error:', error);
      return null;
    }
  }

  async updateRoom(roomData: UpdateRoomData): Promise<Room | null> {
    try {
      const formData = new FormData();

      // Add text fields
      Object.entries(roomData).forEach(([key, value]) => {
        // Skip id, images, and imagesToRemove fields as they need special handling
        if (key !== 'images' && key !== 'id' && key !== 'imagesToRemove') {
          if (key === 'amenities') {
            // Convert amenities array to JSON string
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Add images
      if (roomData.images) {
        roomData.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      // Add images to remove
      if (roomData.imagesToRemove) {
        formData.append('imagesToRemove', JSON.stringify(roomData.imagesToRemove));
      }

      const response = await apiClient.upload<{ success: boolean; data: Room }>(`/admin/rooms/${roomData.id}`, formData, 'PUT');
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Update room error:', error);
      return null;
    }
  }
}

export const roomService = new RoomService();