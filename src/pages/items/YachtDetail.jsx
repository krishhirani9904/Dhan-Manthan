import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { YACHT_DESIGN_OPTIONS, YACHT_LOCATIONS } from '../../data/itemsData';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';

function YachtDetail() {
  const { yachtId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedYachts, sellYacht, updateYachtLocation } = useGame();
  const yacht = (ownedYachts || []).find(y => y.id === yachtId);
  const [showLocations, setShowLocations] = useState(false);

  if (!yacht) return <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}><p className={t.text.secondary}>Not found</p></div>;

  const design = YACHT_DESIGN_OPTIONS.find(d => d.id === yacht.designType) || YACHT_DESIGN_OPTIONS[0];
  const location = YACHT_LOCATIONS.find(l => l.id === yacht.locationId) || YACHT_LOCATIONS[0];
  const salePrice = Math.floor(yacht.totalPrice * 0.70);

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <div className="relative">
        <div className={`h-48 flex items-center justify-center text-8xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>{yacht.image}</div>
        <button onClick={() => navigate('/items/harbor')}
          className="absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4">
        <p className={`text-xl font-bold ${t.text.primary}`}>{yacht.name}</p>
        <p className={`text-xs font-bold ${t.text.secondary}`}>Options</p>
        <div className="grid grid-cols-2 gap-2">
          <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <p className={`text-[10px] ${t.text.tertiary}`}>Team</p>
            <p className={`text-sm font-bold ${t.text.primary}`}>{yacht.teamHired ? 'Hired' : 'No Team'}</p>
          </div>
          <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <p className={`text-[10px] ${t.text.tertiary}`}>Design</p>
            <p className={`text-sm font-bold ${t.text.primary}`}>{design.name}</p>
          </div>
        </div>

        {/* Location */}
        <div>
          <p className={`text-xs font-bold mb-2 ${t.text.primary}`}>Yacht Location:</p>
          <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{location.image}</span>
              <div className="flex-1">
                <p className={`text-sm font-bold ${t.text.primary}`}>{location.name}</p>
                <button onClick={() => setShowLocations(!showLocations)} className={`text-[10px] font-bold ${t.text.brand}`}>
                  Edit →
                </button>
              </div>
            </div>
          </div>
          {showLocations && (
            <div className="mt-2 space-y-1.5">
              {YACHT_LOCATIONS.map(loc => (
                <button key={loc.id} onClick={() => { updateYachtLocation(yacht.id, loc.id); setShowLocations(false); }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all
                    ${yacht.locationId === loc.id ? 'bg-cyan-500/15 border border-cyan-500/30' : `${t.bg.card} border ${t.border.default}`}`}>
                  <span className="text-xl">{loc.image}</span>
                  <span className={`text-xs font-bold ${t.text.primary}`}>{loc.name}</span>
                  {yacht.locationId === loc.id && <span className="text-[10px] text-cyan-500 ml-auto">Current</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs ${t.text.secondary}`}>Price:</span>
          <span className="text-lg font-bold text-red-400">{formatCurrency(salePrice)}</span>
        </div>
        <p className={`text-[10px] ${t.text.tertiary}`}>Details: Sales Tax: 30%</p>
        <button onClick={() => { sellYacht(yacht.id); navigate('/items/harbor'); }}
          className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-red-500 to-rose-500 text-white active:scale-95">
          Sell — {formatCurrency(salePrice)}
        </button>
      </div>
      <AdSpace />
    </div>
  );
}

export default YachtDetail;