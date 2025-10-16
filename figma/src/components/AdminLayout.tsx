import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, SidebarProvider, SidebarInset } from "./ui/sidebar";
import { Home, Bed, Calendar, Users, Settings, LogOut, Menu } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'rooms', label: 'Quản lý phòng', icon: Bed },
  { key: 'bookings', label: 'Đặt phòng', icon: Calendar },
  { key: 'customers', label: 'Khách hàng', icon: Users },
  { key: 'settings', label: 'Cài đặt', icon: Settings },
];

export function AdminLayout({ children, currentPage, onNavigate }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-sidebar-primary">
                NgocHiepHotel Admin
              </h2>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton 
                        isActive={currentPage === item.key}
                        onClick={() => onNavigate(item.key)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <div className="mt-auto p-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => onNavigate('login')}>
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="flex-1">
          <div className="flex h-full flex-col">
            <header className="flex h-16 items-center border-b bg-white px-6">
              <SidebarTrigger className="md:hidden" />
              <div className="ml-auto flex items-center space-x-4">
                <span className="text-sm text-gray-600">Admin</span>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}