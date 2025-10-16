import { RoomTypeIntro } from "./RoomTypeIntro";

const roomTypes = [
  {
    id: "1",
    name: "Deluxe Ocean View",
    description: "Phòng deluxe với view biển tuyệt đẹp, nội thất sang trọng và ban công riêng",
    fullDescription: "Tận hưởng trọn vẹn vẻ đẹp của đại dương từ ban công riêng tư của bạn. Phòng Deluxe Ocean View mang đến một không gian nghỉ dưỡng lý tưởng với nội thất tinh tế và tầm nhìn tuyệt đẹp ra biển cả bao la. Mỗi buổi sáng thức dậy với ánh bình minh rực rỡ và tiếng sóng biển nhẹ nhàng, tạo nên một trải nghiệm nghỉ dưỡng không thể quên.",
    size: "35m²",
    capacity: 2,
    image: "https://images.unsplash.com/photo-1520056107387-2cb5354436ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGRlbHV4ZSUyMHJvb20lMjBiYWxjb255fGVufDF8fHx8MTc1OTIwMTI5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bedType: "Giường King",
    features: [
      "Ban công riêng với tầm nhìn ra biển tuyệt đẹp",
      "Nội thất sang trọng với thiết kế hiện đại",
      "Phòng tắm đầy đủ tiện nghi với bồn tắm và vòi sen riêng biệt",
      "Mini bar và két an toàn cá nhân",
      "TV màn hình phẳng với truyền hình cáp quốc tế"
    ]
  },
  {
    id: "2",
    name: "Junior Suite",
    description: "Suite rộng rãi với khu vực tiếp khách riêng biệt và tầm nhìn toàn cảnh",
    fullDescription: "Không gian rộng rãi và sang trọng của Junior Suite mang đến sự thoải mái tuyệt đối cho kỳ nghỉ của bạn. Với khu vực phòng ngủ và phòng khách được phân chia hợp lý, suite này là lựa chọn hoàn hảo cho những ai tìm kiếm sự riêng tư và tiện nghi. Thiết kế nội thất cao cấp kết hợp với tầm nhìn toàn cảnh tạo nên một trải nghiệm nghỉ dưỡng đẳng cấp.",
    size: "55m²",
    capacity: 3,
    image: "https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzU5MjAwODY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bedType: "Giường King + Sofa bed",
    features: [
      "Phòng khách riêng biệt với sofa bed thoải mái",
      "Khu vực làm việc rộng rãi với bàn làm việc executive",
      "Phòng tắm cao cấp với áo choàng t목욕 và dép đi trong phòng",
      "Hệ thống giải trí hiện đại với âm thanh vòm",
      "Dịch vụ phòng 24/7 và wifi tốc độ cao"
    ]
  },
  {
    id: "3",
    name: "Family Suite",
    description: "Suite gia đình với 2 phòng ngủ, phòng khách riêng và tiện nghi đầy đủ",
    fullDescription: "Được thiết kế đặc biệt cho gia đình, Family Suite mang đến không gian sống lý tưởng với 2 phòng ngủ riêng biệt và phòng khách rộng rãi. Mỗi phòng ngủ đều có thiết kế tinh tế, đảm bảo sự riêng tư và thoải mái cho từng thành viên. Đây là lựa chọn hoàn hảo cho kỳ nghỉ gia đình với đầy đủ tiện nghi hiện đại và không gian sinh hoạt chung ấm cúng.",
    size: "75m²",
    capacity: 4,
    image: "https://images.unsplash.com/photo-1614505241498-80a3ec936595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhib3V0aXF1ZSUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3NTkxODkwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bedType: "2 Giường Queen",
    features: [
      "2 phòng ngủ riêng biệt với cửa ngăn cách",
      "Phòng khách rộng rãi với TV màn hình lớn và hệ thống giải trí",
      "2 phòng tắm đầy đủ tiện nghi",
      "Bếp nhỏ với tủ lạnh, máy pha cà phê và ấm đun nước",
      "Ban công lớn với bàn ghế ngoài trời, view biển tuyệt đẹp"
    ]
  },
  {
    id: "4",
    name: "Presidential Suite",
    description: "Suite tổng thống cao cấp nhất với dịch vụ butler và tiện ích độc quyền",
    fullDescription: "Đỉnh cao của sự xa hoa và đẳng cấp, Presidential Suite là lựa chọn dành cho những vị khách đặc biệt nhất. Với diện tích rộng lớn, nội thất cao cấp nhất và dịch vụ butler riêng 24/7, suite này mang đến trải nghiệm nghỉ dưỡng hoàn hảo tuyệt đối. Mỗi chi tiết được chăm chút tỉ mỉ để tạo nên một không gian sống đẳng cấp quốc tế, xứng tầm những kỳ nghỉ sang trọng nhất.",
    size: "120m²",
    capacity: 4,
    image: "https://images.unsplash.com/photo-1758448755969-8791367cf5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHN1aXRlJTIwYmVkcm9vbXxlbnwxfHx8fDE3NTkxMjIzNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bedType: "Giường King + Phòng khách",
    features: [
      "Dịch vụ butler riêng 24/7 chăm sóc mọi nhu cầu",
      "Phòng khách rộng lớn với khu vực tiếp khách VIP",
      "Phòng ăn riêng có thể phục vụ 8-10 người",
      "Spa mini trong phòng với bồn jacuzzi và sauna",
      "Ban công panorama với tầm nhìn 180 độ ra biển và thành phố",
      "Hệ thống âm thanh Bose và Smart Home tích hợp"
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
          {roomTypes.map((roomType, index) => (
            <RoomTypeIntro 
              key={roomType.id} 
              roomType={roomType} 
              onViewRooms={onViewRoom}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}