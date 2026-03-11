import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { AIRCRAFT_DESIGN_OPTIONS } from '../../data/itemsData';
import { AIRCRAFT_SELL_PERCENT } from '../../config/constants';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';

function AircraftDetail() {
  const { aircraftId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedAircraft, sellAircraft } = useGame();
  const ac = (ownedAircraft || []).find(a => a.id === aircraftId);

  if (!ac) return <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}><p className={t.text.secondary}>Not found</p></div>;

  const design = AIRCRAFT_DESIGN_OPTIONS.find(d => d.id === ac.designType) || AIRCRAFT_DESIGN_OPTIONS[0];
  const salePrice = Math.floor(ac.totalPrice * AIRCRAFT_SELL_PERCENT);

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/items/hangar')} className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4">
        <p className={`text-xl font-bold ${t.text.primary}`}>{ac.name}</p>
        <p className={`text-xs ${t.text.secondary}`}>Purchase Price: <span className={`font-bold ${t.text.brand}`}>{formatCurrency(ac.totalPrice)}</span></p>
        <div className={`h-40 rounded-xl flex items-center justify-center text-7xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>{ac.image}</div>
        <p className={`text-xs font-bold ${t.text.secondary}`}>Options</p>
        <div className="grid grid-cols-2 gap-2">
          <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <p className={`text-[10px] ${t.text.tertiary}`}>Team</p>
            <p className={`text-sm font-bold ${t.text.primary}`}>{ac.teamHired ? 'Hired' : 'No Team'}</p>
          </div>
          <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <p className={`text-[10px] ${t.text.tertiary}`}>Design</p>
            <p className={`text-sm font-bold ${t.text.primary}`}>{design.name}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${t.text.secondary}`}>Sale Price:</span>
          <span className="text-lg font-bold text-red-400">{formatCurrency(salePrice)}</span>
        </div>
        <button onClick={() => { sellAircraft(ac.id); navigate('/items/hangar'); }}
          className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-red-500 to-rose-500 text-white active:scale-95">
          Sell — {formatCurrency(salePrice)}
        </button>
      </div>
      <AdSpace />
    </div>
  );
}

export default AircraftDetail;