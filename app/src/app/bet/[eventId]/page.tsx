"use client"
import { ConfettiButton } from "@/components/magicui/confetti";
import { useParams } from "next/navigation";
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

export default function BetDetailsPage() {
  const params = useParams();
  const eventId = params?.eventId as string;
  const event = events.find(e => e.id === eventId) || events[0]; // fallback for demo

  // Add state for selected bet
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [solAmount, setSolAmount] = useState("");
  const { connected, publicKey, signTransaction, sendTransaction } = useWallet();
  const [connectOpen, setConnectOpen] = useState(false);
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

  // Initialize Solana connection
  useEffect(() => {
    setConnection(new Connection(clusterApiUrl('devnet'), 'confirmed'));
  }, []);

  function handleShare() {
    const text = encodeURIComponent(
      `I just placed a bet of ${solAmount} SOL on ${event.name} (${event.bet.find(b => b.id === selectedBet)?.name} @ ${event.bet.find(b => b.id === selectedBet)?.odds}) on Neeko.fun! #Solana #CopyBet\nhttps://neeko.fun/tx/${txHash}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  }
  
  async function processTransaction() {
    if (!connected || !publicKey || !connection || !sendTransaction) {
      setConnectOpen(true);
      return;
    }

    // Show transaction modal
    setTxInProgress(true);
    setTxStatus('preparing');
    
    // Update first step
    const newSteps = [...txSteps];
    newSteps[0].complete = true;
    setTxSteps(newSteps);
    
    try {
      // Create a new transaction
      const transaction = new Transaction();
      
      // Calculate amount in lamports (SOL * 10^9)
      const amountLamports = parseFloat(solAmount) * LAMPORTS_PER_SOL;
      
      if (isNaN(amountLamports) || amountLamports <= 0) {
        throw new Error("Invalid amount");
      }
      
      // Add transfer instruction (this will be a real transfer, but we'll send it to the program ID)
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: PROGRAM_ID, // In a real app, this would be the betting contract
          lamports: amountLamports,
        })
      );
      
      // Add recent blockhash to transaction
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Move to signing step
      await new Promise(resolve => setTimeout(resolve, 800));
      setTxStatus('signing');
      newSteps[1].complete = true;
      setTxSteps(newSteps);
      
      // Request user wallet signature - THIS WILL TRIGGER THE ACTUAL WALLET POPUP
      try {
        // Send the transaction - this will trigger the wallet to request signature
        // We're using a try/catch here because the user might reject the transaction
        const signature = await sendTransaction(transaction, connection);
        
        // Transaction was signed and sent to the network
        setTxStatus('confirming');
        newSteps[2].complete = true;
        setTxSteps(newSteps);
        setTxHash(signature);
        
        // Wait for confirmation
        try {
          // In a real app, we'd wait for confirmation
          // For demo purposes, we'll just simulate success after a delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Transaction successful
          newSteps[3].complete = true;
          setTxSteps(newSteps);
          setTxStatus('success');
          
          // Close transaction modal and open share modal after delay
          setTimeout(() => {
            setTxInProgress(false);
            setShareOpen(true);
            
            // Reset steps for next time
            setTxSteps([
              { step: "Preparing transaction", complete: false },
              { step: "Requesting signature", complete: false },
              { step: "Broadcasting transaction", complete: false },
              { step: "Confirming on blockchain", complete: false }
            ]);
          }, 2000);
        } catch (confirmError) {
          console.error("Transaction confirmation error:", confirmError);
          setTxStatus('error');
          setTimeout(() => setTxInProgress(false), 3000);
        }
      } catch (signError) {
        // User rejected the transaction or there was an error during signing
        console.error("Transaction signing error:", signError);
        if (signError instanceof SendTransactionError) {
          // Handle user rejection
          toast.error("Transaction was rejected");
        }
        setTxStatus('error');
        setTimeout(() => setTxInProgress(false), 3000);
      }
    } catch (error) {
      console.error("Transaction setup error:", error);
      setTxStatus('error');
      // Close error after delay
      setTimeout(() => {
        setTxInProgress(false);
      }, 3000);
    }
  }

  // For demo purposes, allow simulating the transaction without a real wallet
  async function simulateTransaction() {
    // Show transaction modal
    setTxInProgress(true);
    setTxStatus('preparing');
    
    // Update first step
    const newSteps = [...txSteps];
    newSteps[0].complete = true;
    setTxSteps(newSteps);
    
    // Wait a bit then move to simulating
    await new Promise(resolve => setTimeout(resolve, 800));
    setTxStatus('simulating');
    
    // Move to signing step
    await new Promise(resolve => setTimeout(resolve, 1200));
    setTxStatus('signing');
    newSteps[1].complete = true;
    setTxSteps(newSteps);
    
    // Simulate signing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Move to broadcasting step
    setTxStatus('confirming');
    newSteps[2].complete = true;
    setTxSteps(newSteps);
    
    // Create a fake transaction signature
    const fakeTxSignature = bs58.encode(Buffer.from(Array.from({length: 32}, () => Math.floor(Math.random() * 256))));
    setTxHash(fakeTxSignature);
    
    // Fake transaction confirmation
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Transaction successful
    newSteps[3].complete = true;
    setTxSteps(newSteps);
    setTxStatus('success');
    
    // Close transaction modal and open share modal after delay
    setTimeout(() => {
      setTxInProgress(false);
      setShareOpen(true);
      
      // Reset steps for next time
      setTxSteps([
        { step: "Preparing transaction", complete: false },
        { step: "Requesting signature", complete: false },
        { step: "Broadcasting transaction", complete: false },
        { step: "Confirming on blockchain", complete: false }
      ]);
    }, 2000);
  }

  // Choose transaction function based on whether wallet is connected
  function handlePlaceBet() {
    if (connected && publicKey) {
      processTransaction();
    } else {
      // For demo without a connected wallet
      simulateTransaction();
    }
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
        <PixelButton
          disabled={!selectedBet || !solAmount}
          onClick={handlePlaceBet}
          className={`${!selectedBet || !solAmount ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"}`}
        >
          Place Bet
        </PixelButton>
        
        {!connected && (
          <div className="mt-4 text-center">
            <PixelButton
              onClick={() => setVisible(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Connect Wallet
            </PixelButton>
          </div>
        )}
      </div>

      {/* Transaction Processing Modal */}
      <PixelModal open={txInProgress} onClose={() => {}}>
        <div className="font-minecraft text-2xl mb-4 text-center">Processing Transaction</div>
        <div className="flex flex-col items-center justify-center mb-6">
          {txStatus !== 'success' && txStatus !== 'error' && (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          )}
          
          {txStatus === 'success' && (
            <div className="text-green-400 text-5xl mb-4">✓</div>
          )}
          
          {txStatus === 'error' && (
            <div className="text-red-500 text-5xl mb-4">✗</div>
          )}
          
          <div className="text-center mb-4 font-minecraft text-lg">
            {txStatus === 'preparing' && "Preparing Transaction"}
            {txStatus === 'simulating' && "Simulating Transaction"}
            {txStatus === 'signing' && "Waiting for Signature"}
            {txStatus === 'confirming' && "Confirming Transaction"}
            {txStatus === 'success' && "Transaction Successful"}
            {txStatus === 'error' && "Transaction Failed"}
          </div>
          
          {/* Transaction steps */}
          <div className="w-full max-w-xs">
            {txSteps.map((step, index) => (
              <div key={index} className="flex items-center mb-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 
                  ${step.complete 
                    ? "bg-green-500" 
                    : index === txSteps.findIndex(s => !s.complete) && txStatus !== 'error' && txStatus !== 'success'
                      ? "bg-purple-500 animate-pulse" 
                      : "bg-gray-700"
                  }`}>
                  {step.complete && <span className="text-white text-xs">✓</span>}
                </div>
                <div className={`text-sm ${step.complete ? "text-green-400" : "text-gray-400"}`}>
                  {step.step}
                </div>
              </div>
            ))}
          </div>
          
          {txHash && (
            <div className="mt-4 pt-4 border-t border-gray-700 w-full">
              <div className="text-center text-sm font-minecraft mb-1">Transaction Hash:</div>
              <div className="text-xs text-gray-400 break-all text-center font-mono">
                {txHash}
              </div>
              <div className="mt-2 text-center">
                <a 
                  href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-xs font-minecraft"
                >
                  View on Solana Explorer
                </a>
              </div>
            </div>
          )}
        </div>
      </PixelModal>
      
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
          <div className="font-minecraft text-md mb-1">
            Amount: <span className="text-green-400">{solAmount} SOL</span>
          </div>
          {txHash && (
            <div className="font-minecraft text-md mb-1">
              <span className="text-gray-400 text-xs break-all">TX: {txHash}</span>
            </div>
          )}
        </div>
        <div className="mb-4 text-center font-minecraft text-sm">
          Invite your friends to follow your bet!
        </div>
        <ConfettiButton
          className="w-full bg-[#9b87f5] hover:bg-purple-700 text-white font-minecraft mb-2"
          onClick={handleShare}
        >
          Share on X (Twitter)
        </ConfettiButton>
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