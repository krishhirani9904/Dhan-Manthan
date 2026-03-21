import { Wifi, Lock, Check, Sparkles, Crown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

// ═══ SPARKLE PARTICLES ═══
function CardSparkles({ color = 'bg-cyan-300', count = 5 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${10 + Math.random() * 80}%`,
    top: `${10 + Math.random() * 80}%`,
    delay: `${i * 0.6}s`,
    duration: `${2 + Math.random() * 2}s`,
    size: `${2 + Math.random() * 2}px`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map(p => (
        <div
          key={p.id}
          className={`absolute rounded-full ${color} opacity-0`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animation: `sparkle ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ═══ SHIMMER ═══
function CardShimmer({ shimmerColor }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[4]">
      <div
        className={`absolute inset-y-0 w-1/2 bg-gradient-to-r ${shimmerColor} animate-shimmer`}
        style={{ filter: 'blur(6px)' }}
      />
    </div>
  );
}

function CreditCard({
  tier,
  balance,
  cardNumber = '1042',
  isActive = false,
  isUnlocked = true,
  isFirstLocked = false,
  size = 'normal',
  onClick,
}) {
  const isLarge = size === 'large';
  const isPremium = tier.tier === 'premium';
  const isUltimate = tier.tier === 'ultimate';
  const isSpecial = isPremium || isUltimate;

  // ═══ FULLY LOCKED ═══
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

  // ═══ FIRST LOCKED (visible but dimmed) ═══
  if (!isUnlocked && isFirstLocked) {
    return (
      <div className="w-full cursor-not-allowed">
        <div className={`relative overflow-hidden rounded-2xl
          bg-gradient-to-br ${tier.gradient} aspect-[1.7/1]
          ${tier.glowClass ? `${tier.glowClass} opacity-50` : ''}`}>
          <div className="absolute inset-0 bg-black/40 z-[6]" />
          <div className="absolute inset-0 bg-gradient-to-tr
            from-transparent via-white/[0.04] to-transparent pointer-events-none" />

          {isSpecial && tier.shimmerColor && (
            <CardShimmer shimmerColor={tier.shimmerColor} />
          )}

          <div className="relative z-10 h-full flex flex-col justify-between p-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-5.5 rounded ${tier.chipColor} opacity-40
                overflow-hidden relative`}>
                <div className="absolute inset-[1px] rounded-sm border border-white/15" />
              </div>
              <p className="text-white/70 font-bold text-sm">{tier.name}</p>
              {isUltimate && <Crown className="w-3 h-3 text-yellow-300/50" />}
              {isPremium && <Sparkles className="w-3 h-3 text-cyan-300/50" />}
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

  // ═══ UNLOCKED CARD ═══
  return (
    <button
      onClick={onClick}
      className={`w-full text-left transition-all duration-200
        hover:scale-[1.02] active:scale-[0.99]
        ${isActive ? 'ring-2 ring-yellow-500 rounded-2xl' : ''}`}
    >
      <div className={`relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${tier.gradient}
        ${isLarge ? 'shadow-2xl aspect-[1.7/1]' : 'aspect-[1.7/1]'}
        ${tier.glowClass || ''}`}>

        {/* ── Standard decorations ── */}
        <div className="absolute inset-0 bg-gradient-to-tr
          from-transparent via-white/[0.07] to-transparent pointer-events-none" />
        <div className="absolute -top-8 -right-8 w-28 h-28
          rounded-full bg-white/[0.04] pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20
          rounded-full bg-white/[0.03] pointer-events-none" />

        {/* ── Diamond effects ── */}
        {isPremium && (
          <>
            <CardShimmer shimmerColor={tier.shimmerColor} />
            <CardSparkles color={tier.particleColor} count={5} />
            <div className={`absolute inset-0 bg-gradient-to-br ${tier.accentGradient}
              pointer-events-none z-[3]`} />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[2]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20Z' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: '20px 20px',
              }}
            />
          </>
        )}

        {/* ── Platinum effects ── */}
        {isUltimate && (
          <>
            <CardShimmer shimmerColor={tier.shimmerColor} />
            <CardSparkles color={tier.particleColor} count={6} />
            <div className={`absolute inset-0 bg-gradient-to-br ${tier.accentGradient}
              pointer-events-none z-[3]`} />
            {/* Holo strip */}
            <div className="absolute bottom-0 left-0 right-0 h-1 z-[6] overflow-hidden">
              <div className="h-full w-full animate-holo opacity-60"
                style={{
                  background: 'linear-gradient(90deg, #a855f7, #ec4899, #06b6d4, #eab308, #a855f7)',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-[2]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='8' fill='none' stroke='white' stroke-width='0.3'/%3E%3Ccircle cx='30' cy='30' r='15' fill='none' stroke='white' stroke-width='0.2'/%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px',
              }}
            />
            {/* Floating stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
              {[0, 1, 2].map(i => (
                <div key={i} className="absolute"
                  style={{
                    left: `${15 + i * 30}%`,
                    top: `${25 + (i % 2) * 35}%`,
                    animation: `twinkle 3s ease-in-out ${i * 0.8}s infinite`,
                  }}>
                  <Sparkles className="w-2.5 h-2.5 text-white/30" />
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Active badge ── */}
        {isActive && (
          <div className="absolute top-3 right-3 z-20">
            <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full
              flex items-center gap-0.5
              ${isUltimate
                ? 'bg-gradient-to-r from-purple-400 to-indigo-400 text-white'
                : isPremium
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white'
                  : 'bg-yellow-500 text-black'
              }`}>
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
                ${tier.chipColor} opacity-80 overflow-hidden relative
                ${isSpecial ? 'ring-1 ring-white/20' : ''}`}>
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
            <div className="flex items-center gap-1.5">
              {isUltimate && <Crown className="w-3 h-3 text-yellow-300/70" />}
              {isPremium && <Sparkles className="w-3 h-3 text-cyan-300/70" />}
              <span className={`${isLarge ? 'text-xs' : 'text-[9px]'} font-bold px-2.5 py-1
                rounded-full uppercase tracking-wider
                ${isUltimate
                  ? 'bg-gradient-to-r from-purple-400/30 to-indigo-400/30 text-purple-200 border border-purple-400/30'
                  : isPremium
                    ? 'bg-gradient-to-r from-cyan-400/30 to-blue-400/30 text-cyan-200 border border-cyan-400/30'
                    : 'bg-white/15 text-white/70'
                }`}>
                {tier.name}
              </span>
            </div>
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
              <p className={`text-white font-black ${isLarge ? 'text-2xl' : 'text-xl'} leading-none
                ${isSpecial ? 'drop-shadow-lg' : ''}`}>
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