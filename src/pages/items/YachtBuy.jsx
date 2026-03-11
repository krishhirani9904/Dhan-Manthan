import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { YACHTS, YACHT_TEAM_COST_PERCENT, YACHT_DESIGN_OPTIONS, YACHT_LOCATIONS } from '../../data/itemsData';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';

function YachtBuy() {
  const { yachtId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, buyYacht } = useGame();

  const yacht = YACHTS.find(y => y.id === yachtId);
  const [teamHired, setTeamHired] = useState(false);
  const [design, setDesign] = useState('standard');
  const [locationId, setLocationId] = useState('public_harbor');
  const [showLocEdit, setShowLocEdit] = useState(false);

  if (!yacht) return <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}><p className={t.text.secondary}>Not found</p></div>;

  const designDef = YACHT_DESIGN_OPTIONS.find(d => d.id === design);
  const teamCost = teamHired ? yacht.price * YACHT_TEAM_COST_PERCENT : 0;
  const totalPrice = Math.floor((yacht.price + teamCost) * designDef.priceMultiplier);
  const canBuy = balance >= totalPrice;
  const loc = YACHT_LOCATIONS.find(l => l.id === locationId) || YACHT_LOCATIONS[0];

  const handleBuy = () => {
    if (!canBuy) return;
    buyYacht({ yachtDefId: yacht.id, name: yacht.name, image: yacht.image, basePrice: yacht.price, teamHired, designType: design, locationId, totalPrice });
    navigate('/items/harbor');
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <div className="relative">
        <div className={`h-44 flex items-center justify-center text-7xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>{yacht.image}</div>
        <button onClick={() => navigate(-1)} className="absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4">
        <p className={`text-lg font-bold ${t.text.primary}`}>{yacht.name}</p>
        <p className={`text-[10px] ${t.text.tertiary}`}>Captain, technicians, maintenance personnel</p>
        <button onClick={() => setTeamHired(!teamHired)}
          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${teamHired ? 'bg-cyan-500 text-white' : `${t.bg.card} border ${t.border.default} ${t.text.secondary}`}`}>
          {teamHired ? '✓ Team Hired (+15%)' : 'Hire a Team +15%'}
        </button>

        <p className={`text-xs font-bold ${t.text.primary}`}>Design</p>
        <div className="grid grid-cols-2 gap-2">
          {YACHT_DESIGN_OPTIONS.map(d => (
            <button key={d.id} onClick={() => setDesign(d.id)}
              className={`py-2.5 rounded-xl text-[10px] font-bold text-center transition-all ${design === d.id ? 'bg-cyan-500 text-white' : `${t.bg.card} border ${t.border.default} ${t.text.secondary}`}`}>
              {d.name}
            </button>
          ))}
        </div>

        <p className={`text-xs font-bold ${t.text.primary}`}>Yacht Location</p>
        <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{loc.image}</span>
            <div className="flex-1">
              <p className={`text-sm font-bold ${t.text.primary}`}>{loc.name}</p>
              <button onClick={() => setShowLocEdit(!showLocEdit)} className={`text-[10px] font-bold ${t.text.brand}`}>Edit →</button>
            </div>
          </div>
        </div>
        {showLocEdit && (
          <div className="space-y-1.5">
            {YACHT_LOCATIONS.map(l => (
              <button key={l.id} onClick={() => { setLocationId(l.id); setShowLocEdit(false); }}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left ${locationId === l.id ? 'bg-cyan-500/15 border border-cyan-500/30' : `${t.bg.card} border ${t.border.default}`}`}>
                <span className="text-xl">{l.image}</span>
                <span className={`text-xs font-bold ${t.text.primary}`}>{l.name}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold ${t.text.primary}`}>Summary:</span>
          <span className={`text-lg font-black ${t.text.brand}`}>{formatCurrency(totalPrice)}</span>
        </div>
        <button onClick={handleBuy} disabled={!canBuy}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${canBuy ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
          {canBuy ? 'Buy' : `Need ${formatCurrency(totalPrice - balance)}`}
        </button>
        <p className={`text-center text-[10px] ${t.text.tertiary}`}>Balance: {formatCurrency(balance)}</p>
      </div>
      <AdSpace />
    </div>
  );
}

export default YachtBuy;