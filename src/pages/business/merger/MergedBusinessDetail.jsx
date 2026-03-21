import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, TrendingUp, Zap, Calendar, Target,
  RefreshCw, Check, Star, Loader2, Clock, Rocket
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { MERGER_BUSINESSES } from '../../../data/mergerBusinesses';
import { MERGER_TRENDS, getIncomeMultiplier } from '../../../data/mergerFlowData';
import { formatCurrency } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

function MergedBusinessDetail() {
  const { mergedId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { mergedBusinesses, activeMergerFlows, reconfigureMerger } = useGame();

  const [isLaunching, setIsLaunching] = useState(false);
  const [activeFlowForThis, setActiveFlowForThis] = useState(null);

  const merged = (mergedBusinesses || []).find(m => m.id === mergedId);

  // Check if reconfiguration is in progress
  useEffect(() => {
    const flow = (activeMergerFlows || []).find(f => 
      f.parentMergedId === mergedId && f.isReconfigure
    );
    setActiveFlowForThis(flow);
  }, [activeMergerFlows, mergedId]);

  if (!merged) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <div className="text-center">
          <p className={`text-sm ${t.text.secondary}`}>Merged business not found</p>
          <button onClick={() => navigate('/business')} 
            className="mt-3 text-yellow-500 underline text-sm">Go back</button>
        </div>
      </div>
    );
  }

  const mergerDef = MERGER_BUSINESSES.find(m => m.id === merged.mergerId);
  const MergerIcon = mergerDef?.icon || TrendingUp;
  const color = mergerDef?.color || 'bg-purple-500';
  const configPercentage = merged.configScore?.percentage || 50;
  const multiplier = getIncomeMultiplier(configPercentage);
  const isProfitable = multiplier >= 1.0;

  // Find selected trend info
  const trends = MERGER_TRENDS[merged.mergerId] || [];
  const selectedTrend = trends.find(tr => tr.id === merged.selectedTrend);

  const handleReconfigure = () => {
    setIsLaunching(true);
    setTimeout(() => {
      const flowId = reconfigureMerger(mergedId);
      if (flowId) {
        navigate(`/business/merger/trends/${flowId}`);
      } else {
        setIsLaunching(false);
      }
    }, 300);
  };

  const handleContinueFlow = () => {
    if (activeFlowForThis) {
      // Continue from where left off
      if (!activeFlowForThis.selectedTrend) {
        navigate(`/business/merger/trends/${activeFlowForThis.id}`);
      } else if (!activeFlowForThis.configScore) {
        navigate(`/business/merger/analysts/${activeFlowForThis.id}/${activeFlowForThis.selectedTrend}`);
      } else if (!activeFlowForThis.configCompleted) {
        navigate(`/business/merger/configurator/${activeFlowForThis.id}`);
      } else {
        navigate(`/business/merger/development/${activeFlowForThis.id}`);
      }
    }
  };

  const completedDate = merged.completedAt
    ? new Date(merged.completedAt).toLocaleDateString('en-IN', { 
        day: 'numeric', month: 'short', year: 'numeric' 
      })
    : 'Unknown';

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
        <div>
          <h1 className={`text-lg font-bold ${t.text.primary}`}>{merged.name}</h1>
          <p className={`text-[10px] ${t.text.tertiary}`}>{mergerDef?.name || 'Business Merger'}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-4 space-y-3">

        {/* Hero Card */}
        <div className={`rounded-2xl overflow-hidden 
          ${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
                   : 'bg-gradient-to-br from-white to-gray-50'}
          border ${t.border.default}`}>
          <div className={`h-24 relative overflow-hidden ${color}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MergerIcon className="w-12 h-12 text-white/90" />
            </div>
            {/* Active Collection Badge */}
            {activeFlowForThis && (
              <div className="absolute top-2 right-2 px-2 py-1 rounded-full 
                bg-black/30 backdrop-blur-sm flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-[9px] text-white font-bold">NEW IN PROGRESS</span>
              </div>
            )}
          </div>
          <div className="p-4 -mt-6 relative z-10">
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold
              ${isProfitable ? 'bg-green-500/15 text-green-500' : 'bg-red-500/15 text-red-400'}`}>
              {isProfitable ? <TrendingUp className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              {isProfitable ? 'Profitable' : 'Below Target'}
            </div>
          </div>
        </div>

        {/* Income Card */}
        <div className={`rounded-xl p-4 text-center ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-[10px] ${t.text.tertiary}`}>Current Income Per Hour</p>
          <p className={`text-4xl font-black ${isProfitable ? 'text-green-500' : 'text-red-400'}`}>
            {formatCurrency(merged.incomePerHour)}
          </p>
          <p className={`text-xs mt-1 ${t.text.secondary}`}>
            Base: {formatCurrency(mergerDef?.incomePerHour || 0)} × {multiplier}x multiplier
          </p>
        </div>

        {/* Config Score */}
        <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center gap-2 mb-3">
            <Target className={`w-4 h-4 ${t.text.brand}`} />
            <span className={`text-sm font-bold ${t.text.primary}`}>Configuration Score</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className={`w-full h-3 rounded-full overflow-hidden 
                ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div className={`h-full rounded-full transition-all
                  ${configPercentage >= 80 ? 'bg-green-500' : 
                    configPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${configPercentage}%` }} />
              </div>
            </div>
            <span className={`text-lg font-black ${t.text.primary}`}>{configPercentage}%</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-[10px] ${t.text.tertiary}`}>
              Score: {merged.configScore?.totalScore || 0}/{merged.configScore?.maxScore || 400}
            </span>
            <span className={`text-[10px] font-bold ${isProfitable ? 'text-green-500' : 'text-red-400'}`}>
              {multiplier}x income multiplier
            </span>
          </div>
        </div>

        {/* Trend Info */}
        {selectedTrend && (
          <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
            <div className="flex items-center gap-2 mb-2">
              <Star className={`w-4 h-4 ${t.text.brand}`} />
              <span className={`text-sm font-bold ${t.text.primary}`}>Selected Trend</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedTrend.emoji}</span>
              <div>
                <p className={`text-sm font-bold ${t.text.primary}`}>{selectedTrend.title}</p>
                <p className={`text-[10px] ${t.text.tertiary} line-clamp-2`}>{selectedTrend.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Details */}
        <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className={`w-4 h-4 ${t.text.tertiary}`} />
            <span className={`text-sm font-bold ${t.text.primary}`}>Details</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-xs ${t.text.secondary}`}>Completed</span>
              <span className={`text-xs font-bold ${t.text.primary}`}>{completedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-xs ${t.text.secondary}`}>Merger Type</span>
              <span className={`text-xs font-bold ${t.text.primary}`}>{mergerDef?.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-xs ${t.text.secondary}`}>Base Income</span>
              <span className={`text-xs font-bold ${t.text.primary}`}>
                {formatCurrency(mergerDef?.incomePerHour || 0)}/hr
              </span>
            </div>
          </div>
        </div>

        {/* ═══ LAUNCH NEW COLLECTION OR CONTINUE ═══ */}
        {activeFlowForThis ? (
          // Show Continue Button if reconfiguration in progress
          <div className={`rounded-xl p-4 border-2 
            ${isDark ? 'border-yellow-500/30 bg-yellow-500/5' 
                     : 'border-yellow-300 bg-yellow-50'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-500/15">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
              </div>
              <div>
                <p className={`text-sm font-bold ${t.text.primary}`}>New Collection In Progress</p>
                <p className={`text-[10px] ${t.text.tertiary}`}>
                  Continue configuring your new collection
                </p>
              </div>
            </div>
            <button onClick={handleContinueFlow}
              className="w-full py-3.5 rounded-xl text-sm font-bold
                bg-gradient-to-r from-yellow-500 to-orange-500 text-white
                shadow-lg shadow-yellow-500/20 active:scale-95 transition-all">
              Continue Configuration →
            </button>
          </div>
        ) : (
          // Show Launch Button if no active reconfiguration
          <div className={`rounded-xl p-4 border-2 
            ${isDark ? 'border-purple-500/30 bg-purple-500/5' 
                     : 'border-purple-200 bg-purple-50'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/15">
                <Rocket className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className={`text-sm font-bold ${t.text.primary}`}>Launch New Collection</p>
                <p className={`text-[10px] ${t.text.tertiary}`}>
                  Create another collection with new strategy
                </p>
              </div>
            </div>
            <p className={`text-[11px] mb-3 ${t.text.secondary}`}>
              {!isProfitable
                ? '⚠ Your current collection is below target. Launch new to improve income!'
                : '✨ Your collection is profitable! Launch another to multiply earnings.'
              }
            </p>
            <button 
              onClick={handleReconfigure}
              disabled={isLaunching}
              className="w-full py-3.5 rounded-xl text-sm font-bold
                bg-gradient-to-r from-purple-500 to-violet-600 text-white
                shadow-lg shadow-purple-500/20 active:scale-95 transition-all
                disabled:opacity-70 disabled:cursor-not-allowed
                flex items-center justify-center gap-2">
              {isLaunching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Launching...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>Launch New Collection</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Info Notice */}
        <div className={`rounded-xl p-3 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <p className={`text-[10px] ${t.text.tertiary} leading-relaxed`}>
            💡 <span className="font-bold">Pro Tip:</span> You can have multiple collections 
            of the same merger type earning simultaneously. Each collection earns independently 
            based on its configuration score!
          </p>
        </div>
      </div>

      <AdSpace />
    </div>
  );
}

export default MergedBusinessDetail;