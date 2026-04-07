import React from 'react';
import './racetrack.css';
import { NumberGrid } from './components/NumberGrid';
import { Racetrack } from './components/Racetrack';
import { Dashboard } from './components/Dashboard';
import { BackgroundBlobs } from './components/BackgroundBlobs';
import { useRouletteSession } from './hooks/useRouletteSession';
import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/auth/AuthGuard';
import { DraggableHUD } from './components/dashboard/DraggableHUD';
import { AnimatePresence } from 'motion/react';

function MainApp() {
  const {
    selectedNumber,
    history,
    undoneHistory,
    viewMode,
    setViewMode,
    inputMode,
    setInputMode,
    activeBets,
    handleSelect,
    handleAdd,
    handleInstantAdd,
    handleUndo,
    handleRedo,
    handleResetSession,
    handleImportData,
    toggleBetConfirmation,
    showInlineForm,
    setShowInlineForm,
    showFaceColumn,
    setShowFaceColumn,
    showSectionColumn,
    setShowSectionColumn,
    isHudOpen,
    setIsHudOpen
  } = useRouletteSession();

  return (
    <div id="desktopGrid" className="racetrack-mode h-screen w-full bg-[#0a0510] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a0b2e] via-[#0a0510] to-[#05010a] text-white flex flex-row overflow-hidden font-sans selection:bg-pink-500/30 relative">
      {/* Animated background blobs for glass effect - Vibrant iOS style */}
      <BackgroundBlobs />
      
      <AnimatePresence>
        {isHudOpen && (
          <DraggableHUD 
            history={history} 
            onClose={() => setIsHudOpen(false)} 
          />
        )}
      </AnimatePresence>
      
      {(viewMode === 'GRID' || viewMode === 'BOTH') && (
        <NumberGrid 
          selectedNumber={selectedNumber} 
          onSelect={handleInstantAdd} 
          inputMode={inputMode}
          activeBets={activeBets}
        />
      )}
      {(viewMode === 'RACETRACK' || viewMode === 'BOTH') && (
        <Racetrack 
          selectedNumber={selectedNumber} 
          onSelect={handleInstantAdd} 
          inputMode={inputMode}
          activeBets={activeBets}
        />
      )}
      
      <Dashboard 
        selectedNumber={selectedNumber} 
        onSelect={handleSelect}
        onAdd={handleAdd} 
        onUndo={handleUndo} 
        onRedo={handleRedo}
        onResetSession={handleResetSession}
        onImportData={handleImportData}
        history={history}
        undoneHistory={undoneHistory}
        viewMode={viewMode}
        setViewMode={setViewMode}
        inputMode={inputMode}
        setInputMode={setInputMode}
        onToggleBetConfirmation={toggleBetConfirmation}
        showInlineForm={showInlineForm}
        setShowInlineForm={setShowInlineForm}
        showFaceColumn={showFaceColumn}
        setShowFaceColumn={setShowFaceColumn}
        showSectionColumn={showSectionColumn}
        setShowSectionColumn={setShowSectionColumn}
        isHudOpen={isHudOpen}
        setIsHudOpen={setIsHudOpen}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGuard>
        <MainApp />
      </AuthGuard>
    </AuthProvider>
  );
}
