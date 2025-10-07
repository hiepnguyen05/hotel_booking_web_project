import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, MapPin, Users, Baby, Search } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroSectionProps {
  onSearchRooms?: (searchParams: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
  }) => void;
}

export function HeroSection({ onSearchRooms }: HeroSectionProps) {
  const [searchData, setSearchData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0
  });

  const handleSearch = () => {
    if (!searchData.checkIn || !searchData.checkOut) {
      alert('Vui lòng chọn ngày nhận phòng và trả phòng');
      return;
    }

    const checkInDate = new Date(searchData.checkIn);
    const checkOutDate = new Date(searchData.checkOut);
    
    if (checkInDate >= checkOutDate) {
      alert('Ngày trả phòng phải sau ngày nhận phòng');
      return;
    }

    if (checkInDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      alert('Ngày nhận phòng không thể là ngày trong quá khứ');
      return;
    }

    onSearchRooms?.(searchData);
  };
  return (
    <section className="relative h-[600px] bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Background image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758812598083-3793dd46195f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXNvcnQlMjBwb29sJTIwb2NlYW4lMjB2aWV3fGVufDF8fHx8MTc1OTE0MzA5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Ocean Pearl Resort"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-white text-4xl md:text-6xl mb-6">
          NgocHiepHotel
        </h1>
        <p className="text-white text-lg md:text-xl mb-8 opacity-90">
          Trải nghiệm nghỉ dưỡng sang trọng bên bờ biển tuyệt đẹp
        </p>

        {/* Booking form */}
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkin" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Ngày nhận phòng
              </Label>
              <Input 
                id="checkin"
                type="date" 
                value={searchData.checkIn}
                onChange={(e) => setSearchData(prev => ({ ...prev, checkIn: e.target.value }))}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="checkout" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Ngày trả phòng
              </Label>
              <Input 
                id="checkout"
                type="date" 
                value={searchData.checkOut}
                onChange={(e) => setSearchData(prev => ({ ...prev, checkOut: e.target.value }))}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adults" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Người lớn
              </Label>
              <Select 
                value={searchData.adults.toString()} 
                onValueChange={(value) => setSearchData(prev => ({ ...prev, adults: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn số người" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 người lớn</SelectItem>
                  <SelectItem value="2">2 người lớn</SelectItem>
                  <SelectItem value="3">3 người lớn</SelectItem>
                  <SelectItem value="4">4 người lớn</SelectItem>
                  <SelectItem value="5">5 người lớn</SelectItem>
                  <SelectItem value="6">6 người lớn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="children" className="flex items-center">
                <Baby className="h-4 w-4 mr-2" />
                Trẻ em
              </Label>
              <Select 
                value={searchData.children.toString()} 
                onValueChange={(value) => setSearchData(prev => ({ ...prev, children: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn số trẻ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 trẻ em</SelectItem>
                  <SelectItem value="1">1 trẻ em</SelectItem>
                  <SelectItem value="2">2 trẻ em</SelectItem>
                  <SelectItem value="3">3 trẻ em</SelectItem>
                  <SelectItem value="4">4 trẻ em</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleSearch}
            className="w-full md:w-auto mt-6 px-8 py-3"
          >
            <Search className="h-4 w-4 mr-2" />
            Kiểm tra phòng trống
          </Button>
        </div>
      </div>
    </section>
  );
}