// src/components/earnings/ClickerZone.jsx
import { useState, useRef, useEffect } from 'react';
import { IndianRupee, Sparkles, Play, Loader2, Zap } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useEarnings } from '../../hooks/useEarnings';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

function ClickerZone() {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { isOnline } = useNetworkStatus();
  const {
    handleTap, currentPerClick, perClick, boostActive,
    adStatus, boostTimer, startAd
  } = useEarnings();

  const boostedPerClick = perClick * 2;
  const [scale, setScale] = useState(1);
  const [floats, setFloats] = useState([]);
  const containerRef = useRef(null);
  const timers = useRef([]);
  const isTouchDevice = useRef(false);
  const processedTouches = useRef(new Set()); // 🔑 Track processed touch IDs

  useEffect(() => {
    return () => timers.current.forEach(id => clearTimeout(id));
  }, []);

  const formatClickAmount = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const processTap = (x, y) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clampedX = Math.max(10, Math.min(x, rect.width - 50));
    const clampedY = Math.max(10, Math.min(y, rect.height - 30));

    const id = Date.now() + Math.random();
    setFloats(prev => [...prev, { id, x: clampedX, y: clampedY, value: currentPerClick }]);

    const f = setTimeout(() => {
      setFloats(prev => prev.filter(fl => fl.id !== id));
    }, 1000);
    timers.current.push(f);

    handleTap();
  };

  const animatePress = () => {
    setScale(0.88);
    const s = setTimeout(() => setScale(1), 120);
    timers.current.push(s);
  };

  // ═══ TOUCH HANDLER - Fixed for multi-touch ═══
  const handleTouchStart = (e) => {
    e.preventDefault();
    isTouchDevice.current = true;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    animatePress();

    // 🔑 Use changedTouches - only NEW touches, not all active touches
    const newTouches = e.changedTouches;
    
    for (let i = 0; i < newTouches.length; i++) {
      const touch = newTouches[i];
      const touchId = touch.identifier;
      
      // 🔑 Skip if already processed this touch
      if (processedTouches.current.has(touchId)) {
        continue;
      }
      
      // Mark as processed
      processedTouches.current.add(touchId);
      
      const x = touch.clientX - rect.left + (Math.random() * 20 - 10);
      const y = touch.clientY - rect.top + (Math.random() * 10 - 5);
      processTap(x, y);
    }
  };

  // ═══ TOUCH END - Cleanup processed touches ═══
  const handleTouchEnd = (e) => {
    // 🔑 Remove ended touches from tracking
    const endedTouches = e.changedTouches;
    for (let i = 0; i < endedTouches.length; i++) {
      processedTouches.current.delete(endedTouches[i].identifier);
    }
  };

  // ═══ CLICK HANDLER (Desktop Only) ═══
  const handleClick = (e) => {
    if (isTouchDevice.current) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    animatePress();

    const x = (e.clientX || rect.width / 2) - rect.left + (Math.random() * 16 - 8);
    const y = (e.clientY || rect.height / 2) - rect.top;

    processTap(x, y);
  };

  const handleAdClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isOnline) return;
    startAd();
  };

  const handleAdTouch = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isOnline) return;
    startAd();
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()}
      className={`flex-1 min-h-0 max-h-[50vh] relative rounded-2xl border
        overflow-hidden cursor-pointer select-none
        flex items-center justify-center
        ${t.bg.card} ${t.border.default}
        transition-colors duration-300`}
      style={{ 
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      {/* Boost Pill */}
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="absolute top-2 left-1/2 -translate-x-1/2 z-30"
      >
        {adStatus === 'idle' && (
          <button
            onClick={handleAdClick}
            onTouchStart={handleAdTouch}
            disabled={!isOnline}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full
              text-[10px] font-bold transition-all
              active:scale-90 hover:scale-105 shadow-lg
              ${!isOnline 
                ? isDark
                  ? 'bg-gray-800 border border-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 border border-gray-300 text-gray-400 cursor-not-allowed'
                : isDark
                  ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-purple-500/10'
                  : 'bg-purple-50 border border-purple-200 text-purple-600 shadow-purple-100'
              }`}
          >
            <Play className="w-4 h-4 fill-current" />
            {isOnline 
              ? `Watch Ad • ${formatClickAmount(boostedPerClick)}/click`
              : 'Offline - No Ads'
            }
          </button>
        )}

        {adStatus === 'watching' && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full
            text-[10px] font-medium
            ${isDark
              ? 'bg-gray-800/95 border border-gray-700 text-gray-300'
              : 'bg-white/95 border border-gray-200 text-gray-600'
            }`}>
            <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
            Watching... {boostTimer}s
          </div>
        )}

        {adStatus === 'boosted' && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full
            text-[10px] font-bold animate-pulse
            ${isDark
              ? 'bg-purple-500/30 border border-purple-500/50 text-purple-300'
              : 'bg-purple-100 border border-purple-300 text-purple-600'
            }`}>
            <Zap className="w-3 h-3 fill-current" />
            {formatClickAmount(boostedPerClick)}/click • {boostTimer}s
          </div>
        )}
      </div>

      {/* Floating Texts */}
      {floats.map(f => (
        <div
          key={f.id}
          className={`absolute pointer-events-none z-20 font-bold text-base
            ${boostActive ? 'text-purple-400' : 'text-green-400'}`}
          style={{
            left: f.x,
            top: f.y,
            animation: 'float-up 1s ease-out forwards',
          }}
        >
          +{formatClickAmount(f.value)}
        </div>
      ))}

      <div className="pointer-events-none flex flex-col items-center gap-1.5">
        <div
          style={{ transform: `scale(${scale})` }}
          className={`w-30 h-30 sm:w-30 sm:h-30 md:w-34 md:h-34 lg:h-32 lg:w-32
            rounded-full flex items-center justify-center
            shadow-2xl transition-transform duration-100 border-4
            ${boostActive
              ? 'bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300 shadow-purple-500/30'
              : 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 shadow-orange-500/30'
            }`}
        >
          <div className="absolute inset-2 rounded-full bg-white/10" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-2 sm:p-2.5 rounded-full mb-1">
              {boostActive
                ? <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
                : <IndianRupee className="w-6 h-6 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
              }
            </div>
            <span className="text-white font-black lg:text-[16px] sm:text-xs">
              {boostActive ? '2X BOOST!' : 'TAP KARO!'}
            </span>
          </div>
        </div>
        <p className={`lg:text-[12px] sm:text-[10px] ${t.text.tertiary}`}>
          {boostActive
            ? `⚡ Tap Anywhere!`
            : `Tap Anywhere • ${formatClickAmount(currentPerClick)}/click`
          }
        </p>
      </div>
    </div>
  );
}

export default ClickerZone;