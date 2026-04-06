import { useState, useEffect, useCallback } from 'react';
import { analyzeSpin } from '../engine/analyzer';
import { Prediction } from '../engine/types';

export interface HistoryEntry {
  id: number;
  spin: number;
  prediction: Prediction | null;
  isBetConfirmed?: boolean;
}

export type ViewMode = 'NONE' | 'GRID' | 'RACETRACK' | 'BOTH';
export type InputMode = 'HYBRID' | 'DEDICATED';

export function useRouletteSession() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('roulette_history_v2');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Failed to read history from localStorage', e);
      }
    }
    return [];
  });

  const [undoneHistory, setUndoneHistory] = useState<HistoryEntry[]>([]);

  const [inputMode, setInputMode] = useState<InputMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('roulette_input_mode');
        if (saved === 'HYBRID' || saved === 'DEDICATED') return saved as InputMode;
      } catch (e) {
        console.warn('Failed to read input mode from localStorage', e);
      }
    }
    return 'HYBRID';
  });

  // Initialize based on screen size if possible, otherwise default to BOTH
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('roulette_view_mode');
        if (saved === 'NONE' || saved === 'GRID' || saved === 'RACETRACK' || saved === 'BOTH') return saved as ViewMode;
      } catch (e) {
        console.warn('Failed to read view mode from localStorage', e);
      }
      return window.innerWidth < 1024 ? 'GRID' : 'BOTH';
    }
    return 'BOTH';
  });

  const [showInlineForm, setShowInlineForm] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('roulette_show_inline_form');
        if (saved !== null) return saved === 'true';
      } catch (e) {}
    }
    return false;
  });

  const [showFaceColumn, setShowFaceColumn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('roulette_show_face_column');
        if (saved !== null) return saved === 'true';
      } catch (e) {}
    }
    return true;
  });

  const [showSectionColumn, setShowSectionColumn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('roulette_show_section_column');
        if (saved !== null) return saved === 'true';
      } catch (e) {}
    }
    return true;
  });

  const [isHudOpen, setIsHudOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('roulette_is_hud_open');
        if (saved !== null) return saved === 'true';
      } catch (e) {}
    }
    return false;
  });

  // Auto-switch away from BOTH on smaller screens
  useEffect(() => {
    const checkScreenSize = () => {
      const isLg = window.innerWidth >= 1024;
      if (!isLg && viewMode === 'BOTH') {
        setViewMode('GRID');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [viewMode]);

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('roulette_history_v2', JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('roulette_input_mode', inputMode);
    } catch (e) {
      console.warn('Failed to save input mode to localStorage', e);
    }
  }, [inputMode]);

  useEffect(() => {
    try {
      localStorage.setItem('roulette_view_mode', viewMode);
    } catch (e) {
      console.warn('Failed to save view mode to localStorage', e);
    }
  }, [viewMode]);

  useEffect(() => {
    try {
      localStorage.setItem('roulette_show_inline_form', String(showInlineForm));
    } catch (e) {}
  }, [showInlineForm]);

  useEffect(() => {
    try {
      localStorage.setItem('roulette_show_face_column', String(showFaceColumn));
    } catch (e) {}
  }, [showFaceColumn]);

  useEffect(() => {
    try {
      localStorage.setItem('roulette_show_section_column', String(showSectionColumn));
    } catch (e) {}
  }, [showSectionColumn]);

  useEffect(() => {
    try {
      localStorage.setItem('roulette_is_hud_open', String(isHudOpen));
    } catch (e) {}
  }, [isHudOpen]);

  const handleSelect = (num: number | null) => {
    setSelectedNumber(num);
  };

  const handleAdd = useCallback((num?: number) => {
    const numberToAdd = num !== undefined ? num : selectedNumber;
    if (numberToAdd === null) return;
    
    // Generate prediction based on the new spin
    const prediction = analyzeSpin(numberToAdd);

    const newEntry: HistoryEntry = {
      id: Date.now(),
      spin: numberToAdd,
      prediction: prediction,
      isBetConfirmed: false
    };

    setHistory(prev => [...prev, newEntry]);
    setUndoneHistory([]); // Clear redo stack on new action
    setSelectedNumber(null);
  }, [selectedNumber]);

  const handleInstantAdd = useCallback((num: number) => {
    handleAdd(num);
  }, [handleAdd]);

  const handleUndo = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const popped = newHistory.pop();
      if (popped) {
        setUndoneHistory(u => [...u, popped]);
      }
      return newHistory;
    });
  }, []);

  const handleRedo = useCallback(() => {
    setUndoneHistory(prev => {
      if (prev.length === 0) return prev;
      const newUndone = [...prev];
      const popped = newUndone.pop();
      if (popped) {
        setHistory(h => [...h, popped]);
      }
      return newUndone;
    });
  }, []);

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const handleResetSession = () => {
    setHistory([]);
    setUndoneHistory([]);
    setSelectedNumber(null);
    try {
      localStorage.removeItem('roulette_history_v2');
    } catch (e) {
      console.warn('Failed to remove history from localStorage', e);
    }
  };

  const handleImportData = (spins: number[]) => {
    const newHistory: HistoryEntry[] = [];
    
    spins.forEach((spin, index) => {
      const prediction = analyzeSpin(spin);
      newHistory.push({
        id: Date.now() + index,
        spin,
        prediction,
        isBetConfirmed: false
      });
    });

    setHistory(newHistory);
    setUndoneHistory([]);
    setSelectedNumber(null);
  };

  const toggleBetConfirmation = () => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const lastIndex = newHistory.length - 1;
      const lastEntry = newHistory[lastIndex];

      newHistory[lastIndex] = {
        ...lastEntry,
        isBetConfirmed: !lastEntry.isBetConfirmed
      };
      
      return newHistory;
    });
  };

  // Active bets for the UI (highlighting on the board)
  const latestEntry = history.length > 0 ? history[history.length - 1] : null;
  const activeBets: number[] = latestEntry?.prediction?.targetNumbers || [];

  return {
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
  };
}
