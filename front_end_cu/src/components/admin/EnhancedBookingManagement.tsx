import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { 
  Calendar, 
  Search, 
  Eye, 
  Edit, 
  X, 
  Download, 
  CreditCard, 
  Check, 
  CheckCircle, 
  Filter,
  User,
  Phone,
  Mail,
  Home,
  Clock,
  DollarSign,
  AlertCircle,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { bookingService } from "../../services/bookingService";
import { Booking, CancellationRequest } from "../../services/bookingService";
import { toast } from "sonner";

// Type guard functions
const isPopulatedUser = (user: string | { _id: string; username: string; email: string }): user is { _id: string; username: string; email: string } => {
  return typeof user !== 'string' && user !== null && typeof user === 'object' && 'username' in user;
};

const isRoom = (room: string | { _id?: string; name: string; type: string; capacity: number; status: string }): room is { _id?: string; name: string; type: string; capacity: number; status: string } => {
  return typeof room !== 'string' && room !== null && typeof room === 'object' && 'name' in room;
};

// Booking detail dialog component
const BookingDetailDialog = ({ booking, open, onOpenChange }: { booking: Booking | null; open: boolean; onOpenChange: (open: boolean) => void }) => {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-w-[95vw] md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Chi tiết đặt phòng</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về đơn đặt phòng #{booking.bookingCode}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Thông tin khách hàng
            </h3>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <p><span className="font-medium">Tên khách hàng:</span> {isPopulatedUser(booking.user) ? booking.user.username : 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {isPopulatedUser(booking.user) ? booking.user.email : 'N/A'}</p>
              <p><span className="font-medium">Số điện thoại:</span> {booking.phone || 'N/A'}</p>
              <p><span className="font-medium">Mã đặt phòng:</span> {booking.bookingCode}</p>
              <p><span className="font-medium">Ngày đặt:</span> {booking.createdAt ? new Date(booking.createdAt).toLocaleString('vi-VN') : 'N/A'}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Thông tin phòng
            </h3>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <p><span className="font-medium">Tên phòng:</span> {isRoom(booking.room) ? booking.room.name : 'N/A'}</p>
              <p><span className="font-medium">Loại phòng:</span> {isRoom(booking.room) ? booking.room.type : 'N/A'}</p>
              <p><span className="font-medium">Sức chứa:</span> {isRoom(booking.room) ? booking.room.capacity : 'N/A'} người</p>
              <p><span className="font-medium">Trạng thái phòng:</span> {isRoom(booking.room) ? booking.room.status : 'N/A'}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Thời gian lưu trú
            </h3>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <p><span className="font-medium">Ngày nhận phòng:</span> {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
              <p><span className="font-medium">Ngày trả phòng:</span> {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
              <p><span className="font-medium">Số đêm:</span> {Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} đêm</p>
              <p><span className="font-medium">Số lượng phòng:</span> {booking.roomCount}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Thông tin thanh toán
            </h3>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <p><span className="font-medium">Tổng giá:</span> <span className="text-lg font-bold text-green-600">{(booking.totalPrice || 0).toLocaleString('vi-VN')}₫</span></p>
              <p><span className="font-medium">Trạng thái thanh toán:</span> 
                <Badge className={`ml-2 ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {booking.paymentStatus === 'paid' ? 'Đã thanh toán' : booking.paymentStatus === 'pending' ? 'Chờ thanh toán' : 'Thất bại'}
                </Badge>
              </p>
              <p><span className="font-medium">Phương thức thanh toán:</span> 
                <Badge className="ml-2 bg-blue-100 text-blue-800">MoMo</Badge>
              </p>
              {booking.momoTransactionId && (
                <p><span className="font-medium">Mã giao dịch MoMo:</span> {booking.momoTransactionId}</p>
              )}
              <p><span className="font-medium">Số người lớn:</span> {booking.adultCount}</p>
              <p><span className="font-medium">Số trẻ em:</span> {booking.childCount}</p>
            </div>
          </div>
          
          {booking.notes && (
            <div className="md:col-span-2">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Ghi chú
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">{booking.notes}</p>
              </div>
            </div>
          )}
          
          {booking.cancellationRequest && (
            <div className="md:col-span-2">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Yêu cầu hủy phòng
              </h3>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-medium">Trạng thái yêu cầu:</span> 
                      <Badge className={`ml-2 ${booking.cancellationRequest.status === 'approved' ? 'bg-green-100 text-green-800' : booking.cancellationRequest.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {booking.cancellationRequest.status === 'approved' ? 'Đã duyệt' : booking.cancellationRequest.status === 'rejected' ? 'Bị từ chối' : 'Chờ xử lý'}
                      </Badge>
                    </p>
                    <p><span className="font-medium">Trạng thái hoàn tiền:</span> 
                      <Badge className={`ml-2 ${
                        booking.cancellationRequest.refundStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                        booking.cancellationRequest.refundStatus === 'failed' ? 'bg-red-100 text-red-800' : 
                        booking.cancellationRequest.refundStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.cancellationRequest.refundStatus === 'completed' ? 'Đã hoàn tiền' : 
                         booking.cancellationRequest.refundStatus === 'failed' ? 'Hoàn tiền thất bại' : 
                         booking.cancellationRequest.refundStatus === 'pending' ? 'Đang xử lý' : 'Chưa yêu cầu'}
                      </Badge>
                    </p>
                    <p><span className="font-medium">Số tiền hoàn:</span> {(booking.cancellationRequest.refundAmount || 0).toLocaleString('vi-VN')}₫</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Lý do hủy:</span> {booking.cancellationRequest.reason}</p>
                    {booking.cancellationRequest.adminNotes && (
                      <p><span className="font-medium">Ghi chú của admin:</span> {booking.cancellationRequest.adminNotes}</p>
                    )}
                    <p><span className="font-medium">Ngày yêu cầu:</span> {new Date(booking.cancellationRequest.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button className="" size="default" variant="default" onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Cancellation request detail dialog
const CancellationRequestDetailDialog = ({ 
  request, 
  open, 
  onOpenChange,
  onApprove,
  onReject,
  onProcessRefund
}: { 
  request: CancellationRequest | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onApprove: (requestId: string, notes?: string) => void;
  onReject: (requestId: string, notes: string) => void;
  onProcessRefund: (requestId: string) => void;
}) => {
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!request) return null;

  const handleApprove = () => {
    onApprove(request._id, adminNotes);
    onOpenChange(false);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
    onReject(request._id, rejectReason);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Chi tiết yêu cầu hủy phòng</DialogTitle>
          <DialogDescription>
            Yêu cầu hủy phòng #{request._id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Thông tin yêu cầu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Mã yêu cầu:</span> {request._id}</p>
                <p><span className="font-medium">Trạng thái:</span> 
                  <Badge className={`ml-2 ${request.status === 'approved' ? 'bg-green-100 text-green-800' : request.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {request.status === 'approved' ? 'Đã duyệt' : request.status === 'rejected' ? 'Bị từ chối' : 'Chờ xử lý'}
                  </Badge>
                </p>
                <p><span className="font-medium">Trạng thái hoàn tiền:</span> 
                  <Badge className={`ml-2 ${
                    request.refundStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                    request.refundStatus === 'failed' ? 'bg-red-100 text-red-800' : 
                    request.refundStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {request.refundStatus === 'completed' ? 'Đã hoàn tiền' : 
                     request.refundStatus === 'failed' ? 'Hoàn tiền thất bại' : 
                     request.refundStatus === 'pending' ? 'Đang xử lý' : 'Chưa yêu cầu'}
                  </Badge>
                </p>
              </div>
              <div>
                <p><span className="font-medium">Ngày yêu cầu:</span> {new Date(request.createdAt).toLocaleString('vi-VN')}</p>
                <p><span className="font-medium">Số tiền hoàn:</span> {(request.refundAmount || 0).toLocaleString('vi-VN')}₫</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Lý do hủy phòng</h3>
            <p>{request.reason}</p>
          </div>
          
          {request.adminNotes && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Ghi chú của admin</h3>
              <p>{request.adminNotes}</p>
            </div>
          )}
          
          {showRejectForm ? (
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-red-800">Lý do từ chối</h3>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối yêu cầu hủy phòng..."
              />
              <div className="flex space-x-2 mt-3">
                <Button className="" variant="destructive" size="sm" onClick={handleReject}>
                  Xác nhận từ chối
                </Button>
                <Button className="" variant="outline" size="sm" onClick={() => setShowRejectForm(false)}>
                  Hủy
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {request.status === 'pending' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Xử lý yêu cầu</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Ghi chú của admin (tùy chọn)</label>
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows={2}
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Nhập ghi chú nếu cần..."
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button className="" variant="default" size="sm" onClick={handleApprove}>
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Duyệt yêu cầu
                      </Button>
                      <Button className="" variant="destructive" size="sm" onClick={() => setShowRejectForm(true)}>
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Từ chối yêu cầu
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {request.status === 'approved' && request.refundStatus !== 'completed' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Hoàn tiền</h3>
                  <div className="flex items-center justify-between">
                    <p>Yêu cầu đã được duyệt. Bạn có thể thực hiện hoàn tiền cho khách hàng.</p>
                    <Button 
                      className="" 
                      variant="default" 
                      size="sm" 
                      onClick={() => onProcessRefund(request._id)}
                      disabled={request.refundStatus === 'pending'}
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Thực hiện hoàn tiền
                    </Button>
                  </div>
                </div>
              )}
              
              {request.refundStatus === 'completed' && (
                <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold mb-2 text-green-800">Hoàn tiền thành công</h3>
                  <p>Số tiền {(request.refundAmount || 0).toLocaleString('vi-VN')}₫ đã được hoàn lại cho khách hàng.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button className="" variant="outline" size="default" onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Status badge components
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã xác nhận</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ xử lý</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã hủy</Badge>;
    case 'completed':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Đã hoàn thành</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã thanh toán</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ thanh toán</Badge>;
    case 'refunded':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Đã hoàn tiền</Badge>;
    case 'failed':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Thất bại</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getCancellationStatusBadge = (request: CancellationRequest | null) => {
  if (!request) {
    return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Không có yêu cầu</Badge>;
  }
  
  switch (request.status) {
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã duyệt</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ xử lý</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Bị từ chối</Badge>;
    default:
      return <Badge>{request.status}</Badge>;
  }
};

export function EnhancedBookingManagement() {
  // Booking states
  const [bookings, setBookings] = useState([] as Booking[]);
  const [filteredBookings, setFilteredBookings] = useState([] as Booking[]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterCancellation, setFilterCancellation] = useState("all");

  // Cancellation request states
  const [cancellationRequests, setCancellationRequests] = useState([] as CancellationRequest[]);
  const [filteredCancellationRequests, setFilteredCancellationRequests] = useState([] as CancellationRequest[]);
  const [isCancellationRequestsLoading, setIsCancellationRequestsLoading] = useState(true);

  // Tab state
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" or "cancellations"

  // Stats state
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: [] as { year: number; month: number; revenue: number; count: number }[],
    pendingCancellations: 0,
    approvedCancellations: 0,
    rejectedCancellations: 0
  });

  // Dialog states
  const [selectedBooking, setSelectedBooking] = useState(null as Booking | null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedCancellationRequest, setSelectedCancellationRequest] = useState(null as CancellationRequest | null);
  const [isCancellationDetailDialogOpen, setIsCancellationDetailDialogOpen] = useState(false);

  // Load bookings from API
  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const result = await bookingService.getAllBookings();
      console.log('Bookings data:', result.bookings);
      setBookings(result.bookings);
      setFilteredBookings(result.bookings);
    } catch (error) {
      console.error('Load bookings error:', error);
      toast.error("Không thể tải danh sách đặt phòng");
    } finally {
      setIsLoading(false);
    }
  };

  // Load cancellation requests from API
  const loadCancellationRequests = async () => {
    setIsCancellationRequestsLoading(true);
    try {
      const requests = await bookingService.getAllCancellationRequests();
      setCancellationRequests(requests);
      setFilteredCancellationRequests(requests);
    } catch (error) {
      console.error('Load cancellation requests error:', error);
      toast.error("Không thể tải danh sách yêu cầu hủy phòng");
    } finally {
      setIsCancellationRequestsLoading(false);
    }
  };

  // Load stats from API
  const loadStats = async () => {
    try {
      const statsData = await bookingService.getBookingStats();
      
      // Get cancellation stats
      const requests = await bookingService.getAllCancellationRequests();
      const pendingCancellations = requests.filter(r => r.status === 'pending').length;
      const approvedCancellations = requests.filter(r => r.status === 'approved').length;
      const rejectedCancellations = requests.filter(r => r.status === 'rejected').length;
      
      setStats({
        ...statsData,
        pendingCancellations,
        approvedCancellations,
        rejectedCancellations
      });
    } catch (error) {
      console.error('Load stats error:', error);
      toast.error("Không thể tải thống kê");
    }
  };

  useEffect(() => {
    loadBookings();
    loadCancellationRequests();
    loadStats();
  }, []);

  // Filter bookings based on search term, filters and active tab
  useEffect(() => {
    if (activeTab === "bookings") {
      const filtered = bookings.filter(booking => {
        // Kiểm tra các giá trị trước khi gọi toLowerCase
        const bookingId = booking.id || booking._id || '';
        const searchTermLower = searchTerm.toLowerCase();
        
        // Safe check for search term matching
        const matchesSearch = 
          (bookingId && bookingId.toLowerCase().includes(searchTermLower)) ||
          (isPopulatedUser(booking.user) && booking.user.username && booking.user.username.toLowerCase().includes(searchTermLower)) ||
          (isPopulatedUser(booking.user) && booking.user.email && booking.user.email.toLowerCase().includes(searchTermLower)) ||
          (isRoom(booking.room) && booking.room.name && booking.room.name.toLowerCase().includes(searchTermLower)) ||
          (typeof booking.room === 'string' && booking.room.toLowerCase().includes(searchTermLower)) ||
          (booking.bookingCode && booking.bookingCode.toLowerCase().includes(searchTermLower));
          
        const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
        const matchesPayment = filterPayment === "all" || booking.paymentStatus === filterPayment;
        const matchesCancellation = filterCancellation === "all" || 
          (filterCancellation === "has_request" && booking.cancellationRequest !== null) ||
          (filterCancellation === "no_request" && booking.cancellationRequest === null);
        
        return matchesSearch && matchesStatus && matchesPayment && matchesCancellation;
      });
      
      setFilteredBookings(filtered);
    } else {
      // Filter cancellation requests
      const filtered = cancellationRequests.filter(request => {
        const searchTermLower = searchTerm.toLowerCase();
        
        // Safe check for search term matching
        const matchesSearch = 
          (request._id && request._id.toLowerCase().includes(searchTermLower)) ||
          (request.reason && request.reason.toLowerCase().includes(searchTermLower));
          
        const matchesStatus = filterStatus === "all" || request.status === filterStatus;
        const matchesPayment = filterPayment === "all" || request.refundStatus === filterPayment;
        
        return matchesSearch && matchesStatus && matchesPayment;
      });
      
      setFilteredCancellationRequests(filtered);
    }
  }, [bookings, cancellationRequests, searchTerm, filterStatus, filterPayment, filterCancellation, activeTab]);

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      // Validate status value
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        toast.error('Trạng thái không hợp lệ');
        return;
      }
      
      const updatedBooking = await bookingService.updateBookingStatus(bookingId, status as any);
      if (updatedBooking) {
        // Update the booking in the state
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: updatedBooking.status } : booking
        ));
        
        // Reload stats
        loadStats();
        toast.success("Cập nhật trạng thái thành công");
      }
    } catch (error) {
      console.error('Update booking status error:', error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái đặt phòng");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const success = await bookingService.cancelBooking(bookingId);
      if (success) {
        // Update the booking status to cancelled
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        ));
        
        // Reload stats
        loadStats();
        toast.success("Hủy đặt phòng thành công");
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      toast.error("Có lỗi xảy ra khi hủy đặt phòng");
    }
  };

  const handleProcessPayment = async (bookingId: string) => {
    try {
      // Call the payment service to process payment
      const paymentData = {
        bookingId: bookingId,
        paymentMethod: 'online' // MoMo payment
      };
      
      const result = await bookingService.processPayment(paymentData);
      
      if (result.success) {
        // Update the booking payment status in the UI
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, paymentStatus: 'paid' } : booking
        ));
        
        // Reload stats
        loadStats();
        
        toast.success('Thanh toán thành công!');
      } else {
        toast.error('Thanh toán thất bại!');
      }
    } catch (error) {
      console.error('Process payment error:', error);
      toast.error('Có lỗi xảy ra khi xử lý thanh toán');
    }
  };

  const handleExportBookings = (format: 'csv' | 'pdf' = 'csv') => {
    if (format === 'csv') {
      // Create CSV data
      const csvContent = [
        ['Mã đặt phòng', 'Khách hàng', 'Phòng', 'Ngày nhận', 'Ngày trả', 'Trạng thái', 'Thanh toán', 'Tổng giá'],
        ...filteredBookings.map(booking => [
          booking.bookingCode,
          isPopulatedUser(booking.user) ? booking.user.username : 'N/A',
          isRoom(booking.room) ? booking.room.name : 'N/A',
          booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('vi-VN') : 'N/A',
          booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString('vi-VN') : 'N/A',
          booking.status,
          booking.paymentStatus,
          (booking.totalPrice || 0).toLocaleString('vi-VN') + '₫'
        ])
      ].map(row => row.join(',')).join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Xuất file CSV thành công");
    } else {
      // For PDF export, we'll create a simple text format for now
      // In a real implementation, you would use a library like jsPDF
      const pdfContent = [
        'BÁO CÁO ĐẶT PHÒNG',
        `Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`,
        '',
        'Mã đặt phòng,Khách hàng,Phòng,Ngày nhận,Ngày trả,Trạng thái,Thanh toán,Tổng giá',
        ...filteredBookings.map(booking => [
          booking.bookingCode,
          isPopulatedUser(booking.user) ? booking.user.username : 'N/A',
          isRoom(booking.room) ? booking.room.name : 'N/A',
          booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('vi-VN') : 'N/A',
          booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString('vi-VN') : 'N/A',
          booking.status,
          booking.paymentStatus,
          (booking.totalPrice || 0).toLocaleString('vi-VN') + '₫'
        ].join(','))
      ].join('\n');

      // Create download link
      const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Xuất file PDF thành công");
    }
  };

  const handleApproveCancellation = async (requestId: string, adminNotes?: string) => {
    try {
      const updatedRequest = await bookingService.updateCancellationRequestStatus(requestId, 'approved', adminNotes);
      if (updatedRequest) {
        // Update the cancellation request in the state
        setCancellationRequests(prev => prev.map(request => 
          request._id === requestId ? updatedRequest : request
        ));
        
        // Also update the booking's cancellation request
        setBookings(prev => prev.map(booking => 
          booking.cancellationRequest && booking.cancellationRequest._id === requestId 
            ? { ...booking, cancellationRequest: updatedRequest } 
            : booking
        ));
        
        // Reload stats
        loadStats();
        toast.success("Duyệt yêu cầu hủy phòng thành công");
      }
    } catch (error) {
      console.error('Approve cancellation request error:', error);
      toast.error("Có lỗi xảy ra khi duyệt yêu cầu hủy phòng");
    }
  };

  const handleRejectCancellation = async (requestId: string, adminNotes: string) => {
    try {
      const updatedRequest = await bookingService.updateCancellationRequestStatus(requestId, 'rejected', adminNotes);
      if (updatedRequest) {
        // Update the cancellation request in the state
        setCancellationRequests(prev => prev.map(request => 
          request._id === requestId ? updatedRequest : request
        ));
        
        // Also update the booking's cancellation request
        setBookings(prev => prev.map(booking => 
          booking.cancellationRequest && booking.cancellationRequest._id === requestId 
            ? { ...booking, cancellationRequest: updatedRequest } 
            : booking
        ));
        
        // Reload stats
        loadStats();
        toast.success("Từ chối yêu cầu hủy phòng thành công");
      }
    } catch (error) {
      console.error('Reject cancellation request error:', error);
      toast.error("Có lỗi xảy ra khi từ chối yêu cầu hủy phòng");
    }
  };

  const handleProcessRefund = async (requestId: string) => {
    try {
      const updatedRequest = await bookingService.processRefund(requestId);
      if (updatedRequest) {
        // Update the cancellation request in the state
        setCancellationRequests(prev => prev.map(request => 
          request._id === requestId ? updatedRequest : request
        ));
        
        // Also update the booking's cancellation request
        setBookings(prev => prev.map(booking => 
          booking.cancellationRequest && booking.cancellationRequest._id === requestId 
            ? { ...booking, cancellationRequest: updatedRequest } 
            : booking
        ));
        
        // Reload stats
        loadStats();
        toast.success("Hoàn tiền thành công");
      }
    } catch (error) {
      console.error('Process refund error:', error);
      toast.error("Có lỗi xảy ra khi xử lý hoàn tiền");
    }
  };

  if (isLoading || isCancellationRequestsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 admin-action-buttons">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Quản lý đặt phòng</h1>
          <p className="text-gray-600 text-sm md:text-base">
            {activeTab === 'bookings' && 'Theo dõi và quản lý tất cả đặt phòng'}
            {activeTab === 'cancellations' && 'Quản lý yêu cầu hủy phòng từ khách hàng'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            <Button className="" variant="default" size="default" onClick={() => handleExportBookings('csv')}>
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Xuất CSV</span>
              <span className="sm:hidden">CSV</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 admin-stats-grid">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalBookings}
            </div>
            <p className="text-sm text-gray-600">Tổng đặt phòng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.confirmedBookings}
            </div>
            <p className="text-sm text-gray-600">Đã xác nhận</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingBookings}
            </div>
            <p className="text-sm text-gray-600">Chờ xử lý</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {stats.cancelledBookings}
            </div>
            <p className="text-sm text-gray-600">Đã hủy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {stats.completedBookings}
            </div>
            <p className="text-sm text-gray-600">Đã hoàn thành</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {(stats.totalRevenue || 0).toLocaleString('vi-VN')}₫
            </div>
            <p className="text-sm text-gray-600">Tổng doanh thu</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingCancellations}
            </div>
            <p className="text-sm text-gray-600">Chờ hủy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.approvedCancellations}
            </div>
            <p className="text-sm text-gray-600">Đã duyệt hủy</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap space-x-1 bg-gray-100 p-1 rounded-lg w-full overflow-x-auto admin-tab-buttons">
        <button 
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'bookings' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={() => setActiveTab('bookings')}
        >
          Tất cả đặt phòng
        </button>
        <button 
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'cancellations' ? 'bg-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={() => setActiveTab('cancellations')}
        >
          Yêu cầu hủy phòng ({stats.pendingCancellations})
        </button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={activeTab === 'bookings' ? "Tìm kiếm theo mã booking, tên khách, số phòng..." : "Tìm kiếm theo mã yêu cầu, lý do..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {activeTab === 'bookings' ? (
                  <>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="completed">Đã hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="approved">Đã duyệt</SelectItem>
                    <SelectItem value="rejected">Bị từ chối</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thanh toán</SelectItem>
                {activeTab === 'bookings' ? (
                  <>
                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                    <SelectItem value="pending">Chờ thanh toán</SelectItem>
                    <SelectItem value="failed">Thất bại</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="not_requested">Chưa yêu cầu</SelectItem>
                    <SelectItem value="pending">Đang xử lý</SelectItem>
                    <SelectItem value="completed">Đã hoàn tiền</SelectItem>
                    <SelectItem value="failed">Hoàn tiền thất bại</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            {activeTab === 'bookings' && (
              <Select value={filterCancellation} onValueChange={setFilterCancellation}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Yêu cầu hủy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả yêu cầu</SelectItem>
                  <SelectItem value="has_request">Có yêu cầu hủy</SelectItem>
                  <SelectItem value="no_request">Không có yêu cầu</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Content based on active tab */}
      {activeTab === 'bookings' ? (
        /* Bookings List */
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <Card key={booking.id || booking._id || `booking-${Math.random()}`} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4 admin-booking-card-header">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">#{booking.bookingCode}</h3>
                        <p className="text-sm text-gray-600">Đặt ngày: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getStatusBadge(booking.status)}
                        {getPaymentStatusBadge(booking.paymentStatus)}
                        {getCancellationStatusBadge(booking.cancellationRequest)}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 admin-booking-card-actions">
                      <Button 
                        className="" 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsDetailDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="hidden md:inline">Xem chi tiết</span>
                      </Button>
                      
                      {/* Nút xác nhận và từ chối chỉ hiển thị cho booking pending */}
                      {booking.status === 'pending' && (
                        <>
                          <Button 
                            className=""
                            size="sm" 
                            variant="default"
                            onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            <span className="hidden md:inline">Xác nhận</span>
                          </Button>
                          <Button 
                            className=""
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                          >
                            <X className="h-4 w-4 mr-1" />
                            <span className="hidden md:inline">Từ chối</span>
                          </Button>
                        </>
                      )}
                      
                      {/* Nút cập nhật trạng thái cho các booking đã xác nhận */}
                      {booking.status === 'confirmed' && (
                        <Button 
                          className=""
                          size="sm" 
                          variant="default"
                          onClick={() => handleUpdateStatus(booking.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="hidden md:inline">Đánh dấu hoàn thành</span>
                        </Button>
                      )}
                      
                      {/* Nút hủy chỉ hiển thị cho booking chưa bị hủy */}
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <Button 
                          className=""
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          <span className="hidden md:inline">Hủy đặt phòng</span>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Khách hàng
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Tên:</span> {isPopulatedUser(booking.user) ? booking.user.username : 'N/A'}</p>
                        <p><span className="text-gray-600">Email:</span> {isPopulatedUser(booking.user) ? booking.user.email : 'N/A'}</p>
                        <p><span className="text-gray-600">SĐT:</span> {booking.phone || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        Phòng
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Tên:</span> {isRoom(booking.room) ? booking.room.name : 'N/A'}</p>
                        <p><span className="text-gray-600">Loại:</span> {isRoom(booking.room) ? booking.room.type : 'N/A'}</p>
                        <p><span className="text-gray-600">Số lượng:</span> {booking.roomCount}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Thời gian
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Nhận:</span> {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
                        <p><span className="text-gray-600">Trả:</span> {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
                        <p><span className="text-gray-600">Đêm:</span> {Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24))}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Thanh toán
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-lg text-primary">
                          {(booking.totalPrice || 0).toLocaleString('vi-VN')}₫
                        </p>
                        <p><span className="text-gray-600">Phương thức:</span> MoMo</p>
                        <p><span className="text-gray-600">Mã giao dịch:</span> {booking.momoTransactionId ? booking.momoTransactionId.substring(0, 8) + '...' : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Không tìm thấy đặt phòng nào phù hợp với bộ lọc.</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Cancellation Requests List */
        <div className="space-y-4">
          {filteredCancellationRequests.length > 0 ? (
            filteredCancellationRequests.map((request) => (
              <Card key={request._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4 admin-cancellation-card-header">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">#{request._id.substring(0, 8)}</h3>
                        <p className="text-sm text-gray-600">Yêu cầu ngày: {request.createdAt ? new Date(request.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {request.status === 'pending' && <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>}
                        {request.status === 'approved' && <Badge className="bg-green-100 text-green-800">Đã duyệt</Badge>}
                        {request.status === 'rejected' && <Badge className="bg-red-100 text-red-800">Bị từ chối</Badge>}
                        
                        {request.refundStatus === 'not_requested' && <Badge className="bg-gray-100 text-gray-800">Chưa yêu cầu</Badge>}
                        {request.refundStatus === 'pending' && <Badge className="bg-yellow-100 text-yellow-800">Đang xử lý</Badge>}
                        {request.refundStatus === 'completed' && <Badge className="bg-green-100 text-green-800">Đã hoàn tiền</Badge>}
                        {request.refundStatus === 'failed' && <Badge className="bg-red-100 text-red-800">Hoàn tiền thất bại</Badge>}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 admin-cancellation-card-actions">
                      <Button 
                        className="" 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedCancellationRequest(request);
                          setIsCancellationDetailDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="hidden md:inline">Xem chi tiết</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Thông tin yêu cầu
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Mã yêu cầu:</span> {request._id.substring(0, 8)}...</p>
                        <p><span className="text-gray-600">Số tiền hoàn:</span> <span className="font-medium">{(request.refundAmount || 0).toLocaleString('vi-VN')}₫</span></p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Lý do hủy
                      </h4>
                      <p className="text-sm text-gray-700 line-clamp-3">{request.reason}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Trạng thái
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">Yêu cầu:</span> 
                          {request.status === 'pending' && <span className="text-yellow-600 font-medium"> Chờ xử lý</span>}
                          {request.status === 'approved' && <span className="text-green-600 font-medium"> Đã duyệt</span>}
                          {request.status === 'rejected' && <span className="text-red-600 font-medium"> Bị từ chối</span>}
                        </p>
                        <p><span className="text-gray-600">Hoàn tiền:</span> 
                          {request.refundStatus === 'not_requested' && <span className="text-gray-600 font-medium"> Chưa yêu cầu</span>}
                          {request.refundStatus === 'pending' && <span className="text-yellow-600 font-medium"> Đang xử lý</span>}
                          {request.refundStatus === 'completed' && <span className="text-green-600 font-medium"> Đã hoàn tiền</span>}
                          {request.refundStatus === 'failed' && <span className="text-red-600 font-medium"> Thất bại</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Không tìm thấy yêu cầu hủy phòng nào phù hợp với bộ lọc.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Booking Detail Dialog */}
      <BookingDetailDialog 
        booking={selectedBooking} 
        open={isDetailDialogOpen} 
        onOpenChange={setIsDetailDialogOpen} 
      />

      {/* Cancellation Request Detail Dialog */}
      <CancellationRequestDetailDialog 
        request={selectedCancellationRequest} 
        open={isCancellationDetailDialogOpen} 
        onOpenChange={setIsCancellationDetailDialogOpen}
        onApprove={handleApproveCancellation}
        onReject={handleRejectCancellation}
        onProcessRefund={handleProcessRefund}
      />
    </div>
  );
}