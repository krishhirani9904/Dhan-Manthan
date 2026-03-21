import airplanePng from '../assets/airplane.png';


export const CARS = [
  { id: 'car_1', name: 'City Runner', price: 800000, image: '🚗', category: 'sedan' },
  { id: 'car_2', name: 'Urban Glide', price: 1500000, image: '🚙', category: 'suv' },
  { id: 'car_3', name: 'Thunder Bolt', price: 3000000, image: '🏎️', category: 'sports' },
  { id: 'car_4', name: 'Royal Cruiser', price: 5500000, image: '🚘', category: 'luxury' },
  { id: 'car_5', name: 'Phantom Edge', price: 10000000, image: '🏎️', category: 'supercar' },
  { id: 'car_6', name: 'Golden Stallion', price: 25000000, image: '🚗', category: 'hypercar' },
  { id: 'car_7', name: 'Diamond Fury', price: 50000000, image: '🏎️', category: 'hypercar' },
  { id: 'car_8', name: 'Titan Supreme', price: 100000000, image: '🚘', category: 'ultra' },
];

export const ENGINE_TYPES = [
  { id: 'df', name: 'Default', label: 'DF', priceMultiplier: 1.0 },
  { id: 'bst', name: 'BST Engine', label: 'BST +15%', priceMultiplier: 1.15 },
  { id: 'splus', name: 'S+ Engine', label: 'S+ +35%', priceMultiplier: 1.35 },
];

export const EQUIPMENT_OPTIONS = [
  { id: 'standard', name: 'Standard', priceMultiplier: 1.0 },
  { id: 'premium', name: 'Premium +40%', priceMultiplier: 1.40 },
];

// export const AIRCRAFT = [
//   { id: 'air_1', name: 'Sky Hopper', price: 15000000, image: '🛩️' },
//   { id: 'air_2', name: 'Cloud Rider', price: 50000000, image: '✈️' },
//   { id: 'air_3', name: 'Storm Chaser', price: 120000000, image: '🛩️' },
//   { id: 'air_4', name: 'Eagle One', price: 300000000, image: '✈️' },
//   { id: 'air_5', name: 'Falcon Elite', price: 750000000, image: '🛩️' },
//   { id: 'air_6', name: 'Phoenix Ultra', price: 2000000000, image: '✈️' },
// ];
export const AIRCRAFT = [
  { id: 'air_1', name: 'Sky Hopper', price: 15000000, image: airplanePng, isEmoji: false },
  { id: 'air_2', name: 'Cloud Rider', price: 50000000, image: '✈️', isEmoji: true },
  { id: 'air_3', name: 'Storm Chaser', price: 120000000, image: '🛩️', isEmoji: true },
  { id: 'air_4', name: 'Eagle One', price: 300000000, image: '✈️', isEmoji: true },
  { id: 'air_5', name: 'Falcon Elite', price: 750000000, image: '🛩️', isEmoji: true },
  { id: 'air_6', name: 'Phoenix Ultra', price: 2000000000, image: '✈️', isEmoji: true },
];

export const AIRCRAFT_TEAM_COST_PERCENT = 0.10;
export const AIRCRAFT_DESIGN_OPTIONS = [
  { id: 'standard', name: 'Standard Design', priceMultiplier: 1.0 },
  { id: 'premium', name: 'Premium +25%', priceMultiplier: 1.25 },
];

export const YACHTS = [
  { id: 'yacht_1', name: 'Wave Dancer', price: 20000000, image: '🚤' },
  { id: 'yacht_2', name: 'Sea Breeze', price: 75000000, image: '🛥️' },
  { id: 'yacht_3', name: 'Ocean King', price: 200000000, image: '⛵' },
  { id: 'yacht_4', name: 'Neptune Crown', price: 500000000, image: '🚢' },
  { id: 'yacht_5', name: 'Poseidon Elite', price: 1500000000, image: '🛥️' },
  { id: 'yacht_6', name: 'Atlantis Supreme', price: 5000000000, image: '🚢' },
];

export const YACHT_TEAM_COST_PERCENT = 0.15;
export const YACHT_DESIGN_OPTIONS = [
  { id: 'standard', name: 'Standard Design', priceMultiplier: 1.0 },
  { id: 'premium', name: 'Premium +30%', priceMultiplier: 1.30 },
];

export const YACHT_LOCATIONS = [
  { id: 'public_harbor', name: 'Public Harbor', image: '⚓', isDefault: true },
  { id: 'marina_bay', name: 'Marina Bay', image: '🏖️' },
  { id: 'royal_dock', name: 'Royal Dock', image: '👑' },
  { id: 'sunset_pier', name: 'Sunset Pier', image: '🌅' },
  { id: 'island_port', name: 'Island Port', image: '🏝️' },
];