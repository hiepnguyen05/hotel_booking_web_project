import { RoomCard } from "./RoomCard";

const roomTypes = [
  {
    id: "1",
    name: "Deluxe Ocean View",
    description: "Phòng deluxe với view biển tuyệt đẹp, nội thất sang trọng và ban công riêng",
    size: "35m²",
    capacity: 2,
    price: 3500000,
    originalPrice: 4200000,
    image: "https://images.unsplash.com/photo-1520056107387-2cb5354436ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGRlbHV4ZSUyMHJvb20lMjBiYWxjb255fGVufDF8fHx8MTc1OTIwMTI5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["Wifi", "Ocean view", "Balcony", "Restaurant"],
    discount: 17,
    bedType: "Giường đôi King"
  },
  {
    id: "2",
    name: "Junior Suite",
    description: "Suite rộng rãi với khu vực tiếp khách riêng biệt và tầm nhìn toàn cảnh",
    size: "55m²",
    capacity: 3,
    price: 5200000,
    image: "https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzU5MjAwODY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["Wifi", "Ocean view", "Balcony"],
    discount: 0,
    bedType: "Giường đôi King + Sofa bed"
  },
  {
    id: "3",
    name: "Family Suite",
    description: "Suite gia đình với 2 phòng ngủ, phòng khách riêng và tiện nghi đầy đủ",
    size: "75m²",
    capacity: 4,
    price: 7800000,
    originalPrice: 9500000,
    image: "https://images.unsplash.com/photo-1614505241498-80a3ec936595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhib3V0aXF1ZSUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3NTkxODkwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["Wifi", "Ocean view", "Balcony", "Restaurant"],
    discount: 18,
    bedType: "2 Giường đôi Queen"
  },
  {
    id: "4",
    name: "Presidential Suite",
    description: "Suite tổng thống cao cấp nhất với dịch vụ butler và tiện ích độc quyền",
    size: "120m²",
    capacity: 4,
    price: 15000000,
    image: "https://images.unsplash.com/photo-1758448755969-8791367cf5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHN1aXRlJTIwYmVkcm9vbXxlbnwxfHx8fDE3NTkxMjIzNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["Wifi", "Ocean view", "Balcony", "Restaurant"],
    discount: 0,
    bedType: "Giường đôi King + Phòng khách riêng"
  }
];

interface RoomTypesProps {
  onViewRoom?: (roomId: string) => void;
}

export function RoomTypes({ onViewRoom }: RoomTypesProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">
            Phòng & Suites
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá các loại phòng sang trọng với tầm nhìn biển tuyệt đẹp và tiện nghi hiện đại
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roomTypes.map((room) => (
            <RoomCard key={room.id} room={room} onViewRoom={onViewRoom} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary/90 transition-colors">
            Xem tất cả phòng
          </button>
        </div>
      </div>
    </section>
  );
}