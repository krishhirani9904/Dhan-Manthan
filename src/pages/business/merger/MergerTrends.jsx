// src/pages/business/merger/MergerTrends.jsx
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { MERGER_TRENDS } from '../../../data/mergerFlowData';
import { formatCurrency } from '../../../utils/formatCurrency';

function MergerTrends() {
  const { flowId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { activeMergerFlows } = useGame();

  const flow = (activeMergerFlows || []).find(f => f.id === flowId);

  if (!flow) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Flow not found</p>
        <button onClick={() => navigate('/business/mergers')}
          className="mt-3 text-yellow-500 underline text-sm">Go back</button>
      </div>
    );
  }

  const trends = MERGER_TRENDS[flow.mergerId] || MERGER_TRENDS.fashion_brand;

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate(`/business/merger/name/${flow.mergerId}`)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-4 space-y-4">
        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center px-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3
            ${isDark ? 'bg-purple-500/15' : 'bg-purple-50'}`}>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className={`text-xl font-bold mb-2 ${t.text.primary}`}>
            Current Trends
          </h1>
          <p className={`text-xs leading-relaxed ${t.text.secondary}`}>
            Stay informed about current trends and make strategic decisions
            based on market insights for your {flow.name}.
          </p>
        </div>

        {/* Trend Cards */}
        {trends.map((trend) => (
          <button key={trend.id}
            onClick={() => navigate(`/business/merger/analysts/${flowId}/${trend.id}`)}
            className={`w-full rounded-2xl overflow-hidden text-left
              transition-all active:scale-[0.98] border
              ${isDark
                ? 'bg-gray-900 border-gray-800 hover:border-purple-500/30'
                : 'bg-white border-gray-200 hover:border-purple-300'
              }`}>

            {/* Gradient Banner */}
            <div className={`h-20 relative overflow-hidden
              ${isDark ? 'bg-gradient-to-br from-purple-900/50 to-gray-900'
                : 'bg-gradient-to-br from-purple-100 to-blue-50'}`}>
              <span className="absolute right-4 top-3 text-4xl opacity-30">
                {trend.emoji}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className={`text-base font-bold mb-1.5 ${t.text.primary}`}>
                {trend.title}
              </h3>
              <p className={`text-[11px] leading-relaxed mb-3 ${t.text.secondary} line-clamp-3`}>
                {trend.description}
              </p>

              {/* Min/Max Investment */}
              <div className="flex gap-2">
                <div className={`flex-1 rounded-xl p-2.5
                  ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <p className={`text-[9px] font-medium ${t.text.tertiary}`}>
                    Min. Investment
                  </p>
                  <p className={`text-sm font-bold ${t.text.brand}`}>
                    {formatCurrency(trend.minInvestment)}
                  </p>
                </div>
                <div className={`flex-1 rounded-xl p-2.5
                  ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <p className={`text-[9px] font-medium ${t.text.tertiary}`}>
                    Max. Investment
                  </p>
                  <p className={`text-sm font-bold ${t.text.brand}`}>
                    {formatCurrency(trend.maxInvestment)}
                  </p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MergerTrends;