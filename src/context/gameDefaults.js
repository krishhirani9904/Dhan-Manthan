// src/context/gameDefaults.js

import { EARNINGS_DEFAULTS } from './EarningsContext';
import { calcTotalIncome } from './helpers/incomeCalculator';

export const DEFAULTS = {
  balance: 1000000000000000,
  activeCardId: 'base',
  cardNumber: '1042',

  // Earnings state (managed by EarningsContext, stored here)
  earningsState: { ...EARNINGS_DEFAULTS },

  // Business
  ownedBusinesses: [],
  mergedBusinesses: [],
  activeMergerFlows: [],
  incomePerHour: 0,
  bizBoostActive: false,
  bizBoostPercent: 0,
  bizBoostEndTime: null,

  // Investing
  ownedStocks: [],
  ownedProperties: [],
  ownedCrypto: [],
  priceSeed: Date.now(),

  // Items
  ownedCars: [],
  ownedAircraft: [],
  ownedYachts: [],
  ownedCollections: {},
  ownedNFTs: [],
  ownedIslands: [],
  earnedInsignias: [],
};

// ═══ Normalize saved business data ═══
export const normalizeBusiness = (b) => ({
  ...b,
  level: b.level || 1,
  totalEarnings: b.totalEarnings || 0,
  outlets: b.outlets || 1,
  expansionEndTime: b.expansionEndTime || null,
  bizAdBoostEndTime: b.bizAdBoostEndTime || null,
  bizAdBoostPercent: b.bizAdBoostPercent || 0,
  staff: b.staff || {},
  vehicles: b.vehicles || [],
  equipment: b.equipment || {},
  inventory: b.inventory || {},
  licenses: b.licenses || {},
  locations: b.locations || 1,
  branches: b.branches || 0,
  resources: b.resources || {},
  projects: b.projects || [],
  bankSettings: b.bankSettings || null,
  parkingExpansions: b.parkingExpansions || 0,
  outletRequirements: b.outletRequirements || {},
});

// ═══ Normalize saved merger flow data ═══
export const normalizeMergerFlow = (f) => ({
  ...f,
  phases: f.phases || [],
  configuration: f.configuration || null,
  configScore: f.configScore || null,
  selectedTrend: f.selectedTrend || null,
  configTimerEndTime: f.configTimerEndTime || null,
  configCompleted: f.configCompleted || false,
  mergerAdBoostEndTime: f.mergerAdBoostEndTime || null,
  mergerAdBoostPercent: f.mergerAdBoostPercent || 0,
});

// ═══ Normalize saved property data ═══
export const normalizeProperty = (p) => ({
  ...p,
  improvements: p.improvements || [],
});

// ═══ Build initial state from saved data ═══
export const buildInitialState = (saved) => {
  if (!saved) return { ...DEFAULTS };

  const businesses = (saved.ownedBusinesses || []).map(normalizeBusiness);
  const merged = saved.mergedBusinesses || [];
  const properties = (saved.ownedProperties || []).map(normalizeProperty);
  const stocks = saved.ownedStocks || [];
  const mergerFlows = (saved.activeMergerFlows || []).map(normalizeMergerFlow);

  return {
    ...DEFAULTS,
    ...saved,
    ownedBusinesses: businesses,
    mergedBusinesses: merged,
    activeMergerFlows: mergerFlows,
    ownedProperties: properties,
    ownedStocks: stocks,
    ownedCrypto: saved.ownedCrypto || [],
    ownedCars: saved.ownedCars || [],
    ownedAircraft: saved.ownedAircraft || [],
    ownedYachts: saved.ownedYachts || [],
    ownedCollections: saved.ownedCollections || {},
    ownedNFTs: saved.ownedNFTs || [],
    ownedIslands: saved.ownedIslands || [],
    earnedInsignias: saved.earnedInsignias || [],
    earningsState: saved.earningsState || { ...EARNINGS_DEFAULTS },
    incomePerHour: calcTotalIncome(businesses, merged, properties, stocks),
    bizBoostActive: false,
    bizBoostPercent: saved.bizBoostPercent || 0,
    bizBoostEndTime: saved.bizBoostEndTime || null,
    cardNumber: saved.cardNumber || '1042',
    priceSeed: saved.priceSeed || Date.now(),
  };
};