import { Prediction, BetResult } from './types';

export function calculateResult(prediction: Prediction | null, nextSpin: number): BetResult {
  if (!prediction || prediction.targetNumbers.length === 0) {
    return { isWin: false, cost: 0, gross: 0, net: 0 };
  }

  // Cost is 1 unit per target number
  const cost = prediction.targetNumbers.length;
  
  // Win if the next spin is in the target list
  const isWin = prediction.targetNumbers.includes(nextSpin);
  
  // Gross win is 36 units (35 to 1 payout + original stake returned)
  const gross = isWin ? 36 : 0;
  
  // Net is gross minus the total cost of the bet
  const net = gross - cost;

  return { isWin, cost, gross, net };
}
