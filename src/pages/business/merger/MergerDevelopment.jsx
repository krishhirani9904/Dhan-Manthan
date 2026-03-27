// src/pages/business/merger/MergerDevelopment.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, MonitorPlay, Lock, Check, Clock,
  TrendingUp, Zap
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import { getMergerPhases, getIncomeMultiplier } from '../../../data/mergerFlowData';
import { MERGER_BUSINESSES } from '../../../data/mergerBusinesses';
import { formatCurrency } from '../../../utils/formatCurrency';

function MergerDevelopment() {
  const { flowId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const isOnline = useNetworkStatus();
  const {
    activeMergerFlows, balance,
    investInMergerPhase, boostMergerPhase,
    completeMergerFlow, completeReconfigureFlow, startMergerAdBoost
  } = useGame();

  const flow = (activeMergerFlows || []).find(f => f.id === flowId);
  const merger = flow ? MERGER_BUSINESSES.find(m => m.id === flow.mergerId) : null;
  const [adWatching, setAdWatching] = useState(false);
  const [incomeAdWatching, setIncomeAdWatching] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!flow || !merger) {
    return (
      <div className={`h-screen flex flex-col items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Flow not found</p>
        <button onClick={() => navigate('/business')}
          className="mt-3 text-yellow-500 underline text-sm">Go back</button>
      </div>
    );
  }

  const phases = getMergerPhases(flow.mergerId, merger.investment);
  const flowPhases = flow.phases || [];
  const multiplier = getIncomeMultiplier(flow.configScore?.percentage || 50);
  const baseIncome = Math.floor(merger.incomePerHour * multiplier);
  const hasAdBoost = flow.mergerAdBoostEndTime && Date.now() < flow.mergerAdBoostEndTime;
  const currentIncome = hasAdBoost
    ? Math.floor(baseIncome * (1 + (flow.mergerAdBoostPercent || 15) / 100))
    : baseIncome;

  // Find current phase index
  const getCurrentPhaseIndex = () => {
    for (let i = 0; i < phases.length; i++) {
      const fp = flowPhases[i];
      if (!fp || fp.status === 'locked') return i;
      if (fp.status === 'active' && fp.endTime && Date.now() < fp.endTime) return i;
      if (fp.status === 'completed') continue;
      // Timer expired but not marked complete - still current
      if (fp.status === 'active' && fp.endTime && Date.now() >= fp.endTime) return i;
    }
    return phases.length;
  };

  const currentPhaseIdx = getCurrentPhaseIndex();
  const allCompleted = phases.every((_, idx) => {
    const fp = flowPhases[idx];
    return fp?.status === 'completed' || 
           (fp?.status === 'active' && fp?.endTime && Date.now() >= fp.endTime);
  });

  const getPhaseRemaining = (idx) => {
    const fp = flowPhases[idx];
    if (!fp || !fp.endTime) return 0;
    return Math.max(0, Math.floor((fp.endTime - Date.now()) / 1000));
  };

  const isPhaseActive = (idx) => {
    const fp = flowPhases[idx];
    return fp?.status === 'active' && fp?.endTime && Date.now() < fp.endTime;
  };

  const isPhaseCompleted = (idx) => {
    const fp = flowPhases[idx];
    if (fp?.status === 'completed') return true;
    // Timer expired = completed
    if (fp?.status === 'active' && fp?.endTime && Date.now() >= fp.endTime) return true;
    return false;
  };

  const canInvestInPhase = (idx) => {
    // Can invest if: previous phases done AND this phase not started
    if (idx > 0) {
      for (let i = 0; i < idx; i++) {
        if (!isPhaseCompleted(i)) return false;
      }
    }
    const fp = flowPhases[idx];
    return !fp || fp.status === 'locked' || !fp.status;
  };

  const handleInvest = (idx) => {
    const phase = phases[idx];
    if (!phase || balance < phase.investment) return;
    if (!canInvestInPhase(idx)) return;
    investInMergerPhase(flowId, idx, phase.investment, phase.duration);
  };

  const handleBoostPhase = (idx) => {
    if (!isOnline || adWatching) return;
    setAdWatching(true);
    setTimeout(() => {
      setAdWatching(false);
      boostMergerPhase(flowId, idx);
    }, 2000);
  };

  const handleIncomeAd = () => {
    if (!isOnline || incomeAdWatching || hasAdBoost) return;
    setIncomeAdWatching(true);
    setTimeout(() => {
      setIncomeAdWatching(false);
      startMergerAdBoost(flowId, 15, 4);
    }, 2000);
  };

  // ═══ FIXED: Launch Handler ═══
  const handleComplete = () => {
    if (!allCompleted || isLaunching) return;
    
    setIsLaunching(true);
    
    // Small delay for UX feedback
    setTimeout(() => {
      if (flow.isReconfigure && flow.parentMergedId) {
        // Reconfigure flow - adds income to parent
        completeReconfigureFlow(flowId);
      } else {
        // New merger - creates new entry
        completeMergerFlow(flowId);
      }
      
      // Navigate to business page
      navigate('/business');
    }, 500);
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/business')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <div>
          <h1 className={`text-lg font-bold ${t.text.primary}`}>{flow.name}</h1>
          <p className={`text-[10px] ${t.text.tertiary}`}>
            {merger.name} {flow.isReconfigure ? '(New Collection)' : ''}
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
        {/* ═══ Income Box ═══ */}
        <button onClick={handleIncomeAd}
          disabled={hasAdBoost || incomeAdWatching || !isOnline}
          className={`w-full rounded-xl p-4 text-center transition-all active:scale-[0.98]
            ${isDark ? 'bg-gradient-to-br from-purple-900/30 to-gray-900' : 'bg-gradient-to-br from-purple-50 to-white'}
            border ${t.border.default}
            ${(!hasAdBoost && !incomeAdWatching && isOnline) ? 'cursor-pointer' : 'cursor-default'}`}>
          <p className={`text-3xl font-black ${hasAdBoost ? 'text-green-500' : 'text-purple-500'}`}>
            {formatCurrency(currentIncome)}
          </p>
          <p className={`text-[10px] ${t.text.tertiary}`}>Income per hour (after launch)</p>
          {hasAdBoost ? (
            <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 rounded-full
              bg-green-500/15 text-green-500 text-[10px] font-bold">
              <TrendingUp className="w-3 h-3" /> +{flow.mergerAdBoostPercent}% boosted
            </span>
          ) : (
            <div className={`mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-lg
              ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
              ${(incomeAdWatching || !isOnline) ? 'opacity-50' : ''}`}>
              <MonitorPlay className="w-4 h-4 text-purple-500" />
              <span className={`text-xs font-medium ${t.text.secondary}`}>
                {!isOnline ? 'Offline' : incomeAdWatching ? 'Watching ad...' : 'Watch ad for +15% income (4h)'}
              </span>
            </div>
          )}
        </button>

        {/* ═══ Phases List ═══ */}
        {phases.map((phase, idx) => {
          const PhaseIcon = phase.icon;
          const completed = isPhaseCompleted(idx);
          const active = isPhaseActive(idx);
          const remaining = getPhaseRemaining(idx);
          const canInvest = canInvestInPhase(idx);
          const needsInvest = canInvest && balance >= phase.investment;
          const isLocked = idx > 0 && !isPhaseCompleted(idx - 1) && !canInvest;

          const hours = Math.floor(remaining / 3600);
          const mins = Math.floor((remaining % 3600) / 60);
          const secs = remaining % 60;

          // Completed Phase
          if (completed) {
            return (
              <div key={`phase-${idx}`}
                className={`rounded-xl p-3 flex items-center gap-3
                  ${isDark ? 'bg-green-500/5 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-500">
                  <Check className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-bold ${t.text.primary}`}>{phase.title}</p>
                  <p className="text-[10px] text-green-500">Completed</p>
                </div>
                <Check className="w-4 h-4 text-green-500" />
              </div>
            );
          }

          // Locked Phase
          if (isLocked) {
            return (
              <div key={`phase-${idx}`}
                className={`rounded-xl p-3 flex items-center gap-3 opacity-40
                  ${t.bg.card} border ${t.border.default}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                  ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <Lock className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-bold ${t.text.primary}`}>{phase.title}</p>
                  <p className={`text-[10px] ${t.text.tertiary}`}>Complete previous phase</p>
                </div>
              </div>
            );
          }

          // Active or Ready to Invest Phase
          return (
            <div key={`phase-${idx}`}
              className={`rounded-xl overflow-hidden border ${t.bg.card} ${t.border.default}`}>
              <div className="p-4">
                {/* Phase Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                    flex-shrink-0 ${phase.color}`}>
                    <PhaseIcon className="w-5.5 h-5.5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${t.text.primary}`}>{phase.title}</p>
                    <p className={`text-[10px] ${t.text.tertiary}`}>
                      Step {idx + 1} of {phases.length}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-[11px] leading-relaxed mb-4 ${t.text.secondary}`}>
                  {phase.description}
                </p>

                {/* State: Needs Investment */}
                {canInvest && (
                  <>
                    <p className={`text-xs font-bold mb-1 ${t.text.primary}`}>
                      Required Investment
                    </p>
                    <p className={`text-2xl font-black mb-4 ${t.text.brand}`}>
                      {formatCurrency(phase.investment)}
                    </p>
                    <button onClick={() => handleInvest(idx)}
                      disabled={!needsInvest}
                      className={`w-full py-3 rounded-xl text-sm font-bold transition-all
                        ${needsInvest
                          ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/20 active:scale-95'
                          : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                        }`}>
                      {needsInvest
                        ? `Invest ${formatCurrency(phase.investment)}`
                        : `Need ${formatCurrency(phase.investment - balance)} more`
                      }
                    </button>
                  </>
                )}

                {/* State: Timer Running */}
                {active && remaining > 0 && (
                  <>
                    <p className={`text-xs font-bold mb-1 ${t.text.primary}`}>
                      Remaining Time
                    </p>

                    {/* Timer */}
                    <div className="flex items-center justify-center gap-4 my-3">
                      {[
                        { val: hours, label: 'hours' },
                        { val: mins, label: 'min' },
                        { val: secs, label: 'sec' },
                      ].map(({ val, label }) => (
                        <div key={label} className="text-center">
                          <div className={`w-16 h-16 rounded-xl flex items-center justify-center
                            ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <p className={`text-2xl font-black ${t.text.primary}`}>
                              {String(val).padStart(2, '0')}
                            </p>
                          </div>
                          <p className={`text-[9px] uppercase mt-1 ${t.text.tertiary}`}>{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Watch Ad for Speed */}
                    <button onClick={() => handleBoostPhase(idx)}
                      disabled={adWatching || !isOnline}
                      className={`w-full flex items-center justify-center gap-2
                        py-3 rounded-xl text-sm font-bold transition-all
                        ${(adWatching || !isOnline) ? 'opacity-50' : ''}
                        ${isDark
                          ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                          : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                        } active:scale-95`}>
                      <Zap className="w-4 h-4" />
                      {!isOnline ? 'Offline' : adWatching ? 'Watching Ad...' : 'Watch Ad to Reduce Time'}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* ═══ Final Launch Button ═══ */}
        {allCompleted && (
          <button 
            onClick={handleComplete}
            disabled={isLaunching}
            className={`w-full py-4 rounded-xl text-base font-bold
              bg-gradient-to-r from-green-500 to-emerald-600 text-white
              shadow-lg shadow-green-500/25 active:scale-95 transition-all
              disabled:opacity-70
              ${!isLaunching ? 'animate-pulse' : ''}`}>
            {isLaunching ? (
              <span className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 animate-spin" />
                Launching...
              </span>
            ) : (
              `🚀 Launch ${flow.name}!`
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default MergerDevelopment;