import { FaceDef } from './types';

export const FACES: FaceDef[] = [
  { id: 'F1', name: 'Red', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50', numbers: [1, 6, 10, 15, 24, 29, 33] },
  { id: 'F2', name: 'Orange', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/50', numbers: [2, 7, 11, 16, 20, 24, 25, 29, 34] },
  { id: 'F3', name: 'Yellow', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', numbers: [3, 8, 12, 17, 21, 26, 30, 35] },
  { id: 'F4', name: 'Green', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50', numbers: [4, 9, 13, 18, 22, 27, 31, 36] },
  { id: 'F5', name: 'Blue', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/50', numbers: [0, 5, 10, 14, 15, 19, 23, 28, 32] }
];

export const WHEEL_SEQUENCE = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];
