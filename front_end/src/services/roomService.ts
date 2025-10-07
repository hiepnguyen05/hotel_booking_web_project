import { apiClient } from './api';

export interface Room {
  id: string;
  _id?: string;
  name: string;
  type: 'single' | 'double' | 'suite' | 'deluxe';
  bedType: 'single' | 'double' | 'queen' | 'king';
  description: string;
  price: number;
  capacity: number;
  size?: string;
  images: string[];
  amenities: string[];
  status: 'available' | 'booked' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface RoomSearchParams {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
}

export interface CreateRoomData {
  name: string;
  type: 'single' | 'double' | 'suite' | 'deluxe';
  bedType: 'single' | 'double' | 'queen' | 'king';
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  status: 'available' | 'booked' | 'maintenance';
  images?: File[];
}

export interface UpdateRoomData extends Partial<CreateRoomData> {
  id: string;
}

class RoomService {
  async getAllRooms(params?: RoomSearchParams): Promise<Room[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    const endpoint = `/rooms${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<{ status: number; message: string; data: Room[] }>(endpoint);

    return response.status === 200 ? response.data : [];
  }

  async getRooms(params?: { page?: number; limit?: number; type?: string; search?: string }): Promise<Room[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/rooms${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<{ status: number; message: string; data: Room[] }>(endpoint);

      return response.status === 200 ? response.data : [];
    } catch (error) {
      console.error('Get rooms error:', error);
      return [];
    }
  }

  async getAdminRooms(params?: { page?: number; limit?: number; type?: string; status?: string }): Promise<{ items: Room[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const endpoint = `/admin/rooms${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<{ status: number; message: string; data: { items: Room[]; pagination: any } }>(endpoint);

      return response.status === 200 ? response.data : { items: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
    } catch (error) {
      console.error('Get admin rooms error:', error);
      return { items: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
    }
  }

  async getRoomById(id: string): Promise<Room | null> {
    try {
      console.log('Calling API to get room by ID:', id);
      const response = await apiClient.get<{ status: number; message: string; data: Room }>(`/rooms/${id}`);
      console.log('API response for room:', response);
      // Fix: Handle the correct backend response format
      return response.status === 200 ? response.data : null;
    } catch (error) {
      console.error('Get room by ID error:', error);
      return null;
    }
  }

  async createRoom(roomData: CreateRoomData): Promise<Room | null> {
    try {
      const formData = new FormData();

      // Add room data
      Object.entries(roomData).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach(file => formData.append('images', file));
        } else if (key === 'amenities' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (key !== 'images') {
          formData.append(key, value.toString());
        }
      });

      const response = await apiClient.upload<{ status: number; message: string; data: Room }>('/admin/rooms', formData);
      return response.status === 201 ? response.data : null;
    } catch (error) {
      console.error('Create room error:', error);
      throw error;
    }
  }

  async updateRoom(roomData: UpdateRoomData): Promise<Room | null> {
    try {
      const { id, ...updateData } = roomData;

      if (updateData.images && updateData.images.length > 0) {
        // If updating with new images, use FormData
        const formData = new FormData();

        Object.entries(updateData).forEach(([key, value]) => {
          if (key === 'images' && Array.isArray(value)) {
            value.forEach(file => formData.append('images', file));
          } else if (key === 'amenities' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (key !== 'images') {
            formData.append(key, value.toString());
          }
        });

        const response = await apiClient.upload<{ status: number; message: string; data: Room }>(`/admin/rooms/${id}`, formData);
        return response.status === 200 ? response.data : null;
      } else {
        // Regular JSON update
        const response = await apiClient.put<{ status: number; message: string; data: Room }>(`/admin/rooms/${id}`, updateData);
        return response.status === 200 ? response.data : null;
      }
    } catch (error) {
      console.error('Update room error:', error);
      throw error;
    }
  }

  async deleteRoom(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<{ status: number; message: string }>(`/admin/rooms/${id}`);
      return response.status === 200;
    } catch (error) {
      console.error('Delete room error:', error);
      throw error;
    }
  }

  async uploadRoomImages(roomId: string, files: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await apiClient.upload<{ status: number; message: string; data: { images: string[] } }>(
        `/admin/rooms/${roomId}/images`,
        formData
      );

      return response.status === 200 ? response.data.images : [];
    } catch (error) {
      console.error('Upload room images error:', error);
      throw error;
    }
  }

  async checkAvailability(roomId: string, checkIn: string, checkOut: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ 
        status: number; 
        message: string; 
        data: { available: boolean } 
      }>(
        `/rooms/${roomId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`
      );

      // Fix: Handle the correct backend response format
      return response.status === 200 ? response.data.available : false;
    } catch (error) {
      console.error('Check availability error:', error);
      return false;
    }
  }

  async searchAvailableRooms(params: {
    checkInDate: string;
    checkOutDate: string;
    adultCount: number;
    childCount: number;
    roomCount?: number;
  }): Promise<Room[]> {
    try {
      // Kiểm tra định dạng ngày tháng
      const checkIn = new Date(params.checkInDate);
      const checkOut = new Date(params.checkOutDate);

      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        console.error('Invalid date format:', params.checkInDate, params.checkOutDate);
        throw new Error('Định dạng ngày không hợp lệ');
      }

      if (checkIn >= checkOut) {
        console.error('Invalid date range:', params.checkInDate, params.checkOutDate);
        throw new Error('Ngày nhận phòng phải trước ngày trả phòng');
      }

      // Đảm bảo các tham số được gửi đúng định dạng
      const queryParams = new URLSearchParams();
      queryParams.append('checkInDate', params.checkInDate);
      queryParams.append('checkOutDate', params.checkOutDate);
      queryParams.append('adultCount', params.adultCount.toString());
      queryParams.append('childCount', params.childCount.toString());
      queryParams.append('roomCount', (params.roomCount || 1).toString());

      console.log('Searching available rooms with params:', Object.fromEntries(queryParams.entries()));

      const response = await apiClient.get<{ 
        status: number; 
        message: string; 
        data: Room[] 
      }>(
        `/rooms/available?${queryParams.toString()}`
      );

      console.log('Search response:', response);
      // Fix: Handle the correct backend response format
      return response.status === 200 ? response.data : [];
    } catch (error) {
      console.error('Search available rooms error:', error);
      throw error; // Ném lỗi để component có thể xử lý
    }
  }
}

export const roomService = new RoomService();
