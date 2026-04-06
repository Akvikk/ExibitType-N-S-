import React, { useMemo, useState, useEffect } from 'react';
import { motion, PanInfo } from 'motion/react';
import { FACES } from '../../engine/constants';
import { GripHorizontal, X } from 'lucide-react';

interface DraggableHUDProps {
  history: any[];
  onClose: () => void;
}

export const DraggableHUD: React.FC<DraggableHUDProps> = ({ history, onClose }) => {
  const [pos, setPos] = useState(() => {
    const saved = localStorage.getItem('hud_position');
    return saved ? JSON.parse(saved) : { x: 20, y: 80 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDragEnd = (e: any, info: PanInfo) => {
    setIsDragging(false);
    let newX = pos.x + info.offset.x;
    let newY = pos.y + info.offset.y;
    
    const hudWidth = 200;
    const hudHeight = 200;
    const snapDistance = 60;
    
    // Snap to left/right
    if (newX < snapDistance) newX = 10;
    if (newX > window.innerWidth - hudWidth - snapDistance) newX = window.innerWidth - hudWidth - 10;
    
    // Snap to top/bottom
    if (newY < snapDistance) newY = 10;
    if (newY > window.innerHeight - hudHeight - snapDistance) newY = window.innerHeight - hudHeight - 10;
    
    // Bounds
    newX = Math.max(10, Math.min(newX, window.innerWidth - hudWidth - 10));
    newY = Math.max(10, Math.min(newY, window.innerHeight - hudHeight - 10));
    
    setPos({ x: newX, y: newY });
    localStorage.setItem('hud_position', JSON.stringify({ x: newX, y: newY }));
  };

  // Calculate Face Percentages (Frequency)
  const faceStats = useMemo(() => {
    const totalSpins = history.length;
    if (totalSpins === 0) {
      return FACES.map(f => ({ ...f, percentage: 0 }));
    }

    const counts: Record<string, number> = { F1: 0, F2: 0, F3: 0, F4: 0, F5: 0 };
    
    history.forEach(entry => {
      FACES.forEach(face => {
        if (face.numbers.includes(entry.spin)) {
          counts[face.id]++;
        }
      });
    });

    return FACES.map(f => ({
      ...f,
      percentage: Math.round((counts[f.id] / totalSpins) * 100)
    }));
  }, [history]);

  // Calculate Win/Loss Sequence
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

  const wins = sequence.filter(s => s === 'W').length;
  const total = sequence.length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  // Only show the last 10 form items to keep it compact
  const recentSequence = sequence.slice(-10);

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9, x: pos.x, y: pos.y }}
      animate={{ opacity: isHovered || isDragging ? 1 : 0.3, scale: 1, x: pos.x, y: pos.y }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ opacity: { duration: 0.3 } }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed z-[100] flex flex-col bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-[200px] cursor-move"
      style={{ touchAction: 'none' }}
    >
      {/* Drag Handle & Close Button */}
      <div className="flex justify-between items-center mb-2">
        <div className="w-4"></div> {/* Spacer for centering grip */}
        <div className="opacity-50 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
          <GripHorizontal size={16} className="text-white/50" />
        </div>
        <button 
          onClick={onClose} 
          className="opacity-50 hover:opacity-100 transition-opacity text-white/50 hover:text-rose-500"
        >
          <X size={16} />
        </button>
      </div>

      {/* Bar Graphs for Faces */}
      <div className="flex flex-col gap-1.5 mb-3">
        {faceStats.map(face => {
          // Extract base color from Tailwind class for the progress bar
          let barColor = 'bg-white/50';
          if (face.id === 'F1') barColor = 'bg-rose-500';
          if (face.id === 'F2') barColor = 'bg-orange-500';
          if (face.id === 'F3') barColor = 'bg-yellow-500';
          if (face.id === 'F4') barColor = 'bg-cyan-500';
          if (face.id === 'F5') barColor = 'bg-purple-500';

          return (
            <div key={face.id} className="flex items-center gap-2 text-[10px] font-bold">
              <span className={`w-4 text-center ${face.color}`}>{face.id}</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${face.percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${barColor}`}
                />
              </div>
              <span className="w-6 text-right text-white/70">{face.percentage}%</span>
            </div>
          );
        })}
      </div>

      <div className="h-px bg-white/10 w-full mb-2"></div>

      {/* Compact Win/Loss Form */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center justify-center pr-2 border-r border-white/10 shrink-0">
          <span className="text-[8px] text-white/50 font-bold tracking-widest uppercase">Form</span>
          <span className={`text-[10px] font-bold ${winRate >= 50 ? 'text-cyan-400' : 'text-rose-500'}`}>
            {total > 0 ? `${winRate}%` : '--'}
          </span>
        </div>
        
        <div className="flex items-center gap-1 overflow-hidden flex-1 justify-end">
          {recentSequence.length > 0 ? recentSequence.map((result, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              key={idx}
              className={`flex items-center justify-center w-4 h-4 rounded-[3px] font-bold text-[8px] shrink-0 transition-all ${
                result === 'W' 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
              }`}
            >
              {result}
            </motion.div>
          )) : (
            <span className="text-white/30 text-[8px] italic">No data</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
