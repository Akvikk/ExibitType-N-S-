import { TRIGGER_MAP, FACES } from './constants';
import { Prediction, FaceId } from './types';

export function analyzeSpin(spin: number): Prediction {
  const targetNumbers = TRIGGER_MAP[spin] || [];
  const targetSet = new Set(targetNumbers);
  const matchedFaces: FaceId[] = [];
  const matchedFaceNumbers = new Set<number>();

  // Check which faces are 100% matched
  FACES.forEach(face => {
    const isMatch = face.numbers.every(n => targetSet.has(n));
    if (isMatch) {
      matchedFaces.push(face.id);
      face.numbers.forEach(n => matchedFaceNumbers.add(n));
    }
  });

  // Any target numbers that don't belong to a fully matched face are residuals
  const residuals = targetNumbers.filter(n => !matchedFaceNumbers.has(n));

  return {
    targetNumbers,
    matchedFaces,
    residuals
  };
}
