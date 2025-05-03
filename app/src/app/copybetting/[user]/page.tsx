"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import PixelModal from "@/components/PixelModal";
import PixelInput from "@/components/PixelInput";
import PixelButton from "@/components/PixelButton";
// Types
type MarketOption = { label: string; odds: number };
type Market = { name: string; options: MarketOption[] };
type Match = {
  league: string;
  teams: string[];
  score: string;
  status: string;
  markets: Market[];
};

type UserPool = {
  name: string;
  banner: string;
  matches: Match[];
  winRate: number;
  totalBets: number;
  copiers: number;
  sol7d: number;
};

// Mock data for demonstration
const userPools: Record<string, UserPool> = {
  PixelKing: {
    name: "PixelKing",
    banner: "/img/profile-banner.png",
    matches: [
      {
        league: "Australia. A-League",
        teams: ["Melbourne City", "Sydney FC"],
        score: "3 - 0",
        status: "Half 1 | 43' LIVE",
        markets: [
          {
            name: "Match Winner",
            options: [
              { label: "Draw", odds: 16.82 },
              { label: "Sydney FC", odds: 40.0 },
            ],
          },
          {
            name: "Handicap. 1-st half",
            options: [
              { label: "Melbourne City -3.5", odds: 7.7 },
              { label: "Sydney FC +3.5", odds: 1.05 },
              { label: "Melbourne City -3", odds: 1.59 },
              { label: "Sydney FC +3", odds: 2.23 },
              { label: "Melbourne City -2.5", odds: 1.03 },
              { label: "Sydney FC +2.5", odds: 9.23 },
            ],
          },
        ],
      },
    ],
    winRate: 78.2,
    totalBets: 1234,
    copiers: 321,
    sol7d: 56.78,
  },
  // Add more users as needed
};

export default function UserBettingPoolPage() {
  const params = useParams();
  const user = params?.user as string;
  const pool = userPools[user] || userPools["PixelKing"]; // fallback for demo
  const [modalOpen, setModalOpen] = useState(false);
  const [stake, setStake] = useState("1.00");
  const [mirror, setMirror] = useState(100);
  const [riskCap, setRiskCap] = useState("");
  const [agree, setAgree] = useState(false);

  return (
    <div className="min-h-screen bg-[#181B23] text-white flex flex-col items-center py-8">
      <div className="pixel-border bg-[#23263A] p-8 w-full max-w-3xl shadow-lg flex flex-col gap-5">
        <div className="relative w-full h-48 pixel-border-white">
          <div className="bg-gradient-to-t from-black/60 to-transparent z-[2] absolute inset-0 w-full h-full" />
          <Image
            src={pool.banner}
            alt={pool.name}
            fill
            className="object-cover z-[1]"
          />
          <h1 className="font-superpixel text-3xl absolute bottom-0 left-0 p-4 z-10">
            {user}
            {/* {pool.name} */}
          </h1>
        </div>
        {/* <h1 className="font-superpixel text-3xl ">{pool.name}</h1>
        <Image src={pool.banner} alt={pool.name} width={1000} height={100} /> */}
        {/* Player Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="pixel-border bg-[#181B23] p-4 flex flex-col items-center">
            <span className="font-minecraft text-xs text-gray-400 mb-1">
              Win Rate
            </span>
            <span className="font-minecraft text-2xl text-green-400">
              {pool.winRate}%
            </span>
          </div>
          <div className="pixel-border bg-[#181B23] p-4 flex flex-col items-center">
            <span className="font-minecraft text-xs text-gray-400 mb-1">
              Total Bets
            </span>
            <span className="font-minecraft text-2xl">{pool.totalBets}</span>
          </div>
          <div className="pixel-border bg-[#181B23] p-4 flex flex-col items-center">
            <span className="font-minecraft text-xs text-gray-400 mb-1">
              Copiers
            </span>
            <span className="font-minecraft text-2xl">{pool.copiers}</span>
          </div>
          <div className="pixel-border bg-[#181B23] p-4 flex flex-col items-center">
            <span className="font-minecraft text-xs text-gray-400 mb-1">
              $SOL earned in 7Ds
            </span>
            <span className="font-minecraft text-2xl text-purple-300">
              {pool.sol7d}
            </span>
          </div>
        </div>
        {/* Betting Pool */}
        <div>
          <h1 className="font-minecraft text-2xl mb-2">
            {user}'s Betting Pool
          </h1>
          {pool.matches.map((match: Match, idx: number) => (
            <div key={idx} className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-minecraft text-lg">{match.league}</span>
                <span className="text-xs text-gray-400">{match.status}</span>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <span className="font-minecraft text-xl">{match.teams[0]}</span>
                <span className="font-minecraft text-lg text-purple-300">
                  {match.score}
                </span>
                <span className="font-minecraft text-xl">{match.teams[1]}</span>
              </div>
              {match.markets.map((market: Market, mIdx: number) => (
                <div key={mIdx} className="mb-4">
                  <div className="font-minecraft text-md mb-2">
                    {market.name}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {market.options.map((opt: MarketOption, oIdx: number) => (
                      <div
                        key={oIdx}
                        className="pixel-border bg-[#181B23] px-4 py-2 flex justify-between items-center font-minecraft"
                      >
                        <span>{opt.label}</span>
                        <span className="text-green-400">{opt.odds}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* Copy Bet Button */}
        <PixelButton
          className="pixel-border-white bg-green-600 hover:bg-green-700 text-white font-minecraft px-8 py-3 transition self-center mt-4"
          onClick={() => setModalOpen(true)}
        >
          Copy Bet
        </PixelButton>
      </div>

      <PixelModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="font-minecraft text-2xl mb-2 flex flex-col items-center gap-2">
          <span>Copy Betting Settings</span>
          <span className=" text-green-400 bg-black/60 text-sm px-3 py-1 rounded font-bold">Profit Sharing 12.00%</span>
        </div>
        <div className="mb-2 flex gap-4">
          <button className="pixel-border bg-[#23263A] text-white px-4 py-1 font-minecraft text-sm">Fixed Ratio</button>
          {/* <button className="pixel-border bg-[#23263A] text-gray-400 px-4 py-1 font-minecraft text-sm">Fixed Amount</button> */}
        </div>
        <div className="mb-2 flex justify-between font-minecraft text-md">
          <span>Lock-up period</span>
          <span>30 Days</span>
        </div>
        <div className="mb-2">
          <div className="font-minecraft text-sm text-gray-400 mb-1">Copy Amount</div>
          <div className="flex gap-2">
            <PixelInput value={stake} onChange={e => setStake(e.target.value)} className="w-full h-full" />
            <span className="font-minecraft text-xs flex items-center">SOL</span>
            <PixelButton className="px-2 py-1 text-xs">MAX</PixelButton>
          </div>
          <div className="text-xs text-gray-400 mt-1">Available 0.61 SOL</div>
        </div>
        <div className="mb-2 flex items-center gap-2">
          <input type="checkbox" id="auto-invest" className="accent-pixel-purple" />
          <label htmlFor="auto-invest" className="font-minecraft text-sm">Auto-Invest</label>
        </div>
        <div className="mb-2">
          <div className="font-minecraft text-xs text-gray-400 mb-1">Total Stop Loss</div>
          <PixelInput placeholder="0-95" className="w-full h-8" />
          <span className="font-minecraft text-xs text-gray-400"> % ROI</span>
          <div className="text-xs text-gray-400 mt-1">
            When the estimated margin balance of copiers reaches -- SOL, it will trigger a Stop Loss Market order to close all positions. Estimated PnL will be -- USDT. <span className="text-red-400">Stop loss cannot be modified during the lockup period.</span>
          </div>
        </div>
        <div className="mb-2">
          {/* <button className="w-full flex items-center justify-between font-minecraft text-xs text-gray-400 bg-transparent">
            Advanced Settings (Optional)
            <span>▼</span>
          </button> */}
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="profit-sharing" className="accent-pixel-purple" />
              <label htmlFor="profit-sharing" className="font-minecraft text-xs">
                I have confirmed Profit Sharing is <span className="text-green-400 font-bold">12.00%</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="agreement" className="accent-pixel-purple" />
              <label htmlFor="agreement" className="font-minecraft text-xs">
                I have read and I agree to the <span className="text-green-400 underline cursor-pointer">User Service Agreement</span>
              </label>
            </div>
          </div>
        </div>
        <PixelButton className="w-full bg-green-600 text-white hover:bg-green-700 font-minecraft mt-2 border-white shadow-white">
          Copy
        </PixelButton>
      </PixelModal>
    </div>
  );
}
