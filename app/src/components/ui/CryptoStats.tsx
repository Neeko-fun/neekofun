import React from "react";

const CryptoStats = () => (
  <div className="flex items-center justify-center gap-8 bg-[#232136] rounded-xl py-4 px-6 shadow-lg mt-4 flex-wrap">
    <div className="flex flex-col items-center">
      <span className="text-3xl font-bold">21</span>
      <span className="text-xs text-gray-400">Crypto networks</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-3xl font-bold">48</span>
      <span className="text-xs text-gray-400">Crypto currencies</span>
    </div>
    <div className="flex items-center gap-4 ml-8">
      {/* Replace with icons if available */}
      <span className="bg-gray-700 px-3 py-1 rounded text-sm">Tether</span>
      <span className="bg-gray-700 px-3 py-1 rounded text-sm">Bitcoin</span>
      <span className="bg-gray-700 px-3 py-1 rounded text-sm">Ethereum</span>
      <span className="bg-gray-700 px-3 py-1 rounded text-sm">Tron</span>
      <span className="bg-gray-700 px-3 py-1 rounded text-sm">BNB</span>
      <a href="#" className="text-purple-400 underline ml-2 text-sm">See all</a>
    </div>
  </div>
);

export default CryptoStats; 