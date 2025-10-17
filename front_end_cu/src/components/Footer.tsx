import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl mb-4">NgocHiepHotel</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Khách sạn 5 sao bên bờ biển, mang đến trải nghiệm nghỉ dưỡng sang trọng và đẳng cấp quốc tế.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg mb-4">Liên kết nhanh</h4>
            <div className="space-y-2">
              <button 
                onClick={() => onNavigate?.('home')}
                className="block text-gray-400 hover:text-white transition-colors text-sm text-left"
              >
                Về khách sạn
              </button>
              <button 
                onClick={() => onNavigate?.('rooms')}
                className="block text-gray-400 hover:text-white transition-colors text-sm text-left"
              >
                Phòng & Suites
              </button>
              <button 
                onClick={() => onNavigate?.('contact')}
                className="block text-gray-400 hover:text-white transition-colors text-sm text-left"
              >
                Liên hệ
              </button>
              <button 
                onClick={() => onNavigate?.('home')}
                className="block text-gray-400 hover:text-white transition-colors text-sm text-left"
              >
                Ưu đãi đặc biệt
              </button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg mb-4">Dịch vụ</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Spa & Wellness
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Nhà hàng
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Beach Club
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Sự kiện & Hội nghị
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg mb-4">Liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400 text-sm">
                <Phone className="h-4 w-4 mr-3" />
                <span>1900 1000</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Mail className="h-4 w-4 mr-3" />
                <span>info@ngochiepotel.vn</span>
              </div>
              <div className="flex items-start text-gray-400 text-sm">
                <MapPin className="h-4 w-4 mr-3 mt-0.5" />
                <span>88 Đường Biển Đông, Bãi Dài, Nha Trang</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 NgocHiepHotel. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}