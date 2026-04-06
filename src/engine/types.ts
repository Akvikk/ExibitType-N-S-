export type FaceId = 'F1' | 'F2' | 'F3' | 'F4' | 'F5';

export interface FaceDef {
  id: FaceId;
  name: string;
  color: string;
  bg: string;
  border: string;
  numbers: number[];
}

export interface Prediction {
  targetNumbers: number[];
  matchedFaces: FaceId[];
  racetrackNeighbors: number[];
  gridNeighbors: number[];
  residuals: number[];
}

export interface BetResult {
  isWin: boolean;
  cost: number;
  gross: number;
  net: number;
}
