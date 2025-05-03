
import React, { useState } from 'react';
import PixelButton from './PixelButton';

export interface Bet {
  id: string;
  match: string;
  result: 'win' | 'loss';
  amount: number;
  odds: number;
}

export interface Leader {
  id: string;
  avatar: string;
  handle: string;
  roi: number; // percentage
  winStreak: number;
  totalWon: number; // in SOL
  followers: number;
  recentBets: Bet[];
}

interface LeaderboardItemProps {
  leader: Leader;
  rank: number;
  onFollow: (leader: Leader) => void;
  isFollowing: boolean;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ leader, rank, onFollow, isFollowing }) => {
  const [showBets, setShowBets] = useState(false);
  
  return (
    <div 
      className="pixel-card mb-2 relative group"
      onMouseEnter={() => setShowBets(true)}
      onMouseLeave={() => setShowBets(false)}
    >
      <div className="flex items-center gap-3">
        <div className="w-6 font-pixel text-pixel-purple text-center">
          #{rank}
        </div>
        
        <div className="bg-black bg-opacity-30 w-10 h-10 border border-gray-700">
          <img 
            src={leader.avatar} 
            alt={leader.handle}
            className="w-full h-full object-cover pixelated"
          />
        </div>
        
        <div className="flex-1">
          <div className="text-sm font-pixel text-white">{leader.handle}</div>
          <div className="flex gap-4 text-xs text-pixel-gray-light">
            <div>ROI: <span className="text-green-400">{leader.roi}%</span></div>
            <div>Streak: <span className="text-pixel-purple">{leader.winStreak}W</span></div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm font-pixel text-white">{leader.totalWon.toFixed(2)} SOL</div>
          <div className="text-xs text-pixel-gray-light">{leader.followers} followers</div>
        </div>
        
        <PixelButton 
          variant="small" 
          className={isFollowing ? "" : "blink"}
          onClick={() => onFollow(leader)}
        >
          {isFollowing ? "Following" : "Follow"}
        </PixelButton>
      </div>
      
      {/* Recent bets popup */}
      {showBets && (
        <div className="absolute -right-48 top-0 z-20 w-44 pixel-card">
          <div className="text-xs font-pixel text-white mb-2">Recent Bets</div>
          <div className="space-y-2">
            {leader.recentBets.map(bet => (
              <div key={bet.id} className="flex justify-between text-xs">
                <div className="truncate flex-1">{bet.match}</div>
                <div 
                  className={`ml-2 ${bet.result === 'win' ? 'text-green-400' : 'text-red-400'}`}
                >
                  {bet.result === 'win' ? 'W' : 'L'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardItem;