import { useNavigate } from 'react-router-dom';
import { ChevronRight, Wifi, CreditCard, Sparkles, Crown } from 'lucide-react';
import { useGame } from '../../hooks/useGame';
import { formatFullBalance } from '../../utils/formatCurrency';
import { CARD_TIERS } from '../../data/cardTiers';

// ═══ SPARKLE PARTICLES (Diamond) ═══
function SparkleParticles({ color = 'bg-cyan-300' }) {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: `${15 + Math.random() * 70}%`,
    top: `${10 + Math.random() * 80}%`,
    delay: `${i * 0.5}s`,
    duration: `${2 + Math.random() * 2}s`,
    size: `${2 + Math.random() * 3}px`,
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

// ═══ FLOATING STARS (Platinum) ═══
function FloatingStars() {
  const stars = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    left: `${10 + i * 22}%`,
    top: `${20 + (i % 2) * 40}%`,
    delay: `${i * 0.8}s`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute"
          style={{
            left: s.left,
            top: s.top,
            animation: `twinkle 3s ease-in-out ${s.delay} infinite`,
          }}
        >
          <Sparkles className="w-3 h-3 text-white/40" />
        </div>
      ))}
    </div>
  );
}

// ═══ SHIMMER OVERLAY ═══
function ShimmerOverlay({ shimmerColor }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[4]">
      <div
        className={`absolute inset-y-0 w-1/2 bg-gradient-to-r ${shimmerColor} animate-shimmer`}
        style={{ filter: 'blur(8px)' }}
      />
    </div>
  );
}

// ═══ HOLOGRAPHIC STRIP (Platinum only) ═══
function HoloStrip() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 z-[6] overflow-hidden">
      <div
        className="h-full w-full animate-holo opacity-60"
        style={{
          background: 'linear-gradient(90deg, #a855f7, #ec4899, #06b6d4, #eab308, #a855f7)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
}

function BalanceCard() {
  const navigate = useNavigate();
  const { balance, activeCardId, cardNumber } = useGame();
  const tier = CARD_TIERS.find(t => t.id === activeCardId) || CARD_TIERS[0];

  const isPremium = tier.tier === 'premium';
  const isUltimate = tier.tier === 'ultimate';
  const isSpecial = isPremium || isUltimate;

  // Dynamic font size based on balance length
  const balanceStr = formatFullBalance(balance);
  const getBalanceFontSize = () => {
    const len = balanceStr.length;
    if (len > 25) return 'text-sm sm:text-base lg:text-sm';
    if (len > 20) return 'text-base sm:text-lg lg:text-base';
    if (len > 15) return 'text-lg sm:text-xl lg:text-lg';
    return 'text-2xl sm:text-2xl lg:text-xl';
  };

  return (
    <button onClick={() => navigate('/cards')} className="w-full text-left group flex-shrink-0">
      <div
        className={`relative overflow-hidden rounded-2xl
          bg-gradient-to-br ${tier.gradient} shadow-xl
          transition-all duration-300
          group-hover:scale-[1.02] group-active:scale-[0.98]
          ${tier.glowClass || ''}
          h-[120px] sm:h-[120px] lg:h-[130px] xl:h-[135px]`}
      >
        {/* Standard decorations */}
        <div className="absolute inset-0 bg-gradient-to-tr
          from-transparent via-white/[0.07] to-transparent pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-32 h-32
          rounded-full bg-white/[0.04] pointer-events-none" />

        {/* Diamond effects */}
        {isPremium && (
          <>
            <ShimmerOverlay shimmerColor={tier.shimmerColor} />
            <SparkleParticles color={tier.particleColor} />
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

        {/* Platinum effects */}
        {isUltimate && (
          <>
            <ShimmerOverlay shimmerColor={tier.shimmerColor} />
            <FloatingStars />
            <SparkleParticles color={tier.particleColor} />
            <div className={`absolute inset-0 bg-gradient-to-br ${tier.accentGradient}
              pointer-events-none z-[3]`} />
            <HoloStrip />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-[2]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='8' fill='none' stroke='white' stroke-width='0.3'/%3E%3Ccircle cx='30' cy='30' r='15' fill='none' stroke='white' stroke-width='0.2'/%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px',
              }}
            />
          </>
        )}

        {/* Card Content */}
        <div className="relative z-10 px-4 py-3 lg:py-2.5 h-full flex flex-col justify-between">
          {/* Top: Chip + Tier */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-5.5 lg:w-7 lg:h-5 rounded-md ${tier.chipColor}
                opacity-80 overflow-hidden relative
                ${isSpecial ? 'ring-1 ring-white/20' : ''}`}>
                <div className="absolute inset-[1px] rounded-sm border border-white/30
                  bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <Wifi className="w-3 h-3 text-white/25 rotate-90" />
            </div>
            <div className="flex items-center gap-1.5">
              {isUltimate && <Crown className="w-3 h-3 text-yellow-300/70" />}
              {isPremium && <Sparkles className="w-3 h-3 text-cyan-300/70" />}
              <CreditCard className="w-3 h-3 text-white/30" />
              <span className={`text-[8px] lg:text-[7px] font-bold px-2 py-0.5 rounded-full
                uppercase tracking-wider
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

          {/* Balance — FULL NUMBER, auto-sizing */}
          <p className={`text-white font-black tracking-tight leading-tight
            ${getBalanceFontSize()}
            ${isSpecial ? 'drop-shadow-lg' : ''}
            transition-all duration-150`}>
            {balanceStr}
          </p>

          {/* Bottom */}
          <div className="flex items-center justify-between">
            <p className="text-white/30 text-[9px] lg:text-[8px] tracking-[2px] font-mono">
              •••• •••• •••• {cardNumber}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-white/40 text-[8px] lg:text-[7px]">View Cards</span>
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