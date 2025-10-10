import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, SidebarProvider, SidebarInset } from "./ui/sidebar";
import { Home, Bed, Calendar, Users, Settings, LogOut } from "lucide-react";
import { useAuthStore } from '../store/authStore';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin/dashboard' },
  { key: 'rooms', label: 'Quản lý phòng', icon: Bed, path: '/admin/rooms' },
  { key: 'bookings', label: 'Đặt phòng', icon: Calendar, path: '/admin/bookings' },
  { key: 'customers', label: 'Khách hàng', icon: Users, path: '/admin/customers' },
  { key: 'settings', label: 'Cài đặt', icon: Settings, path: '/admin/settings' },
];

export function AdminLayout() {
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
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="w-1/5 bg-gray-50 border-r border-gray-200 min-w-[100px] max-w-[280px] admin-sidebar" collapsible="icon">
          <SidebarContent>
            <div className="p-2 flex justify-center">
              <h2 className="text-xs font-semibold text-sidebar-primary truncate bg-blue-100 px-2 py-1 rounded">
                NgocHiepHotel
              </h2>
            </div>
            
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton 
                        isActive={getCurrentPage() === item.key}
                        onClick={() => navigate(item.path)}
                        size="default"
                        className="flex flex-col items-center justify-center h-12 rounded-lg mx-1 hover:bg-gray-100"
                        tooltip={item.label}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-xs mt-1">{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <div className="mt-auto p-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} size="default" className="flex flex-col items-center justify-center h-12 rounded-lg mx-1 hover:bg-gray-100" tooltip="Đăng xuất">
                    <LogOut className="h-4 w-4" />
                    <span className="text-xs mt-1">Đăng xuất</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="w-4/5 flex-1 admin-main" collapsible="icon">
          <div className="flex h-full flex-col">
            <header className="flex h-16 items-center border-b bg-white px-6">
              <SidebarTrigger className="md:hidden" />
              <div className="ml-auto flex items-center space-x-4">
                <span className="text-sm text-gray-600">Admin</span>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="max-w-full">
                <Outlet />
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
