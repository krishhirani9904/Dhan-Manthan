import { useContext } from 'react';
import { EarningsContext } from '../context/EarningsContext';

export function useEarnings() {
  const ctx = useContext(EarningsContext);
  if (!ctx) {
    throw new Error('useEarnings must be used within EarningsProvider');
  }
  return ctx;
}