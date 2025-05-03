import Image from "next/image";
import React from "react";
import { CustomWalletButton } from "../WalletConnect";

const Header = () => (
  <header className="flex items-center justify-between py-4 px-6 sticky top-0 z-10">
    <div className="flex items-center gap-3">
      {/* <Image src="/img/neeko-logo.png" alt="logo" width={48} height={48} /> */}
      <Image src="/img/neekofun.svg" alt="neeko" width={150} height={32} />
    </div>
    <nav className="flex gap-6 text-lg font-minecraft">
      <a href="/" className="px-4 py-2 rounded-md hover:bg-purple-400/20 hover:text-purple-400 transition flex items-center justify-center gap-2 leading-none"> <Image src="/img/home.png" alt="home" width={24} height={24} /><span className="pt-1">Home</span></a>
      <a href="sport" className=" px-4 py-2 rounded-md hover:bg-purple-400/20 hover:text-purple-400 transition flex items-center justify-center gap-2 leading-none"> <Image src="/img/football.svg" alt="sports" width={24} height={24} /><span className="pt-1">Sports</span></a>
      <a href="copybetting" className=" px-4 py-2 rounded-md hover:bg-purple-400/20 hover:text-purple-400 transition flex items-center justify-center gap-2 leading-none"> <Image src="/img/football.svg" alt="sports" width={24} height={24} /><span className="pt-1">Copy Betting</span></a>
      <a href="fomoboard" className=" px-4 py-2 rounded-md hover:bg-purple-400/20 hover:text-purple-400 transition flex items-center justify-center gap-2 leading-none"> <Image src="/img/football.svg" alt="sports" width={24} height={24} /><span className="pt-1">FOMO Board</span></a>
      {/* <a href="#" className="hover:text-purple-400 transition">Casino</a>
      <a href="#" className="hover:text-purple-400 transition">More</a>
      <a href="#" className="hover:text-pink-400 transition">Promo</a> */}
    </nav>
    <CustomWalletButton />
  </header>
);

export default Header; 