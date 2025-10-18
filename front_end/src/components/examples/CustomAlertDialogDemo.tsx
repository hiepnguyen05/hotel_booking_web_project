import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function CustomAlertDialogDemo() {
  const [result, setResult] = useState(null as string | null);

  const handleConfirm = () => {
    setResult("Người dùng đã xác nhận hành động");
    setTimeout(() => setResult(null), 3000);
  };

  const handleCancel = () => {
    setResult("Người dùng đã hủy hành động");
    setTimeout(() => setResult(null), 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Custom Alert Dialog Demo</CardTitle>
          <CardDescription>
            Một ví dụ về hộp thoại thông báo đẹp, phù hợp với phong cách website đặt phòng khách sạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button 
              className=""
              variant="default"
              size="default"
              onClick={() => {
                if (window.confirm("Bạn có muốn tiếp tục không?")) {
                  handleConfirm();
                } else {
                  handleCancel();
                }
              }}
            >
              Hiển thị thông báo
            </Button>
            
            <Button 
              className=""
              variant="destructive"
              size="default"
              onClick={() => {
                if (window.confirm("Bạn có chắc chắn muốn xóa không? Hành động này không thể hoàn tác.")) {
                  handleConfirm();
                } else {
                  handleCancel();
                }
              }}
            >
              Xóa dữ liệu
            </Button>
            
            <Button 
              className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
              variant="outline"
              size="default"
              onClick={() => {
                alert("Thao tác thành công!");
                setResult("Thao tác đã được thực hiện thành công");
                setTimeout(() => setResult(null), 3000);
              }}
            >
              Thành công
            </Button>
          </div>
          
          {result && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
              <p>{result}</p>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Thông tin về Custom Alert Dialog:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Thiết kế hiện đại với hiệu ứng mờ nền (backdrop-blur)</li>
              <li>Màu sắc hài hòa, phù hợp với phong cách khách sạn sang trọng</li>
              <li>Có nhiều biến thể: mặc định, thành công, cảnh báo, hủy bỏ</li>
              <li>Hiệu ứng chuyển động mượt mà khi mở/đóng</li>
              <li>Dễ dàng tùy chỉnh và tích hợp vào các component khác</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}