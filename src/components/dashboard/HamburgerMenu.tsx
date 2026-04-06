import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RotateCcw, Database, Keyboard, Target, Radar, Power, ChevronDown, Download, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResetConfirmationModal } from '../modals/ResetConfirmationModal';
import { exportSessionData, importSessionData } from '../../utils/fileManager';
import { InputMode } from '../../hooks/useRouletteSession';
import { useAuth } from '../../contexts/AuthContext';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onResetSession: () => void;
  onImportData: (spins: number[]) => void;
  history: { id: number, spin: number, prediction: string, isBetConfirmed?: boolean }[];
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  showInlineForm: boolean;
  setShowInlineForm: (val: boolean) => void;
  showFaceColumn: boolean;
  setShowFaceColumn: (val: boolean) => void;
  showSectionColumn: boolean;
  setShowSectionColumn: (val: boolean) => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ 
  isOpen, onClose, onResetSession, onImportData, history, inputMode, setInputMode, showInlineForm, setShowInlineForm, showFaceColumn, setShowFaceColumn, showSectionColumn, setShowSectionColumn 
}) => {
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDataSettingsOpen, setIsDataSettingsOpen] = useState(false);
  const [isInputSettingsOpen, setIsInputSettingsOpen] = useState(false);
  const [isStrategySettingsOpen, setIsStrategySettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logout } = useAuth();

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

  const handleConfirmReset = () => {
    onResetSession();
    setIsTimerRunning(false);
    setTimer(0);
    onClose();
  };

  const handleExport = () => {
    exportSessionData(history);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const spins = await importSessionData(file);
      onImportData(spins);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred during import.");
      }
      console.error("Import error:", error);
    } finally {
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            className="absolute top-16 right-4 w-80 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] p-5 z-50 flex flex-col gap-6 origin-top-right"
          >
            {/* Timer Section */}
        <div className="flex flex-col gap-2">
          <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase">Session Timer</span>
          <div className="text-center text-white font-mono text-4xl font-bold tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] my-2">
            {formatTime(timer)}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all transform-gpu active:scale-95 ${isTimerRunning ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isTimerRunning ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              {isTimerRunning ? 'Pause' : 'Start'}
            </button>
            <button 
              onClick={() => setIsResetModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all transform-gpu active:scale-95"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Settings List */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-col">
            <button 
              onClick={() => setIsDataSettingsOpen(!isDataSettingsOpen)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all transform-gpu text-white/80 hover:text-white group active:scale-95"
            >
              <div className="flex items-center gap-3">
                <Database size={18} className="text-white/50 group-hover:text-white/80 transition-colors" />
                <span className="font-bold text-sm">Data Settings</span>
              </div>
              <ChevronDown size={16} className={`text-white/30 transition-transform ${isDataSettingsOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isDataSettingsOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden flex flex-col gap-1 px-4 py-2"
                >
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all text-white/70 hover:text-white text-sm"
                  >
                    <Upload size={14} className="text-blue-400" />
                    Import Session
                  </button>
                  <input 
                    type="file" 
                    accept=".json" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImport} 
                  />
                  <button 
                    onClick={handleExport}
                    disabled={history.length === 0}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all text-white/70 hover:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={14} className="text-green-400" />
                    Export Session
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex flex-col">
            <button 
              onClick={() => setIsInputSettingsOpen(!isInputSettingsOpen)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all transform-gpu text-white/80 hover:text-white group active:scale-95"
            >
              <div className="flex items-center gap-3">
                <Keyboard size={18} className="text-white/50 group-hover:text-white/80 transition-colors" />
                <span className="font-bold text-sm">In&Output Settings</span>
              </div>
              <ChevronDown size={16} className={`text-white/30 transition-transform ${isInputSettingsOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isInputSettingsOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden flex flex-col gap-2 px-4 py-2"
                >
                  <div className="flex bg-white/5 p-1 rounded-lg">
                    <button
                      onClick={() => setInputMode('HYBRID')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${inputMode === 'HYBRID' ? 'bg-pink-500 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                    >
                      Hybrid
                    </button>
                    <button
                      onClick={() => setInputMode('DEDICATED')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${inputMode === 'DEDICATED' ? 'bg-pink-500 text-white shadow-md' : 'text-white/50 hover:text-white/80'}`}
                    >
                      Dedicated
                    </button>
                  </div>
                  <p className="text-[10px] text-white/40 text-center mt-1 leading-tight">
                    {inputMode === 'HYBRID' 
                      ? 'Click numbers on grid/racetrack to add spins.' 
                      : 'Grid/racetrack are view-only. Use number pad to add spins.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col">
            <button 
              onClick={() => setIsStrategySettingsOpen(!isStrategySettingsOpen)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all transform-gpu text-white/80 hover:text-white group active:scale-95"
            >
              <div className="flex items-center gap-3">
                <Target size={18} className="text-white/50 group-hover:text-white/80 transition-colors" />
                <span className="font-bold text-sm">Strategy Settings</span>
              </div>
              <ChevronDown size={16} className={`text-white/30 transition-transform ${isStrategySettingsOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isStrategySettingsOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden flex flex-col gap-2 px-4 py-2"
                >
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">Show Inline Form</span>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={showInlineForm}
                        onChange={() => setShowInlineForm(!showInlineForm)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${showInlineForm ? 'bg-pink-500' : 'bg-white/10'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showInlineForm ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">Show Face Column (F)</span>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={showFaceColumn}
                        onChange={() => setShowFaceColumn(!showFaceColumn)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${showFaceColumn ? 'bg-pink-500' : 'bg-white/10'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showFaceColumn ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">Show Section Column</span>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={showSectionColumn}
                        onChange={() => setShowSectionColumn(!showSectionColumn)}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${showSectionColumn ? 'bg-pink-500' : 'bg-white/10'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showSectionColumn ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all transform-gpu text-white/80 hover:text-white group active:scale-95">
            <div className="flex items-center gap-3">
              <Radar size={18} className="text-white/50 group-hover:text-white/80 transition-colors" />
              <span className="font-bold text-sm">Perimeter</span>
            </div>
            <ChevronDown size={16} className="text-white/30" />
          </button>
          
          <div className="h-px bg-white/10 my-2 mx-2"></div>
          
          <button 
            onClick={() => setIsResetModalOpen(true)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/20 transition-all transform-gpu text-red-400 hover:text-red-300 text-left group active:scale-95"
          >
            <Power size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">Reset Session</span>
          </button>

          <button 
            onClick={logout}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all transform-gpu text-white/60 hover:text-white text-left group active:scale-95"
          >
            <Power size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm">Sign Out</span>
          </button>
        </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ResetConfirmationModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </>
  );
};
