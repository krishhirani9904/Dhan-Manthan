export const CRYPTOCURRENCIES = [
  {
    id: 'bitcoiin',
    name: 'Bitcoiin',
    ticker: 'BTC',
    icon: '₿',
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    price: 5000000,
    volatility: 0.05,
    description: 'The original cryptocurrency',
    capitalization: 12000000000000,
    totalSupply: 2100000000,
    minBuy: 0.0001,
  },
  {
    id: 'ethereuum',
    name: 'Ethereuum',
    ticker: 'ETH',
    icon: 'Ξ',
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    price: 250000,
    volatility: 0.06,
    description: 'Smart contract platform',
    capitalization: 3000000000000,
    totalSupply: 12000000000,
    minBuy: 0.001,
  },
  {
    id: 'bnv',
    name: 'BNV',
    ticker: 'BNV',
    icon: '◆',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-500',
    price: 50000,
    volatility: 0.04,
    description: 'Exchange ecosystem token',
    capitalization: 800000000000,
    totalSupply: 16000000000,
    minBuy: 0.01,
  },
  {
    id: 'solaana',
    name: 'Solaana',
    ticker: 'SOL',
    icon: '◎',
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    price: 15000,
    volatility: 0.08,
    description: 'High-speed blockchain',
    capitalization: 650000000000,
    totalSupply: 43300000000,
    minBuy: 0.01,
  },
  {
    id: 'cardaano',
    name: 'Cardaano',
    ticker: 'ADA',
    icon: '◈',
    color: 'bg-blue-400',
    textColor: 'text-blue-400',
    price: 50,
    volatility: 0.07,
    description: 'Proof-of-stake blockchain',
    capitalization: 180000000000,
    totalSupply: 3600000000000,
    minBuy: 1,
  },
  {
    id: 'xrq',
    name: 'XRQ',
    ticker: 'XRQ',
    icon: '✕',
    color: 'bg-gray-500',
    textColor: 'text-gray-400',
    price: 55,
    volatility: 0.06,
    description: 'Digital payment network',
    capitalization: 280000000000,
    totalSupply: 5090000000000,
    minBuy: 1,
  },
  {
    id: 'dogeecoinn',
    name: 'Dogeecoinn',
    ticker: 'DOGE',
    icon: 'Ð',
    color: 'bg-yellow-600',
    textColor: 'text-yellow-600',
    price: 12,
    volatility: 0.1,
    description: 'The meme cryptocurrency',
    capitalization: 170000000000,
    totalSupply: 14200000000000,
    minBuy: 10,
  },
  {
    id: 'polkkadot',
    name: 'Polkkadot',
    ticker: 'DOT',
    icon: '●',
    color: 'bg-pink-500',
    textColor: 'text-pink-500',
    price: 600,
    volatility: 0.07,
    description: 'Multi-chain protocol',
    capitalization: 82000000000,
    totalSupply: 13700000000,
    minBuy: 0.1,
  },
  {
    id: 'polygonn',
    name: 'Polygonn',
    ticker: 'MATC',
    icon: '⬡',
    color: 'bg-violet-500',
    textColor: 'text-violet-500',
    price: 80,
    volatility: 0.08,
    description: 'Scaling solution',
    capitalization: 73000000000,
    totalSupply: 91200000000,
    minBuy: 1,
  },
  {
    id: 'avalannche',
    name: 'Avalannche',
    ticker: 'AVAX',
    icon: '▲',
    color: 'bg-red-500',
    textColor: 'text-red-500',
    price: 3500,
    volatility: 0.07,
    description: 'Smart contracts platform',
    capitalization: 128000000000,
    totalSupply: 3660000000,
    minBuy: 0.01,
  },
];

// FIXED: Smooth deterministic price simulation
export const getSimulatedCryptoPrice = (crypto, seed) => {
  const base = crypto.price;
  const vol = crypto.volatility;
  const s = seed / 30000;
  const variation =
    Math.sin(s * 0.5 + crypto.id.length * 3.7) * vol * 0.5 +
    Math.cos(s * 0.25 + crypto.id.length * 2.1) * vol * 0.35 +
    Math.sin(s * 0.1 + crypto.id.length * 5.3) * vol * 0.15;
  return Math.max(1, Math.floor(base * (1 + variation)));
};

// FIXED: Compare to previous 30s interval
export const getCryptoPriceChange = (crypto, seed) => {
  const current = getSimulatedCryptoPrice(crypto, seed);
  const prev = getSimulatedCryptoPrice(crypto, seed - 30000);
  const change = current - prev;
  const pct = prev > 0 ? ((change / prev) * 100) : 0;
  return { change, pct, isUp: change >= 0 };
};

export const getAvailableCrypto = (crypto, ownedCrypto) => {
  const owned = (ownedCrypto || []).find(c => c.cryptoId === crypto.id);
  const ownedQty = owned ? owned.quantity : 0;
  return Math.max(0, crypto.totalSupply - ownedQty);
};