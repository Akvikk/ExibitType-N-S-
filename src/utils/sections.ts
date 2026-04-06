export const getSection = (spin: number): string => {
  const zero = [12, 35, 3, 26, 0, 32, 15];
  const voisins = [22, 18, 29, 7, 28, 19, 4, 21, 2, 25]; // Voisins excluding Zero
  const orphelins = [1, 20, 14, 31, 9, 17, 34, 6];
  const tiers = [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33];

  if (zero.includes(spin)) return "Zero";
  if (voisins.includes(spin)) return "Voisins";
  if (orphelins.includes(spin)) return "Orphans";
  if (tiers.includes(spin)) return "Tiers";
  
  return "-";
};
