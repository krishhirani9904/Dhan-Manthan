import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { CRYPTOCURRENCIES, getSimulatedCryptoPrice, getCryptoPriceChange } from '../../../data/cryptoData';
import { formatCurrency } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

const FILTERS = [
  { id: 'hot', label: 'Hot' },
  { id: 'gainers', label: 'Gainers' },
  { id: 'losers', label: 'Losers' },
  { id: 'high_cap', label: 'Highest Cap' },
  { id: 'low_cap', label: 'Lowest Cap' },
  { id: 'high_price', label: 'Highest Price' },
  { id: 'low_price', label: 'Lowest Price' },
];

function CryptoExchange() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { priceSeed, ownedCrypto } = useGame();
  const [filter, setFilter] = useState('hot');

  const sorted = useMemo(() => {
    const list = CRYPTOCURRENCIES.map(c => ({
      ...c,
      currentPrice: getSimulatedCryptoPrice(c, priceSeed),
      ...getCryptoPriceChange(c, priceSeed),
    }));
    switch (filter) {
      case 'hot': return list.sort((a, b) => b.volatility - a.volatility);
      case 'gainers': return list.sort((a, b) => b.pct - a.pct);
      case 'losers': return list.sort((a, b) => a.pct - b.pct);
      case 'high_cap': return list.sort((a, b) => b.capitalization - a.capitalization);
      case 'low_cap': return list.sort((a, b) => a.capitalization - b.capitalization);
      case 'high_price': return list.sort((a, b) => b.currentPrice - a.currentPrice);
      case 'low_price': return list.sort((a, b) => a.currentPrice - b.currentPrice);
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
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Crypto Exchange</h1>
      </div>

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
        {sorted.map(crypto => (
          <button key={crypto.id}
            onClick={() => navigate(`/investing/crypto/detail/${crypto.id}`)}
            className={`w-full flex items-center justify-between p-3 rounded-xl
              text-left transition-all active:scale-[0.98]
              ${t.bg.card} border ${t.border.default}`}>
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
              <p className={`text-xs font-bold ${t.text.primary}`}>{formatCurrency(crypto.currentPrice)}</p>
              <div className="flex items-center justify-end gap-0.5">
                {crypto.isUp ? <TrendingUp className="w-2.5 h-2.5 text-green-500" />
                  : <TrendingDown className="w-2.5 h-2.5 text-red-400" />}
                <span className={`text-[9px] font-bold ${crypto.isUp ? 'text-green-500' : 'text-red-400'}`}>
                  {crypto.pct.toFixed(2)}%
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
      <AdSpace />
    </div>
  );
}

export default CryptoExchange;