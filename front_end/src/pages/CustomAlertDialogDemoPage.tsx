import { CustomAlertDialogDemo } from "../components/examples/CustomAlertDialogDemo";

export function CustomAlertDialogDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Custom Alert Dialog Demo</h1>
        <p className="text-gray-600 mb-8">
          Trang demo hiển thị các ví dụ về Custom Alert Dialog - Hộp thoại thông báo đẹp, 
          phù hợp với phong cách website đặt phòng khách sạn
        </p>
        
        <CustomAlertDialogDemo />
      </div>
    </div>
  );
}