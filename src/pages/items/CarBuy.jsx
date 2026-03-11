import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { CARS, ENGINE_TYPES, EQUIPMENT_OPTIONS } from '../../data/itemsData';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';

function CarBuy() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, buyCar } = useGame();

  const car = CARS.find(c => c.id === carId);
  const [engine, setEngine] = useState('df');
  const [equip, setEquip] = useState('standard');

  if (!car) return (
    <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
      <p className={t.text.secondary}>Car not found</p>
    </div>
  );

  const engineDef = ENGINE_TYPES.find(e => e.id === engine);
  const equipDef = EQUIPMENT_OPTIONS.find(e => e.id === equip);
  const totalPrice = Math.floor(car.price * engineDef.priceMultiplier * equipDef.priceMultiplier);
  const canBuy = balance >= totalPrice;

  const handleBuy = () => {
    if (!canBuy) return;
    buyCar({ carDefId: car.id, name: car.name, image: car.image, basePrice: car.price, engineType: engine, equipmentType: equip, totalPrice });
    navigate('/items/garage');
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate(-1)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`text-lg font-bold ${t.text.primary}`}>{car.name}</p>
            <p className={`text-xs ${t.text.secondary}`}>Price: {formatCurrency(car.price)}</p>
          </div>
        </div>

        <div className={`h-36 rounded-xl flex items-center justify-center text-6xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {car.image}
        </div>

        {/* Engine */}
        <div>
          <p className={`text-xs font-bold mb-2 ${t.text.primary}`}>Engine</p>
          <div className="grid grid-cols-3 gap-2">
            {ENGINE_TYPES.map(e => (
              <button key={e.id} onClick={() => setEngine(e.id)}
                className={`py-2.5 rounded-xl text-[10px] font-bold text-center transition-all
                  ${engine === e.id
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                    : `${t.bg.card} border ${t.border.default} ${t.text.secondary}`}`}>
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div>
          <p className={`text-xs font-bold mb-2 ${t.text.primary}`}>Equipment</p>
          <div className="grid grid-cols-2 gap-2">
            {EQUIPMENT_OPTIONS.map(e => (
              <button key={e.id} onClick={() => setEquip(e.id)}
                className={`py-2.5 rounded-xl text-[10px] font-bold text-center transition-all
                  ${equip === e.id
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                    : `${t.bg.card} border ${t.border.default} ${t.text.secondary}`}`}>
                {e.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold ${t.text.primary}`}>Summary:</span>
          <span className={`text-lg font-black ${t.text.brand}`}>{formatCurrency(totalPrice)}</span>
        </div>

        <button onClick={handleBuy} disabled={!canBuy}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95
            ${canBuy ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20'
              : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
          {canBuy ? 'Buy' : `Need ${formatCurrency(totalPrice - balance)}`}
        </button>

        <p className={`text-center text-[10px] ${t.text.tertiary}`}>Balance: {formatCurrency(balance)}</p>
      </div>
      <AdSpace />
    </div>
  );
}

export default CarBuy;