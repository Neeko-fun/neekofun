import Image from "next/image";
import React from "react";

const Header = () => (
  <header className="flex items-center justify-between py-4 px-6 sticky top-0">
    <div className="flex items-center gap-3">
      <Image src="/img/neeko-fun.svg" alt="neeko" width={150} height={32} />
    </div>
    <nav className="flex gap-6 text-lg font-minecraft">
      <a href="#" className="hover:text-purple-400 transition">Sports</a>
      {/* <a href="#" className="hover:text-purple-400 transition">Casino</a>
      <a href="#" className="hover:text-purple-400 transition">More</a>
      <a href="#" className="hover:text-pink-400 transition">Promo</a> */}
    </nav>
    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 transition">Connect Wallet</button>
  </header>
);

export default Header; 