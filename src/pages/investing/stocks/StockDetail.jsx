import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { STOCKS, getSimulatedPrice, getPriceChange, getSharePercent, getAvailableShares } from '../../../data/stockMarket';
import { formatCurrency, formatNumber } from '../../../utils/formatCurrency';
import { DIVIDEND_PERIOD_HOURS } from '../../../config/constants';
import PriceChart from '../../../components/investing/PriceChart';
import AdSpace from '../../../components/common/AdSpace';

function StockDetail() {
  const { stockId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedStocks, priceSeed } = useGame();

  const stock = STOCKS.find(s => s.id === stockId);
  if (!stock) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Stock not found</p>
        <button onClick={() => navigate('/investing')}
          className="mt-3 text-yellow-500 underline text-sm">Go back</button>
      </div>
    );
  }

  // FIXED: Safe navigation fallback
  const handleBack = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate('/investing');
  };

  const owned = ownedStocks.find(s => s.stockId === stockId);
  const currentPrice = getSimulatedPrice(stock, priceSeed);
  const { change, pct, isUp } = getPriceChange(stock, priceSeed);
  const ownedQty = owned ? owned.quantity : 0;
  const sharePercent = getSharePercent(stock, ownedQty);
  const totalValue = currentPrice * ownedQty;
  const invested = owned ? owned.avgBuyPrice * ownedQty : 0;
  const profit = totalValue - invested;
  const profitPct = invested > 0 ? ((profit / invested) * 100) : 0;
  const dividendYield = stock.dividendPercent > 0
    ? ((stock.dividendPercent / 100) * DIVIDEND_PERIOD_HOURS / 8760 * 100).toFixed(4) : '0.00';

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={handleBack}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4">
        <div className="flex flex-col items-center">
          <span className="text-4xl mb-2">{stock.icon}</span>
          <p className={`text-lg font-bold ${t.text.primary}`}>{stock.name}</p>
        </div>

        <PriceChart seed={priceSeed + stock.id.length * 100} volatility={stock.volatility} height={140} />

        {owned ? (
          <div className="flex gap-2">
            <button onClick={() => navigate(`/investing/stocks/sell/${stockId}`)}
              className="flex-1 py-3 rounded-xl text-sm font-bold
                bg-gradient-to-r from-red-500 to-rose-500 text-white active:scale-95">
              Sell
            </button>
            <button onClick={() => navigate(`/investing/stocks/buy/${stockId}`)}
              className="flex-1 py-3 rounded-xl text-sm font-bold
                bg-gradient-to-r from-green-500 to-emerald-500 text-white active:scale-95">
              Buy More
            </button>
          </div>
        ) : (
          <button onClick={() => navigate(`/investing/stocks/buy/${stockId}`)}
            className="w-full py-3 rounded-xl text-sm font-bold
              bg-gradient-to-r from-green-500 to-emerald-500 text-white active:scale-95">
            Buy Shares
          </button>
        )}

        <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default} space-y-3`}>
          <p className={`text-sm font-bold ${t.text.primary}`}>Details</p>

          {owned && (
            <>
              <div className="flex justify-between">
                <span className={`text-xs ${t.text.secondary}`}>Total Cost</span>
                <span className={`text-xs font-bold ${t.text.primary}`}>{formatCurrency(invested)}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-xs ${t.text.secondary}`}>Profit/Loss</span>
                <span className={`text-xs font-bold ${profit >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                  {profit >= 0 ? '+' : ''}{formatCurrency(profit)} ({profitPct >= 0 ? '+' : ''}{profitPct.toFixed(2)}%)
                </span>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className={`text-xs ${t.text.secondary}`}>Share in the company</span>
                  <span className={`text-xs font-bold ${t.text.primary}`}>{ownedQty} pcs.</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <div className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${Math.min(sharePercent, 100)}%` }} />
                </div>
                <p className={`text-[10px] mt-0.5 ${t.text.tertiary}`}>{sharePercent.toFixed(4)}%</p>
              </div>
            </>
          )}

          <div className="flex gap-2">
            <div className={`flex-1 rounded-xl p-3 text-center ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <p className={`text-sm font-bold ${t.text.primary}`}>{dividendYield}%</p>
              <p className={`text-[9px] ${t.text.tertiary}`}>Dividend yield in the period*</p>
            </div>
            <div className={`flex-1 rounded-xl p-3 text-center ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <p className={`text-sm font-bold ${t.text.primary}`}>{formatCurrency(currentPrice)}</p>
              <p className={`text-[9px] ${t.text.tertiary}`}>Share Price</p>
            </div>
          </div>

          <div className="flex justify-between">
            <span className={`text-xs ${t.text.secondary}`}>Price Change</span>
            <span className={`text-xs font-bold ${isUp ? 'text-green-500' : 'text-red-400'}`}>
              {isUp ? '+' : ''}{formatCurrency(Math.abs(change))} ({isUp ? '+' : ''}{pct.toFixed(2)}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`text-xs ${t.text.secondary}`}>Company Capitalization</span>
            <span className={`text-xs font-bold ${t.text.primary}`}>{formatCurrency(stock.capitalization)}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-xs ${t.text.secondary}`}>Available Shares</span>
            <span className={`text-xs font-bold ${t.text.primary}`}>
              {formatNumber(getAvailableShares(stock, ownedStocks))}
            </span>
          </div>

          <p className={`text-[9px] ${t.text.tertiary}`}>*period = {DIVIDEND_PERIOD_HOURS} hours</p>
        </div>
      </div>
      <AdSpace />
    </div>
  );
}

export default StockDetail;