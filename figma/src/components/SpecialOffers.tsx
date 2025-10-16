import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Percent, Gift, Sparkles } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';

const offers = [
  {
    icon: Percent,
    badge: "Giảm 30%",
    badgeColor: "bg-red-500",
    title: "Ưu đãi đặt sớm",
    description: "Đặt phòng trước 30 ngày và nhận ngay ưu đãi giảm giá 30% cho kỳ nghỉ của bạn",
    validUntil: "Đến 31/12/2025",
    image: "https://images.unsplash.com/photo-1520056107387-2cb5354436ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGRlbHV4ZSUyMHJvb20lMjBiYWxjb255fGVufDF8fHx8MTc1OTIwMTI5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    icon: Gift,
    badge: "Tặng kèm",
    badgeColor: "bg-green-500",
    title: "Gói Honeymoon",
    description: "Tặng champagne, hoa tươi và 1 buổi spa cho cặp đôi. Bữa sáng phục vụ tại phòng miễn phí",
    validUntil: "Áp dụng quanh năm",
    image: "https://images.unsplash.com/photo-1758448755969-8791367cf5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHN1aXRlJTIwYmVkcm9vbXxlbnwxfHx8fDE3NTkxMjIzNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    icon: Sparkles,
    badge: "Miễn phí",
    badgeColor: "bg-blue-500",
    title: "Ở 3 đêm tặng 1 đêm",
    description: "Đặt 3 đêm liên tiếp và nhận miễn phí 1 đêm. Bao gồm buffet sáng và dịch vụ spa",
    validUntil: "Đến 30/11/2025",
    image: "https://images.unsplash.com/photo-1614505241498-80a3ec936595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhib3V0aXF1ZSUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3NTkxODkwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

export function SpecialOffers() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-wider">Ưu đãi đặc biệt</span>
          <h2 className="text-3xl md:text-4xl mt-2 mb-4">
            Chương trình khuyến mãi hot
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tận dụng các ưu đãi hấp dẫn để có kỳ nghỉ tuyệt vời với mức giá tốt nhất
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer, index) => {
            const Icon = offer.icon;
            return (
              <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  <ImageWithFallback
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <Badge className={`absolute top-4 left-4 ${offer.badgeColor} hover:${offer.badgeColor} text-white`}>
                    {offer.badge}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl mb-3">{offer.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {offer.description}
                  </p>

                  {/* Valid date */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{offer.validUntil}</span>
                  </div>

                  {/* CTA */}
                  <Button className="w-full" variant="outline">
                    Đặt ngay
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
