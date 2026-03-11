export const STOCK_CATEGORIES = {
  STABLE: 'stable',
  GROWTH: 'growth',
};

export const STOCKS = [
  {
    id: 'relianss',
    name: 'Relianss Industries',
    ticker: 'RELI',
    icon: '🏭',
    category: STOCK_CATEGORIES.STABLE,
    price: 2500,
    dividendPercent: 4.5,
    volatility: 0.02,
    description: 'Largest conglomerate',
    capitalization: 1702200000000,
    totalShares: 67700000000,
  },
  {
    id: 'hdcc_bank',
    name: 'HDCC Bank',
    ticker: 'HDCC',
    icon: '🏦',
    category: STOCK_CATEGORIES.STABLE,
    price: 1600,
    dividendPercent: 5.2,
    volatility: 0.015,
    description: 'Leading private sector bank',
    capitalization: 1215000000000,
    totalShares: 75900000000,
  },
  {
    id: 'itk',
    name: 'ITK Limited',
    ticker: 'ITK',
    icon: '🏢',
    category: STOCK_CATEGORIES.STABLE,
    price: 450,
    dividendPercent: 6.8,
    volatility: 0.01,
    description: 'Diversified conglomerate with high dividends',
    capitalization: 561000000000,
    totalShares: 124700000000,
  },
  {
    id: 'kohl_india',
    name: 'Kohl India',
    ticker: 'KOHL',
    icon: '⛏️',
    category: STOCK_CATEGORIES.STABLE,
    price: 250,
    dividendPercent: 8.2,
    volatility: 0.02,
    description: 'Largest coal producer',
    capitalization: 154000000000,
    totalShares: 61600000000,
  },
  {
    id: 'powergriid',
    name: 'PowerGriid Corp',
    ticker: 'PWGR',
    icon: '⚡',
    category: STOCK_CATEGORIES.STABLE,
    price: 300,
    dividendPercent: 7.5,
    volatility: 0.012,
    description: 'Central transmission utility',
    capitalization: 279000000000,
    totalShares: 93000000000,
  },
  {
    id: 'ongg',
    name: 'ONGG',
    ticker: 'ONGG',
    icon: '🛢️',
    category: STOCK_CATEGORIES.STABLE,
    price: 200,
    dividendPercent: 7.0,
    volatility: 0.025,
    description: 'Largest crude oil producer',
    capitalization: 252000000000,
    totalShares: 126000000000,
  },
  {
    id: 'taata_steel',
    name: 'Taata Steel',
    ticker: 'TATA',
    icon: '🔩',
    category: STOCK_CATEGORIES.STABLE,
    price: 130,
    dividendPercent: 5.5,
    volatility: 0.03,
    description: 'Global steel company',
    capitalization: 159000000000,
    totalShares: 122300000000,
  },
  {
    id: 'tks',
    name: 'TKS',
    ticker: 'TKS',
    icon: '💻',
    category: STOCK_CATEGORIES.GROWTH,
    price: 3800,
    dividendPercent: 1.2,
    volatility: 0.035,
    description: 'Largest IT services company',
    capitalization: 1389000000000,
    totalShares: 36600000000,
  },
  {
    id: 'infosyss',
    name: 'Infosyss',
    ticker: 'INFY',
    icon: '🖥️',
    category: STOCK_CATEGORIES.GROWTH,
    price: 1500,
    dividendPercent: 2.0,
    volatility: 0.04,
    description: 'Global leader in digital services',
    capitalization: 622000000000,
    totalShares: 41500000000,
  },
  {
    id: 'wiproo',
    name: 'Wiproo',
    ticker: 'WPRO',
    icon: '🌐',
    category: STOCK_CATEGORIES.GROWTH,
    price: 450,
    dividendPercent: 1.5,
    volatility: 0.045,
    description: 'Leading global IT consulting',
    capitalization: 234000000000,
    totalShares: 52000000000,
  },
  {
    id: 'adaani_green',
    name: 'Adaani Green Energy',
    ticker: 'ADGR',
    icon: '🌱',
    category: STOCK_CATEGORIES.GROWTH,
    price: 1800,
    dividendPercent: 0.5,
    volatility: 0.08,
    description: 'Largest solar power developer',
    capitalization: 285000000000,
    totalShares: 15800000000,
  },
  {
    id: 'baajaj_fin',
    name: 'Baajaj Finance',
    ticker: 'BAJF',
    icon: '💳',
    category: STOCK_CATEGORIES.GROWTH,
    price: 7200,
    dividendPercent: 0.8,
    volatility: 0.05,
    description: 'Leading NBFC with massive growth',
    capitalization: 445000000000,
    totalShares: 6180000000,
  },
  {
    id: 'asiaan_paints',
    name: 'Asiaan Paints',
    ticker: 'ASPN',
    icon: '🎨',
    category: STOCK_CATEGORIES.GROWTH,
    price: 3200,
    dividendPercent: 1.0,
    volatility: 0.03,
    description: 'Leading paint company',
    capitalization: 307000000000,
    totalShares: 9590000000,
  },
  {
    id: 'avenuu',
    name: 'Avenuu Supermarts',
    ticker: 'AVNU',
    icon: '🛒',
    category: STOCK_CATEGORIES.GROWTH,
    price: 4500,
    dividendPercent: 0.3,
    volatility: 0.04,
    description: 'Retail chain operator',
    capitalization: 292000000000,
    totalShares: 6490000000,
  },
  {
    id: 'zomatto',
    name: 'Zomatto',
    ticker: 'ZMTO',
    icon: '🍔',
    category: STOCK_CATEGORIES.GROWTH,
    price: 180,
    dividendPercent: 0,
    volatility: 0.07,
    description: 'Food delivery & quick commerce',
    capitalization: 159000000000,
    totalShares: 88300000000,
  },
  {
    id: 'payttm',
    name: 'Payttm',
    ticker: 'PYTM',
    icon: '📱',
    category: STOCK_CATEGORIES.GROWTH,
    price: 800,
    dividendPercent: 0,
    volatility: 0.09,
    description: 'Digital payments & financial services',
    capitalization: 51000000000,
    totalShares: 6370000000,
  },
  {
    id: 'nyykaa',
    name: 'Nyykaa',
    ticker: 'NYKA',
    icon: '💄',
    category: STOCK_CATEGORIES.GROWTH,
    price: 180,
    dividendPercent: 0,
    volatility: 0.06,
    description: 'Beauty & fashion e-commerce',
    capitalization: 52000000000,
    totalShares: 28900000000,
  },
  {
    id: 'irctk',
    name: 'IRCTK',
    ticker: 'IRCK',
    icon: '🚂',
    category: STOCK_CATEGORIES.GROWTH,
    price: 900,
    dividendPercent: 1.5,
    volatility: 0.04,
    description: 'Railway catering & tourism',
    capitalization: 72000000000,
    totalShares: 8000000000,
  },
  {
    id: 'titaan',
    name: 'Titaan Company',
    ticker: 'TITN',
    icon: '⌚',
    category: STOCK_CATEGORIES.GROWTH,
    price: 3500,
    dividendPercent: 0.5,
    volatility: 0.035,
    description: 'Watches, jewellery & eyewear',
    capitalization: 310000000000,
    totalShares: 8870000000,
  },
];

// FIXED: Deterministic price with smooth variation
export const getSimulatedPrice = (stock, seed) => {
  const base = stock.price;
  const vol = stock.volatility;
  const s = seed / 30000; // normalize to ~30s intervals
  const variation =
    Math.sin(s * 0.7 + stock.id.length * 3.14) * vol * 0.6 +
    Math.cos(s * 0.3 + stock.id.length * 1.57) * vol * 0.4;
  return Math.max(1, Math.floor(base * (1 + variation)));
};

// FIXED: Compare to previous 30s interval for meaningful change
export const getPriceChange = (stock, seed) => {
  const current = getSimulatedPrice(stock, seed);
  const prev = getSimulatedPrice(stock, seed - 30000);
  const change = current - prev;
  const pct = prev > 0 ? ((change / prev) * 100) : 0;
  return { change, pct, isUp: change >= 0 };
};

export const getAvailableShares = (stock, ownedStocks) => {
  const owned = (ownedStocks || []).find(s => s.stockId === stock.id);
  const ownedQty = owned ? owned.quantity : 0;
  return Math.max(0, stock.totalShares - ownedQty);
};

export const getSharePercent = (stock, quantity) => {
  if (!stock.totalShares || stock.totalShares === 0) return 0;
  return (quantity / stock.totalShares) * 100;
};

export const getStableStocks = () => STOCKS.filter(s => s.category === STOCK_CATEGORIES.STABLE);
export const getGrowthStocks = () => STOCKS.filter(s => s.category === STOCK_CATEGORIES.GROWTH);