import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ToastNotification } from '../components/ToastNotification';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (title: string, message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (title: string, message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, title, message, type };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Tự động xóa toast sau 5 giây
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id}>
            <ToastNotification
              title={toast.title}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}