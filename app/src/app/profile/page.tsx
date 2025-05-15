"use client";
import React, { useState } from "react";
import { UserIcon, ChartBarIcon, DocumentTextIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import PixelInput from "@/components/PixelInput";
import PixelButton from "@/components/PixelButton";
import Image from "next/image";
import PixelModal from "@/components/PixelModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const tabs = [
  { name: "Options", icon: UserIcon },
  { name: "Statistics", icon: ChartBarIcon },
  { name: "Transactions", icon: DocumentTextIcon },
  { name: "Disconnect", icon: ArrowLeftOnRectangleIcon },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Options");
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const {connected, disconnect} = useWallet();
  const { setVisible } = useWalletModal();
  // Mock profile data
  const [name, setName] = useState("Bet Master");
  const [email, setEmail] = useState("betmaster@gmail.com");
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  if (!connected) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#181B23]">
        <div className="pixel-border bg-[#23263A] p-8 flex flex-col items-center gap-4">
          <div className="font-minecraft text-2xl mb-2">Please connect your wallet</div>
          <PixelButton
            className="bg-green-600 hover:bg-green-700 text-white font-minecraft px-8 py-3"
            onClick={() => setVisible(true)}
          >
            Connect Wallet
          </PixelButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181B23] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 p-8 border-r border-[#23263A] flex flex-col gap-6">
        <h2 className="font-superpixel text-2xl mb-4">PROFILE</h2>
        <nav className="flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.name}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-minecraft text-lg transition ${
                activeTab === tab.name
                  ? "bg-[#23263A] text-white"
                  : "hover:bg-[#23263A] text-gray-400"
              }`}
              onClick={() => {
                if (tab.name === "Disconnect") {
                  setDisconnectOpen(true);
                } else {
                  setActiveTab(tab.name);
                }
              }}
            >
              <tab.icon className="w-6 h-6" />
              {tab.name}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10 flex flex-col gap-8">
        {activeTab === "Options" && (
          <div className="max-w-3xl w-full mx-auto">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <Image
                  src="/img/icon.png"
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-2xl border-4 border-[#9b87f5] bg-[#23263A]"
                />
                <button className="absolute bottom-0 right-0 bg-[#23263A] border-2 border-white rounded-full p-1">
                  <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2"><path d="M4 13.5V16h2.5l7.37-7.37-2.5-2.5L4 13.5z"/><path d="M14.5 6.5l-2.5-2.5"/></svg>
                </button>
              </div>
              <div>
                <div className="font-minecraft text-2xl flex items-center gap-2">
                  {name}
                  <span className="bg-[#23263A] text-xs px-2 py-1 rounded font-bold">8</span>
                </div>
                <div className="text-gray-400 text-sm">Joined May 9th, 2025</div>
                {/* <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">Streamer Mode</span>
                  <input type="checkbox" className="accent-pixel-purple" />
                </div> */}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <PixelInput
                  label="Enter name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={!editName}
                  className="mb-1 py-2"
                />
                <PixelButton variant="small" onClick={() => setEditName(!editName)} className={`h-8 py-1 mb-2 ${editName ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"}`}>
                  {editName ? "Save" : "Edit"}
                </PixelButton>
              </div>
              <div className="flex items-end gap-2">
                <PixelInput
                  label="Enter email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={!editEmail}
                  className="mb-1 py-2"
                />
                <PixelButton variant="small" onClick={() => setEditEmail(!editEmail)} className={`h-8 py-1 mb-2 ${editEmail ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"}`}>
                  {editEmail ? "Save" : "Edit"}
                </PixelButton>
              </div>
              <div>
                <PixelInput
                  label="Connect Account"
                  value="6C2JxnBq...x5E2Njc"
                  disabled
                  className="mb-1 py-2"
                />
              </div>
              <div>
                <PixelInput
                  label="Referred by"
                  value="scorp"
                  disabled
                  className="mb-1 py-2"
                />
              </div>
              <div className="mt-6">
                <div className="font-minecraft text-lg mb-2">Connected Apps</div>
                <div className="pixel-border bg-[#23263A] p-4 flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#5865F2] text-white px-2 py-1 rounded font-minecraft text-xs">Connected</span>
                    <Image src="/social-logos/discord.png" alt="Discord" width={22} height={22} />
                    <span className="font-minecraft text-sm mt-1">Discord</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "Statistics" && (
          <div className="max-w-3xl mx-auto w-full">
            <div className="pixel-border bg-[#23263A] p-6 mb-8">
              <div className="font-minecraft text-lg mb-2">Statistics</div>
              <div className="flex items-center gap-4">
                <div className="text-green-400 font-minecraft text-2xl">+ 0.456</div>
                <span className="text-xs text-gray-400">Net Profit</span>
              </div>
            </div>
            <div className="pixel-border bg-[#23263A] p-6 mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="font-minecraft text-md">Wager Stats</div>
                <select className="bg-[#181B23] text-white font-minecraft px-4 py-2 pixel-border">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>All Time</option>
                </select>
              </div>
              {/* Chart placeholder */}
              <div className="h-48 w-full bg-[#181B23] rounded-lg flex items-center justify-center text-gray-500 font-minecraft">
                [Chart]
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="pixel-border bg-[#23263A] p-4 flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1">Total Wagered (SOL)</span>
                <span className="font-minecraft text-lg">7.124</span>
              </div>
              <div className="pixel-border bg-[#23263A] p-4 flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1">Profit</span>
                <span className="font-minecraft text-lg">0.456</span>
              </div>
              <div className="pixel-border bg-[#23263A] p-4 flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1">Luckiest Win</span>
                <span className="font-minecraft text-lg">0.003</span>
                <span className="bg-green-700 text-white px-2 py-1 rounded font-minecraft text-xs mt-1">50.00%</span>
              </div>
              <div className="pixel-border bg-[#23263A] p-4 flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1">Biggest Win</span>
                <span className="font-minecraft text-lg">0.48</span>
                <span className="bg-purple-700 text-white px-2 py-1 rounded font-minecraft text-xs mt-1">1.90X</span>
              </div>
            </div>
          </div>
        )}
        {activeTab === "Transactions" && (
          <div className="max-w-3xl mx-auto w-full">
            <div className="pixel-border bg-[#23263A] p-6 mb-8">
              <div className="font-minecraft text-lg mb-2">Transactions</div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-minecraft text-md">Transaction History</div>
                <select className="bg-[#181B23] text-white font-minecraft px-4 py-2 pixel-border">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>All Time</option>
                </select>
              </div>
              {/* Transaction list placeholder */}
              <div className="h-48 w-full bg-[#181B23] rounded-lg flex items-center justify-center text-gray-500 font-minecraft">
                [Transaction List]
              </div>
            </div>
          </div>
        )}
        
        {/* You can add more tab content for Transactions, Muted Users, Disconnect */}
      </main>
      <PixelModal open={disconnectOpen} onClose={() => setDisconnectOpen(false)}>
        <div className="font-minecraft text-xl mb-4 text-center">Disconnect Wallet</div>
        <div className="mb-4 text-center font-minecraft text-sm">
          Are you sure you want to disconnect your wallet or change to a different wallet?
        </div>
        <div className="flex gap-4">
          <PixelButton
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-minecraft"
            onClick={async () => {
              await disconnect();
              setDisconnectOpen(false);
            }}
          >
            Disconnect
          </PixelButton>
          <PixelButton
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-minecraft"
            onClick={() => {
              // Add your change wallet logic here
              setDisconnectOpen(false);
            }}
          >
            Change Wallet
          </PixelButton>
        </div>
      </PixelModal>
    </div>
  );
}
