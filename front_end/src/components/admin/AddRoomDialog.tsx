import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { X, Upload, Plus } from "lucide-react";
import { CreateRoomData, roomService } from "../../services/roomService";

interface AddRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ROOM_TYPES = [
  { value: 'single', label: 'Phòng đơn' },
  { value: 'double', label: 'Phòng đôi' },
  { value: 'suite', label: 'Suite' },
  { value: 'deluxe', label: 'Deluxe' }
];

const BED_TYPES = [
  { value: 'single', label: 'Giường đơn' },
  { value: 'double', label: 'Giường đôi' },
  { value: 'queen', label: 'Giường Queen' },
  { value: 'king', label: 'Giường King' }
];

const ROOM_STATUS = [
  { value: 'available', label: 'Có sẵn' },
  { value: 'maintenance', label: 'Bảo trì' }
];

const COMMON_AMENITIES = [
  'Wifi miễn phí', 'Điều hòa', 'TV màn hình phẳng', 'Tủ lạnh mini',
  'Két sắt', 'Phòng tắm riêng', 'Máy sấy tóc', 'Dép đi trong phòng',
  'Bàn làm việc', 'Ban công', 'Tầm nhìn ra biển', 'Bồn tắm',
  'Vòi sen', 'Đồ vệ sinh cá nhân', 'Khăn tắm', 'Nước uống miễn phí'
];

export function AddRoomDialog({ open, onOpenChange, onSuccess }: AddRoomDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([] as File[]);
  const [newAmenity, setNewAmenity] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'single',
    bedType: 'single',
    description: '',
    price: 0,
    capacity: 1,
    amenities: [] as string[],
    status: 'available'
  } as CreateRoomData);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      handleInputChange('amenities', [...formData.amenities, amenity]);
    }
  };

  const removeAmenity = (amenity: string) => {
    handleInputChange('amenities', formData.amenities.filter(a => a !== amenity));
  };

  const handleAddCustomAmenity = () => {
    if (newAmenity.trim()) {
      addAmenity(newAmenity.trim());
      setNewAmenity('');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Validation
      if (!formData.name || !formData.price || !formData.capacity) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      const roomData: CreateRoomData = {
        ...formData,
        images: selectedImages
      };

      const result = await roomService.createRoom(roomData);
      
      if (result) {
        // Reset form
        setFormData({
          name: '',
          type: 'single',
          bedType: 'single',
          description: '',
          price: 0,
          capacity: 1,
          amenities: [],
          status: 'available'
        } as CreateRoomData);
        setSelectedImages([]);
        
        onSuccess();
        onOpenChange(false);
      } else {
        alert('Có lỗi xảy ra khi tạo phòng. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Create room error:', error);
      alert('Có lỗi xảy ra khi tạo phòng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Thêm phòng mới</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên phòng *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="VD: Phòng Deluxe Ocean View"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Loại phòng *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedType">Loại giường *</Label>
                <Select value={formData.bedType} onValueChange={(value) => handleInputChange('bedType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BED_TYPES.map(bed => (
                      <SelectItem key={bed.value} value={bed.value}>
                        {bed.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Sức chứa *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 1)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Giá phòng (VNĐ/đêm) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                  placeholder="3500000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_STATUS.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả phòng</Label>
              <textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Mô tả chi tiết về phòng..."
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>

            {/* Images Upload */}
            <div className="space-y-2">
              <Label>Hình ảnh phòng</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="room-images"
                />
                <label
                  htmlFor="room-images"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Nhấp để chọn hình ảnh</p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG (tối đa 10 ảnh)</p>
                </label>
              </div>
              
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <Button
                        className=""
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <Label>Tiện nghi</Label>
              
              {/* Common amenities */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {COMMON_AMENITIES.map(amenity => (
                  <Button
                    key={amenity}
                    type="button"
                    className=""
                    variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (formData.amenities.includes(amenity)) {
                        removeAmenity(amenity);
                      } else {
                        addAmenity(amenity);
                      }
                    }}
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
              
              {/* Custom amenity input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Thêm tiện nghi khác..."
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomAmenity()}
                />
                <Button 
                  className=""
                  type="button" 
                  variant="default"
                  size="default"
                  onClick={handleAddCustomAmenity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Selected amenities */}
              {formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.amenities.map(amenity => (
                    <Badge key={amenity} variant="secondary" className="cursor-pointer">
                      {amenity}
                      <X
                        className="h-3 w-3 ml-1"
                        onClick={() => removeAmenity(amenity)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-white pt-4 border-t">
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
                disabled={isLoading}
              >
                {isLoading ? 'Đang tạo...' : 'Thêm phòng'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}