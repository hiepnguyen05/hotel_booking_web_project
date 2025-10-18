import React from 'react';
import { X } from 'lucide-react';

interface SimpleToastNotificationProps {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export function SimpleToastNotification({ title, message, type, onClose }: SimpleToastNotificationProps) {
  const getTypeStyles = () => {
    // All toasts will have white background and black text as requested
    return 'bg-white text-gray-900 border-gray-200';
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        // Black checkmark icon for success notifications
        return (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        );
      default:
        // Black exclamation mark icon for all other notifications
        return (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        );
    }
  };

  return (
    <div 
      className={`relative z-50 w-80 p-4 rounded-lg shadow-lg border-l-4 ${getTypeStyles()} transition-all duration-300 transform translate-x-0 opacity-100 animate-fade-in-right`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          {getTypeIcon()}
          <div className="flex-1">
            <h4 className="font-bold text-base">{title}</h4>
            <p className="text-sm opacity-90 mt-1">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="mt-3">
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gray-400 rounded-full" 
            style={{ width: '0%', animation: 'toastProgress 5s linear forwards' }}
          ></div>
        </div>
      </div>
      <style>{`
        @keyframes toastProgress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        
        @keyframes fadeInRight {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-right {
          animation: fadeInRight 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}