import { Award, Users, Star, MapPin } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';

const stats = [
  {
    icon: Award,
    value: "15+",
    label: "Năm kinh nghiệm"
  },
  {
    icon: Users,
    value: "50K+",
    label: "Khách hàng hài lòng"
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Đánh giá trung bình"
  },
  {
    icon: MapPin,
    value: "Nha Trang",
    label: "Vị trí đắc địa"
  }
];

export function AboutSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="mb-6">
              <span className="text-primary uppercase tracking-wider">Về chúng tôi</span>
              <h2 className="text-3xl md:text-4xl mt-2 mb-4">
                Trải nghiệm nghỉ dưỡng đẳng cấp tại NgocHiepHotel
              </h2>
            </div>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Tọa lạc tại vị trí đắc địa bên bờ biển Nha Trang, NgocHiepHotel mang đến cho quý khách 
              một trải nghiệm nghỉ dưỡng sang trọng và đẳng cấp với hơn 15 năm kinh nghiệm trong ngành 
              khách sạn cao cấp.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-8">
              Với thiết kế hiện đại kết hợp nét đẹp truyền thống, cùng đội ngũ nhân viên chuyên nghiệp 
              và tận tâm, chúng tôi cam kết mang đến những khoảnh khắc nghỉ dưỡng tuyệt vời nhất cho 
              mỗi vị khách.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-bold text-2xl mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1744782996368-dc5b7e697f4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwMjU2NjUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="NgocHiepHotel Lobby"
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-lg -z-10"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
