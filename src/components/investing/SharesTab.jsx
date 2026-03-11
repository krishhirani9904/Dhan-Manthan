import { useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Rocket, BarChart3 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { STOCKS, getSimulatedPrice, getStableStocks, getGrowthStocks, getPriceChange } from '../../data/stockMarket';
import { formatCurrency } from '../../utils/formatCurrency';

function SharesTab() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedStocks, priceSeed } = useGame();

  const portfolioValue = ownedStocks.reduce((sum, os) => {
    const def = STOCKS.find(s => s.id === os.stockId);
    if (!def) return sum;
    return sum + (getSimulatedPrice(def, priceSeed) * os.quantity);
  }, 0);

  const totalInvested = ownedStocks.reduce((sum, os) => sum + (os.avgBuyPrice * os.quantity), 0);
  const allTimeProfit = portfolioValue - totalInvested;
  const allTimeProfitPct = totalInvested > 0 ? ((allTimeProfit / totalInvested) * 100) : 0;

  const yieldPerHour = ownedStocks.reduce((sum, os) => {
    const def = STOCKS.find(s => s.id === os.stockId);
    if (!def || !def.dividendPercent) return sum;
    const totalVal = os.quantity * os.avgBuyPrice;
    return sum + Math.floor((totalVal * def.dividendPercent / 100) / 8760);
  }, 0);

  const stableStocks = getStableStocks();
  const growthStocks = getGrowthStocks();
  const topStable = [...stableStocks].sort((a, b) => b.dividendPercent - a.dividendPercent)[0];
  const topGrowth = [...growthStocks].sort((a, b) => b.volatility - a.volatility)[0];

  return (
    <div className="px-3 pb-4 space-y-3">
      {/* Portfolio */}
      <button onClick={() => navigate('/investing/stocks/portfolio')}
        className={`w-full rounded-xl p-4 text-left transition-all active:scale-[0.98]
          ${t.bg.card} border ${t.border.default} hover:border-green-500/30`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-medium ${t.text.secondary}`}>My Stock Portfolio</span>
          <ChevronRight className={`w-4 h-4 ${t.text.tertiary}`} />
        </div>
        <p className={`text-[10px] ${t.text.tertiary} mb-0.5`}>Value of Stock Portfolio</p>
        <p className={`text-2xl font-black ${t.text.primary}`}>{formatCurrency(portfolioValue)}</p>
        <p className={`text-xs font-bold mt-1 ${allTimeProfit >= 0 ? 'text-green-500' : 'text-red-400'}`}>
          {allTimeProfit >= 0 ? '+' : ''}{formatCurrency(allTimeProfit)}
          {' '}({allTimeProfitPct >= 0 ? '+' : ''}{allTimeProfitPct.toFixed(2)}%) For All Time
        </p>
        <p className={`text-[10px] mt-2 ${t.text.tertiary}`}>Estimated Yield Per Hour</p>
        <p className={`text-sm font-bold ${t.text.brand}`}>{formatCurrency(yieldPerHour)}</p>
      </button>

      {/* Stock Market */}
      <button onClick={() => navigate('/investing/stocks/market')}
        className={`w-full flex items-center justify-between p-3.5 rounded-xl
          transition-all active:scale-[0.98]
          ${t.bg.card} border ${t.border.default} hover:border-green-500/30`}>
        <div className="flex items-center gap-2">
          <BarChart3 className={`w-5 h-5 ${t.text.brand}`} />
          <div>
            <p className={`text-sm font-bold ${t.text.primary}`}>Stock Market</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>View all available offers</p>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 ${t.text.tertiary}`} />
      </button>

      {/* Stable Income */}
      <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className={`text-sm font-bold ${t.text.primary}`}>Stable Income</span>
        </div>
        <p className={`text-[10px] mb-3 ${t.text.tertiary}`}>Shares with the highest dividends</p>
        {topStable && (() => {
          const { pct, isUp } = getPriceChange(topStable, priceSeed);
          return (
            <div className={`flex items-center justify-between p-2.5 rounded-lg mb-2
              ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{topStable.icon}</span>
                <div>
                  <p className={`text-xs font-bold ${t.text.primary}`}>{topStable.name}</p>
                  <p className={`text-[10px] font-bold ${isUp ? 'text-green-500' : 'text-red-400'}`}>
                    {topStable.dividendPercent.toFixed(2)}%
                  </p>
                </div>
              </div>
              <button onClick={() => navigate(`/investing/stocks/detail/${topStable.id}`)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold
                  bg-green-500 text-white active:scale-95 transition-all">
                View
              </button>
            </div>
          );
        })()}
        <button onClick={() => navigate('/investing/stocks/stable')}
          className={`text-xs font-medium ${t.text.brand}`}>
          Show All →
        </button>
      </div>

      {/* Growth Potential */}
      <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <Rocket className="w-4 h-4 text-purple-500" />
          <span className={`text-sm font-bold ${t.text.primary}`}>Growth Potential</span>
        </div>
        <p className={`text-[10px] mb-3 ${t.text.tertiary}`}>Stocks that could rise</p>
        {topGrowth && (() => {
          const { pct, isUp } = getPriceChange(topGrowth, priceSeed);
          return (
            <div className={`flex items-center justify-between p-2.5 rounded-lg mb-2
              ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{topGrowth.icon}</span>
                <div>
                  <p className={`text-xs font-bold ${t.text.primary}`}>{topGrowth.name}</p>
                  <p className={`text-[10px] font-bold ${isUp ? 'text-green-500' : 'text-red-400'}`}>
                    {isUp ? '+' : ''}{(topGrowth.volatility * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
              <button onClick={() => navigate(`/investing/stocks/detail/${topGrowth.id}`)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold
                  bg-purple-500 text-white active:scale-95 transition-all">
                View
              </button>
            </div>
          );
        })()}
        <button onClick={() => navigate('/investing/stocks/growth')}
          className={`text-xs font-medium ${t.text.brand}`}>
          Show All →
        </button>
      </div>
    </div>
  );
}

export default SharesTab;