import React, { useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface WinLossBarProps {
  history: any[];
}

export const WinLossBar: React.FC<WinLossBarProps> = ({ history }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const sequence = useMemo(() => {
    const seq: ('W' | 'L')[] = [];
    for (let i = 1; i < history.length; i++) {
      const prevPrediction = history[i - 1].prediction;
      const currentSpin = history[i].spin;

      if (prevPrediction && prevPrediction.targetNumbers && prevPrediction.targetNumbers.length > 0) {
        const isWin = prevPrediction.targetNumbers.includes(currentSpin);
        seq.push(isWin ? 'W' : 'L');
      }
    }
    return seq;
  }, [history]);

  // Auto-scroll to right when new items are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [sequence]);

  if (sequence.length === 0) return null;

  const wins = sequence.filter(s => s === 'W').length;
  const total = sequence.length;
  const winRate = Math.round((wins / total) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 shrink-0 shadow-lg"
    >
      <div className="flex flex-col items-center justify-center px-3 border-r border-white/10 shrink-0 min-w-[60px]">
        <span className="text-[10px] text-white/50 font-bold tracking-widest uppercase mb-0.5">Form</span>
        <span className={`text-sm font-bold ${winRate >= 50 ? 'text-cyan-400' : 'text-rose-500'}`}>
          {winRate}%
        </span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto flex-1 py-1 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .scroll-smooth::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {sequence.map((result, idx) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            key={idx}
            className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm shrink-0 transition-all ${
              result === 'W' 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]' 
                : 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
            }`}
          >
            {result}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
