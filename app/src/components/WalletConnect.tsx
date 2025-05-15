"use client";

import dynamic from "next/dynamic";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider, useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  BitgetWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SalmonWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { ReactNode, useMemo, useState, useRef, useEffect } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { CONNECTION } from "@/lib/constants";
import PixelButton from "./PixelButton";
import { useRouter } from "next/navigation";

// Keep the dynamic import for compatibility
export const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
  }
);

// Custom wallet button using PixelButton styling
export const CustomWalletButton = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleConnect = () => {
    setVisible(true);
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await disconnect();
    } finally {
      setIsLoading(false);
      setShowDropdown(false);
    }
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {!connected ? (
        <PixelButton 
          onClick={handleConnect} 
          isLoading={isLoading} 
          className="animate-pixel-pulse bg-purple-400 pixel-border"
        >
          Connect Wallet
        </PixelButton>
      ) : (
        <>
          <PixelButton 
            onClick={() => setShowDropdown(!showDropdown)} 
            isLoading={isLoading} 
            className="bg-purple-400 pixel-border"
          >
            {`${publicKey?.toString().slice(0, 4)}...${publicKey?.toString().slice(-4)}`}
          </PixelButton>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 z-20 font-minecraft ">
              <div className="bg-gray-800 border-2 border-black pixel-shadow-lg divide-y divide-gray-700">
              <div 
                  className="px-4 py-3 text-sm text-white cursor-pointer hover:bg-purple-900"
                  onClick={copyAddress}
                >
                  Copy Address
                </div>
                <div 
                  className="px-4 py-3 text-sm text-white cursor-pointer hover:bg-purple-900"
                  onClick={() => router.push("/profile")}
                >
                  Profile
                </div>
                <div 
                  className="px-4 py-3 text-sm text-white cursor-pointer hover:bg-purple-900"
                  onClick={() => router.push("/referral")}
                >
                  Referral
                </div>
                <div 
                  className="px-4 py-3 text-sm text-white cursor-pointer hover:bg-purple-900"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => CONNECTION.rpcEndpoint, []);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BitgetWalletAdapter(),
      new SalmonWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}