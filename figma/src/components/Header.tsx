import { Button } from "./ui/button";
import { Menu, User, Heart, Bell } from "lucide-react";

interface HeaderProps {
  user?: any;
  onNavigate?: (page: string) => void;
}

export function Header({ user, onNavigate }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 
              className="text-primary font-bold text-2xl cursor-pointer" 
              onClick={() => onNavigate?.('home')}
            >
              NgocHiepHotel
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate?.('home')}
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Trang chủ
            </button>
            <button 
              onClick={() => onNavigate?.('rooms')}
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Phòng & Suites
            </button>
            <button 
              onClick={() => onNavigate?.('contact')}
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Liên hệ
            </button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Xin chào, {user.name}
                </span>
                <Button 
                  variant="outline"
                  onClick={() => onNavigate?.('account')}
                  className="hidden sm:flex"
                >
                  <User className="h-4 w-4 mr-2" />
                  Tài khoản
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => onNavigate?.('login')}
                className="hidden sm:flex"
              >
                <User className="h-4 w-4 mr-2" />
                Đăng nhập
              </Button>
            )}
            <Button variant="ghost" size="icon" className="flex sm:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Button 
              onClick={() => onNavigate?.('rooms')}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Đặt phòng
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}