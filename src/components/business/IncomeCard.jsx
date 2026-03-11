import { useState, useRef, useEffect } from 'react';
import { MonitorPlay, ChevronsUp } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useGame } from '../../hooks/useGame';
import { theme } from '../../design/tokens';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatTimeShort } from '../../utils/formatTime';
import { AD_WATCH_TIME } from '../../config/constants';

function IncomeCard() {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const {
    incomePerHour, boostedIncomePerHour,
    bizBoostActive, bizBoostRemaining, startBizBoost,
  } = useGame();
  const [adWatching, setAdWatching] = useState(false);
  const timerRef = useRef(null);

  // FIXED: Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCardClick = () => {
    if (bizBoostActive || adWatching) return;
    setAdWatching(true);
    timerRef.current = setTimeout(() => {
      setAdWatching(false);
      startBizBoost(15);
      timerRef.current = null;
    }, AD_WATCH_TIME * 1000);
  };

  return (
    <button onClick={handleCardClick}
      disabled={bizBoostActive || adWatching}
      className={`flex-shrink-0 rounded-xl p-3.5 w-full text-left
        ${t.bg.card} border ${t.border.default} transition-all duration-300
        ${!bizBoostActive && !adWatching ? 'active:scale-[0.98] cursor-pointer' : 'cursor-default'}
        ${adWatching ? 'animate-pulse' : ''}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <ChevronsUp className={`w-4 h-4 ${t.text.brand}`} />
          <span className={`text-sm font-medium ${t.text.secondary}`}>Income Per Hour</span>
        </div>
        {bizBoostActive && bizBoostRemaining > 0 && (
          <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full
            bg-green-500/15 text-green-500">
            {formatTimeShort(bizBoostRemaining)} remaining
          </span>
        )}
      </div>
      <p className={`text-3xl font-black tracking-tight mb-2
        ${bizBoostActive ? 'text-green-500' : t.text.primary}`}>
        {formatCurrency(bizBoostActive ? boostedIncomePerHour : incomePerHour)}
        <span className={`text-xl font-normal ml-1 ${t.text.tertiary}`}>/hr</span>
      </p>
      {!bizBoostActive && (
        <div className={`w-full flex items-center gap-2 py-2 px-3 rounded-lg
          ${isDark ? 'bg-gray-800' : 'bg-gray-100'} ${adWatching ? 'opacity-50' : ''}`}>
          <MonitorPlay className={`w-4 h-4 flex-shrink-0 ${t.text.brand}`} />
          <span className={`text-xs font-medium ${t.text.secondary}`}>
            {adWatching ? 'Watching ad...' : 'Raise Income (15% for 4h)'}
          </span>
        </div>
      )}
    </button>
  );
}

export default IncomeCard;