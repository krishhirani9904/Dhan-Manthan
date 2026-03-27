// src/context/GameContext.jsx
import { useState, useCallback, useMemo, useEffect, useRef, createContext } from 'react';
import { storage } from '../services/storage';
import { CARD_TIERS, getCardTier, getCardBonus } from '../data/cardTiers';
import { getCategoryById } from '../data/businessCategories';
import { isFleetBased, isContractBased, isOutletBased, VEHICLE_CATEGORIES } from '../data/businessRequirements';
import { getKmConfig } from '../data/fleetVehicles';
import { MERGER_BUSINESSES } from '../data/mergerBusinesses';
import { getIncomeMultiplier } from '../data/mergerFlowData';
import {
  BIZ_BOOST_PERCENT, BIZ_BOOST_DURATION,
  MAX_OFFLINE_HOURS, MAX_BUSINESS_LEVEL
} from '../config/constants';
import { EARNINGS_DEFAULTS } from './EarningsContext';

import { calcTotalIncome, calcBusinessIncome, calcPortfolioValue } from './helpers/incomeCalculator';
import { processVehicleWear } from './helpers/vehicleProcessor';
import { DEFAULTS, buildInitialState } from './gameDefaults';

import { createBusinessActions } from './actions/businessActions';
import { createManagementActions } from './actions/managementActions';
import { createMergerActions } from './actions/mergerActions';
import { createInvestingActions } from './actions/investingActions';
import { createItemActions } from './actions/itemActions';

// 🆕 ADD THIS IMPORT
import { 
  generateContractForCustomer, 
  getNextAvailableCustomer 
} from '../data/oilGasData';

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = storage.loadGame();
    return buildInitialState(saved);
  });

  const saveRef = useRef(null);
  const bizTimerRef = useRef(null);
  const incomeAccRef = useRef(0);
  const mainIntervalRef = useRef(null);

  const [bizBoostRemaining, setBizBoostRemaining] = useState(0);

  const businessActions = useMemo(() => createBusinessActions(setState), []);
  const managementActions = useMemo(() => createManagementActions(setState), []);
  const mergerActions = useMemo(() => createMergerActions(setState), []);
  const investingActions = useMemo(() => createInvestingActions(setState), []);
  const itemActions = useMemo(() => createItemActions(setState), []);

  const getExpansionCost = useCallback((bizId) => {
    return businessActions.getExpansionCost(bizId, state.ownedBusinesses);
  }, [state.ownedBusinesses, businessActions]);

  const getExpansionTime = useCallback((bizId) => {
    const biz = state.ownedBusinesses.find(b => b.id === bizId);
    if (!biz) return 0;
    return businessActions.getExpansionTime(biz);
  }, [state.ownedBusinesses, businessActions]);

  const portfolioValue = useMemo(() => calcPortfolioValue(state), [
    state.balance, state.ownedStocks, state.ownedCrypto,
    state.ownedProperties, state.ownedBusinesses,
    state.ownedCars, state.ownedAircraft, state.ownedYachts,
  ]);

  useEffect(() => {
    if (state.bizBoostEndTime) {
      const rem = Math.floor((state.bizBoostEndTime - Date.now()) / 1000);
      if (rem > 0) {
        setState(p => ({ ...p, bizBoostActive: true }));
        setBizBoostRemaining(rem);
      } else {
        setState(p => ({ ...p, bizBoostActive: false, bizBoostPercent: 0, bizBoostEndTime: null }));
      }
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

  // ═══ MAIN GAME LOOP ═══
  useEffect(() => {
    mainIntervalRef.current = setInterval(() => {
      setState(prev => {
        let updated = { ...prev };
        let businessesChanged = false;

        const updatedBusinesses = prev.ownedBusinesses.map(biz => {
          let bu = { ...biz };
          let changed = false;

          // ─── OUTLET EXPANSION COMPLETION ───
          if (isOutletBased(biz.categoryId) && biz.expansionEndTime && Date.now() >= biz.expansionEndTime) {
            const cat = getCategoryById(biz.categoryId);
            const growth = cat?.profitGrowthPercent || 15;
            const newOutlets = (biz.outlets || 1) + 1;
            bu.level = Math.min((biz.level || 1) + 1, MAX_BUSINESS_LEVEL);
            bu.outlets = newOutlets;
            bu.incomePerHour = Math.floor(biz.incomePerHour * (1 + growth / 100));
            bu.expansionEndTime = null;
            bu.outletRequirements = {
              ...(biz.outletRequirements || {}),
              [newOutlets - 1]: { staff: {}, equipment: {}, licenses: {}, inventory: {} },
            };
            changed = true;
          }

          // ─── FLEET EXPANSION COMPLETION ───
          if (bu.fleet?.expansionEndTime && Date.now() >= bu.fleet.expansionEndTime) {
            bu.fleet = {
              ...bu.fleet,
              capacity: (bu.fleet.capacity || 5) + (bu.fleet.expansionSlots || 5),
              expansionEndTime: null,
              expansionSlots: 0,
              expansionCount: (bu.fleet.expansionCount || 0) + 1,
            };
            changed = true;
          }

          // ─── FLEET KM ACCUMULATION ───
          if (bu.fleet?.vehicles?.length > 0) {
            const kmConfig = getKmConfig(biz.categoryId);
            const minKmPerSec = kmConfig.minKmPerHour / 3600;
            const maxKmPerSec = kmConfig.maxKmPerHour / 3600;

            let fleetChanged = false;
            const updatedVehicles = bu.fleet.vehicles.map(v => {
              if (!v.active) return v;
              const randomKm = minKmPerSec + Math.random() * (maxKmPerSec - minKmPerSec);
              const newKm = (v.kmDriven || 0) + randomKm;
              if (newKm >= v.resourceKm) {
                fleetChanged = true;
                return { ...v, kmDriven: v.resourceKm, active: false, retiredAt: Date.now() };
              }
              return { ...v, kmDriven: newKm };
            });

            if (fleetChanged) changed = true;
            bu.fleet = { ...bu.fleet, vehicles: updatedVehicles };
          }

          // ─── AIRLINE FLIGHT COMPLETION ───
          if (bu.airline?.activeFlights?.length > 0) {
            const completedFlights = bu.airline.activeFlights.filter(
              f => f.endTime && Date.now() >= f.endTime
            );
            if (completedFlights.length > 0) {
              completedFlights.forEach(f => {
                const durationHours = (f.endTime - f.startTime) / 3600000;
                const reward = Math.floor((f.incomePerHour || 0) * durationHours);
                updated.balance = (updated.balance || prev.balance) + reward;
              });

              bu.airline = {
                ...bu.airline,
                activeFlights: bu.airline.activeFlights.filter(
                  f => !f.endTime || Date.now() < f.endTime
                ),
              };
              changed = true;
            }
          }

          // ─── OIL & GAS PRODUCTION ───
          if (bu.oilgas) {
            const stock = { ...(bu.oilgas.stock || { oil: 0, gas: 0 }) };
            let prodChanged = false;

            // Accumulate stock from wells (per second)
            ['oil', 'gas'].forEach(fuelType => {
              (bu.oilgas.wells?.[fuelType] || []).forEach(well => {
                if (well.active) {
                  const perSecond = well.productionPerDay / 86400;
                  stock[fuelType] = (stock[fuelType] || 0) + perSecond;
                  prodChanged = true;
                }
              });
            });

            if (prodChanged) {
              bu.oilgas = { ...bu.oilgas, stock };
              changed = true;
            }

            // 🆕 AUTO-GENERATE FIRST PENDING CONTRACT (if none exists)
            if (!bu.oilgas.pendingContract && !bu.oilgas.activeContract) {
              const completedContracts = bu.oilgas.completedContracts || 0;
              const nextCustomer = getNextAvailableCustomer(completedContracts, null);
              const nextContractData = nextCustomer ? generateContractForCustomer(nextCustomer) : null;
              
              if (nextContractData) {
                bu.oilgas = {
                  ...bu.oilgas,
                  pendingContract: {
                    ...nextContractData,
                    customerId: nextCustomer.id,
                    customerName: nextCustomer.name,
                    customerLogo: nextCustomer.logo,
                    customerTier: nextCustomer.tier,
                  },
                };
                changed = true;
              }
            }

            // Well lifespan tracking
            let wellsChanged = false;
            const updatedWells = {};
            ['oil', 'gas'].forEach(fuelType => {
              updatedWells[fuelType] = (bu.oilgas.wells?.[fuelType] || []).map(well => {
                if (!well.active) return well;
                const newDays = (well.daysActive || 0) + (1 / 86400);
                if (newDays >= well.maxLifespan) {
                  wellsChanged = true;
                  return { ...well, daysActive: well.maxLifespan, active: false };
                }
                return { ...well, daysActive: newDays };
              });
            });
            if (wellsChanged) {
              bu.oilgas = { ...bu.oilgas, wells: updatedWells };
              changed = true;
            }
          }

          // ─── BIZ AD BOOST EXPIRY ───
          if (biz.bizAdBoostEndTime && Date.now() >= biz.bizAdBoostEndTime) {
            bu.bizAdBoostEndTime = null;
            bu.bizAdBoostPercent = 0;
            changed = true;
          }

          // ─── LEGACY VEHICLE WEAR (outlet-based with vehicles) ───
          if (biz.vehicles?.length > 0 && isOutletBased(biz.categoryId)) {
            const vc = VEHICLE_CATEGORIES[biz.categoryId];
            const processed = processVehicleWear(biz.vehicles, vc?.kmPerHour);
            if (processed.some((v, i) => v.active !== biz.vehicles[i]?.active)) changed = true;
            bu.vehicles = processed;
          }

          // ─── PROJECT COMPLETION ───
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
              bu.projects = updProjects;
              changed = true;
            } else {
              bu.projects = updProjects;
            }
          }

          bu.totalEarnings = (biz.totalEarnings || 0) + calcBusinessIncome(biz) / 3600;
          if (changed) businessesChanged = true;
          return changed ? bu : { ...biz, totalEarnings: bu.totalEarnings, fleet: bu.fleet, oilgas: bu.oilgas };
        });

        updated.ownedBusinesses = updatedBusinesses;
        if (businessesChanged) {
          updated.incomePerHour = calcTotalIncome(
            updatedBusinesses, prev.mergedBusinesses, prev.ownedProperties, prev.ownedStocks
          );
        }

        // ─── MERGER FLOW PROCESSING ───
        if (prev.activeMergerFlows?.length > 0) {
          let flowsChanged = false;
          const updatedFlows = (updated.activeMergerFlows || prev.activeMergerFlows).map(flow => {
            let changed = false;
            let f = { ...flow };

            if (f.configTimerEndTime && !f.configCompleted && Date.now() >= f.configTimerEndTime) {
              f.configCompleted = true;
              changed = true;
            }

            if (f.mergerAdBoostEndTime && Date.now() >= f.mergerAdBoostEndTime) {
              f.mergerAdBoostEndTime = null;
              f.mergerAdBoostPercent = 0;
              changed = true;
            }

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

        // ─── INCOME ACCUMULATION ───
        const cardBonus = getCardBonus(prev.activeCardId);
        const bizBoostMult = prev.bizBoostActive ? (1 + prev.bizBoostPercent / 100) : 1;

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

  // Biz boost timer
  useEffect(() => {
    if (bizTimerRef.current) { clearInterval(bizTimerRef.current); bizTimerRef.current = null; }
    if (bizBoostRemaining > 0) {
      bizTimerRef.current = setInterval(() => {
        setBizBoostRemaining(p => {
          if (p <= 1) {
            clearInterval(bizTimerRef.current);
            bizTimerRef.current = null;
            setState(s => ({ ...s, bizBoostActive: false, bizBoostPercent: 0, bizBoostEndTime: null }));
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    }
    return () => { if (bizTimerRef.current) { clearInterval(bizTimerRef.current); bizTimerRef.current = null; } };
  }, [bizBoostRemaining > 0]);

  // Auto-save
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

  const currentTier = useMemo(() => getCardTier(state.balance), [state.balance]);

  const boostedIncomePerHour = useMemo(() => {
    const cardBonus = getCardBonus(state.activeCardId);
    let income = state.incomePerHour;
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
    if (state.bizBoostActive && state.bizBoostPercent > 0) {
      income = Math.floor(income * (1 + state.bizBoostPercent / 100));
    }
    return Math.floor(income * (1 + cardBonus));
  }, [state.incomePerHour, state.bizBoostActive, state.bizBoostPercent, state.activeCardId, state.activeMergerFlows]);

  const addBalance = useCallback((amount) => { setState(p => ({ ...p, balance: p.balance + amount })); }, []);
  const deductBalance = useCallback((amount) => { setState(p => ({ ...p, balance: Math.max(0, p.balance - amount) })); }, []);
  const updateEarningsState = useCallback((earningsState) => { setState(p => ({ ...p, earningsState })); }, []);

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

  const [resetSignal, setResetSignal] = useState(0);

  const resetGame = useCallback(() => {
    setState({ ...DEFAULTS });
    setBizBoostRemaining(0);
    incomeAccRef.current = 0;
    setResetSignal(p => p + 1);
    storage.clearGame();
  }, []);

  // ═══════════════════════════════════════════════════════
  // 🆕 OIL & GAS CONTRACT FUNCTIONS
  // ═══════════════════════════════════════════════════════

  const signContract = useCallback((bizId, contract) => {
    setState(prev => ({
      ...prev,
      ownedBusinesses: prev.ownedBusinesses.map(b => {
        if (b.id !== bizId || !b.oilgas) return b;
        
        const stock = b.oilgas.stock || { oil: 0, gas: 0 };
        
        // Stock માંથી requirements minus કરો
        const newStock = { ...stock };
        Object.entries(contract.requirements).forEach(([fuel, amount]) => {
          newStock[fuel] = Math.max(0, (newStock[fuel] || 0) - amount);
        });
        
        return {
          ...b,
          oilgas: {
            ...b.oilgas,
            stock: newStock,
            activeContract: {
              ...contract,
              startTime: Date.now(),
              endTime: Date.now() + (contract.duration * 1000),
            },
            pendingContract: null,
          }
        };
      })
    }));
  }, []);

  const collectContractReward = useCallback((bizId) => {
    setState(prev => {
      const biz = prev.ownedBusinesses.find(b => b.id === bizId);
      if (!biz?.oilgas?.activeContract) return prev;
      
      const reward = biz.oilgas.activeContract.reward || 0;
      const completedContracts = (biz.oilgas.completedContracts || 0) + 1;
      
      // Next contract generate કરો
      const nextCustomer = getNextAvailableCustomer(completedContracts, null);
      const nextContractData = nextCustomer ? generateContractForCustomer(nextCustomer) : null;
      
      return {
        ...prev,
        balance: prev.balance + reward,
        ownedBusinesses: prev.ownedBusinesses.map(b => {
          if (b.id !== bizId) return b;
          return {
            ...b,
            oilgas: {
              ...b.oilgas,
              activeContract: null,
              completedContracts,
              pendingContract: nextContractData ? {
                ...nextContractData,
                customerId: nextCustomer.id,
                customerName: nextCustomer.name,
                customerLogo: nextCustomer.logo,
                customerTier: nextCustomer.tier,
              } : null,
            }
          };
        })
      };
    });
  }, []);

  const regenerateContract = useCallback((bizId) => {
    setState(prev => ({
      ...prev,
      ownedBusinesses: prev.ownedBusinesses.map(b => {
        if (b.id !== bizId || !b.oilgas || b.oilgas.activeContract) return b;
        
        const completedContracts = b.oilgas.completedContracts || 0;
        const nextCustomer = getNextAvailableCustomer(completedContracts, null);
        const nextContractData = nextCustomer ? generateContractForCustomer(nextCustomer) : null;
        
        return {
          ...b,
          oilgas: {
            ...b.oilgas,
            pendingContract: nextContractData ? {
              ...nextContractData,
              customerId: nextCustomer.id,
              customerName: nextCustomer.name,
              customerLogo: nextCustomer.logo,
              customerTier: nextCustomer.tier,
            } : null,
          }
        };
      })
    }));
  }, []);

  // ═══════════════════════════════════════════════════════

  const value = useMemo(() => ({
    ...state,
    currentTier,
    boostedIncomePerHour,
    bizBoostRemaining,
    portfolioValue,

    addBalance, deductBalance, updateEarningsState, resetSignal,
    setActiveCard, startBizBoost, resetGame,

    // Business
    buyBusiness: businessActions.buyBusiness,
    startExpansion: businessActions.startExpansion,
    skipExpansion: businessActions.skipExpansion,
    renameBusiness: businessActions.renameBusiness,
    closeBusiness: businessActions.closeBusiness,
    startBizAdBoost: businessActions.startBizAdBoost,
    getExpansionCost,
    getExpansionTime,
    hireOutletStaff: businessActions.hireOutletStaff,
    buyOutletEquipment: businessActions.buyOutletEquipment,
    buyOutletLicense: businessActions.buyOutletLicense,
    buyOutletInventory: businessActions.buyOutletInventory,

    // Fleet
    startFleetExpansion: businessActions.startFleetExpansion,
    skipFleetExpansion: businessActions.skipFleetExpansion,
    buyFleetVehicle: businessActions.buyFleetVehicle,

    // Airline
    buyAirlineLicense: businessActions.buyAirlineLicense,
    buyAirlineHub: businessActions.buyAirlineHub,
    buyAirlineAircraft: businessActions.buyAirlineAircraft,
    startAirlineFlight: businessActions.startAirlineFlight,
    hireAirlineStaff: businessActions.hireAirlineStaff,

    // 🆕 Oil & Gas - UPDATED THESE 3 LINES
    buyWell: businessActions.buyWell,
    signContract,
    collectContractReward,
    regenerateContract,

    // Management
    hireStaff: managementActions.hireStaff,
    fireStaff: managementActions.fireStaff,
    buyVehicle: managementActions.buyVehicle,
    expandParking: managementActions.expandParking,
    buyEquipment: managementActions.buyEquipment,
    buyLicense: managementActions.buyLicense,
    buyInventory: managementActions.buyInventory,
    buyResources: managementActions.buyResources,
    startProject: managementActions.startProject,
    collectProjectReward: managementActions.collectProjectReward,
    updateBankSettings: managementActions.updateBankSettings,
    buyBankFacility: managementActions.buyBankFacility,
    removeRetiredVehicles: managementActions.removeRetiredVehicles,

    // Merger
    startMerger: mergerActions.startMerger,
    initMergerFlow: mergerActions.initMergerFlow,
    selectMergerTrend: mergerActions.selectMergerTrend,
    saveMergerConfig: mergerActions.saveMergerConfig,
    boostConfigTimer: mergerActions.boostConfigTimer,
    investInMergerPhase: mergerActions.investInMergerPhase,
    boostMergerPhase: mergerActions.boostMergerPhase,
    skipMergerPhase: mergerActions.skipMergerPhase,
    startMergerAdBoost: mergerActions.startMergerAdBoost,
    completeMergerFlow: mergerActions.completeMergerFlow,
    reconfigureMerger: mergerActions.reconfigureMerger,
    completeReconfigureFlow: mergerActions.completeReconfigureFlow,

    // Investing
    buyStock: investingActions.buyStock,
    sellStock: investingActions.sellStock,
    buyCrypto: investingActions.buyCrypto,
    sellCrypto: investingActions.sellCrypto,
    buyProperty: investingActions.buyProperty,
    sellProperty: investingActions.sellProperty,
    buyImprovement: investingActions.buyImprovement,

    // Items
    buyCar: itemActions.buyCar,
    sellCar: itemActions.sellCar,
    buyAircraft: itemActions.buyAircraft,
    sellAircraft: itemActions.sellAircraft,
    buyYacht: itemActions.buyYacht,
    sellYacht: itemActions.sellYacht,
    updateYachtLocation: itemActions.updateYachtLocation,
    buyCollectionItem: itemActions.buyCollectionItem,
    sellCollectionItem: itemActions.sellCollectionItem,
    buyNFT: itemActions.buyNFT,
    buyIsland: itemActions.buyIsland,
    sellIsland: itemActions.sellIsland,
  }), [
    state, currentTier, boostedIncomePerHour, bizBoostRemaining, portfolioValue,
    addBalance, deductBalance, updateEarningsState, resetSignal,
    setActiveCard, startBizBoost, resetGame, getExpansionCost, getExpansionTime,
    businessActions, managementActions, mergerActions,
    investingActions, itemActions,
    // 🆕 ADD THESE 3
    signContract, collectContractReward, regenerateContract,
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}