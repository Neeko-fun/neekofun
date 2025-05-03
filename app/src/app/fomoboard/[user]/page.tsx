"use client";
import { useParams } from "next/navigation";
import React from "react";
import Image from "next/image";
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
        <button className="pixel-border-white bg-green-600 hover:bg-green-700 text-white font-minecraft px-8 py-3 transition self-center ">
          Copy Bet
        </button>
      </div>
    </div>
  );
}
