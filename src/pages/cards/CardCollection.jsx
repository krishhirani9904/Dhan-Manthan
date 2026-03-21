import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { CARD_TIERS } from '../../data/cardTiers';
import CreditCard from '../../components/cards/CreditCard';
import AdSpace from '../../components/common/AdSpace';

function CardCollection() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, activeCardId, cardNumber } = useGame();

  const lastUnlockedIndex = CARD_TIERS.reduce(
    (lastIdx, tier, idx) => (balance >= tier.minBalance ? idx : lastIdx), 0
  );
  const firstLockedIndex = lastUnlockedIndex + 1;

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex-shrink-0 sticky top-0 z-10
        ${t.bg.secondary} border-b ${t.border.strong}
        px-4 py-3 mx-2 mt-1 rounded-2xl`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/earnings')}
            className={`p-2 rounded-xl ${t.bg.elevated} transition-colors`}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className={`text-lg font-bold ${t.text.primary}`}>Card Collection</h2>
            <p className={`text-[10px] ${t.text.secondary}`}>
              {lastUnlockedIndex + 1}/{CARD_TIERS.length} unlocked
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3
          max-w-4xl mx-auto">
          {CARD_TIERS.map((tier, idx) => {
            const unlocked = idx <= lastUnlockedIndex;
            const isFirstLocked = idx === firstLockedIndex;
            const isActive = activeCardId === tier.id;

            return (
              <div key={tier.id} className="w-full max-w-md mx-auto lg:max-w-none">
                <CreditCard
                  tier={tier}
                  balance={balance}
                  cardNumber={cardNumber}
                  isActive={isActive}
                  isUnlocked={unlocked}
                  isFirstLocked={isFirstLocked}
                  onClick={unlocked ? () => navigate(`/cards/${tier.id}`) : undefined}
                />
              </div>
            );
          })}
        </div>
      </div>

      <AdSpace />
    </div>
  );
}

export default CardCollection;