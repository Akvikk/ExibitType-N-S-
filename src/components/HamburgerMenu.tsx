import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCcw, Database, Keyboard, Target, Radar, Power, ChevronDown } from 'lucide-react';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onResetSession: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose, onResetSession }) => {
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 w-80 bg-[#13131a]/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-5 z-50 flex flex-col gap-6">
      {/* Timer Section */}
      <div className="flex flex-col gap-2">
        <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase">Session Timer</span>
        <div className="text-center text-white font-mono text-4xl font-bold tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] my-2">
          {formatTime(timer)}
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${isTimerRunning ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' : 'bg-[#1a472a] text-[#4ade80] hover:bg-[#225c36]'}`}
          >
            {isTimerRunning ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            {isTimerRunning ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={() => { setIsTimerRunning(false); setTimer(0); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold bg-[#4a1a1a] text-[#f87171] hover:bg-[#5c2222] transition-all"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Settings List */}
      <div className="flex flex-col gap-1">
        <button className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-white/80 hover:text-white group">
          <div className="flex items-center gap-3">
            <Database size={18} className="text-white/50 group-hover:text-white/80 transition-colors" />
            <span className="font-bold text-sm">Data Settings</span>
          </div>
          <ChevronDown size={16} className="text-white/30" />
        </button>
        <button className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-white/80 hover:text-white group">
          <div className="flex items-center gap-3">
            <Keyboard size={18} className="text-white/50 group-hover:text-white/80 transition-colors" />
            <span className="font-bold text-sm">Input Settings</span>
          </div>
          <ChevronDown size={16} className="text-white/30" />
        </button>
        <button className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-white/80 hover:text-white group">
          <div className="flex items-center gap-3">
            <Target size={18} className="text-white/50 group-hover:text-white/80 transition-colors" />
            <span className="font-bold text-sm">Strategy Settings</span>
          </div>
          <ChevronDown size={16} className="text-white/30" />
        </button>
        <button className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-white/80 hover:text-white group">
          <div className="flex items-center gap-3">
            <Radar size={18} className="text-white/50 group-hover:text-white/80 transition-colors" />
            <span className="font-bold text-sm">Perimeter</span>
          </div>
          <ChevronDown size={16} className="text-white/30" />
        </button>
        
        <div className="h-px bg-white/10 my-2 mx-2"></div>
        
        <button 
          onClick={() => {
            onResetSession();
            onClose();
            setIsTimerRunning(false);
            setTimer(0);
          }}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-all text-red-500 text-left group"
        >
          <Power size={18} className="group-hover:scale-110 transition-transform" />
          <span className="font-bold text-sm">Reset Session</span>
        </button>
      </div>
    </div>
  );
};
