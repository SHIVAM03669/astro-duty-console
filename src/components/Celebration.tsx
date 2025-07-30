import { useEffect, useState } from "react";
import { CheckCircle, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CelebrationProps {
  show: boolean;
  onComplete: () => void;
  taskTitle?: string;
}

export const Celebration = ({ show, onComplete, taskTitle }: CelebrationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show && !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-500",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />
      
      {/* Main celebration content */}
      <div 
        className={cn(
          "relative glass-panel rounded-2xl p-8 mx-4 max-w-md w-full text-center transform transition-all duration-700",
          isVisible 
            ? "opacity-100 scale-100 rotate-0" 
            : "opacity-0 scale-75 rotate-12"
        )}
      >
        {/* Success icon with glow */}
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping">
            <CheckCircle className="h-16 w-16 mx-auto text-neon-green opacity-75" />
          </div>
          <CheckCircle className="h-16 w-16 mx-auto text-neon-green neon-glow-green relative z-10" />
        </div>

        {/* Text content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-neon-green">
            MISSION COMPLETE!
          </h2>
          {taskTitle && (
            <p className="text-foreground font-medium">
              "{taskTitle}"
            </p>
          )}
          <p className="text-muted-foreground text-sm">
            Another step towards total mission success
          </p>
        </div>

        {/* Stats update animation */}
        <div className="mt-6 flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1 text-primary">
            <Zap className="h-3 w-3" />
            XP +10
          </div>
          <div className="flex items-center gap-1 text-neon-purple">
            <Star className="h-3 w-3" />
            Progress++
          </div>
        </div>
      </div>
    </div>
  );
};