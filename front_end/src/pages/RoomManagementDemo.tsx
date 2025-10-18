import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { RoomDeleteDialog } from "../components/admin/RoomDeleteDialog";
import { Plus, Edit, Eye } from "lucide-react";

interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  status: string;
}

export function RoomManagementDemo() {
  const [rooms, setRooms] = useState([
    {
      id: "1",
      name: "Phòng Deluxe Biển",
      type: "Deluxe",
      price: 2500000,
      status: "Có sẵn"
    },
    {
      id: "2",
      name: "Phòng Suite Tổng thống",
      type: "Suite",
      price: 5000000,
      status: "Có sẵn"
    },
    {
      id: "3",
      name: "Phòng Gia đình",
      type: "Family",
      price: 3500000,
      status: "Bảo trì"
    }
  ] as Room[]);

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter(room => room.id !== roomId));
    alert(`Phòng đã được xóa thành công!`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Quản lý phòng</h1>
            <p className="text-gray-600">Quản lý các phòng trong khách sạn</p>
          </div>
          <Button className="flex items-center gap-2" variant="default" size="default">
            <Plus className="h-4 w-4" />
            Thêm phòng mới
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách phòng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Tên phòng</th>
                    <th className="text-left py-3 px-4">Loại phòng</th>
                    <th className="text-left py-3 px-4">Giá/đêm</th>
                    <th className="text-left py-3 px-4">Trạng thái</th>
                    <th className="text-left py-3 px-4">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{room.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {room.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">{room.price.toLocaleString('vi-VN')}₫</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          room.status === "Có sẵn" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <RoomDeleteDialog 
                            roomName={room.name} 
                            onConfirm={() => handleDeleteRoom(room.id)} 
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Tính năng Custom Alert Dialog</h3>
          <p className="text-blue-700 text-sm">
            Component RoomDeleteDialog sử dụng CustomAlertDialog - một component hộp thoại 
            thông báo được thiết kế đẹp, phù hợp với phong cách website đặt phòng khách sạn.
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-blue-700 space-y-1">
            <li>Thiết kế hiện đại với hiệu ứng mờ nền</li>
            <li>Màu sắc hài hòa, phù hợp với phong cách khách sạn sang trọng</li>
            <li>Có hiệu ứng chuyển động mượt mà khi mở/đóng</li>
            <li>Dễ dàng tùy chỉnh và tích hợp vào các component khác</li>
          </ul>
        </div>
      </div>
    </div>
  );
}