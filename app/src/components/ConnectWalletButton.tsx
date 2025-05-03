"use client"
import React, { useState } from 'react';
import PixelButton from './PixelButton';
import { toast } from './ui/Sonner';

const ConnectWalletButton: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      // This is just a placeholder - in reality, you would use Solana wallet adapter
      setTimeout(() => {
        const mockAddress = 'neekoXYZ...abc123';
        setWalletAddress(mockAddress);
        setIsConnected(true);
        setIsConnecting(false);
        toast.success("Wallet connected!");
      }, 1000);
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error("Failed to connect wallet");
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    toast.info("Wallet disconnected");
  };

  if (isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="bg-pixel-purple-dark px-3 py-1.5 text-white text-sm border-2 border-black shadow-pixel-sm">
          {walletAddress}
        </div>
        <PixelButton variant="small" onClick={disconnectWallet} className="bg-red-600">
          Disconnect
        </PixelButton>
      </div>
    );
  }

  return (
    <PixelButton 
      onClick={connectWallet} 
      isLoading={isConnecting} 
      className="animate-pixel-pulse bg-purple-400"
    >
      Connect Wallet
    </PixelButton>
  );
};

export default ConnectWalletButton;
