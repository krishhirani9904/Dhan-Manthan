import { createContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { storage } from '../services/storage';
import { CARD_TIERS, getCardTier, getCardBonus } from '../data/cardTiers';
import { getCategoryById } from '../data/businessCategories';
import {
  VEHICLE_CATEGORIES, STAFF_TYPES, EQUIPMENT_TYPES,
  LICENSE_TYPES, INVENTORY_TYPES, BANK_SETTINGS_DEFAULTS
} from '../data/businessRequirements';
import { MERGER_BUSINESSES } from '../data/mergerBusinesses';
// import { getIncomeMultiplier } from '../data/mergerFlowData';
import {
  INITIAL_PER_CLICK, INITIAL_UPGRADE_COST, UPGRADE_MULTIPLIER,
  PER_CLICK_INCREMENT, BUSINESS_INCOME_RATE, RENAME_COST,
  CLOSE_REFUND_NORMAL, CLOSE_REFUND_AD, MAX_BUSINESS_LEVEL,
  AD_WATCH_TIME, CLICK_BOOST_MULTIPLIER, CLICK_BOOST_DURATION,
  BIZ_BOOST_PERCENT, BIZ_BOOST_DURATION, MAX_OFFLINE_HOURS,
  PROPERTY_SELL_TAX, CAR_SELL_PERCENT, AIRCRAFT_SELL_PERCENT
} from '../config/constants';
import { generateId } from '../utils/helpers';
import { STOCKS } from '../data/stockMarket';
import { getIncomeMultiplier, getConfigTimerDuration } from '../data/mergerFlowData';
import { CRYPTOCURRENCIES } from '../data/cryptoData';
import { PROPERTIES, getPropertyRentalIncome, getPropertyMarketValue } from '../data/realEstate';
import { COLLECTIONS } from '../data/collectionsData';
import { ISLAND_SELL_LOSS_PERCENT } from '../data/islandsData';

export const GameContext = createContext();

const DEFAULTS = {
  balance: 0,
  level: 1,
  perClick: INITIAL_PER_CLICK,
  upgradeCost: INITIAL_UPGRADE_COST,
  totalClicks: 0,
  activeCardId: 'base',
  cardNumber: '1042',
  ownedBusinesses: [],
  mergedBusinesses: [],
  activeMergerFlows: [],
  incomePerHour: 0,
  bizBoostActive: false,
  bizBoostPercent: 0,
  bizBoostEndTime: null,
  ownedStocks: [],
  ownedProperties: [],
  ownedCrypto: [],
  priceSeed: Date.now(),
  ownedCars: [],
  ownedAircraft: [],
  ownedYachts: [],
  ownedCollections: {},
  ownedNFTs: [],
  ownedIslands: [],
  earnedInsignias: [],
};

const recalcIncome = (businesses) => {
  return businesses.reduce((sum, b) => {
    const cat = getCategoryById(b.categoryId);
    const taxRate = cat?.taxRate || 0.03;
    let baseIncome = b.incomePerHour || 0;
    let totalBoostPercent = 0;

    if (b.vehicles && Array.isArray(b.vehicles)) {
      b.vehicles.forEach(v => {
        if (v.active) baseIncome += v.incomePerHour || 0;
      });
    }

    if (b.staff && Object.keys(b.staff).length > 0) {
      const staffDefs = STAFF_TYPES[b.categoryId] || [];
      for (const [staffId, count] of Object.entries(b.staff)) {
        const def = staffDefs.find(s => s.id === staffId);
        if (def && count > 0) totalBoostPercent += def.incomeBoost * count;
      }
    }

    if (b.equipment && Object.keys(b.equipment).length > 0) {
      const equipDefs = EQUIPMENT_TYPES[b.categoryId] || [];
      for (const [equipId, count] of Object.entries(b.equipment)) {
        const def = equipDefs.find(e => e.id === equipId);
        if (def && count > 0) totalBoostPercent += def.incomeBoost * count;
      }
    }

    const licenseDefs = LICENSE_TYPES[b.categoryId] || [];
    const requiredLicenses = licenseDefs.filter(l => l.required);
    if (requiredLicenses.length > 0) {
      const missingReq = requiredLicenses.filter(l => !(b.licenses?.[l.id]));
      if (missingReq.length > 0) totalBoostPercent -= 50;
    }

    const invDefs = INVENTORY_TYPES[b.categoryId] || [];
    const requiredInv = invDefs.filter(i => i.required);
    if (requiredInv.length > 0) {
      const missingInv = requiredInv.filter(i => (b.inventory?.[i.id] || 0) <= 0);
      if (missingInv.length > 0) totalBoostPercent -= 30;
    }

    if (b.categoryId === 'bank') {
      const settings = b.bankSettings || {};
      const loanRate = settings.loanRate ?? BANK_SETTINGS_DEFAULTS.loanRate;
      const savingsRate = settings.savingsRate ?? BANK_SETTINGS_DEFAULTS.savingsRate;
      totalBoostPercent += (loanRate - BANK_SETTINGS_DEFAULTS.loanRate) * 2;
      totalBoostPercent -= (savingsRate - BANK_SETTINGS_DEFAULTS.savingsRate) * 3;
      const facilities = settings.facilities || {};
      totalBoostPercent += Object.values(facilities).filter(Boolean).length * 5;
    }

    const boostMultiplier = Math.max(0.1, 1 + totalBoostPercent / 100);
    const grossIncome = Math.floor(baseIncome * boostMultiplier);
    const netIncome = Math.floor(grossIncome * (1 - taxRate));
    return sum + netIncome;
  }, 0);
};

const recalcMergerIncome = (merged) =>
  (merged || []).reduce((sum, m) => sum + (m.incomePerHour || 0), 0);

const recalcPropertyIncome = (properties) =>
  (properties || []).reduce((s, p) => s + getPropertyRentalIncome(p.propertyId, p.improvements || []), 0);

const recalcStockDividendIncome = (stocks) =>
  (stocks || []).reduce((s, st) => {
    const def = STOCKS.find(d => d.id === st.stockId);
    if (!def || !def.dividendPercent) return s;
    const totalValue = st.quantity * st.avgBuyPrice;
    const annualDividend = totalValue * (def.dividendPercent / 100);
    return s + Math.floor(annualDividend / 8760);
  }, 0);

const calcTotalIncome = (businesses, merged, properties, stocks) => {
  return recalcIncome(businesses || []) + recalcMergerIncome(merged) +
    recalcPropertyIncome(properties) + recalcStockDividendIncome(stocks);
};

const processVehicleWear = (vehicles, kmPerHourConfig) => {
  if (!vehicles || !Array.isArray(vehicles)) return vehicles;
  return vehicles.map(v => {
    if (!v.active) return v;
    const minKm = kmPerHourConfig?.min || 20;
    const maxKm = kmPerHourConfig?.max || 60;
    const kmThisSecond = (minKm + Math.random() * (maxKm - minKm)) / 3600;
    const newKmDriven = (v.kmDriven || 0) + kmThisSecond;
    if (newKmDriven >= v.maxKm) {
      return { ...v, active: false, kmDriven: v.maxKm, retiredAt: Date.now() };
    }
    return { ...v, kmDriven: newKmDriven };
  });
};

export function GameProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = storage.loadGame();
    if (saved) {
      const businesses = (saved.ownedBusinesses || []).map(b => ({
        ...b, level: b.level || 1, totalEarnings: b.totalEarnings || 0,
        expansionEndTime: b.expansionEndTime || null,
        bizAdBoostEndTime: b.bizAdBoostEndTime || null,
        bizAdBoostPercent: b.bizAdBoostPercent || 0,
        staff: b.staff || {}, vehicles: b.vehicles || [],
        equipment: b.equipment || {}, inventory: b.inventory || {},
        licenses: b.licenses || {}, locations: b.locations || 1,
        branches: b.branches || 0, resources: b.resources || {},
        projects: b.projects || [], bankSettings: b.bankSettings || null,
        parkingExpansions: b.parkingExpansions || 0,
      }));
      const merged = saved.mergedBusinesses || [];
      const properties = (saved.ownedProperties || []).map(p => ({
        ...p, improvements: p.improvements || [],
      }));
      const stocks = saved.ownedStocks || [];
      const mergerFlows = (saved.activeMergerFlows || []).map(f => ({
        ...f,
        phases: f.phases || [],
        configuration: f.configuration || null,
        configScore: f.configScore || null,
        selectedTrend: f.selectedTrend || null,
      }));
      return {
        ...DEFAULTS, ...saved,
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
        incomePerHour: calcTotalIncome(businesses, merged, properties, stocks),
        bizBoostActive: false,
        bizBoostPercent: saved.bizBoostPercent || 0,
        bizBoostEndTime: saved.bizBoostEndTime || null,
        cardNumber: saved.cardNumber || '1042',
        priceSeed: saved.priceSeed || Date.now(),
      };
    }
    return { ...DEFAULTS };
  });

  const [boostActive, setBoostActive] = useState(false);
  const [boostTimer, setBoostTimer] = useState(0);
  const [adStatus, setAdStatus] = useState('idle');
  const [bizBoostRemaining, setBizBoostRemaining] = useState(0);
  const timerRef = useRef(null);
  const saveRef = useRef(null);
  const bizTimerRef = useRef(null);
  const incomeAccRef = useRef(0);
  const mainIntervalRef = useRef(null);

  useEffect(() => {
    if (state.bizBoostEndTime) {
      const rem = Math.floor((state.bizBoostEndTime - Date.now()) / 1000);
      if (rem > 0) { setState(p => ({ ...p, bizBoostActive: true })); setBizBoostRemaining(rem); }
      else setState(p => ({ ...p, bizBoostActive: false, bizBoostPercent: 0, bizBoostEndTime: null }));
    }
  }, []);

  useEffect(() => {
    const saved = storage.loadGame();
    if (saved?.lastSaved && saved.incomePerHour > 0) {
      const elapsed = (Date.now() - saved.lastSaved) / 1000;
      const effective = Math.min(elapsed, MAX_OFFLINE_HOURS * 3600);
      const offline = Math.floor((saved.incomePerHour / 3600) * effective);
      if (offline > 0) setState(p => ({ ...p, balance: p.balance + offline }));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(p => ({ ...p, priceSeed: Date.now() }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ═══ MAIN LOOP ═══
  useEffect(() => {
    mainIntervalRef.current = setInterval(() => {
      setState(prev => {
        let updated = { ...prev };
        let businessesChanged = false;

        // ── Business updates ──
        const updatedBusinesses = prev.ownedBusinesses.map(biz => {
          let bu = { ...biz };
          let changed = false;

          if (biz.expansionEndTime && Date.now() >= biz.expansionEndTime) {
            const cat = getCategoryById(biz.categoryId);
            const growth = cat?.profitGrowthPercent || 15;
            bu.level = Math.min((biz.level || 1) + 1, MAX_BUSINESS_LEVEL);
            bu.incomePerHour = Math.floor(biz.incomePerHour * (1 + growth / 100));
            bu.expansionEndTime = null;
            changed = true;
          }

          if (biz.bizAdBoostEndTime && Date.now() >= biz.bizAdBoostEndTime) {
            bu.bizAdBoostEndTime = null; bu.bizAdBoostPercent = 0; changed = true;
          }

          if (biz.vehicles?.length > 0) {
            const vc = VEHICLE_CATEGORIES[biz.categoryId];
            const processed = processVehicleWear(biz.vehicles, vc?.kmPerHour);
            if (processed.some((v, i) => v.active !== biz.vehicles[i]?.active)) changed = true;
            bu.vehicles = processed;
          }

          if (biz.projects?.length > 0) {
            const updProjects = biz.projects.map(p =>
              p.status === 'active' && p.endTime && Date.now() >= p.endTime
                ? { ...p, status: 'completed' } : p
            );
            const justCompleted = updProjects.filter((p, i) =>
              p.status === 'completed' && biz.projects[i].status === 'active'
            );
            if (justCompleted.length > 0) {
              justCompleted.forEach(p => {
                updated.balance = (updated.balance || prev.balance) + (p.reward || 0);
              });
              bu.projects = updProjects; changed = true;
            } else bu.projects = updProjects;
          }

          bu.totalEarnings = (biz.totalEarnings || 0) + (biz.incomePerHour || 0) / 3600;
          if (changed) businessesChanged = true;
          return changed ? bu : { ...biz, totalEarnings: bu.totalEarnings, vehicles: bu.vehicles };
        });

        updated.ownedBusinesses = updatedBusinesses;
        if (businessesChanged) {
          updated.incomePerHour = calcTotalIncome(
            updatedBusinesses, prev.mergedBusinesses,
            prev.ownedProperties, prev.ownedStocks
          );
        }

        // ── Merger phase timer auto-completion ──
        if (prev.activeMergerFlows?.length > 0) {
          let flowsChanged = false;
          const updatedFlows = (updated.activeMergerFlows || prev.activeMergerFlows).map(flow => {
            let changed = false;
            let f = { ...flow };

            // Config timer completion
            if (f.configTimerEndTime && !f.configCompleted && Date.now() >= f.configTimerEndTime) {
              f.configCompleted = true;
              changed = true;
            }

            // Merger ad boost expiry
            if (f.mergerAdBoostEndTime && Date.now() >= f.mergerAdBoostEndTime) {
              f.mergerAdBoostEndTime = null;
              f.mergerAdBoostPercent = 0;
              changed = true;
            }

            // Phase timer completion
            const updatedPhases = (f.phases || []).map(phase => {
              if (phase.status === 'active' && phase.endTime && Date.now() >= phase.endTime) {
                changed = true;
                return { ...phase, status: 'completed', endTime: null };
              }
              return phase;
            });

            if (changed) {
              flowsChanged = true;
              return { ...f, phases: updatedPhases };
            }
            return flow;
          });
          if (flowsChanged) updated.activeMergerFlows = updatedFlows;
        }

               // ── Income accumulation (replace existing block) ──
        const cardBonus = getCardBonus(prev.activeCardId);
        const bizBoostMult = prev.bizBoostActive ? (1 + prev.bizBoostPercent / 100) : 1;

        // Include merger flow income
        let flowIncome = 0;
        (updated.activeMergerFlows || prev.activeMergerFlows || []).forEach(f => {
          if (!f.configCompleted) return;
          const merger = MERGER_BUSINESSES.find(m => m.id === f.mergerId);
          if (!merger) return;
          const mult = getIncomeMultiplier(f.configScore?.percentage || 50);
          let fi = Math.floor(merger.incomePerHour * mult);
          if (f.mergerAdBoostEndTime && Date.now() < f.mergerAdBoostEndTime) {
            fi = Math.floor(fi * (1 + (f.mergerAdBoostPercent || 15) / 100));
          }
          flowIncome += fi;
        });

        const effectiveIncome = ((updated.incomePerHour || prev.incomePerHour) + flowIncome)
          * bizBoostMult * (1 + cardBonus);

        if (effectiveIncome > 0) {
          incomeAccRef.current += effectiveIncome / 3600;
          if (incomeAccRef.current >= 1) {
            const toAdd = Math.floor(incomeAccRef.current);
            incomeAccRef.current -= toAdd;
            updated.balance = (updated.balance || prev.balance) + toAdd;
          }
        }

        return updated;
      });
    }, 1000);
    return () => { if (mainIntervalRef.current) clearInterval(mainIntervalRef.current); };
  }, []);

  // ═══ BIZ BOOST TIMER ═══
  useEffect(() => {
    if (bizTimerRef.current) { clearInterval(bizTimerRef.current); bizTimerRef.current = null; }
    if (bizBoostRemaining > 0) {
      bizTimerRef.current = setInterval(() => {
        setBizBoostRemaining(p => {
          if (p <= 1) {
            clearInterval(bizTimerRef.current); bizTimerRef.current = null;
            setState(s => ({ ...s, bizBoostActive: false, bizBoostPercent: 0, bizBoostEndTime: null }));
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    }
    return () => { if (bizTimerRef.current) { clearInterval(bizTimerRef.current); bizTimerRef.current = null; } };
  }, [bizBoostRemaining > 0]);

  // ═══ CLICK BOOST TIMER ═══
  useEffect(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (boostTimer > 0) {
      timerRef.current = setInterval(() => {
        setBoostTimer(p => {
          if (p <= 1) {
            clearInterval(timerRef.current); timerRef.current = null;
            if (adStatus === 'watching') { setAdStatus('boosted'); setBoostActive(true); return CLICK_BOOST_DURATION; }
            if (adStatus === 'boosted') { setAdStatus('idle'); setBoostActive(false); return 0; }
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  }, [adStatus, boostTimer > 0]);

  // ═══ AUTO SAVE ═══
  useEffect(() => {
    if (saveRef.current) clearTimeout(saveRef.current);
    saveRef.current = setTimeout(() => storage.saveGame(state), 1000);
    return () => { if (saveRef.current) clearTimeout(saveRef.current); };
  }, [state]);

  useEffect(() => {
    const h = () => storage.saveGame(state);
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [state]);

  // ═══ COMPUTED VALUES ═══
  const currentPerClick = useMemo(() =>
    boostActive ? state.perClick * CLICK_BOOST_MULTIPLIER : state.perClick
  , [state.perClick, boostActive]);

  const currentTier = useMemo(() => getCardTier(state.balance), [state.balance]);

    const boostedIncomePerHour = useMemo(() => {
    const cardBonus = getCardBonus(state.activeCardId);
    let income = state.incomePerHour;

    // Add active merger flow income
    (state.activeMergerFlows || []).forEach(f => {
      if (!f.configCompleted) return;
      const merger = MERGER_BUSINESSES.find(m => m.id === f.mergerId);
      if (!merger) return;
      const mult = getIncomeMultiplier(f.configScore?.percentage || 50);
      let flowIncome = Math.floor(merger.incomePerHour * mult);
      if (f.mergerAdBoostEndTime && Date.now() < f.mergerAdBoostEndTime) {
        flowIncome = Math.floor(flowIncome * (1 + (f.mergerAdBoostPercent || 15) / 100));
      }
      income += flowIncome;
    });

    if (state.bizBoostActive && state.bizBoostPercent > 0)
      income = Math.floor(income * (1 + state.bizBoostPercent / 100));
    return Math.floor(income * (1 + cardBonus));
  }, [state.incomePerHour, state.bizBoostActive, state.bizBoostPercent,
      state.activeCardId, state.activeMergerFlows]);

  const availableUpgrades = useMemo(() => {
    let c = 0, tb = state.balance, tc = state.upgradeCost;
    while (tb >= tc && c < 99) { c++; tb -= tc; tc = Math.floor(tc * UPGRADE_MULTIPLIER); }
    return c;
  }, [state.balance, state.upgradeCost]);

  // ═══════════════════════════════════════
  // CORE ACTIONS
  // ═══════════════════════════════════════

  const handleTap = useCallback(() => {
    setState(p => ({
      ...p,
      balance: p.balance + (boostActive ? p.perClick * CLICK_BOOST_MULTIPLIER : p.perClick),
      totalClicks: p.totalClicks + 1,
    }));
  }, [boostActive]);

  const handleUpgrade = useCallback(() => {
    setState(p => {
      if (p.balance < p.upgradeCost) return p;
      return {
        ...p, balance: p.balance - p.upgradeCost, level: p.level + 1,
        perClick: p.perClick + PER_CLICK_INCREMENT,
        upgradeCost: Math.floor(p.upgradeCost * UPGRADE_MULTIPLIER),
      };
    });
  }, []);

  const startAd = useCallback(() => {
    if (adStatus !== 'idle') return;
    setAdStatus('watching'); setBoostTimer(AD_WATCH_TIME);
  }, [adStatus]);

  const setActiveCard = useCallback((cardId) => {
    setState(p => {
      const tier = CARD_TIERS.find(t => t.id === cardId);
      if (!tier || p.balance < tier.minBalance) return p;
      return { ...p, activeCardId: cardId };
    });
  }, []);

  const startBizBoost = useCallback((percent = BIZ_BOOST_PERCENT) => {
    const endTime = Date.now() + BIZ_BOOST_DURATION * 1000;
    setState(p => ({ ...p, bizBoostActive: true, bizBoostPercent: percent, bizBoostEndTime: endTime }));
    setBizBoostRemaining(BIZ_BOOST_DURATION);
  }, []);

  // ═══════════════════════════════════════
  // BUSINESS ACTIONS
  // ═══════════════════════════════════════

  const buyBusiness = useCallback((info) => {
    setState(p => {
      if (p.balance < info.cost) return p;
      const newBiz = {
        id: generateId('biz'), name: info.name, categoryId: info.categoryId,
        subCategoryId: info.subCategoryId || null,
        categoryName: info.categoryName || '', subCategoryName: info.subCategoryName || '',
        cost: info.cost, incomePerHour: Math.floor(info.cost * BUSINESS_INCOME_RATE),
        purchasedAt: Date.now(), level: 1, totalEarnings: 0,
        expansionEndTime: null, bizAdBoostEndTime: null, bizAdBoostPercent: 0,
        staff: {}, vehicles: [], equipment: {}, inventory: {},
        licenses: {}, locations: 1, branches: 0, resources: {},
        projects: [], bankSettings: null, parkingExpansions: 0,
      };
      const newOwned = [newBiz, ...p.ownedBusinesses];
      return {
        ...p, balance: p.balance - info.cost, ownedBusinesses: newOwned,
        incomePerHour: calcTotalIncome(newOwned, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  }, []);

  const startExpansion = useCallback((bizId) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz || biz.level >= MAX_BUSINESS_LEVEL || biz.expansionEndTime) return p;
      const cat = getCategoryById(biz.categoryId);
      const cost = Math.floor((cat?.expansionBase || biz.cost * 0.3) * Math.pow(1.5, biz.level - 1));
      if (p.balance < cost) return p;
      const duration = (cat?.expansionTime || 2400) * 1000;
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, expansionEndTime: Date.now() + duration } : b
      );
      return { ...p, balance: p.balance - cost, ownedBusinesses: updated };
    });
  }, []);

  const skipExpansion = useCallback((bizId) => {
    setState(p => {
      const updated = p.ownedBusinesses.map(biz => {
        if (biz.id !== bizId || !biz.expansionEndTime) return biz;
        const cat = getCategoryById(biz.categoryId);
        const growth = cat?.profitGrowthPercent || 15;
        return {
          ...biz, level: Math.min((biz.level || 1) + 1, MAX_BUSINESS_LEVEL),
          incomePerHour: Math.floor(biz.incomePerHour * (1 + growth / 100)), expansionEndTime: null,
        };
      });
      return {
        ...p, ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  }, []);

  const renameBusiness = useCallback((bizId, newName) => {
    setState(p => {
      if (p.balance < RENAME_COST || !newName?.trim() || newName.trim().length < 2) return p;
      const updated = p.ownedBusinesses.map(b => b.id === bizId ? { ...b, name: newName.trim() } : b);
      return { ...p, balance: p.balance - RENAME_COST, ownedBusinesses: updated };
    });
  }, []);

  const closeBusiness = useCallback((bizId, fullRefund = false) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz) return p;
      const refund = Math.floor(biz.cost * (fullRefund ? CLOSE_REFUND_AD : CLOSE_REFUND_NORMAL));
      const updated = p.ownedBusinesses.filter(b => b.id !== bizId);
      return {
        ...p, balance: p.balance + refund, ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  }, []);

  const startBizAdBoost = useCallback((bizId, percent = 15, hours = 4) => {
    setState(p => {
      const endTime = Date.now() + hours * 3600 * 1000;
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, bizAdBoostEndTime: endTime, bizAdBoostPercent: percent } : b
      );
      return { ...p, ownedBusinesses: updated };
    });
  }, []);

  const getExpansionCost = useCallback((bizId) => {
    const biz = state.ownedBusinesses.find(b => b.id === bizId);
    if (!biz) return 0;
    const cat = getCategoryById(biz.categoryId);
    return Math.floor((cat?.expansionBase || biz.cost * 0.3) * Math.pow(1.5, (biz.level || 1) - 1));
  }, [state.ownedBusinesses]);

  // ═══════════════════════════════════════
  // MANAGEMENT ACTIONS
  // ═══════════════════════════════════════

  const hireStaff = useCallback((bizId, staffType, count, totalCost) => {
    setState(p => {
      if (p.balance < totalCost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const s = { ...b.staff }; s[staffType] = (s[staffType] || 0) + count;
        return { ...b, staff: s };
      });
      return {
        ...p, balance: p.balance - totalCost, ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  }, []);

  const fireStaff = useCallback((bizId, staffType, count) => {
    setState(p => {
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const s = { ...b.staff }; s[staffType] = Math.max(0, (s[staffType] || 0) - count);
        if (s[staffType] === 0) delete s[staffType];
        return { ...b, staff: s };
      });
      return {
        ...p, ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  }, []);

  const buyVehicle = useCallback((bizId, vehicleType, vehicleData) => {
    setState(p => {
      if (p.balance < vehicleData.cost) return p;
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz) return p;
      const vc = VEHICLE_CATEGORIES[biz.categoryId];
      const slots = (vc?.parkingDefault || 10) + ((biz.parkingExpansions || 0) * (vc?.parkingExpansionSlots || 5));
      if ((biz.vehicles || []).filter(v => v.active).length >= slots) return p;
      const nv = {
        id: generateId('veh'), type: vehicleType, name: vehicleData.name,
        cost: vehicleData.cost, incomePerHour: vehicleData.incomePerHour,
        maxKm: vehicleData.maxKm, kmDriven: 0, active: true,
        purchasedAt: Date.now(), retiredAt: null,
        capacity: vehicleData.capacity || null, range: vehicleData.range || null,
      };
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, vehicles: [...(b.vehicles || []), nv] } : b
      );
      return {
        ...p, balance: p.balance - vehicleData.cost, ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  }, []);

  const expandParking = useCallback((bizId) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz) return p;
      const cost = VEHICLE_CATEGORIES[biz.categoryId]?.parkingExpansionCost || 25000;
      if (p.balance < cost) return p;
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, parkingExpansions: (b.parkingExpansions || 0) + 1 } : b
      );
      return { ...p, balance: p.balance - cost, ownedBusinesses: updated };
    });
  }, []);

  const buyEquipment = useCallback((bizId, equipmentId, count, totalCost) => {
    setState(p => {
      if (p.balance < totalCost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const eq = { ...b.equipment }; eq[equipmentId] = (eq[equipmentId] || 0) + count;
        return { ...b, equipment: eq };
      });
      return {
        ...p, balance: p.balance - totalCost, ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  }, []);

  const buyLicense = useCallback((bizId, licenseId, cost) => {
    setState(p => {
      if (p.balance < cost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const lic = { ...b.licenses }; lic[licenseId] = true;
        return { ...b, licenses: lic };
      });
      return {
        ...p, balance: p.balance - cost, ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  }, []);

  const buyInventory = useCallback((bizId, inventoryId, amount, cost) => {
    setState(p => {
      if (p.balance < cost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const inv = { ...b.inventory }; inv[inventoryId] = (inv[inventoryId] || 0) + amount;
        return { ...b, inventory: inv };
      });
      return {
        ...p, balance: p.balance - cost, ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  }, []);

  const buyResources = useCallback((bizId, resourceId, quantity, totalCost) => {
    setState(p => {
      if (p.balance < totalCost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const res = { ...b.resources }; res[resourceId] = (res[resourceId] || 0) + quantity;
        return { ...b, resources: res };
      });
      return { ...p, balance: p.balance - totalCost, ownedBusinesses: updated };
    });
  }, []);

  const startProject = useCallback((bizId, project) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz) return p;
      if ((biz.projects || []).some(pr => pr.projectId === project.id && pr.status === 'active')) return p;
      if ((biz.projects || []).filter(pr => pr.status === 'active').length >= 3) return p;
      const np = {
        id: generateId('proj'), projectId: project.id, name: project.name,
        reward: project.reward, status: 'active',
        startTime: Date.now(), endTime: Date.now() + project.duration * 1000,
      };
      if (project.resources) {
        const res = { ...biz.resources };
        for (const [rId, qty] of Object.entries(project.resources)) {
          if ((res[rId] || 0) < qty) return p;
        }
        for (const [rId, qty] of Object.entries(project.resources)) {
          res[rId] -= qty; if (res[rId] <= 0) delete res[rId];
        }
        const updated = p.ownedBusinesses.map(b =>
          b.id === bizId ? { ...b, resources: res, projects: [...(b.projects || []), np] } : b
        );
        return { ...p, ownedBusinesses: updated };
      }
      if (project.requirements) {
        const staff = biz.staff || {};
        for (const [role, count] of Object.entries(project.requirements)) {
          if ((staff[role] || 0) < count) return p;
        }
        const updated = p.ownedBusinesses.map(b =>
          b.id === bizId ? { ...b, projects: [...(b.projects || []), np] } : b
        );
        return { ...p, ownedBusinesses: updated };
      }
      return p;
    });
  }, []);

  const collectProjectReward = useCallback((bizId, projectInstanceId) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz) return p;
      const proj = (biz.projects || []).find(pr => pr.id === projectInstanceId && pr.status === 'completed');
      if (!proj) return p;
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, projects: b.projects.filter(pr => pr.id !== projectInstanceId) } : b
      );
      return { ...p, balance: p.balance + proj.reward, ownedBusinesses: updated };
    });
  }, []);

  const updateBankSettings = useCallback((bizId, settings) => {
    setState(p => {
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, bankSettings: { ...(b.bankSettings || {}), ...settings } } : b
      );
      return {
        ...p, ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  }, []);

  const buyBankFacility = useCallback((bizId, facilityId, cost) => {
    setState(p => {
      if (p.balance < cost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const s = b.bankSettings || {};
        const f = { ...(s.facilities || {}) }; f[facilityId] = true;
        return { ...b, bankSettings: { ...s, facilities: f } };
      });
      return {
        ...p, balance: p.balance - cost, ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  }, []);

  const removeRetiredVehicles = useCallback((bizId) => {
    setState(p => {
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, vehicles: (b.vehicles || []).filter(v => v.active) } : b
      );
      return { ...p, ownedBusinesses: updated };
    });
  }, []);

  // ═══════════════════════════════════════
  // MERGER FLOW ACTIONS
  // ═══════════════════════════════════════

  const initMergerFlow = useCallback((mergerId, name) => {
    let flowId = null;
    setState(p => {
      const merger = MERGER_BUSINESSES.find(m => m.id === mergerId);
      if (!merger || p.balance < merger.investment) return p;
      if ((p.mergedBusinesses || []).some(m => m.mergerId === mergerId)) return p;
      if ((p.activeMergerFlows || []).some(f => f.mergerId === mergerId)) return p;

      const allMet = merger.requirements.every(req => {
        if (req.type === 'categories') {
          return new Set(p.ownedBusinesses.map(b => b.categoryId)).size >= req.count;
        }
        return p.ownedBusinesses.filter(b => {
          if (b.categoryId !== req.categoryId) return false;
          if (req.subCategoryId && b.subCategoryId !== req.subCategoryId) return false;
          return true;
        }).length >= req.count;
      });
      if (!allMet) return p;

      flowId = generateId('mflow');
      return {
        ...p,
        balance: p.balance - merger.investment,
        activeMergerFlows: [...(p.activeMergerFlows || []), {
          id: flowId,
          mergerId,
          name: name.trim(),
          selectedTrend: null,
          configuration: null,
          configScore: null,
          configTimerEndTime: null,
          configCompleted: false,
          phases: [],
          mergerAdBoostEndTime: null,
          mergerAdBoostPercent: 0,
          startedAt: Date.now(),
        }],
      };
    });
    return flowId;
  }, []);

  const selectMergerTrend = useCallback((flowId, trendId) => {
    setState(p => ({
      ...p,
      activeMergerFlows: (p.activeMergerFlows || []).map(f =>
        f.id === flowId ? { ...f, selectedTrend: trendId } : f
      ),
    }));
  }, []);

  const saveMergerConfig = useCallback((flowId, config, score) => {
    setState(p => {
      const flow = (p.activeMergerFlows || []).find(f => f.id === flowId);
      if (!flow) return p;
      const duration = getConfigTimerDuration(flow.mergerId);
      return {
        ...p,
        activeMergerFlows: (p.activeMergerFlows || []).map(f =>
          f.id === flowId ? {
            ...f,
            configuration: config,
            configScore: score,
            configTimerEndTime: Date.now() + duration * 1000,
            configCompleted: false,
          } : f
        ),
      };
    });
  }, []);

  const boostConfigTimer = useCallback((flowId) => {
    setState(p => ({
      ...p,
      activeMergerFlows: (p.activeMergerFlows || []).map(f => {
        if (f.id !== flowId || !f.configTimerEndTime) return f;
        const remaining = Math.max(0, f.configTimerEndTime - Date.now());
        return { ...f, configTimerEndTime: Date.now() + Math.floor(remaining / 4) };
      }),
    }));
  }, []);

  const investInMergerPhase = useCallback((flowId, phaseIdx, cost, duration) => {
    setState(p => {
      if (p.balance < cost) return p;
      return {
        ...p,
        balance: p.balance - cost,
        activeMergerFlows: (p.activeMergerFlows || []).map(f => {
          if (f.id !== flowId) return f;
          const phases = [...(f.phases || [])];
          while (phases.length <= phaseIdx) {
            phases.push({ status: 'locked', endTime: null });
          }
          phases[phaseIdx] = {
            status: 'active',
            endTime: Date.now() + duration * 1000,
            investedAt: Date.now(),
          };
          return { ...f, phases };
        }),
      };
    });
  }, []);

  // 4× speed — NOT instant skip
  const boostMergerPhase = useCallback((flowId, phaseIdx) => {
    setState(p => ({
      ...p,
      activeMergerFlows: (p.activeMergerFlows || []).map(f => {
        if (f.id !== flowId) return f;
        const phases = [...(f.phases || [])];
        if (!phases[phaseIdx] || phases[phaseIdx].status !== 'active') return f;
        const remaining = Math.max(0, phases[phaseIdx].endTime - Date.now());
        phases[phaseIdx] = {
          ...phases[phaseIdx],
          endTime: Date.now() + Math.floor(remaining / 4),
        };
        return { ...f, phases };
      }),
    }));
  }, []);

  // Keep for backward compat, now uses boost
  const skipMergerPhase = boostMergerPhase;

  const startMergerAdBoost = useCallback((flowId, percent = 15, hours = 4) => {
    setState(p => ({
      ...p,
      activeMergerFlows: (p.activeMergerFlows || []).map(f =>
        f.id === flowId ? {
          ...f,
          mergerAdBoostEndTime: Date.now() + hours * 3600 * 1000,
          mergerAdBoostPercent: percent,
        } : f
      ),
    }));
  }, []);

  const completeMergerFlow = useCallback((flowId) => {
    setState(p => {
      const flow = (p.activeMergerFlows || []).find(f => f.id === flowId);
      if (!flow) return p;
      const merger = MERGER_BUSINESSES.find(m => m.id === flow.mergerId);
      if (!merger) return p;

      const mult = getIncomeMultiplier(flow.configScore?.percentage || 50);
      const finalIncome = Math.floor(merger.incomePerHour * mult);

      const newMerged = {
        id: generateId('merged'),
        mergerId: merger.id,
        name: flow.name,
        incomePerHour: finalIncome,
        configScore: flow.configScore,
        selectedTrend: flow.selectedTrend,
        startedAt: flow.startedAt,
        completedAt: Date.now(),
      };

      const updatedMerged = [...(p.mergedBusinesses || []), newMerged];
      const updatedFlows = (p.activeMergerFlows || []).filter(f => f.id !== flowId);

      return {
        ...p,
        mergedBusinesses: updatedMerged,
        activeMergerFlows: updatedFlows,
        incomePerHour: calcTotalIncome(
          p.ownedBusinesses, updatedMerged, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  }, []);

  const startMerger = useCallback((merger) => {
    setState(p => {
      if (p.balance < merger.investment) return p;
      if ((p.mergedBusinesses || []).some(m => m.mergerId === merger.id)) return p;
      const allMet = merger.requirements.every(req => {
        if (req.type === 'categories') {
          return new Set(p.ownedBusinesses.map(b => b.categoryId)).size >= req.count;
        }
        return p.ownedBusinesses.filter(b => {
          if (b.categoryId !== req.categoryId) return false;
          if (req.subCategoryId && b.subCategoryId !== req.subCategoryId) return false;
          return true;
        }).length >= req.count;
      });
      if (!allMet) return p;
      const newMerged = {
        id: generateId('merged'), mergerId: merger.id, name: merger.name,
        incomePerHour: merger.incomePerHour, startedAt: Date.now(),
      };
      const updatedMerged = [...(p.mergedBusinesses || []), newMerged];
      return {
        ...p, balance: p.balance - merger.investment,
        mergedBusinesses: updatedMerged,
        incomePerHour: calcTotalIncome(
          p.ownedBusinesses, updatedMerged, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  }, []);

  // ═══════════════════════════════════════
  // STOCK ACTIONS
  // ═══════════════════════════════════════

  const buyStock = useCallback((stockId, quantity, pricePerShare) => {
    setState(p => {
      const totalCost = quantity * pricePerShare;
      if (p.balance < totalCost) return p;
      const existing = p.ownedStocks.find(s => s.stockId === stockId);
      let newOwned;
      if (existing) {
        const totalShares = existing.quantity + quantity;
        const totalValue = (existing.avgBuyPrice * existing.quantity) + totalCost;
        const newAvgPrice = Math.floor(totalValue / totalShares);
        newOwned = p.ownedStocks.map(s =>
          s.stockId === stockId ? { ...s, quantity: totalShares, avgBuyPrice: newAvgPrice } : s
        );
      } else {
        newOwned = [...p.ownedStocks, { stockId, quantity, avgBuyPrice: pricePerShare, purchasedAt: Date.now() }];
      }
      return {
        ...p, balance: p.balance - totalCost, ownedStocks: newOwned,
        incomePerHour: calcTotalIncome(p.ownedBusinesses, p.mergedBusinesses, p.ownedProperties, newOwned),
      };
    });
  }, []);

  const sellStock = useCallback((stockId, quantity, pricePerShare) => {
    setState(p => {
      const existing = p.ownedStocks.find(s => s.stockId === stockId);
      if (!existing || existing.quantity < quantity) return p;
      const proceeds = quantity * pricePerShare;
      const remaining = existing.quantity - quantity;
      let newOwned;
      if (remaining <= 0) {
        newOwned = p.ownedStocks.filter(s => s.stockId !== stockId);
      } else {
        newOwned = p.ownedStocks.map(s => s.stockId === stockId ? { ...s, quantity: remaining } : s);
      }
      return {
        ...p, balance: p.balance + proceeds, ownedStocks: newOwned,
        incomePerHour: calcTotalIncome(p.ownedBusinesses, p.mergedBusinesses, p.ownedProperties, newOwned),
      };
    });
  }, []);

  // ═══════════════════════════════════════
  // CRYPTO ACTIONS
  // ═══════════════════════════════════════

  const buyCrypto = useCallback((cryptoId, quantity, pricePerCoin) => {
    setState(p => {
      const totalCost = Math.floor(quantity * pricePerCoin);
      if (p.balance < totalCost) return p;
      const existing = p.ownedCrypto.find(c => c.cryptoId === cryptoId);
      let newOwned;
      if (existing) {
        const totalCoins = parseFloat((existing.quantity + quantity).toFixed(8));
        const totalValue = (existing.avgBuyPrice * existing.quantity) + totalCost;
        const newAvgPrice = Math.floor(totalValue / totalCoins);
        newOwned = p.ownedCrypto.map(c =>
          c.cryptoId === cryptoId ? { ...c, quantity: totalCoins, avgBuyPrice: newAvgPrice } : c
        );
      } else {
        newOwned = [...p.ownedCrypto, { cryptoId, quantity: parseFloat(quantity.toFixed(8)), avgBuyPrice: pricePerCoin, purchasedAt: Date.now() }];
      }
      return { ...p, balance: p.balance - totalCost, ownedCrypto: newOwned };
    });
  }, []);

  const sellCrypto = useCallback((cryptoId, quantity, pricePerCoin) => {
    setState(p => {
      const existing = p.ownedCrypto.find(c => c.cryptoId === cryptoId);
      if (!existing || existing.quantity + 0.00000001 < quantity) return p;
      const proceeds = Math.floor(quantity * pricePerCoin);
      const remaining = parseFloat((existing.quantity - quantity).toFixed(8));
      let newOwned;
      if (remaining <= 0.00000001) {
        newOwned = p.ownedCrypto.filter(c => c.cryptoId !== cryptoId);
      } else {
        newOwned = p.ownedCrypto.map(c => c.cryptoId === cryptoId ? { ...c, quantity: remaining } : c);
      }
      return { ...p, balance: p.balance + proceeds, ownedCrypto: newOwned };
    });
  }, []);

  // ═══════════════════════════════════════
  // PROPERTY ACTIONS
  // ═══════════════════════════════════════

  const buyProperty = useCallback((propertyId) => {
    setState(p => {
      const prop = PROPERTIES.find(pr => pr.id === propertyId);
      if (!prop || p.balance < prop.price) return p;
      if (p.ownedProperties.some(op => op.propertyId === propertyId)) return p;
      const newOwned = [...p.ownedProperties, { propertyId, purchasedAt: Date.now(), purchasePrice: prop.price, improvements: [] }];
      return {
        ...p, balance: p.balance - prop.price, ownedProperties: newOwned,
        incomePerHour: calcTotalIncome(p.ownedBusinesses, p.mergedBusinesses, newOwned, p.ownedStocks),
      };
    });
  }, []);

  const sellProperty = useCallback((propertyId) => {
    setState(p => {
      const owned = p.ownedProperties.find(op => op.propertyId === propertyId);
      if (!owned) return p;
      const marketValue = getPropertyMarketValue(propertyId, owned.improvements || []);
      const afterTax = Math.floor(marketValue * (1 - PROPERTY_SELL_TAX));
      const newOwned = p.ownedProperties.filter(op => op.propertyId !== propertyId);
      return {
        ...p, balance: p.balance + afterTax, ownedProperties: newOwned,
        incomePerHour: calcTotalIncome(p.ownedBusinesses, p.mergedBusinesses, newOwned, p.ownedStocks),
      };
    });
  }, []);

  const buyImprovement = useCallback((propertyId, improvementId, cost) => {
    setState(p => {
      if (p.balance < cost) return p;
      const newOwned = p.ownedProperties.map(op => {
        if (op.propertyId !== propertyId) return op;
        if ((op.improvements || []).includes(improvementId)) return op;
        return { ...op, improvements: [...(op.improvements || []), improvementId] };
      });
      return {
        ...p, balance: p.balance - cost, ownedProperties: newOwned,
        incomePerHour: calcTotalIncome(p.ownedBusinesses, p.mergedBusinesses, newOwned, p.ownedStocks),
      };
    });
  }, []);

  // ═══════════════════════════════════════
  // ITEMS - CAR ACTIONS
  // ═══════════════════════════════════════

  const buyCar = useCallback((info) => {
    setState(p => {
      if (p.balance < info.totalPrice) return p;
      const car = {
        id: generateId('car'), carDefId: info.carDefId, name: info.name,
        image: info.image, basePrice: info.basePrice, engineType: info.engineType,
        equipmentType: info.equipmentType, totalPrice: info.totalPrice, purchasedAt: Date.now(),
      };
      return { ...p, balance: p.balance - info.totalPrice, ownedCars: [...(p.ownedCars || []), car] };
    });
  }, []);

  const sellCar = useCallback((carId) => {
    setState(p => {
      const car = (p.ownedCars || []).find(c => c.id === carId);
      if (!car) return p;
      const salePrice = Math.floor(car.totalPrice * CAR_SELL_PERCENT);
      return { ...p, balance: p.balance + salePrice, ownedCars: (p.ownedCars || []).filter(c => c.id !== carId) };
    });
  }, []);

  // ═══════════════════════════════════════
  // ITEMS - AIRCRAFT ACTIONS
  // ═══════════════════════════════════════

  const buyAircraft = useCallback((info) => {
    setState(p => {
      if (p.balance < info.totalPrice) return p;
      const ac = {
        id: generateId('air'), acDefId: info.acDefId, name: info.name,
        image: info.image, basePrice: info.basePrice, teamHired: info.teamHired,
        designType: info.designType, totalPrice: info.totalPrice, purchasedAt: Date.now(),
      };
      return { ...p, balance: p.balance - info.totalPrice, ownedAircraft: [...(p.ownedAircraft || []), ac] };
    });
  }, []);

  const sellAircraft = useCallback((acId) => {
    setState(p => {
      const ac = (p.ownedAircraft || []).find(a => a.id === acId);
      if (!ac) return p;
      const salePrice = Math.floor(ac.totalPrice * AIRCRAFT_SELL_PERCENT);
      return { ...p, balance: p.balance + salePrice, ownedAircraft: (p.ownedAircraft || []).filter(a => a.id !== acId) };
    });
  }, []);

  // ═══════════════════════════════════════
  // ITEMS - YACHT ACTIONS
  // ═══════════════════════════════════════

  const buyYacht = useCallback((info) => {
    setState(p => {
      if (p.balance < info.totalPrice) return p;
      const yacht = {
        id: generateId('yacht'), yachtDefId: info.yachtDefId, name: info.name,
        image: info.image, basePrice: info.basePrice, teamHired: info.teamHired,
        designType: info.designType, locationId: info.locationId || 'public_harbor',
        totalPrice: info.totalPrice, purchasedAt: Date.now(),
      };
      return { ...p, balance: p.balance - info.totalPrice, ownedYachts: [...(p.ownedYachts || []), yacht] };
    });
  }, []);

  const sellYacht = useCallback((yachtId) => {
    setState(p => {
      const yacht = (p.ownedYachts || []).find(y => y.id === yachtId);
      if (!yacht) return p;
      const salePrice = Math.floor(yacht.totalPrice * 0.70);
      return { ...p, balance: p.balance + salePrice, ownedYachts: (p.ownedYachts || []).filter(y => y.id !== yachtId) };
    });
  }, []);

  const updateYachtLocation = useCallback((yachtId, locationId) => {
    setState(p => ({
      ...p,
      ownedYachts: (p.ownedYachts || []).map(y => y.id === yachtId ? { ...y, locationId } : y),
    }));
  }, []);

  // ═══════════════════════════════════════
  // ITEMS - COLLECTION ACTIONS
  // ═══════════════════════════════════════

  const buyCollectionItem = useCallback((collectionKey, itemId, price) => {
    setState(p => {
      if (p.balance < price) return p;
      const current = (p.ownedCollections || {})[collectionKey] || [];
      if (current.includes(itemId)) return p;
      return {
        ...p, balance: p.balance - price,
        ownedCollections: { ...(p.ownedCollections || {}), [collectionKey]: [...current, itemId] },
      };
    });
  }, []);

  const sellCollectionItem = useCallback((collectionKey, itemId) => {
    setState(p => {
      const current = (p.ownedCollections || {})[collectionKey] || [];
      if (!current.includes(itemId)) return p;
      const col = COLLECTIONS[collectionKey];
      const item = col?.items.find(i => i.id === itemId);
      if (!item) return p;
      return {
        ...p, balance: p.balance + item.sellPrice,
        ownedCollections: { ...(p.ownedCollections || {}), [collectionKey]: current.filter(id => id !== itemId) },
      };
    });
  }, []);

  // ═══════════════════════════════════════
  // ITEMS - NFT ACTIONS
  // ═══════════════════════════════════════

  const buyNFT = useCallback((nftId, cryptoId, cryptoAmount) => {
    setState(p => {
      if ((p.ownedNFTs || []).includes(nftId)) return p;
      const crypto = (p.ownedCrypto || []).find(c => c.cryptoId === cryptoId);
      if (!crypto || crypto.quantity < cryptoAmount) return p;
      const remaining = parseFloat((crypto.quantity - cryptoAmount).toFixed(8));
      let newCrypto;
      if (remaining <= 0.00000001) {
        newCrypto = (p.ownedCrypto || []).filter(c => c.cryptoId !== cryptoId);
      } else {
        newCrypto = (p.ownedCrypto || []).map(c => c.cryptoId === cryptoId ? { ...c, quantity: remaining } : c);
      }
      return { ...p, ownedCrypto: newCrypto, ownedNFTs: [...(p.ownedNFTs || []), nftId] };
    });
  }, []);

  // ═══════════════════════════════════════
  // ITEMS - ISLAND ACTIONS
  // ═══════════════════════════════════════

  const buyIsland = useCallback((islandId, price) => {
    setState(p => {
      if (p.balance < price) return p;
      if ((p.ownedIslands || []).some(i => i.islandId === islandId)) return p;
      return {
        ...p, balance: p.balance - price,
        ownedIslands: [...(p.ownedIslands || []), { islandId, purchasePrice: price, purchasedAt: Date.now() }],
      };
    });
  }, []);

  const sellIsland = useCallback((islandId) => {
    setState(p => {
      const island = (p.ownedIslands || []).find(i => i.islandId === islandId);
      if (!island) return p;
      const salePrice = Math.floor(island.purchasePrice * (1 - ISLAND_SELL_LOSS_PERCENT));
      return {
        ...p, balance: p.balance + salePrice,
        ownedIslands: (p.ownedIslands || []).filter(i => i.islandId !== islandId),
      };
    });
  }, []);

  // ═══════════════════════════════════════
  // RESET
  // ═══════════════════════════════════════

  const resetGame = useCallback(() => {
    setState({ ...DEFAULTS });
    setBoostActive(false); setBoostTimer(0); setAdStatus('idle');
    setBizBoostRemaining(0); incomeAccRef.current = 0;
    storage.clearGame();
  }, []);

  // ═══════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════

  const value = useMemo(() => ({
    ...state, currentPerClick, currentTier, availableUpgrades, boostedIncomePerHour,
    boostActive, boostTimer, adStatus, bizBoostRemaining,
    // Core
    handleTap, handleUpgrade, startAd, setActiveCard, startBizBoost, resetGame,
    // Business
    buyBusiness, startExpansion, skipExpansion, renameBusiness, closeBusiness,
    startBizAdBoost, getExpansionCost,
    // Management
    hireStaff, fireStaff, buyVehicle, expandParking, buyEquipment,
    buyLicense, buyInventory, buyResources, startProject,
    collectProjectReward, updateBankSettings, buyBankFacility,
    removeRetiredVehicles,
    // Merger (legacy)
    startMerger,
    // Merger Flow (new)
    initMergerFlow, selectMergerTrend, saveMergerConfig,
    investInMergerPhase, skipMergerPhase, completeMergerFlow,
    // Stocks
    buyStock, sellStock,
    // Crypto
    buyCrypto, sellCrypto,
    // Property
    buyProperty, sellProperty, buyImprovement,
    // Items
    buyCar, sellCar, buyAircraft, sellAircraft,
    buyYacht, sellYacht, updateYachtLocation,
    buyCollectionItem, sellCollectionItem, buyNFT,
    buyIsland, sellIsland,
    boostConfigTimer,
    boostMergerPhase,
    startMergerAdBoost,
  }), [
    state, currentPerClick, currentTier, availableUpgrades, boostedIncomePerHour,
    boostActive, boostTimer, adStatus, bizBoostRemaining,
    handleTap, handleUpgrade, startAd, setActiveCard, startBizBoost, resetGame,
    buyBusiness, startExpansion, skipExpansion, renameBusiness, closeBusiness,
    startBizAdBoost, getExpansionCost,
    hireStaff, fireStaff, buyVehicle, expandParking, buyEquipment,
    buyLicense, buyInventory, buyResources, startProject,
    collectProjectReward, updateBankSettings, buyBankFacility,
    removeRetiredVehicles, startMerger,
    initMergerFlow, selectMergerTrend, saveMergerConfig,
    investInMergerPhase, skipMergerPhase, completeMergerFlow,
    buyStock, sellStock, buyCrypto, sellCrypto,
    buyProperty, sellProperty, buyImprovement,
    buyCar, sellCar, buyAircraft, sellAircraft,
    buyYacht, sellYacht, updateYachtLocation,
    buyCollectionItem, sellCollectionItem, buyNFT,
    buyIsland, sellIsland,boostConfigTimer, boostMergerPhase, startMergerAdBoost,
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}