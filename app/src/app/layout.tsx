import './globals.css';
import type { Metadata } from 'next';
import WalletContextProvider from '@/components/WalletContextProvider';

export const metadata: Metadata = {
  title: 'Monaco Betting App',
  description: 'Built on Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}