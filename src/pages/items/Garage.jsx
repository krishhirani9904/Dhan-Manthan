import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { ENGINE_TYPES, EQUIPMENT_OPTIONS } from '../../data/itemsData';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';

function Garage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedCars } = useGame();
  const [filter, setFilter] = useState('expensive');

  const cars = ownedCars || [];

  const sorted = useMemo(() => {
    const list = [...cars];
    return filter === 'expensive'
      ? list.sort((a, b) => b.totalPrice - a.totalPrice)
      : list.sort((a, b) => a.totalPrice - b.totalPrice);
  }, [cars, filter]);

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/items')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Garage</h1>
      </div>

      {cars.length > 0 && (
        <div className="flex-shrink-0 flex gap-1.5 px-3 py-2">
          {['expensive', 'cheap'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all
                ${filter === f ? 'bg-red-500 text-white' : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              {f === 'expensive' ? 'Expensive First' : 'Cheap First'}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-2 space-y-2">
        {sorted.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <Car className={`w-12 h-12 mb-3 ${t.text.tertiary}`} />
            <p className={`text-sm font-bold ${t.text.secondary}`}>Garage is empty</p>
            <p className={`text-xs mt-1 ${t.text.tertiary} text-center max-w-xs`}>
              Visit a car dealership to purchase a personal automobile
            </p>
            <button onClick={() => navigate('/items/car-showroom')}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white active:scale-95">
              Car Showroom
            </button>
          </div>
        ) : (
          sorted.map(car => {
            const engine = ENGINE_TYPES.find(e => e.id === car.engineType) || ENGINE_TYPES[0];
            const equip = EQUIPMENT_OPTIONS.find(e => e.id === car.equipmentType) || EQUIPMENT_OPTIONS[0];
            return (
              <button key={car.id} onClick={() => navigate(`/items/car/${car.id}`)}
                className={`w-full rounded-xl p-4 text-center transition-all active:scale-[0.98]
                  ${t.bg.card} border ${t.border.default}`}>
                <span className="text-5xl block mb-2">{car.image}</span>
                <p className={`text-sm font-bold ${t.text.primary}`}>{car.name}</p>
                <p className={`text-[10px] ${t.text.tertiary} mt-1`}>
                  {engine.name} | {equip.name}
                </p>
              </button>
            );
          })
        )}
      </div>
      <AdSpace />
    </div>
  );
}

export default Garage;