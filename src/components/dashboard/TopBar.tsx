import React, { useState } from 'react';
import { RotateCcw, RotateCw, ClipboardList, BarChart2, Menu, Activity } from 'lucide-react';
import { ViewMode } from '../../hooks/useRouletteSession';
import { ViewModeSwitcher } from './ViewModeSwitcher';

interface TopBarProps {
  selectedNumber: number | null;
  onSelect: (n: number | null) => void;
  onAdd: () => void;
  onUndo: () => void;
  onRedo: () => void;
  historyLength: number;
  undoneLength: number;
  isMenuOpen: boolean;
  setIsMenuOpen: (val: boolean) => void;
  isHudOpen: boolean;
  setIsHudOpen: (val: boolean) => void;
  onOpenMyBets: () => void;
  onOpenStats: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  selectedNumber,
  onSelect,
  onAdd,
  onUndo,
  onRedo,
  historyLength,
  undoneLength,
  isMenuOpen,
  setIsMenuOpen,
  isHudOpen,
  setIsHudOpen,
  onOpenMyBets,
  onOpenStats,
  viewMode,
  setViewMode
}) => {
  const [isError, setIsError] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-md border-b border-white/10 shrink-0">
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
          className={`w-12 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-mono text-lg text-center outline-none transition-all transform-gpu focus:border-pink-500/50 focus:bg-pink-500/10 focus:shadow-[0_0_15px_rgba(236,72,153,0.3)] shadow-inner ${
            isError 
              ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-shake' 
              : ''
          }`}
        />
        <button 
          onClick={onAdd}
          disabled={selectedNumber === null}
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-400 hover:to-violet-400 border-none disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-white px-6 py-1.5 text-sm rounded-full font-bold tracking-wider transition-all transform-gpu shadow-[0_4px_15px_rgba(236,72,153,0.4)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95"
        >
          ADD
        </button>
        <button 
          onClick={onUndo}
          disabled={historyLength === 0}
          className="p-1.5 rounded-full bg-white/10 border border-white/10 text-white/70 hover:text-white hover:bg-white/20 hover:border-white/30 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all transform-gpu hover:scale-105 active:scale-95"
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw size={16} />
        </button>
        <button 
          onClick={onRedo}
          disabled={undoneLength === 0}
          className="p-1.5 rounded-full bg-white/10 border border-white/10 text-white/70 hover:text-white hover:bg-white/20 hover:border-white/30 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all transform-gpu hover:scale-105 active:scale-95"
          title="Redo (Ctrl+Y)"
        >
          <RotateCw size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <ViewModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />
        <button 
          onClick={onOpenMyBets}
          className="flex items-center justify-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/10 text-white/90 hover:bg-white/20 hover:border-white/30 transition-all transform-gpu hover:scale-105 active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
        >
          <ClipboardList size={16} className="text-pink-400" />
          <span className="hidden sm:inline text-xs font-bold tracking-wider">MY BETS</span>
        </button>
        <button 
          onClick={onOpenStats}
          className="flex items-center justify-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/10 text-white/90 hover:bg-white/20 hover:border-white/30 transition-all transform-gpu hover:scale-105 active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
        >
          <BarChart2 size={16} className="text-blue-400" />
          <span className="hidden sm:inline text-xs font-bold tracking-wider">STATS</span>
        </button>
        <button 
          onClick={() => {
            setIsHudOpen(!isHudOpen);
            if (isMenuOpen) setIsMenuOpen(false);
          }}
          className={`p-1.5 rounded-full border transition-all transform-gpu hover:scale-105 active:scale-95 ${isHudOpen ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/10 border-white/10 text-white/70 hover:text-white hover:bg-white/20 hover:border-white/30'}`}
        >
          <Activity size={16} />
        </button>
        <button 
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            if (isHudOpen) setIsHudOpen(false);
          }}
          className={`p-1.5 rounded-full border transition-all transform-gpu hover:scale-105 active:scale-95 ${isMenuOpen ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'bg-white/10 border-white/10 text-white/70 hover:text-white hover:bg-white/20 hover:border-white/30'}`}
        >
          <Menu size={16} />
        </button>
      </div>
    </div>
  );
};
