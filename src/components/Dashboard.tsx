import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TopBar } from './dashboard/TopBar';
import { HamburgerMenu } from './dashboard/HamburgerMenu';
import { PredictionBox } from './dashboard/PredictionBox';
import { HistoryTable } from './dashboard/HistoryTable';
import { WinLossBar } from './dashboard/WinLossBar';
import { MyBetsModal } from './modals/MyBets/MyBetsModal';
import { StatsModal } from './modals/StatsModal';
import { DashboardBackground } from './dashboard/DashboardBackground';
import { ViewMode, InputMode } from '../hooks/useRouletteSession';

interface DashboardProps {
  selectedNumber: number | null;
  onSelect: (n: number | null) => void;
  onAdd: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onResetSession: () => void;
  onImportData: (spins: number[]) => void;
  history: any[];
  undoneHistory: any[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  onToggleBetConfirmation: () => void;
  showInlineForm: boolean;
  setShowInlineForm: (val: boolean) => void;
  showFaceColumn: boolean;
  setShowFaceColumn: (val: boolean) => void;
  showSectionColumn: boolean;
  setShowSectionColumn: (val: boolean) => void;
  isHudOpen: boolean;
  setIsHudOpen: (val: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  selectedNumber, 
  onSelect,
  onAdd, 
  onUndo, 
  onRedo,
  onResetSession,
  onImportData,
  history,
  undoneHistory,
  viewMode,
  setViewMode,
  inputMode,
  setInputMode,
  onToggleBetConfirmation,
  showInlineForm,
  setShowInlineForm,
  showFaceColumn,
  setShowFaceColumn,
  showSectionColumn,
  setShowSectionColumn,
  isHudOpen,
  setIsHudOpen
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMyBetsOpen, setIsMyBetsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-1 flex flex-col bg-black/40 backdrop-blur-md md:rounded-l-3xl shadow-[-15px_0_50px_rgba(0,0,0,0.5)] overflow-hidden md:border-l border-white/10 md:border-t border-t-white/10 h-full z-10 relative"
    >
      <DashboardBackground />
      
      {/* Main Content Container (z-10 to sit above background) */}
      <div className="relative z-10 flex flex-col h-full w-full">
        <TopBar 
          selectedNumber={selectedNumber}
          onSelect={onSelect}
          onAdd={onAdd}
          onUndo={onUndo}
          onRedo={onRedo}
          historyLength={history.length}
          undoneLength={undoneHistory.length}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isHudOpen={isHudOpen}
          setIsHudOpen={setIsHudOpen}
          onOpenMyBets={() => setIsMyBetsOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <HamburgerMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
          onResetSession={onResetSession} 
          onImportData={onImportData}
          history={history}
          inputMode={inputMode}
          setInputMode={setInputMode}
          showInlineForm={showInlineForm}
          setShowInlineForm={setShowInlineForm}
          showFaceColumn={showFaceColumn}
          setShowFaceColumn={setShowFaceColumn}
          showSectionColumn={showSectionColumn}
          setShowSectionColumn={setShowSectionColumn}
        />

        <MyBetsModal 
          isOpen={isMyBetsOpen}
          onClose={() => setIsMyBetsOpen(false)}
          history={history}
        />

        <StatsModal
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
          history={history}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col px-1 md:px-4 pb-1 md:pb-4 pt-0.5 md:pt-2 gap-1.5 md:gap-3 overflow-hidden">
          <PredictionBox onToggleBetConfirmation={onToggleBetConfirmation} history={history} />
          {showInlineForm && <WinLossBar history={history} />}
          <HistoryTable 
            history={history} 
            showFaceColumn={showFaceColumn}
            showSectionColumn={showSectionColumn}
          />
        </div>
      </div>
    </motion.div>
  );
};
