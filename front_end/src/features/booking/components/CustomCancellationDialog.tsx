import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { bookingService } from '../../../services/bookingService';
import { toast } from 'sonner';

interface CustomCancellationDialogProps {
    bookingId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCancellationRequested: () => void;
}

const CANCELLATION_REASONS = [
    "Thay đổi kế hoạch du lịch",
    "Vấn đề về tài chính",
    "Tìm thấy chỗ ở tốt hơn",
    "Lý do sức khỏe",
    "Sự kiện bất khả kháng",
    "Không còn nhu cầu",
    "Lý do công việc",
    "Khác (vui lòng ghi rõ)"
];

export function CustomCancellationDialog({
    bookingId,
    open,
    onOpenChange,
    onCancellationRequested
}: CustomCancellationDialogProps) {
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showCustomReason, setShowCustomReason] = useState(false);

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            setSelectedReason('');
            setCustomReason('');
            setShowCustomReason(false);
        }
    }, [open]);

    const handleReasonChange = (value: string) => {
        setSelectedReason(value);
        if (value === "Khác (vui lòng ghi rõ)") {
            setShowCustomReason(true);
        } else {
            setShowCustomReason(false);
            setCustomReason('');
        }
    };

    const handleSubmit = async () => {
        // Validate reason selection
        if (!selectedReason) {
            toast.error('Vui lòng chọn lý do hủy phòng');
            return;
        }

        // Validate custom reason if "Khác" is selected
        const finalReason = showCustomReason
            ? customReason.trim()
            : selectedReason;

        if (showCustomReason && !finalReason) {
            toast.error('Vui lòng nhập lý do hủy phòng');
            return;
        }

        if (showCustomReason && finalReason.length < 10) {
            toast.error('Lý do hủy phòng phải có ít nhất 10 ký tự');
            return;
        }

        setIsLoading(true);
        try {
            await bookingService.createCancellationRequest(bookingId, finalReason);
            toast.success('Yêu cầu hủy phòng đã được gửi thành công!');
            setSelectedReason('');
            setCustomReason('');
            setShowCustomReason(false);
            onCancellationRequested();
            onOpenChange(false);
        } catch (error) {
            console.error('Cancellation request error:', error);
            toast.error('Có lỗi xảy ra khi gửi yêu cầu hủy phòng');
        } finally {
            setIsLoading(false);
        }
    };

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 50,
                padding: '1rem'
            }}
        >
            {/* Overlay background */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 40
                }}
                onClick={() => onOpenChange(false)}
            />

            {/* Dialog content */}
            <div
                className="relative bg-white rounded-md shadow-lg w-[450px] max-w-[calc(100%-2rem)] z-10 animate-in fade-in zoom-in duration-200"
                style={{
                    animation: 'fadeIn 0.2s ease-out',
                    position: 'relative',
                    backgroundColor: 'white',
                    borderRadius: '0.375rem',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05)',
                    width: '450px',
                    maxWidth: 'calc(100% - 2rem)',
                    zIndex: 50
                }}
            >
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Yêu cầu hủy phòng</h3>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="text-gray-400 hover:text-gray-600 text-xl"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.25rem',
                                padding: '0.25rem'
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Chọn lý do hủy phòng. Yêu cầu sẽ được xử lý bởi bộ phận hỗ trợ.
                    </p>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <Label htmlFor="reason" className="text-base mb-2 block">Lý do hủy phòng</Label>
                        <Select value={selectedReason} onValueChange={handleReasonChange}>
                            <SelectTrigger className="h-10 text-base">
                                <SelectValue placeholder="Chọn lý do" />
                            </SelectTrigger>
                            <SelectContent>
                                {CANCELLATION_REASONS.map((reason, index) => (
                                    <SelectItem key={index} value={reason} className="text-base">
                                        {reason}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {showCustomReason && (
                        <div className="mb-4">
                            <Label htmlFor="customReason" className="text-base mb-2 block">Lý do chi tiết</Label>
                            <Textarea
                                id="customReason"
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Nhập chi tiết lý do hủy..."
                                className="min-h-[80px] text-base p-3"
                            />
                            <p className="text-sm text-gray-500 mt-2">Tối thiểu 10 ký tự</p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    <Button
                        className="h-9 text-base px-4"
                        variant="outline"
                        size="default"
                        onClick={() => onOpenChange(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        className="h-9 text-base px-4"
                        variant="default"
                        size="default"
                        onClick={handleSubmit}
                        disabled={isLoading || !selectedReason || (showCustomReason && (!customReason.trim() || customReason.trim().length < 10))}
                    >
                        {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </Button>
                </div>
            </div>
        </div>
    );
}