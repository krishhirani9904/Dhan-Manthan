import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { PROPERTIES, PROPERTY_IMPROVEMENTS, getPropertyMarketValue } from '../../../data/realEstate';
import { formatCurrency } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

const FILTERS = [
  { id: 'expensive', label: 'Expensive First' },
  { id: 'cheap', label: 'Cheap First' },
  { id: 'improvable', label: 'Improvement Available' },
  { id: 'improved', label: 'Fully Improved' },
];

function OwnedProperties() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedProperties } = useGame();
  const [filter, setFilter] = useState('expensive');

  const enriched = useMemo(() => {
    return ownedProperties.map(op => {
      const prop = PROPERTIES.find(p => p.id === op.propertyId);
      const allImprovements = PROPERTY_IMPROVEMENTS[op.propertyId] || [];
      const done = op.improvements || [];
      const remaining = allImprovements.length - done.length;
      const hasImprovementsDefined = allImprovements.length > 0;
      const marketValue = getPropertyMarketValue(op.propertyId, done);
      return { ...op, prop, allImprovements, done, remaining, hasImprovementsDefined, marketValue };
    }).filter(op => op.prop);
  }, [ownedProperties]);

  const sorted = useMemo(() => {
    let list = [...enriched];
    switch (filter) {
      case 'expensive': return list.sort((a, b) => b.marketValue - a.marketValue);
      case 'cheap': return list.sort((a, b) => a.marketValue - b.marketValue);
      case 'improvable': return list.filter(p => p.remaining > 0);
      // FIXED: Only show as "fully improved" if improvements exist AND all done
      case 'improved': return list.filter(p => p.hasImprovementsDefined && p.remaining === 0);
      default: return list;
    }
  }, [enriched, filter]);

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/investing')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>My Property</h1>
      </div>

      <div className="flex-shrink-0 px-3 py-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 min-w-max">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all
                ${filter === f.id
                  ? 'bg-green-500 text-white'
                  : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-2 space-y-3">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Home className={`w-12 h-12 mb-3 ${t.text.tertiary}`} />
            <p className={`text-sm font-medium ${t.text.secondary}`}>
              {filter === 'improvable' ? 'No improvable properties' :
               filter === 'improved' ? 'No fully improved properties' : 'No properties owned'}
            </p>
          </div>
        ) : (
          sorted.map(item => (
            <button key={item.propertyId}
              onClick={() => navigate(`/investing/realestate/detail/${item.propertyId}`)}
              className={`w-full rounded-xl overflow-hidden text-left transition-all active:scale-[0.98]
                ${t.bg.card} border ${t.border.default}`}>
              <div className={`relative h-28 flex items-center justify-center text-4xl
                ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                {item.prop.image}
                {item.hasImprovementsDefined && item.remaining > 0 && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full
                    bg-yellow-500 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">{item.remaining}</span>
                  </div>
                )}
                {item.hasImprovementsDefined && item.remaining === 0 && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full
                    bg-green-500 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">✓</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className={`text-sm font-bold ${t.text.brand}`}>{formatCurrency(item.marketValue)}</p>
                <p className={`text-[10px] ${t.text.tertiary}`}>{item.prop.country} {item.prop.location}</p>
                {item.done.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {item.done.map(impId => {
                      const imp = item.allImprovements.find(i => i.id === impId);
                      return imp ? <span key={impId} className="text-xs">{imp.icon}</span> : null;
                    })}
                  </div>
                )}
              </div>
            </button>
          ))
        )}
      </div>
      <AdSpace />
    </div>
  );
}

export default OwnedProperties;