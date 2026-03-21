// src/pages/business/BusinessMergers.jsx
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, GitMerge, Check, Building2, X, Briefcase
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
  const gameState = useGame();
  const { ownedBusinesses, mergedBusinesses, activeMergerFlows, balance, portfolioValue } = gameState;

  // FIX: Show ALL merger types — no filtering. Multiple same-type allowed.
  const availableMergers = MERGER_BUSINESSES;

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/business')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-blue-500/15' : 'bg-blue-50'}`}>
            <GitMerge className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h1 className={`text-lg font-bold ${t.text.primary}`}>Business Mergers</h1>
            <p className={`text-[10px] ${t.text.tertiary}`}>{availableMergers.length} types</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
        <div className="flex gap-2">
          <div className={`flex-1 rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <p className={`text-[10px] ${t.text.tertiary}`}>Cash Balance</p>
            <p className={`text-lg font-black ${t.text.brand}`}>{formatCurrency(balance)}</p>
          </div>
          <div className={`flex-1 rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <div className="flex items-center gap-1 mb-0.5">
              <Briefcase className={`w-3 h-3 ${t.text.tertiary}`} />
              <p className={`text-[10px] ${t.text.tertiary}`}>Portfolio</p>
            </div>
            <p className={`text-lg font-black ${t.text.primary}`}>{formatCurrency(portfolioValue || balance)}</p>
          </div>
        </div>

        <div className="space-y-3">
          {availableMergers.map(merger => {
            const MergerIcon = merger.icon;
            const status = getMergerStatus(merger, ownedBusinesses, mergedBusinesses, activeMergerFlows, gameState);
            const canAfford = balance >= merger.investment;
            const investmentMet = (portfolioValue || balance) >= merger.investment;
            const canStart = status.allRequirementsMet && canAfford;

            const completedCount = (mergedBusinesses || []).filter(m => m.mergerId === merger.id).length;
            const inProgressCount = (activeMergerFlows || []).filter(f => f.mergerId === merger.id).length;

            return (
              <div key={merger.id}
                className={`rounded-xl overflow-hidden ${t.bg.card} border ${t.border.default}`}>
                <div className="p-4 pb-3">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${merger.color} shadow-lg`}>
                      <MergerIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-base font-bold ${t.text.primary}`}>{merger.name}</p>
                        {completedCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-500/15 text-green-500">
                            ×{completedCount} done
                          </span>
                        )}
                        {inProgressCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-orange-500/15 text-orange-500">
                            {inProgressCount} in progress
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] mt-0.5 ${t.text.tertiary} line-clamp-2`}>
                        {merger.description}
                      </p>
                    </div>
                  </div>

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
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                            ${req.type === 'categories'
                              ? isDark ? 'bg-amber-500/15' : 'bg-amber-50'
                              : catColor}`}>
                            {req.type === 'categories'
                              ? <Building2 className="w-3.5 h-3.5 text-amber-500" />
                              : <CatIcon className="w-3.5 h-3.5 text-white" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-[11px] font-medium truncate
                                ${req.met ? 'text-green-500' : t.text.primary}`}>
                                {req.label}
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
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border-2
                            ${req.met ? 'bg-green-500 border-green-500' : isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                            {req.met && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={`px-4 py-3 border-t ${t.border.default}`}>
                  <div className={`flex items-center justify-between p-3 rounded-xl mb-2
                    ${investmentMet
                      ? isDark ? 'bg-green-500/8' : 'bg-green-50'
                      : isDark ? 'bg-red-500/8' : 'bg-red-50'
                    }`}>
                    <div>
                      <p className={`text-[10px] ${t.text.tertiary}`}>Investment Required</p>
                      <p className={`text-lg font-black ${canAfford ? t.text.brand : investmentMet ? 'text-yellow-500' : 'text-red-400'}`}>
                        {formatCurrency(merger.investment)}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2
                      ${investmentMet ? 'bg-green-500 border-green-500' : isDark ? 'border-red-500/50' : 'border-red-300'}`}>
                      {investmentMet
                        ? <Check className="w-3 h-3 text-white" />
                        : <X className="w-3 h-3 text-red-400" />}
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl mb-3 text-center ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <p className={`text-[10px] ${t.text.tertiary}`}>Potential Profit</p>
                    <p className="text-lg font-black text-green-500">
                      +{formatCurrency(merger.incomePerHour)}
                      <span className={`text-xs font-normal ${t.text.tertiary}`}>/hr</span>
                    </p>
                  </div>

                  <button
                    onClick={() => canStart ? navigate(`/business/merger/confirm/${merger.id}`) : null}
                    disabled={!canStart}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all
                      ${canStart
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95'
                        : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                      }`}>
                    {canStart
                      ? '🚀 Start Merger'
                      : !status.allRequirementsMet
                        ? `${status.metCount}/${status.totalRequirements} Requirements Met`
                        : `Need ${formatCurrency(merger.investment - balance)} cash`
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AdSpace />
    </div>
  );
}

export default BusinessMergers;