import { TrendingUp, Zap, Trophy, ChevronUp } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useEarnings } from '../../hooks/useEarnings';
import { useGame } from '../../hooks/useGame';
import { formatCurrency } from '../../utils/formatCurrency';

function LevelProgress() {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance } = useGame();
  const {
    perClick,
    currentPerClick,
    nextPerClick,
    upgradeCost,
    handleUpgrade,
    boostActive,
    availableUpgrades,
    isMaxLevel,
    upgradeProgress,
    level,
    maxLevel,
    maxPerClick,
  } = useEarnings();

  const canUpgrade = availableUpgrades > 0;

  // ═══ MAX LEVEL REACHED — Tap still works, just no upgrade ═══
  if (isMaxLevel) {
    return (
      <div className={`${t.bg.card} border ${t.border.default} rounded-xl p-4
        transition-colors duration-300 flex-shrink-0`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500
              flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Trophy className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className={`text-sm font-bold ${t.text.primary}`}>MAX LEVEL!</p>
              <p className={`text-[10px] ${t.text.tertiary}`}>
                Level {level}/{maxLevel} • Tap mastery achieved
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-green-500 font-black text-lg">
              ₹{currentPerClick.toLocaleString('en-IN')}
            </p>
            <p className={`text-[9px] ${t.text.tertiary}`}>
              per click{boostActive ? ' (2X!)' : ''}
            </p>
          </div>
        </div>

        {/* Full progress bar */}
        <div className="mt-2.5 w-full h-1.5 rounded-full overflow-hidden bg-yellow-500/20">
          <div className="h-full w-full rounded-full
            bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500" />
        </div>
        <p className={`text-[9px] ${t.text.tertiary} text-center mt-1`}>
          🏆 All upgrades complete — Keep tapping to earn!
        </p>
      </div>
    );
  }

  // ═══ NORMAL UPGRADE VIEW ═══
  return (
    <div className={`${t.bg.card} border ${t.border.default} rounded-xl p-4
      transition-colors duration-300 flex-shrink-0`}>

      {/* Level indicator */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md
            ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
            Lv.{level}
          </span>
          <ChevronUp className={`w-3 h-3 ${t.text.tertiary}`} />
          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md
            ${isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>
            Lv.{level + 1}
          </span>
        </div>
        {!canUpgrade && (
          <p className={`text-[10px] ${t.text.tertiary}`}>{formatCurrency(upgradeCost)}</p>
        )}
      </div>

      {/* Per click display */}
      <div className="flex items-center justify-between mb-2">
        <p className={`text-[11px] ${t.text.secondary}`}>
          <span className={`${t.text.tertiary} text-lg`}>
            ₹{currentPerClick.toLocaleString('en-IN')}
          </span>
          <span className={`${t.text.tertiary} text-lg`}>/click</span>
          {boostActive && (
            <span className="text-purple-400 ml-1 text-[10px]">
              <Zap className="w-2.5 h-2.5 inline mb-0.5" />2X
            </span>
          )}
        </p>
        <div className="flex items-center gap-1">
          <span className={`font-black text-2xl`}>→</span>
          <span className="font-bold text-green-500 text-lg">
            ₹{nextPerClick.toLocaleString('en-IN')}
          </span>
          <span className="font-bold text-green-500 text-lg">/click</span>
        </div>
      </div>

      {/* Upgrade button or progress bar */}
      {canUpgrade ? (
        <button
          onClick={handleUpgrade}
          className="w-full py-2 rounded-xl font-bold text-xs
            flex items-center justify-center gap-1.5 transition-all duration-300
            bg-gradient-to-r from-yellow-500 to-orange-500 text-white
            shadow-lg shadow-orange-500/20
            hover:scale-[1.02] active:scale-[0.98]"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Upgrade — {formatCurrency(upgradeCost)}</span>
          {availableUpgrades > 1 && (
            <span className="bg-white/25 text-white text-[9px] font-black
              w-5 h-5 rounded-full flex items-center justify-center ml-0.5">
              {availableUpgrades > 9 ? '9+' : availableUpgrades}
            </span>
          )}
        </button>
      ) : (
        <div className={`w-full h-1.5 rounded-full overflow-hidden
          ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500
              transition-all duration-500 ease-out"
            style={{ width: `${upgradeProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default LevelProgress;