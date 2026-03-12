// src/pages/business/merger/MergerAnalysts.jsx
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { MERGER_TRENDS, getMergerAnalysts } from '../../../data/mergerFlowData';
import { MERGER_BUSINESSES } from '../../../data/mergerBusinesses';

function MergerAnalysts() {
  const { flowId, trendId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { activeMergerFlows, selectMergerTrend } = useGame();

  const flow = (activeMergerFlows || []).find(f => f.id === flowId);
  const merger = flow ? MERGER_BUSINESSES.find(m => m.id === flow.mergerId) : null;

  if (!flow || !merger) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Flow not found</p>
        <button onClick={() => navigate('/business/mergers')}
          className="mt-3 text-yellow-500 underline text-sm">Go back</button>
      </div>
    );
  }

  const trends = MERGER_TRENDS[flow.mergerId] || [];
  const selectedTrend = trends.find(tr => tr.id === trendId);
  const analysts = getMergerAnalysts(flow.mergerId, trendId);
  const MergerIcon = merger.icon;

  const handleSetup = () => {
    selectMergerTrend(flowId, trendId);
    navigate(`/business/merger/configurator/${flowId}`);
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate(`/business/merger/trends/${flowId}`)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-4 space-y-4">
        {/* Top — Icon + Trend Info */}
        <div className="flex flex-col items-center text-center px-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3
            ${merger.color}`}>
            <MergerIcon className="w-7 h-7 text-white" />
          </div>
          <h2 className={`text-lg font-bold ${t.text.primary}`}>
            {selectedTrend?.title || 'Market Analysis'}
          </h2>
          <p className={`text-[11px] mt-1.5 leading-relaxed ${t.text.secondary}`}>
            {selectedTrend?.details || selectedTrend?.description || ''}
          </p>
        </div>

        {/* Analysts' Data */}
        <div>
          <p className={`text-sm font-bold mb-2.5 ${t.text.primary}`}>
            Analysts' Data
          </p>

          <div className="space-y-2.5">
            {analysts.map((analyst) => (
              <div key={analyst.id}
                className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center
                    text-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {analyst.emoji}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${t.text.primary}`}>
                      {analyst.name}
                    </p>
                    <p className={`text-[10px] ${t.text.tertiary}`}>
                      {analyst.role}
                    </p>
                  </div>
                </div>
                <p className={`text-[11px] leading-relaxed ${t.text.secondary}
                  italic pl-1 border-l-2 border-yellow-500/30 ml-1`}>
                  "{analyst.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Launch Section */}
        <div className="pt-2">
          <h3 className={`text-sm font-bold mb-1 ${t.text.primary}`}>
            Launch Collection
          </h3>
          <p className={`text-[11px] mb-4 ${t.text.secondary}`}>
            Create a winning strategy right now!
          </p>
          <button onClick={handleSetup}
            className="w-full py-3.5 rounded-xl text-sm font-bold
              bg-gradient-to-r from-purple-500 to-violet-600 text-white
              shadow-lg shadow-purple-500/20 active:scale-95 transition-all">
            Set Up Collection
          </button>
        </div>
      </div>
    </div>
  );
}

export default MergerAnalysts;