export const FORTUNE_LEVELS = [
  { min: 0, label: 'Beginner', emoji: '🌱' },
  { min: 1000, label: 'Hustler', emoji: '💪' },
  { min: 10000, label: 'Earner', emoji: '💵' },
  { min: 100000, label: 'Investor', emoji: '📈' },
  { min: 1000000, label: 'Millionaire', emoji: '💰' },
  { min: 10000000, label: 'Multi-Millionaire', emoji: '🏆' },
  { min: 100000000, label: 'Tycoon', emoji: '👑' },
  { min: 1000000000, label: 'Billionaire', emoji: '💎' },
  { min: 10000000000, label: 'Mogul', emoji: '🌟' },
  { min: 100000000000, label: 'Legend', emoji: '⭐' },
  { min: 1000000000000, label: 'God of Wealth', emoji: '🔱' },
];

export const getFortuneLevel = (balance) => {
  let current = FORTUNE_LEVELS[0];
  for (const level of FORTUNE_LEVELS) {
    if (balance >= level.min) current = level;
  }
  return current;
};

export const getGameProgress = (state) => {
  let score = 0;
  let maxScore = 100;
  if (state.balance >= 1000) score += 5;
  if (state.balance >= 100000) score += 5;
  if (state.balance >= 10000000) score += 5;
  if (state.balance >= 1000000000) score += 5;
  if ((state.ownedBusinesses || []).length >= 1) score += 5;
  if ((state.ownedBusinesses || []).length >= 5) score += 5;
  if ((state.ownedBusinesses || []).length >= 10) score += 5;
  if ((state.ownedStocks || []).length >= 1) score += 5;
  if ((state.ownedCrypto || []).length >= 1) score += 5;
  if ((state.ownedProperties || []).length >= 1) score += 5;
  if ((state.ownedProperties || []).length >= 5) score += 5;
  if ((state.ownedCars || []).length >= 1) score += 5;
  if ((state.ownedAircraft || []).length >= 1) score += 5;
  if ((state.ownedYachts || []).length >= 1) score += 5;
  if ((state.ownedIslands || []).length >= 1) score += 5;
  if ((state.ownedNFTs || []).length >= 1) score += 5;
  const totalCollections = Object.values(state.ownedCollections || {}).reduce((s, arr) => s + arr.length, 0);
  if (totalCollections >= 5) score += 5;
  if (totalCollections >= 20) score += 5;
  if ((state.mergedBusinesses || []).length >= 1) score += 5;
  if ((state.mergedBusinesses || []).length >= 5) score += 5;
  return Math.min(Math.round((score / maxScore) * 100), 100);
};