import { TrendingUp, Zap } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { formatCurrency } from '../../utils/formatCurrency';

function LevelProgress() {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const {
    perClick, currentPerClick, balance,
    upgradeCost, handleUpgrade, boostActive, availableUpgrades
  } = useGame();

  const progress = Math.min((balance / upgradeCost) * 100, 100);
  const canUpgrade = availableUpgrades > 0;
  const nextPerClick = perClick + 2;

  return (
    <div className={`${t.bg.card} border ${t.border.default} rounded-xl p-5
      transition-colors duration-300 flex-shrink-0`}>

      <div className={`flex items-center justify-between ${canUpgrade ? 'mb-1.5' : 'mb-1'}`}>
        <p className={`text-[11px] ${t.text.secondary}`}>
          <span className="font-bold text-green-500 text-xl">₹{currentPerClick}</span>
          <span className={`${t.text.tertiary} text-xl`}>/click</span>
          {boostActive && (
            <span className="text-purple-400 ml-1 text-[10px]">
              <Zap className="w-2.5 h-2.5 inline mb-0.5" />2X
            </span>
          )}
          <span className={`${t.text.tertiary} mx-2 text-3xl`}>→</span>
          <span className={`font-semibold text-xl ${t.text.primary}`}>₹{nextPerClick}</span>
          <span className={`${t.text.tertiary} text-xl`}>/click</span>
        </p>
        {!canUpgrade && (
          <p className={`text-sm ${t.text.tertiary}`}>{formatCurrency(upgradeCost)}</p>
        )}
      </div>

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
              w-4 h-4 rounded-full flex items-center justify-center ml-0.5">
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
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default LevelProgress;