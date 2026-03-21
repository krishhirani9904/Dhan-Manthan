// ═══ ABBREVIATED FORMAT (for general use) ═══
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const safeAmount = Math.min(Math.max(amount, -Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER);
  const prefix = safeAmount < 0 ? '-' : '';
  const abs = Math.abs(safeAmount);

  if (abs >= 1e17) return `${prefix}₹${(abs / 1e17).toFixed(2)}Sh`;
  if (abs >= 1e15) return `${prefix}₹${(abs / 1e15).toFixed(2)}Pd`;
  if (abs >= 1e13) return `${prefix}₹${(abs / 1e13).toFixed(2)}Nl`;
  if (abs >= 1e11) return `${prefix}₹${(abs / 1e11).toFixed(2)}Kh`;
  if (abs >= 1e9)  return `${prefix}₹${(abs / 1e9).toFixed(2)}Ar`;
  if (abs >= 1e7)  return `${prefix}₹${(abs / 1e7).toFixed(2)}Cr`;
  if (abs >= 1e5)  return `${prefix}₹${(abs / 1e5).toFixed(2)}L`;
  if (abs >= 1e3)  return `${prefix}₹${(abs / 1e3).toFixed(1)}K`;
  if (abs < 1 && abs > 0) return `${prefix}₹${abs.toFixed(2)}`;
  return `${prefix}₹${Math.floor(abs).toLocaleString('en-IN')}`;
};

// ═══ FULL NUMBER FORMAT (for BalanceCard — no abbreviation) ═══
export const formatFullBalance = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const safeAmount = Math.min(Math.max(amount, -Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER);
  const prefix = safeAmount < 0 ? '-' : '';
  const abs = Math.abs(safeAmount);

  // Split into integer and decimal parts
  const intPart = Math.floor(abs);
  const decPart = abs - intPart;

  // Indian number formatting (1,23,45,678)
  const intStr = intPart.toLocaleString('en-IN');

  // Show decimals only if they exist and are meaningful
  if (decPart > 0.001) {
    const decStr = decPart.toFixed(2).substring(1); // ".34"
    return `${prefix}₹${intStr}${decStr}`;
  }

  return `${prefix}₹${intStr}`;
};

export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  const abs = Math.abs(num);
  const prefix = num < 0 ? '-' : '';
  if (abs >= 1e9)  return `${prefix}${(abs / 1e9).toFixed(1)}Ar`;
  if (abs >= 1e7)  return `${prefix}${(abs / 1e7).toFixed(1)}Cr`;
  if (abs >= 1e5)  return `${prefix}${(abs / 1e5).toFixed(1)}L`;
  if (abs >= 1e3)  return `${prefix}${(abs / 1e3).toFixed(1)}K`;
  return num.toLocaleString('en-IN');
};