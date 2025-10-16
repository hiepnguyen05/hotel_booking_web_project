import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Plus, Edit, Trash2, Search, Eye } from "lucide-react";

const rooms = [
  {
    id: "1",
    number: "101",
    type: "Deluxe Ocean View",
    status: "available",
    price: 3500000,
    capacity: 2,
    size: "35m²",
    amenities: ["Wifi", "Ocean view", "Balcony"],
    lastCleaned: "2025-01-01",
    nextMaintenance: "2025-01-15"
  },
  {
    id: "2",
    number: "102",
    type: "Deluxe Ocean View",
    status: "occupied",
    price: 3500000,
    capacity: 2,
    size: "35m²",
    amenities: ["Wifi", "Ocean view", "Balcony"],
    lastCleaned: "2024-12-30",
    nextMaintenance: "2025-01-15"
  },
  {
    id: "3",
    number: "201",
    type: "Junior Suite",
    status: "maintenance",
    price: 5200000,
    capacity: 3,
    size: "55m²",
    amenities: ["Wifi", "Ocean view", "Balcony"],
    lastCleaned: "2024-12-28",
    nextMaintenance: "2025-01-02"
  },
  {
    id: "4",
    number: "301",
    type: "Family Suite",
    status: "available",
    price: 7800000,
    capacity: 4,
    size: "75m²",
    amenities: ["Wifi", "Ocean view", "Balcony"],
    lastCleaned: "2025-01-01",
    nextMaintenance: "2025-01-20"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'available':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Trống</Badge>;
    case 'occupied':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Có khách</Badge>;
    case 'maintenance':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Bảo trì</Badge>;
    case 'cleaning':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Dọn phòng</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export function RoomManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || room.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý phòng</h1>
          <p className="text-gray-600">Quản lý thông tin và trạng thái phòng</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm phòng
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm phòng mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Số phòng</Label>
                  <Input id="roomNumber" placeholder="Nhập số phòng" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomType">Loại phòng</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deluxe">Deluxe Ocean View</SelectItem>
                      <SelectItem value="junior">Junior Suite</SelectItem>
                      <SelectItem value="family">Family Suite</SelectItem>
                      <SelectItem value="presidential">Presidential Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Giá phòng (VNĐ)</Label>
                  <Input id="price" type="number" placeholder="3500000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Sức chứa</Label>
                  <Input id="capacity" type="number" placeholder="2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Diện tích</Label>
                  <Input id="size" placeholder="35m²" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amenities">Tiện ích</Label>
                <Textarea id="amenities" placeholder="Wifi, Ocean view, Balcony..." />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Thêm phòng
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo số phòng hoặc loại phòng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="available">Trống</SelectItem>
                <SelectItem value="occupied">Có khách</SelectItem>
                <SelectItem value="maintenance">Bảo trì</SelectItem>
                <SelectItem value="cleaning">Dọn phòng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Phòng {room.number}</CardTitle>
                {getStatusBadge(room.status)}
              </div>
              <p className="text-gray-600">{room.type}</p>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <p className="text-gray-600">Diện tích:</p>
                  <p className="font-medium">{room.size}</p>
                </div>
                <div>
                  <p className="text-gray-600">Dọn phòng:</p>
                  <p className="font-medium">{room.lastCleaned}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-600 text-sm mb-2">Tiện ích:</p>
                <div className="flex flex-wrap gap-1">
                  {room.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Xem
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Sửa
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Không tìm thấy phòng nào phù hợp với bộ lọc.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}