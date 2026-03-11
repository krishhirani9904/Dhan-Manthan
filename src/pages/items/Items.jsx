import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { COLLECTIONS, COLLECTION_KEYS } from '../../data/collectionsData';
import { INSIGNIAS } from '../../data/insigniasData';
import { NFTS } from '../../data/nftsData';

function Items() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const {
    ownedCars, ownedAircraft, ownedYachts, ownedCollections,
    ownedNFTs, ownedIslands
  } = useGame();
  const gameState = useGame();

  const cars = ownedCars || [];
  const aircraft = ownedAircraft || [];
  const yachts = ownedYachts || [];
  const islands = ownedIslands || [];
  const nfts = ownedNFTs || [];
  const collections = ownedCollections || {};

  const earnedInsignias = INSIGNIAS.filter(ins => ins.check(gameState));

  // Owned items boxes (top)
  const ownedBoxes = [
    { name: 'Garage', icon: '🚗', count: cars.length, path: '/items/garage', color: 'from-red-500 to-rose-600' },
    { name: 'Hangar', icon: '✈️', count: aircraft.length, path: '/items/hangar', color: 'from-blue-500 to-indigo-600' },
    { name: 'Harbor', icon: '🚢', count: yachts.length, path: '/items/harbor', color: 'from-cyan-500 to-teal-600' },
  ];

  // Buy options row (always visible)
  const buyOptions = [
    { name: 'Car Showroom', emoji: '🏪', path: '/items/car-showroom' },
    { name: 'Aircraft Shop', emoji: '🛫', path: '/items/aircraft-shop' },
    { name: 'Yacht Shop', emoji: '⚓', path: '/items/yacht-shop' },
  ];

  return (
    <div className="h-full w-full flex flex-col gap-3 px-3 py-2 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center
          ${isDark ? 'bg-purple-500/15' : 'bg-purple-50'}`}>
          <ShoppingBag className="w-5 h-5 text-purple-500" />
        </div>
        <h2 className={`text-lg font-extrabold ${t.text.primary}`}>Items</h2>
      </div>

      {/* Owned Items - 3 boxes */}
      <div className="flex gap-2">
        {ownedBoxes.map(box => (
          <button key={box.name} onClick={() => navigate(box.path)}
            className={`flex-1 rounded-xl overflow-hidden bg-gradient-to-br ${box.color}
              p-3 text-center transition-all active:scale-95 shadow-lg`}>
            <span className="text-3xl block mb-1">{box.icon}</span>
            <p className="text-white text-xs font-bold">{box.name}</p>
            {box.count > 0 && (
              <p className="text-white/70 text-[10px] mt-0.5">{box.count} owned</p>
            )}
          </button>
        ))}
      </div>

      {/* Buy Options - Always visible row with 3 partitions */}
      <div className="flex gap-2">
        {buyOptions.map(shop => (
          <button key={shop.name} onClick={() => navigate(shop.path)}
            className={`flex-1 rounded-xl p-3 text-center transition-all active:scale-95
              ${t.bg.card} border ${t.border.default} hover:border-yellow-500/30`}>
            <span className="text-2xl block mb-1">{shop.emoji}</span>
            <p className={`text-[10px] font-bold ${t.text.primary}`}>{shop.name}</p>
          </button>
        ))}
      </div>

      {/* Collections */}
      <div>
        <p className={`text-sm font-bold mb-2 ${t.text.primary}`}>Collections</p>
        <div className="grid grid-cols-3 gap-2">
          {COLLECTION_KEYS.map(key => {
            const col = COLLECTIONS[key];
            const owned = (collections[key] || []).length;
            return (
              <button key={key} onClick={() => navigate(`/items/collection/${key}`)}
                className={`rounded-xl p-3 text-center transition-all active:scale-95
                  ${t.bg.card} border ${t.border.default}`}>
                <span className="text-2xl block mb-1">{col.image}</span>
                <p className={`text-[10px] font-bold ${t.text.primary}`}>{col.name}</p>
                <p className={`text-[9px] ${t.text.tertiary}`}>{owned}/{col.total}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Other Items */}
      {[
        { name: 'Insignias', emoji: '🏅', count: `${earnedInsignias.length}/${INSIGNIAS.length}`, path: '/items/insignias' },
        { name: 'NFTs', emoji: '🎭', count: `${nfts.length}/${NFTS.length}`, path: '/items/nfts' },
        { name: 'Islands', emoji: '🏝️', count: `${islands.length} owned`, path: '/items/islands' },
      ].map(item => (
        <button key={item.name} onClick={() => navigate(item.path)}
          className={`rounded-xl p-4 flex items-center gap-3 transition-all active:scale-[0.98]
            ${t.bg.card} border ${t.border.default}`}>
          <span className="text-3xl">{item.emoji}</span>
          <div className="flex-1 text-left">
            <p className={`text-sm font-bold ${t.text.primary}`}>{item.name}</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>{item.count}</p>
          </div>
          <ChevronRight className={`w-4 h-4 ${t.text.tertiary}`} />
        </button>
      ))}

      <div className="h-2" />
    </div>
  );
}

export default Items;