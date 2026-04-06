import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, BarChart2, Flame, Snowflake, TrendingUp, Activity, List } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, ReferenceLine, Tooltip, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { getColor } from '../../utils/colors';
import { calculateResult } from '../../engine/calculator';
import { getSection } from '../../utils/sections';
import { HistoryEntry } from '../../hooks/useRouletteSession';
import { FACES } from '../../engine/constants';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, history }) => {
  const [activeTab, setActiveTab] = useState<'profitability' | 'game_stats' | 'logs_details'>('profitability');
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Scroll to bottom of audit trail when history changes
  useEffect(() => {
    if (scrollRef.current && activeTab === 'logs_details') {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [history, isOpen, activeTab]);

  // --- GAME STATS CALCULATIONS ---
  const totalSpins = history.length;
  const frequencies: Record<number, number> = {};
  for (let i = 0; i <= 36; i++) frequencies[i] = 0;
  
  let redCount = 0;
  let blackCount = 0;
  let zeroCount = 0;
  let oddCount = 0;
  let evenCount = 0;
  let highCount = 0; // 19-36
  let lowCount = 0; // 1-18

  let tiersCount = 0;
  let orphansCount = 0;
  let voisinsCount = 0;
  let zeroSectionCount = 0;

  history.forEach(entry => {
    frequencies[entry.spin]++;
    const color = getColor(entry.spin);
    if (color.includes('red')) redCount++;
    else if (color.includes('black')) blackCount++;
    else zeroCount++;

    if (entry.spin !== 0) {
      if (entry.spin % 2 === 0) evenCount++;
      else oddCount++;

      if (entry.spin >= 19) highCount++;
      else lowCount++;
    }

    const section = getSection(entry.spin);
    if (section === 'Tiers') tiersCount++;
    else if (section === 'Orphans') orphansCount++;
    else if (section === 'Voisins') voisinsCount++;
    else if (section === 'Zero') zeroSectionCount++;
  });

  const sortedNumbers = Object.entries(frequencies)
    .map(([num, count]) => ({ num: parseInt(num), count }))
    .sort((a, b) => b.count - a.count);

  const hotNumbers = sortedNumbers.slice(0, 5).filter(n => n.count > 0);
  const coldNumbers = sortedNumbers.slice().reverse().slice(0, 5);

  const getPercentage = (count: number) => {
    if (totalSpins === 0) return 0;
    return Math.round((count / totalSpins) * 100);
  };

  // --- ADVANCED CHARTING CALCULATIONS ---
  const winRateData = [];
  let runningWins = 0;
  let runningBets = 0;
  for (let i = 0; i < history.length - 1; i++) {
    const entry = history[i];
    const targetSpin = history[i+1].spin;
    const { isWin, cost } = calculateResult(entry.prediction, targetSpin);
    if (cost > 0) {
      runningBets++;
      if (isWin) runningWins++;
      winRateData.push({
        name: `Bet ${runningBets}`,
        winRate: Math.round((runningWins / runningBets) * 100)
      });
    }
  }

  const faceCounts: Record<string, number> = { F1: 0, F2: 0, F3: 0, F4: 0, F5: 0 };
  history.forEach(entry => {
    FACES.forEach(face => {
      if (face.numbers.includes(entry.spin)) faceCounts[face.id]++;
    });
  });
  const maxFaceCount = Math.max(...Object.values(faceCounts), 1);
  const radarData = FACES.map(f => ({
    face: f.id,
    count: faceCounts[f.id],
    fullMark: maxFaceCount + 2
  }));

  // --- PROFITABILITY CALCULATIONS ---
  const allBets = [];
  let currentBankroll = 0;
  const chartData = [{ name: 'Start', value: 0 }];
  let wins = 0;
  let losses = 0;
  let betIndex = 1;

  for (let i = 0; i < history.length - 1; i++) {
    const entry = history[i];
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

      allBets.push({
        id: entry.id,
        prediction: predictionStr,
        targetSpin,
        index: betIndex,
        net,
        isWin
      });

      chartData.push({ name: `Bet ${betIndex}`, value: currentBankroll });
      betIndex++;
    }
  }

  const spins = allBets.length;
  const totalNet = currentBankroll;
  const hitRate = spins > 0 ? Math.round((wins / spins) * 100) : 0;

  const gradientOffset = () => {
    const dataMax = Math.max(...chartData.map(i => i.value));
    const dataMin = Math.min(...chartData.map(i => i.value));
    
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
    
    return dataMax / (dataMax - dataMin);
  };
  
  const off = gradientOffset();

  const CustomDot = (props: any) => {
    const { cx, cy, value } = props;
    if (value === undefined || cx === undefined || cy === undefined) return null;
    
    const isPositive = value >= 0;
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={4} 
        fill={isPositive ? '#22d3ee' : '#f43f5e'} 
        stroke={isPositive ? '#06b6d4' : '#e11d48'} 
        strokeWidth={2} 
      />
    );
  };

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
            className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl w-full max-w-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="stats-modal-title"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5 shrink-0">
              <div className="flex items-center gap-3 text-white">
                <BarChart2 size={20} className="text-purple-400" />
                <h2 id="stats-modal-title" className="font-semibold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Session Statistics
                </h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all transform-gpu focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-6 pt-4 gap-4 shrink-0">
              <button
                onClick={() => setActiveTab('profitability')}
                className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-all transform-gpu font-bold text-sm tracking-wide ${
                  activeTab === 'profitability' 
                    ? 'border-purple-400 text-purple-400' 
                    : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                <TrendingUp size={16} />
                PROFITABILITY
              </button>
              <button
                onClick={() => setActiveTab('game_stats')}
                className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-all transform-gpu font-bold text-sm tracking-wide ${
                  activeTab === 'game_stats' 
                    ? 'border-purple-400 text-purple-400' 
                    : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                <Activity size={16} />
                GAME STATS
              </button>
              <button
                onClick={() => setActiveTab('logs_details')}
                className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-all transform-gpu font-bold text-sm tracking-wide ${
                  activeTab === 'logs_details' 
                    ? 'border-purple-400 text-purple-400' 
                    : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                <List size={16} />
                LOGS DETAILS
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-6 overflow-y-auto">
              {activeTab === 'profitability' ? (
                // --- PROFITABILITY TAB ---
                <>
                  {/* KPIs */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-2xl p-5 flex flex-col items-center justify-center border border-white/10 shadow-inner hover:bg-white/10 transition-colors">
                      <span className="text-purple-300/50 text-xs font-bold tracking-wider mb-2">Total Net</span>
                      <span className={`text-4xl font-mono font-bold tracking-tight drop-shadow-[0_0_10px_rgba(168,85,247,0.3)] ${totalNet < 0 ? 'text-rose-500' : totalNet > 0 ? 'text-cyan-400' : 'text-white'}`}>
                        {totalNet}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-5 flex flex-col items-center justify-center border border-white/10 shadow-inner hover:bg-white/10 transition-colors">
                      <span className="text-purple-300/50 text-xs font-bold tracking-wider mb-2">Hit Rate</span>
                      <span className={`text-4xl font-mono font-bold tracking-tight drop-shadow-[0_0_10px_rgba(168,85,247,0.3)] ${hitRate === 0 && spins > 0 ? 'text-rose-500' : hitRate > 0 ? 'text-cyan-400' : 'text-white'}`}>
                        {hitRate}%
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-5 flex flex-col items-center justify-center border border-white/10 shadow-inner hover:bg-white/10 transition-colors">
                      <span className="text-purple-300/50 text-xs font-bold tracking-wider mb-2">Total Bets</span>
                      <span className="text-4xl font-mono font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        {spins}
                      </span>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col gap-4 shadow-inner relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-500/5 pointer-events-none"></div>
                    
                    <div className="w-full relative z-10" style={{ height: '250px', minHeight: '250px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                          <defs>
                            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset={off} stopColor="#22d3ee" stopOpacity={1} />
                              <stop offset={off} stopColor="#f43f5e" stopOpacity={1} />
                            </linearGradient>
                            <linearGradient id="splitFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset={off} stopColor="#22d3ee" stopOpacity={0.3} />
                              <stop offset={off} stopColor="#f43f5e" stopOpacity={0.3} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" hide padding={{ left: 10, right: 10 }} />
                          <YAxis domain={['auto', 'auto']} hide padding={{ top: 30, bottom: 30 }} />
                          <ReferenceLine y={0} stroke="#ffffff" strokeDasharray="5 5" strokeWidth={1} opacity={0.2} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                            itemStyle={{ color: '#c084fc', fontWeight: 'bold' }}
                            labelStyle={{ display: 'none' }}
                            formatter={(value: number) => [`${value > 0 ? '+' : ''}${value}`, 'Net']}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '5 5' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="url(#splitColor)" 
                            fill="url(#splitFill)"
                            strokeWidth={3} 
                            dot={<CustomDot />}
                            activeDot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }}
                            isAnimationActive={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Summary Row */}
                    <div className="flex justify-between items-center text-[11px] font-bold tracking-widest px-2 relative z-10 mt-2">
                      <span className="text-cyan-400">WINS: {wins}</span>
                      <span className="text-purple-300/70">TOTAL PREDICTIONS: {spins}</span>
                      <span className="text-rose-500">LOSSES: {losses}</span>
                    </div>
                  </div>
                </>
              ) : activeTab === 'game_stats' ? (
                // --- GAME STATS TAB ---
                <>
                  {/* Top Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/10 shadow-inner">
                      <span className="text-purple-300/50 text-[10px] font-bold tracking-widest mb-1">TOTAL SPINS</span>
                      <span className="text-3xl font-mono font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        {totalSpins}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center border border-rose-500/20 shadow-inner">
                      <span className="text-rose-300/50 text-[10px] font-bold tracking-widest mb-1">RED</span>
                      <span className="text-3xl font-mono font-bold tracking-tight text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                        {getPercentage(redCount)}%
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-500/20 shadow-inner">
                      <span className="text-gray-400/50 text-[10px] font-bold tracking-widest mb-1">BLACK</span>
                      <span className="text-3xl font-mono font-bold tracking-tight text-gray-300 drop-shadow-[0_0_10px_rgba(156,163,175,0.3)]">
                        {getPercentage(blackCount)}%
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center border border-cyan-500/20 shadow-inner">
                      <span className="text-cyan-300/50 text-[10px] font-bold tracking-widest mb-1">ZERO</span>
                      <span className="text-3xl font-mono font-bold tracking-tight text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                        {getPercentage(zeroCount)}%
                      </span>
                    </div>
                  </div>

                  {/* Hot & Cold */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Hot Numbers */}
                    <div className="bg-white/5 rounded-2xl border border-orange-500/20 p-5 flex flex-col gap-4 shadow-inner">
                      <div className="flex items-center gap-2 text-orange-400">
                        <Flame size={18} />
                        <h3 className="font-bold text-sm tracking-wider">HOT NUMBERS</h3>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {hotNumbers.length > 0 ? hotNumbers.map((item, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm shadow-sm border border-white/20 ${getColor(item.num)}`}>
                              {item.num}
                            </div>
                            <span className="text-[10px] text-white/50 font-mono">{item.count}x</span>
                          </div>
                        )) : (
                          <span className="text-white/30 text-xs italic">Not enough data</span>
                        )}
                      </div>
                    </div>

                    {/* Cold Numbers */}
                    <div className="bg-white/5 rounded-2xl border border-cyan-500/20 p-5 flex flex-col gap-4 shadow-inner">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Snowflake size={18} />
                        <h3 className="font-bold text-sm tracking-wider">COLD NUMBERS</h3>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {totalSpins > 0 ? coldNumbers.map((item, i) => (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm shadow-sm border border-white/20 ${getColor(item.num)} opacity-60`}>
                              {item.num}
                            </div>
                            <span className="text-[10px] text-white/50 font-mono">{item.count}x</span>
                          </div>
                        )) : (
                          <span className="text-white/30 text-xs italic">Not enough data</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Distribution Bars */}
                  <div className="bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col gap-5 shadow-inner">
                    <h3 className="text-purple-300/80 font-bold text-sm tracking-wide">Distributions</h3>
                    
                    <div className="flex flex-col gap-4">
                      {/* Odd / Even */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold tracking-widest text-white/50">
                          <span>ODD ({getPercentage(oddCount)}%)</span>
                          <span>EVEN ({getPercentage(evenCount)}%)</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                          <div className="h-full bg-blue-500 transition-all transform-gpu duration-500" style={{ width: `${getPercentage(oddCount)}%` }} />
                          <div className="h-full bg-purple-500 transition-all transform-gpu duration-500" style={{ width: `${getPercentage(evenCount)}%` }} />
                        </div>
                      </div>

                      {/* Low / High */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold tracking-widest text-white/50">
                          <span>LOW 1-18 ({getPercentage(lowCount)}%)</span>
                          <span>HIGH 19-36 ({getPercentage(highCount)}%)</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                          <div className="h-full bg-cyan-500 transition-all transform-gpu duration-500" style={{ width: `${getPercentage(lowCount)}%` }} />
                          <div className="h-full bg-indigo-500 transition-all transform-gpu duration-500" style={{ width: `${getPercentage(highCount)}%` }} />
                        </div>
                      </div>
                      
                      {/* Wheel Sectors */}
                      <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-white/5">
                        <h4 className="text-[10px] font-bold tracking-widest text-white/50">WHEEL SECTORS</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {/* Voisins */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[10px] font-bold tracking-widest text-white/70">
                              <span>VOISINS</span>
                              <span>{getPercentage(voisinsCount)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-400 transition-all transform-gpu duration-500" style={{ width: `${getPercentage(voisinsCount)}%` }} />
                            </div>
                          </div>

                          {/* Tiers */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[10px] font-bold tracking-widest text-white/70">
                              <span>TIERS</span>
                              <span>{getPercentage(tiersCount)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-400 transition-all transform-gpu duration-500" style={{ width: `${getPercentage(tiersCount)}%` }} />
                            </div>
                          </div>

                          {/* Orphans */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[10px] font-bold tracking-widest text-white/70">
                              <span>ORPHANS</span>
                              <span>{getPercentage(orphansCount)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-400 transition-all transform-gpu duration-500" style={{ width: `${getPercentage(orphansCount)}%` }} />
                            </div>
                          </div>

                          {/* Zero */}
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[10px] font-bold tracking-widest text-white/70">
                              <span>ZERO</span>
                              <span>{getPercentage(zeroSectionCount)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-green-400 transition-all transform-gpu duration-500" style={{ width: `${getPercentage(zeroSectionCount)}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Analytics Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Win Rate Trajectory */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col gap-4 shadow-inner">
                      <h3 className="text-purple-300/80 font-bold text-sm tracking-wide">Win Rate Trajectory</h3>
                      <div className="w-full h-48">
                        {winRateData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={winRateData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                              <XAxis dataKey="name" hide />
                              <YAxis domain={[0, 100]} stroke="#ffffff50" fontSize={10} tickFormatter={(val) => `${val}%`} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#c084fc', fontWeight: 'bold' }}
                                labelStyle={{ display: 'none' }}
                                formatter={(value: number) => [`${value}%`, 'Win Rate']}
                              />
                              <Line type="monotone" dataKey="winRate" stroke="#c084fc" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#fff', stroke: '#c084fc', strokeWidth: 2 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/30 text-xs italic">Not enough data</div>
                        )}
                      </div>
                    </div>

                    {/* Wheel Balance (Radar) */}
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-5 flex flex-col gap-4 shadow-inner">
                      <h3 className="text-purple-300/80 font-bold text-sm tracking-wide">Wheel Balance (Faces)</h3>
                      <div className="w-full h-48">
                        {totalSpins > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                              <PolarGrid stroke="#ffffff20" />
                              <PolarAngleAxis dataKey="face" tick={{ fill: '#ffffff80', fontSize: 10, fontWeight: 'bold' }} />
                              <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                              <Radar name="Hits" dataKey="count" stroke="#c084fc" fill="#c084fc" fillOpacity={0.4} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#c084fc', fontWeight: 'bold' }}
                                formatter={(value: number) => [value, 'Hits']}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/30 text-xs italic">Not enough data</div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // --- LOGS DETAILS TAB ---
                <div className="flex flex-col gap-3 h-full">
                  <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-inner flex flex-col h-full min-h-[300px]">
                    <div className="grid grid-cols-4 p-4 border-b border-white/10 text-[10px] font-bold tracking-widest text-purple-300/50 bg-black/20 shrink-0">
                      <div>INDEX</div>
                      <div>SIGNATURE</div>
                      <div>TARGET</div>
                      <div className="text-right">YIELD</div>
                    </div>
                    <div ref={scrollRef} className="flex flex-col overflow-y-auto scroll-smooth flex-1">
                      {allBets.length === 0 ? (
                        <div className="p-6 text-center text-white/30 text-xs italic">
                          No predictions recorded yet. Add spins to generate predictions.
                        </div>
                      ) : (
                        allBets.map((entry) => (
                          <div key={entry.id} className="grid grid-cols-4 p-4 border-b border-white/5 text-xs items-center hover:bg-white/5 transition-colors">
                            <div className="text-white/50 font-mono">{entry.index}</div>
                            <div className="text-white/80 font-mono truncate pr-2" title={entry.prediction || '-'}>{entry.prediction || '-'}</div>
                            <div className={`font-mono font-bold ${entry.isWin ? 'text-cyan-400' : 'text-rose-500'}`}>{entry.targetSpin}</div>
                            <div className={`text-right font-mono font-bold ${entry.net > 0 ? 'text-cyan-400' : 'text-rose-500'}`}>
                              {entry.net > 0 ? `+${entry.net}` : entry.net}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
