import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Home, Bed, Calendar, Users, Settings, LogOut } from "lucide-react";
import { useAuthStore } from '../store/authStore';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin/dashboard' },
  { key: 'rooms', label: 'Quản lý phòng', icon: Bed, path: '/admin/rooms' },
  { key: 'bookings', label: 'Đặt phòng', icon: Calendar, path: '/admin/bookings' },
  { key: 'customers', label: 'Khách hàng', icon: Users, path: '/admin/customers' },
  { key: 'settings', label: 'Cài đặt', icon: Settings, path: '/admin/settings' },
];

export function SimpleAdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const getCurrentPage = () => {
    const path = location.pathname;
    const item = menuItems.find(item => item.path === path);
    return item?.key || 'dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-white shadow-lg min-w-[100px] max-w-[280px] admin-sidebar">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            NgocHiepHotel Admin
          </h2>
        </div>
        
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Button
              key={item.key}
              variant={getCurrentPage() === item.key ? "default" : "ghost"}
              size="default"
              className="w-full justify-start mb-1 mx-2"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </nav>
        
        <div className="absolute bottom-4 left-2 right-2">
          <Button
            variant="ghost"
            size="default"
            className="w-full justify-start text-red-600 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="w-4/5 flex flex-col admin-main">
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <span className="text-sm text-gray-600">Admin</span>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}





