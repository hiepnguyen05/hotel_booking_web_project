import { Button } from "./ui/button";
import { Phone, Mail } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-24 bg-primary text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl mb-6">
          Sẵn sàng cho kỳ nghỉ tuyệt vời?
        </h2>
        <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
          Đặt phòng ngay hôm nay và tận hưởng những ưu đãi đặc biệt cùng trải nghiệm 
          nghỉ dưỡng đẳng cấp tại NgocHiepHotel
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button size="lg" variant="secondary" className="min-w-[200px]">
            Đặt phòng ngay
          </Button>
          <Button size="lg" variant="outline" className="min-w-[200px] border-white text-white hover:bg-white hover:text-primary">
            Xem các loại phòng
          </Button>
        </div>

        {/* Contact info */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-white/90 pt-8 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            <span>Hotline: 1900-xxxx</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-white/30"></div>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <span>Email: info@ngochiephotel.com</span>
          </div>
        </div>
      </div>
    </section>
  );
}
