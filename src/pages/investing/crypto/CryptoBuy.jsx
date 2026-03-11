import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { CRYPTOCURRENCIES, getSimulatedCryptoPrice, getCryptoPriceChange, getAvailableCrypto } from '../../../data/cryptoData';
import { formatCurrency, formatNumber } from '../../../utils/formatCurrency';
import PageHeader from '../../../components/common/PageHeader';
import AdSpace from '../../../components/common/AdSpace';

function CryptoBuy() {
  const { cryptoId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, priceSeed, buyCrypto, ownedCrypto } = useGame();

  const crypto = CRYPTOCURRENCIES.find(c => c.id === cryptoId);
  const [qtyStr, setQtyStr] = useState('1');
  const [buying, setBuying] = useState(false);
  const buyingRef = useRef(false);

  useEffect(() => { return () => { buyingRef.current = false; }; }, []);

  if (!crypto) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const currentPrice = getSimulatedCryptoPrice(crypto, priceSeed);
  const { pct, isUp } = getCryptoPriceChange(crypto, priceSeed);
  const available = getAvailableCrypto(crypto, ownedCrypto);
  const qty = parseFloat(qtyStr) || 0;
  const minBuy = crypto.minBuy || 0.0001;

  // FIXED: Floor max to prevent overspend
  const rawMax = Math.floor((balance / currentPrice) * 10000) / 10000;
  const maxBuyable = Math.min(available, rawMax);

  // FIXED: Round UP cost to prevent free purchases
  const rawCost = qty * currentPrice;
  const totalCost = Math.ceil(rawCost);
  const canBuy = balance >= totalCost && qty >= minBuy && qty <= available && rawCost >= 1 && !buying;

  const handleBuy = () => {
    if (!canBuy || buyingRef.current) return;
    buyingRef.current = true;
    setBuying(true);
    buyCrypto(cryptoId, qty, currentPrice);
    setTimeout(() => navigate(-1), 200);
  };

  const handleMax = () => setQtyStr(maxBuyable.toString());

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <PageHeader title="Buying Cryptocurrency" backTo="/investing" />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4">
        <p className={`text-xs ${t.text.secondary}`}>
          Balance: <span className={`font-bold ${t.text.primary}`}>{formatCurrency(balance)}</span>
        </p>

        <div className={`flex items-center justify-between p-3 rounded-xl ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center
              ${crypto.color} text-white font-bold text-xs`}>
              {crypto.icon}
            </div>
            <div>
              <p className={`text-xs font-bold ${t.text.primary}`}>{crypto.name}</p>
              <p className={`text-[10px] ${t.text.tertiary}`}>Available</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xs font-bold ${t.text.primary}`}>{formatCurrency(currentPrice)}</p>
            <div className="flex items-center justify-end gap-0.5">
              {isUp ? <TrendingUp className="w-2.5 h-2.5 text-green-500" />
                : <TrendingDown className="w-2.5 h-2.5 text-red-400" />}
              <span className={`text-[9px] font-bold ${isUp ? 'text-green-500' : 'text-red-400'}`}>
                {pct.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className={`text-xs font-bold mb-2 ${t.text.primary}`}>Quantity:</p>
          <div className="flex items-center gap-2">
            <input type="number" value={qtyStr} step={minBuy}
              onChange={(e) => setQtyStr(e.target.value)}
              onBlur={() => {
                const v = parseFloat(qtyStr);
                if (isNaN(v) || v < minBuy) setQtyStr(String(minBuy));
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
            min: {minBuy} • max: {maxBuyable}
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
          {buying ? 'Processing...' : canBuy ? 'Buy Cryptocurrency' : `Need ${formatCurrency(Math.max(0, totalCost - balance))}`}
        </button>
      </div>
      <AdSpace />
    </div>
  );
}

export default CryptoBuy;