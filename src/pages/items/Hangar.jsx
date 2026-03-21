import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { AIRCRAFT_DESIGN_OPTIONS } from '../../data/itemsData';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';
import ItemImage from '../../components/common/ItemImage';


function Hangar() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedAircraft } = useGame();
  const [filter, setFilter] = useState('expensive');
  const list = ownedAircraft || [];

  const sorted = useMemo(() => {
    const l = [...list];
    return filter === 'expensive' ? l.sort((a, b) => b.totalPrice - a.totalPrice) : l.sort((a, b) => a.totalPrice - b.totalPrice);
  }, [list, filter]);

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/items')} className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Hangar</h1>
      </div>

      {list.length > 0 && (
        <div className="flex-shrink-0 flex gap-1.5 px-3 py-2">
          {['expensive', 'cheap'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${filter === f ? 'bg-blue-500 text-white' : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              {f === 'expensive' ? 'Expensive First' : 'Cheap First'}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-2 space-y-2">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Plane className={`w-12 h-12 mb-3 ${t.text.tertiary}`} />
            <p className={`text-sm font-bold ${t.text.secondary}`}>Hangar is empty</p>
            <p className={`text-xs mt-1 ${t.text.tertiary} text-center`}>Visit an aircraft store to buy an air vehicle</p>
            <button onClick={() => navigate('/items/aircraft-shop')} className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-blue-500 text-white active:scale-95">Aircraft Shop</button>
          </div>
        ) : (
          sorted.map(ac => {
            const design = AIRCRAFT_DESIGN_OPTIONS.find(d => d.id === ac.designType) || AIRCRAFT_DESIGN_OPTIONS[0];
            return (
              <button key={ac.id} onClick={() => navigate(`/items/aircraft/${ac.id}`)}
                className={`w-full rounded-xl p-4 text-left transition-all active:scale-[0.98] ${t.bg.card} border ${t.border.default}`}>
                <p className={`text-sm font-bold text-center ${t.text.primary}`}>{ac.name}</p>
                <p className={`text-[10px] text-center ${t.text.tertiary} mt-1`}>
                  {ac.teamHired ? 'Team Hired' : 'No Team'} | {design.name}
                </p>
                {/* <div className="text-center text-5xl mt-2">{ac.image}</div> */}
                 {/* <div className="flex justify-center mt-2"> <ItemImage image={ac.image} alt={ac.name} className="text-5xl" imgClassName="h-20 w-auto object-contain" /> </div> */}
                 {/* ✅ Box size = h-24, image auto-fits */}
<div className="h-24 flex items-center justify-center mt-2">
  <ItemImage
    image={ac.image}
    alt={ac.name}
    className="text-5xl"
  />
</div>
              </button>
            );
          })
        )}
      </div>
      <AdSpace />
    </div>
  );
}

export default Hangar;