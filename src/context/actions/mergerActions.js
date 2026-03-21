// src/context/actions/mergerActions.js

import { MERGER_BUSINESSES } from '../../data/mergerBusinesses';
import { getIncomeMultiplier, getConfigTimerDuration } from '../../data/mergerFlowData';
import { calcTotalIncome, getTotalOutletsForCategory, getUniqueCategoryCount } from '../helpers/incomeCalculator';
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

        const bizOutlets = biz.outlets || 1;
        const toConsume = Math.min(needed, bizOutlets);
        needed -= toConsume;
        consumed.push({ bizId: biz.id, outletsConsumed: toConsume });

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

  // ═══ INIT MERGER FLOW — NO blocking for same type ═══
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

  // ═══ RECONFIGURE MERGER — KEEP existing, create NEW collection flow ═══
  const reconfigureMerger = (mergedId) => {
    let flowId = null;

    setState(p => {
      const merged = (p.mergedBusinesses || []).find(m => m.id === mergedId);
      if (!merged) return p;

      flowId = generateId('mflow');

      // DO NOT remove existing merged business — it stays and keeps earning
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
        // incomePerHour stays the same — existing merger still earning
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

  // ═══ COMPLETE MERGER FLOW — adds NEW collection (never removes parent) ═══
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
        collectionNumber: flow.isReconfigure
          ? (p.mergedBusinesses || []).filter(
              m => m.mergerId === flow.mergerId
            ).length + 1
          : 1,
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
    startMerger, reconfigureMerger,
  };
};