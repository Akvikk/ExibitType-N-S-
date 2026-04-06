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
        className={`flex flex-col items-center justify-center py-3 px-4 backdrop-blur-md rounded-xl border shadow-inner transition-all transform-gpu duration-300 min-h-[60px] cursor-pointer select-none
          ${isConfirmed 
            ? 'bg-green-500/20 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
            : 'bg-white/5 border-white/10 hover:bg-white/10'
          }
        `}
      >
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {prediction.matchedFaces.map(faceId => {
            const faceDef = FACES.find(f => f.id === faceId);
            if (!faceDef) return null;
            return (
              <span key={faceId} className={`px-2 py-1 rounded text-xs font-bold ${faceDef.bg} ${faceDef.color} border ${faceDef.border}`}>
                {faceDef.id}
              </span>
            );
          })}
          
          {prediction.matchedFaces.length > 0 && prediction.residuals.length > 0 && (
            <span className="text-white/50 font-bold">+</span>
          )}

          {prediction.residuals.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center justify-center">
              {prediction.residuals.map(num => (
                <span 
                  key={num} 
                  className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-[11px] shadow-sm border border-white/20 ${getColor(num)}`}
                >
                  {num}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-2 text-[9px] font-bold tracking-widest text-white/30 uppercase">
          {isConfirmed ? 'Bet Confirmed' : 'Click to Confirm Bet'} ({prediction.targetNumbers.length} units)
        </div>
      </motion.div>
    </div>
  );
};
