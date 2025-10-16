import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { Plus, Edit, Trash2, Search, Eye, RefreshCw } from "lucide-react";
import { Room, roomService } from "../../services/roomService";
import { AddRoomDialog } from "./AddRoomDialog";
import { EditRoomDialog } from "./EditRoomDialog";


// Get the API base URL from environment variables or use default
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'available':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Có sẵn</Badge>;
    case 'booked':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đã đặt</Badge>;
    case 'maintenance':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Bảo trì</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getRoomTypeLabel = (type: string) => {
  switch (type) {
    case 'single': return 'Phòng đơn';
    case 'double': return 'Phòng đôi';
    case 'suite': return 'Suite';
    case 'deluxe': return 'Deluxe';
    default: return type;
  }
};

export function RoomManagement() {
  const [rooms, setRooms] = useState([] as Room[]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null as Room | null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null as Room | null);

  // Load rooms
  const loadRooms = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterType !== 'all' && { type: filterType })
      };

      const result = await roomService.getAdminRooms(params);
      setRooms(result.items);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Load rooms error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [currentPage, filterStatus, filterType]);

  // Filter rooms by search term
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRoom = (room: Room) => {
    setRoomToDelete(room);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteRoom = async () => {
    if (!roomToDelete) return;

    try {
      await roomService.deleteRoom(roomToDelete._id || roomToDelete.id);
      await loadRooms(); // Reload rooms
      setIsDeleteDialogOpen(false);
      setRoomToDelete(null);
    } catch (error) {
      console.error('Delete room error:', error);
      alert('Có lỗi xảy ra khi xóa phòng. Vui lòng thử lại.');
    }
  };

  const handleSuccess = () => {
    loadRooms(); // Reload rooms after add/edit
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý phòng</h1>
          <p className="text-gray-600">Quản lý thông tin và trạng thái phòng</p>
        </div>

        <div className="flex gap-2">
          <Button className="" variant="default" size="default" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm phòng
          </Button>
          <Button className="" variant="outline" size="default" onClick={loadRooms} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên phòng hoặc loại phòng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Lọc theo loại phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại phòng</SelectItem>
                <SelectItem value="single">Phòng đơn</SelectItem>
                <SelectItem value="double">Phòng đôi</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="available">Có sẵn</SelectItem>
                <SelectItem value="booked">Đã đặt</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <>
          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Card key={room._id || room.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{room.name}</CardTitle>
                    {getStatusBadge(room.status)}
                  </div>
                  <p className="text-gray-600">{getRoomTypeLabel(room.type)}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Room Image */}
                  {room.images && room.images.length > 0 && (
                    <div className="w-full h-32 rounded-lg overflow-hidden">
                      <img
                        src={room.images[0].startsWith('http') ? room.images[0] : room.images[0].startsWith('/uploads') ? `${API_BASE_URL.replace('/api', '')}${room.images[0]}` : `${API_BASE_URL}${room.images[0].startsWith('/') ? room.images[0] : `/${room.images[0]}`}`}
                        alt={room.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback for broken images
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/300x200?text=No+Image'; // Placeholder image
                        }}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Giá:</p>
                      <p className="font-medium">{room.price.toLocaleString('vi-VN')}₫/đêm</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Sức chứa:</p>
                      <p className="font-medium">{room.capacity} khách</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Loại giường:</p>
                      <p className="font-medium">{room.bedType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tạo lúc:</p>
                      <p className="font-medium">{new Date(room.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>

                  {room.amenities && room.amenities.length > 0 && (
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Tiện ích:</p>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {room.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.amenities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button
                      className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditRoom(room)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Sửa
                    </Button>
                    <Button
                      className="flex-1"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteRoom(room)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button
                className=""
                size="default"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Trước
              </Button>

              <span className="text-sm text-gray-600">
                Trang {pagination.page} / {pagination.pages} ({pagination.total} phòng)
              </span>

              <Button
                className=""
                size="default"
                variant="outline"
                disabled={currentPage === pagination.pages}
                onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}

      {filteredRooms.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Không tìm thấy phòng nào phù hợp với bộ lọc.</p>
          </CardContent>
        </Card>
      )}

      {/* Add Room Dialog */}
      <AddRoomDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleSuccess}
      />

      {/* Edit Room Dialog */}
      <EditRoomDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        room={selectedRoom}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa phòng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa phòng "{roomToDelete?.name}"?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-3 mt-6">
            <Button 
              className="" 
              size="default" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              className=""
              size="default"
              variant="destructive"
              onClick={confirmDeleteRoom}
            >
              Xóa phòng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}