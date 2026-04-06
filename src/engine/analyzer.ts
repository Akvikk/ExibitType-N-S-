import { FACES, WHEEL_SEQUENCE } from './constants';
import { Prediction, FaceId } from './types';

export function analyzeSpin(spin: number): Prediction {
  // 1. Racetrack Neighbors (1 left, 1 right)
  const wheelIndex = WHEEL_SEQUENCE.indexOf(spin);
  const leftNeighbor = WHEEL_SEQUENCE[(wheelIndex - 1 + WHEEL_SEQUENCE.length) % WHEEL_SEQUENCE.length];
  const rightNeighbor = WHEEL_SEQUENCE[(wheelIndex + 1) % WHEEL_SEQUENCE.length];
  const racetrackNeighbors = [leftNeighbor, rightNeighbor];

  // 2. Grid Neighbors
  let gridNeighbors: number[] = [];
  if (spin === 0) {
    gridNeighbors = [1];
  } else if (spin === 36) {
    gridNeighbors = [35];
  } else {
    gridNeighbors = [spin - 1, spin + 1];
  }

  // 3. Face Group
  const matchedFace = FACES.find(face => face.numbers.includes(spin));
  const faceGroupNumbers = matchedFace ? matchedFace.numbers : [];
  const matchedFaces: FaceId[] = matchedFace ? [matchedFace.id] : [];

  // Combine all into a unique set of target numbers
  const targetSet = new Set<number>([
    ...racetrackNeighbors,
    ...gridNeighbors,
    ...faceGroupNumbers
  ]);
  
  const targetNumbers = Array.from(targetSet).sort((a, b) => a - b);

  // Residuals are the neighbors that aren't part of the matched face
  const residuals = [...racetrackNeighbors, ...gridNeighbors].filter(n => !faceGroupNumbers.includes(n));
  // Deduplicate residuals
  const uniqueResiduals = Array.from(new Set(residuals)).sort((a, b) => a - b);

  return {
    targetNumbers,
    matchedFaces,
    racetrackNeighbors,
    gridNeighbors,
    residuals: uniqueResiduals
  };
}
