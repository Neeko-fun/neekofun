
import React from 'react';
import { cn } from '@/lib/utils';

interface PixelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const PixelInput = React.forwardRef<HTMLInputElement, PixelInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <label className="block text-white font-pixel text-xs">{label}</label>}
        <input
          className={cn(
            "pixel-input w-full",
            error && "border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-red-500 text-xs font-pixel mt-1">{error}</p>}
      </div>
    );
  }
);

PixelInput.displayName = "PixelInput";

export default PixelInput;
