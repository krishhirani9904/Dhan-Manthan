import { createContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  INITIAL_PER_CLICK,
  INITIAL_UPGRADE_COST,
  MAX_PER_CLICK,
  MAX_TAP_LEVEL,
  UPGRADE_CONFIG,
  AD_WATCH_TIME,
  CLICK_BOOST_MULTIPLIER,
  CLICK_BOOST_DURATION,
} from '../config/constants';

export const EarningsContext = createContext();

// ═══════════════════════════════════════
// PROGRESSION CALCULATION
// ═══════════════════════════════════════

const getPhaseForLevel = (level) => {
  const { phase1, phase2, phase3, phase4, phase5 } = UPGRADE_CONFIG;
  if (level <= phase1.maxLevel) return { phase: phase1, startLevel: 1 };
  if (level <= phase2.maxLevel) return { phase: phase2, startLevel: phase1.maxLevel + 1 };
  if (level <= phase3.maxLevel) return { phase: phase3, startLevel: phase2.maxLevel + 1 };
  if (level <= phase4.maxLevel) return { phase: phase4, startLevel: phase3.maxLevel + 1 };
  return { phase: phase5, startLevel: phase4.maxLevel + 1 };
};

const calculatePerClickForLevel = (level) => {
  if (level <= 1) return INITIAL_PER_CLICK;
  if (level > MAX_TAP_LEVEL) return MAX_PER_CLICK;

  let perClick = INITIAL_PER_CLICK;

  for (let l = 2; l <= level; l++) {
    const { phase, startLevel } = getPhaseForLevel(l);
    const levelInPhase = l - startLevel;
    const increment = Math.floor(
      phase.baseIncrement * Math.pow(phase.growthRate, levelInPhase)
    );
    perClick += Math.max(increment, 1);
  }

  return Math.min(perClick, MAX_PER_CLICK);
};

const calculateUpgradeCost = (level) => {
  if (level >= MAX_TAP_LEVEL) return Infinity;
  const { costBase, costMultiplier } = UPGRADE_CONFIG;
  return Math.floor(costBase * Math.pow(costMultiplier, level - 1));
};

// ═══════════════════════════════════════
// EARNINGS DEFAULTS
// ═══════════════════════════════════════

export const EARNINGS_DEFAULTS = {
  level: 1,
  perClick: INITIAL_PER_CLICK,
  upgradeCost: INITIAL_UPGRADE_COST,
  totalClicks: 0,
  boostEndTime: null,
  adStatus: 'idle',
};

// ═══════════════════════════════════════
// EARNINGS PROVIDER
// ═══════════════════════════════════════

export function EarningsProvider({
  children,
  gameBalance,
  onBalanceChange,
  savedState,
  onStateChange,
  resetSignal,
}) {
  // ─── State ───
  const [level, setLevel] = useState(() => {
    const saved = savedState?.level || EARNINGS_DEFAULTS.level;
    return Math.min(saved, MAX_TAP_LEVEL);
  });

  const [perClick, setPerClick] = useState(() => {
    const saved = savedState?.level || EARNINGS_DEFAULTS.level;
    return calculatePerClickForLevel(Math.min(saved, MAX_TAP_LEVEL));
  });

  const [upgradeCost, setUpgradeCost] = useState(() => {
    const saved = savedState?.level || EARNINGS_DEFAULTS.level;
    return calculateUpgradeCost(Math.min(saved, MAX_TAP_LEVEL));
  });

  const [totalClicks, setTotalClicks] = useState(
    savedState?.totalClicks || EARNINGS_DEFAULTS.totalClicks
  );

  // ─── Boost State (restored from saved timestamp) ───
  const [boostActive, setBoostActive] = useState(() => {
    if (savedState?.boostEndTime && savedState?.adStatus === 'boosted') {
      const remaining = Math.floor((savedState.boostEndTime - Date.now()) / 1000);
      return remaining > 0;
    }
    return false;
  });

  const [boostTimer, setBoostTimer] = useState(() => {
    if (savedState?.boostEndTime) {
      const remaining = Math.floor((savedState.boostEndTime - Date.now()) / 1000);
      if (remaining > 0) return remaining;
    }
    return 0;
  });

  const [adStatus, setAdStatus] = useState(() => {
    if (savedState?.adStatus === 'boosted' && savedState?.boostEndTime) {
      const remaining = Math.floor((savedState.boostEndTime - Date.now()) / 1000);
      if (remaining > 0) return 'boosted';
    }
    if (savedState?.adStatus === 'watching' && savedState?.boostEndTime) {
      const remaining = Math.floor((savedState.boostEndTime - Date.now()) / 1000);
      if (remaining > 0) return 'watching';
    }
    return 'idle';
  });

  // ─── Refs ───
  const timerRef = useRef(null);
  const stateChangeRef = useRef(null);
  const adStatusRef = useRef(adStatus); // Track adStatus for timer callback

  // Keep adStatusRef in sync
  useEffect(() => {
    adStatusRef.current = adStatus;
  }, [adStatus]);

  // ─── Sync state to parent for saving (debounced) ───
  useEffect(() => {
    if (stateChangeRef.current) clearTimeout(stateChangeRef.current);
    stateChangeRef.current = setTimeout(() => {
      // Calculate boostEndTime from current timer for persistence
      let boostEndTime = null;
      if (boostTimer > 0 && (adStatus === 'boosted' || adStatus === 'watching')) {
        boostEndTime = Date.now() + boostTimer * 1000;
      }

      onStateChange?.({
        level,
        perClick,
        upgradeCost,
        totalClicks,
        boostEndTime,
        adStatus: boostTimer > 0 ? adStatus : 'idle',
      });
    }, 500);
    return () => {
      if (stateChangeRef.current) clearTimeout(stateChangeRef.current);
    };
  }, [level, perClick, upgradeCost, totalClicks, boostTimer, adStatus, onStateChange]);

  // ─── Reset handler ───
  useEffect(() => {
    if (resetSignal > 0) {
      setLevel(EARNINGS_DEFAULTS.level);
      setPerClick(EARNINGS_DEFAULTS.perClick);
      setUpgradeCost(EARNINGS_DEFAULTS.upgradeCost);
      setTotalClicks(EARNINGS_DEFAULTS.totalClicks);
      setBoostActive(false);
      setBoostTimer(0);
      setAdStatus('idle');
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [resetSignal]);

  // ═══════════════════════════════════════
  // BOOST TIMER EFFECT (FIXED)
  // ═══════════════════════════════════════
  // Future: When real ads are added, startAd will show actual ad
  // and only call activateBoost() after ad completion callback

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Only run timer if we have time remaining and valid status
    const shouldRunTimer = boostTimer > 0 && (adStatus === 'watching' || adStatus === 'boosted');
    
    if (!shouldRunTimer) return;

    timerRef.current = setInterval(() => {
      setBoostTimer(prev => {
        if (prev <= 1) {
          // Timer finished - clear interval
          clearInterval(timerRef.current);
          timerRef.current = null;

          // Use ref to get current adStatus (avoids stale closure)
          const currentStatus = adStatusRef.current;

          if (currentStatus === 'watching') {
            // Ad watch complete - activate boost
            // Future: This will only trigger after real ad callback
            setAdStatus('boosted');
            setBoostActive(true);
            return CLICK_BOOST_DURATION; // Start 30 second boost
          }

          if (currentStatus === 'boosted') {
            // Boost period ended
            setAdStatus('idle');
            setBoostActive(false);
            return 0;
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [adStatus, boostTimer > 0 ? 1 : 0]); // Convert to stable value

  // ═══════════════════════════════════════
  // COMPUTED VALUES
  // ═══════════════════════════════════════

  const currentPerClick = useMemo(() => {
    return boostActive ? perClick * CLICK_BOOST_MULTIPLIER : perClick;
  }, [perClick, boostActive]);

  const isMaxLevel = useMemo(() => {
    return level >= MAX_TAP_LEVEL;
  }, [level]);

  const nextPerClick = useMemo(() => {
    if (isMaxLevel) return perClick;
    return calculatePerClickForLevel(level + 1);
  }, [level, perClick, isMaxLevel]);

  const availableUpgrades = useMemo(() => {
    if (isMaxLevel) return 0;

    let count = 0;
    let tempBalance = gameBalance;
    let tempLevel = level;

    while (tempLevel < MAX_TAP_LEVEL && count < 99) {
      const cost = calculateUpgradeCost(tempLevel);
      if (tempBalance < cost) break;
      count++;
      tempBalance -= cost;
      tempLevel++;
    }

    return count;
  }, [gameBalance, level, isMaxLevel]);

  const upgradeProgress = useMemo(() => {
    if (isMaxLevel) return 100;
    if (upgradeCost === Infinity) return 100;
    return Math.min((gameBalance / upgradeCost) * 100, 100);
  }, [gameBalance, upgradeCost, isMaxLevel]);

  // ═══════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════

  // TAP — ALWAYS works regardless of level
  const handleTap = useCallback(() => {
    const earnAmount = boostActive ? perClick * CLICK_BOOST_MULTIPLIER : perClick;
    onBalanceChange?.(earnAmount);
    setTotalClicks(prev => prev + 1);
  }, [perClick, boostActive, onBalanceChange]);

  // UPGRADE — stops at max level
  const handleUpgrade = useCallback(() => {
    if (isMaxLevel) return false;
    if (gameBalance < upgradeCost) return false;

    const newLevel = level + 1;
    const newPerClick = calculatePerClickForLevel(newLevel);
    const newUpgradeCost = calculateUpgradeCost(newLevel);

    onBalanceChange?.(-upgradeCost);
    setLevel(newLevel);
    setPerClick(newPerClick);
    setUpgradeCost(newUpgradeCost);

    return true;
  }, [level, upgradeCost, gameBalance, isMaxLevel, onBalanceChange]);

  // START AD - Currently timer-based, future: real ad integration
  // Future implementation:
  // 1. Show actual ad using ad SDK
  // 2. Wait for ad completion callback
  // 3. Only then call internal activateBoost()
  const startAd = useCallback(() => {
    if (adStatus !== 'idle') return false;
    
    // Currently: Start watching timer (simulates ad)
    // Future: This will trigger actual ad SDK
    setAdStatus('watching');
    setBoostTimer(AD_WATCH_TIME);
    
    return true;
  }, [adStatus]);

  // Future: This will be called by ad completion callback
  const activateBoost = useCallback(() => {
    setAdStatus('boosted');
    setBoostActive(true);
    setBoostTimer(CLICK_BOOST_DURATION);
  }, []);

  // Cancel ad watching (for future: if user closes ad early)
  const cancelAd = useCallback(() => {
    if (adStatus === 'watching') {
      setAdStatus('idle');
      setBoostTimer(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [adStatus]);

  const resetEarnings = useCallback(() => {
    setLevel(EARNINGS_DEFAULTS.level);
    setPerClick(EARNINGS_DEFAULTS.perClick);
    setUpgradeCost(EARNINGS_DEFAULTS.upgradeCost);
    setTotalClicks(EARNINGS_DEFAULTS.totalClicks);
    setBoostActive(false);
    setBoostTimer(0);
    setAdStatus('idle');

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ═══════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════

  const value = useMemo(() => ({
    // State
    level,
    perClick,
    upgradeCost,
    totalClicks,

    // Boost state
    boostActive,
    boostTimer,
    adStatus,

    // Computed
    currentPerClick,
    nextPerClick,
    isMaxLevel,
    availableUpgrades,
    upgradeProgress,
    maxLevel: MAX_TAP_LEVEL,
    maxPerClick: MAX_PER_CLICK,

    // Actions
    handleTap,
    handleUpgrade,
    startAd,
    activateBoost,  // For future ad integration
    cancelAd,       // For future ad integration
    resetEarnings,
  }), [
    level, perClick, upgradeCost, totalClicks,
    boostActive, boostTimer, adStatus,
    currentPerClick, nextPerClick, isMaxLevel, availableUpgrades, upgradeProgress,
    handleTap, handleUpgrade, startAd, activateBoost, cancelAd, resetEarnings,
  ]);

  return (
    <EarningsContext.Provider value={value}>
      {children}
    </EarningsContext.Provider>
  );
}