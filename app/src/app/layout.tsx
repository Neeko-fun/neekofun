import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Mulish } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/ui/Header";
import { SolanaProvider } from "@/components/WalletConnect";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

const minecraft = localFont({
  src: "../../public/fonts/Minecraft.ttf",
  variable: "--font-minecraft",
  display: "swap",
});

const superpixel = localFont({
  src: "../../public/fonts/Super-Pixel.ttf",
  variable: "--font-superpixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neekofun",
  description: "Neekofun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${mulish.variable} ${minecraft.variable} ${superpixel.variable} antialiased`}
      >
        <SolanaProvider>
          <Header />
          {children}
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                background: '#181B23',
                color: '#fff',
                border: '1px solid #2D3748',
                fontFamily: 'var(--font-minecraft)'
              },
              className: 'font-minecraft'
            }}
          />
        </SolanaProvider>
      </body>
    </html>
  );
}
