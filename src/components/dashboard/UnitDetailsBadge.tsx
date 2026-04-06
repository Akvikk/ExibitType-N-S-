import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Coins } from 'lucide-react';
import { HistoryEntry } from '../../hooks/useRouletteSession';
import { calculateResult } from '../../engine/calculator';

interface UnitDetailsBadgeProps {
  entry: HistoryEntry;
  targetSpin: number;
}

export const UnitDetailsBadge: React.FC<UnitDetailsBadgeProps> = ({ entry, targetSpin }) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const triggerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ bottom: 0, right: 0 });

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        bottom: window.innerHeight - rect.top + 12,
        right: window.innerWidth - rect.right
      });
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    updateCoords();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  useEffect(() => {
    const handleScroll = () => setIsHovered(false);
    if (isHovered) {
      window.addEventListener('scroll', handleScroll, true);
    }
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isHovered]);

  const result = calculateResult(entry.prediction, targetSpin);
  
  if (result.cost === 0) return null;

  const colorClass = result.net > 0 ? 'text-cyan-400' : 'text-rose-500';
  const glowClass = result.net > 0 ? 'shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'shadow-[0_0_15px_rgba(244,63,94,0.4)]';
  const bgClass = result.net > 0 ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-rose-500/10 border-rose-500/30';

  return (
    <div 
      ref={triggerRef}
      className="relative flex items-center justify-center ml-auto pl-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`result-badge flex items-center justify-center w-7 h-7 rounded-full border-[0.5px] cursor-help transition-colors ${bgClass} ${isHovered ? glowClass : ''}`}
      >
        <Coins size={14} className={colorClass} />
      </motion.div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ bottom: coords.bottom, right: coords.right }}
              className="fixed w-48 bg-[#1c1c1e]/90 backdrop-blur-[25px] border-[0.5px] border-white/10 rounded-xl p-3 shadow-2xl z-[9999] pointer-events-none origin-bottom-right"
            >
              <div className="flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-[#8e8e93] font-sans font-medium tracking-wide">Total Bet</span>
                  <span className="text-white font-semibold">{result.cost}U</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8e8e93] font-sans font-medium tracking-wide">Gross Win</span>
                  <span className="text-white font-semibold">{result.gross}U</span>
                </div>
                
                <div className="h-[1px] w-full bg-white/10 my-1"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[#8e8e93] font-sans font-medium tracking-wide">Net Yield</span>
                  <span className={`font-bold text-sm ${colorClass}`}>
                    {result.net > 0 ? '+' : ''}{result.net}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
