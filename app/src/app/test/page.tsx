// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { 
  PublicKey, 
  Connection, 
  Transaction, 
  SystemProgram, 
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  AccountMeta,
  Keypair,
} from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';
import PixelButton from "@/components/PixelButton";
import { CONNECTION } from "@/lib/constants";
import { SolanaProvider, CustomWalletButton } from "@/components/WalletConnect";
import idl from "../idl/prediction_market.json";
import wallet from "../../wallet.json";

// Define program ID from the provided address
const PROGRAM_ID_STRING = "6MhWdMaapoTs7BNzRFW6X9MobiTgg8HA3joW8WEXYjbW";

interface MarketData {
  publicKey: PublicKey;
  account: {
    authority: PublicKey;
    question: string;
    outcomes: string[];
    status: any;
  };
}

// Get Anchor Program interface
const getProgramInstance = (wallet) => {
  if (!wallet || !wallet.publicKey) return null;
  
  // Create a custom provider that will handle wallet interactions correctly
  const provider = new anchor.AnchorProvider(
    CONNECTION,
    {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
    },
    { preflightCommitment: "processed", commitment: "processed" }
  );
  
  // Initialize program
  return new anchor.Program(idl, new PublicKey(PROGRAM_ID_STRING), provider);
};

const MarketCreationForm = ({ onMarketCreated }) => {
  const wallet = useWallet();
  const [question, setQuestion] = useState("");
  const [outcomes, setOutcomes] = useState(["", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const addOutcome = () => {
    setOutcomes([...outcomes, ""]);
  };

  const updateOutcome = (index, value) => {
    const newOutcomes = [...outcomes];
    newOutcomes[index] = value;
    setOutcomes(newOutcomes);
  };

  const removeOutcome = (index) => {
    if (outcomes.length <= 2) return; // Keep at least 2 outcomes
    const newOutcomes = [...outcomes];
    newOutcomes.splice(index, 1);
    setOutcomes(newOutcomes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question || outcomes.some(o => !o)) {
      alert("Please fill in all fields");
      return;
    }

    if (!wallet.connected || !wallet.publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      // Get program instance
      const program = getProgramInstance(wallet);
      if (!program) {
        throw new Error("Failed to initialize program");
      }

      // Generate a new keypair for the market account
      const marketKeypair = Keypair.fromSecretKey(Uint8Array.from([189,30,236,135,76,86,137,150,125,177,144,17,29,178,71,198,123,208,245,192,251,153,240,232,233,24,137,58,192,74,203,212,47,149,186,21,250,61,248,50,33,224,81,102,253,159,27,18,163,201,90,10,120,101,113,53,122,103,81,35,167,130,214,215]));
      
      console.log("Creating market with question:", question);
      console.log("Outcomes:", outcomes);
      console.log("Market keypair public key:", marketKeypair.publicKey.toString());
      
      // Build the transaction instruction
      const ix = await program.methods
        .createMarket(question, outcomes)
        .accounts({
          market: marketKeypair.publicKey,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      
      // Create a new transaction and add the instruction
      const transaction = new Transaction().add(ix);
      
      // Get recent blockhash
      const { blockhash } = await CONNECTION.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
      
      // Sign with the market keypair first
      transaction.partialSign(marketKeypair);
      
      // Send transaction to the wallet for signing
      const signedTransaction = await wallet.signTransaction(transaction);
      
      // Send to the network
      const rawTransaction = signedTransaction.serialize();
      const txid = await CONNECTION.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        preflightCommitment: 'processed',
      });
      
      await CONNECTION.confirmTransaction(txid, 'processed');
      
      console.log("Market created with transaction signature:", txid);
      
      // Notify parent component
      onMarketCreated();
      
      // Reset form
      setQuestion("");
      setOutcomes(["", ""]);
      
      alert("Market created successfully!");
    } catch (error) {
      console.error("Error creating market:", error);
      alert(`Failed to create market: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 pixel-shadow mb-8">
      <h2 className="text-2xl font-minecraft text-white mb-4">Create New Prediction Market</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white font-minecraft mb-2">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:border-purple-500"
            placeholder="E.g., Will BTC reach $100k by end of year?"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white font-minecraft mb-2">Outcomes</label>
          {outcomes.map((outcome, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={outcome}
                onChange={(e) => updateOutcome(index, e.target.value)}
                className="flex-grow px-3 py-2 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:border-purple-500"
                placeholder={`Outcome ${index + 1}`}
                required
              />
              {outcomes.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOutcome(index)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOutcome}
            className="mt-2 px-3 py-2 bg-green-500 text-white rounded"
          >
            + Add Outcome
          </button>
        </div>

        <PixelButton type="submit" isLoading={isLoading} className="w-full bg-purple-600">
          Create Market
        </PixelButton>
      </form>
    </div>
  );
};

const MarketCard = ({ market }) => {
  const wallet = useWallet();
  const [isLoadingBet, setIsLoadingBet] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState(null);

  const handlePrediction = async (outcomeIndex) => {
    if (!wallet.connected || !wallet.publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoadingBet(true);
    setSelectedOutcome(outcomeIndex);

    try {
      // Get program instance
      const program = getProgramInstance(wallet);
      if (!program) {
        throw new Error("Failed to initialize program");
      }
      
      // Calculate PDA for prediction account
      const [predictionPda] = await PublicKey.findProgramAddress(
        [
          Buffer.from("prediction"),
          market.publicKey.toBuffer(),
          wallet.publicKey.toBuffer(),
        ],
        new PublicKey(PROGRAM_ID_STRING)
      );
      
      console.log("Placing prediction on outcome:", outcomeIndex);
      console.log("Prediction PDA:", predictionPda.toString());
      
      // Build the transaction instruction
      const ix = await program.methods
        .placePrediction(outcomeIndex)
        .accounts({
          user: wallet.publicKey,
          market: market.publicKey,
          prediction: predictionPda,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      
      // Create a new transaction and add the instruction
      const transaction = new Transaction().add(ix);
      
      // Get recent blockhash
      const { blockhash } = await CONNECTION.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
      
      // Send transaction to the wallet for signing
      const signedTransaction = await wallet.signTransaction(transaction);
      
      // Send to the network
      const rawTransaction = signedTransaction.serialize();
      const txid = await CONNECTION.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        preflightCommitment: 'processed',
      });
      
      await CONNECTION.confirmTransaction(txid, 'processed');
      
      console.log("Prediction placed with transaction signature:", txid);
      
      alert("Prediction placed successfully!");
    } catch (error) {
      console.error("Error placing prediction:", error);
      alert(`Failed to place prediction: ${error.message}`);
    } finally {
      setIsLoadingBet(false);
      setSelectedOutcome(null);
    }
  };

  // Helper function to check if status is open
  const isOpen = () => {
    return market.account.status.open !== undefined;
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border-2 border-purple-500 pixel-shadow mb-4">
      <h3 className="text-xl font-minecraft text-white mb-2">{market.account.question}</h3>
      
      <div className="mb-4">
        <p className="text-gray-400 mb-2 font-minecraft">Status: {isOpen() ? "Open" : "Resolved"}</p>
        <p className="text-gray-400 font-minecraft">Created by: {market.account.authority.toString().slice(0, 4)}...{market.account.authority.toString().slice(-4)}</p>
      </div>
      
      <div className="space-y-2">
        <p className="text-white font-minecraft mb-2">Outcomes:</p>
        {market.account.outcomes.map((outcome, index) => (
          <div key={index} className="flex items-center">
            <PixelButton
              onClick={() => handlePrediction(index)}
              isLoading={isLoadingBet && selectedOutcome === index}
              className="w-full bg-blue-600 mb-2"
            >
              {outcome}
            </PixelButton>
          </div>
        ))}
      </div>
    </div>
  );
};

const PredictionMarketTest = () => {
  const wallet = useWallet();
  const [markets, setMarkets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(true);
  const [error, setError] = useState(null);
  const [program, setProgram] = useState(null);

  // Initialize Anchor program
  useEffect(() => {
    if (wallet.connected) {
      try {
        const program = getProgramInstance(wallet);
        setProgram(program);
      } catch (err) {
        console.error("Error initializing program:", err);
        setError(`Failed to initialize program: ${err.message}`);
      }
    }
  }, [wallet.connected]);

  // Fetch markets from the blockchain
  const fetchMarkets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!program) {
        throw new Error("Program not initialized");
      }
      
      console.log("Fetching markets from program", PROGRAM_ID_STRING);
      
      // Use Anchor's built-in account fetching
      const allMarkets = await program.account.market.all();
      console.log("Fetched markets:", allMarkets);
      
      setMarkets(allMarkets);
    } catch (err) {
      console.error("Error fetching markets:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // When program is initialized, fetch markets
  useEffect(() => {
    if (program) {
      fetchMarkets();
    }
  }, [program]);

  // Refresh markets after creation
  const handleMarketCreated = () => {
    if (program) {
      fetchMarkets();
    }
  };

  return (
    <SolanaProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-minecraft text-white">Prediction Markets</h1>
          <CustomWalletButton />
        </div>

        {error && (
          <div className="bg-red-500 p-4 rounded-lg mb-6 text-white">
            <p>Error: {error}</p>
            <p className="text-sm mt-2">Check the console for more details.</p>
          </div>
        )}

        {wallet.connected ? (
          <>
            <div className="mb-6">
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="text-white bg-purple-600 px-4 py-2 rounded-lg mb-4"
              >
                {showCreateForm ? "Hide Creation Form" : "Show Creation Form"}
              </button>
              {showCreateForm && <MarketCreationForm onMarketCreated={handleMarketCreated} />}
            </div>
            
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-minecraft text-white">Available Markets</h2>
              <PixelButton onClick={fetchMarkets} className="bg-green-500">
                Refresh Markets
              </PixelButton>
            </div>

            {isLoading ? (
              <div className="text-center py-10">
                <p className="text-white font-minecraft">Loading markets from blockchain...</p>
              </div>
            ) : markets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {markets.map((market) => (
                  <MarketCard key={market.publicKey.toString()} market={market} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-800 rounded-lg border-2 border-gray-700">
                <p className="text-white font-minecraft">No markets available. Create one to get started!</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-gray-800 rounded-lg border-2 border-purple-500 pixel-shadow">
            <p className="text-white font-minecraft text-xl mb-4">Connect your wallet to get started!</p>
            <div className="flex justify-center">
              <CustomWalletButton />
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-gray-800 p-4 rounded-lg border-2 border-yellow-500">
          <h3 className="text-xl font-minecraft text-white mb-2">Program Information</h3>
          <p className="text-white">
            This app interacts with the Solana prediction market program at address:<br/>
            <span className="font-mono bg-gray-900 px-2 py-1 rounded">{PROGRAM_ID_STRING}</span>
          </p>
          <p className="text-white mt-2">
            The program allows users to create prediction markets with multiple outcomes and place bets on those outcomes.
          </p>
        </div>
      </div>
    </SolanaProvider>
  );
};

export default PredictionMarketTest;
