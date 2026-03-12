// src/pages/business/BusinessMergers.jsx
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, GitMerge, Check, TrendingUp,
  Building2, Clock
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { MERGER_BUSINESSES, getMergerStatus, getRequirementIcon } from '../../data/mergerBusinesses';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';

function BusinessMergers() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedBusinesses, mergedBusinesses, activeMergerFlows, balance } = useGame();

  // Separate active, in-progress, and available
  const activeMergers = MERGER_BUSINESSES.filter(m =>
    (mergedBusinesses || []).some(mb => mb.mergerId === m.id)
  );

  const inProgressMergers = MERGER_BUSINESSES.filter(m =>
    (activeMergerFlows || []).some(f => f.mergerId === m.id)
  );

  const availableMergers = MERGER_BUSINESSES.filter(m =>
    !(mergedBusinesses || []).some(mb => mb.mergerId === m.id) &&
    !(activeMergerFlows || []).some(f => f.mergerId === m.id)
  );

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/business')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center
            ${isDark ? 'bg-purple-500/15' : 'bg-purple-50'}`}>
            <GitMerge className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${t.text.primary}`}>Business Mergers</h1>
            <p className={`text-[10px] ${t.text.tertiary}`}>
              {activeMergers.length} active • {inProgressMergers.length} in progress • {availableMergers.length} available
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
        {/* Balance */}
        <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-[10px] ${t.text.tertiary}`}>Available Balance</p>
          <p className={`text-xl font-black ${t.text.brand}`}>{formatCurrency(balance)}</p>
        </div>

        {/* Active Mergers */}
        {activeMergers.length > 0 && (
          <div>
            <p className={`text-xs font-bold mb-2 text-green-500`}>
              ✅ Active Mergers ({activeMergers.length})
            </p>
            {activeMergers.map(merger => {
              const MergerIcon = merger.icon;
              const activeMerged = (mergedBusinesses || []).find(m => m.mergerId === merger.id);
              return (
                <div key={merger.id}
                  className={`rounded-xl p-4 mb-2
                    ${isDark ? 'bg-green-500/5 border border-green-500/20'
                      : 'bg-green-50 border border-green-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${merger.color}`}>
                      <MergerIcon className="w-5.5 h-5.5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${t.text.primary}`}>
                        {activeMerged?.name || merger.name}
                      </p>
                      <p className={`text-[10px] ${t.text.tertiary}`}>{merger.description}</p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/15">
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-[9px] font-bold text-green-500">ACTIVE</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg
                    ${isDark ? 'bg-green-500/10' : 'bg-green-100'}`}>
                    <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-xs font-bold text-green-500">
                      +{formatCurrency(activeMerged?.incomePerHour || merger.incomePerHour)}/hr
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* In-Progress Mergers */}
        {inProgressMergers.length > 0 && (
          <div>
            <p className={`text-xs font-bold mb-2 text-orange-500`}>
              🔄 In Progress ({inProgressMergers.length})
            </p>
            {inProgressMergers.map(merger => {
              const MergerIcon = merger.icon;
              const flow = (activeMergerFlows || []).find(f => f.mergerId === merger.id);
              const phasesComplete = (flow?.phases || []).filter(p => p.status === 'completed').length;

              return (
                <button key={merger.id}
                  onClick={() => flow ? navigate(`/business/merger/development/${flow.id}`) : null}
                  className={`w-full rounded-xl p-4 mb-2 text-left transition-all active:scale-[0.98]
                    ${isDark ? 'bg-orange-500/5 border border-orange-500/20'
                      : 'bg-orange-50 border border-orange-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${merger.color}`}>
                      <MergerIcon className="w-5.5 h-5.5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${t.text.primary}`}>
                        {flow?.name || merger.name}
                      </p>
                      <p className={`text-[10px] ${t.text.tertiary}`}>
                        Phase {phasesComplete}/4 completed
                      </p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/15">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span className="text-[9px] font-bold text-orange-500">IN PROGRESS</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className={`w-full h-1.5 rounded-full overflow-hidden
                    ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <div className="h-full rounded-full bg-orange-500 transition-all"
                      style={{ width: `${(phasesComplete / 4) * 100}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Available Mergers */}
        <div>
          <p className={`text-xs font-bold mb-2 ${t.text.secondary}`}>
            Available Mergers ({availableMergers.length})
          </p>

          {availableMergers.map(merger => {
            const MergerIcon = merger.icon;
            const status = getMergerStatus(merger, ownedBusinesses, mergedBusinesses);
            const canAfford = balance >= merger.investment;
            const canStart = status.allRequirementsMet && canAfford;

            return (
              <div key={merger.id}
                className={`rounded-xl mb-3 overflow-hidden
                  ${t.bg.card} border ${t.border.default}`}>

                {/* Merger Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                      flex-shrink-0 ${merger.color} shadow-lg`}>
                      <MergerIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-base font-bold ${t.text.primary}`}>{merger.name}</p>
                      <p className={`text-[10px] mt-0.5 ${t.text.tertiary} line-clamp-2`}>
                        {merger.description}
                      </p>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-2">
                    <p className={`text-[10px] font-semibold uppercase tracking-wider ${t.text.tertiary}`}>
                      Requirements ({status.metCount}/{status.totalRequirements})
                    </p>

                    {status.requirementStatuses.map((req, idx) => {
                      const catInfo = req.type !== 'categories' ? getRequirementIcon(req) : null;
                      const CatIcon = catInfo?.icon || Building2;
                      const catColor = catInfo?.color || 'bg-gray-500';
                      const progress = Math.min((req.current / req.count) * 100, 100);

                      return (
                        <div key={idx} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                          ${req.met
                            ? isDark ? 'bg-green-500/8' : 'bg-green-50'
                            : isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                          }`}>
                          {/* Checkbox */}
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center
                            flex-shrink-0 border-2 transition-colors
                            ${req.met
                              ? 'bg-green-500 border-green-500'
                              : isDark ? 'border-gray-600' : 'border-gray-300'
                            }`}>
                            {req.met && <Check className="w-3 h-3 text-white" />}
                          </div>

                          {/* Icon */}
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center
                            flex-shrink-0 ${req.type === 'categories'
                              ? isDark ? 'bg-amber-500/15' : 'bg-amber-50'
                              : catColor} ${req.type === 'categories' ? '' : 'bg-opacity-100'}`}>
                            {req.type === 'categories'
                              ? <Building2 className="w-3.5 h-3.5 text-amber-500" />
                              : <CatIcon className="w-3.5 h-3.5 text-white" />
                            }
                          </div>

                          {/* Info + Progress */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-[11px] font-medium truncate
                                ${req.met ? 'text-green-500' : t.text.primary}`}>
                                {req.label || `${req.count}× ${req.categoryId}`}
                              </span>
                              <span className={`text-[10px] font-bold flex-shrink-0 ml-2
                                ${req.met ? 'text-green-500' : t.text.secondary}`}>
                                {req.current}/{req.count}
                              </span>
                            </div>
                            <div className={`w-full h-1.5 rounded-full overflow-hidden
                              ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              <div className={`h-full rounded-full transition-all duration-500
                                ${req.met ? 'bg-green-500' : 'bg-yellow-500'}`}
                                style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Investment + Profit */}
                <div className={`px-4 py-3 border-t ${t.border.default}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className={`text-[10px] ${t.text.tertiary}`}>Investment Required</p>
                      <p className={`text-lg font-black ${canAfford ? t.text.brand : 'text-red-400'}`}>
                        {formatCurrency(merger.investment)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] ${t.text.tertiary}`}>Potential Profit</p>
                      <p className="text-lg font-black text-green-500">
                        +{formatCurrency(merger.incomePerHour)}
                        <span className={`text-xs font-normal ${t.text.tertiary}`}>/hr</span>
                      </p>
                    </div>
                  </div>

                  {!canAfford && status.allRequirementsMet && (
                    <p className="text-[10px] text-red-400 mb-2">
                      Need {formatCurrency(merger.investment - balance)} more to invest
                    </p>
                  )}

                  <button
                    onClick={() => canStart
                      ? navigate(`/business/merger/confirm/${merger.id}`)
                      : null
                    }
                    disabled={!canStart}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all
                      ${canStart
                        ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/20 active:scale-95'
                        : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                      }`}>
                    {canStart
                      ? '🚀 Start Merger'
                      : !status.allRequirementsMet
                        ? `${status.metCount}/${status.totalRequirements} Requirements Met`
                        : `Need ${formatCurrency(merger.investment - balance)}`
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {availableMergers.length === 0 && activeMergers.length === 0 && inProgressMergers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <GitMerge className={`w-12 h-12 mb-3 ${t.text.tertiary}`} />
            <p className={`text-sm font-medium ${t.text.secondary}`}>No mergers available</p>
          </div>
        )}
      </div>

      <AdSpace />
    </div>
  );
}

export default BusinessMergers;