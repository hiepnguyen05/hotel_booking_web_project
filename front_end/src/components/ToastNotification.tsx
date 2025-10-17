import React from 'react';
import { Alert } from './ui/alert';
import { AlertTitle } from './ui/alert';
import { AlertDescription } from './ui/alert';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface ToastNotificationProps {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export function ToastNotification({ title, message, type, onClose }: ToastNotificationProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 w-80 p-4 rounded-lg border shadow-lg ${getTypeStyles()} transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-2">
          <span className="text-lg">{getTypeIcon()}</span>
          <div>
            <AlertTitle className="font-semibold">{title}</AlertTitle>
            <AlertDescription className="text-sm">{message}</AlertDescription>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}