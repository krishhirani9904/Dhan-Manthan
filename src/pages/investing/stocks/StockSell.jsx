import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { STOCKS, getSimulatedPrice, getPriceChange } from '../../../data/stockMarket';
import { formatCurrency } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

function StockSell() {
  const { stockId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, priceSeed, sellStock, ownedStocks } = useGame();

  const stock = STOCKS.find(s => s.id === stockId);
  const owned = ownedStocks.find(s => s.stockId === stockId);
  const [qty, setQty] = useState(1);

  if (!stock || !owned) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Stock not found or not owned</p>
      </div>
    );
  }

  const currentPrice = getSimulatedPrice(stock, priceSeed);
  const { change, pct, isUp } = getPriceChange(stock, priceSeed);
  const totalValue = qty * currentPrice;
  const canSell = owned.quantity >= qty && qty > 0;

  const handleSell = () => {
    if (canSell) { sellStock(stockId, qty, currentPrice); navigate(-1); }
  };

  const handleMax = () => setQty(owned.quantity);

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate(-1)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Selling Shares</h1>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4">
        <p className={`text-xs ${t.text.secondary}`}>
          Balance: <span className={`font-bold ${t.text.primary}`}>{formatCurrency(balance)}</span>
        </p>

        <div className={`flex items-center justify-between p-3 rounded-xl ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{stock.icon}</span>
            <div>
              <p className={`text-xs font-bold ${t.text.primary}`}>{stock.name}</p>
              <p className={`text-[10px] ${t.text.tertiary}`}>{owned.quantity} pcs.</p>
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
            <input type="number" value={qty}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (!isNaN(v) && v >= 1) setQty(Math.min(v, owned.quantity));
              }}
              className={`flex-1 h-10 rounded-xl text-center text-sm font-bold outline-none border
                ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`} />
            <button onClick={handleMax}
              className={`px-4 h-10 rounded-xl text-xs font-bold
                ${isDark ? 'bg-gray-800 text-yellow-500' : 'bg-gray-100 text-yellow-600'}`}>
              Max
            </button>
          </div>
          <p className={`text-[10px] mt-1 ${t.text.tertiary}`}>
            Total {owned.quantity} pcs. available
          </p>
        </div>

        <div className="flex justify-between items-center">
          <span className={`text-xs font-bold ${t.text.primary}`}>Summary:</span>
          <span className={`text-lg font-black text-red-400`}>{formatCurrency(totalValue)}</span>
        </div>

        <button onClick={handleSell} disabled={!canSell}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95
            ${canSell
              ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/20'
              : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
          Sell Shares
        </button>
      </div>
      <AdSpace />
    </div>
  );
}

export default StockSell;