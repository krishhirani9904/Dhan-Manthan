import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { CARS } from '../../data/itemsData';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';

function CarShowroom() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance } = useGame();

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <div className={`flex-shrink-0 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/items')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
          </button>
          <h1 className={`text-lg font-bold ${t.text.primary}`}>Car Showroom</h1>
        </div>
        <p className={`text-xs mt-1 ${t.text.secondary}`}>
          Balance: <span className={`font-bold ${t.text.primary}`}>{formatCurrency(balance)}</span>
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-2">
        {CARS.map(car => (
          <button key={car.id} onClick={() => navigate(`/items/car-buy/${car.id}`)}
            className={`w-full rounded-xl p-3 flex items-center justify-between text-left
              transition-all active:scale-[0.98] ${t.bg.card} border ${t.border.default}`}>
            <div>
              <p className={`text-sm font-bold ${t.text.primary}`}>{car.name}</p>
              <p className={`text-xs ${t.text.tertiary} mt-0.5`}>
                Price from <span className={`font-bold ${t.text.brand}`}>{formatCurrency(car.price)}</span>
              </p>
            </div>
            <span className="text-4xl">{car.image}</span>
          </button>
        ))}
      </div>
      <AdSpace />
    </div>
  );
}

export default CarShowroom;
