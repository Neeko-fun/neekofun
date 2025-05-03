"use client";
import React, { useState, useEffect, ReactNode } from "react";

interface CarouselProps {
  slides: ReactNode[];
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ slides, interval = 4000 }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [slides.length, interval]);

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="w-full flex overflow-hidden pixel-border">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`w-full transition-transform duration-700 ease-in-out shrink-0 ${idx === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            style={{ minWidth: "100%" }}
          >
            {slide}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`h-2 w-8  transition-all duration-300 ${idx === current ? "bg-purple-400" : "bg-gray-700"}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel; 