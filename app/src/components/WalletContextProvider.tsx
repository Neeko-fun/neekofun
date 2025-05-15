'use client';

import { FC, ReactNode } from 'react';
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider
} from '@solana/wallet-adapter-react-ui';

import {
  PhantomWalletAdapter
} from '@solana/wallet-adapter-wallets';

import { clusterApiUrl } from '@solana/web3.js';

const endpoint = clusterApiUrl('devnet');
const wallets = [new PhantomWalletAdapter()];

interface Props {
  children: ReactNode;
}

const WalletContextProvider: FC<Props> = ({ children }) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;