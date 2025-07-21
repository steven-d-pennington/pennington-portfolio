'use client';

import { useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastProps = {
  message: string;
  type: ToastType;
  duration?: number;
  onClose?: () => void;
};

export function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300); // Allow fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 max-w-md w-full bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 transition-all duration-300 z-50";
    
    if (!isVisible) {
      return `${baseStyles} opacity-0 transform translate-x-full`;
    }

    switch (type) {
      case 'success':
        return `${baseStyles} border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20`;
      case 'error':
        return `${baseStyles} border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20`;
      case 'warning':
        return `${baseStyles} border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20`;
      case 'info':
        return `${baseStyles} border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20`;
      default:
        return baseStyles;
    }
  };

  const getIconAndColors = () => {
    switch (type) {
      case 'success':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          iconColor: 'text-green-600 dark:text-green-400',
          textColor: 'text-green-800 dark:text-green-200'
        };
      case 'error':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          iconColor: 'text-red-600 dark:text-red-400',
          textColor: 'text-red-800 dark:text-red-200'
        };
      case 'warning':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          iconColor: 'text-orange-600 dark:text-orange-400',
          textColor: 'text-orange-800 dark:text-orange-200'
        };
      case 'info':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          iconColor: 'text-blue-600 dark:text-blue-400',
          textColor: 'text-blue-800 dark:text-blue-200'
        };
    }
  };

  const { icon, iconColor, textColor } = getIconAndColors();

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${iconColor}`}>
          {icon}
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className={`text-sm font-medium ${textColor}`}>
            {message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className={`inline-flex ${textColor} hover:opacity-75 transition-opacity`}
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast container for managing multiple toasts
export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {children}
    </div>
  );
}