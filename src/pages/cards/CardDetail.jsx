import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard as CreditCardIcon, Lock } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { CARD_TIERS } from '../../data/cardTiers';
import { formatCurrency } from '../../utils/formatCurrency';
import CreditCard from '../../components/cards/CreditCard';
import AdSpace from '../../components/common/AdSpace';

function CardDetail() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, activeCardId, cardNumber, setActiveCard } = useGame();

  const tier = CARD_TIERS.find(c => c.id === cardId);

  if (!tier) {
    return (
      <div className={`min-h-screen ${t.bg.primary} flex items-center justify-center`}>
        <div className="text-center">
          <p className={`text-lg font-bold ${t.text.primary}`}>Card not found</p>
          <button onClick={() => navigate('/cards')}
            className="mt-4 px-4 py-2 rounded-xl bg-yellow-500 text-white font-bold text-sm">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isUnlocked = balance >= tier.minBalance;
  const isActive = activeCardId === tier.id;
  const tierIndex = CARD_TIERS.findIndex(c => c.id === cardId);
  const nextTier = CARD_TIERS[tierIndex + 1];

  const handleUseCard = () => {
    if (isUnlocked && !isActive) setActiveCard(tier.id);
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex-shrink-0 sticky top-0 z-10
        ${t.bg.secondary} border-b ${t.border.strong}
        px-4 py-3 mx-2 mt-1 rounded-2xl`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/cards')}
            className={`p-2 rounded-xl ${t.bg.elevated} transition-colors`}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className={`text-lg font-bold ${t.text.primary}`}>{tier.name} Card</h2>
            <p className={`text-[10px] ${t.text.secondary}`}>
              Tier {tierIndex + 1} of {CARD_TIERS.length}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide
        px-4 py-5 pb-4 max-w-lg mx-auto w-full space-y-4">

        {/* Card Preview - using same CreditCard component with same cardNumber */}
        <CreditCard
          tier={tier}
          balance={balance}
          cardNumber={cardNumber}
          isActive={isActive}
          isUnlocked={isUnlocked}
          size="large"
        />

        {/* Card Info */}
        <div className={`${t.bg.card} border ${t.border.default} rounded-2xl p-3.5 space-y-2.5`}>
          <h4 className={`text-xs font-bold ${t.text.primary} flex items-center gap-2`}>
            <CreditCardIcon className="w-3.5 h-3.5 text-yellow-500" /> Card Details
          </h4>
          <div className="space-y-2">
            {[
              ['Tier', tier.name],
              ['Min Balance', tier.minBalance === 0 ? 'Free' : formatCurrency(tier.minBalance), 'text-green-500'],
              ['Bonus', tier.perks],
              ['Status', isActive ? '✓ Active' : isUnlocked ? 'Unlocked' : 'Locked',
                isActive ? 'text-yellow-500' : isUnlocked ? 'text-green-500' : 'text-red-400'],
              ['Your Balance', formatCurrency(balance)],
              ...(nextTier
                ? [['Next Tier', `${nextTier.name} — ${formatCurrency(nextTier.minBalance)}`, t.text.tertiary]]
                : []),
            ].map(([label, value, color]) => (
              <div key={label} className="flex items-center justify-between">
                <span className={`text-[11px] ${t.text.secondary}`}>{label}</span>
                <span className={`text-[11px] font-bold ${color || t.text.primary}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        {isUnlocked ? (
          <button onClick={handleUseCard} disabled={isActive}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all
              ${isActive
                ? isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95'
              }`}>
            {isActive
              ? <span className="flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Currently Active</span>
              : 'Use This Card'}
          </button>
        ) : (
          <div className={`${t.bg.elevated} border ${t.border.default} rounded-xl p-3.5 text-center`}>
            <Lock className={`w-4 h-4 mx-auto mb-1.5 ${t.text.tertiary}`} />
            <p className={`text-xs font-medium ${t.text.secondary}`}>
              Earn {formatCurrency(tier.minBalance - balance)} more to unlock
            </p>
          </div>
        )}
      </div>

      <AdSpace />
    </div>
  );
}

export default CardDetail;