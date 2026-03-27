// src/data/oilGasData.js
// ═══════════════════════════════════════════════════════
// OIL & GAS SYSTEM — Wells, Customers, Contracts, Stock
// ═══════════════════════════════════════════════════════

// ─── WELL TYPES ───
export const WELL_TYPES = {
  oil: [
    { id: 'shallow_oil', name: 'Shallow Oil Well', cost: 5000000, productionPerDay: 500, maxLifespan: 365, unit: 'bbl', image: '🛢️' },
    { id: 'medium_oil', name: 'Medium Depth Well', cost: 15000000, productionPerDay: 1500, maxLifespan: 730, unit: 'bbl', image: '🛢️' },
    { id: 'deep_oil', name: 'Deep Oil Well', cost: 40000000, productionPerDay: 4000, maxLifespan: 1095, unit: 'bbl', image: '🛢️' },
    { id: 'offshore_oil', name: 'Offshore Platform', cost: 100000000, productionPerDay: 10000, maxLifespan: 1460, unit: 'bbl', image: '🏗️' },
    { id: 'mega_oil', name: 'Mega Oil Field', cost: 250000000, productionPerDay: 25000, maxLifespan: 1825, unit: 'bbl', image: '🏗️' },
  ],
  gas: [
    { id: 'shallow_gas', name: 'Shallow Gas Well', cost: 3000000, productionPerDay: 300, maxLifespan: 365, unit: 'm³', image: '💨' },
    { id: 'medium_gas', name: 'Medium Gas Well', cost: 10000000, productionPerDay: 1000, maxLifespan: 730, unit: 'm³', image: '💨' },
    { id: 'deep_gas', name: 'Deep Gas Well', cost: 30000000, productionPerDay: 3000, maxLifespan: 1095, unit: 'm³', image: '💨' },
    { id: 'shale_gas', name: 'Shale Gas Operation', cost: 80000000, productionPerDay: 8000, maxLifespan: 1460, unit: 'm³', image: '⛽' },
    { id: 'mega_gas', name: 'Mega Gas Field', cost: 200000000, productionPerDay: 20000, maxLifespan: 1825, unit: 'm³', image: '⛽' },
  ],
};

// ─── STATIC CUSTOMERS ───
export const OIL_GAS_CUSTOMERS = [
  {
    id: 'cust_refinery_small',
    name: 'Bharat Refinery Co.',
    logo: '🏭',
    tier: 'small',
    contracts: [
      { id: 'c1', requirements: { oil: 5000 }, reward: 1000000, duration: 2 * 3600, description: 'Small crude oil batch' },
      { id: 'c2', requirements: { oil: 10000, gas: 2000 }, reward: 2500000, duration: 4 * 3600, description: 'Mixed fuel supply' },
    ],
  },
  {
    id: 'cust_petro_mid',
    name: 'National Petroleum Ltd.',
    logo: '⛽',
    tier: 'medium',
    contracts: [
      { id: 'c3', requirements: { oil: 50000 }, reward: 8000000, duration: 6 * 3600, description: 'Bulk crude delivery' },
      { id: 'c4', requirements: { oil: 30000, gas: 15000 }, reward: 10000000, duration: 8 * 3600, description: 'Combined energy supply' },
    ],
  },
  {
    id: 'cust_gas_utility',
    name: 'City Gas Distribution',
    logo: '🔥',
    tier: 'medium',
    contracts: [
      { id: 'c5', requirements: { gas: 20000 }, reward: 5000000, duration: 4 * 3600, description: 'City gas supply' },
      { id: 'c6', requirements: { gas: 50000 }, reward: 12000000, duration: 8 * 3600, description: 'Large-scale gas delivery' },
    ],
  },
  {
    id: 'cust_power_plant',
    name: 'Mega Power Corp.',
    logo: '⚡',
    tier: 'large',
    contracts: [
      { id: 'c7', requirements: { gas: 100000 }, reward: 25000000, duration: 12 * 3600, description: 'Power plant fuel supply' },
      { id: 'c8', requirements: { oil: 100000, gas: 50000 }, reward: 40000000, duration: 16 * 3600, description: 'Dual fuel power supply' },
    ],
  },
  {
    id: 'cust_international',
    name: 'Global Energy Trading',
    logo: '🌍',
    tier: 'large',
    contracts: [
      { id: 'c9', requirements: { oil: 200000 }, reward: 50000000, duration: 20 * 3600, description: 'International crude export' },
      { id: 'c10', requirements: { oil: 150000, gas: 100000 }, reward: 70000000, duration: 24 * 3600, description: 'Global energy package' },
    ],
  },
  {
    id: 'cust_govt',
    name: 'Government Strategic Reserve',
    logo: '🏛️',
    tier: 'premium',
    contracts: [
      { id: 'c11', requirements: { oil: 500000 }, reward: 120000000, duration: 36 * 3600, description: 'Strategic petroleum reserve' },
      { id: 'c12', requirements: { oil: 300000, gas: 200000 }, reward: 150000000, duration: 48 * 3600, description: 'National energy security supply' },
    ],
  },
];

// ─── STOCK CONFIG ───
export const STOCK_PRICES = {
  oil: 5000,  // ₹ per bbl
  gas: 3000,  // ₹ per m³
};

// ─── HELPER FUNCTIONS ───

export const getWellTypes = (fuelType) => {
  return WELL_TYPES[fuelType] || [];
};

export const getWellById = (fuelType, wellId) => {
  const wells = getWellTypes(fuelType);
  return wells.find(w => w.id === wellId) || null;
};

export const getCustomers = () => {
  return OIL_GAS_CUSTOMERS;
};

export const getCustomerById = (customerId) => {
  return OIL_GAS_CUSTOMERS.find(c => c.id === customerId) || null;
};

export const getContractById = (customerId, contractId) => {
  const customer = getCustomerById(customerId);
  if (!customer) return null;
  return customer.contracts.find(c => c.id === contractId) || null;
};

export const canSignContract = (stock, requirements) => {
  for (const [fuelType, amount] of Object.entries(requirements)) {
    if ((stock[fuelType] || 0) < amount) return false;
  }
  return true;
};

export const getNextAvailableCustomer = (completedContracts, activeContract) => {
  // Rotate through customers — always show one that isn't active
  const activeCustomerId = activeContract?.customerId;
  const available = OIL_GAS_CUSTOMERS.filter(c => c.id !== activeCustomerId);

  if (available.length === 0) return OIL_GAS_CUSTOMERS[0];

  // Use completed count as rotation seed
  const idx = (completedContracts || 0) % available.length;
  return available[idx];
};

// ─── RANDOM QUANTITY GENERATOR ───
const generateRandomQuantity = (base, variance = 0.5) => {
  const min = Math.floor(base * (1 - variance));
  const max = Math.floor(base * (1 + variance));
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ─── GENERATE CONTRACT WITH RANDOM QUANTITIES ───
export const generateContractForCustomer = (customer) => {
  if (!customer || !customer.contracts || customer.contracts.length === 0) return null;
  
  // Random contract template select કરો
  const templateIdx = Math.floor(Math.random() * customer.contracts.length);
  const template = customer.contracts[templateIdx];
  
  // Random quantities generate કરો
  const randomRequirements = {};
  Object.entries(template.requirements).forEach(([fuel, baseAmount]) => {
    randomRequirements[fuel] = generateRandomQuantity(baseAmount, 0.4); // ±40% variance
  });
  
  // Random reward (quantity based)
  const quantityMultiplier = Object.values(randomRequirements).reduce((a, b) => a + b, 0) / 
                             Object.values(template.requirements).reduce((a, b) => a + b, 0);
  const randomReward = Math.floor(template.reward * quantityMultiplier * (0.9 + Math.random() * 0.2));
  
  return {
    ...template,
    id: `${template.id}_${Date.now()}`, // Unique ID
    requirements: randomRequirements,
    reward: randomReward,
    generatedAt: Date.now(),
  };
};

export const calcDailyProduction = (wells) => {
  const production = { oil: 0, gas: 0 };

  Object.entries(wells || {}).forEach(([fuelType, wellList]) => {
    (wellList || []).forEach(well => {
      if (well.active) {
        production[fuelType] = (production[fuelType] || 0) + (well.productionPerDay || 0);
      }
    });
  });

  return production;
};

export const calcProductionPerHour = (wells) => {
  const daily = calcDailyProduction(wells);
  return {
    oil: Math.floor(daily.oil / 24),
    gas: Math.floor(daily.gas / 24),
  };
};

export const calcOilGasIncome = (biz) => {
  if (!biz.oilgas) return 0;

  let income = 0;

  // Active contract income (averaged over duration)
  const contract = biz.oilgas.activeContract;
  if (contract && contract.endTime && Date.now() < contract.endTime) {
    const totalDuration = (contract.endTime - contract.startTime) / 3600000;
    if (totalDuration > 0) {
      income += Math.floor(contract.reward / totalDuration);
    }
  }

  // Base production value
  const hourly = calcProductionPerHour(biz.oilgas.wells);
  income += hourly.oil * (STOCK_PRICES.oil / 24);
  income += hourly.gas * (STOCK_PRICES.gas / 24);

  return Math.floor(income);
};