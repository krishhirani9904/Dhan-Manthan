import { useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { getForbesRanking } from '../../data/forbesData';
import { formatCurrency } from '../../utils/formatCurrency';
import PageHeader from '../../components/common/PageHeader';
import AdSpace from '../../components/common/AdSpace';

function ForbesPage() {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance } = useGame();

  const ranking = useMemo(() => getForbesRanking(balance), [balance]);

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <PageHeader title="Forbes Rich List" backTo="/profile" />
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-2">
        {ranking.map(entry => (
          <div key={entry.id}
            className={`flex items-center gap-3 p-3 rounded-xl
              ${entry.isPlayer
                ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/30'
                : `${t.bg.card} border ${t.border.default}`}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm
              ${entry.rank <= 3 ? 'bg-yellow-500 text-white' : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              {entry.rank}
            </div>
            <span className="text-2xl">{entry.avatar}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold truncate
                ${entry.isPlayer ? 'text-yellow-500' : t.text.primary}`}>
                {entry.name} {entry.isPlayer ? '(You)' : ''}
              </p>
              <p className={`text-xs ${t.text.tertiary}`}>
                {formatCurrency(entry.baseWealth)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <AdSpace />
    </div>
  );
}

export default ForbesPage;