import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { STOCKS, getSimulatedPrice, getPriceChange, getAvailableShares, getSharePercent } from '../../../data/stockMarket';
import { formatCurrency, formatNumber } from '../../../utils/formatCurrency';
import { DIVIDEND_PERIOD_HOURS } from '../../../config/constants';
import PageHeader from '../../../components/common/PageHeader';
import AdSpace from '../../../components/common/AdSpace';

function StockBuy() {
  const { stockId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, priceSeed, buyStock, ownedStocks } = useGame();

  const stock = STOCKS.find(s => s.id === stockId);
  const [qty, setQty] = useState(1);
  const [buying, setBuying] = useState(false);
  const buyRef = useRef(false);

  useEffect(() => { return () => { buyRef.current = false; }; }, []);

  if (!stock) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Stock not found</p>
      </div>
    );
  }

  const currentPrice = getSimulatedPrice(stock, priceSeed);
  const { change, pct, isUp } = getPriceChange(stock, priceSeed);
  const available = getAvailableShares(stock, ownedStocks);
  // FIXED: Floor to prevent overspend
  const maxBuyable = Math.min(available, Math.floor(balance / currentPrice));
  const totalCost = qty * currentPrice;
  const canBuy = balance >= totalCost && qty <= available && qty > 0 && !buying;
  const owned = ownedStocks.find(s => s.stockId === stockId);
  const ownedQty = owned ? owned.quantity : 0;
  const newTotal = ownedQty + qty;
  const sharePercent = getSharePercent(stock, newTotal);

  // FIXED: Prevent double-click
  const handleBuy = () => {
    if (!canBuy || buyRef.current) return;
    buyRef.current = true;
    setBuying(true);
    buyStock(stockId, qty, currentPrice);
    setTimeout(() => navigate(-1), 200);
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <PageHeader title="Buying Stocks" backTo="/investing" />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4">
        <p className={`text-xs ${t.text.secondary}`}>
          Balance: <span className={`font-bold ${t.text.primary}`}>{formatCurrency(balance)}</span>
        </p>

        <div className={`flex items-center justify-between p-3 rounded-xl ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{stock.icon}</span>
            <div>
              <p className={`text-xs font-bold ${t.text.primary}`}>{stock.name}</p>
              <p className={`text-[10px] ${t.text.tertiary}`}>Available</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xs font-bold ${t.text.primary}`}>{formatCurrency(currentPrice)}</p>
            <div className="flex items-center justify-end gap-0.5">
              {isUp ? <TrendingUp className="w-2.5 h-2.5 text-green-500" />
                : <TrendingDown className="w-2.5 h-2.5 text-red-400" />}
              <span className={`text-[9px] font-bold ${isUp ? 'text-green-500' : 'text-red-400'}`}>
                {isUp ? '+' : ''}{pct.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className={`text-xs font-bold mb-2 ${t.text.primary}`}>Quantity:</p>
          <div className="flex items-center gap-2">
            {/* FIXED: Integer-only input */}
            <input type="number" value={qty} min={1} step={1}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (!isNaN(v) && v >= 1) setQty(Math.min(v, maxBuyable));
              }}
              onBlur={() => { if (qty < 1) setQty(1); }}
              className={`flex-1 h-10 rounded-xl text-center text-sm font-bold outline-none border
                ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`} />
            <button onClick={() => setQty(Math.max(1, maxBuyable))}
              className={`px-4 h-10 rounded-xl text-xs font-bold
                ${isDark ? 'bg-gray-800 text-yellow-500' : 'bg-gray-100 text-yellow-600'}`}>
              Max
            </button>
          </div>
          <p className={`text-[10px] mt-1 ${t.text.tertiary}`}>
            {formatNumber(available)} shares available
          </p>
        </div>

        <div className="flex justify-between items-center">
          <span className={`text-xs font-bold ${t.text.primary}`}>Total:</span>
          <span className={`text-lg font-black ${t.text.brand}`}>{formatCurrency(totalCost)}</span>
        </div>

        <button onClick={handleBuy} disabled={!canBuy}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95
            ${canBuy
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20'
              : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
          {buying ? 'Processing...' : canBuy ? `Buy ${qty} Shares — ${formatCurrency(totalCost)}` : `Need ${formatCurrency(Math.max(0, totalCost - balance))}`}
        </button>

        {/* Details */}
        <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default} space-y-3`}>
          <p className={`text-sm font-bold ${t.text.primary}`}>Details</p>
          <div className="flex justify-between">
            <span className={`text-xs ${t.text.secondary}`}>Price Change</span>
            <span className={`text-xs font-bold ${isUp ? 'text-green-500' : 'text-red-400'}`}>
              {isUp ? '+' : ''}{formatCurrency(Math.abs(change))} ({pct.toFixed(2)}%)
            </span>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className={`text-xs ${t.text.secondary}`}>Share in company</span>
              <span className={`text-xs font-bold ${t.text.primary}`}>{newTotal} pcs.</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <div className="h-full rounded-full bg-green-500"
                style={{ width: `${Math.min(sharePercent, 100)}%` }} />
            </div>
            <p className={`text-[10px] mt-0.5 ${t.text.tertiary}`}>{sharePercent.toFixed(4)}%</p>
          </div>
          {stock.dividendPercent > 0 && (
            <div className="flex gap-2">
              <div className={`flex-1 rounded-xl p-3 text-center ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-sm font-bold ${t.text.primary}`}>{stock.dividendPercent}%</p>
                <p className={`text-[9px] ${t.text.tertiary}`}>Dividend</p>
              </div>
              <div className={`flex-1 rounded-xl p-3 text-center ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-sm font-bold ${t.text.primary}`}>{formatCurrency(currentPrice)}</p>
                <p className={`text-[9px] ${t.text.tertiary}`}>Share Price</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <AdSpace />
    </div>
  );
}

export default StockBuy;