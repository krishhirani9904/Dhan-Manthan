import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Coins } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { CRYPTOCURRENCIES, getSimulatedCryptoPrice, getCryptoPriceChange } from '../../data/cryptoData';
import { formatCurrency } from '../../utils/formatCurrency';

function CryptoTab() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedCrypto, priceSeed } = useGame();

  const totalValue = ownedCrypto.reduce((sum, oc) => {
    const def = CRYPTOCURRENCIES.find(c => c.id === oc.cryptoId);
    if (!def) return sum;
    return sum + (getSimulatedCryptoPrice(def, priceSeed) * oc.quantity);
  }, 0);

  const totalInvested = ownedCrypto.reduce((sum, oc) => sum + (oc.avgBuyPrice * oc.quantity), 0);
  const totalProfit = totalValue - totalInvested;
  const profitPct = totalInvested > 0 ? ((totalProfit / totalInvested) * 100) : 0;
  const isProfit = totalProfit >= 0;

  return (
    <div className="px-3 pb-4 space-y-3">
      {/* Total Value */}
      <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
        <p className={`text-[10px] mb-1 ${t.text.tertiary}`}>Total Cryptocurrency Value</p>
        <p className={`text-3xl font-black ${t.text.primary}`}>{formatCurrency(totalValue)}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          {isProfit
            ? <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
          <span className={`text-xs font-bold ${isProfit ? 'text-green-500' : 'text-red-400'}`}>
            {isProfit ? '+' : ''}{formatCurrency(totalProfit)}
            {' '}({isProfit ? '+' : ''}{profitPct.toFixed(2)}%)
          </span>
        </div>
        <div className="flex justify-end mt-3">
          <button onClick={() => navigate('/investing/crypto/exchange')}
            className="px-4 py-2 rounded-xl text-xs font-bold
              bg-gradient-to-r from-green-500 to-emerald-500 text-white
              shadow-lg shadow-green-500/20 active:scale-95 transition-all">
            Buy
          </button>
        </div>
      </div>

      {/* Owned Coins */}
      <div>
        <p className={`text-sm font-bold mb-2 ${t.text.primary}`}>Coins</p>
        {ownedCrypto.length === 0 ? (
          <div className={`rounded-xl p-6 text-center ${t.bg.card} border ${t.border.default}`}>
            <Coins className={`w-10 h-10 mx-auto mb-2 ${t.text.tertiary}`} />
            <p className={`text-xs ${t.text.secondary}`}>You don't own cryptocurrency</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>Buy some from the exchange</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ownedCrypto.map(oc => {
              const def = CRYPTOCURRENCIES.find(c => c.id === oc.cryptoId);
              if (!def) return null;
              const currentPrice = getSimulatedCryptoPrice(def, priceSeed);
              const currentValue = currentPrice * oc.quantity;
              const invested = oc.avgBuyPrice * oc.quantity;
              const profit = currentValue - invested;
              const pct = invested > 0 ? ((profit / invested) * 100) : 0;
              const up = profit >= 0;

              return (
                <button key={oc.cryptoId}
                  onClick={() => navigate(`/investing/crypto/detail/${oc.cryptoId}`)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl
                    text-left transition-all active:scale-[0.98]
                    ${t.bg.card} border ${t.border.default} hover:border-green-500/30`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${def.color} text-white font-bold text-sm`}>
                      {def.icon}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${t.text.primary}`}>{def.name}</p>
                      <p className={`text-[10px] ${t.text.tertiary}`}>
                        {oc.quantity} {def.ticker}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold ${t.text.primary}`}>
                      {formatCurrency(currentValue)}
                    </p>
                    <div className="flex items-center justify-end gap-0.5">
                      {up ? <TrendingUp className="w-2.5 h-2.5 text-green-500" />
                        : <TrendingDown className="w-2.5 h-2.5 text-red-400" />}
                      <span className={`text-[9px] font-bold ${up ? 'text-green-500' : 'text-red-400'}`}>
                        {up ? '+' : ''}{pct.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CryptoTab;