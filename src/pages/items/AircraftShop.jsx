// AircraftShop.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { AIRCRAFT } from '../../data/itemsData';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';
import ItemImage from '../../components/common/ItemImage';

function AircraftShop() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance } = useGame();

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <div className={`flex-shrink-0 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/items')} className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
          </button>
          <h1 className={`text-lg font-bold ${t.text.primary}`}>Aircraft Shop</h1>
        </div>
        <p className={`text-xs mt-1 ${t.text.secondary}`}>Balance: <span className={`font-bold ${t.text.primary}`}>{formatCurrency(balance)}</span></p>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-2">
        {AIRCRAFT.map(ac => (
          <button key={ac.id} onClick={() => navigate(`/items/aircraft-buy/${ac.id}`)}
            className={`w-full rounded-xl p-3 text-left transition-all active:scale-[0.98] ${t.bg.card} border ${t.border.default}`}>
            <p className={`text-sm font-bold ${t.text.primary}`}>{ac.name}</p>
            <p className={`text-xs ${t.text.tertiary}`}>Price from <span className={`font-bold ${t.text.brand}`}>{formatCurrency(ac.price)}</span></p>
            {/* <div className="text-center text-4xl mt-2">{ac.image}</div> */}

            {/* <div className="flex justify-center mt-2">{ac.isEmoji ? (<span className="text-4xl">{ac.image}</span>) : (<img src={ac.image} alt={ac.name} className="w-16 h-16 object-contain" />)} </div> */}
            <div className="h-20 flex items-center justify-center mt-2">
  <ItemImage
    image={ac.image}
    alt={ac.name}
    className="text-4xl"
  />
</div>
          </button>
        ))}
      </div>
      <AdSpace />
    </div>
  );
}

export default AircraftShop;