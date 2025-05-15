"use client"
import { ConfettiButton } from "@/components/magicui/confetti";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import PixelModal from "@/components/PixelModal";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  SendTransactionError
} from '@solana/web3.js';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import bs58 from 'bs58';
import { toast } from "sonner";
import { CustomWalletButton } from "@/components/WalletConnect";
import { Event, getEventById, verifyEventSignature } from "@/lib/event-service";

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

// Smart contract program ID (using a real but random Solana program address)
const PROGRAM_ID = new PublicKey("BEt74r5nin5Uj2SnBWzkDdJPitGmEF8CiM7ZCrTZB98g");

export default function BetPage() {
  const { eventId } = useParams();
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [betAmount, setBetAmount] = useState("0.1");
  const [selectedOdds, setSelectedOdds] = useState("");
  const [betLoading, setBetLoading] = useState(false);
  const { setVisible } = useWalletModal();
  const [txInProgress, setTxInProgress] = useState(false);
  const [txStatus, setTxStatus] = useState<'preparing' | 'simulating' | 'signing' | 'confirming' | 'success' | 'error' | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txSteps, setTxSteps] = useState<{step: string, complete: boolean}[]>([
    { step: "Preparing transaction", complete: false },
    { step: "Requesting signature", complete: false },
    { step: "Broadcasting transaction", complete: false },
    { step: "Confirming on blockchain", complete: false }
  ]);
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    if (typeof eventId !== 'string') {
      router.push('/events');
      return;
    }

    const fetchEvent = () => {
      const fetchedEvent = getEventById(eventId);
      if (fetchedEvent) {
        setEvent(fetchedEvent);
      } else {
        toast.error("Event not found");
        router.push('/events');
      }
      setLoading(false);
    };

    fetchEvent();
  }, [eventId, router]);

  const formatDate = (dateString: string) => {
    try {
      if (dateString.includes('T')) {
        return new Date(dateString).toLocaleString();
      } else {
        return new Date(dateString).toLocaleString();
      }
    } catch (error) {
      return dateString;
    }
  };

  const getOddsArray = (oddsString: string) => {
    return oddsString.split('|').map(odds => odds.trim());
  };

  const handleBet = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!selectedOdds) {
      toast.error("Please select odds");
      return;
    }

    if (!betAmount || parseFloat(betAmount) <= 0) {
      toast.error("Please enter a valid bet amount");
      return;
    }

    setBetLoading(true);

    try {
      // In a real app, here we would process the bet via blockchain
      // For now, just simulate a successful bet with local storage

      // Store bet in local storage
      const newBet = {
        id: `bet_${Date.now()}`,
        eventId,
        bettor: publicKey.toBase58(),
        amount: betAmount,
        odds: selectedOdds,
        timestamp: new Date().toISOString(),
        status: "pending", // pending, won, lost
      };

      // Get existing bets or initialize empty array
      const existingBets = JSON.parse(localStorage.getItem("bets") || "[]");
      localStorage.setItem("bets", JSON.stringify([...existingBets, newBet]));

      toast.success("Bet placed successfully!");
      // Wait a bit before redirecting
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error("Failed to place bet");
    } finally {
      setBetLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050817] text-white">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-10">
            <p className="text-lg font-minecraft">Loading event details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#050817] text-white">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-10 bg-[#232136] pixel-border">
            <p className="text-lg font-minecraft">Event not found</p>
            <button
              onClick={() => router.push('/events')}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              Back to Events
            </button>
          </div>
        </main>
      </div>
    );
  }

  const oddsArray = getOddsArray(event.odds);

  return (
    <div className="min-h-screen bg-[#050817] text-white">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#232136] pixel-border p-6 shadow mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold font-minecraft mb-2">{event.name}</h1>
              <p className="text-sm text-gray-300 mb-4">{event.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Event time: {formatDate(event.time)}</span>
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-md self-start">
              <span className="text-sm">Created by:</span>
              <div className="font-mono text-xs text-purple-300 break-all">
                {event.creator}
              </div>
              {event.signature && (
                <div className="mt-2">
                  <span className="text-xs text-gray-400">Verified</span>
                  <span className="ml-2 text-green-400">✓</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {!connected ? (
          <div className="bg-[#232136] pixel-border p-6 shadow text-center">
            <p className="text-lg mb-4 font-minecraft">Connect your wallet to place a bet</p>
            <div className="flex justify-center">
              <CustomWalletButton />
            </div>
          </div>
        ) : (
          <div className="bg-[#232136] pixel-border p-6 shadow">
            <h2 className="text-xl font-bold font-minecraft mb-4">Place Your Bet</h2>
            
            <div className="mb-6">
              <label className="block mb-2 font-minecraft">Select Odds</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {oddsArray.map((odds, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border-2 font-semibold transition ${
                      selectedOdds === odds
                        ? "bg-purple-600 border-purple-400 text-white"
                        : "bg-[#1A1A2E] border-gray-700 text-gray-300 hover:bg-purple-900"
                    }`}
                    onClick={() => setSelectedOdds(odds)}
                  >
                    {odds} {index === 0 ? "(Home)" : index === 1 ? "(Draw)" : "(Away)"}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="betAmount" className="block mb-2 font-minecraft">
                Bet Amount (SOL)
              </label>
              <input
                type="number"
                id="betAmount"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                min="0.01"
                step="0.01"
                className="w-full px-4 py-2 bg-[#0F0F1A] border-2 border-gray-700 pixel-border text-white"
              />
            </div>
            
            <div className="mb-6">
              <div className="bg-gray-800 p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span>Potential Win:</span>
                  <span className="font-mono text-green-400">
                    {selectedOdds && betAmount ? 
                      `${(parseFloat(betAmount) * parseFloat(selectedOdds)).toFixed(2)} SOL` : 
                      "0.00 SOL"}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleBet}
              disabled={betLoading || !selectedOdds}
              className={`w-full mt-4 pixel-border bg-purple-600 text-white px-6 py-3 font-semibold shadow hover:bg-purple-700 transition font-minecraft ${
                betLoading || !selectedOdds ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {betLoading ? "Processing..." : "Place Bet"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}