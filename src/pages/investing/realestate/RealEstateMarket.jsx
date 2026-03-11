import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { PROPERTIES } from '../../../data/realEstate';
import { formatCurrency } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

function RealEstateMarket() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, ownedProperties } = useGame();
  const [filter, setFilter] = useState('expensive');

  const sorted = useMemo(() => {
    const list = [...PROPERTIES];
    return filter === 'expensive'
      ? list.sort((a, b) => b.price - a.price)
      : list.sort((a, b) => a.price - b.price);
  }, [filter]);

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/investing')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Real Estate Market</h1>
      </div>

      <div className="flex-shrink-0 px-4 py-2">
        <p className={`text-xs ${t.text.secondary}`}>
          Balance: <span className={`font-bold ${t.text.primary}`}>{formatCurrency(balance)}</span>
        </p>
      </div>

      <div className="flex-shrink-0 flex gap-1.5 px-3 pb-2">
        {['expensive', 'cheap'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all
              ${filter === f
                ? 'bg-green-500 text-white'
                : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
            {f === 'expensive' ? 'Expensive First' : 'Cheap First'}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-2 space-y-3">
        {sorted.map(prop => {
          const owned = ownedProperties.some(op => op.propertyId === prop.id);
          const canBuy = balance >= prop.price && !owned;

          return (
            <div key={prop.id} className={`rounded-xl overflow-hidden ${t.bg.card} border ${t.border.default}`}>
              {/* Image Area */}
              <div className={`h-32 flex items-center justify-center text-5xl
                ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                {prop.image}
              </div>
              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-lg font-black ${t.text.brand}`}>{formatCurrency(prop.price)}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <p className={`text-[10px] ${t.text.tertiary}`}>{prop.country} {prop.location}</p>
                    </div>
                  </div>
                  {owned ? (
                    <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-green-500/15 text-green-500">
                      Owned
                    </span>
                  ) : (
                    <button onClick={() => navigate(`/investing/realestate/buy/${prop.id}`)}
                      disabled={!canBuy}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95
                        ${canBuy
                          ? 'bg-green-500 text-white'
                          : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
                      {canBuy ? 'Buy' : "Can't Afford"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <AdSpace />
    </div>
  );
}

export default RealEstateMarket;