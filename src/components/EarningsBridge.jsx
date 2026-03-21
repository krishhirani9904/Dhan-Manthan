import { useCallback } from 'react';
import { useGame } from '../hooks/useGame';
import { EarningsProvider } from '../context/EarningsContext';

export function EarningsBridge({ children }) {
  const {
    balance,
    addBalance,
    deductBalance,
    earningsState,
    updateEarningsState,
    resetSignal,
  } = useGame();

  const handleBalanceChange = useCallback((amount) => {
    if (amount >= 0) {
      addBalance(amount);
    } else {
      deductBalance(Math.abs(amount));
    }
  }, [addBalance, deductBalance]);

  return (
    <EarningsProvider
      gameBalance={balance}
      onBalanceChange={handleBalanceChange}
      savedState={earningsState}
      onStateChange={updateEarningsState}
      resetSignal={resetSignal}
    >
      {children}
    </EarningsProvider>
  );
}