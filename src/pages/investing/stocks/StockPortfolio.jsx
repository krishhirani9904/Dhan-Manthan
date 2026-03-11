import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { STOCKS, getSimulatedPrice, getPriceChange } from '../../../data/stockMarket';
import { formatCurrency } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

function StockPortfolio() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedStocks, priceSeed } = useGame();

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/investing')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>My Stock Portfolio</h1>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-2">
        {ownedStocks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <TrendingUp className={`w-12 h-12 mb-3 ${t.text.tertiary}`} />
            <p className={`text-sm font-medium ${t.text.secondary}`}>No stocks owned yet</p>
            <button onClick={() => navigate('/investing/stocks/market')}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-bold bg-green-500 text-white">
              Browse Market
            </button>
          </div>
        ) : (
          ownedStocks.map(os => {
            const def = STOCKS.find(s => s.id === os.stockId);
            if (!def) return null;
            const currentPrice = getSimulatedPrice(def, priceSeed);
            const totalValue = currentPrice * os.quantity;
            const invested = os.avgBuyPrice * os.quantity;
            const profit = totalValue - invested;
            const pct = invested > 0 ? ((profit / invested) * 100) : 0;
            const up = profit >= 0;

            return (
              <button key={os.stockId}
                onClick={() => navigate(`/investing/stocks/detail/${os.stockId}`)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl
                  text-left transition-all active:scale-[0.98]
                  ${t.bg.card} border ${t.border.default} hover:border-green-500/30`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{def.icon}</span>
                  <div>
                    <p className={`text-sm font-bold ${t.text.primary}`}>{def.name}</p>
                    <p className={`text-[10px] ${t.text.tertiary}`}>{os.quantity} pcs.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${t.text.primary}`}>{formatCurrency(totalValue)}</p>
                  <div className="flex items-center justify-end gap-0.5">
                    {up ? <TrendingUp className="w-2.5 h-2.5 text-green-500" />
                      : <TrendingDown className="w-2.5 h-2.5 text-red-400" />}
                    <span className={`text-[10px] font-bold ${up ? 'text-green-500' : 'text-red-400'}`}>
                      {up ? '+' : ''}{pct.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
      <AdSpace />
    </div>
  );
}

export default StockPortfolio;