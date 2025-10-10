import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { bookingService } from '../../services/bookingService';
import { toast } from 'sonner';

interface CancellationRequestDialogProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancellationRequested: () => void;
}

export function CancellationRequestDialog({
  bookingId,
  open,
  onOpenChange,
  onCancellationRequested
}: CancellationRequestDialogProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do hủy phòng');
      return;
    }

    setIsLoading(true);
    try {
      await bookingService.createCancellationRequest(bookingId, reason.trim());
      toast.success('Yêu cầu hủy phòng đã được gửi thành công!');
      setReason('');
      onCancellationRequested();
      onOpenChange(false);
    } catch (error) {
      console.error('Cancellation request error:', error);
      toast.error('Có lỗi xảy ra khi gửi yêu cầu hủy phòng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yêu cầu hủy phòng</DialogTitle>
          <DialogDescription>
            Vui lòng nhập lý do hủy phòng. Yêu cầu của bạn sẽ được xử lý bởi bộ phận hỗ trợ.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Lý do hủy phòng</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do hủy phòng..."
              className="min-h-[120px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            className="" 
            variant="outline" 
            size="default"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button 
            className=""
            variant="default"
            size="default"
            onClick={handleSubmit} 
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}