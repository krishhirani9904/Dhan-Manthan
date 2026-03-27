// src/context/helpers/incomeCalculator.js

import { getCategoryById } from '../../data/businessCategories';
import {
  STAFF_TYPES, EQUIPMENT_TYPES, LICENSE_TYPES,
  INVENTORY_TYPES, BANK_SETTINGS_DEFAULTS,
  isFleetBased, isContractBased,
} from '../../data/businessRequirements';
import { STOCKS } from '../../data/stockMarket';
import { getPropertyRentalIncome } from '../../data/realEstate';
import { AIRLINE_STAFF } from '../../data/airlineData';
import { calcOilGasIncome } from '../../data/oilGasData';

// ═══════════════════════════════════════════════════════
// OUTLET-BASED REQUIREMENT CHECKS
// ═══════════════════════════════════════════════════════

const checkOutletRequirements = (biz, outletIndex) => {
  const catId = biz.categoryId;
  const outletReqs = biz.outletRequirements?.[outletIndex];

  if (outletIndex === 0) {
    return checkMainRequirements(biz);
  }

  if (!outletReqs) return false;

  const staffDefs = STAFF_TYPES[catId] || [];
  const requiredStaff = staffDefs.filter(s => s.required || s.min > 0);
  for (const s of requiredStaff) {
    const count = outletReqs.staff?.[s.id] || 0;
    const minNeeded = s.required ? Math.max(s.min || 1, 1) : (s.min || 0);
    if (count < minNeeded) return false;
  }

  const equipDefs = EQUIPMENT_TYPES[catId] || [];
  for (const e of equipDefs) {
    if (e.required && !(outletReqs.equipment?.[e.id])) return false;
  }

  const licenseDefs = LICENSE_TYPES[catId] || [];
  for (const l of licenseDefs) {
    if (l.required && !outletReqs.licenses?.[l.id]) return false;
  }

  const invDefs = INVENTORY_TYPES[catId] || [];
  for (const i of invDefs) {
    if (i.required && (outletReqs.inventory?.[i.id] || 0) <= 0) return false;
  }

  return true;
};

const checkMainRequirements = (biz) => {
  const catId = biz.categoryId;

  // Fleet-based businesses don't use main requirements for income
  if (isFleetBased(catId)) return true;
  if (isContractBased(catId)) return true;

  const staffDefs = STAFF_TYPES[catId] || [];
  const requiredStaff = staffDefs.filter(s => s.required || s.min > 0);
  for (const s of requiredStaff) {
    const count = biz.staff?.[s.id] || 0;
    const minNeeded = s.required ? Math.max(s.min || 1, 1) : (s.min || 0);
    if (count < minNeeded) return false;
  }

  const equipDefs = EQUIPMENT_TYPES[catId] || [];
  for (const e of equipDefs) {
    if (e.required && !(biz.equipment?.[e.id])) return false;
  }

  const licenseDefs = LICENSE_TYPES[catId] || [];
  for (const l of licenseDefs) {
    if (l.required && !biz.licenses?.[l.id]) return false;
  }

  const invDefs = INVENTORY_TYPES[catId] || [];
  for (const i of invDefs) {
    if (i.required && (biz.inventory?.[i.id] || 0) <= 0) return false;
  }

  return true;
};

export const checkRequiredComplete = (biz) => {
  return checkMainRequirements(biz);
};

// ═══ Check ALL outlets including outlet requirements for merge eligibility ═══
export const checkAllOutletsComplete = (biz) => {
  if (isFleetBased(biz.categoryId) || isContractBased(biz.categoryId)) {
    return checkMainRequirements(biz);
  }

  // Check main outlet
  if (!checkMainRequirements(biz)) return false;

  // Check all additional outlets
  const totalOutlets = biz.outlets || 1;
  for (let i = 1; i < totalOutlets; i++) {
    if (!checkOutletRequirements(biz, i)) return false;
  }

  return true;
};

// ═══════════════════════════════════════════════════════
// ACTIVE OUTLET / FLEET COUNTING
// ═══════════════════════════════════════════════════════

export const countActiveOutlets = (biz) => {
  // Fleet-based: return 1 if business exists (no outlet concept)
  if (isFleetBased(biz.categoryId) || isContractBased(biz.categoryId)) {
    return 1;
  }

  const totalOutlets = biz.outlets || 1;
  let activeCount = 0;

  if (checkMainRequirements(biz)) {
    activeCount++;
  }

  for (let i = 1; i < totalOutlets; i++) {
    if (checkOutletRequirements(biz, i)) {
      activeCount++;
    }
  }

  return activeCount;
};

// ═══ Count active fleet vehicles ═══
export const countActiveFleetVehicles = (biz) => {
  if (!biz.fleet) return 0;
  return (biz.fleet.vehicles || []).filter(v => v.active).length;
};

// ═══════════════════════════════════════════════════════
// INCOME CALCULATION
// ═══════════════════════════════════════════════════════

export const calcBusinessIncome = (biz) => {
  const cat = getCategoryById(biz.categoryId);
  const taxRate = cat?.taxRate || 0.03;

  // ─── FLEET-BASED (Taxi / Shipping) ───
  if (isFleetBased(biz.categoryId) && biz.categoryId !== 'airlines') {
    return calcFleetIncome(biz, taxRate);
  }

  // ─── AIRLINE ───
  if (biz.categoryId === 'airlines') {
    return calcAirlineIncomeTotal(biz, taxRate);
  }

  // ─── CONTRACT-BASED (Oil & Gas) ───
  if (isContractBased(biz.categoryId)) {
    return calcOilGasIncomeTotal(biz, taxRate);
  }

  // ─── STANDARD OUTLET-BASED ───
  return calcOutletIncome(biz, taxRate);
};

// ═══ Fleet Income (Taxi / Shipping) ═══
const calcFleetIncome = (biz, taxRate) => {
  if (!biz.fleet) return 0;

  let baseIncome = 0;
  let totalBoostPercent = 0;

  // Active vehicles contribute income
  (biz.fleet.vehicles || []).forEach(v => {
    if (v.active) baseIncome += v.incomePerHour || 0;
  });

  if (baseIncome === 0) return 0;

  // Staff boost
  const staffDefs = STAFF_TYPES[biz.categoryId] || [];
  for (const [staffId, count] of Object.entries(biz.staff || {})) {
    const def = staffDefs.find(s => s.id === staffId);
    if (def && count > 0) totalBoostPercent += def.incomeBoost * count;
  }

  // License boost
  const licenseDefs = LICENSE_TYPES[biz.categoryId] || [];
  const optionalLicenses = licenseDefs.filter(l => !l.required);
  const obtainedOptional = optionalLicenses.filter(l => biz.licenses?.[l.id]).length;
  totalBoostPercent += obtainedOptional * 5;

  // Per-business ad boost
  if (biz.bizAdBoostEndTime && Date.now() < biz.bizAdBoostEndTime) {
    totalBoostPercent += biz.bizAdBoostPercent || 15;
  }

  const boostMultiplier = Math.max(0.1, 1 + totalBoostPercent / 100);
  const grossIncome = Math.floor(baseIncome * boostMultiplier);
  return Math.floor(grossIncome * (1 - taxRate));
};

// ═══ Airline Income ═══
const calcAirlineIncomeTotal = (biz, taxRate) => {
  if (!biz.airline) return 0;

  let baseIncome = 0;
  let totalBoostPercent = 0;

  // Active flights income
  (biz.airline.activeFlights || []).forEach(flight => {
    if (flight.endTime && Date.now() < flight.endTime) {
      baseIncome += flight.incomePerHour || 0;
    }
  });

  // Staff boost
  const staff = biz.airline?.staff || {};
  (AIRLINE_STAFF || []).forEach(s => {
    const count = staff[s.id] || 0;
    if (count > 0) totalBoostPercent += s.incomeBoost * count;
  });

  // Required license boost
  const licenseCount = (biz.airline?.licenses || []).length;
  totalBoostPercent += licenseCount * 3;

  // Hub boost
  const hubCount = (biz.airline?.hubs || []).length;
  totalBoostPercent += hubCount * 5;

  // Per-business ad boost
  if (biz.bizAdBoostEndTime && Date.now() < biz.bizAdBoostEndTime) {
    totalBoostPercent += biz.bizAdBoostPercent || 15;
  }

  const boostMultiplier = Math.max(0.1, 1 + totalBoostPercent / 100);
  const grossIncome = Math.floor(baseIncome * boostMultiplier);
  return Math.floor(grossIncome * (1 - taxRate));
};

// ═══ Oil & Gas Income ═══
const calcOilGasIncomeTotal = (biz, taxRate) => {
  if (!biz.oilgas) return 0;

  let baseIncome = calcOilGasIncome(biz);
  let totalBoostPercent = 0;

  // Staff boost
  const staffDefs = STAFF_TYPES[biz.categoryId] || [];
  for (const [staffId, count] of Object.entries(biz.staff || {})) {
    const def = staffDefs.find(s => s.id === staffId);
    if (def && count > 0) totalBoostPercent += def.incomeBoost * count;
  }

  // Equipment boost
  const equipDefs = EQUIPMENT_TYPES[biz.categoryId] || [];
  for (const [equipId, count] of Object.entries(biz.equipment || {})) {
    const def = equipDefs.find(e => e.id === equipId);
    if (def && count > 0) totalBoostPercent += def.incomeBoost * count;
  }

  // License boost
  const licenseDefs = LICENSE_TYPES[biz.categoryId] || [];
  const optionalLicenses = licenseDefs.filter(l => !l.required);
  const obtainedOptional = optionalLicenses.filter(l => biz.licenses?.[l.id]).length;
  totalBoostPercent += obtainedOptional * 5;

  // Per-business ad boost
  if (biz.bizAdBoostEndTime && Date.now() < biz.bizAdBoostEndTime) {
    totalBoostPercent += biz.bizAdBoostPercent || 15;
  }

  const boostMultiplier = Math.max(0.1, 1 + totalBoostPercent / 100);
  const grossIncome = Math.floor(baseIncome * boostMultiplier);
  return Math.floor(grossIncome * (1 - taxRate));
};

// ═══ Standard Outlet-Based Income ═══
const calcOutletIncome = (biz, taxRate) => {
  const baseIncomePerOutlet = biz.incomePerHour || 0;
  const activeOutletCount = countActiveOutlets(biz);

  if (activeOutletCount === 0) return 0;

  let baseIncome = baseIncomePerOutlet * activeOutletCount;
  let totalBoostPercent = 0;

  // Vehicle income (shared across all outlets - legacy)
  if (biz.vehicles && Array.isArray(biz.vehicles)) {
    biz.vehicles.forEach(v => {
      if (v.active) baseIncome += v.incomePerHour || 0;
    });
  }

  // Staff boost (main outlet staff)
  if (biz.staff && Object.keys(biz.staff).length > 0) {
    const staffDefs = STAFF_TYPES[biz.categoryId] || [];
    for (const [staffId, count] of Object.entries(biz.staff)) {
      const def = staffDefs.find(s => s.id === staffId);
      if (def && count > 0) totalBoostPercent += def.incomeBoost * count;
    }
  }

  // Additional outlet staff boosts
  const outletReqs = biz.outletRequirements || {};
  for (const [outletIdx, reqs] of Object.entries(outletReqs)) {
    if (!checkOutletRequirements(biz, parseInt(outletIdx))) continue;
    const staffDefs = STAFF_TYPES[biz.categoryId] || [];
    for (const [staffId, count] of Object.entries(reqs.staff || {})) {
      const def = staffDefs.find(s => s.id === staffId);
      if (def && count > 0) totalBoostPercent += def.incomeBoost * count;
    }
  }

  // Equipment boost
  if (biz.equipment && Object.keys(biz.equipment).length > 0) {
    const equipDefs = EQUIPMENT_TYPES[biz.categoryId] || [];
    for (const [equipId, count] of Object.entries(biz.equipment)) {
      const def = equipDefs.find(e => e.id === equipId);
      if (def && count > 0) totalBoostPercent += def.incomeBoost * count;
    }
  }

  // Optional license boost
  const licenseDefs = LICENSE_TYPES[biz.categoryId] || [];
  const optionalLicenses = licenseDefs.filter(l => !l.required);
  if (optionalLicenses.length > 0) {
    const obtainedOptional = optionalLicenses.filter(l => biz.licenses?.[l.id]).length;
    totalBoostPercent += obtainedOptional * 5;
  }

  // Optional inventory boost
  const invDefs = INVENTORY_TYPES[biz.categoryId] || [];
  const optionalInv = invDefs.filter(i => !i.required);
  if (optionalInv.length > 0) {
    const stockedOptional = optionalInv.filter(i => (biz.inventory?.[i.id] || 0) > 0).length;
    totalBoostPercent += stockedOptional * 3;
  }

  // Bank settings boost
  if (biz.categoryId === 'bank') {
    const settings = biz.bankSettings || {};
    const loanRate = settings.loanRate ?? BANK_SETTINGS_DEFAULTS.loanRate;
    const savingsRate = settings.savingsRate ?? BANK_SETTINGS_DEFAULTS.savingsRate;
    totalBoostPercent += (loanRate - BANK_SETTINGS_DEFAULTS.loanRate) * 2;
    totalBoostPercent -= (savingsRate - BANK_SETTINGS_DEFAULTS.savingsRate) * 3;
    const facilities = settings.facilities || {};
    totalBoostPercent += Object.values(facilities).filter(Boolean).length * 5;
  }

  // Per-business ad boost
  if (biz.bizAdBoostEndTime && Date.now() < biz.bizAdBoostEndTime) {
    totalBoostPercent += biz.bizAdBoostPercent || 15;
  }

  const boostMultiplier = Math.max(0.1, 1 + totalBoostPercent / 100);
  const grossIncome = Math.floor(baseIncome * boostMultiplier);
  return Math.floor(grossIncome * (1 - taxRate));
};

// ═══════════════════════════════════════════════════════
// MERGER REQUIREMENT HELPERS
// ═══════════════════════════════════════════════════════

// For fleet-based: count vehicles instead of outlets
export const getMergerCountForBusiness = (biz) => {
  if (isFleetBased(biz.categoryId) && biz.categoryId !== 'airlines') {
    return countActiveFleetVehicles(biz);
  }
  if (biz.categoryId === 'airlines') {
    return (biz.airline?.aircraft || []).filter(a => a.active).length;
  }
  if (isContractBased(biz.categoryId)) {
    // Count active wells + vehicles
    const oilWells = (biz.oilgas?.wells?.oil || []).filter(w => w.active).length;
    const gasWells = (biz.oilgas?.wells?.gas || []).filter(w => w.active).length;
    return oilWells + gasWells;
  }
  return biz.outlets || 1;
};

export const getTotalOutletsForCategory = (businesses, categoryId, subCategoryId) => {
  return (businesses || []).reduce((total, b) => {
    if (b.categoryId !== categoryId) return total;
    if (subCategoryId && b.subCategoryId !== subCategoryId) return total;

    // Check if all requirements are met for this business
    if (!checkAllOutletsComplete(b)) return total;

    return total + getMergerCountForBusiness(b);
  }, 0);
};

export const getUniqueCategoryCount = (businesses) => {
  const categories = new Set();
  (businesses || []).forEach(b => {
    // Only count businesses with complete requirements
    if (checkAllOutletsComplete(b)) {
      categories.add(b.categoryId);
    }
  });
  return categories.size;
};

// ═══════════════════════════════════════════════════════
// PORTFOLIO & TOTAL INCOME
// ═══════════════════════════════════════════════════════

export const calcPortfolioValue = (state) => {
  let total = state.balance || 0;

  (state.ownedStocks || []).forEach(st => {
    total += (st.quantity || 0) * (st.avgBuyPrice || 0);
  });

  (state.ownedCrypto || []).forEach(c => {
    total += (c.quantity || 0) * (c.avgBuyPrice || 0);
  });

  (state.ownedProperties || []).forEach(p => {
    total += p.purchasePrice || 0;
  });

  (state.ownedBusinesses || []).forEach(b => {
    total += b.cost || 0;
  });

  (state.ownedCars || []).forEach(c => {
    total += c.totalPrice || 0;
  });

  (state.ownedAircraft || []).forEach(a => {
    total += a.totalPrice || 0;
  });

  (state.ownedYachts || []).forEach(y => {
    total += y.totalPrice || 0;
  });

  return total;
};

export const recalcIncome = (businesses) => {
  return (businesses || []).reduce((sum, b) => sum + calcBusinessIncome(b), 0);
};

export const recalcMergerIncome = (merged) => {
  return (merged || []).reduce((sum, m) => sum + (m.incomePerHour || 0), 0);
};

export const recalcPropertyIncome = (properties) => {
  return (properties || []).reduce((s, p) =>
    s + getPropertyRentalIncome(p.propertyId, p.improvements || []), 0);
};

export const recalcStockDividendIncome = (stocks) => {
  return (stocks || []).reduce((s, st) => {
    const def = STOCKS.find(d => d.id === st.stockId);
    if (!def || !def.dividendPercent) return s;
    const totalValue = st.quantity * st.avgBuyPrice;
    const annualDividend = totalValue * (def.dividendPercent / 100);
    return s + Math.floor(annualDividend / 8760);
  }, 0);
};

export const calcTotalIncome = (businesses, merged, properties, stocks) => {
  return recalcIncome(businesses) +
    recalcMergerIncome(merged) +
    recalcPropertyIncome(properties) +
    recalcStockDividendIncome(stocks);
};