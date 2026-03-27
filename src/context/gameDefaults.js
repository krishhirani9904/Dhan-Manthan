// src/context/gameDefaults.js

import { EARNINGS_DEFAULTS } from './EarningsContext';
import { calcTotalIncome } from './helpers/incomeCalculator';

export const DEFAULTS = {
  balance: 1000000000000000,
  activeCardId: 'base',
  cardNumber: '1042',

  // Earnings state
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

// ═══ Normalize fleet data for taxi/shipping ═══
const normalizeFleet = (fleet) => {
  if (!fleet) return null;
  return {
    capacity: fleet.capacity || 5,
    expansionEndTime: fleet.expansionEndTime || null,
    expansionSlots: fleet.expansionSlots || 0,
    expansionCount: fleet.expansionCount || 0,
    vehicles: (fleet.vehicles || []).map(v => ({
      ...v,
      kmDriven: v.kmDriven || 0,
      active: v.active !== false,
      purchasedAt: v.purchasedAt || Date.now(),
    })),
  };
};

// ═══ Normalize airline data ═══
const normalizeAirline = (airline) => {
  if (!airline) return null;
  return {
    licenses: airline.licenses || [],
    hubs: airline.hubs || [],
    aircraft: (airline.aircraft || []).map(a => ({
      ...a,
      active: a.active !== false,
      flightCount: a.flightCount || 0,
    })),
    activeFlights: (airline.activeFlights || []).filter(f =>
      f.endTime && Date.now() < f.endTime
    ),
    staff: airline.staff || {},
  };
};

// ═══ Normalize oil & gas data ═══
const normalizeOilGas = (oilgas) => {
  if (!oilgas) return null;
  return {
    wells: {
      oil: (oilgas.wells?.oil || []).map(w => ({
        ...w,
        active: w.active !== false,
        daysActive: w.daysActive || 0,
      })),
      gas: (oilgas.wells?.gas || []).map(w => ({
        ...w,
        active: w.active !== false,
        daysActive: w.daysActive || 0,
      })),
    },
    stock: {
      oil: oilgas.stock?.oil || 0,
      gas: oilgas.stock?.gas || 0,
    },
    activeContract: oilgas.activeContract || null,
    completedContracts: oilgas.completedContracts || 0,
  };
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
  // Fleet-based (taxi/shipping)
  fleet: normalizeFleet(b.fleet),
  // Airline
  airline: normalizeAirline(b.airline),
  // Oil & Gas
  oilgas: normalizeOilGas(b.oilgas),
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