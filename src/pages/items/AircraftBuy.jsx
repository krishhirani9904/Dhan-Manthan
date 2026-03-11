// AircraftBuy.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { AIRCRAFT, AIRCRAFT_TEAM_COST_PERCENT, AIRCRAFT_DESIGN_OPTIONS } from '../../data/itemsData';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';

function AircraftBuy() {
  const { aircraftId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, buyAircraft } = useGame();

  const ac = AIRCRAFT.find(a => a.id === aircraftId);
  const [teamHired, setTeamHired] = useState(false);
  const [design, setDesign] = useState('standard');

  if (!ac) return <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}><p className={t.text.secondary}>Not found</p></div>;

  const designDef = AIRCRAFT_DESIGN_OPTIONS.find(d => d.id === design);
  const teamCost = teamHired ? ac.price * AIRCRAFT_TEAM_COST_PERCENT : 0;
  const totalPrice = Math.floor((ac.price + teamCost) * designDef.priceMultiplier);
  const canBuy = balance >= totalPrice;

  const handleBuy = () => {
    if (!canBuy) return;
    buyAircraft({ acDefId: ac.id, name: ac.name, image: ac.image, basePrice: ac.price, teamHired, designType: design, totalPrice });
    navigate('/items/hangar');
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate(-1)} className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4">
        <p className={`text-lg font-bold ${t.text.primary}`}>{ac.name}</p>
        <p className={`text-xs ${t.text.secondary}`}>Price from: {formatCurrency(ac.price)}</p>
        <div className={`h-36 rounded-xl flex items-center justify-center text-6xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>{ac.image}</div>

        <p className={`text-[10px] ${t.text.tertiary}`}>Pilot, flight attendants, maintenance personnel</p>
        <button onClick={() => setTeamHired(!teamHired)}
          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all
            ${teamHired ? 'bg-blue-500 text-white' : `${t.bg.card} border ${t.border.default} ${t.text.secondary}`}`}>
          {teamHired ? '✓ Team Hired (+10%)' : 'Hire a Team +10%'}
        </button>

        <p className={`text-xs font-bold ${t.text.primary}`}>Design</p>
        <div className="grid grid-cols-2 gap-2">
          {AIRCRAFT_DESIGN_OPTIONS.map(d => (
            <button key={d.id} onClick={() => setDesign(d.id)}
              className={`py-2.5 rounded-xl text-[10px] font-bold text-center transition-all
                ${design === d.id ? 'bg-blue-500 text-white' : `${t.bg.card} border ${t.border.default} ${t.text.secondary}`}`}>
              {d.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold ${t.text.primary}`}>Summary:</span>
          <span className={`text-lg font-black ${t.text.brand}`}>{formatCurrency(totalPrice)}</span>
        </div>

        <button onClick={handleBuy} disabled={!canBuy}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95
            ${canBuy ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
          {canBuy ? 'Buy' : `Need ${formatCurrency(totalPrice - balance)}`}
        </button>
        <p className={`text-center text-[10px] ${t.text.tertiary}`}>Balance: {formatCurrency(balance)}</p>
      </div>
      <AdSpace />
    </div>
  );
}

export default AircraftBuy;
