import { create } from 'zustand';
import { roomService, Room, CreateRoomData, UpdateRoomData } from '../services/roomService';

interface RoomState {
  rooms: Room[];
  selectedRoom: Room | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRooms: (params?: any) => Promise<void>;
  fetchRoomById: (id: string) => Promise<void>;
  createRoom: (roomData: CreateRoomData) => Promise<boolean>;
  updateRoom: (roomData: UpdateRoomData) => Promise<boolean>;
  deleteRoom: (id: string) => Promise<boolean>;
  clearError: () => void;
  setSelectedRoom: (room: Room | null) => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: [],
  selectedRoom: null,
  isLoading: false,
  error: null,

  fetchRooms: async (params?: any) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await roomService.getAdminRooms(params || {});
      set({
        rooms: result.items,
        isLoading: false
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
      const room = await roomService.getRoomById(id);
      set({
        selectedRoom: room,
        isLoading: false
      });
    } catch (error) {
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
          room._id === updatedRoom._id ? updatedRoom : room
        );
        
        set({
          rooms: updatedRooms,
          selectedRoom: get().selectedRoom?._id === updatedRoom._id ? updatedRoom : get().selectedRoom,
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
        const filteredRooms = currentRooms.filter(room => room._id !== id);
        
        set({
          rooms: filteredRooms,
          selectedRoom: get().selectedRoom?._id === id ? null : get().selectedRoom,
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

  clearError: () => set({ error: null }),

  setSelectedRoom: (room: Room | null) => set({ selectedRoom: room })
}));