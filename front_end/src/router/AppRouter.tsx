import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

// Layout Components
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../components/AdminLayout';
import { SimpleAdminLayout } from '../components/SimpleAdminLayout';

// Public Pages
import { HomePage } from '../pages/HomePage';
import { RoomsPage } from '../pages/RoomsPage';
import { RoomDetailPage } from '../pages/RoomDetailPage';
import { ContactPage } from '../components/user/ContactPage';
import { UserLogin } from '../components/user/UserLogin';

// Protected User Pages
import { BookingPage } from '../components/user/BookingPage';
import { BookingConfirmation } from '../components/user/BookingConfirmation';
import { UserAccount } from '../pages/user/UserAccount';
import { UserBookings } from '../pages/user/UserBookings';
import { BookingFlow } from '../pages/user/BookingFlow';
import { MoMoPaymentPage } from '../pages/user/MoMoPaymentPage';
import { BookingSuccess } from '../components/user/BookingSuccess';
import { PaymentResultPage } from '../pages/user/PaymentResultPage';
import { PaymentPage } from '../pages/user/PaymentPage';

// Admin Pages
import { AdminLogin } from '../pages/admin/AdminLogin';
import { Dashboard } from '../components/admin/Dashboard';
import { RoomManagement } from '../components/admin/RoomManagement';
import { EnhancedBookingManagement } from '../components/admin/EnhancedBookingManagement';
import { CustomerManagement } from '../pages/admin/CustomerManagement';
import { AdminSettings } from '../pages/admin/AdminSettings';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

export function AppRouter() {
  const { getCurrentUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser();
    }
  }, [getCurrentUser, isAuthenticated]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="rooms/:id" element={<RoomDetailPage />} />
          <Route path="contact" element={<ContactPage onBack={() => window.history.back()} />} />
          <Route path="login" element={<UserLogin onBack={() => window.history.back()} />} />
          <Route path="payment-result" element={<PaymentResultPage />} />
        </Route>

        {/* Protected User Routes */}
        <Route path="/user" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="booking/:roomId" element={<BookingFlow />} />
          <Route path="account" element={<UserAccount />} />
          <Route path="payment/momo" element={<MoMoPaymentPage />} />
          <Route path="payment/:id" element={<PaymentPage />} />
          <Route path="booking/success" element={
            <BookingSuccess 
              onBackToHome={() => window.location.href = '/'} 
              onViewAccount={() => window.location.href = '/user/account'} 
            />
          } />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><SimpleAdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="bookings" element={<EnhancedBookingManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}