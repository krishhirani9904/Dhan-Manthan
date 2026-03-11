import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { PROPERTIES } from '../../../data/realEstate';
import { formatCurrency } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

function RealEstateBuy() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, buyProperty, ownedProperties } = useGame();

  const prop = PROPERTIES.find(p => p.id === propertyId);
  if (!prop) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Property not found</p>
      </div>
    );
  }

  const owned = ownedProperties.some(op => op.propertyId === propertyId);
  const canBuy = balance >= prop.price && !owned;

  const handleBuy = () => {
    if (canBuy) { buyProperty(propertyId); navigate('/investing/realestate/owned'); }
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate(-1)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Purchase Confirmation</h1>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-6 space-y-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-red-400" />
          <p className={`text-sm font-medium ${t.text.secondary}`}>{prop.country} {prop.location}</p>
        </div>

        <div className={`rounded-xl p-4 space-y-3 ${t.bg.card} border ${t.border.default}`}>
          {[
            ['Property', prop.name],
            ['Price', formatCurrency(prop.price)],
            ['Income Per Hour', `+${formatCurrency(prop.rentalPerHour)}`],
            ['Type', prop.type],
            ['Area', prop.area],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className={`text-xs ${t.text.secondary}`}>{label}</span>
              <span className={`text-xs font-bold ${t.text.primary}`}>{value}</span>
            </div>
          ))}
        </div>

        <button onClick={handleBuy} disabled={!canBuy}
          className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95
            ${canBuy
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20'
              : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
          {owned ? 'Already Owned' : canBuy ? 'Buy Property' : `Need ${formatCurrency(prop.price - balance)}`}
        </button>

        <p className={`text-center text-[10px] ${t.text.tertiary}`}>
          Balance: {formatCurrency(balance)}
        </p>
      </div>
      <AdSpace />
    </div>
  );
}

export default RealEstateBuy;