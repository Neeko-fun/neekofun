
import React from 'react';
import { cn } from '@/lib/utils';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'warning' | 'success' | 'small';
  isLoading?: boolean;
  children: React.ReactNode;
}

const PixelButton = ({ 
  variant = 'default', 
  isLoading = false,
  className, 
  disabled, 
  children, 
  ...props 
}: PixelButtonProps) => {
  const baseClasses = "font-minecraft transition-transform duration-100 active:translate-y-1 active:shadow-none font-pixel border-2 border-black relative bg-gray-400 px-4 py-2 pixel-shadow";
  
  const variantClasses = {
    default: "pixel-button",
    warning: "pixel-button-warning",
    success: "bg-green-500 hover:bg-green-600 text-white py-2 px-4 shadow-pixel",
    small: "pixel-button-small",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        (disabled || isLoading) && "opacity-50 cursor-not-allowed active:translate-y-0 hover:bg-pixel-purple",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default PixelButton;