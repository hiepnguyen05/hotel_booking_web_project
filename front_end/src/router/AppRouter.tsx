import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

// Layout Components
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../components/AdminLayout';

// Public Pages
import { HomePage } from '../pages/Home/HomePage';
import { RoomsPage } from '../pages/Rooms/RoomsPage';
import { RoomDetailPage } from '../pages/Rooms/RoomDetailPage';

// Protected User Pages
import { PaymentResultPage } from '../features/booking/pages/PaymentResultPage';

// Admin Pages
import { AdminLogin } from '../pages/Dashboard/AdminLogin';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { RoomManagement } from '../pages/Dashboard/RoomManagement';
import { BookingManagement } from '../pages/Dashboard/BookingManagement';
import { CustomerManagement } from '../pages/Dashboard/CustomerManagement';
import { UserManagement } from '../pages/Dashboard/UserManagement';
import { AdminSettings } from '../pages/Dashboard/AdminSettings';

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
          <Route path="payment-result" element={<PaymentResultPage />} />
        </Route>

        {/* Admin Routes - New Layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}