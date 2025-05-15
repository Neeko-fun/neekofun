"use client";
import CryptoStats from "@/components/ui/CryptoStats";
import EventsSection from "@/components/ui/EventsSection";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import titleLoading from "@/lotties/title-loading.json";


const slides = [
  <Image src="/img/banner.png" alt="vip" width={1200} height={1000} />
];

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading, or replace with your real data loading logic
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#181B23] z-50">
        <Lottie animationData={titleLoading} loop={true} style={{ width: 300, height: 300 }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050817] text-white">
      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* <Carousel slides={slides} /> */}
        <div className="relative w-full">
          <Image
            src="/img/banner.png"
            alt="vip"
            width={1200}
            height={1000}
            className="w-full h-auto pixel-border-gray"
          />
          <div className="absolute left-0 bottom-0 z-10 p-4">
            <CryptoStats />
          </div>
        </div>
        <EventsSection />
      </main>
    </div>
  );
}
