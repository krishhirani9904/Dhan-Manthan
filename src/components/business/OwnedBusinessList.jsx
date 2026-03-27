// src/components/business/OwnedBusinessList.jsx
import { useNavigate } from 'react-router-dom';
import {
  Building2, ChevronRight, GitMerge, TrendingUp,
  Clock, Check, AlertTriangle, Car, Truck, Plane, Fuel
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useGame } from '../../hooks/useGame';
import { theme } from '../../design/tokens';
import { formatCurrency } from '../../utils/formatCurrency';
import { getCategoryById } from '../../data/businessCategories';
import { MERGER_BUSINESSES } from '../../data/mergerBusinesses';
import { getIncomeMultiplier } from '../../data/mergerFlowData';
import {
  calcBusinessIncome, countActiveOutlets, checkRequiredComplete,
  countActiveFleetVehicles
} from '../../context/helpers/incomeCalculator';
import {
  STAFF_TYPES, EQUIPMENT_TYPES, LICENSE_TYPES, INVENTORY_TYPES,
  isFleetBased, isContractBased
} from '../../data/businessRequirements';

const getMissingCount = (biz) => {
  const catId = biz.categoryId;
  let missing = 0;
  const staffDefs = STAFF_TYPES[catId] || [];
  for (const s of staffDefs) {
    if ((s.required || s.min > 0) && (biz.staff?.[s.id] || 0) < Math.max(s.min || 1, 1)) missing++;
  }
  const equipDefs = EQUIPMENT_TYPES[catId] || [];
  for (const e of equipDefs) { if (e.required && !(biz.equipment?.[e.id])) missing++; }
  const licenseDefs = LICENSE_TYPES[catId] || [];
  for (const l of licenseDefs) { if (l.required && !biz.licenses?.[l.id]) missing++; }
  const invDefs = INVENTORY_TYPES[catId] || [];
  for (const i of invDefs) { if (i.required && (biz.inventory?.[i.id] || 0) <= 0) missing++; }
  return missing;
};

function OwnedBusinessList() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedBusinesses, activeMergerFlows, mergedBusinesses } = useGame();

  const getCategoryInfo = (categoryId) => {
    const cat = getCategoryById(categoryId);
    return cat ? { Icon: cat.icon, color: cat.color } : { Icon: Building2, color: 'bg-gray-500' };
  };

  const getBusinessIcon = (biz) => {
    if (biz.categoryId === 'taxi') return Car;
    if (biz.categoryId === 'shipping') return Truck;
    if (biz.categoryId === 'airlines') return Plane;
    if (biz.categoryId === 'oil-gas') return Fuel;
    return getCategoryInfo(biz.categoryId).Icon;
  };

  const getBusinessNavigation = (biz) => {
    if (isFleetBased(biz.categoryId) && biz.categoryId !== 'airlines') {
      return `/business/fleet/${biz.id}`;
    }
    if (biz.categoryId === 'airlines') {
      return `/business/airline/${biz.id}`;
    }
    if (isContractBased(biz.categoryId)) {
      return `/business/oilgas/${biz.id}`;
    }
    return `/business/detail/${biz.id}`;
  };

  const getBusinessStats = (biz) => {
    if (isFleetBased(biz.categoryId) && biz.categoryId !== 'airlines') {
      const activeVehicles = countActiveFleetVehicles(biz);
      const capacity = biz.fleet?.capacity || 5;
      return {
        label: `${activeVehicles}/${capacity} cars`,
        showWarning: activeVehicles === 0
      };
    }
    if (biz.categoryId === 'airlines') {
      const aircraft = (biz.airline?.aircraft || []).filter(a => a.active).length;
      const hubs = (biz.airline?.hubs || []).length;
      return {
        label: `${aircraft} aircraft • ${hubs} hubs`,
        showWarning: aircraft === 0
      };
    }
    if (isContractBased(biz.categoryId)) {
      const oilWells = (biz.oilgas?.wells?.oil || []).filter(w => w.active).length;
      const gasWells = (biz.oilgas?.wells?.gas || []).filter(w => w.active).length;
      return {
        label: `${oilWells} oil • ${gasWells} gas wells`,
        showWarning: oilWells === 0 && gasWells === 0
      };
    }
    const activeOutlets = countActiveOutlets(biz);
    const outlets = biz.outlets || 1;
    return {
      label: `Lv.${biz.level || 1} • ${activeOutlets}/${outlets} active`,
      showWarning: !checkRequiredComplete(biz)
    };
  };

  const totalCompanies = (ownedBusinesses?.length || 0) + (activeMergerFlows?.length || 0) + (mergedBusinesses?.length || 0);

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full">
      <h3 className={`text-sm font-bold mb-2 ${t.text.primary}`}>
        My Companies{totalCompanies > 0 ? ` (${totalCompanies})` : ''}
      </h3>

      {totalCompanies === 0 ? (
        <div className={`flex-1 flex items-center justify-center rounded-xl border border-dashed ${t.border.default}`}>
          <div className="text-center py-8">
            <Building2 className={`w-10 h-10 mx-auto mb-3 ${t.text.tertiary}`} />
            <p className={`text-sm font-medium ${t.text.secondary}`}>No businesses yet.</p>
            <p className={`text-xs mt-1 ${t.text.tertiary}`}>Start a business to see it here</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          <div className="space-y-2 pb-4">

            {/* ═══ COMPLETED MERGERS ═══ */}
            {mergedBusinesses?.map((merged) => {
              const mergerDef = MERGER_BUSINESSES.find(m => m.id === merged.mergerId);
              const MergerIcon = mergerDef?.icon || GitMerge;
              const color = mergerDef?.color || 'bg-purple-500';

              return (
                <button key={merged.id}
                  onClick={() => navigate(`/business/merged/${merged.id}`)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left
                    transition-all active:scale-[0.98]
                    ${t.bg.card} border ${isDark ? 'border-green-500/20' : 'border-green-200'}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <MergerIcon className="w-5.5 h-5.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold truncate ${t.text.primary}`}>{merged.name}</p>
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-500/15 text-green-500 flex-shrink-0">MERGER</span>
                    </div>
                    <p className={`text-[11px] mt-0.5 ${t.text.tertiary}`}>{mergerDef?.name || 'Business Merger'}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-[10px] font-medium text-green-500">Active</span>
                        {merged.collectionCount > 1 && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'} ${t.text.tertiary}`}>
                            {merged.collectionCount} collections
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-green-500">{formatCurrency(merged.incomePerHour)}</span>
                        <span className={`text-[10px] ${t.text.tertiary}`}>per hour</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${t.text.tertiary}`} />
                </button>
              );
            })}

            {/* ═══ IN-PROGRESS MERGERS ═══ */}
            {activeMergerFlows?.map((flow) => {
              const mergerDef = MERGER_BUSINESSES.find(m => m.id === flow.mergerId);
              const MergerIcon = mergerDef?.icon || GitMerge;
              const color = mergerDef?.color || 'bg-purple-500';
              const totalPhases = 4;
              const completedPhases = (flow.phases || []).filter(p => p.status === 'completed').length;
              const progressPercent = Math.round((completedPhases / totalPhases) * 100);

              let currentFlowIncome = 0;
              if (flow.configCompleted && mergerDef) {
                const mult = getIncomeMultiplier(flow.configScore?.percentage || 50);
                currentFlowIncome = Math.floor(mergerDef.incomePerHour * mult);
                if (flow.mergerAdBoostEndTime && Date.now() < flow.mergerAdBoostEndTime) {
                  currentFlowIncome = Math.floor(currentFlowIncome * (1 + (flow.mergerAdBoostPercent || 15) / 100));
                }
              }

              const getFlowNavigation = () => {
                if (flow.phases?.length > 0) return `/business/merger/development/${flow.id}`;
                if (flow.configCompleted) return `/business/merger/development/${flow.id}`;
                if (flow.configuration) return `/business/merger/configurator/${flow.id}`;
                if (flow.selectedTrend) return `/business/merger/configurator/${flow.id}`;
                return `/business/merger/trends/${flow.id}`;
              };

              return (
                <button key={flow.id} onClick={() => navigate(getFlowNavigation())}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left
                    transition-all active:scale-[0.98]
                    ${t.bg.card} border ${isDark ? 'border-orange-500/20' : 'border-orange-200'}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <MergerIcon className="w-5.5 h-5.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold truncate ${t.text.primary}`}>{flow.name}</p>
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-orange-500/15 text-orange-500 flex-shrink-0">
                        {flow.isReconfigure ? 'RECONFIGURING' : 'IN PROGRESS'}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-0.5 ${t.text.tertiary}`}>{mergerDef?.name || 'Business Merger'}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-orange-500" />
                        <span className={`text-[11px] font-medium ${t.text.secondary}`}>Phase {completedPhases}/{totalPhases}</span>
                      </div>
                      {currentFlowIncome > 0 && (
                        <div className="flex items-baseline gap-1">
                          <span className={`text-sm font-bold ${t.text.primary}`}>{formatCurrency(currentFlowIncome)}</span>
                          <span className={`text-[10px] ${t.text.tertiary}`}>per hour</span>
                        </div>
                      )}
                    </div>
                    <div className={`w-full h-1.5 rounded-full mt-1.5 overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                      <div className="h-full rounded-full bg-orange-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${t.text.tertiary}`} />
                </button>
              );
            })}

            {/* ═══ REGULAR BUSINESSES ═══ */}
            {ownedBusinesses?.map((biz) => {
              const { color } = getCategoryInfo(biz.categoryId);
              const BizIcon = getBusinessIcon(biz);
              const stats = getBusinessStats(biz);
              const effectiveIncome = calcBusinessIncome(biz);
              const isFleet = isFleetBased(biz.categoryId);
              const isContract = isContractBased(biz.categoryId);

              // For outlet-based, check missing requirements
              const missingCount = (!isFleet && !isContract) ? getMissingCount(biz) : 0;

              return (
                <button key={biz.id} onClick={() => navigate(getBusinessNavigation(biz))}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left
                    transition-all duration-200 active:scale-[0.98]
                    ${t.bg.card} border ${t.border.default} hover:border-yellow-500/30
                    ${stats.showWarning ? (isDark ? 'border-red-500/20' : 'border-red-200') : ''}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color} ${stats.showWarning ? 'opacity-60' : ''}`}>
                    <BizIcon className="w-5.5 h-5.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold truncate ${t.text.primary}`}>{biz.name}</p>
                      {isFleet && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-yellow-500/15 text-yellow-600 flex-shrink-0">
                          FLEET
                        </span>
                      )}
                      {isContract && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/15 text-amber-600 flex-shrink-0">
                          CONTRACT
                        </span>
                      )}
                      {!isFleet && !isContract && (biz.outlets || 1) > 1 && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-500/15 text-blue-500 flex-shrink-0">
                          {biz.outlets} outlets
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 ${t.text.tertiary}`}>
                      {biz.categoryName}{biz.subCategoryName ? ` • ${biz.subCategoryName}` : ''}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-medium ${t.text.secondary}`}>
                          {stats.label}
                        </span>
                        {missingCount > 0 && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[9px] font-bold">
                            <AlertTriangle className="w-2.5 h-2.5" />{missingCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-sm font-bold ${effectiveIncome === 0 ? 'text-red-400' : t.text.primary}`}>
                          {formatCurrency(effectiveIncome)}
                        </span>
                        <span className={`text-[10px] ${t.text.tertiary}`}>per hour</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${t.text.tertiary}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnedBusinessList;