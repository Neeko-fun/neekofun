import Header from "@/components/ui/Header";
import Carousel from "@/components/ui/Carousel";
import StartPlaying from "@/components/ui/StartPlaying";
import CryptoStats from "@/components/ui/CryptoStats";
import EventsSection from "@/components/ui/EventsSection";

const slides = [
  <div className="flex items-center bg-gradient-to-r from-[#1a1a2e] to-[#232136] rounded-2xl p-8 w-full min-h-[200px] gap-8" key="vip">
    <div className="flex-1 flex flex-col justify-center">
      <div className="text-4xl font-bold text-yellow-300 mb-2" style={{ fontFamily: 'var(--font-minecraft), var(--font-mulish), sans-serif' }}>
        VIP Cashback
      </div>
      <div className="text-lg text-white/80 mb-4">Get VIP status and personal features such as cashback and more!</div>
      <button className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-semibold px-6 py-2 rounded-full shadow hover:scale-105 transition w-max">Get an upgrade</button>
    </div>
    <div className="flex-1 flex justify-end items-center">
      {/* Replace with an image if available */}
      <div className="w-40 h-40 bg-gray-700 rounded-xl flex items-center justify-center text-2xl text-white/40">VIP Img</div>
    </div>
  </div>,
  <div className="flex items-center bg-gradient-to-r from-[#6a11cb] to-[#2575fc] rounded-2xl p-8 w-full min-h-[200px] gap-8" key="nba">
    <div className="flex-1 flex flex-col justify-center">
      <div className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-mulish), sans-serif' }}>
        NBA + eBasketball = <span className="text-pink-400">up to $1,000</span> Freebet weekly!
      </div>
    </div>
    <div className="flex-1 flex justify-end items-center">
      {/* Replace with an image if available */}
      <div className="w-40 h-40 bg-gray-700 rounded-xl flex items-center justify-center text-2xl text-white/40">NBA Img</div>
    </div>
  </div>
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050817] text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
        <Carousel slides={slides} />
        <StartPlaying />
        <CryptoStats />
        <EventsSection />
      </main>
    </div>
  );
}
