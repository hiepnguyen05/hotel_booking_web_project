import { Card, CardContent } from "./ui/card";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const testimonials = [
  {
    name: "Nguyễn Minh Anh",
    location: "Hà Nội",
    rating: 5,
    comment: "Kỳ nghỉ tuyệt vời nhất của gia đình tôi! Phòng sạch sẽ, view biển đẹp, nhân viên thân thiện. Đặc biệt là bữa sáng buffet rất phong phú và ngon. Chắc chắn sẽ quay lại!",
    date: "Tháng 9, 2025"
  },
  {
    name: "Trần Hoàng Long",
    location: "TP. Hồ Chí Minh",
    rating: 5,
    comment: "Khách sạn 5 sao thực sự! Từ lúc check-in đến check-out đều được phục vụ chu đáo. Spa rất tuyệt, hồ bơi vô cực view biển tuyệt đẹp. Giá cả hợp lý so với chất lượng.",
    date: "Tháng 8, 2025"
  },
  {
    name: "Lê Thị Hương",
    location: "Đà Nẵng",
    rating: 5,
    comment: "Tổ chức honeymoon tại đây, mọi thứ đều hoàn hảo! Phòng được decor lãng mạn, có champagne và hoa tươi chào đón. Nhà hàng hải sản tuyệt vời. Cảm ơn NgocHiepHotel!",
    date: "Tháng 10, 2025"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-wider">Đánh giá</span>
          <h2 className="text-3xl md:text-4xl mt-2 mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hơn 50,000 khách hàng đã trải nghiệm và tin tưởng dịch vụ của chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                {/* Quote icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="h-16 w-16 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                  "{testimonial.comment}"
                </p>

                {/* Customer info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location} • {testimonial.date}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall rating */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-primary/5 px-8 py-4 rounded-full">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="border-l border-gray-300 pl-4">
              <span className="text-2xl font-bold">4.9/5</span>
              <span className="text-gray-600 ml-2">từ 2,500+ đánh giá</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
