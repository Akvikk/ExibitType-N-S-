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
      <div className="shrink-0">
        <div className="flex flex-col items-center justify-center py-3 px-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-inner min-h-[60px]">
          <span className="text-white/40 font-bold tracking-[0.3em] text-[10px]">
            WAITING FOR FIRST SPIN
          </span>
        </div>
      </div>
    );
  }

  if (!prediction || prediction.targetNumbers.length === 0) {
    return (
      <div className="shrink-0">
        <div className="flex flex-col items-center justify-center py-3 px-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-inner min-h-[60px]">
          <span className="text-white/40 font-bold tracking-[0.3em] text-[10px]">
            NO PREDICTION
          </span>
        </div>
      </div>
    );
  }

  const isConfirmed = latestEntry.isBetConfirmed;

  return (
    <div className="shrink-0">
      <motion.div 
        key={prediction.targetNumbers.join(',')}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={onToggleBetConfirmation}
        className={`flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all transform-gpu duration-300 min-h-[60px] cursor-pointer select-none
          ${isConfirmed 
            ? 'bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
            : 'bg-transparent hover:bg-white/5'
          }
        `}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Racetrack Neighbors */}
            {prediction.racetrackNeighbors && prediction.racetrackNeighbors.length > 0 && (
              <div className="flex items-center gap-2 bg-[#1e1b29] px-3 py-1.5 rounded-2xl border border-white/5 shadow-lg">
                <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Racetrack</span>
                <div className="flex gap-1">
                  {prediction.racetrackNeighbors.map(num => (
                    <span key={`rt-${num}`} className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-[11px] bg-black text-white shadow-inner`}>
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Grid Neighbors */}
            {prediction.gridNeighbors && prediction.gridNeighbors.length > 0 && (
              <div className="flex items-center gap-2 bg-[#1e1b29] px-3 py-1.5 rounded-2xl border border-white/5 shadow-lg">
                <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Grid</span>
                <div className="flex gap-1">
                  {prediction.gridNeighbors.map(num => (
                    <span key={`grid-${num}`} className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-[11px] bg-black text-white shadow-inner`}>
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
                <div key={faceId} className={`flex items-center gap-2 bg-[#1e1b29] px-3 py-1.5 rounded-2xl border border-white/5 shadow-lg`}>
                  <span className={`text-[10px] uppercase tracking-widest font-bold text-white/50`}>Face</span>
                  <span className={`font-bold text-[12px] text-white`}>{faceDef.id}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-4 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
          {isConfirmed ? 'Bet Confirmed' : 'Click to Confirm Bet'} ({prediction.targetNumbers.length} units)
        </div>
      </motion.div>
    </div>
  );
};
