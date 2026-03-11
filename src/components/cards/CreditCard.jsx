import { Wifi, Lock, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

function CreditCard({
  tier,
  balance,
  cardNumber = '1042',
  isActive = false,
  isUnlocked = true,
  isFirstLocked = false,
  size = 'normal', // 'normal' | 'large'
  onClick,
}) {
  const isLarge = size === 'large';

  // Fully locked (no design visible)
  if (!isUnlocked && !isFirstLocked) {
    return (
      <div className="w-full cursor-not-allowed">
        <div className="relative overflow-hidden rounded-2xl aspect-[1.7/1]
          bg-gray-800/80">
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
            <div className="flex items-center gap-2 mb-3">
              <p className="font-bold text-sm text-gray-500">{tier.name}</p>
              <Lock className="w-3.5 h-3.5 text-gray-600" />
            </div>
            <Lock className="w-8 h-8 mb-2 text-gray-700" />
            <p className="text-[10px] text-gray-600">Required:</p>
            <p className="font-bold text-sm text-gray-500">
              {formatCurrency(tier.minBalance)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // First locked (design visible but dimmed)
  if (!isUnlocked && isFirstLocked) {
    return (
      <div className="w-full cursor-not-allowed">
        <div className={`relative overflow-hidden rounded-2xl
          bg-gradient-to-br ${tier.gradient} aspect-[1.7/1]`}>
          <div className="absolute inset-0 bg-black/40 z-[6]" />
          <div className="absolute inset-0 bg-gradient-to-tr
            from-transparent via-white/[0.04] to-transparent pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col justify-between p-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-5.5 rounded ${tier.chipColor} opacity-40
                overflow-hidden relative`}>
                <div className="absolute inset-[1px] rounded-sm border border-white/15" />
              </div>
              <p className="text-white/70 font-bold text-sm">{tier.name}</p>
              <Lock className="w-3.5 h-3.5 text-white/50" />
            </div>

            <div>
              <p className="text-white/15 text-[10px] tracking-[2px] font-mono mb-1">
                •••• •••• •••• {cardNumber}
              </p>
              <p className="text-white/30 text-[10px] mb-0.5">Required:</p>
              <div className="flex items-end justify-between">
                <p className="text-white/60 font-black text-xl leading-none">
                  {formatCurrency(tier.minBalance)}
                </p>
                <p className="text-white/10 text-[8px] font-medium tracking-wider">
                  DHAN-MANTHAN
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unlocked card
  return (
    <button
      onClick={onClick}
      className={`w-full text-left transition-all duration-200
        hover:scale-[1.02] active:scale-[0.99]
        ${isActive ? 'ring-2 ring-yellow-500 rounded-2xl' : ''}`}
    >
      <div className={`relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${tier.gradient}
        ${isLarge ? 'shadow-2xl aspect-[1.7/1]' : 'aspect-[1.7/1]'}`}>
        
        {/* Decorations */}
        <div className="absolute inset-0 bg-gradient-to-tr
          from-transparent via-white/[0.07] to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: isLarge ? '16px 16px' : '12px 12px',
          }} />
        <div className="absolute -top-8 -right-8 w-28 h-28
          rounded-full bg-white/[0.04] pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20
          rounded-full bg-white/[0.03] pointer-events-none" />

        {/* Active badge */}
        {isActive && (
          <div className="absolute top-3 right-3 z-20">
            <span className="bg-yellow-500 text-black text-[8px] font-bold
              px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5" /> ACTIVE
            </span>
          </div>
        )}

        <div className={`relative z-10 h-full flex flex-col justify-between
          ${isLarge ? 'p-5' : 'p-4'}`}>
          
          {/* Top: Chip + Wifi + Tier */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`${isLarge ? 'w-10 h-7' : 'w-8 h-5.5'} rounded-md
                ${tier.chipColor} opacity-80 overflow-hidden relative`}>
                <div className="absolute inset-[1px] rounded-sm border border-white/30
                  bg-gradient-to-br from-white/20 to-transparent" />
                <div className={`absolute ${isLarge ? 'top-[6px] left-[3px] right-[3px]' : 'top-[4px] left-[2px] right-[2px]'} space-y-[2px]`}>
                  <div className="h-[1px] bg-white/20" />
                  <div className="h-[1px] bg-white/15" />
                  <div className="h-[1px] bg-white/10" />
                </div>
              </div>
              <Wifi className={`${isLarge ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-white/25 rotate-90`} />
            </div>
            <span className={`${isLarge ? 'text-xs' : 'text-[9px]'} font-bold px-2.5 py-1
              rounded-full bg-white/15 text-white/70 uppercase tracking-wider`}>
              {tier.name}
            </span>
          </div>

          {/* Bottom */}
          <div>
            <p className={`text-white/25 ${isLarge ? 'text-xs tracking-[3px]' : 'text-[10px] tracking-[2px]'}
              font-mono mb-1.5`}>
              •••• •••• •••• {cardNumber}
            </p>
            <p className={`text-white/40 ${isLarge ? 'text-[10px]' : 'text-[9px]'} mb-0.5`}>
              Balance:
            </p>
            <div className="flex items-end justify-between">
              <p className={`text-white font-black ${isLarge ? 'text-2xl' : 'text-xl'} leading-none`}>
                {formatCurrency(balance)}
              </p>
              <p className={`text-white/20 ${isLarge ? 'text-[8px]' : 'text-[7px]'}
                font-medium tracking-wider`}>
                DHAN-MANTHAN
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default CreditCard;