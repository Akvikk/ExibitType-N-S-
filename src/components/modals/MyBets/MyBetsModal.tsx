import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, List } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, ReferenceLine, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { calculateResult } from '../../../engine/calculator';
import { HistoryEntry } from '../../../hooks/useRouletteSession';

interface MyBetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
}

export const MyBetsModal: React.FC<MyBetsModalProps> = ({ isOpen, onClose, history }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [history, isOpen]);

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

  // Calculate basic stats based on confirmed bets
  // A confirmed bet is placed on the prediction from step i, and resolved by the spin at step i+1
  const confirmedBets = [];
  let currentBankroll = 0;
  const chartData = [{ name: 'Start', value: 0 }];
  let wins = 0;
  let losses = 0;
  let betIndex = 1;

  for (let i = 0; i < history.length - 1; i++) {
    const entry = history[i];
    
    if (entry.isBetConfirmed) {
      const targetSpin = history[i+1].spin;
      const { isWin, net, cost } = calculateResult(entry.prediction, targetSpin);

      if (cost > 0) {
        if (isWin) wins++;
        else losses++;

        currentBankroll += net;

        let predictionStr = '-';
        if (entry.prediction) {
          const faces = entry.prediction.matchedFaces.join(', ');
          const residuals = entry.prediction.residuals.length > 0 ? `+[${entry.prediction.residuals.join(',')}]` : '';
          predictionStr = faces + residuals;
        }

        confirmedBets.push({
          id: entry.id,
          prediction: predictionStr,
          targetSpin,
          index: betIndex, // The sequential bet number
          net,
          isWin
        });

        chartData.push({ name: `Bet ${betIndex}`, value: currentBankroll });
        betIndex++;
      }
    }
  }

  const spins = confirmedBets.length;
  const totalNet = currentBankroll;
  const hitRate = spins > 0 ? Math.round((wins / spins) * 100) : 0;
  const confirmation = spins > 0 ? spins : 0;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-[#0f0c1b]/95 backdrop-blur-2xl border border-pink-500/20 rounded-3xl w-full max-w-3xl shadow-[0_20px_50px_rgba(236,72,153,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            
            {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-pink-500/20 bg-white/5 shrink-0">
          <div className="flex items-center gap-3 text-white">
            <List size={20} className="text-pink-400" />
            <h2 id="modal-title" className="font-semibold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">Personal Analytics & Ledger</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all transform-gpu focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label="Close modal"
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-2xl p-5 flex flex-col items-center justify-center border border-pink-500/10 shadow-inner hover:bg-white/10 transition-colors">
              <span className="text-pink-300/50 text-xs font-bold tracking-wider mb-2">Total Net</span>
              <motion.span 
                key={totalNet}
                initial={{ opacity: 0, scale: 0.8, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`text-4xl font-bold tracking-tight drop-shadow-[0_0_10px_rgba(236,72,153,0.3)] ${totalNet < 0 ? 'text-red-400' : totalNet > 0 ? 'text-green-400' : 'text-white'}`}
              >
                {totalNet}
              </motion.span>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 flex flex-col items-center justify-center border border-pink-500/10 shadow-inner hover:bg-white/10 transition-colors">
              <span className="text-pink-300/50 text-xs font-bold tracking-wider mb-2">Hit Rate</span>
              <motion.span 
                key={hitRate}
                initial={{ opacity: 0, scale: 0.8, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`text-4xl font-bold tracking-tight drop-shadow-[0_0_10px_rgba(236,72,153,0.3)] ${hitRate === 0 && spins > 0 ? 'text-red-400' : hitRate > 0 ? 'text-green-400' : 'text-white'}`}
              >
                {hitRate}%
              </motion.span>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 flex flex-col items-center justify-center border border-pink-500/10 shadow-inner hover:bg-white/10 transition-colors">
              <span className="text-pink-300/50 text-xs font-bold tracking-wider mb-2">Confirmation</span>
              <motion.span 
                key={confirmation}
                initial={{ opacity: 0, scale: 0.8, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              >
                {confirmation}
              </motion.span>
            </div>
          </div>

          {/* Chart Area */}
          <div className="bg-white/5 rounded-2xl border border-pink-500/10 p-5 flex flex-col gap-4 shadow-inner relative overflow-hidden shrink-0">
            {/* Subtle gradient background for the chart area */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-500/5 pointer-events-none"></div>
            
            <div className="w-full relative z-10" style={{ height: '250px', minHeight: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <XAxis dataKey="name" hide padding={{ left: 10, right: 10 }} />
                  <YAxis domain={['auto', 'auto']} hide padding={{ top: 30, bottom: 30 }} />
                  <ReferenceLine y={0} stroke="#4ade80" strokeDasharray="5 5" strokeWidth={2} opacity={0.5} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 12, 27, 0.9)', backdropFilter: 'blur(10px)', borderColor: 'rgba(236,72,153,0.3)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px rgba(236,72,153,0.2)' }}
                    itemStyle={{ color: '#ec4899', fontWeight: 'bold' }}
                    labelStyle={{ display: 'none' }}
                    formatter={(value: number) => [`${value > 0 ? '+' : ''}${value}`, 'Net']}
                    cursor={{ stroke: 'rgba(236,72,153,0.2)', strokeWidth: 2, strokeDasharray: '5 5' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ec4899" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#ec4899', stroke: '#fff', strokeWidth: 2 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Summary Row */}
            <div className="flex justify-between items-center text-[11px] font-bold tracking-widest px-2 relative z-10 mt-2">
              <span className="text-green-400">WINS: {wins}</span>
              <span className="text-pink-300/70">CONFIRMED SPINS: {spins}</span>
              <span className="text-red-400">LOSSES: {losses}</span>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="flex flex-col gap-3">
            <h3 className="text-pink-300/80 font-bold text-sm px-1 tracking-wide">Confirmed Bets Audit Trail</h3>
            <div className="bg-white/5 rounded-2xl border border-pink-500/10 overflow-hidden shadow-inner">
              <div className="grid grid-cols-4 p-4 border-b border-pink-500/10 text-[10px] font-bold tracking-widest text-pink-300/50 bg-black/20">
                <div>INDEX</div>
                <div>SIGNATURE</div>
                <div>TARGET</div>
                <div className="text-right">YIELD</div>
              </div>
              <div ref={scrollRef} className="flex flex-col max-h-40 overflow-y-auto scroll-smooth">
                {confirmedBets.length === 0 ? (
                  <div className="p-6 text-center text-white/30 text-xs italic">
                    No confirmed bets recorded yet. Double click the prediction box to confirm a bet.
                  </div>
                ) : (
                  confirmedBets.map((entry) => (
                    <div key={entry.id} className="grid grid-cols-4 p-4 border-b border-white/5 text-xs items-center hover:bg-white/5 transition-colors">
                      <div className="text-white/50 font-mono">{entry.index}</div>
                      <div className="text-white/80 font-mono truncate pr-2" title={entry.prediction || '-'}>{entry.prediction || '-'}</div>
                      <div className={`font-mono font-bold ${entry.isWin ? 'text-green-400' : 'text-red-400'}`}>{entry.targetSpin}</div>
                      <div className={`text-right font-mono font-bold ${entry.net > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {entry.net > 0 ? `+${entry.net}` : entry.net}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
