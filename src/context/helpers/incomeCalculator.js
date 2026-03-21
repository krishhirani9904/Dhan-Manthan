// src/context/helpers/incomeCalculator.js

import { getCategoryById } from '../../data/businessCategories';
import {
  STAFF_TYPES, EQUIPMENT_TYPES, LICENSE_TYPES,
  INVENTORY_TYPES, BANK_SETTINGS_DEFAULTS
} from '../../data/businessRequirements';
import { STOCKS } from '../../data/stockMarket';
import { getPropertyRentalIncome } from '../../data/realEstate';

// ═══ Check if ALL required items are fulfilled for a specific outlet ═══
const checkOutletRequirements = (biz, outletIndex) => {
  const catId = biz.categoryId;
  const outletReqs = biz.outletRequirements?.[outletIndex];

  // Outlet 0 (first outlet) uses main biz staff/equipment etc.
  if (outletIndex === 0) {
    return checkMainRequirements(biz);
  }

  // Additional outlets check their own requirements
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

// ═══ Check main (outlet 0) requirements ═══
const checkMainRequirements = (biz) => {
  const catId = biz.categoryId;

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

// ═══ Check if ALL required items are fulfilled (backward compat) ═══
export const checkRequiredComplete = (biz) => {
  return checkMainRequirements(biz);
};

// ═══ Count active (requirements-met) outlets ═══
export const countActiveOutlets = (biz) => {
  const totalOutlets = biz.outlets || 1;
  let activeCount = 0;

  // Check outlet 0 (main)
  if (checkMainRequirements(biz)) {
    activeCount++;
  }

  // Check additional outlets
  for (let i = 1; i < totalOutlets; i++) {
    if (checkOutletRequirements(biz, i)) {
      activeCount++;
    }
  }

  return activeCount;
};

// ═══ Calculate single business income (all outlets) ═══
export const calcBusinessIncome = (biz) => {
  const cat = getCategoryById(biz.categoryId);
  const taxRate = cat?.taxRate || 0.03;
  const baseIncomePerOutlet = biz.incomePerHour || 0;

  // Count outlets that have requirements met
  const activeOutletCount = countActiveOutlets(biz);

  if (activeOutletCount === 0) return 0;

  let baseIncome = baseIncomePerOutlet * activeOutletCount;
  let totalBoostPercent = 0;

  // Vehicle income (shared across all outlets)
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
  const netIncome = Math.floor(grossIncome * (1 - taxRate));

  return netIncome;
};

// ═══ Get total outlet count for a category (for merger requirements) ═══
export const getTotalOutletsForCategory = (businesses, categoryId, subCategoryId) => {
  return (businesses || []).reduce((total, b) => {
    if (b.categoryId !== categoryId) return total;
    if (subCategoryId && b.subCategoryId !== subCategoryId) return total;
    return total + (b.outlets || 1);
  }, 0);
};

// ═══ Get total outlet count across all unique categories ═══
export const getUniqueCategoryCount = (businesses) => {
  const categories = new Set();
  (businesses || []).forEach(b => {
    categories.add(b.categoryId);
  });
  return categories.size;
};

// ═══ Calculate total portfolio value ═══
export const calcPortfolioValue = (state) => {
  let total = state.balance || 0;

  // Stock value
  (state.ownedStocks || []).forEach(st => {
    total += (st.quantity || 0) * (st.avgBuyPrice || 0);
  });

  // Crypto value
  (state.ownedCrypto || []).forEach(c => {
    total += (c.quantity || 0) * (c.avgBuyPrice || 0);
  });

  // Property value
  (state.ownedProperties || []).forEach(p => {
    total += p.purchasePrice || 0;
  });

  // Business value
  (state.ownedBusinesses || []).forEach(b => {
    total += b.cost || 0;
  });

  // Car value
  (state.ownedCars || []).forEach(c => {
    total += c.totalPrice || 0;
  });

  // Aircraft value
  (state.ownedAircraft || []).forEach(a => {
    total += a.totalPrice || 0;
  });

  // Yacht value
  (state.ownedYachts || []).forEach(y => {
    total += y.totalPrice || 0;
  });

  return total;
};

// ═══ Total business income ═══
export const recalcIncome = (businesses) => {
  return (businesses || []).reduce((sum, b) => sum + calcBusinessIncome(b), 0);
};

// ═══ Merger income ═══
export const recalcMergerIncome = (merged) => {
  return (merged || []).reduce((sum, m) => sum + (m.incomePerHour || 0), 0);
};

// ═══ Property rental income ═══
export const recalcPropertyIncome = (properties) => {
  return (properties || []).reduce((s, p) =>
    s + getPropertyRentalIncome(p.propertyId, p.improvements || []), 0);
};

// ═══ Stock dividend income ═══
export const recalcStockDividendIncome = (stocks) => {
  return (stocks || []).reduce((s, st) => {
    const def = STOCKS.find(d => d.id === st.stockId);
    if (!def || !def.dividendPercent) return s;
    const totalValue = st.quantity * st.avgBuyPrice;
    const annualDividend = totalValue * (def.dividendPercent / 100);
    return s + Math.floor(annualDividend / 8760);
  }, 0);
};

// ═══ Total income from all sources ═══
export const calcTotalIncome = (businesses, merged, properties, stocks) => {
  return recalcIncome(businesses) +
    recalcMergerIncome(merged) +
    recalcPropertyIncome(properties) +
    recalcStockDividendIncome(stocks);
};