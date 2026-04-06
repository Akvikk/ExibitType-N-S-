import React, { useState, useRef, useEffect } from 'react';
import { LayoutGrid, Columns, LayoutTemplate, ChevronDown, ChevronUp, EyeOff } from 'lucide-react';
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
    { value: 'NONE', label: 'NONE', icon: <EyeOff size={16} className="text-white/50" /> },
    { value: 'GRID', label: 'GRID', icon: <LayoutGrid size={16} className="text-white/50" /> },
    { value: 'RACETRACK', label: 'RACETRACK', icon: <LayoutTemplate size={16} className="text-white/50" /> },
    { value: 'BOTH', label: 'BOTH', icon: <Columns size={16} className="text-white/50" /> },
  ];

  const modes = isLargeScreen ? allModes : allModes.filter(m => m.value !== 'BOTH');
  const currentMode = modes.find(m => m.value === viewMode) || modes[0];

  return (
    <div className="relative hidden md:block z-50" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1e1b29] border border-white/5 text-white hover:bg-[#2a2638] transition-all shadow-lg"
      >
        {React.cloneElement(currentMode.icon as React.ReactElement, { className: "text-white" })}
        <span className="text-[13px] font-bold tracking-widest">{currentMode.label}</span>
        {isOpen ? <ChevronUp size={16} className="text-white/50 ml-1" /> : <ChevronDown size={16} className="text-white/50 ml-1" />}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-48 bg-[#1e1b29] border border-white/5 rounded-2xl shadow-2xl overflow-hidden py-1">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => {
                setViewMode(mode.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-5 py-3 text-[13px] font-bold tracking-widest transition-colors ${
                viewMode === mode.value 
                  ? 'bg-white/5 text-white' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              {React.cloneElement(mode.icon as React.ReactElement, { 
                className: viewMode === mode.value ? "text-white" : "text-white/50" 
              })}
              {mode.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
