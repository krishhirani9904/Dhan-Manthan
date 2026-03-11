import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { STOCKS, getSimulatedPrice, getPriceChange, getAvailableShares } from '../../../data/stockMarket';
import { formatCurrency } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

const FILTERS = [
  { id: 'highest_div', label: 'Highest Dividend' },
  { id: 'lowest_div', label: 'Lowest Dividend' },
  { id: 'cheap', label: 'Cheap First' },
  { id: 'expensive', label: 'Expensive First' },
  { id: 'high_cap', label: 'Highest Cap' },
  { id: 'low_cap', label: 'Lowest Cap' },
];

function StockMarket() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { priceSeed, ownedStocks } = useGame();
  const [filter, setFilter] = useState('highest_div');

  const sorted = useMemo(() => {
    const list = [...STOCKS];
    switch (filter) {
      case 'highest_div': return list.sort((a, b) => b.dividendPercent - a.dividendPercent);
      case 'lowest_div': return list.sort((a, b) => a.dividendPercent - b.dividendPercent);
      case 'cheap': return list.sort((a, b) => getSimulatedPrice(a, priceSeed) - getSimulatedPrice(b, priceSeed));
      case 'expensive': return list.sort((a, b) => getSimulatedPrice(b, priceSeed) - getSimulatedPrice(a, priceSeed));
      case 'high_cap': return list.sort((a, b) => (b.capitalization || 0) - (a.capitalization || 0));
      case 'low_cap': return list.sort((a, b) => (a.capitalization || 0) - (b.capitalization || 0));
      default: return list;
    }
  }, [filter, priceSeed]);

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/investing')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Stock Market</h1>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 px-3 py-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 min-w-max">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all
                ${filter === f.id
                  ? 'bg-green-500 text-white'
                  : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-2 space-y-2">
        {sorted.map(stock => {
          const price = getSimulatedPrice(stock, priceSeed);
          const { change, pct, isUp } = getPriceChange(stock, priceSeed);
          const available = getAvailableShares(stock, ownedStocks);

          return (
            <button key={stock.id}
              onClick={() => navigate(`/investing/stocks/detail/${stock.id}`)}
              className={`w-full flex items-center justify-between p-3 rounded-xl
                text-left transition-all active:scale-[0.98]
                ${t.bg.card} border ${t.border.default}`}>
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{stock.icon}</span>
                <div>
                  <p className={`text-xs font-bold ${t.text.primary}`}>{stock.name}</p>
                  <p className={`text-[10px] ${t.text.tertiary}`}>
                    {available > 0 ? 'Available' : 'Unavailable'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-bold ${t.text.primary}`}>{formatCurrency(price)}</p>
                <div className="flex items-center justify-end gap-0.5">
                  {isUp ? <TrendingUp className="w-2.5 h-2.5 text-green-500" />
                    : <TrendingDown className="w-2.5 h-2.5 text-red-400" />}
                  <span className={`text-[9px] font-bold ${isUp ? 'text-green-500' : 'text-red-400'}`}>
                    {isUp ? '+' : ''}{change.toFixed(2)} ({isUp ? '+' : ''}{pct.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <AdSpace />
    </div>
  );
}

export default StockMarket;