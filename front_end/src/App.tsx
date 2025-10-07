import { useEffect } from 'react';
import { AppRouter } from './router/AppRouter';
import { useAuthStore } from './store/authStore';
import { validateEnv } from './config/env';

export default function App() {
  const { getCurrentUser } = useAuthStore();

  useEffect(() => {
    // Validate environment variables
    validateEnv();
    
    // Initialize authentication on app start
    getCurrentUser();
  }, [getCurrentUser]);

  return <AppRouter />;
}