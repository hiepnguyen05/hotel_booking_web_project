import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export function MainLayout() {
  const navigate = useNavigate();

  const handleNavigate = (page: string, roomId?: string) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'rooms':
        navigate('/rooms');
        break;
      case 'room-detail':
        if (roomId) {
          navigate(`/rooms/${roomId}`);
        }
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'account':
        navigate('/user/account');
        break;
      case 'booking':
        if (roomId) {
          navigate(`/user/booking/${roomId}`);
        }
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={handleNavigate} />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}