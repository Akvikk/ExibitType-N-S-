import React, { useState, useRef, useEffect } from 'react';
import { LayoutGrid, Columns, LayoutTemplate, ChevronDown, EyeOff } from 'lucide-react';
import { ViewMode } from '../../hooks/useRouletteSession';

interface ViewModeSwitcherProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const ViewModeSwitcher: React.FC<ViewModeSwitcherProps> = ({ viewMode, setViewMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // Initial check
    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allModes: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
    { value: 'NONE', label: 'NONE', icon: <EyeOff size={14} /> },
    { value: 'GRID', label: 'GRID', icon: <LayoutGrid size={14} /> },
    { value: 'RACETRACK', label: 'RACETRACK', icon: <LayoutTemplate size={14} /> },
    { value: 'BOTH', label: 'BOTH', icon: <Columns size={14} /> },
  ];

  // Filter out BOTH mode on smaller screens
  const modes = isLargeScreen ? allModes : allModes.filter(m => m.value !== 'BOTH');

  const currentMode = modes.find(m => m.value === viewMode) || modes[0];

  return (
    <div className="relative hidden md:block" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/90 hover:bg-white/20 hover:border-white/30 transition-all transform-gpu hover:scale-105 active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
      >
        {currentMode.icon}
        <span className="text-xs font-bold tracking-wider">{currentMode.label}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-32 bg-[#1a1a24] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => {
                setViewMode(mode.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold tracking-wider transition-colors ${
                viewMode === mode.value 
                  ? 'bg-pink-500/20 text-pink-400' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
