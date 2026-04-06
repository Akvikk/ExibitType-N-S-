import { RED_NUMBERS, BLACK_NUMBERS } from '../constants';

export const PATTERN_COLORS: Record<string, {
  text: string;
  bg: string;
  border: string;
  gradient: string;
  shadow: string;
  hoverBorder: string;
  hoverShadow: string;
  filterBg: string;
  filterBorder: string;
  filterHoverBorder: string;
  filterGradient: string;
}> = {
  P1: { 
    text: 'text-pink-400', 
    bg: 'bg-pink-500', 
    border: 'border-pink-500/30', 
    gradient: 'from-pink-500/20 to-pink-500/5',
    shadow: 'shadow-[0_4px_15px_rgba(236,72,153,0.3)]',
    hoverBorder: 'hover:border-pink-400/60',
    hoverShadow: 'hover:shadow-[0_4px_15px_rgba(236,72,153,0.2)]',
    filterBg: 'bg-pink-500',
    filterBorder: 'border-pink-500/30',
    filterHoverBorder: 'hover:border-pink-500/50',
    filterGradient: 'from-pink-500/20 to-pink-500/5'
  },
  P2: { 
    text: 'text-cyan-400', 
    bg: 'bg-cyan-500', 
    border: 'border-cyan-500/30', 
    gradient: 'from-cyan-500/20 to-cyan-500/5',
    shadow: 'shadow-[0_4px_15px_rgba(34,211,238,0.3)]',
    hoverBorder: 'hover:border-cyan-400/60',
    hoverShadow: 'hover:shadow-[0_4px_15px_rgba(34,211,238,0.2)]',
    filterBg: 'bg-cyan-500',
    filterBorder: 'border-cyan-500/30',
    filterHoverBorder: 'hover:border-cyan-500/50',
    filterGradient: 'from-cyan-500/20 to-cyan-500/5'
  },
  P3: { 
    text: 'text-emerald-400', 
    bg: 'bg-emerald-500', 
    border: 'border-emerald-500/30', 
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    shadow: 'shadow-[0_4px_15px_rgba(52,211,153,0.3)]',
    hoverBorder: 'hover:border-emerald-400/60',
    hoverShadow: 'hover:shadow-[0_4px_15px_rgba(52,211,153,0.2)]',
    filterBg: 'bg-emerald-500',
    filterBorder: 'border-emerald-500/30',
    filterHoverBorder: 'hover:border-emerald-500/50',
    filterGradient: 'from-emerald-500/20 to-emerald-500/5'
  },
  P4: { 
    text: 'text-amber-400', 
    bg: 'bg-amber-500', 
    border: 'border-amber-500/30', 
    gradient: 'from-amber-500/20 to-amber-500/5',
    shadow: 'shadow-[0_4px_15px_rgba(251,191,36,0.3)]',
    hoverBorder: 'hover:border-amber-400/60',
    hoverShadow: 'hover:shadow-[0_4px_15px_rgba(251,191,36,0.2)]',
    filterBg: 'bg-amber-500',
    filterBorder: 'border-amber-500/30',
    filterHoverBorder: 'hover:border-amber-500/50',
    filterGradient: 'from-amber-500/20 to-amber-500/5'
  },
  P5: { 
    text: 'text-orange-400', 
    bg: 'bg-orange-500', 
    border: 'border-orange-500/30', 
    gradient: 'from-orange-500/20 to-orange-500/5',
    shadow: 'shadow-[0_4px_15px_rgba(249,115,22,0.3)]',
    hoverBorder: 'hover:border-orange-400/60',
    hoverShadow: 'hover:shadow-[0_4px_15px_rgba(249,115,22,0.2)]',
    filterBg: 'bg-orange-500',
    filterBorder: 'border-orange-500/30',
    filterHoverBorder: 'hover:border-orange-500/50',
    filterGradient: 'from-orange-500/20 to-orange-500/5'
  },
  P6: { 
    text: 'text-violet-400', 
    bg: 'bg-violet-500', 
    border: 'border-violet-500/30', 
    gradient: 'from-violet-500/20 to-violet-500/5',
    shadow: 'shadow-[0_4px_15px_rgba(139,92,246,0.3)]',
    hoverBorder: 'hover:border-violet-400/60',
    hoverShadow: 'hover:shadow-[0_4px_15px_rgba(139,92,246,0.2)]',
    filterBg: 'bg-violet-500',
    filterBorder: 'border-violet-500/30',
    filterHoverBorder: 'hover:border-violet-500/50',
    filterGradient: 'from-violet-500/20 to-violet-500/5'
  },
};

export const getColor = (num: number) => {
  if (num === 0) return 'bg-green-500/80 text-white backdrop-blur-sm'; // Green
  if (RED_NUMBERS.has(num)) return 'bg-red-500/80 text-white backdrop-blur-sm'; // Red
  if (BLACK_NUMBERS.has(num)) return 'bg-black/60 text-white backdrop-blur-sm'; // Black
  return 'bg-gray-500/50 text-white backdrop-blur-sm';
};

export const getFillClass = (num: number) => {
  if (num === 0) return 'rt-fill-green';
  if (RED_NUMBERS.has(num)) return 'rt-fill-red';
  return 'rt-fill-black';
};

export const getNumClass = (num: number) => {
  if (num === 0) return 'rt-num-green';
  if (RED_NUMBERS.has(num)) return 'rt-num-red';
  return 'rt-num-black';
};
