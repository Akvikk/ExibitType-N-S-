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
    <div className="flex items-center justify-between px-[7px] py-[1px] md:px-6 md:py-4 bg-transparent shrink-0 ml-0">
      <div className="flex items-center gap-1.5 md:gap-3">
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
          className={`w-10 h-8 md:w-12 md:h-10 rounded-xl md:rounded-2xl bg-[#1e1b29] border border-white/5 text-white/50 font-mono text-sm md:text-lg text-center outline-none transition-all transform-gpu focus:border-pink-500/50 focus:text-white focus:shadow-[0_0_15px_rgba(236,72,153,0.3)] shadow-lg ${
            isError 
              ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-shake' 
              : ''
          }`}
        />
        <button 
          onClick={onAdd}
          disabled={selectedNumber === null}
          className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] hover:from-[#7c3aed] hover:to-[#c026d3] border-none disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-white px-4 py-1.5 md:px-8 md:py-2.5 text-[11px] md:text-[13px] rounded-xl md:rounded-2xl font-bold tracking-widest transition-all transform-gpu shadow-[0_4px_20px_rgba(217,70,239,0.4)] hover:shadow-[0_6px_25px_rgba(217,70,239,0.6)] hover:scale-105 active:scale-95"
        >
          ADD
        </button>
        <button 
          onClick={onUndo}
          disabled={historyLength === 0}
          className="p-1.5 md:p-2.5 rounded-full bg-[#1e1b29] border border-white/5 text-white/50 hover:text-white hover:bg-[#2a2638] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all transform-gpu hover:scale-105 active:scale-95 shadow-lg"
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw className="w-[14px] h-[14px] md:w-[18px] md:h-[18px]" />
        </button>
        <button 
          onClick={onRedo}
          disabled={undoneLength === 0}
          className="p-1.5 md:p-2.5 rounded-full bg-[#1e1b29] border border-white/5 text-white/50 hover:text-white hover:bg-[#2a2638] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all transform-gpu hover:scale-105 active:scale-95 shadow-lg"
          title="Redo (Ctrl+Y)"
        >
          <RotateCw className="w-[14px] h-[14px] md:w-[18px] md:h-[18px]" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        <ViewModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />
        <button 
          onClick={onOpenMyBets}
          className="flex items-center justify-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full bg-[#1e1b29] border border-white/5 text-white hover:bg-[#2a2638] transition-all transform-gpu hover:scale-105 active:scale-95 shadow-lg"
        >
          <ClipboardList className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] text-pink-400" />
          <span className="hidden lg:inline text-[13px] font-bold tracking-widest">MY BETS</span>
        </button>
        <button 
          onClick={onOpenStats}
          className="flex items-center justify-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full bg-[#1e1b29] border border-white/5 text-white hover:bg-[#2a2638] transition-all transform-gpu hover:scale-105 active:scale-95 shadow-lg"
        >
          <BarChart2 className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] text-blue-400" />
          <span className="hidden lg:inline text-[13px] font-bold tracking-widest">STATS</span>
        </button>
        <button 
          onClick={() => {
            setIsHudOpen(!isHudOpen);
            if (isMenuOpen) setIsMenuOpen(false);
          }}
          className={`p-1.5 md:p-2.5 rounded-full border transition-all transform-gpu hover:scale-105 active:scale-95 shadow-lg ${isHudOpen ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-[#1e1b29] border-white/5 text-white/50 hover:text-white hover:bg-[#2a2638]'}`}
        >
          <Activity className="w-[14px] h-[14px] md:w-[18px] md:h-[18px]" />
        </button>
        <button 
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            if (isHudOpen) setIsHudOpen(false);
          }}
          className={`p-1.5 md:p-2.5 rounded-full border transition-all transform-gpu hover:scale-105 active:scale-95 shadow-lg ${isMenuOpen ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'bg-[#1e1b29] border-white/5 text-white/50 hover:text-white hover:bg-[#2a2638]'}`}
        >
          <Menu className="w-[14px] h-[14px] md:w-[18px] md:h-[18px]" />
        </button>
      </div>
    </div>
  );
};
