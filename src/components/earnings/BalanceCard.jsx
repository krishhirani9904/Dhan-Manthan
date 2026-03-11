import { useNavigate } from 'react-router-dom';
import { ChevronRight, Wifi, CreditCard } from 'lucide-react';
import { useGame } from '../../hooks/useGame';
import { formatCurrency } from '../../utils/formatCurrency';
import { CARD_TIERS } from '../../data/cardTiers';

function BalanceCard() {
  const navigate = useNavigate();
  const { balance, activeCardId, cardNumber } = useGame();
  const tier = CARD_TIERS.find(t => t.id === activeCardId) || CARD_TIERS[0];

  return (
    <button onClick={() => navigate('/cards')}
      className="w-full text-left group flex-shrink-0">
      <div className={`relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${tier.gradient} shadow-xl
        transition-transform duration-200
        group-hover:scale-[1.02] group-active:scale-[0.98]
        max-h-[180px]`}>

        <div className="absolute inset-0 bg-gradient-to-tr
          from-transparent via-white/[0.07] to-transparent pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-32 h-32
          rounded-full bg-white/[0.04] pointer-events-none" />

        <div className="relative z-10 px-4 py-4 sm:px-5 sm:py-4">
          {/* Top: Chip + Tier */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-6 sm:w-10 sm:h-7 rounded-md ${tier.chipColor}
                opacity-80 overflow-hidden relative`}>
                <div className="absolute inset-[1px] rounded-sm border border-white/30
                  bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <Wifi className="w-3.5 h-3.5 text-white/25 rotate-90" />
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-white/30" />
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full
                bg-white/15 text-white/70 uppercase tracking-wider">
                {tier.name}
              </span>
            </div>
          </div>

          {/* Balance */}
          <p className="text-white text-2xl sm:text-3xl font-black tracking-tight mb-2">
            {formatCurrency(balance)}
          </p>

          {/* Bottom */}
          <div className="flex items-center justify-between">
            <p className="text-white/30 text-[10px] sm:text-xs tracking-[2px] font-mono">
              •••• •••• •••• {cardNumber}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-white/40 text-[9px]">View Cards</span>
              <ChevronRight className="w-3 h-3 text-white/30
                group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default BalanceCard;