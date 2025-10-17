# Trang Quản Trị Phòng - Hệ Thống Booking Hotel

## Tổng quan
Đã xây dựng hoàn chỉnh trang quản trị phòng với đầy đủ chức năng CRUD (Create, Read, Update, Delete) theo thiết kế giao diện và tích hợp với backend APIs.

## Các tính năng đã hoàn thành

### 1. Giao diện quản lý phòng
- **Layout**: Grid responsive hiển thị danh sách phòng
- **Card design**: Mỗi phòng hiển thị trong một card với đầy đủ thông tin
- **Status badges**: Hiển thị trạng thái phòng với màu sắc phù hợp
- **Room images**: Hiển thị hình ảnh đại diện của phòng

### 2. Chức năng tìm kiếm và lọc
- **Tìm kiếm**: Theo tên phòng hoặc loại phòng
- **Lọc theo loại phòng**: Single, Double, Suite, Deluxe
- **Lọc theo trạng thái**: Có sẵn, Đã đặt, Bảo trì
- **Pagination**: Phân trang với thông tin chi tiết

### 3. Thêm phòng mới (AddRoomDialog)
- **Form đầy đủ**:
  - Tên phòng, loại phòng, loại giường
  - Giá phòng, sức chứa, trạng thái
  - Mô tả chi tiết
  - Upload nhiều hình ảnh (tối đa 10 ảnh)
  - Chọn tiện nghi từ danh sách có sẵn
  - Thêm tiện nghi tùy chỉnh
- **Validation**: Kiểm tra dữ liệu đầu vào
- **Preview**: Xem trước hình ảnh đã chọn

### 4. Chỉnh sửa phòng (EditRoomDialog)
- **Load dữ liệu**: Tự động điền thông tin phòng hiện tại
- **Cập nhật từng phần**: Có thể cập nhật riêng lẻ từng trường
- **Quản lý hình ảnh**: 
  - Hiển thị hình ảnh hiện tại
  - Thêm hình ảnh mới
  - Giữ nguyên hình ảnh cũ nếu không thay đổi
- **Cập nhật tiện nghi**: Thêm/xóa tiện nghi dễ dàng

### 5. Xóa phòng
- **Confirmation dialog**: Xác nhận trước khi xóa
- **Safe delete**: Hiển thị tên phòng trong dialog xác nhận
- **Error handling**: Xử lý lỗi khi xóa không thành công

### 6. Tích hợp Backend APIs

#### Frontend Services (roomService.ts):
- `getAdminRooms()`: Lấy danh sách phòng với pagination và filter
- `createRoom()`: Tạo phòng mới với upload ảnh
- `updateRoom()`: Cập nhật phòng với/không có ảnh mới
- `deleteRoom()`: Xóa phòng
- `getRoomById()`: Lấy chi tiết phòng

#### Backend APIs (adminRoom.controller.js):
- `GET /admin/rooms`: Lấy danh sách phòng với query params
- `POST /admin/rooms`: Tạo phòng mới với multipart/form-data
- `PUT /admin/rooms/:id`: Cập nhật phòng
- `DELETE /admin/rooms/:id`: Xóa phòng
- `GET /admin/rooms/:id`: Lấy chi tiết phòng

### 7. Upload và quản lý hình ảnh
- **Multer integration**: Xử lý upload file trong backend
- **File validation**: Chỉ chấp nhận image files
- **Storage**: Lưu trong thư mục `uploads/rooms/`
- **Preview**: Hiển thị preview trước khi upload
- **Multiple files**: Hỗ trợ upload nhiều ảnh cùng lúc

### 8. Data Models và Validation

#### Room Model (MongoDB):
```javascript
{
  name: String,           // Tên phòng
  type: String,           // single, double, suite, deluxe
  bedType: String,        // single, double, queen, king
  price: Number,          // Giá phòng/đêm
  description: String,    // Mô tả
  capacity: Number,       // Sức chứa
  amenities: [String],    // Danh sách tiện nghi
  images: [String],       // Đường dẫn hình ảnh
  status: String,         // available, booked, maintenance
  createdAt: Date,
  updatedAt: Date
}
```

### 9. UI/UX Features
- **Loading states**: Spinner khi đang tải dữ liệu
- **Error handling**: Thông báo lỗi rõ ràng
- **Responsive design**: Tương thích mobile và desktop
- **Smooth animations**: Hover effects và transitions
- **Accessibility**: Proper labels và keyboard navigation

### 10. Performance Optimizations
- **Pagination**: Tải dữ liệu theo trang
- **Image optimization**: Resize và compress ảnh
- **Lazy loading**: Chỉ tải ảnh khi cần thiết
- **Debounced search**: Tối ưu tìm kiếm

## Cách sử dụng

### Cho Admin:
1. **Truy cập trang quản trị**: `/admin/rooms`
2. **Xem danh sách phòng**: Tự động load khi vào trang
3. **Tìm kiếm/Lọc**: Sử dụng search box và dropdown filters
4. **Thêm phòng mới**: 
   - Nhấn nút "Thêm phòng"
   - Điền form đầy đủ
   - Upload hình ảnh
   - Chọn tiện nghi
   - Nhấn "Thêm phòng"
5. **Chỉnh sửa phòng**:
   - Nhấn nút "Sửa" trên card phòng
   - Cập nhật thông tin cần thiết
   - Nhấn "Cập nhật phòng"
6. **Xóa phòng**:
   - Nhấn nút "Xóa" trên card phòng
   - Xác nhận trong dialog
   - Phòng sẽ bị xóa vĩnh viễn

### Authentication:
- Yêu cầu đăng nhập với quyền admin
- JWT token authentication
- Auto-redirect nếu không có quyền

## Technical Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React hooks
- **API Client**: Custom fetch wrapper
- **File Upload**: FormData + Multer
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT + Role-based access

## Security Features
- **Role-based access**: Chỉ admin mới truy cập được
- **Input validation**: Validate dữ liệu frontend và backend
- **File upload security**: Kiểm tra file type và size
- **SQL Injection protection**: Sử dụng MongoDB ODM
- **XSS protection**: Sanitize input data

## Future Enhancements
- Bulk operations (xóa/cập nhật nhiều phòng)
- Advanced filters (giá, ngày tạo, etc.)
- Room availability calendar
- Image gallery với zoom
- Export/Import room data
- Room booking history
- Analytics và reports





