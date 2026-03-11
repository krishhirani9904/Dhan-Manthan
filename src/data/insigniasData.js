export const INSIGNIAS = [
  {
    id: 'the_owner', name: 'The Owner', image: '🏆',
    description: 'Own at least 1 business, 1 property, and 1 car',
    check: (state) => state.ownedBusinesses.length >= 1 && state.ownedProperties.length >= 1 && (state.ownedCars || []).length >= 1,
  },
  {
    id: 'monopoly', name: 'Monopoly', image: '🎯',
    description: 'Own 5 or more businesses of different categories',
    check: (state) => new Set((state.ownedBusinesses || []).map(b => b.categoryId)).size >= 5,
  },
  {
    id: 'business_empire', name: 'Business Empire', image: '👑',
    description: 'Own 10 or more businesses and have income over ₹1Cr/hr',
    check: (state) => (state.ownedBusinesses || []).length >= 10 && state.incomePerHour >= 10000000,
  },
  {
    id: 'investor', name: 'Investor', image: '📈',
    description: 'Own stocks, crypto, and properties simultaneously',
    check: (state) => (state.ownedStocks || []).length >= 1 && (state.ownedCrypto || []).length >= 1 && (state.ownedProperties || []).length >= 1,
  },
  {
    id: 'richman', name: 'Richman', image: '💰',
    description: 'Reach a balance of ₹100 Crore',
    check: (state) => state.balance >= 1000000000,
  },
];