import { useEffect, useState } from 'react';
import { useRoomStore } from '../../store/roomStore';
import { RoomCard } from '../../components/common/RoomCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function RoomsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { rooms, isLoading, error, fetchRooms } = useRoomStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [capacity, setCapacity] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get search parameters from location state when coming back from room detail
  useEffect(() => {
    if (location.state) {
      const state = location.state as { 
        searchTerm?: string;
        priceRange?: string;
        capacity?: string;
      };
      
      if (state.searchTerm !== undefined) setSearchTerm(state.searchTerm);
      if (state.priceRange !== undefined) setPriceRange(state.priceRange);
      if (state.capacity !== undefined) setCapacity(state.capacity);
      
      // Automatically apply filters when coming back with state
      if (state.searchTerm !== undefined || state.priceRange !== 'all' || state.capacity !== 'all') {
        // Delay slightly to ensure state is set
        setTimeout(() => {
          handleSearchWithParams(state);
        }, 100);
      }
    }
  }, [location.state]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleSearchWithParams = (params: { searchTerm?: string; priceRange?: string; capacity?: string }) => {
    const searchParams: any = {};
    
    if (params.searchTerm) searchParams.name = params.searchTerm;
    
    if (params.priceRange && params.priceRange !== 'all') {
      const priceFilter = getPriceRangeFilter(params.priceRange);
      Object.assign(searchParams, priceFilter);
    }
    
    if (params.capacity && params.capacity !== 'all') {
      searchParams.guests = parseInt(params.capacity);
    }
    
    fetchRooms(searchParams);
  };

  const handleSearch = () => {
    const params: any = {};
    
    if (searchTerm) params.name = searchTerm;
    
    if (priceRange !== 'all') {
      const priceFilter = getPriceRangeFilter(priceRange);
      Object.assign(params, priceFilter);
    }
    
    if (capacity !== 'all') {
      params.guests = parseInt(capacity);
    }
    
    fetchRooms(params);
  };

  const getPriceRangeFilter = (range: string) => {
    switch (range) {
      case 'under-1m':
        return { maxPrice: 1000000 };
      case '1m-2m':
        return { minPrice: 1000000, maxPrice: 2000000 };
      case '2m-5m':
        return { minPrice: 2000000, maxPrice: 5000000 };
      case 'over-5m':
        return { minPrice: 5000000 };
      default:
        return {};
    }
  };

  const handleViewRoom = (roomId: string) => {
    // Pass current search parameters to room detail page
    navigate(`/rooms/${roomId}`, {
      state: {
        searchTerm: searchTerm || undefined,
        priceRange: priceRange !== 'all' ? priceRange : undefined,
        capacity: capacity !== 'all' ? capacity : undefined
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange('all');
    setCapacity('all');
    fetchRooms();
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button variant="default" size="default" className="" onClick={() => fetchRooms()}>Thử lại</Button>

        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Danh sách phòng</h1>
        <p className="text-gray-600">Khám phá các loại phòng đẳng cấp của chúng tôi</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Tìm kiếm & Lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <Input
                placeholder="Tìm kiếm theo tên phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="default" size="default" onClick={handleSearch} className="px-6">
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium mb-2">Khoảng giá</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khoảng giá" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="under-1m">Dưới 1 triệu</SelectItem>
                      <SelectItem value="1m-2m">1 - 2 triệu</SelectItem>
                      <SelectItem value="2m-5m">2 - 5 triệu</SelectItem>
                      <SelectItem value="over-5m">Trên 5 triệu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Số khách</label>
                  <Select value={capacity} onValueChange={setCapacity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn số khách" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="1">1 khách</SelectItem>
                      <SelectItem value="2">2 khách</SelectItem>
                      <SelectItem value="3">3 khách</SelectItem>
                      <SelectItem value="4">4+ khách</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" size="default" className="" onClick={clearFilters}>Xóa bộ lọc</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách phòng...</p>
        </div>
      )}

      {/* Rooms Grid */}
      {!isLoading && (
        <>
          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room._id}>
                  <RoomCard
                    room={{
                      id: room._id,
                      name: room.name,
                      description: room.description,
                      price: room.price,
                      image: room.images[0] || '/placeholder-room.jpg',
                      capacity: room.capacity,
                      size: '30m²', // Mock data - you might want to add this to your backend
                      amenities: room.amenities || [],
                      bedType: room.type || 'Không xác định'
                    }}
                    onViewRoom={handleViewRoom}
                  />
                </div>
              ))}

            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Không tìm thấy phòng nào</h3>
              <p className="text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              <Button variant="default" size="default" className="" onClick={clearFilters}>Xóa bộ lọc</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}