import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from '../ui/alert';
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import { UserRegister } from './UserRegister';

interface UserLoginProps {
  onLogin?: (user: any) => void;
  onBack: () => void;
}

export function UserLogin({ onLogin, onBack }: UserLoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!loginData.email || !loginData.password) {
      return;
    }
    
    const success = await login(loginData);
    
    if (success) {
      if (onLogin) {
        onLogin(null); // Legacy support
      }
      navigate(from, { replace: true });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) {
      clearError();
    }
  };

  const handleSwitchToRegister = () => {
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  // Show register component
  if (showRegister) {
    return (
      <UserRegister 
        onBack={onBack}
        onSwitchToLogin={handleBackToLogin}
      />
    );
  }

  // Show login component
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Đăng nhập
              </CardTitle>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
          <CardDescription>
            Đăng nhập để đặt phòng và quản lý booking
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="example@email.com"
                  value={loginData.email}
                  onChange={handleChange}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !loginData.email || !loginData.password}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <button
                onClick={handleSwitchToRegister}
                className="text-blue-600 hover:text-blue-800 font-medium underline"
                disabled={isLoading}
              >
                Đăng ký ngay
              </button>
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Demo: Sử dụng email và mật khẩu bất kỳ để test
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}