import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HistoryEntry } from '../../hooks/useRouletteSession';
import { FACES } from '../../engine/constants';
import { getColor } from '../../utils/colors';

interface PredictionBoxProps {
  history: HistoryEntry[];
  onToggleBetConfirmation: () => void;
}

export const PredictionBox: React.FC<PredictionBoxProps> = ({ history, onToggleBetConfirmation }) => {
  const latestEntry = history.length > 0 ? history[history.length - 1] : null;
  const prediction = latestEntry?.prediction;
  
  if (!latestEntry) {
    return (
      <div className="shrink-0 flex justify-center">
        <div className="flex items-center justify-center py-2.5 px-6 bg-[#1e1b29]/50 backdrop-blur-md rounded-full border border-white/5 shadow-inner">
          <span className="text-white/30 font-bold tracking-[0.3em] text-[10px]">
            WAITING FOR FIRST SPIN
          </span>
        </div>
      </div>
    );
  }

  if (!prediction || prediction.targetNumbers.length === 0) {
    return (
      <div className="shrink-0 flex justify-center">
        <div className="flex items-center justify-center py-2.5 px-6 bg-[#1e1b29]/50 backdrop-blur-md rounded-full border border-white/5 shadow-inner">
          <span className="text-white/30 font-bold tracking-[0.3em] text-[10px]">
            NO PREDICTION
          </span>
        </div>
      </div>
    );
  }

  const isConfirmed = latestEntry.isBetConfirmed;

  return (
    <div className="shrink-0 flex justify-center">
      <motion.div 
        key={prediction.targetNumbers.join(',')}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={onToggleBetConfirmation}
        className={`flex items-center justify-center p-1 md:p-1.5 rounded-full transition-all transform-gpu duration-300 cursor-pointer select-none
          ${isConfirmed 
            ? 'bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.15)] border border-green-500/30' 
            : 'bg-transparent hover:bg-white/5 border border-transparent'
          }
        `}
      >
        <div className="flex items-center gap-1.5 md:gap-2 flex-wrap justify-center">
            {/* Racetrack Neighbors */}
            {prediction.racetrackNeighbors && prediction.racetrackNeighbors.length > 0 && (
              <div className="flex items-center gap-1.5 md:gap-3 bg-[#1e1b29] px-2.5 py-1 md:px-4 md:py-2 rounded-full border border-white/5 shadow-lg">
                <span className="text-[9px] md:text-[11px] text-white/50 uppercase tracking-widest font-bold">RT</span>
                <div className="flex gap-1 md:gap-1.5">
                  {prediction.racetrackNeighbors.map(num => (
                    <span key={`rt-${num}`} className={`w-5 h-5 md:w-7 md:h-7 flex items-center justify-center rounded-full font-bold text-[10px] md:text-[13px] ${getColor(num)}`}>
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Grid Neighbors */}
            {prediction.gridNeighbors && prediction.gridNeighbors.length > 0 && (
              <div className="flex items-center gap-1.5 md:gap-3 bg-[#1e1b29] px-2.5 py-1 md:px-4 md:py-2 rounded-full border border-white/5 shadow-lg">
                <span className="text-[9px] md:text-[11px] text-white/50 uppercase tracking-widest font-bold">Grid</span>
                <div className="flex gap-1 md:gap-1.5">
                  {prediction.gridNeighbors.map(num => (
                    <span key={`grid-${num}`} className={`w-5 h-5 md:w-7 md:h-7 flex items-center justify-center rounded-full font-bold text-[10px] md:text-[13px] ${getColor(num)}`}>
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Face Group */}
            {prediction.matchedFaces && prediction.matchedFaces.map(faceId => {
              const faceDef = FACES.find(f => f.id === faceId);
              if (!faceDef) return null;
              return (
                <div key={faceId} className={`flex items-center gap-1.5 md:gap-3 bg-[#1e1b29] px-2.5 py-1 md:px-4 md:py-2 rounded-full border border-white/5 shadow-lg`}>
                  <span className={`text-[9px] md:text-[11px] uppercase tracking-widest font-bold text-white/50`}>Face</span>
                  <span className={`px-1.5 py-0.5 md:px-2 md:py-0.5 rounded text-[10px] md:text-[12px] font-bold ${faceDef.bg} ${faceDef.color} border ${faceDef.border}`}>
                    {faceDef.id}
                  </span>
                </div>
              );
            })}
          </div>
      </motion.div>
    </div>
  );
};
