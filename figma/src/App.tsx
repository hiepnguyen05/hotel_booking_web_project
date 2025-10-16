import { useState } from 'react';
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { AboutSection } from "./components/AboutSection";
import { RoomTypes } from "./components/RoomTypes";
import { SpecialOffers } from "./components/SpecialOffers";
import { Gallery } from "./components/Gallery";
import { Services } from "./components/Services";
import { Testimonials } from "./components/Testimonials";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";
import { AdminLayout } from "./components/AdminLayout";
import { LoginPage } from "./components/admin/LoginPage";
import { Dashboard } from "./components/admin/Dashboard";
import { RoomManagement } from "./components/admin/RoomManagement";
import { BookingManagement } from "./components/admin/BookingManagement";
import { UserLogin } from "./components/user/UserLogin";
import { RoomDetail } from "./components/user/RoomDetail";
import { BookingPage } from "./components/user/BookingPage";
import { BookingConfirmation } from "./components/user/BookingConfirmation";
import { UserAccount } from "./components/user/UserAccount";
import { ContactPage } from "./components/user/ContactPage";

type ViewType = 'home' | 'rooms' | 'room-detail' | 'booking' | 'booking-confirmation' | 'contact' | 'account' | 'user-login' | 'admin-login' | 'admin';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentAdminPage, setCurrentAdminPage] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [currentBooking, setCurrentBooking] = useState<any>(null);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setCurrentView('admin');
    setCurrentAdminPage('dashboard');
  };

  const handleUserLogin = (userData: any) => {
    setUser(userData);
    setCurrentView('home');
  };

  const handleUserLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  const handleAdminNavigate = (page: string) => {
    if (page === 'login') {
      setIsAdminAuthenticated(false);
      setCurrentView('home');
      return;
    }
    setCurrentAdminPage(page);
  };

  const handleNavigate = (page: string, roomId?: string) => {
    if (page === 'room-detail' && roomId) {
      setSelectedRoomId(roomId);
    }
    if (page === 'login') {
      setCurrentView('user-login');
      return;
    }
    if (page === 'booking' && !user) {
      setCurrentView('user-login');
      return;
    }
    setCurrentView(page as ViewType);
  };

  const handleBookingComplete = (booking: any) => {
    setCurrentBooking(booking);
    setCurrentView('booking-confirmation');
  };

  const renderAdminContent = () => {
    switch (currentAdminPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'rooms':
        return <RoomManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'customers':
        return <div className="p-8 text-center text-gray-600">Trang khách hàng đang được phát triển...</div>;
      case 'settings':
        return <div className="p-8 text-center text-gray-600">Trang cài đặt đang được phát triển...</div>;
      default:
        return <Dashboard />;
    }
  };

  // Admin Login
  if (currentView === 'admin-login' || (currentView === 'admin' && !isAdminAuthenticated)) {
    return <LoginPage onLogin={handleAdminLogin} />;
  }

  // Admin Panel
  if (currentView === 'admin' && isAdminAuthenticated) {
    return (
      <AdminLayout currentPage={currentAdminPage} onNavigate={handleAdminNavigate}>
        {renderAdminContent()}
      </AdminLayout>
    );
  }

  // User Login
  if (currentView === 'user-login') {
    return (
      <UserLogin 
        onLogin={handleUserLogin} 
        onBack={() => setCurrentView('home')} 
      />
    );
  }

  // Room Detail
  if (currentView === 'room-detail') {
    return (
      <RoomDetail
        roomId={selectedRoomId}
        user={user}
        onBack={() => setCurrentView('home')}
        onBookNow={(roomId) => handleNavigate('booking', roomId)}
      />
    );
  }

  // Booking Page
  if (currentView === 'booking') {
    return (
      <BookingPage
        roomId={selectedRoomId}
        user={user}
        onBack={() => setCurrentView('room-detail')}
        onBookingComplete={handleBookingComplete}
      />
    );
  }

  // Booking Confirmation
  if (currentView === 'booking-confirmation') {
    return (
      <BookingConfirmation
        booking={currentBooking}
        onBackToHome={() => setCurrentView('home')}
        onViewAccount={() => setCurrentView('account')}
      />
    );
  }

  // User Account
  if (currentView === 'account') {
    return (
      <UserAccount
        user={user}
        onBack={() => setCurrentView('home')}
        onLogout={handleUserLogout}
      />
    );
  }

  // Contact Page
  if (currentView === 'contact') {
    return (
      <ContactPage onBack={() => setCurrentView('home')} />
    );
  }

  // Main Website
  const MainWebsite = () => (
    <div className="min-h-screen">
      <Header user={user} onNavigate={handleNavigate} />
      {currentView === 'home' && (
        <>
          <HeroSection />
          <AboutSection />
          <RoomTypes onViewRoom={(roomId) => handleNavigate('room-detail', roomId)} />
          <SpecialOffers />
          <Gallery />
          <Services />
          <Testimonials />
          <CTASection />
        </>
      )}
      {currentView === 'rooms' && (
        <div className="pt-20">
          <RoomTypes onViewRoom={(roomId) => handleNavigate('room-detail', roomId)} />
        </div>
      )}
      <Footer onNavigate={handleNavigate} />
      
      {/* Admin Access Button - Fixed position */}
      <button
        onClick={() => setCurrentView(isAdminAuthenticated ? 'admin' : 'admin-login')}
        className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg hover:bg-primary/90 transition-colors z-50"
      >
        Admin
      </button>
    </div>
  );

  return <MainWebsite />;
}