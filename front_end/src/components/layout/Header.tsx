import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Menu, User, LogOut, Settings, BookOpen } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user?: any;
  onNavigate?: (page: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
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
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Xin chào, {user.username}
                </span>

                {/* User Account Button */}
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => navigate('/user/account')}
                  className="hidden sm:flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Tài khoản
                </Button>

                {/* Mobile User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon" className="flex sm:hidden">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.username}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/user/account')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Tài khoản của tôi</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/user/bookings')}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Đặt phòng của tôi</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        await logout();
                        navigate('/');
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                variant="outline"
                size="default"
                onClick={() => navigate('/login')}
                className="hidden sm:flex"
              >
                <User className="h-4 w-4 mr-2" />
                Đăng nhập
              </Button>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="flex sm:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            <Button
              variant="default"
              size="default"
              onClick={() => navigate('/rooms')}
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