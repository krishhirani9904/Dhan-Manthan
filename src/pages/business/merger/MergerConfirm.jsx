// src/pages/business/merger/MergerConfirm.jsx
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Building2, TrendingUp, Check } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { MERGER_BUSINESSES, getMergerStatus } from '../../../data/mergerBusinesses';
import { getCategoryById } from '../../../data/businessCategories';
import { formatCurrency } from '../../../utils/formatCurrency';

function MergerConfirm() {
  const { mergerId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedBusinesses, mergedBusinesses, balance } = useGame();

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
  const status = getMergerStatus(merger, ownedBusinesses, mergedBusinesses);
  const canAfford = balance >= merger.investment;
  const canProceed = status.allRequirementsMet && canAfford;

  // Get matching businesses for each requirement
  const getMatchingBusinesses = (req) => {
    if (req.type === 'categories') {
      const categories = new Map();
      ownedBusinesses.forEach(b => {
        if (!categories.has(b.categoryId)) {
          categories.set(b.categoryId, b);
        }
      });
      return Array.from(categories.values()).slice(0, req.count);
    }
    return ownedBusinesses.filter(b => {
      if (b.categoryId !== req.categoryId) return false;
      if (req.subCategoryId && b.subCategoryId !== req.subCategoryId) return false;
      return true;
    }).slice(0, req.count);
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/business/mergers')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>
          Confirm Business to Merge
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
        {/* Businesses to merge */}
        {merger.requirements.map((req, idx) => {
          const matches = getMatchingBusinesses(req);
          const reqStatus = status.requirementStatuses[idx];

          return (
            <div key={idx} className="space-y-2">
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${t.text.tertiary}`}>
                {req.label || `${req.count}× Businesses`}
              </p>
              {matches.map(biz => {
                const cat = getCategoryById(biz.categoryId);
                const CatIcon = cat?.icon || Building2;
                return (
                  <div key={biz.id}
                    className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                        flex-shrink-0 ${cat?.color || 'bg-gray-500'}`}>
                        <CatIcon className="w-5.5 h-5.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${t.text.primary}`}>
                          {biz.name}
                        </p>
                        <p className={`text-[10px] ${t.text.tertiary}`}>
                          {biz.categoryName}
                          {biz.subCategoryName ? ` • ${biz.subCategoryName}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/15">
                        <Check className="w-3 h-3 text-green-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2.5 pl-14">
                      <div>
                        <p className={`text-[10px] ${t.text.tertiary}`}>
                          {reqStatus?.current || 0} of {req.count}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <p className={`text-xs font-bold text-green-500`}>
                          {formatCurrency(biz.incomePerHour)}
                        </p>
                        <p className={`text-[10px] ${t.text.tertiary}`}>per hour</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {matches.length === 0 && (
                <div className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}
                  border-dashed opacity-50`}>
                  <p className={`text-xs ${t.text.tertiary} text-center`}>
                    No matching businesses found
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Warning Box */}
        <div className={`rounded-xl p-4 border-2
          ${isDark ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`text-xs font-bold mb-1 text-yellow-500`}>Important Notice</p>
              <p className={`text-[11px] leading-relaxed ${t.text.secondary}`}>
                When you merge your businesses, the selected companies will be transformed into
                one new company. Thus, you will no longer be able to access them individually.
                Instead, you will be able to manage the business created by the merger.
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