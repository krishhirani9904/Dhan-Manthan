// src/data/fleetVehicles.js
// ═══════════════════════════════════════════════════════
// FLEET VEHICLE DATA — Taxi, Shipping, Airlines
// ═══════════════════════════════════════════════════════

// ─── TAXI CARS ───
export const TAXI_CARS = [
  // Economy
  { id: 'swift_rider', name: 'Swift Rider', type: 'economy', price: 40000, incomePerHour: 120, resourceKm: 80000, image: '🚗' },
  { id: 'city_cruiser', name: 'City Cruiser', type: 'economy', price: 45000, incomePerHour: 135, resourceKm: 85000, image: '🚗' },
  { id: 'metro_go', name: 'Metro Go', type: 'economy', price: 50000, incomePerHour: 150, resourceKm: 90000, image: '🚗' },
  { id: 'urban_dash', name: 'Urban Dash', type: 'economy', price: 55000, incomePerHour: 160, resourceKm: 95000, image: '🚗' },

  // Comfort
  { id: 'comfort_glide', name: 'Comfort Glide', type: 'comfort', price: 75000, incomePerHour: 220, resourceKm: 100000, image: '🚙' },
  { id: 'smooth_ride', name: 'Smooth Ride', type: 'comfort', price: 85000, incomePerHour: 250, resourceKm: 110000, image: '🚙' },
  { id: 'ease_liner', name: 'Ease Liner', type: 'comfort', price: 90000, incomePerHour: 270, resourceKm: 115000, image: '🚙' },
  { id: 'plush_cab', name: 'Plush Cab', type: 'comfort', price: 95000, incomePerHour: 290, resourceKm: 120000, image: '🚙' },

  // Comfort+
  { id: 'luxury_glide', name: 'Luxury Glide', type: 'comfort_plus', price: 120000, incomePerHour: 350, resourceKm: 120000, image: '🚘' },
  { id: 'premium_wave', name: 'Premium Wave', type: 'comfort_plus', price: 135000, incomePerHour: 400, resourceKm: 130000, image: '🚘' },
  { id: 'velvet_ride', name: 'Velvet Ride', type: 'comfort_plus', price: 150000, incomePerHour: 440, resourceKm: 140000, image: '🚘' },

  // Business
  { id: 'exec_sedan', name: 'Exec Sedan', type: 'business', price: 200000, incomePerHour: 550, resourceKm: 150000, image: '🏎️' },
  { id: 'corp_chariot', name: 'Corp Chariot', type: 'business', price: 230000, incomePerHour: 620, resourceKm: 160000, image: '🏎️' },
  { id: 'board_runner', name: 'Board Runner', type: 'business', price: 260000, incomePerHour: 700, resourceKm: 170000, image: '🏎️' },

  // Premier
  { id: 'diamond_cab', name: 'Diamond Cab', type: 'premier', price: 350000, incomePerHour: 900, resourceKm: 180000, image: '💎' },
  { id: 'platinum_ride', name: 'Platinum Ride', type: 'premier', price: 400000, incomePerHour: 1050, resourceKm: 200000, image: '💎' },
  { id: 'gold_express', name: 'Gold Express', type: 'premier', price: 450000, incomePerHour: 1200, resourceKm: 220000, image: '💎' },

  // Elite
  { id: 'royal_fleet', name: 'Royal Fleet', type: 'elite', price: 600000, incomePerHour: 1500, resourceKm: 200000, image: '👑' },
  { id: 'crown_liner', name: 'Crown Liner', type: 'elite', price: 750000, incomePerHour: 1800, resourceKm: 250000, image: '👑' },
  { id: 'emperor_class', name: 'Emperor Class', type: 'elite', price: 900000, incomePerHour: 2200, resourceKm: 300000, image: '👑' },
];

export const TAXI_FILTERS = [
  { id: 'economy', name: 'Economy' },
  { id: 'comfort', name: 'Comfort' },
  { id: 'comfort_plus', name: 'Comfort+' },
  { id: 'business', name: 'Business' },
  { id: 'premier', name: 'Premier' },
  { id: 'elite', name: 'Elite' },
];

// ─── SHIPPING VEHICLES ───
export const SHIPPING_VEHICLES = [
  // City
  { id: 'mini_courier', name: 'Mini Courier', type: 'city', price: 60000, incomePerHour: 150, resourceKm: 60000, image: '🚐', capacity: '500kg' },
  { id: 'city_van', name: 'City Van', type: 'city', price: 80000, incomePerHour: 200, resourceKm: 70000, image: '🚐', capacity: '800kg' },
  { id: 'metro_cargo', name: 'Metro Cargo', type: 'city', price: 100000, incomePerHour: 260, resourceKm: 75000, image: '🚐', capacity: '1 Ton' },
  { id: 'urban_freight', name: 'Urban Freight', type: 'city', price: 120000, incomePerHour: 300, resourceKm: 80000, image: '🚚', capacity: '2 Ton' },
  { id: 'express_local', name: 'Express Local', type: 'city', price: 150000, incomePerHour: 380, resourceKm: 90000, image: '🚚', capacity: '3 Ton' },

  // Long Distance
  { id: 'highway_hauler', name: 'Highway Hauler', type: 'long_distance', price: 250000, incomePerHour: 550, resourceKm: 120000, image: '🛻', capacity: '5 Ton' },
  { id: 'interstate_cargo', name: 'Interstate Cargo', type: 'long_distance', price: 400000, incomePerHour: 800, resourceKm: 180000, image: '🛻', capacity: '10 Ton' },
  { id: 'heavy_liner', name: 'Heavy Liner', type: 'long_distance', price: 500000, incomePerHour: 1000, resourceKm: 200000, image: '🚛', capacity: '15 Ton' },
  { id: 'mega_transport', name: 'Mega Transport', type: 'long_distance', price: 700000, incomePerHour: 1400, resourceKm: 250000, image: '🚛', capacity: '20 Ton' },
  { id: 'titan_freight', name: 'Titan Freight', type: 'long_distance', price: 800000, incomePerHour: 1800, resourceKm: 300000, image: '📦', capacity: '25 Ton' },
  { id: 'continental_max', name: 'Continental Max', type: 'long_distance', price: 1000000, incomePerHour: 2500, resourceKm: 350000, image: '📦', capacity: '30 Ton' },
];

export const SHIPPING_FILTERS = [
  { id: 'city', name: 'City' },
  { id: 'long_distance', name: 'Long Distance' },
];

// ─── FLEET EXPANSION CONFIG ───
export const FLEET_EXPANSION = {
  taxi: {
    defaultCapacity: 5,
    tiers: [
      { id: 'tier_5', slots: 5, cost: 25000, time: 9 * 60 },
      { id: 'tier_10', slots: 10, cost: 55000, time: 15 * 60 },
      { id: 'tier_20', slots: 20, cost: 120000, time: 20 * 60 },
    ],
    timeIncreasePerExpansion: 1.25,
  },
  shipping: {
    defaultCapacity: 5,
    tiers: [
      { id: 'tier_5', slots: 5, cost: 40000, time: 12 * 60 },
      { id: 'tier_10', slots: 10, cost: 85000, time: 18 * 60 },
      { id: 'tier_20', slots: 20, cost: 180000, time: 25 * 60 },
    ],
    timeIncreasePerExpansion: 1.3,
  },
};

// ─── FLEET KM ACCUMULATION (per second range) ───
export const FLEET_KM_CONFIG = {
  taxi: { minKmPerHour: 20, maxKmPerHour: 60 },
  shipping: { minKmPerHour: 30, maxKmPerHour: 80 },
};

// ─── SORT OPTIONS ───
export const FLEET_SORT_OPTIONS = [
  { id: 'highest_mileage', name: 'Highest Mileage' },
  { id: 'lowest_mileage', name: 'Lowest Mileage' },
  { id: 'highest_income', name: 'Highest Income' },
  { id: 'lowest_income', name: 'Lowest Income' },
];

// ─── HELPER FUNCTIONS ───

export const getVehiclesForCategory = (categoryId) => {
  if (categoryId === 'taxi') return TAXI_CARS;
  if (categoryId === 'shipping') return SHIPPING_VEHICLES;
  return [];
};

export const getFiltersForCategory = (categoryId) => {
  if (categoryId === 'taxi') return TAXI_FILTERS;
  if (categoryId === 'shipping') return SHIPPING_FILTERS;
  return [];
};

export const getExpansionConfig = (categoryId) => {
  return FLEET_EXPANSION[categoryId] || FLEET_EXPANSION.taxi;
};

export const getKmConfig = (categoryId) => {
  return FLEET_KM_CONFIG[categoryId] || FLEET_KM_CONFIG.taxi;
};

export const getDefaultFleetCapacity = (categoryId) => {
  const config = getExpansionConfig(categoryId);
  return config.defaultCapacity;
};

export const getVehicleById = (categoryId, vehicleId) => {
  const vehicles = getVehiclesForCategory(categoryId);
  return vehicles.find(v => v.id === vehicleId) || null;
};

export const sortFleetVehicles = (vehicles, sortBy, categoryId) => {
  const sorted = [...vehicles];
  switch (sortBy) {
    case 'highest_mileage':
      return sorted.sort((a, b) => (b.kmDriven || 0) - (a.kmDriven || 0));
    case 'lowest_mileage':
      return sorted.sort((a, b) => (a.kmDriven || 0) - (b.kmDriven || 0));
    case 'highest_income':
      return sorted.sort((a, b) => (b.incomePerHour || 0) - (a.incomePerHour || 0));
    case 'lowest_income':
      return sorted.sort((a, b) => (a.incomePerHour || 0) - (b.incomePerHour || 0));
    default:
      return sorted;
  }
};
