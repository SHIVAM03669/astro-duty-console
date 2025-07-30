import { useState, useEffect } from "react";
import { Trophy, Star, Crown, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RankData {
  currentRank: string;
  currentLevel: number;
  experience: number;
  experienceToNext: number;
  totalCompleted: number;
}

const RANKS = [
  { name: "Bronze", icon: Trophy, color: "text-amber-600", bgColor: "bg-amber-600/20", borderColor: "border-amber-600/50", minTasks: 0 },
  { name: "Silver", icon: Star, color: "text-gray-400", bgColor: "bg-gray-400/20", borderColor: "border-gray-400/50", minTasks: 5 },
  { name: "Gold", icon: Crown, color: "text-yellow-500", bgColor: "bg-yellow-500/20", borderColor: "border-yellow-500/50", minTasks: 15 },
  { name: "Platinum", icon: Gem, color: "text-cyan-400", bgColor: "bg-cyan-400/20", borderColor: "border-cyan-400/50", minTasks: 30 },
  { name: "Diamond", icon: Gem, color: "text-purple-400", bgColor: "bg-purple-400/20", borderColor: "border-purple-400/50", minTasks: 50 }
];

const REWARDS = {
  Bronze: ["Basic Task Tracker", "Simple Statistics"],
  Silver: ["Advanced Analytics", "Priority Filtering", "Search Function"],
  Gold: ["Custom Categories", "Export Data", "Progress Charts"],
  Platinum: ["Team Collaboration", "Advanced Reports", "API Access"],
  Diamond: ["Unlimited Features", "Priority Support", "Custom Themes", "Advanced AI Assistant"]
};

export const RankSystem = ({ completedCount }: { completedCount: number }) => {
  const [rankData, setRankData] = useState<RankData>({
    currentRank: "Bronze",
    currentLevel: 1,
    experience: 0,
    experienceToNext: 5,
    totalCompleted: 0
  });
  const [showRewards, setShowRewards] = useState(false);
  const [showRankDetails, setShowRankDetails] = useState(false);
  const [lastCompleted, setLastCompleted] = useState(0);

  useEffect(() => {
    if (completedCount > lastCompleted) {
      setLastCompleted(completedCount);
      updateRank(completedCount);
    }
  }, [completedCount]);

  // Close details panel when clicking outside
  useEffect(() => {
    if (!showRankDetails) return;
    const handleClick = (e: MouseEvent) => {
      const details = document.getElementById("rank-details-panel");
      if (details && !details.contains(e.target as Node)) {
        setShowRankDetails(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showRankDetails]);

  const updateRank = (completed: number) => {
    let currentRank = "Bronze";
    let currentLevel = 1;
    let experience = completed;
    let experienceToNext = 5;

    // Calculate current rank based on completed tasks
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (completed >= RANKS[i].minTasks) {
        currentRank = RANKS[i].name;
        currentLevel = Math.floor(completed / 5) + 1;
        experience = completed % 5;
        experienceToNext = 5;
        break;
      }
    }

    setRankData({
      currentRank,
      currentLevel,
      experience,
      experienceToNext,
      totalCompleted: completed
    });

    // Show rewards when rank changes
    if (currentRank !== rankData.currentRank) {
      setShowRewards(true);
      setTimeout(() => setShowRewards(false), 3000);
    }
  };

  const currentRankInfo = RANKS.find(rank => rank.name === rankData.currentRank);
  const progressPercentage = (rankData.experience / rankData.experienceToNext) * 100;
  const nextRank = RANKS.find(rank => rank.name !== rankData.currentRank && rank.minTasks > rankData.totalCompleted);

  return (
    <div className="fixed top-6 right-6 z-50 group">
      {/* Rank Circle */}
      <div className="relative">
        <div
          className="w-20 h-20 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center relative overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer"
          onClick={() => setShowRankDetails((v) => !v)}
        >
          {/* Progress Circle */}
          <svg className="w-20 h-20 transform -rotate-90 absolute inset-0">
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-muted-foreground/20"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${2 * Math.PI * 32 * (1 - progressPercentage / 100)}`}
              className={cn(
                "transition-all duration-500 ease-out",
                currentRankInfo?.color
              )}
              style={{
                filter: `drop-shadow(0 0 8px ${currentRankInfo?.color.replace('text-', 'hsl(').replace('-', ' ')})`
              }}
            />
          </svg>
          {/* Rank Icon */}
          <div className="relative z-10">
            {currentRankInfo?.icon && (
              <currentRankInfo.icon 
                className={cn("w-8 h-8", currentRankInfo.color)}
              />
            )}
          </div>
        </div>
        {/* Level Badge */}
        <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          {rankData.currentLevel}
        </div>
      </div>
      {/* Rank Details Panel */}
      {showRankDetails && (
        <div id="rank-details-panel" className="absolute top-24 right-0 w-80 glass-panel rounded-xl p-6 z-50 animate-fade-in shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <div className={cn("text-lg font-bold", currentRankInfo?.color)}>
              {rankData.currentRank} <span className="text-xs text-muted-foreground">(Level {rankData.currentLevel})</span>
            </div>
            <button
              className="text-muted-foreground hover:text-primary text-xl font-bold px-2"
              onClick={() => setShowRankDetails(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="mb-2 text-sm text-muted-foreground">
            {rankData.experience}/{rankData.experienceToNext} XP to next level
          </div>
          {nextRank && (
            <div className="mb-4 text-xs text-muted-foreground">
              Next Rank: <span className="font-semibold">{nextRank.name}</span> ({nextRank.minTasks - rankData.totalCompleted} more tasks)
            </div>
          )}
          <div className="mb-2 font-semibold">Rewards:</div>
          <ul className="mb-4 list-disc list-inside text-xs text-muted-foreground">
            {REWARDS[rankData.currentRank as keyof typeof REWARDS]?.map((reward, i) => (
              <li key={i}>{reward}</li>
            ))}
          </ul>
          <div className="mb-2 font-semibold">All Ranks:</div>
          <div className="flex flex-col gap-2">
            {RANKS.map((rank) => (
              <div key={rank.name} className={cn(
                "flex items-center gap-2 px-2 py-1 rounded",
                rank.name === rankData.currentRank ? "bg-primary/10" : ""
              )}>
                <rank.icon className={cn("w-5 h-5", rank.color)} />
                <span className={cn("font-bold", rank.color)}>{rank.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{rank.minTasks}+</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Rank Info Tooltip (on hover, if not open) */}
      {!showRankDetails && (
        <div className="absolute top-24 right-0 w-64 glass-panel rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
          <div className="text-center space-y-2">
            <div className={cn("text-lg font-bold", currentRankInfo?.color)}>
              {rankData.currentRank}
            </div>
            <div className="text-sm text-muted-foreground">
              Level {rankData.currentLevel}
            </div>
            <div className="text-xs text-muted-foreground">
              {rankData.experience}/{rankData.experienceToNext} XP
            </div>
            {nextRank && (
              <div className="text-xs text-muted-foreground">
                Next: {nextRank.name} ({nextRank.minTasks - rankData.totalCompleted} more tasks)
              </div>
            )}
          </div>
        </div>
      )}
      {/* Rewards Modal */}
      {showRewards && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-panel rounded-xl p-8 max-w-md mx-4 text-center space-y-6">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold">Rank Up!</h3>
            <div className={cn("text-2xl font-bold mb-2", currentRankInfo?.color)}>
              {rankData.currentRank}
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              You've unlocked new features!
            </div>
            <div className="space-y-2">
              {REWARDS[rankData.currentRank as keyof typeof REWARDS]?.map((reward, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  {reward}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowRewards(false)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 