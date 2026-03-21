export const APP_NAME = 'Dhan-Manthan';
export const APP_TAGLINE = 'Paisa Hi Paisa';
export const STORAGE_KEY = 'dhanmanthan_save';
export const BOOST_STORAGE_KEY = 'dhanmanthan_boost_state';
export const THEME_KEY = 'dhanmanthan_theme';

// ═══════════════════════════════════════
// EARNINGS SYSTEM — BALANCED PROGRESSION
// ═══════════════════════════════════════

export const INITIAL_PER_CLICK = 1;
export const INITIAL_UPGRADE_COST = 30;
export const MAX_PER_CLICK = 100000;
export const MAX_TAP_LEVEL = 50;

// Progression: per click grows FASTER, cost grows SLOWER
// Target: Level 50 = ₹1,00,000/click
export const UPGRADE_CONFIG = {
  // Per click: generous increments that scale well
  phase1: { maxLevel: 10, baseIncrement: 8,    growthRate: 1.35 },   // Lv1-10:  ₹1 → ~₹200
  phase2: { maxLevel: 20, baseIncrement: 80,   growthRate: 1.30 },   // Lv11-20: → ~₹2,500
  phase3: { maxLevel: 30, baseIncrement: 400,  growthRate: 1.28 },   // Lv21-30: → ~₹12,000
  phase4: { maxLevel: 40, baseIncrement: 1500, growthRate: 1.22 },   // Lv31-40: → ~₹45,000
  phase5: { maxLevel: 50, baseIncrement: 4000, growthRate: 1.15 },   // Lv41-50: → ₹1,00,000

  // Cost: moderate growth — always achievable with gameplay
  costBase: 30,
  costMultiplier: 1.65,
};

// ═══════════════════════════════════════
// AD & BOOST SYSTEM
// ═══════════════════════════════════════

export const AD_WATCH_TIME = 2;
export const CLICK_BOOST_MULTIPLIER = 2;
export const CLICK_BOOST_DURATION = 30;

// ═══════════════════════════════════════
// BUSINESS SYSTEM
// ═══════════════════════════════════════

export const BUSINESS_INCOME_RATE = 0.05;
export const RENAME_COST = 500;
export const CLOSE_REFUND_NORMAL = 0.6;
export const CLOSE_REFUND_AD = 1.0;
export const MAX_BUSINESS_LEVEL = 10;
export const BIZ_BOOST_PERCENT = 15;
export const BIZ_BOOST_DURATION = 4 * 60 * 60;

// ═══════════════════════════════════════
// OTHER SYSTEMS
// ═══════════════════════════════════════

export const MAX_OFFLINE_HOURS = 4;
export const PROPERTY_SELL_TAX = 0.12;
export const DIVIDEND_PERIOD_HOURS = 3;
export const CAR_SELL_PERCENT = 0.70;
export const AIRCRAFT_SELL_PERCENT = 0.65;
export const YACHT_SELL_PERCENT = 0.70;
export const COLLECTION_SELL_PERCENT = 0.75;
export const BOOST_STATE_VERSION = 1;

export const LEVEL_LABELS = [
  'Startup', 'Growing', 'Established', 'Popular', 'Thriving',
  'Renowned', 'Elite', 'Premium', 'Legendary', 'Empire'
];