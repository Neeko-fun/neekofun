"use client"
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const users = [
  {
    name: "PixelKing",
    roi: 124.5,
    streak: "8W",
    sol: 432.15,
    followers: 1243,
  },
  {
    name: "CryptoQueen",
    roi: 98.7,
    streak: "4W",
    sol: 387.22,
    followers: 987,
  },
  {
    name: "SolBettor",
    roi: 76.3,
    streak: "6W",
    sol: 256.89,
    followers: 654,
  },
  {
    name: "NeonBettor",
    roi: 65.2,
    streak: "3W",
    sol: 189.45,
    followers: 423,
  },
  {
    name: "ChainChamp",
    roi: 59.8,
    streak: "2W",
    sol: 142.76,
    followers: 321,
  },
];

export default function FomoBoard() {
  const [sortBy, setSortBy] = useState("ROI");
  const sortedUsers = [...users].sort((a, b) => b.roi - a.roi);
  const params = useParams();
  const user = params?.user as string;

  return (
    <div className="min-h-screen bg-[#181B23] text-white flex items-center justify-center py-12">
      <div className="pixel-border bg-[#23263A] p-8 w-full max-w-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-minecraft text-2xl">FOMO Board</h1>
          <div className="flex items-center gap-2 font-minecraft text-sm">
            <span>Sort by:</span>
            <select
              className="pixel-border bg-[#181B23] text-white px-2 py-1 font-minecraft"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="ROI">ROI</option>
              <option value="Streak">Streak</option>
              <option value="Followers">Followers</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {sortedUsers.map((user, idx) => (
            <div key={user.name} className="pixel-border bg-[#181B23] flex items-center justify-between px-6 py-4">
              <div className="flex flex-col">
                <Link href={`/fomoboard/${user.name}`}>
                  <span className="font-minecraft text-lg text-purple-300 cursor-pointer hover:underline">
                    #{idx + 1} {user.name}
                  </span>
                </Link>
                <span className="text-xs text-gray-400">ROI: <span className="text-green-400 font-minecraft">{user.roi}%</span> &nbsp; Streak: <span className="text-blue-300 font-minecraft">{user.streak}</span></span>
                <span className="text-xs text-gray-400">{user.sol} <span className="text-purple-200 font-minecraft">SOL</span> &nbsp; {user.followers} followers</span>
              </div>
              <button className="pixel-border bg-[#9b87f5] hover:bg-purple-700 text-white font-minecraft px-4 py-2 transition">Follow</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
