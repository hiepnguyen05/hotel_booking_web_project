import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Bed, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  BarChart3,
  UserCog
} from "lucide-react";
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import { cn } from './ui/utils';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin/dashboard' },
  { key: 'rooms', label: 'Quản lý phòng', icon: Bed, path: '/admin/rooms' },
  { key: 'bookings', label: 'Đặt phòng', icon: Calendar, path: '/admin/bookings' },
  { key: 'customers', label: 'Khách hàng', icon: Users, path: '/admin/customers' },
  { key: 'users', label: 'Người dùng', icon: UserCog, path: '/admin/users' },
  { key: 'reports', label: 'Báo cáo', icon: BarChart3, path: '/admin/reports' },
  { key: 'settings', label: 'Cài đặt', icon: Settings, path: '/admin/settings' },
];

interface AdminLayoutProps {
  children?: any;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const getCurrentPage = () => {
    const path = location.pathname;
    const item = menuItems.find(item => item.path === path);
    return item?.key || 'dashboard';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "hidden md:block bg-white text-black transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-1/5",
          "z-50 h-full border-r border-gray-200"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!collapsed ? (
              <h2 className="text-xl font-bold truncate text-black">NgocHiepHotel</h2>
            ) : (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">NH</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="text-black hover:bg-gray-100"
            >
              {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden p-4 border-b border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-black hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.key}>
                  <Button
                    variant={getCurrentPage() === item.key ? "secondary" : "ghost"}
                    size="lg"
                    className={cn(
                      "w-full justify-start text-black hover:bg-gray-100",
                      getCurrentPage() === item.key && "bg-gray-100",
                      collapsed ? "px-2 justify-center" : "px-4"
                    )}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                  >
                    <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              size="lg"
              className={cn(
                "w-full justify-start text-black hover:bg-red-100",
                collapsed ? "px-2 justify-center" : "px-4"
              )}
              onClick={handleLogout}
            >
              <LogOut className={cn("h-5 w-5", !collapsed && "mr-3")} />
              {!collapsed && <span>Đăng xuất</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn("flex-1 flex flex-col transition-all duration-300 ease-in-out", collapsed ? "md:ml-20" : "md:ml-[20%]")}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center px-4 md:px-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="md:hidden mr-2"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-lg font-semibold capitalize">
                {menuItems.find(item => item.key === getCurrentPage())?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserCog className="h-4 w-4 text-gray-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{(user as any)?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-white">
          <div className="max-w-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}