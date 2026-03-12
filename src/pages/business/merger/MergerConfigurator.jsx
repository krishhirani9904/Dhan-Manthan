import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Check, X, MonitorPlay, Lock, Zap
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { getConfiguratorOptions, calculateConfigScore } from '../../../data/mergerFlowData';

function MergerConfigurator() {
  const { flowId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const {
    activeMergerFlows, saveMergerConfig, boostConfigTimer
  } = useGame();

  const flow = (activeMergerFlows || []).find(f => f.id === flowId);

  const [config, setConfig] = useState({
    style: null, quality: null, audience: null, price: null,
  });
  const [adAutoSelect, setAdAutoSelect] = useState(false);
  const [adBoosting, setAdBoosting] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Restore saved config if exists
  useEffect(() => {
    if (flow?.configuration) {
      setConfig(flow.configuration);
    }
  }, []);

  if (!flow) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Flow not found</p>
        <button onClick={() => navigate('/business/mergers')}
          className="mt-3 text-yellow-500 underline text-sm">Go back</button>
      </div>
    );
  }

  const options = getConfiguratorOptions(flow.mergerId);
  const categories = ['style', 'quality', 'audience', 'price'];
  const allSelected = categories.every(cat => config[cat] !== null);

  // Timer state
  const isConfigSaved = flow.configuration !== null && flow.configTimerEndTime;
  const timerRemaining = isConfigSaved
    ? Math.max(0, Math.floor((flow.configTimerEndTime - Date.now()) / 1000))
    : 0;
  const timerComplete = isConfigSaved && timerRemaining <= 0;

  const handleSelect = (category, optionId) => {
    if (isConfigSaved) return;
    setConfig(prev => ({ ...prev, [category]: optionId }));
  };

  const handleAutoSelect = () => {
    if (isConfigSaved) return;
    setAdAutoSelect(true);
    setTimeout(() => {
      const best = {};
      categories.forEach(cat => {
        const opts = options[cat]?.options || [];
        const bestOpt = opts.reduce((max, opt) =>
          opt.score > (max?.score || 0) ? opt : max, null);
        if (bestOpt) best[cat] = bestOpt.id;
      });
      setConfig(best);
      setAdAutoSelect(false);
    }, 2000);
  };

  const handleNext = () => {
    if (!allSelected || isConfigSaved) return;
    const score = calculateConfigScore(config, flow.mergerId);
    saveMergerConfig(flowId, config, score);
  };

  const handleBoostTimer = () => {
    if (!isConfigSaved || timerComplete || adBoosting) return;
    setAdBoosting(true);
    setTimeout(() => {
      setAdBoosting(false);
      boostConfigTimer(flowId);
    }, 2000);
  };

  const handleContinue = () => {
    if (!timerComplete) return;
    navigate(`/business/merger/development/${flowId}`);
  };

  // ═══ TIMER MODE ═══
  if (isConfigSaved) {
    const hours = Math.floor(timerRemaining / 3600);
    const mins = Math.floor((timerRemaining % 3600) / 60);
    const secs = timerRemaining % 60;

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
          <h1 className={`text-lg font-bold ${t.text.primary}`}>Collection Information</h1>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-4 space-y-3">
          {/* Selected Options (Locked) */}
          {categories.map(catKey => {
            const catDef = options[catKey];
            if (!catDef) return null;
            const CatIcon = catDef.icon;
            const selectedOpt = (catDef.options || []).find(o => o.id === config[catKey]);

            return (
              <div key={catKey}
                onClick={timerComplete ? handleContinue : undefined}
                className={`rounded-xl p-3.5 border transition-all
                  ${timerComplete
                    ? `cursor-pointer active:scale-[0.98] ${isDark ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40' : 'bg-green-50 border-green-200 hover:border-green-400'}`
                    : `${t.bg.card} ${t.border.default}`
                  }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                      ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <CatIcon className={`w-5 h-5 ${timerComplete ? 'text-green-500' : t.text.tertiary}`} />
                    </div>
                    <div>
                      <p className={`text-[10px] font-medium uppercase tracking-wider ${t.text.tertiary}`}>
                        {catDef.label}
                      </p>
                      <p className={`text-sm font-bold ${timerComplete ? 'text-green-500' : t.text.primary}`}>
                        {selectedOpt?.name || 'Selected'}
                      </p>
                      <p className={`text-[10px] ${t.text.tertiary}`}>
                        {selectedOpt?.subtitle || ''}
                      </p>
                    </div>
                  </div>
                  {/* Lock or Check */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${timerComplete
                      ? 'bg-green-500/15'
                      : isDark ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                    {timerComplete
                      ? <Check className="w-5 h-5 text-green-500" />
                      : <Lock className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    }
                  </div>
                </div>
              </div>
            );
          })}

          {/* Timer / Ready Section */}
          {timerComplete ? (
            <div className="pt-2">
              <button onClick={handleContinue}
                className="w-full py-4 rounded-xl text-sm font-bold
                  bg-gradient-to-r from-green-500 to-emerald-600 text-white
                  shadow-lg shadow-green-500/20 active:scale-95 transition-all
                  animate-pulse-glow">
                ✅ Collection Ready — Continue to Development
              </button>
            </div>
          ) : (
            <div className={`rounded-2xl p-5 text-center border-2
              ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <p className={`text-xs font-medium mb-3 ${t.text.secondary}`}>
                Will be available in
              </p>

              {/* Timer Display */}
              <div className="flex items-center justify-center gap-4 mb-4">
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

              {/* 4x Speed Button */}
              <button
                onClick={handleBoostTimer}
                disabled={adBoosting}
                className={`w-full flex items-center justify-center gap-2
                  py-3 rounded-xl text-sm font-bold transition-all
                  ${adBoosting ? 'opacity-50' : ''}
                  ${isDark
                    ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                    : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                  } active:scale-95`}>
                <Zap className="w-4 h-4" />
                {adBoosting ? 'Watching Ad...' : 'Watch Ad for 4× Speed'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══ SELECTION MODE ═══
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
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Collection Information</h1>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-4 space-y-4 pb-40">
        <div className="text-center px-4">
          <h2 className={`text-lg font-bold mb-1.5 ${t.text.primary}`}>Collection Configurator</h2>
          <p className={`text-[11px] leading-relaxed ${t.text.secondary}`}>
            Based on trend information, select the correct collection parameters in the configurator.
          </p>
        </div>

        {/* Ad Auto-Select */}
        <button onClick={handleAutoSelect} disabled={adAutoSelect}
          className={`w-full rounded-xl p-3.5 text-left transition-all active:scale-[0.98]
            border-2 border-dashed ${adAutoSelect ? 'opacity-50' : ''}
            ${isDark ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-yellow-300 bg-yellow-50'}`}>
          <div className="flex items-center gap-3">
            <MonitorPlay className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm font-bold text-yellow-500">
                {adAutoSelect ? 'Watching Ad...' : 'Auto-Select Best Options'}
              </p>
              <p className={`text-[10px] ${t.text.tertiary}`}>
                Watch ad to automatically select optimal configuration
              </p>
            </div>
          </div>
        </button>

        {/* Category Lists */}
        {categories.map(catKey => {
          const catDef = options[catKey];
          if (!catDef) return null;
          const CatIcon = catDef.icon;
          const selected = config[catKey];

          return (
            <div key={catKey}>
              <div className="flex items-center gap-2 mb-2">
                <CatIcon className={`w-4 h-4 ${t.text.brand}`} />
                <p className={`text-sm font-bold ${t.text.primary}`}>{catDef.label}</p>
              </div>
              <div className="space-y-1.5">
                {catDef.options.map(opt => {
                  const isSelected = selected === opt.id;
                  return (
                    <button key={opt.id}
                      onClick={() => handleSelect(catKey, opt.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl
                        transition-all active:scale-[0.98] border
                        ${isSelected
                          ? isDark ? 'bg-purple-500/10 border-purple-500/40' : 'bg-purple-50 border-purple-300'
                          : isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                        }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center
                          ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          <CatIcon className={`w-4 h-4 ${isSelected ? 'text-purple-500' : t.text.tertiary}`} />
                        </div>
                        <div className="text-left">
                          <p className={`text-xs font-bold ${isSelected ? 'text-purple-500' : t.text.primary}`}>
                            {opt.name}
                          </p>
                          <p className={`text-[10px] ${t.text.tertiary}`}>{opt.subtitle}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${isSelected ? 'bg-purple-500 border-purple-500' : isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Bottom */}
      <div className={`flex-shrink-0 border-t ${t.border.default} ${t.bg.secondary}`}>
        <div className="flex items-center justify-around px-3 py-2">
          {categories.map(catKey => {
            const catDef = options[catKey];
            const isSelected = config[catKey] !== null;
            return (
              <div key={catKey} className="flex flex-col items-center">
                <p className={`text-[9px] font-medium ${t.text.tertiary}`}>
                  {catDef?.label?.split(' ')[0] || catKey}
                </p>
                <div className={`w-6 h-6 mt-0.5 rounded-md flex items-center justify-center
                  ${isSelected ? 'bg-green-500/15' : isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  {isSelected
                    ? <Check className="w-3.5 h-3.5 text-green-500" />
                    : <X className={`w-3.5 h-3.5 ${t.text.tertiary}`} />}
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-3 pb-3">
          <button onClick={handleNext} disabled={!allSelected}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-all
              ${allSelected
                ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/20 active:scale-95'
                : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
            {allSelected ? 'Next' : `Select All (${categories.filter(c => config[c]).length}/4)`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MergerConfigurator;