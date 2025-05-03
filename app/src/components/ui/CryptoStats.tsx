import React from "react";
import PixelButton from "../PixelButton";

const CryptoStats = () => (
  <div className="flex items-center justify-center gap-8 py-4 px-6 mt-4 flex-wrap font-minecraft">
    <div className="flex flex-col items-center bg-[#6B50FD] border-4 border-black pixel-shadow-lg py-4 px-6">
      <span className="text-3xl font-bold">1,562</span>
      <span className="text-xs text-white/70">Total bets</span>
    </div>
    <div className="flex flex-col items-center bg-[#6B50FD] border-4 border-black pixel-shadow-lg py-4 px-6">
      <span className="text-3xl font-bold">591</span>
      <span className="text-xs text-white/70">Active Users</span>
    </div>
    <div className="flex flex-col items-center bg-[#6B50FD] border-4 border-black pixel-shadow-lg py-4 px-6">
      <span className="text-3xl font-bold">2,101</span>
      <span className="text-xs text-white/70">Total SOL Paid Out</span>
    </div>
  </div>
);

export default CryptoStats; 