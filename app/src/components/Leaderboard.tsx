
import React, { useState, useEffect } from 'react';
import LeaderboardItem, { Leader } from './LeaderboardItem';

// Mock data
const mockLeaders: Leader[] = [
  {
    id: "leader1",
    avatar: "/placeholder.svg",
    handle: "PixelKing",
    roi: 124.5,
    winStreak: 8,
    totalWon: 432.15,
    followers: 1243,
    recentBets: [
      { id: "bet1", match: "Pixel Raiders vs Bit Breakers", result: 'win', amount: 2, odds: 2.1 },
      { id: "bet2", match: "Neon Knights vs Digital Dragons", result: 'win', amount: 5, odds: 1.8 },
      { id: "bet3", match: "Block Bears vs Chain Chasers", result: 'win', amount: 3, odds: 2.5 },
      { id: "bet4", match: "Solana Sharks vs Wallet Warriors", result: 'loss', amount: 4, odds: 1.9 },
      { id: "bet5", match: "Token Tigers vs Crypto Cats", result: 'win', amount: 10, odds: 1.5 }
    ]
  },
  {
    id: "leader2",
    avatar: "/placeholder.svg",
    handle: "CryptoQueen",
    roi: 98.7,
    winStreak: 4,
    totalWon: 387.22,
    followers: 987,
    recentBets: [
      { id: "bet6", match: "Pixel Raiders vs Bit Breakers", result: 'loss', amount: 3, odds: 1.7 },
      { id: "bet7", match: "Neon Knights vs Digital Dragons", result: 'win', amount: 7, odds: 2.2 },
      { id: "bet8", match: "Block Bears vs Chain Chasers", result: 'win', amount: 5, odds: 1.6 },
      { id: "bet9", match: "Solana Sharks vs Wallet Warriors", result: 'win', amount: 10, odds: 2.1 },
      { id: "bet10", match: "Token Tigers vs Crypto Cats", result: 'win', amount: 8, odds: 1.9 }
    ]
  },
  {
    id: "leader3",
    avatar: "/placeholder.svg",
    handle: "SolBettor",
    roi: 76.3,
    winStreak: 6,
    totalWon: 256.89,
    followers: 654,
    recentBets: [
      { id: "bet11", match: "Pixel Raiders vs Bit Breakers", result: 'win', amount: 4, odds: 1.9 },
      { id: "bet12", match: "Neon Knights vs Digital Dragons", result: 'win', amount: 6, odds: 2.0 },
      { id: "bet13", match: "Block Bears vs Chain Chasers", result: 'win', amount: 3, odds: 2.2 },
      { id: "bet14", match: "Solana Sharks vs Wallet Warriors", result: 'loss', amount: 5, odds: 1.8 },
      { id: "bet15", match: "Token Tigers vs Crypto Cats", result: 'win', amount: 7, odds: 1.7 }
    ]
  },
  {
    id: "leader4",
    avatar: "/placeholder.svg",
    handle: "NeonBettor",
    roi: 65.2,
    winStreak: 3,
    totalWon: 189.45,
    followers: 423,
    recentBets: [
      { id: "bet16", match: "Pixel Raiders vs Bit Breakers", result: 'loss', amount: 2, odds: 2.1 },
      { id: "bet17", match: "Neon Knights vs Digital Dragons", result: 'win', amount: 5, odds: 1.6 },
      { id: "bet18", match: "Block Bears vs Chain Chasers", result: 'win', amount: 8, odds: 1.9 },
      { id: "bet19", match: "Solana Sharks vs Wallet Warriors", result: 'win', amount: 4, odds: 2.4 },
      { id: "bet20", match: "Token Tigers vs Crypto Cats", result: 'loss', amount: 6, odds: 1.8 }
    ]
  },
  {
    id: "leader5",
    avatar: "/placeholder.svg",
    handle: "ChainChamp",
    roi: 59.8,
    winStreak: 2,
    totalWon: 142.76,
    followers: 321,
    recentBets: [
      { id: "bet21", match: "Pixel Raiders vs Bit Breakers", result: 'win', amount: 3, odds: 2.2 },
      { id: "bet22", match: "Neon Knights vs Digital Dragons", result: 'loss', amount: 4, odds: 1.7 },
      { id: "bet23", match: "Block Bears vs Chain Chasers", result: 'win', amount: 6, odds: 1.9 },
      { id: "bet24", match: "Solana Sharks vs Wallet Warriors", result: 'loss', amount: 5, odds: 2.0 },
      { id: "bet25", match: "Token Tigers vs Crypto Cats", result: 'win', amount: 7, odds: 1.8 }
    ]
  },
];

interface LeaderboardProps {
  onFollow: (leader: Leader) => void;
}

const sortOptions = [
  { value: 'roi', label: 'ROI' },
  { value: 'winStreak', label: 'Win Streak' },
  { value: 'totalWon', label: 'Total Won' }
];

const Leaderboard: React.FC<LeaderboardProps> = ({ onFollow }) => {
  const [leaders, setLeaders] = useState<Leader[]>(mockLeaders);
  const [sortBy, setSortBy] = useState('roi');
  const [following, setFollowing] = useState<string[]>([]);
  
  // Sort leaders based on selected option
  useEffect(() => {
    const sortedLeaders = [...mockLeaders].sort((a, b) => {
      if (sortBy === 'roi') return b.roi - a.roi;
      if (sortBy === 'winStreak') return b.winStreak - a.winStreak;
      return b.totalWon - a.totalWon;
    });
    
    setLeaders(sortedLeaders);
  }, [sortBy]);

  const handleFollow = (leader: Leader) => {
    if (following.includes(leader.id)) {
      setFollowing(following.filter(id => id !== leader.id));
    } else {
      setFollowing([...following, leader.id]);
    }
    onFollow(leader);
  };

  return (
    <div className="pixel-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-pixel text-white">FOMO Leaderboard</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-pixel-gray-light">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black bg-opacity-30 border border-gray-700 text-white text-xs font-pixel py-1 px-2 appearance-none cursor-pointer pr-6"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-pixel-gray-light">
              ▼
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-1">
        {leaders.map((leader, index) => (
          <LeaderboardItem 
            key={leader.id}
            leader={leader}
            rank={index + 1}
            onFollow={handleFollow}
            isFollowing={following.includes(leader.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;