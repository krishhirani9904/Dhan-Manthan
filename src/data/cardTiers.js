export const CARD_TIERS = [
  {
    id: 'base',
    name: 'Base',
    gradient: 'from-gray-600 to-gray-800',
    textColor: 'text-gray-300',
    chipColor: 'bg-gray-400',
    minBalance: 0,
    bonus: 0,
    perks: 'Standard earnings',
    tier: 'standard',
  },
  {
    id: 'silver',
    name: 'Silver',
    gradient: 'from-slate-400 to-slate-600',
    textColor: 'text-slate-100',
    chipColor: 'bg-slate-300',
    minBalance: 10000,
    bonus: 0.05,
    perks: '+5% bonus earnings',
    tier: 'standard',
  },
  {
    id: 'gold',
    name: 'Gold',
    gradient: 'from-yellow-500 to-amber-600',
    textColor: 'text-yellow-100',
    chipColor: 'bg-yellow-300',
    minBalance: 100000,
    bonus: 0.10,
    perks: '+10% bonus earnings',
    tier: 'standard',
  },
  {
    id: 'black',
    name: 'Black',
    gradient: 'from-gray-900 to-black',
    textColor: 'text-gray-200',
    chipColor: 'bg-gray-600',
    minBalance: 1000000,
    bonus: 0.20,
    perks: '+20% bonus earnings',
    tier: 'standard',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    textColor: 'text-cyan-100',
    chipColor: 'bg-cyan-300',
    minBalance: 10000000,
    bonus: 0.35,
    perks: '+35% bonus earnings',
    tier: 'premium',
    glowClass: 'animate-diamond-glow',
    shimmerColor: 'from-transparent via-white/30 to-transparent',
    particleColor: 'bg-cyan-300',
    accentGradient: 'from-cyan-400/20 via-sky-300/10 to-blue-400/20',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    gradient: 'from-purple-500 via-violet-500 to-indigo-600',
    textColor: 'text-purple-100',
    chipColor: 'bg-purple-300',
    minBalance: 100000000,
    bonus: 0.50,
    perks: '+50% bonus earnings',
    tier: 'ultimate',
    glowClass: 'animate-platinum-glow',
    shimmerColor: 'from-transparent via-white/40 to-transparent',
    particleColor: 'bg-purple-300',
    accentGradient: 'from-purple-400/20 via-pink-300/10 to-indigo-400/20',
    holoGradient: 'bg-gradient-to-r from-purple-400 via-pink-400 via-cyan-400 via-yellow-300 to-purple-400',
  },
];

export const getCardTier = (balance) => {
  let current = CARD_TIERS[0];
  for (const tier of CARD_TIERS) {
    if (balance >= tier.minBalance) current = tier;
  }
  return current;
};

export const getCardBonus = (cardId) => {
  const tier = CARD_TIERS.find(t => t.id === cardId);
  return tier?.bonus || 0;
};