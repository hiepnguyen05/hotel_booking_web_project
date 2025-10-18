import { HotelCard } from "./HotelCard";

const featuredHotels = [
  {
    id: "1",
    name: "Grand Luxury Hotel",
    location: "TP. Hồ Chí Minh",
    rating: 4.8,
    price: 2500000,
    originalPrice: 3000000,
    image: "https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzU5MjAwODY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["Wifi", "Parking", "Restaurant"],
    discount: 17
  },
  {
    id: "2",
    name: "Seaside Resort & Spa",
    location: "Nha Trang",
    rating: 4.9,
    price: 3200000,
    image: "https://images.unsplash.com/photo-1695173849152-c506198aaf90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjBzd2ltbWluZyUyMHBvb2wlMjB2YWNhdGlvbnxlbnwxfHx8fDE3NTkyMDA4Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["Wifi", "Restaurant"],
    discount: 0
  },
  {
    id: "3",
    name: "Urban Boutique Hotel",
    location: "Hà Nội",
    rating: 4.6,
    price: 1800000,
    originalPrice: 2200000,
    image: "https://images.unsplash.com/photo-1629946423992-c89d2a43e0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGV4dGVyaW9yJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzU5MTM1MjUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["Wifi", "Parking"],
    discount: 18
  },
  {
    id: "4",
    name: "Heritage Boutique Hotel",
    location: "Hội An",
    rating: 4.7,
    price: 2100000,
    image: "https://images.unsplash.com/photo-1614505241498-80a3ec936595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhib3V0aXF1ZSUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3NTkxODkwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["Wifi", "Restaurant"],
    discount: 0
  }
];

export function FeaturedHotels() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">
            Khách sạn nổi bật
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá những khách sạn được đánh giá cao nhất với dịch vụ tuyệt vời và vị trí đắc địa
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredHotels.map((hotel) => (
            <div key={hotel.id}>
              <HotelCard hotel={hotel} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary/90 transition-colors cursor-pointer">
            Xem thêm khách sạn
          </button>
        </div>
      </div>
    </section>
  );
}