import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ResetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            className="bg-[#0f0c1b]/95 backdrop-blur-2xl border border-red-500/30 rounded-3xl w-full max-w-md shadow-[0_20px_50px_rgba(239,68,68,0.15)] overflow-hidden flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-modal-title"
          >
            {/* Warning Header Background */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-500/20 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-2 relative z-10">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 mb-4">
                <AlertTriangle size={24} />
              </div>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all transform-gpu focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 relative z-10">
              <h2 id="reset-modal-title" className="text-xl font-bold text-white mb-2">
                Reset Session?
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Are you sure you want to reset the current session? This action will permanently delete all recorded spins, predictions, and confirmed bets. 
                <br /><br />
                <strong className="text-red-400 font-semibold">This action cannot be undone.</strong>
              </p>
            </div>

            {/* Actions */}
            <div className="p-6 pt-4 bg-white/5 border-t border-white/5 flex gap-3 relative z-10">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white/70 bg-white/5 hover:bg-white/10 hover:text-white transition-all transform-gpu active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-red-500/80 hover:bg-red-500 transition-all transform-gpu active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              >
                Yes, Reset Session
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
