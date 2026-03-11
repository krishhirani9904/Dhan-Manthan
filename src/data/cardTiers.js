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
  },
  {
    id: 'diamond',
    name: 'Diamond',
    gradient: 'from-cyan-400 to-blue-600',
    textColor: 'text-cyan-100',
    chipColor: 'bg-cyan-300',
    minBalance: 10000000,
    bonus: 0.35,
    perks: '+35% bonus earnings',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    gradient: 'from-purple-400 to-indigo-600',
    textColor: 'text-purple-100',
    chipColor: 'bg-purple-300',
    minBalance: 100000000,
    bonus: 0.50,
    perks: '+50% bonus earnings',
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