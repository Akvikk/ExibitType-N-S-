import React from 'react';
import { getColor } from '../utils/colors';
import { InputMode } from '../hooks/useRouletteSession';

interface NumberGridProps {
  selectedNumber: number | null;
  onSelect: (n: number) => void;
  inputMode: InputMode;
  activeBets: number[];
}

export const NumberGrid: React.FC<NumberGridProps> = ({ selectedNumber, onSelect, inputMode, activeBets }) => {
  const gridNumbers = Array.from({ length: 36 }, (_, i) => i + 1);

  const handleNumberClick = (num: number) => {
    if (inputMode === 'HYBRID') {
      onSelect(num);
    }
  };

  return (
    <div 
      className="hidden md:flex flex-col gap-1 bg-white/5 backdrop-blur-xl border-r border-white/10 shrink-0 w-[20%] max-w-[180px] min-w-[140px] h-full shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-10" 
      style={{ 
        paddingLeft: '6px',
        paddingRight: '6px',
        paddingTop: '6px',
        paddingBottom: '8px',
      }}
    >
      <button
        onClick={() => handleNumberClick(0)}
        className={`w-full py-1.5 rounded-xl font-bold text-base shrink-0 transition-all transform-gpu duration-300 border shadow-sm ${getColor(0)} ${
          activeBets.includes(0) ? 'ring-2 ring-yellow-400 shadow-[0_8px_20px_rgba(250,204,21,0.6)] -translate-y-1 scale-[1.02] z-20' : 'border-white/20'
        } ${selectedNumber === 0 ? 'ring-2 ring-white scale-[1.02] z-10' : inputMode === 'HYBRID' ? 'hover:opacity-90 hover:scale-[1.02] cursor-pointer' : 'cursor-default'}`}
      >
        ZERO
      </button>
      <div className="grid grid-cols-3 grid-rows-12 gap-1.5 flex-1 min-h-0 mt-1">
        {gridNumbers.map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className={`h-full w-full rounded-lg font-bold text-xs transition-all transform-gpu duration-300 flex items-center justify-center border shadow-sm ${getColor(num)} ${
              activeBets.includes(num) ? 'ring-2 ring-yellow-400 shadow-[0_8px_20px_rgba(250,204,21,0.6)] -translate-y-1 scale-[1.1] z-20' : 'border-white/20'
            } ${selectedNumber === num ? 'ring-2 ring-white scale-110 z-10' : inputMode === 'HYBRID' ? 'hover:opacity-90 hover:scale-[1.05] cursor-pointer' : 'cursor-default'}`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};
