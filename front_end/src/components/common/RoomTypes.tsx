import { RoomTypeCard } from "./RoomTypeCard";

const roomTypes = [
  {
    id: "1",
    name: "Deluxe Ocean View",
    description: "Tận hưởng trọn vẹn vẻ đẹp của đại dương từ ban công riêng tư của bạn. Phòng Deluxe Ocean View mang đến một không gian nghỉ dưỡng lý tưởng với nội thất tinh tế và tầm nhìn tuyệt đẹp ra biển cả bao la.",
    size: "35m²",
    capacity: 2,
    image: "https://images.unsplash.com/photo-1520056107387-2cb5354436ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGRlbHV4ZSUyMHJvb20lMjBiYWxjb255fGVufDF8fHx8MTc1OTIwMTI5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bedType: "Giường đôi King",
    features: [
      "Tầm nhìn trực diện ra biển",
      "Ban công riêng với nội thất cao cấp",
      "Nội thất gỗ tự nhiên sang trọng",
      "Hệ thống điều hòa thông minh",
      "Truyền hình cáp HD và Wi-Fi tốc độ cao"
    ]
  },
  {
    id: "2",
    name: "Junior Suite",
    description: "Không gian sống sang trọng và tiện nghi với khu vực tiếp khách riêng biệt. Junior Suite là sự kết hợp hoàn hảo giữa sự thoải mái và nét tinh tế, mang đến trải nghiệm lưu trú đẳng cấp với tầm nhìn toàn cảnh tuyệt đẹp.",
    size: "55m²",
    capacity: 3,
    image: "https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzU5MjAwODY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bedType: "Giường đôi King + Sofa bed",
    features: [
      "Khu vực tiếp khách riêng biệt",
      "Tầm nhìn toàn cảnh 360 độ",
      "Phòng tắm marble cao cấp với bồn tắm Jacuzzi",
      "Dịch vụ room service 24/7",
      "Mini bar cao cấp và máy pha cà phê"
    ]
  },
  {
    id: "3",
    name: "Family Suite",
    description: "Thiết kế dành riêng cho gia đình với không gian rộng rãi và ấm cúng. Family Suite bao gồm hai phòng ngủ riêng biệt, phòng khách tiện nghi và đầy đủ tiện nghi hiện đại, đảm bảo sự thoải mái cho cả gia đình bạn.",
    size: "75m²",
    capacity: 4,
    image: "https://images.unsplash.com/photo-1614505241498-80a3ec936595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhib3V0aXF1ZSUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3NTkxODkwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bedType: "2 Giường đôi Queen",
    features: [
      "Hai phòng ngủ riêng biệt",
      "Phòng khách và phòng ăn riêng",
      "Bếp mini đầy đủ tiện nghi",
      "Hai phòng tắm hiện đại",
      "Dịch vụ chăm sóc trẻ em theo yêu cầu"
    ]
  },
  {
    id: "4",
    name: "Presidential Suite",
    description: "Đẳng cấp và sang trọng được nâng tầm với Presidential Suite - không gian nghỉ dưỡng cao cấp nhất của chúng tôi. Trải nghiệm dịch vụ butler riêng tư và tận hưởng những tiện ích độc quyền chỉ dành cho quý khách đặc biệt.",
    size: "120m²",
    capacity: 4,
    image: "https://images.unsplash.com/photo-1758448755969-8791367cf5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHN1aXRlJTIwYmVkcm9vbXxlbnwxfHx8fDE3NTkxMjIzNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bedType: "Giường đôi King + Phòng khách riêng",
    features: [
      "Dịch vụ butler riêng tư 24/7",
      "Phòng khách và phòng ăn riêng biệt",
      "Phòng làm việc sang trọng",
      "Phòng xông hơi và spa riêng",
      "Xe đưa đón hạng sang và dịch vụ concierge"
    ]
  }
];

interface RoomTypesProps {
  onViewRoom?: (roomId: string) => void;
}

export function RoomTypes({ onViewRoom }: RoomTypesProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4">
            Phòng & Suites
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá các loại phòng sang trọng với tầm nhìn biển tuyệt đẹp và tiện nghi hiện đại
          </p>
        </div>
        
        <div className="space-y-20">
          {roomTypes.map((room, index) => (
            <RoomTypeCard 
              room={room} 
              index={index}
              onViewRoom={onViewRoom} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}