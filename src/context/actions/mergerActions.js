// src/context/actions/mergerActions.js

import { MERGER_BUSINESSES } from '../../data/mergerBusinesses';
import { getIncomeMultiplier, getConfigTimerDuration } from '../../data/mergerFlowData';
import {
  calcTotalIncome, getTotalOutletsForCategory,
  getUniqueCategoryCount, checkAllOutletsComplete,
  getMergerCountForBusiness,
} from '../helpers/incomeCalculator';
import { isFleetBased, isContractBased } from '../../data/businessRequirements';
import { generateId } from '../../utils/helpers';

export const createMergerActions = (setState) => {

  const checkMergerRequirements = (merger, ownedBusinesses) => {
    return merger.requirements.every(req => {
      if (req.type === 'categories') {
        return getUniqueCategoryCount(ownedBusinesses) >= req.count;
      }
      return getTotalOutletsForCategory(ownedBusinesses, req.categoryId, req.subCategoryId) >= req.count;
    });
  };

  const consumeOutletsForMerger = (ownedBusinesses, requirements) => {
    let remaining = [...ownedBusinesses.map(b => ({ ...b }))];
    const consumed = [];

    for (const req of requirements) {
      if (req.type === 'categories') continue;
      let needed = req.count;
      const updatedRemaining = [];

      for (const biz of remaining) {
        if (needed <= 0 || biz.categoryId !== req.categoryId) {
          updatedRemaining.push(biz);
          continue;
        }
        if (req.subCategoryId && biz.subCategoryId !== req.subCategoryId) {
          updatedRemaining.push(biz);
          continue;
        }

        // Skip businesses with incomplete requirements
        if (!checkAllOutletsComplete(biz)) {
          updatedRemaining.push(biz);
          continue;
        }

        const bizCount = getMergerCountForBusiness(biz);
        const toConsume = Math.min(needed, bizCount);
        needed -= toConsume;
        consumed.push({ bizId: biz.id, unitsConsumed: toConsume });

        // For fleet-based: consume vehicles
        if (isFleetBased(biz.categoryId) && biz.categoryId !== 'airlines' && biz.fleet) {
          const remainingVehicles = [...(biz.fleet.vehicles || [])];
          let vehiclesToRemove = toConsume;
          const keptVehicles = [];
          for (const v of remainingVehicles) {
            if (vehiclesToRemove > 0 && v.active) {
              vehiclesToRemove--;
            } else {
              keptVehicles.push(v);
            }
          }
          if (keptVehicles.filter(v => v.active).length > 0) {
            updatedRemaining.push({
              ...biz,
              fleet: { ...biz.fleet, vehicles: keptVehicles },
            });
          }
          continue;
        }

        // For airlines: consume aircraft
        if (biz.categoryId === 'airlines' && biz.airline) {
          const remainingAircraft = [...(biz.airline.aircraft || [])];
          let toRemove = toConsume;
          const keptAircraft = [];
          for (const a of remainingAircraft) {
            if (toRemove > 0 && a.active) {
              toRemove--;
            } else {
              keptAircraft.push(a);
            }
          }
          if (keptAircraft.filter(a => a.active).length > 0) {
            updatedRemaining.push({
              ...biz,
              airline: { ...biz.airline, aircraft: keptAircraft },
            });
          }
          continue;
        }

        // For oil-gas: consume wells
        if (isContractBased(biz.categoryId) && biz.oilgas) {
          const oilWells = [...(biz.oilgas.wells.oil || [])];
          const gasWells = [...(biz.oilgas.wells.gas || [])];
          let toRemove = toConsume;
          const keptOil = [];
          const keptGas = [];
          for (const w of oilWells) {
            if (toRemove > 0 && w.active) { toRemove--; } else { keptOil.push(w); }
          }
          for (const w of gasWells) {
            if (toRemove > 0 && w.active) { toRemove--; } else { keptGas.push(w); }
          }
          if (keptOil.length > 0 || keptGas.length > 0) {
            updatedRemaining.push({
              ...biz,
              oilgas: { ...biz.oilgas, wells: { oil: keptOil, gas: keptGas } },
            });
          }
          continue;
        }

        // Standard outlet-based consumption
        const bizOutlets = biz.outlets || 1;
        const remainingOutlets = bizOutlets - toConsume;
        if (remainingOutlets > 0) {
          const updatedBiz = {
            ...biz,
            outlets: remainingOutlets,
            level: Math.max(1, (biz.level || 1) - toConsume),
          };
          const newOutletReqs = {};
          for (let i = 0; i < remainingOutlets; i++) {
            if (biz.outletRequirements?.[i + toConsume]) {
              newOutletReqs[i] = biz.outletRequirements[i + toConsume];
            }
          }
          updatedBiz.outletRequirements = newOutletReqs;
          updatedRemaining.push(updatedBiz);
        }
      }
      remaining = updatedRemaining;
    }
    return { remainingBusinesses: remaining, consumed };
  };

  // ═══ INIT MERGER FLOW ═══
  const initMergerFlow = (mergerId, name) => {
    let flowId = null;

    setState(p => {
      const merger = MERGER_BUSINESSES.find(m => m.id === mergerId);
      if (!merger || p.balance < merger.investment) return p;
      if (!checkMergerRequirements(merger, p.ownedBusinesses)) return p;

      const { remainingBusinesses, consumed } = consumeOutletsForMerger(
        p.ownedBusinesses, merger.requirements
      );

      flowId = generateId('mflow');

      return {
        ...p,
        balance: p.balance - merger.investment,
        ownedBusinesses: remainingBusinesses,
        activeMergerFlows: [...(p.activeMergerFlows || []), {
          id: flowId,
          mergerId,
          name: name.trim(),
          consumedOutlets: consumed,
          selectedTrend: null,
          configuration: null,
          configScore: null,
          configTimerEndTime: null,
          configCompleted: false,
          phases: [],
          mergerAdBoostEndTime: null,
          mergerAdBoostPercent: 0,
          startedAt: Date.now(),
          isReconfigure: false,
        }],
        incomePerHour: calcTotalIncome(
          remainingBusinesses, p.mergedBusinesses, p.ownedProperties, p.ownedStocks
        ),
      };
    });

    return flowId;
  };

  // ═══ RECONFIGURE MERGER — Creates flow that adds income to parent ═══
  const reconfigureMerger = (mergedId) => {
    let flowId = null;

    setState(p => {
      const merged = (p.mergedBusinesses || []).find(m => m.id === mergedId);
      if (!merged) return p;

      flowId = generateId('mflow');

      return {
        ...p,
        activeMergerFlows: [...(p.activeMergerFlows || []), {
          id: flowId,
          mergerId: merged.mergerId,
          name: merged.name,
          consumedOutlets: [],
          selectedTrend: null,
          configuration: null,
          configScore: null,
          configTimerEndTime: null,
          configCompleted: false,
          phases: [],
          mergerAdBoostEndTime: null,
          mergerAdBoostPercent: 0,
          startedAt: Date.now(),
          isReconfigure: true,
          parentMergedId: mergedId,
          previousIncomePerHour: merged.incomePerHour,
          previousConfigScore: merged.configScore,
        }],
      };
    });

    return flowId;
  };

  const selectMergerTrend = (flowId, trendId) => {
    setState(p => ({
      ...p,
      activeMergerFlows: (p.activeMergerFlows || []).map(f =>
        f.id === flowId ? { ...f, selectedTrend: trendId } : f
      ),
    }));
  };

  const saveMergerConfig = (flowId, config, score) => {
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
  };

  const boostConfigTimer = (flowId) => {
    setState(p => ({
      ...p,
      activeMergerFlows: (p.activeMergerFlows || []).map(f => {
        if (f.id !== flowId || !f.configTimerEndTime) return f;
        const remaining = Math.max(0, f.configTimerEndTime - Date.now());
        return { ...f, configTimerEndTime: Date.now() + Math.floor(remaining / 4) };
      }),
    }));
  };

  const investInMergerPhase = (flowId, phaseIdx, cost, duration) => {
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
  };

  const boostMergerPhase = (flowId, phaseIdx) => {
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
  };

  const skipMergerPhase = boostMergerPhase;

  const startMergerAdBoost = (flowId, percent = 15, hours = 4) => {
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
  };

  // ═══ COMPLETE MERGER FLOW ═══
  const completeMergerFlow = (flowId) => {
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
        parentMergedId: flow.parentMergedId || null,
        isCollection: flow.isReconfigure || false,
      };

      const updatedFlows = (p.activeMergerFlows || []).filter(f => f.id !== flowId);
      let updatedMerged = [...(p.mergedBusinesses || [])];

      if (flow.isReconfigure && flow.parentMergedId) {
        // ADD income to parent merged business instead of creating new entry
        updatedMerged = updatedMerged.map(m => {
          if (m.id === flow.parentMergedId) {
            return {
              ...m,
              incomePerHour: m.incomePerHour + finalIncome,
              configScore: flow.configScore,
              selectedTrend: flow.selectedTrend,
              lastCollectionAt: Date.now(),
              collectionCount: (m.collectionCount || 1) + 1,
            };
          }
          return m;
        });
      } else {
        // New merger — add to list
        updatedMerged = [...updatedMerged, newMerged];
      }

      return {
        ...p,
        mergedBusinesses: updatedMerged,
        activeMergerFlows: updatedFlows,
        incomePerHour: calcTotalIncome(
          p.ownedBusinesses, updatedMerged, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  };

  // ═══ COMPLETE RECONFIGURE FLOW (alias) ═══
  const completeReconfigureFlow = (flowId) => {
    completeMergerFlow(flowId);
  };

  const startMerger = (merger) => {
    setState(p => {
      if (p.balance < merger.investment) return p;
      if (!checkMergerRequirements(merger, p.ownedBusinesses)) return p;

      const { remainingBusinesses } = consumeOutletsForMerger(
        p.ownedBusinesses, merger.requirements
      );

      const newMerged = {
        id: generateId('merged'),
        mergerId: merger.id,
        name: merger.name,
        incomePerHour: merger.incomePerHour,
        startedAt: Date.now(),
      };
      const updatedMerged = [...(p.mergedBusinesses || []), newMerged];
      return {
        ...p,
        balance: p.balance - merger.investment,
        ownedBusinesses: remainingBusinesses,
        mergedBusinesses: updatedMerged,
        incomePerHour: calcTotalIncome(
          remainingBusinesses, updatedMerged, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  };

  return {
    initMergerFlow, selectMergerTrend, saveMergerConfig,
    boostConfigTimer, investInMergerPhase, boostMergerPhase,
    skipMergerPhase, startMergerAdBoost, completeMergerFlow,
    completeReconfigureFlow, startMerger, reconfigureMerger,
  };
};