import React from 'react';

interface PredictionBoxProps {
  prediction: string | null;
}

export const PredictionBox: React.FC<PredictionBoxProps> = ({ prediction }) => {
  return (
    <div className="shrink-0">
      {prediction ? (
        <div className="flex flex-col items-center justify-center py-4 px-4 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
          <span className="text-white/50 text-[10px] font-bold tracking-widest mb-1">TARGET PREDICTION</span>
          <div className="text-white font-mono text-2xl tracking-[0.2em] font-bold leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            {prediction}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4 px-4 bg-black/20 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner">
          <span className="text-white/40 font-bold tracking-[0.3em] text-xs">
            AWAITING DATA...
          </span>
        </div>
      )}
    </div>
  );
};
