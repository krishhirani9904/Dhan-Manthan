import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { ISLANDS, ISLAND_SELL_LOSS_PERCENT } from '../../data/islandsData';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';

function IslandsPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, ownedIslands, buyIsland, sellIsland } = useGame();
  const [tab, setTab] = useState('offers');
  const owned = ownedIslands || [];
  const ownedIds = owned.map(o => o.islandId);

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <div className={`flex-shrink-0 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/items')} className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
          </button>
          <h1 className={`text-lg font-bold ${t.text.primary}`}>Islands</h1>
        </div>
        <p className={`text-xs mt-1 ${t.text.secondary}`}>Balance: <span className={`font-bold ${t.text.primary}`}>{formatCurrency(balance)}</span></p>
      </div>

      <div className="flex-shrink-0 px-3 py-2">
        <div className={`flex rounded-xl p-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {['offers', 'myislands'].map(tb => (
            <button key={tb} onClick={() => setTab(tb)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tab === tb ? 'bg-green-500 text-white' : t.text.secondary}`}>
              {tb === 'offers' ? 'Offers' : 'My Islands'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-2 space-y-3">
        {tab === 'offers' ? (
          ISLANDS.filter(i => !ownedIds.includes(i.id)).map(island => {
            const canBuy = balance >= island.price;
            return (
              <div key={island.id} className={`rounded-xl overflow-hidden ${t.bg.card} border ${t.border.default}`}>
                <div className={`h-32 flex items-center justify-center gap-2 text-4xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  {island.images.map((img, i) => <span key={i}>{img}</span>)}
                </div>
                <div className="p-3">
                  <p className={`text-sm font-bold text-center ${t.text.primary}`}>{island.name}</p>
                  <p className={`text-[10px] text-center ${t.text.tertiary} mt-1`}>{island.desc}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-sm font-bold ${t.text.brand}`}>{formatCurrency(island.price)}</p>
                    <button onClick={() => { if (canBuy) buyIsland(island.id, island.price); }}
                      disabled={!canBuy}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95
                        ${canBuy ? 'bg-green-500 text-white' : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
                      {canBuy ? 'Buy' : "Can't Afford"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          owned.length === 0 ? (
            <p className={`text-center py-10 text-sm ${t.text.secondary}`}>No islands owned yet</p>
          ) : (
            owned.map(oi => {
              const island = ISLANDS.find(i => i.id === oi.islandId);
              if (!island) return null;
              const sellPrice = Math.floor(oi.purchasePrice * (1 - ISLAND_SELL_LOSS_PERCENT));
              return (
                <div key={oi.islandId} className={`rounded-xl overflow-hidden ${t.bg.card} border ${t.border.default}`}>
                  <div className={`h-28 flex items-center justify-center gap-2 text-4xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {island.images.map((img, i) => <span key={i}>{img}</span>)}
                  </div>
                  <div className="p-3">
                    <p className={`text-sm font-bold ${t.text.primary}`}>{island.name}</p>
                    <p className={`text-[10px] ${t.text.tertiary}`}>Can be used as harbor</p>
                    <p className={`text-[10px] ${t.text.tertiary} mt-1`}>Sell at {((1 - ISLAND_SELL_LOSS_PERCENT) * 100).toFixed(0)}%: {formatCurrency(sellPrice)}</p>
                    <button onClick={() => sellIsland(oi.islandId)}
                      className="w-full mt-2 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-500 to-rose-500 text-white active:scale-95">
                      Sell — {formatCurrency(sellPrice)}
                    </button>
                  </div>
                </div>
              );
            })
          )
        )}
      </div>
      <AdSpace />
    </div>
  );
}

export default IslandsPage;