"use client";
import React, { useState } from "react";
import PixelButton from "@/components/PixelButton";
import PixelModal from "@/components/PixelModal";
import { ConfettiButton } from "@/components/magicui/confetti";

const mockUser = {
  username: "yourname",
  referralLink: `https://neeko.fun/?ref=yourname`,
  friendsReferred: 3,
  rewardsEarned: 1.5, // in SOL, for example
  referredFriends: [
    { name: "Alice", joined: true },
    { name: "Bob", joined: true },
    { name: "Charlie", joined: false },
  ],
};

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(mockUser.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleShare() {
    const text = encodeURIComponent(
      `Join me on Neeko.fun and get started with copy betting! Use my referral link: ${mockUser.referralLink} #Solana #CopyBet`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-[#181B23] text-white flex flex-col items-center py-8">
      <div className="pixel-border bg-[#23263A] p-8 w-full max-w-lg shadow-lg">
        <h1 className="font-minecraft text-2xl mb-4 text-center">Invite Friends & Earn Rewards</h1>
        <div className="mb-4 text-center font-minecraft text-md text-gray-300">
          Share your unique referral link and earn rewards when your friends join and bet!
        </div>
        <div className="flex flex-col items-center mb-6">
          <div className="font-minecraft text-sm mb-2">Your Referral Link:</div>
          <div className="flex flex-row items-center gap-2 mb-2 w-full">
            <input
              type="text"
              value={mockUser.referralLink}
              readOnly
              className="w-full px-2 py-1 rounded bg-[#181B23] text-white border border-[#9b87f5] font-minecraft text-sm"
            />
            <PixelButton onClick={handleCopy} className="bg-[#9b87f5] hover:bg-purple-700 text-white font-minecraft px-3 py-2">
              {copied ? "Copied!" : "Copy"}
            </PixelButton>
          </div>
          <ConfettiButton
            className="w-full bg-[#9b87f5] hover:bg-purple-700 text-white font-minecraft mb-2"
            onClick={handleShare}
          >
            Share on X (Twitter)
          </ConfettiButton>
        </div>
        <div className="pixel-border bg-[#181B23] p-4 mb-4">
          <div className="font-minecraft text-lg mb-2 text-center">Referral Stats</div>
          <div className="flex flex-row justify-between font-minecraft text-md mb-2">
            <span>Friends Referred:</span>
            <span className="text-green-400">{mockUser.friendsReferred}</span>
          </div>
          <div className="flex flex-row justify-between font-minecraft text-md">
            <span>Rewards Earned:</span>
            <span className="text-purple-200">{mockUser.rewardsEarned} SOL</span>
          </div>
        </div>
        <div className="pixel-border bg-[#23263A] p-4">
          <div className="font-minecraft text-md mb-2">Referred Friends</div>
          <ul className="font-minecraft text-sm">
            {mockUser.referredFriends.map((friend, idx) => (
              <li key={idx} className="flex flex-row justify-between mb-1">
                <span>{friend.name}</span>
                <span className={friend.joined ? "text-green-400" : "text-gray-400"}>
                  {friend.joined ? "Joined" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
