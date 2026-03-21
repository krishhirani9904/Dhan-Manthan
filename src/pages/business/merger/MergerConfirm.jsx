// src/pages/business/merger/MergerConfirm.jsx
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Building2, TrendingUp, Check } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { MERGER_BUSINESSES, getMergerStatus } from '../../../data/mergerBusinesses';
import { getCategoryById } from '../../../data/businessCategories';
import { getTotalOutletsForCategory } from '../../../context/helpers/incomeCalculator';
import { formatCurrency } from '../../../utils/formatCurrency';

function MergerConfirm() {
  const { mergerId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const gameState = useGame();
  const { ownedBusinesses, mergedBusinesses, activeMergerFlows, balance } = gameState;

  const merger = MERGER_BUSINESSES.find(m => m.id === mergerId);

  if (!merger) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <div className="text-center">
          <p className={`text-sm ${t.text.secondary}`}>Merger not found</p>
          <button onClick={() => navigate('/business/mergers')}
            className="mt-3 text-yellow-500 underline text-sm">Go back</button>
        </div>
      </div>
    );
  }

  const MergerIcon = merger.icon;
  const status = getMergerStatus(merger, ownedBusinesses, mergedBusinesses, activeMergerFlows, gameState);
  const canAfford = balance >= merger.investment;
  const canProceed = status.allRequirementsMet && canAfford;

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/business/mergers')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>
          Confirm Business to Merge
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">

        {/* ═══ GROUPED CATEGORY DISPLAY ═══ */}
        {merger.requirements.map((req, idx) => {
          if (req.type === 'categories') {
            const uniqueCategories = new Set(ownedBusinesses.map(b => b.categoryId));
            return (
              <div key={idx} className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                    flex-shrink-0 ${isDark ? 'bg-amber-500/15' : 'bg-amber-50'}`}>
                    <Building2 className="w-5.5 h-5.5 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${t.text.primary}`}>{req.label}</p>
                    <p className={`text-[10px] ${t.text.tertiary}`}>
                      {uniqueCategories.size} of {req.count} categories owned
                    </p>
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                    ${uniqueCategories.size >= req.count
                      ? 'bg-green-500/15'
                      : isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {uniqueCategories.size >= req.count
                      ? <Check className="w-4 h-4 text-green-500" />
                      : <span className={`text-xs font-bold ${t.text.tertiary}`}>
                          {uniqueCategories.size}/{req.count}
                        </span>
                    }
                  </div>
                </div>
              </div>
            );
          }

          // Grouped category card — ONE card per requirement
          const cat = getCategoryById(req.categoryId);
          const CatIcon = cat?.icon || Building2;
          const totalOutlets = getTotalOutletsForCategory(
            ownedBusinesses, req.categoryId, req.subCategoryId
          );
          const matchingBusinesses = ownedBusinesses.filter(b => {
            if (b.categoryId !== req.categoryId) return false;
            if (req.subCategoryId && b.subCategoryId !== req.subCategoryId) return false;
            return true;
          });
          const combinedIncome = matchingBusinesses.reduce((sum, b) => sum + (b.incomePerHour || 0), 0);
          const isMet = totalOutlets >= req.count;

          return (
            <div key={idx}
              className={`rounded-xl p-3.5 ${t.bg.card} border
                ${isMet
                  ? isDark ? 'border-green-500/20' : 'border-green-200'
                  : t.border.default}`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                  flex-shrink-0 ${cat?.color || 'bg-gray-500'}`}>
                  <CatIcon className="w-5.5 h-5.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${t.text.primary}`}>{req.label}</p>
                  <p className={`text-[10px] ${t.text.tertiary}`}>
                    {totalOutlets} of {req.count} available
                    {matchingBusinesses.length > 0 && ` (${matchingBusinesses.length} businesses, ${totalOutlets} outlets)`}
                  </p>
                  {combinedIncome > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <p className="text-[10px] font-bold text-green-500">
                        Combined: {formatCurrency(combinedIncome)}/hr
                      </p>
                    </div>
                  )}
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                  ${isMet ? 'bg-green-500/15' : isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  {isMet
                    ? <Check className="w-4 h-4 text-green-500" />
                    : <span className={`text-xs font-bold ${t.text.tertiary}`}>
                        {totalOutlets}/{req.count}
                      </span>
                  }
                </div>
              </div>
            </div>
          );
        })}

        {/* Warning Box */}
        <div className={`rounded-xl p-4 border-2
          ${isDark ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold mb-1 text-yellow-500">Important Notice</p>
              <p className={`text-[11px] leading-relaxed ${t.text.secondary}`}>
                When you merge, the required outlets will be consumed from your businesses.
                If a business has more outlets than needed, only the required number will be consumed
                and the rest will remain. You will manage the new merged business separately.
              </p>
            </div>
          </div>
        </div>

        {/* Investment Summary */}
        <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex justify-between mb-2">
            <span className={`text-xs ${t.text.secondary}`}>Investment Required</span>
            <span className={`text-sm font-black ${canAfford ? t.text.brand : 'text-red-400'}`}>
              {formatCurrency(merger.investment)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`text-xs ${t.text.secondary}`}>Expected Income</span>
            <span className="text-sm font-black text-green-500">
              +{formatCurrency(merger.incomePerHour)}/hr
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className={`flex-shrink-0 px-3 py-3 border-t ${t.border.default} ${t.bg.secondary}`}>
        <button
          onClick={() => canProceed ? navigate(`/business/merger/name/${mergerId}`) : null}
          disabled={!canProceed}
          className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all
            ${canProceed
              ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/20 active:scale-95'
              : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
            }`}>
          {canProceed ? 'Continue' : !status.allRequirementsMet ? 'Requirements Not Met' : 'Insufficient Balance'}
        </button>
      </div>
    </div>
  );
}

export default MergerConfirm;