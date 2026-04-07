import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getColor } from '../../utils/colors';
import { getSection } from '../../utils/sections';
import { UnitDetailsBadge } from './UnitDetailsBadge';
import { HistoryEntry } from '../../hooks/useRouletteSession';
import { FACES } from '../../engine/constants';
import { Prediction } from '../../engine/types';

interface HistoryTableProps {
  history: HistoryEntry[];
  showFaceColumn?: boolean;
  showSectionColumn?: boolean;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ 
  history,
  showFaceColumn = true,
  showSectionColumn = true
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [history]);

  const renderPrediction = (prediction: Prediction | null) => {
    if (!prediction || prediction.targetNumbers.length === 0) {
      return <span className="text-white/30">WAITING FOR SIGNAL</span>;
    }

    return (
      <div className="flex flex-wrap items-center gap-2 py-1">
        {prediction.matchedFaces.map(faceId => {
          const faceDef = FACES.find(f => f.id === faceId);
          if (!faceDef) return null;
          return (
            <span key={faceId} className={`px-2 py-0.5 rounded text-[11px] font-bold ${faceDef.bg} ${faceDef.color} border ${faceDef.border}`}>
              {faceDef.id}
            </span>
          );
        })}
        
        {prediction.matchedFaces.length > 0 && prediction.residuals.length > 0 && (
          <span className="text-white/50 font-bold text-xs">+</span>
        )}

        {prediction.residuals.length > 0 && (
          <div className="flex flex-wrap gap-1 items-center">
            {prediction.residuals.map(num => (
              <span 
                key={num} 
                className={`w-5 h-5 flex items-center justify-center rounded-full font-bold text-[9px] shadow-inner ${getColor(num)}`}
              >
                {num}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getFaceForNumber = (num: number) => {
    const face = FACES.find(f => f.numbers.includes(num));
    if (!face) return null;
    return (
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${face.bg} ${face.color} border ${face.border}`}>
        {face.id}
      </span>
    );
  };

  // Build dynamic grid columns based on toggles
  let gridCols = '40px 60px';
  if (showFaceColumn) gridCols += ' 40px';
  if (showSectionColumn) gridCols += ' 100px';
  gridCols += ' 1fr';

  const gridStyle = { gridTemplateColumns: gridCols };

  return (
    <div className="flex-1 flex flex-col bg-transparent overflow-hidden min-h-0">
      <div 
        className="grid px-4 py-3 border-b border-white/5 text-[10px] font-bold tracking-widest text-white/50 shrink-0"
        style={gridStyle}
      >
        <div>#</div>
        <div>SPIN</div>
        {showFaceColumn && <div>F</div>}
        {showSectionColumn && <div>SECTION</div>}
        <div>PREDICTION</div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto pl-[14px] pr-2 min-h-0 scroll-smooth">
        {history.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/40 text-xs italic">
            No spins recorded yet.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <AnimatePresence initial={false}>
              {history.map((entry, idx) => {
                const hasPrediction = entry.prediction && entry.prediction.targetNumbers.length > 0;
                const isResolved = idx < history.length - 1;

                return (
                <motion.div 
                  key={entry.id} 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                  className="grid px-4 py-2.5 bg-[#1e1b29] rounded-2xl items-center border border-white/5 hover:bg-[#2a2638] transition-all transform-gpu shadow-lg group"
                  style={gridStyle}
                >
                  <div className="text-white/50 font-mono text-xs transition-colors">{idx + 1}</div>
                  <div className="flex items-center">
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-[13px] shadow-inner ${getColor(entry.spin)}`}>
                      {entry.spin}
                    </span>
                  </div>
                  {showFaceColumn && (
                    <div className="flex items-center">
                      {getFaceForNumber(entry.spin)}
                    </div>
                  )}
                  {showSectionColumn && (
                    <div className="text-white/70 font-mono text-[10px] tracking-wider uppercase">
                      {getSection(entry.spin)}
                    </div>
                  )}
                  <div className="text-white/90 group-hover:text-white font-mono text-xs tracking-wider font-medium transition-colors flex items-center justify-between w-full">
                    {renderPrediction(entry.prediction)}
                    {hasPrediction && isResolved && (
                      <UnitDetailsBadge entry={entry} targetSpin={history[idx + 1].spin} />
                    )}
                  </div>
                </motion.div>
              )})}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
