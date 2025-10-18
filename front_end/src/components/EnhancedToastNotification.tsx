import React from 'react';
import { X } from 'lucide-react';

interface EnhancedToastNotificationProps {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export function EnhancedToastNotification({ title, message, type, onClose }: EnhancedToastNotificationProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400';
      case 'error':
        return 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-400';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400';
      case 'info':
        return 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white border-sky-400';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white border-gray-400';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative z-50 w-80 p-4 rounded-xl shadow-xl backdrop-blur-sm border-l-4 ${getTypeStyles()} transition-all duration-300 transform translate-x-0 opacity-100`}>
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
          className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-black/10 transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-3">
        <div className="h-1 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white/50 rounded-full" style={{ width: '0%', animation: 'toastProgress 5s linear forwards' }}></div>
        </div>
      </div>
      <style>{`
        @keyframes toastProgress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
    </div>
  );
}