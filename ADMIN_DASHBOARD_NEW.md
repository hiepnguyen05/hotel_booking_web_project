# Trang Quản Trị Mới - NgocHiepHotel

## Tổng quan

Dự án này cung cấp một hệ thống quản trị mới với giao diện hiện đại, chuyên nghiệp và responsive cho khách sạn NgocHiepHotel. Hệ thống được thiết kế với tỷ lệ sidebar 20% và nội dung chính 80%, đảm bảo trải nghiệm người dùng tốt trên mọi thiết bị.

## Cấu trúc thư mục

```
src/
├── components/
│   └── AdminLayoutNew.tsx          # Layout chính cho trang quản trị
├── pages/Dashboard/
│   ├── AdminLoginNew.tsx           # Trang đăng nhập admin mới
│   ├── DashboardNew.tsx            # Trang dashboard mới
│   ├── RoomManagementNew.tsx       # Quản lý phòng mới
│   └── BookingManagementNew.tsx    # Quản lý đặt phòng mới
└── router/
    └── AppRouter.tsx               # Cấu hình router
```

## Các tính năng chính

### 1. Layout Quản Trị (AdminLayoutNew)

- **Tỷ lệ**: Sidebar chiếm 20%, nội dung chính chiếm 80%
- **Responsive**: Tự động điều chỉnh trên các thiết bị di động
- **Thanh điều hướng**: Menu dọc với các biểu tượng và nhãn
- **Thu gọn/mở rộng**: Có thể thu gọn sidebar để tiết kiệm không gian
- **Thông tin người dùng**: Hiển thị thông tin admin đang đăng nhập

### 2. Trang Dashboard Mới (DashboardNew)

- **Thống kê tổng quan**: Hiển thị các chỉ số quan trọng như tổng số phòng, đặt phòng hôm nay, khách hàng, doanh thu
- **Biểu đồ**: Trực quan hóa dữ liệu với biểu đồ tỷ lệ lấp đầy
- **Đặt phòng gần đây**: Danh sách các đặt phòng mới nhất với trạng thái
- **Hành động nhanh**: Các nút tắt để truy cập nhanh vào các chức năng chính

### 3. Quản Lý Phòng (RoomManagementNew)

- **Danh sách phòng**: Hiển thị dưới dạng grid với hình ảnh và thông tin chi tiết
- **Bộ lọc**: Lọc theo loại phòng và trạng thái
- **Tìm kiếm**: Tìm kiếm theo tên phòng hoặc loại phòng
- **Hành động**: Xem, chỉnh sửa, xóa phòng
- **Dialog thêm/sửa**: Form trực quan để thêm hoặc chỉnh sửa thông tin phòng

### 4. Quản Lý Đặt Phòng (BookingManagementNew)

- **Bảng dữ liệu**: Hiển thị tất cả các đặt phòng với đầy đủ thông tin
- **Bộ lọc**: Lọc theo trạng thái đặt phòng và thanh toán
- **Tìm kiếm**: Tìm kiếm theo mã đặt phòng, tên khách hàng hoặc tên phòng
- **Hành động**: Xem chi tiết, chỉnh sửa, hủy đặt phòng

### 5. Trang Đăng Nhập Admin Mới (AdminLoginNew)

- **Giao diện hiện đại**: Thiết kế gradient với hiệu ứng bóng
- **Form đăng nhập**: Nhập email và mật khẩu với khả năng hiển thị mật khẩu
- **Tính năng**: Ghi nhớ đăng nhập, quên mật khẩu
- **Xác thực**: Tích hợp với hệ thống auth store

## Cách sử dụng

### Truy cập trang quản trị mới

1. **Đăng nhập**: Truy cập `/admin-new/login` để đăng nhập
2. **Dashboard**: Sau khi đăng nhập sẽ chuyển hướng đến `/admin-new/dashboard`
3. **Điều hướng**: Sử dụng menu bên trái để di chuyển giữa các trang

### Các route mới

- `/admin-new/login` - Trang đăng nhập admin mới
- `/admin-new/dashboard` - Dashboard mới
- `/admin-new/rooms` - Quản lý phòng mới
- `/admin-new/bookings` - Quản lý đặt phòng mới
- `/admin-new/customers` - Quản lý khách hàng (sử dụng component cũ)
- `/admin-new/settings` - Cài đặt (sử dụng component cũ)

## Tính năng responsive

- **Mobile**: Sidebar tự động ẩn và có nút menu để mở rộng
- **Tablet**: Sidebar có thể thu gọn để tiết kiệm không gian
- **Desktop**: Hiển thị đầy đủ với tỷ lệ 20%/80%

## Công nghệ sử dụng

- **React**: Thư viện UI
- **TypeScript**: Type checking
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Zustand**: State management

## Hướng dẫn phát triển

### Thêm menu mới

1. Mở file `AdminLayoutNew.tsx`
2. Thêm mục mới vào mảng `menuItems`:

```typescript
const menuItems = [
  // ... các mục hiện có
  { key: 'new-feature', label: 'Tính năng mới', icon: NewIcon, path: '/admin-new/new-feature' },
];
```

3. Thêm route trong `AppRouter.tsx`:

```typescript
<Route path="new-feature" element={<NewFeatureComponent />} />
```

### Tùy chỉnh giao diện

- **Màu sắc**: Thay đổi gradient trong `AdminLayoutNew.tsx` (dòng chứa `from-blue-900 to-blue-800`)
- **Kích thước sidebar**: Điều chỉnh trong class của sidebar (hiện tại là `w-1/5`)
- **Khoảng cách**: Sử dụng các class padding/margin của Tailwind

## Ghi chú quan trọng

1. **Layout mới** không ảnh hưởng đến hệ thống cũ, chỉ thêm các route mới bắt đầu bằng `/admin-new`
2. **Component cũ** vẫn được giữ nguyên để đảm bảo tương thích ngược
3. **Dữ liệu** trong các component mới hiện đang sử dụng mock data, cần tích hợp với API thực tế
4. **Xác thực** đã được tích hợp với auth store hiện có

## Các cải tiến trong tương lai

1. Tích hợp với API thực tế thay vì mock data
2. Thêm biểu đồ thống kê chi tiết với Recharts
3. Cải thiện tính năng tìm kiếm và lọc nâng cao
4. Thêm phân trang cho các danh sách lớn
5. Tối ưu hóa hiệu suất với React.memo và useCallback
6. Thêm dark mode
7. Cải thiện accessibility (ARIA labels, keyboard navigation)