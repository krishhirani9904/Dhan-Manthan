import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ship } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { YACHT_DESIGN_OPTIONS, YACHT_LOCATIONS } from '../../data/itemsData';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';

function Harbor() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedYachts } = useGame();
  const [filter, setFilter] = useState('expensive');
  const list = ownedYachts || [];

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
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Harbor</h1>
      </div>
      {list.length > 0 && (
        <div className="flex-shrink-0 flex gap-1.5 px-3 py-2">
          {['expensive', 'cheap'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${filter === f ? 'bg-cyan-500 text-white' : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              {f === 'expensive' ? 'Expensive First' : 'Cheap First'}
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-2 space-y-2">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Ship className={`w-12 h-12 mb-3 ${t.text.tertiary}`} />
            <p className={`text-sm font-bold ${t.text.secondary}`}>Harbor is empty</p>
            <p className={`text-xs mt-1 ${t.text.tertiary} text-center`}>Visit a yacht shop</p>
            <button onClick={() => navigate('/items/yacht-shop')} className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-white active:scale-95">Yacht Shop</button>
          </div>
        ) : (
          sorted.map(yacht => {
            const design = YACHT_DESIGN_OPTIONS.find(d => d.id === yacht.designType) || YACHT_DESIGN_OPTIONS[0];
            return (
              <button key={yacht.id} onClick={() => navigate(`/items/yacht/${yacht.id}`)}
                className={`w-full rounded-xl overflow-hidden text-left transition-all active:scale-[0.98] ${t.bg.card} border ${t.border.default}`}>
                <div className={`h-28 flex items-center justify-center text-5xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>{yacht.image}</div>
                <div className="p-3">
                  <div className="flex gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} ${t.text.tertiary}`}>{design.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} ${t.text.tertiary}`}>{yacht.teamHired ? 'Team Hired' : 'No Team'}</span>
                  </div>
                  <p className={`text-sm font-bold text-center ${t.text.primary}`}>{yacht.name}</p>
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

export default Harbor;