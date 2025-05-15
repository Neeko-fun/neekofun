"use client"
import { ConfettiButton } from "@/components/magicui/confetti";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import PixelModal from "@/components/PixelModal";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

// Mock event data for demo
const events = [
  {
    id: "1",
    name: "Football: Real Madrid vs Barcelona",
    time: "Live",
    odds: [1.8, 2.1, 3.0],
    bet: [
      {
        id: "1",
        name: "Real Madrid",
        odds: 1.8,
      },
      {
        id: "2",
        name: "Draw",
        odds: 2.1,
      },
      {
        id: "3",
        name: "Barcelona",
        odds: 3.0,
      },
    ],
  },
  // ...other events
];

export default function BetDetailsPage() {
  const params = useParams();
  const eventId = params?.eventId as string;
  const event = events.find(e => e.id === eventId) || events[0]; // fallback for demo

  // Add state for selected bet
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [solAmount, setSolAmount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const { setVisible } = useWalletModal();

  function handleShare() {
    const text = encodeURIComponent(
      `I just placed a bet on ${event.name} (${event.bet.find(b => b.id === selectedBet)?.name} @ ${event.bet.find(b => b.id === selectedBet)?.odds}) on Neeko.fun! #Solana #CopyBet\nhttps://neeko.fun`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  }
  

  return (
    <div className="min-h-screen bg-[#181B23] text-white flex flex-col items-center py-8">
      <div className="pixel-border bg-[#23263A] p-8 w-full max-w-lg shadow-lg">
        <h1 className="font-minecraft text-2xl mb-4">{event.name}</h1>
        <div className="text-gray-400 mb-2 flex flex-row items-center gap-2"><div className="rounded-full bg-green-400 animate-pulse w-3 h-3 mb-1"></div>{event.time}</div>
        <div className="mb-4">
          <span className="font-minecraft">Odds: </span>
          {event.odds.map((odd, idx) => (
            <span key={idx} className="text-purple-200 font-minecraft mx-2">
              {odd}
              {idx < event.odds.length - 1 && " | "}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-4 mb-4">
          {event.bet.map((b: { id: string; name: string; odds: number }) => (
            <button
              key={b.id}
              className={`pixel-border font-minecraft px-4 py-3 flex justify-between items-center transition ${
                selectedBet === b.id
                  ? "bg-[#9b87f5] text-white border-white"
                  : "bg-[#181B23] text-purple-200 hover:bg-[#23263A]"
              }`}
              onClick={() => setSelectedBet(b.id)}
            >
              <span>{b.name}</span>
              <span className="ml-4">{b.odds}</span>
            </button>
          ))}
        </div>
        <div className="mb-4">
          <PixelInput
            label="SOL Amount"
            type="number"
            min="0"
            step="0.01"
            value={solAmount}
            onChange={e => setSolAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full h-10"
          />
        </div>
        <ConfettiButton
          disabled={!selectedBet || !solAmount}
          onClick={() => {
            if (isConnected) {
              setShareOpen(true);
            } else {
              setConnectOpen(true);
            }
          }}
        >
          Place Bet
        </ConfettiButton>
      </div>
      <PixelModal open={shareOpen} onClose={() => setShareOpen(false)}>
        <div className="font-minecraft text-2xl mb-2 text-center">Share Your Bet!</div>
        <div className="pixel-border bg-[#181B23] p-4 mb-4 flex flex-col items-center">
          <div className="font-minecraft text-lg mb-1">
            {event.name}
          </div>
          <div className="font-minecraft text-md mb-1">
            Bet: <span className="text-green-400">{event.bet.find(b => b.id === selectedBet)?.name}</span>
          </div>
          <div className="font-minecraft text-md mb-1">
            Odds: <span className="text-purple-200">{event.bet.find(b => b.id === selectedBet)?.odds}</span>
          </div>
        </div>
        <div className="mb-4 text-center font-minecraft text-sm">
          Invite your friends to follow your bet!
        </div>
        <PixelButton
          className="w-full bg-[#9b87f5] hover:bg-purple-700 text-white font-minecraft mb-2"
          onClick={handleShare}
        >
          Share on X (Twitter)
        </PixelButton>
        <PixelButton
          className="w-full bg-gray-700 text-white font-minecraft"
          onClick={() => setShareOpen(false)}
        >
          Close
        </PixelButton>
      </PixelModal>
      <PixelModal open={connectOpen} onClose={() => setConnectOpen(false)}>
        <div className="font-minecraft text-2xl mb-4 text-center">Connect Your Wallet</div>
        <div className="mb-4 text-center font-minecraft text-sm">
          Please connect your wallet to place a bet.
        </div>
        <PixelButton
          className="w-full bg-green-600 text-white font-minecraft"
          onClick={() => {
            setVisible(true);
            setConnectOpen(false);
          }}
        >
          Connect Wallet
        </PixelButton>
      </PixelModal>
    </div>
  );
}