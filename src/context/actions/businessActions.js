// src/context/actions/businessActions.js

import { getCategoryById } from '../../data/businessCategories';
import { calcTotalIncome } from '../helpers/incomeCalculator';
import { generateId } from '../../utils/helpers';
import {
  BUSINESS_INCOME_RATE, RENAME_COST,
  CLOSE_REFUND_NORMAL, CLOSE_REFUND_AD, MAX_BUSINESS_LEVEL
} from '../../config/constants';

export const createBusinessActions = (setState) => {

  // ═══ BUY BUSINESS — Always creates NEW separate business ═══
  const buyBusiness = (info) => {
    setState(p => {
      if (p.balance < info.cost) return p;

      const newBiz = {
        id: generateId('biz'),
        name: info.name,
        categoryId: info.categoryId,
        subCategoryId: info.subCategoryId || null,
        categoryName: info.categoryName || '',
        subCategoryName: info.subCategoryName || '',
        cost: info.cost,
        incomePerHour: Math.floor(info.cost * BUSINESS_INCOME_RATE),
        purchasedAt: Date.now(),
        level: 1,
        totalEarnings: 0,
        outlets: 1,
        expansionEndTime: null,
        bizAdBoostEndTime: null,
        bizAdBoostPercent: 0,
        staff: {},
        vehicles: [],
        equipment: {},
        inventory: {},
        licenses: {},
        locations: 1,
        branches: 0,
        resources: {},
        projects: [],
        bankSettings: null,
        parkingExpansions: 0,
        outletRequirements: {},
      };

      const newOwned = [newBiz, ...p.ownedBusinesses];
      return {
        ...p,
        balance: p.balance - info.cost,
        ownedBusinesses: newOwned,
        incomePerHour: calcTotalIncome(
          newOwned, p.mergedBusinesses, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  };

  // ═══ GET EXPANSION COST (scales with outlets) ═══
  const getExpansionCost = (bizId, ownedBusinesses) => {
    const biz = (ownedBusinesses || []).find(b => b.id === bizId);
    if (!biz) return 0;
    const cat = getCategoryById(biz.categoryId);
    const outlets = biz.outlets || 1;
    const baseCost = cat?.expansionBase || biz.cost * 0.3;
    return Math.floor(baseCost * Math.pow(1.5, outlets - 1));
  };

  // ═══ GET EXPANSION TIME (increases with outlets) ═══
  const getExpansionTime = (biz) => {
    const cat = getCategoryById(biz.categoryId);
    const baseTime = cat?.expansionTime || 2400; // seconds
    const outlets = biz.outlets || 1;
    // Each outlet adds 33% more time
    return Math.floor(baseTime * (1 + (outlets - 1) * 0.33));
  };

  // ═══ START EXPANSION (Open New Outlet) ═══
  const startExpansion = (bizId) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz || biz.level >= MAX_BUSINESS_LEVEL || biz.expansionEndTime) return p;

      const cost = getExpansionCost(bizId, p.ownedBusinesses);
      if (p.balance < cost) return p;

      const duration = getExpansionTime(biz) * 1000;
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, expansionEndTime: Date.now() + duration } : b
      );
      return { ...p, balance: p.balance - cost, ownedBusinesses: updated };
    });
  };

  // ═══ SKIP EXPANSION (Ad Watch) ═══
  const skipExpansion = (bizId) => {
    setState(p => {
      const updated = p.ownedBusinesses.map(biz => {
        if (biz.id !== bizId || !biz.expansionEndTime) return biz;
        const cat = getCategoryById(biz.categoryId);
        const growth = cat?.profitGrowthPercent || 15;
        const newOutlets = (biz.outlets || 1) + 1;
        return {
          ...biz,
          level: Math.min((biz.level || 1) + 1, MAX_BUSINESS_LEVEL),
          outlets: newOutlets,
          incomePerHour: Math.floor(biz.incomePerHour * (1 + growth / 100)),
          expansionEndTime: null,
          outletRequirements: {
            ...(biz.outletRequirements || {}),
            [newOutlets - 1]: {
              staff: {},
              equipment: {},
              licenses: {},
              inventory: {},
            },
          },
        };
      });
      return {
        ...p,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(
          updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  };

  // ═══ RENAME BUSINESS ═══
  const renameBusiness = (bizId, newName) => {
    setState(p => {
      if (p.balance < RENAME_COST || !newName?.trim() || newName.trim().length < 2) return p;
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, name: newName.trim() } : b
      );
      return { ...p, balance: p.balance - RENAME_COST, ownedBusinesses: updated };
    });
  };

  // ═══ CLOSE BUSINESS ═══
  const closeBusiness = (bizId, fullRefund = false) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz) return p;
      const refund = Math.floor(biz.cost * (fullRefund ? CLOSE_REFUND_AD : CLOSE_REFUND_NORMAL));
      const updated = p.ownedBusinesses.filter(b => b.id !== bizId);
      return {
        ...p,
        balance: p.balance + refund,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(
          updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  };

  // ═══ PER-BUSINESS AD BOOST ═══
  const startBizAdBoost = (bizId, percent = 15, hours = 4) => {
    setState(p => {
      const endTime = Date.now() + hours * 3600 * 1000;
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, bizAdBoostEndTime: endTime, bizAdBoostPercent: percent } : b
      );
      return { ...p, ownedBusinesses: updated };
    });
  };

  // ═══ HIRE STAFF FOR OUTLET ═══
  const hireOutletStaff = (bizId, outletIndex, staffType, count, totalCost) => {
    setState(p => {
      if (p.balance < totalCost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const outletReqs = { ...(b.outletRequirements || {}) };
        const outlet = { ...(outletReqs[outletIndex] || { staff: {}, equipment: {}, licenses: {}, inventory: {} }) };
        const staff = { ...outlet.staff };
        staff[staffType] = (staff[staffType] || 0) + count;
        outlet.staff = staff;
        outletReqs[outletIndex] = outlet;
        return { ...b, outletRequirements: outletReqs };
      });
      return {
        ...p,
        balance: p.balance - totalCost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  // ═══ BUY EQUIPMENT FOR OUTLET ═══
  const buyOutletEquipment = (bizId, outletIndex, equipmentId, count, totalCost) => {
    setState(p => {
      if (p.balance < totalCost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const outletReqs = { ...(b.outletRequirements || {}) };
        const outlet = { ...(outletReqs[outletIndex] || { staff: {}, equipment: {}, licenses: {}, inventory: {} }) };
        const eq = { ...outlet.equipment };
        eq[equipmentId] = (eq[equipmentId] || 0) + count;
        outlet.equipment = eq;
        outletReqs[outletIndex] = outlet;
        return { ...b, outletRequirements: outletReqs };
      });
      return {
        ...p,
        balance: p.balance - totalCost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  // ═══ BUY LICENSE FOR OUTLET ═══
  const buyOutletLicense = (bizId, outletIndex, licenseId, cost) => {
    setState(p => {
      if (p.balance < cost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const outletReqs = { ...(b.outletRequirements || {}) };
        const outlet = { ...(outletReqs[outletIndex] || { staff: {}, equipment: {}, licenses: {}, inventory: {} }) };
        const lic = { ...outlet.licenses };
        lic[licenseId] = true;
        outlet.licenses = lic;
        outletReqs[outletIndex] = outlet;
        return { ...b, outletRequirements: outletReqs };
      });
      return {
        ...p,
        balance: p.balance - cost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  // ═══ BUY INVENTORY FOR OUTLET ═══
  const buyOutletInventory = (bizId, outletIndex, inventoryId, amount, cost) => {
    setState(p => {
      if (p.balance < cost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const outletReqs = { ...(b.outletRequirements || {}) };
        const outlet = { ...(outletReqs[outletIndex] || { staff: {}, equipment: {}, licenses: {}, inventory: {} }) };
        const inv = { ...outlet.inventory };
        inv[inventoryId] = (inv[inventoryId] || 0) + amount;
        outlet.inventory = inv;
        outletReqs[outletIndex] = outlet;
        return { ...b, outletRequirements: outletReqs };
      });
      return {
        ...p,
        balance: p.balance - cost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  return {
    buyBusiness,
    startExpansion,
    skipExpansion,
    renameBusiness,
    closeBusiness,
    startBizAdBoost,
    getExpansionCost,
    getExpansionTime,
    hireOutletStaff,
    buyOutletEquipment,
    buyOutletLicense,
    buyOutletInventory,
  };
};