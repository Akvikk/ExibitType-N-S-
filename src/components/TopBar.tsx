import React, { useState } from 'react';
import { RotateCcw, ClipboardList, BarChart2, Menu, Filter } from 'lucide-react';

interface TopBarProps {
  selectedNumber: number | null;
  onSelect: (n: number | null) => void;
  onAdd: () => void;
  onUndo: () => void;
  historyLength: number;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  selectedNumber,
  onSelect,
  onAdd,
  onUndo,
  historyLength,
  isMenuOpen,
  toggleMenu
}) => {
  const [isError, setIsError] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 shrink-0">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={selectedNumber !== null ? selectedNumber : ''}
          placeholder="#"
          onChange={(e) => {
            const val = e.target.value;
            if (val === '') {
              onSelect(null);
              return;
            }
            if (!/^\d+$/.test(val)) {
              setIsError(true);
              setTimeout(() => setIsError(false), 400);
              onSelect(null);
              return;
            }
            const num = parseInt(val, 10);
            if (num < 0 || num > 36) {
              setIsError(true);
              setTimeout(() => setIsError(false), 400);
              onSelect(null);
            } else {
              onSelect(num);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && selectedNumber !== null) {
              onAdd();
            }
          }}
          className={`w-12 h-8 rounded-xl bg-black/20 backdrop-blur-md border border-white/20 text-white font-mono text-lg text-center outline-none transition-all focus:border-white/50 focus:bg-black/30 shadow-inner ${
            isError 
              ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-shake' 
              : ''
          }`}
        />
        <button 
          onClick={onAdd}
          disabled={selectedNumber === null}
          className="bg-blue-500/80 hover:bg-blue-500 backdrop-blur-md border border-blue-400/50 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-white px-6 py-1.5 text-sm rounded-full font-bold tracking-wider transition-all shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:scale-105"
        >
          ADD
        </button>
        <button 
          onClick={onUndo}
          disabled={historyLength === 0}
          className="p-1.5 rounded-full bg-black/20 border border-white/10 text-white/70 hover:text-white hover:bg-black/40 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all hover:scale-105"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 border border-white/10 text-white/90 hover:bg-black/40 transition-all hover:scale-105">
          <ClipboardList size={16} />
          <span className="text-xs font-bold tracking-wider">MY BETS</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 border border-white/10 text-yellow-400/90 hover:text-yellow-400 hover:bg-black/40 transition-all hover:scale-105">
          <BarChart2 size={16} />
          <span className="text-xs font-bold tracking-wider">STATS</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 border border-white/10 text-green-400/90 hover:text-green-400 hover:bg-black/40 transition-all hover:scale-105">
          <Filter size={16} />
          <span className="text-xs font-bold tracking-wider">FILTER</span>
        </button>
        <button 
          onClick={toggleMenu}
          className={`p-1.5 rounded-full border transition-all hover:scale-105 ${isMenuOpen ? 'bg-white/20 border-white/30 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'bg-black/20 border-white/10 text-white/70 hover:text-white hover:bg-black/40'}`}
        >
          <Menu size={16} />
        </button>
      </div>
    </div>
  );
};
