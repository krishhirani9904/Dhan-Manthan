import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { CRYPTOCURRENCIES, getSimulatedCryptoPrice, getCryptoPriceChange, getAvailableCrypto } from '../../../data/cryptoData';
import { formatCurrency, formatNumber } from '../../../utils/formatCurrency';
import PriceChart from '../../../components/investing/PriceChart';
import AdSpace from '../../../components/common/AdSpace';

function CryptoDetail() {
  const { cryptoId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedCrypto, priceSeed } = useGame();

  const crypto = CRYPTOCURRENCIES.find(c => c.id === cryptoId);
  if (!crypto) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Cryptocurrency not found</p>
        <button onClick={() => navigate('/investing')}
          className="mt-3 text-yellow-500 underline text-sm">Go back</button>
      </div>
    );
  }

  // FIXED: Safe back navigation
  const handleBack = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate('/investing');
  };

  const owned = ownedCrypto.find(c => c.cryptoId === cryptoId);
  const currentPrice = getSimulatedCryptoPrice(crypto, priceSeed);
  const { change, pct, isUp } = getCryptoPriceChange(crypto, priceSeed);
  const available = getAvailableCrypto(crypto, ownedCrypto);

  const ownedQty = owned ? owned.quantity : 0;
  const totalValue = currentPrice * ownedQty;
  const invested = owned ? owned.avgBuyPrice * ownedQty : 0;
  const profit = totalValue - invested;

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
          <div className={`w-16 h-16 rounded-full flex items-center justify-center
            ${crypto.color} text-white font-bold text-2xl mb-2`}>
            {crypto.icon}
          </div>
          <p className={`text-lg font-bold ${t.text.primary}`}>{crypto.name}</p>
          {owned ? (
            <>
              <p className={`text-sm ${t.text.secondary}`}>{ownedQty} {crypto.ticker}</p>
              <p className={`text-2xl font-black ${t.text.primary} mt-1`}>{formatCurrency(totalValue)}</p>
            </>
          ) : (
            <p className={`text-2xl font-black ${t.text.primary} mt-1`}>{formatCurrency(currentPrice)}</p>
          )}
          <div className="flex items-center gap-1 mt-1">
            {isUp ? <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
            <span className={`text-xs font-bold ${isUp ? 'text-green-500' : 'text-red-400'}`}>
              {isUp ? '+' : ''}{formatCurrency(Math.abs(change))} ({pct.toFixed(2)}%)
            </span>
          </div>
        </div>

        <PriceChart seed={priceSeed + crypto.id.length * 200} volatility={crypto.volatility} height={140} />

        {owned ? (
          <div className="flex gap-2">
            <button onClick={() => navigate(`/investing/crypto/sell/${cryptoId}`)}
              className="flex-1 py-3 rounded-xl text-sm font-bold
                bg-gradient-to-r from-red-500 to-rose-500 text-white active:scale-95">
              Sell
            </button>
            <button onClick={() => navigate(`/investing/crypto/buy/${cryptoId}`)}
              className="flex-1 py-3 rounded-xl text-sm font-bold
                bg-gradient-to-r from-green-500 to-emerald-500 text-white active:scale-95">
              Buy More
            </button>
          </div>
        ) : (
          <button onClick={() => navigate(`/investing/crypto/buy/${cryptoId}`)}
            className="w-full py-3 rounded-xl text-sm font-bold
              bg-gradient-to-r from-green-500 to-emerald-500 text-white active:scale-95">
            Buy
          </button>
        )}

        <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default} space-y-3`}>
          <p className={`text-sm font-bold ${t.text.primary}`}>Details</p>
          <div className="flex justify-between">
            <span className={`text-xs ${t.text.secondary}`}>Current Price</span>
            <span className={`text-xs font-bold ${t.text.primary}`}>{formatCurrency(currentPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-xs ${t.text.secondary}`}>Cryptocurrency Capitalization</span>
            <span className={`text-xs font-bold ${t.text.primary}`}>{formatCurrency(crypto.capitalization)}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-xs ${t.text.secondary}`}>Available for Purchase</span>
            <span className={`text-xs font-bold ${t.text.primary}`}>
              {formatNumber(available)} {crypto.ticker}
            </span>
          </div>
        </div>
      </div>
      <AdSpace />
    </div>
  );
}

export default CryptoDetail;