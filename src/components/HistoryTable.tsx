import React, { useRef, useEffect } from 'react';
import { getColor } from '../utils/colors';
import { getSection } from '../utils/sections';

interface HistoryEntry {
  id: number;
  spin: number;
  prediction: string;
}

interface HistoryTableProps {
  history: HistoryEntry[];
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ history }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [history]);

  return (
    <div className="flex-1 flex flex-col bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden min-h-0 shadow-inner">
      <div className="grid grid-cols-4 px-4 py-3 bg-white/5 border-b border-white/10 text-[10px] font-bold tracking-widest text-white/50 shrink-0">
        <div>#</div>
        <div>SPIN</div>
        <div>SECTION</div>
        <div>PREDICTION</div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 min-h-0">
        {history.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/40 text-xs italic">
            No spins recorded yet.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {history.map((entry, idx) => (
              <div key={entry.id} className="grid grid-cols-4 px-3 py-2 bg-white/5 rounded-xl items-center border border-white/5 hover:bg-white/10 transition-all backdrop-blur-sm">
                <div className="text-white/60 font-mono text-xs">{idx + 1}</div>
                <div className="flex items-center">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs shadow-sm border border-white/20 ${getColor(entry.spin)}`}>
                    {entry.spin}
                  </span>
                </div>
                <div className="text-white/70 font-mono text-[10px] tracking-wider uppercase">
                  {getSection(entry.spin)}
                </div>
                <div className="text-white/90 font-mono text-xs tracking-wider font-medium">
                  {entry.prediction}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
