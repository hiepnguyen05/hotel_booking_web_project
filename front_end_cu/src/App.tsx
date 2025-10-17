import { useEffect } from 'react';
import { AppRouter } from './router/AppRouter';
import { useAuthStore } from './store/authStore';
import AccessLogViewer from './components/AccessLogViewer';

export default function App() {
  const { getCurrentUser } = useAuthStore();

  useEffect(() => {
    // Initialize authentication on app start
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <>
      <AppRouter />
      <AccessLogViewer />
    </>
  );
}