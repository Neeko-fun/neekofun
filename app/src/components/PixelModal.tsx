"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface PixelModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const PixelModal: React.FC<PixelModalProps> = ({ open, onClose, children, className }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className={cn("pixel-border bg-[#23263A] p-6 w-full max-w-md relative ", className)}>
        <button
          className="absolute top-0 -right-[23.5rem] text-white bg-black/80 font-minecraft text-lg px-2 py-0 pixel-border hover:bg-red-600 flex items-center justify-center"
          onClick={onClose}
        >
          x
        </button>
        {children}
      </div>
    </div>
  );
};

export default PixelModal;