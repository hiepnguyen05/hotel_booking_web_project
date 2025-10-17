import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import './CancelBookingForm.css';

interface CancelBookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => void;
  bookingId: string;
}

const commonCancellationReasons = [
  "Thay đổi kế hoạch du lịch",
  "Vấn đề tài chính",
  "Tìm được chỗ ở tốt hơn",
  "Lý do sức khỏe",
  "Sự cố công việc",
  "Thời tiết xấu",
  "Hủy do người khác",
  "Không muốn tiết lộ",
  "Lý do khác"
];

export function CancelBookingForm({ open, onOpenChange, onSubmit, bookingId }: CancelBookingFormProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    let reason = selectedReason;
    
    if (selectedReason === 'Lý do khác' && customReason.trim()) {
      reason = customReason.trim();
    }
    
    if (!reason) {
      setError('Vui lòng chọn hoặc nhập lý do hủy đặt phòng');
      return;
    }
    
    onSubmit(reason);
    // Reset form
    setSelectedReason('');
    setCustomReason('');
    setError('');
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form
    setSelectedReason('');
    setCustomReason('');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="cancel-booking-form">
        <DialogHeader className="form-header">
          <DialogTitle>Hủy đặt phòng</DialogTitle>
        </DialogHeader>
        
        <div className="form-content">
          <p className="reason-intro">
            Vui lòng chọn hoặc nhập lý do hủy đặt phòng bên dưới:
          </p>
          <div className="grid gap-2">
            <Label htmlFor="reason">Lý do hủy đặt phòng</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger className="select-trigger">
                <SelectValue placeholder="Chọn lý do" />
              </SelectTrigger>
              <SelectContent>
                {commonCancellationReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedReason === 'Lý do khác' && (
            <div className="grid gap-2">
              <Label htmlFor="customReason">Lý do cụ thể</Label>
              <Textarea
                id="customReason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Vui lòng nhập lý do cụ thể..."
                className="textarea"
              />
            </div>
          )}
          
          {error && (
            <div className="text-sm text-red-500 error-message">{error}</div>
          )}
        </div>
        
        <DialogFooter className="form-footer">
          <Button variant="outline" size="default" className="button" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="default" size="default" className="button" onClick={handleSubmit}>
            Gửi yêu cầu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}