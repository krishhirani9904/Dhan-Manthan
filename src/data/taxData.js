export const TAX_BRACKETS = [
  { min: 0, max: 500000, rate: 0 },
  { min: 500000, max: 1000000, rate: 0.05 },
  { min: 1000000, max: 5000000, rate: 0.10 },
  { min: 5000000, max: 10000000, rate: 0.15 },
  { min: 10000000, max: 50000000, rate: 0.20 },
  { min: 50000000, max: Infinity, rate: 0.25 },
];

export const calculateTax = (incomePerHour) => {
  const annualIncome = incomePerHour * 8760;
  let tax = 0;
  for (const bracket of TAX_BRACKETS) {
    if (annualIncome > bracket.min) {
      const taxable = Math.min(annualIncome, bracket.max) - bracket.min;
      tax += taxable * bracket.rate;
    }
  }
  return Math.floor(tax / 8760);
};

export const getTaxBracket = (incomePerHour) => {
  const annual = incomePerHour * 8760;
  let bracket = TAX_BRACKETS[0];
  for (const b of TAX_BRACKETS) {
    if (annual >= b.min) bracket = b;
  }
  return bracket;
};