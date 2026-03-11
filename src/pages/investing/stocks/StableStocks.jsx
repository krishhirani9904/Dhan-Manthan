import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { getStableStocks, getSimulatedPrice, getPriceChange } from '../../../data/stockMarket';
import { formatCurrency } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

function StableStocks() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { priceSeed } = useGame();

  const stocks = getStableStocks().sort((a, b) => b.dividendPercent - a.dividendPercent);

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/investing')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Stable Income</h1>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-2">
        {stocks.map(stock => {
          const { pct, isUp } = getPriceChange(stock, priceSeed);
          return (
            <button key={stock.id}
              onClick={() => navigate(`/investing/stocks/detail/${stock.id}`)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl
                text-left transition-all active:scale-[0.98]
                ${t.bg.card} border ${t.border.default}`}>
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{stock.icon}</span>
                <div>
                  <p className={`text-xs font-bold ${t.text.primary}`}>{stock.name}</p>
                  <p className={`text-[10px] ${t.text.tertiary}`}>Available</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${isUp ? 'text-green-500' : 'text-red-400'}`}>
                  {stock.dividendPercent.toFixed(2)}%
                </p>
                <p className={`text-[10px] ${t.text.tertiary}`}>Dividend Yield</p>
              </div>
            </button>
          );
        })}
      </div>
      <AdSpace />
    </div>
  );
}

export default StableStocks;