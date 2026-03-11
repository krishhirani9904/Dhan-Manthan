import { useNavigate } from 'react-router-dom';
import { Building2, Home, ChevronRight } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { getPropertyRentalIncome } from '../../data/realEstate';
import { formatCurrency } from '../../utils/formatCurrency';

function RealEstateTab() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedProperties } = useGame();

  const rentalIncome = ownedProperties.reduce((sum, op) =>
    sum + getPropertyRentalIncome(op.propertyId, op.improvements || []), 0);

  return (
    <div className="px-3 pb-4 space-y-3">
      {/* Rental Income */}
      <div className="text-center py-4">
        <p className={`text-3xl font-black ${t.text.primary}`}>{formatCurrency(rentalIncome)}</p>
        <p className={`text-xs ${t.text.tertiary} mt-1`}>Rental Income Per Hour</p>
      </div>

      {/* Real Estate Market */}
      <button onClick={() => navigate('/investing/realestate/market')}
        className={`w-full rounded-xl p-4 text-left transition-all active:scale-[0.98]
          ${t.bg.card} border ${t.border.default} hover:border-green-500/30`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className={`w-5 h-5 ${t.text.brand}`} />
            <div>
              <p className={`text-sm font-bold ${t.text.primary}`}>Real Estate Market</p>
              <p className={`text-[10px] ${t.text.tertiary}`}>
                Buy properties all over the world and earn rental income!
              </p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 ${t.text.tertiary}`} />
        </div>
      </button>

      {/* My Property */}
      <button onClick={() => navigate('/investing/realestate/owned')}
        className={`w-full rounded-xl p-4 text-left transition-all active:scale-[0.98]
          ${t.bg.card} border ${t.border.default} hover:border-green-500/30`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Home className={`w-5 h-5 text-green-500`} />
            <div>
              <p className={`text-sm font-bold ${t.text.primary}`}>My Property</p>
              <p className={`text-[10px] ${t.text.tertiary}`}>
                {ownedProperties.length > 0
                  ? `${ownedProperties.length} properties owned`
                  : 'View owned properties'}
              </p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 ${t.text.tertiary}`} />
        </div>
      </button>
    </div>
  );
}

export default RealEstateTab;