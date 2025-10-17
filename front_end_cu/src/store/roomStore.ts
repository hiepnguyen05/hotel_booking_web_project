import { create } from 'zustand';
import { roomService, Room, RoomSearchParams, CreateRoomData, UpdateRoomData } from '../services/roomService';

interface RoomState {
  rooms: Room[];
  selectedRoom: Room | null;
  isLoading: boolean;
  error: string | null;
  searchParams: RoomSearchParams;
  
  // Actions
  fetchRooms: (params?: RoomSearchParams) => Promise<void>;
  fetchRoomById: (id: string) => Promise<void>;
  createRoom: (roomData: CreateRoomData) => Promise<boolean>;
  updateRoom: (roomData: UpdateRoomData) => Promise<boolean>;
  deleteRoom: (id: string) => Promise<boolean>;
  uploadRoomImages: (roomId: string, files: File[]) => Promise<string[]>;
  checkAvailability: (roomId: string, checkIn: string, checkOut: string) => Promise<boolean>;
  setSearchParams: (params: RoomSearchParams) => void;
  clearError: () => void;
  setSelectedRoom: (room: Room | null) => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: [],
  selectedRoom: null,
  isLoading: false,
  error: null,
  searchParams: {},

  fetchRooms: async (params?: RoomSearchParams) => {
    set({ isLoading: true, error: null });
    
    try {
      const searchParams = params || get().searchParams;
      const rooms = await roomService.getAllRooms(searchParams);
      
      set({
        rooms,
        isLoading: false,
        searchParams
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi tải danh sách phòng',
        isLoading: false
      });
    }
  },

  fetchRoomById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Fetching room by ID:', id);
      const room = await roomService.getRoomById(id);
      console.log('Fetched room:', room);
      
      set({
        selectedRoom: room,
        isLoading: false
      });
    } catch (error) {
      console.error('Error in fetchRoomById:', error);
      set({
        error: error instanceof Error ? error.message : 'Lỗi tải thông tin phòng',
        isLoading: false
      });
    }
  },

  createRoom: async (roomData: CreateRoomData) => {
    set({ isLoading: true, error: null });
    
    try {
      const newRoom = await roomService.createRoom(roomData);
      
      if (newRoom) {
        const currentRooms = get().rooms;
        set({
          rooms: [...currentRooms, newRoom],
          isLoading: false
        });
        return true;
      }
      
      return false;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi tạo phòng mới',
        isLoading: false
      });
      return false;
    }
  },

  updateRoom: async (roomData: UpdateRoomData) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedRoom = await roomService.updateRoom(roomData);
      
      if (updatedRoom) {
        const currentRooms = get().rooms;
        const updatedRooms = currentRooms.map(room => 
          room.id === updatedRoom.id ? updatedRoom : room
        );
        
        set({
          rooms: updatedRooms,
          selectedRoom: get().selectedRoom?.id === updatedRoom.id ? updatedRoom : get().selectedRoom,
          isLoading: false
        });
        return true;
      }
      
      return false;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi cập nhật phòng',
        isLoading: false
      });
      return false;
    }
  },

  deleteRoom: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const success = await roomService.deleteRoom(id);
      
      if (success) {
        const currentRooms = get().rooms;
        const filteredRooms = currentRooms.filter(room => room.id !== id);
        
        set({
          rooms: filteredRooms,
          selectedRoom: get().selectedRoom?.id === id ? null : get().selectedRoom,
          isLoading: false
        });
        return true;
      }
      
      return false;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi xóa phòng',
        isLoading: false
      });
      return false;
    }
  },

  uploadRoomImages: async (roomId: string, files: File[]) => {
    try {
      const imageUrls = await roomService.uploadRoomImages(roomId, files);
      
      // Update room with new images
      const currentRooms = get().rooms;
      const updatedRooms = currentRooms.map(room => {
        if (room.id === roomId) {
          return {
            ...room,
            images: [...room.images, ...imageUrls]
          };
        }
        return room;
      });
      
      set({ rooms: updatedRooms });
      
      return imageUrls;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi tải ảnh lên'
      });
      return [];
    }
  },

  checkAvailability: async (roomId: string, checkIn: string, checkOut: string) => {
    try {
      return await roomService.checkAvailability(roomId, checkIn, checkOut);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Lỗi kiểm tra tình trạng phòng'
      });
      return false;
    }
  },

  setSearchParams: (params: RoomSearchParams) => {
    set({ searchParams: params });
  },

  clearError: () => set({ error: null }),

  setSelectedRoom: (room: Room | null) => set({ selectedRoom: room })
}));





