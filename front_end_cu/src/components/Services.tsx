import { Card, CardContent } from "./ui/card";
import { Waves, Utensils, Car, Dumbbell, Wifi, Wind } from "lucide-react";

const services = [
  {
    icon: Waves,
    title: "Spa & Hồ bơi",
    description: "Thư giãn tại spa đẳng cấp và hồ bơi vô cực với tầm nhìn ra biển"
  },
  {
    icon: Utensils,
    title: "Nhà hàng 5 sao",
    description: "Thưởng thức ẩm thực hải sản tươi ngon và các món Á - Âu đặc sắc"
  },
  {
    icon: Wind,
    title: "Beach Club",
    description: "Thư giãn tại bãi biển riêng với dịch vụ đẳng cấp và không gian yên tĩnh"
  },
  {
    icon: Dumbbell,
    title: "Phòng gym & Yoga",
    description: "Duy trì sức khỏe với phòng tập hiện đại và lớp yoga buổi sáng"
  }
];

export function Services() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">
            Tiện ích & Dịch vụ
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Trải nghiệm nghỉ dưỡng hoàn hảo với các tiện ích và dịch vụ đẳng cấp quốc tế
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}