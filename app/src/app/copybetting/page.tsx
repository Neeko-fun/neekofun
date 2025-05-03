import React from "react";

const portfolios = [
  {
    user: "PixelPro123",
    avatar: "/img/avatar1.png",
    pnl: "+392,617.49",
    roi: "+218.54%",
    aum: "2,968,326.89",
    mdd: "30.85%",
    sharpe: "2.16",
    chart: "/img/chart1.png",
  },
  {
    user: "BlockyBettor",
    avatar: "/img/avatar2.png",
    pnl: "+313,099.11",
    roi: "-90.1%",
    aum: "664,052.28",
    mdd: "98.61%",
    sharpe: "1.82",
    chart: "/img/chart2.png",
  },
  {
    user: "GTRxFERRARI",
    avatar: "/img/avatar3.png",
    pnl: "+196,446.25",
    roi: "+1,964.46%",
    aum: "361,732.10",
    mdd: "0.09%",
    sharpe: "-",
    chart: "/img/chart3.png",
  },
  {
    user: "PixelAngel",
    avatar: "/img/avatar4.png",
    pnl: "+103,353.60",
    roi: "+19.13%",
    aum: "476,600.00",
    mdd: "-",
    sharpe: "-",
    chart: "/img/chart4.png",
  },
];

export default function CopyBetPage() {
  return (
    <div className="min-h-screen bg-[#181B23] text-white px-4 py-8">
      <h1 className="text-3xl font-minecraft mb-6">Copy Bet Portfolios</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <button className="pixel-border px-4 py-2 font-minecraft bg-[#23263A] text-white">30 Days</button>
        <button className="pixel-border px-4 py-2 font-minecraft bg-[#23263A] text-white">PNL</button>
        <button className="pixel-border px-4 py-2 font-minecraft bg-[#23263A] text-white">Smart Filter</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {portfolios.map((p, idx) => (
          <div key={idx} className="pixel-border bg-[#23263A] p-6 flex flex-col gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#9b87f5] pixel-border flex items-center justify-center overflow-hidden">
                {/* Replace with <Image> if you have next/image avatars */}
                <img src={p.avatar} alt={p.user} className="w-full h-full object-cover" />
              </div>
              <span className="font-minecraft text-lg">{p.user}</span>
            </div>
            <div className="flex flex-col gap-1 font-minecraft text-sm">
              <span>30 Days PNL: <span className="text-green-400">{p.pnl}</span></span>
              <span>ROI: <span className="text-yellow-300">{p.roi}</span></span>
              <span>AUM: <span className="text-pixel-gray-light">{p.aum}</span></span>
              <span>30 Days MDD: <span className="text-pixel-gray-medium">{p.mdd}</span></span>
              <span>Sharpe Ratio: <span className="text-pixel-gray-medium">{p.sharpe}</span></span>
            </div>
            <div className="bg-[#181B23] pixel-border h-16 flex items-center justify-center">
              {/* Chart placeholder */}
              <span className="text-xs text-gray-400">[Chart]</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="pixel-border bg-green-600 hover:bg-green-700 text-white font-minecraft px-4 py-2 transition">Copy</button>
              <button className="pixel-border bg-[#9b87f5] hover:bg-purple-700 text-white font-minecraft px-4 py-2 transition">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
