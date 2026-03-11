import { LEVEL_LABELS } from '../config/constants';

export const getLevelLabel = (level) =>
  LEVEL_LABELS[Math.min((level || 1) - 1, 9)];

export const generateId = (prefix = 'id') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

export const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

// FIXED: Proper 32-bit integer mask
export const generateCardNumber = (seed) => {
  const hash = String(seed).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & 0xFFFFFFFF;
  }, 0);
  return String(1000 + Math.abs(hash) % 9000);
};