'use client';
import dynamic from 'next/dynamic';

// Dynamically import to avoid hydration issues
const WalletMultiButton = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function ConnectWalletButton() {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <WalletMultiButton />
    </div>
  );
}