// src/data/businessRequirements.js
export const VEHICLE_CATEGORIES = {
  'taxi': {
    types: [
      { id: 'economy', name: 'Economy', cost: 40000, incomePerHour: 120, maxKm: 80000, icon: '🚗' },
      { id: 'comfort', name: 'Comfort', cost: 75000, incomePerHour: 220, maxKm: 100000, icon: '🚙' },
      { id: 'comfort_plus', name: 'Comfort+', cost: 120000, incomePerHour: 350, maxKm: 120000, icon: '🚘' },
      { id: 'business', name: 'Business', cost: 200000, incomePerHour: 550, maxKm: 150000, icon: '🏎️' },
      { id: 'premier', name: 'Premier', cost: 350000, incomePerHour: 900, maxKm: 180000, icon: '💎' },
      { id: 'elite', name: 'Elite', cost: 600000, incomePerHour: 1500, maxKm: 200000, icon: '👑' },
    ],
    parkingDefault: 5,
    parkingExpansionCost: 25000,
    parkingExpansionSlots: 5,
    driverCostPer: 8000,
    kmPerHour: { min: 20, max: 60 },
  },

  'shipping': {
    types: [
      { id: 'mini_van', name: 'Mini Van', cost: 60000, incomePerHour: 150, maxKm: 60000, capacity: '500kg', range: 'City', icon: '🚐' },
      { id: 'cargo_van', name: 'Cargo Van', cost: 120000, incomePerHour: 300, maxKm: 80000, capacity: '2 Ton', range: 'City+', icon: '🚚' },
      { id: 'light_truck', name: 'Light Truck', cost: 250000, incomePerHour: 550, maxKm: 120000, capacity: '5 Ton', range: 'State', icon: '🛻' },
      { id: 'heavy_truck', name: 'Heavy Truck', cost: 500000, incomePerHour: 1000, maxKm: 200000, capacity: '15 Ton', range: 'National', icon: '🚛' },
      { id: 'container', name: 'Container Truck', cost: 800000, incomePerHour: 1800, maxKm: 300000, capacity: '25 Ton', range: 'National+', icon: '📦' },
    ],
    driverCostPer: 10000,
    loaderCostPer: 5000,
    kmPerHour: { min: 30, max: 80 },
  },

  'airlines': {
    types: [
      { id: 'regional_jet', name: 'Regional Jet', cost: 5000000000, incomePerHour: 500000, maxKm: 5000000, capacity: 80, range: 'Domestic Short', icon: '✈️' },
      { id: 'narrow_body', name: 'Narrow Body', cost: 10000000000, incomePerHour: 1200000, maxKm: 8000000, capacity: 150, range: 'Domestic', icon: '🛩️' },
      { id: 'wide_body', name: 'Wide Body', cost: 20000000000, incomePerHour: 3000000, maxKm: 15000000, capacity: 300, range: 'International', icon: '🛫' },
    ],
    pilotCostPer: 100000,
    crewCostPerVehicle: 6,
    crewCostPer: 30000,
    kmPerHour: { min: 500, max: 900 },
  },
};

export const STAFF_TYPES = {
  'chai-stall': [
    { id: 'worker', name: 'Worker', costPer: 500, incomeBoost: 5, min: 1, max: 5 },
  ],
  'shop': [
    { id: 'salesperson', name: 'Salesperson', costPer: 6000, incomeBoost: 6, min: 1, max: 20 },
    { id: 'manager', name: 'Manager', costPer: 15000, incomeBoost: 10, min: 0, max: 3 },
  ],
  'salon': [
    { id: 'stylist', name: 'Stylist', costPer: 8000, incomeBoost: 10, min: 1, max: 10 },
    { id: 'assistant', name: 'Assistant', costPer: 3000, incomeBoost: 3, min: 0, max: 5 },
  ],
  'restaurant': [
    { id: 'chef', name: 'Chef', costPer: 15000, incomeBoost: 12, min: 1, max: 10 },
    { id: 'waiter', name: 'Waiter', costPer: 5000, incomeBoost: 5, min: 2, max: 20 },
    { id: 'cleaner', name: 'Cleaner', costPer: 3000, incomeBoost: 2, min: 1, max: 5 },
  ],
  'medical-store': [
    { id: 'pharmacist', name: 'Pharmacist', costPer: 12000, incomeBoost: 10, min: 1, max: 5, required: true },
    { id: 'helper', name: 'Helper', costPer: 4000, incomeBoost: 4, min: 1, max: 10 },
  ],
  'taxi': [
    { id: 'driver', name: 'Driver', costPer: 8000, incomeBoost: 8, min: 0, max: 100, perVehicle: true },
  ],
  'ice-cream': [
    { id: 'server', name: 'Server', costPer: 4000, incomeBoost: 5, min: 1, max: 8 },
  ],
  'tuition': [
    { id: 'teacher', name: 'Teacher', costPer: 10000, incomeBoost: 12, min: 1, max: 20 },
    { id: 'admin', name: 'Admin Staff', costPer: 6000, incomeBoost: 5, min: 1, max: 3 },
  ],
  'garage': [
    { id: 'mechanic', name: 'Mechanic', costPer: 8000, incomeBoost: 10, min: 2, max: 15 },
    { id: 'helper', name: 'Helper', costPer: 3500, incomeBoost: 3, min: 1, max: 10 },
  ],
  'shipping': [
    { id: 'driver', name: 'Driver', costPer: 10000, incomeBoost: 8, min: 0, max: 50, perVehicle: true },
    { id: 'loader', name: 'Loader', costPer: 5000, incomeBoost: 4, min: 2, max: 20 },
  ],
  'factory': [
    { id: 'worker', name: 'Factory Worker', costPer: 6000, incomeBoost: 3, min: 10, max: 100 },
    { id: 'supervisor', name: 'Supervisor', costPer: 15000, incomeBoost: 8, min: 1, max: 10 },
    { id: 'manager', name: 'Manager', costPer: 25000, incomeBoost: 10, min: 1, max: 5 },
  ],
  'construction': [
    { id: 'worker', name: 'Worker', costPer: 5000, incomeBoost: 2, min: 20, max: 200 },
    { id: 'engineer', name: 'Engineer', costPer: 20000, incomeBoost: 10, min: 2, max: 20 },
    { id: 'architect', name: 'Architect', costPer: 30000, incomeBoost: 12, min: 1, max: 5 },
  ],
  'car-dealership': [
    { id: 'salesperson', name: 'Salesperson', costPer: 12000, incomeBoost: 8, min: 3, max: 20 },
    { id: 'manager', name: 'Manager', costPer: 25000, incomeBoost: 10, min: 1, max: 3 },
  ],
  'it-company': [
    { id: 'junior_dev', name: 'Junior Developer', costPer: 20000, incomeBoost: 6, min: 2, max: 50 },
    { id: 'senior_dev', name: 'Senior Developer', costPer: 45000, incomeBoost: 12, min: 1, max: 30 },
    { id: 'designer', name: 'UI/UX Designer', costPer: 25000, incomeBoost: 6, min: 1, max: 20 },
    { id: 'manager', name: 'Project Manager', costPer: 40000, incomeBoost: 8, min: 1, max: 10 },
  ],
  'hotel': [
    { id: 'receptionist', name: 'Receptionist', costPer: 8000, incomeBoost: 5, min: 2, max: 10 },
    { id: 'housekeeper', name: 'Housekeeper', costPer: 5000, incomeBoost: 4, min: 5, max: 50 },
    { id: 'manager', name: 'Manager', costPer: 30000, incomeBoost: 10, min: 1, max: 5 },
  ],
  'bank': [
    { id: 'teller', name: 'Teller', costPer: 12000, incomeBoost: 5, min: 5, max: 50 },
    { id: 'officer', name: 'Loan Officer', costPer: 25000, incomeBoost: 8, min: 2, max: 20 },
    { id: 'manager', name: 'Branch Manager', costPer: 50000, incomeBoost: 10, min: 1, max: 5 },
  ],
  'hospital': [
    { id: 'doctor', name: 'Doctor', costPer: 50000, incomeBoost: 12, min: 5, max: 100 },
    { id: 'nurse', name: 'Nurse', costPer: 15000, incomeBoost: 6, min: 10, max: 200 },
    { id: 'admin', name: 'Admin Staff', costPer: 10000, incomeBoost: 3, min: 3, max: 30 },
  ],
  'sports-club': [
    { id: 'player', name: 'Player', costPer: 100000, incomeBoost: 15, min: 15, max: 50 },
    { id: 'coach', name: 'Coach', costPer: 50000, incomeBoost: 10, min: 2, max: 10 },
    { id: 'support', name: 'Support Staff', costPer: 15000, incomeBoost: 3, min: 10, max: 50 },
  ],
  'media': [
    { id: 'journalist', name: 'Journalist', costPer: 20000, incomeBoost: 8, min: 10, max: 100 },
    { id: 'anchor', name: 'News Anchor', costPer: 50000, incomeBoost: 12, min: 2, max: 20 },
    { id: 'technician', name: 'Technician', costPer: 15000, incomeBoost: 5, min: 5, max: 50 },
  ],
  'oil-gas': [
    { id: 'engineer', name: 'Engineer', costPer: 40000, incomeBoost: 10, min: 10, max: 100 },
    { id: 'worker', name: 'Field Worker', costPer: 12000, incomeBoost: 3, min: 50, max: 500 },
    { id: 'geologist', name: 'Geologist', costPer: 60000, incomeBoost: 8, min: 2, max: 20 },
  ],
  'airlines': [
    { id: 'pilot', name: 'Pilot', costPer: 100000, incomeBoost: 10, min: 0, max: 200, perVehicle: true, perVehicleCount: 2 },
    { id: 'crew', name: 'Cabin Crew', costPer: 30000, incomeBoost: 5, min: 0, max: 600, perVehicle: true, perVehicleCount: 6 },
    { id: 'ground', name: 'Ground Staff', costPer: 15000, incomeBoost: 3, min: 50, max: 500 },
  ],
};

export const EQUIPMENT_TYPES = {
  'chai-stall': [
    { id: 'stove', name: 'Gas Stove', cost: 1000, incomeBoost: 10, required: true, max: 1 },
    { id: 'utensils', name: 'Utensils Set', cost: 500, incomeBoost: 5, required: true, max: 1 },
    { id: 'bench', name: 'Seating Bench', cost: 800, incomeBoost: 3, max: 5 },
  ],
  'salon': [
    { id: 'chair', name: 'Salon Chair', cost: 10000, incomeBoost: 5, min: 2, max: 20 },
    { id: 'products', name: 'Hair Products Kit', cost: 5000, incomeBoost: 8, required: true, max: 1 },
    { id: 'mirror_station', name: 'Mirror Station', cost: 8000, incomeBoost: 4, max: 10 },
  ],
  'restaurant': [
    { id: 'kitchen', name: 'Commercial Kitchen', cost: 50000, incomeBoost: 15, required: true, max: 1 },
    { id: 'tables', name: 'Dining Table Set', cost: 5000, incomeBoost: 2, min: 5, max: 50 },
    { id: 'pos', name: 'POS System', cost: 15000, incomeBoost: 5, max: 1 },
  ],
  'ice-cream': [
    { id: 'freezer', name: 'Deep Freezer', cost: 30000, incomeBoost: 15, required: true, max: 1 },
    { id: 'counter', name: 'Display Counter', cost: 15000, incomeBoost: 8, required: true, max: 1 },
    { id: 'machine', name: 'Soft Serve Machine', cost: 40000, incomeBoost: 12, max: 3 },
  ],
  'tuition': [
    { id: 'classroom', name: 'Classroom Setup', cost: 20000, incomeBoost: 8, min: 1, max: 10 },
    { id: 'supplies', name: 'Study Material Kit', cost: 5000, incomeBoost: 3, required: true, max: 1 },
    { id: 'projector', name: 'Smart Projector', cost: 25000, incomeBoost: 6, max: 5 },
  ],
  'garage': [
    { id: 'lift', name: 'Hydraulic Lift', cost: 50000, incomeBoost: 12, min: 1, max: 5 },
    { id: 'tools', name: 'Tool Set (Pro)', cost: 25000, incomeBoost: 10, required: true, max: 1 },
    { id: 'diagnostic', name: 'Diagnostic Scanner', cost: 35000, incomeBoost: 8, max: 3 },
  ],
  'factory': [
    { id: 'machinery', name: 'Production Machine', cost: 500000, incomeBoost: 15, min: 1, max: 10 },
    { id: 'conveyor', name: 'Conveyor Belt', cost: 200000, incomeBoost: 8, max: 5 },
    { id: 'quality', name: 'Quality Check Station', cost: 100000, incomeBoost: 5, max: 3 },
  ],
  'construction': [
    { id: 'crane', name: 'Tower Crane', cost: 1000000, incomeBoost: 15, min: 1, max: 5 },
    { id: 'truck', name: 'Dump Truck', cost: 200000, incomeBoost: 5, min: 2, max: 20 },
    { id: 'mixer', name: 'Concrete Mixer', cost: 150000, incomeBoost: 6, max: 10 },
  ],
  'car-dealership': [
    { id: 'showroom', name: 'Showroom Space', cost: 500000, incomeBoost: 15, required: true, max: 1 },
    { id: 'service_center', name: 'Service Center', cost: 300000, incomeBoost: 10, max: 1 },
  ],
  'it-company': [
    { id: 'computers', name: 'Workstation', cost: 50000, incomeBoost: 2, min: 5, max: 100 },
    { id: 'servers', name: 'Server Rack', cost: 200000, incomeBoost: 5, min: 1, max: 10 },
    { id: 'office', name: 'Office Space', cost: 500000, incomeBoost: 12, required: true, max: 1 },
  ],
  'hotel': [
    { id: 'rooms', name: 'Hotel Room', cost: 100000, incomeBoost: 8, min: 10, max: 200 },
    { id: 'restaurant_amenity', name: 'In-House Restaurant', cost: 500000, incomeBoost: 15, max: 1 },
    { id: 'gym', name: 'Fitness Center', cost: 200000, incomeBoost: 8, max: 1 },
    { id: 'pool', name: 'Swimming Pool', cost: 300000, incomeBoost: 10, max: 1 },
  ],
  'bank': [
    { id: 'branch', name: 'Branch Office', cost: 1000000, incomeBoost: 12, min: 1, max: 20 },
    { id: 'atm', name: 'ATM Machine', cost: 200000, incomeBoost: 3, min: 2, max: 50 },
    { id: 'vault', name: 'Security Vault', cost: 500000, incomeBoost: 8, max: 5 },
  ],
  'hospital': [
    { id: 'beds', name: 'Hospital Bed', cost: 50000, incomeBoost: 2, min: 20, max: 500 },
    { id: 'medical_equipment', name: 'Medical Equipment', cost: 1000000, incomeBoost: 10, min: 1, max: 20 },
    { id: 'emergency', name: 'Emergency Dept', cost: 2000000, incomeBoost: 15, required: true, max: 1 },
    { id: 'surgery', name: 'Surgery Wing', cost: 5000000, incomeBoost: 20, max: 1 },
    { id: 'icu', name: 'ICU Unit', cost: 3000000, incomeBoost: 18, max: 1 },
  ],
  'sports-club': [
    { id: 'stadium', name: 'Stadium', cost: 10000000, incomeBoost: 25, required: true, max: 1 },
    { id: 'training', name: 'Training Facility', cost: 2000000, incomeBoost: 10, max: 1 },
    { id: 'gym_facility', name: 'Pro Gym', cost: 500000, incomeBoost: 5, max: 1 },
  ],
  'media': [
    { id: 'studio', name: 'Production Studio', cost: 5000000, incomeBoost: 20, required: true, max: 1 },
    { id: 'broadcast', name: 'Broadcast Equipment', cost: 2000000, incomeBoost: 15, required: true, max: 1 },
    { id: 'van', name: 'OB Van', cost: 800000, incomeBoost: 8, max: 5 },
  ],
  'oil-gas': [
    { id: 'rig', name: 'Drilling Rig', cost: 20000000, incomeBoost: 20, min: 1, max: 10 },
    { id: 'pipeline', name: 'Pipeline Section', cost: 10000000, incomeBoost: 15, min: 1, max: 5 },
    { id: 'refinery', name: 'Mini Refinery', cost: 50000000, incomeBoost: 25, max: 1 },
  ],
  'airlines': [
    { id: 'hangar', name: 'Aircraft Hangar', cost: 50000000, incomeBoost: 15, required: true, max: 1 },
    { id: 'lounge', name: 'VIP Lounge', cost: 10000000, incomeBoost: 8, max: 3 },
    { id: 'maintenance', name: 'Maintenance Bay', cost: 20000000, incomeBoost: 10, max: 2 },
  ],
};

export const LICENSE_TYPES = {
  'medical-store': [
    { id: 'drug_license', name: 'Drug License', cost: 10000, required: true, description: 'Mandatory to sell medicines' },
  ],
  'bank': [
    { id: 'rbi_license', name: 'RBI Banking License', cost: 5000000, required: true, description: 'Mandatory to operate banking' },
    { id: 'insurance', name: 'Deposit Insurance', cost: 1000000, description: 'Insure customer deposits' },
  ],
  'oil-gas': [
    { id: 'exploration', name: 'Exploration License', cost: 50000000, required: true, description: 'Government permit for extraction' },
    { id: 'environmental', name: 'Environmental Clearance', cost: 10000000, description: 'Eco clearance certificate' },
  ],
  'airlines': [
    { id: 'aoc', name: 'Air Operator Certificate', cost: 100000000, required: true, description: 'DGCA flight permit' },
    { id: 'route_license', name: 'Route License', cost: 10000000, description: 'Permission for route operations' },
  ],
  'hospital': [
    { id: 'medical_license', name: 'Medical Practice License', cost: 500000, required: true, description: 'Required to treat patients' },
  ],
  'media': [
    { id: 'broadcast_license', name: 'Broadcast License', cost: 2000000, required: true, description: 'MIB broadcasting permit' },
  ],
};

export const INVENTORY_TYPES = {
  'restaurant': [
    { id: 'ingredients', name: 'Kitchen Ingredients', costPerDay: 2000, required: true, description: 'Daily supply of ingredients' },
    { id: 'beverages', name: 'Beverages Stock', costPerDay: 500, description: 'Drinks and beverages' },
  ],
  'medical-store': [
    { id: 'medicines', name: 'Medicines Stock', costPercent: 0.4, required: true, description: '40% of capital as stock' },
    { id: 'surgical', name: 'Surgical Items', costPercent: 0.1, description: 'Surgical supplies' },
  ],
  'shop': [
    { id: 'stock', name: 'Product Stock', costPercent: 0.3, required: true, description: '30% of capital as inventory' },
  ],
  'car-dealership': [
    { id: 'cars', name: 'Car Inventory', costPercent: 0.5, required: true, description: '50% of capital in car stock' },
    { id: 'spare_parts', name: 'Spare Parts', costPercent: 0.1, description: 'Maintenance parts' },
  ],
  'factory': [
    { id: 'raw_materials', name: 'Raw Materials', costPercent: 0.25, required: true, description: 'Production materials' },
    { id: 'packaging', name: 'Packaging Material', costPercent: 0.05, description: 'Product packaging' },
  ],
};

export const CONSTRUCTION_RESOURCES = [
  { id: 'cement', name: 'Cement', unit: 'bags', costPer: 350, icon: '🧱' },
  { id: 'steel', name: 'TMT Steel', unit: 'kg', costPer: 65, icon: '🔩' },
  { id: 'bricks', name: 'Bricks', unit: 'units', costPer: 8, icon: '🧱' },
  { id: 'sand', name: 'River Sand', unit: 'cubic ft', costPer: 45, icon: '⏳' },
  { id: 'gravel', name: 'Gravel', unit: 'cubic ft', costPer: 35, icon: '🪨' },
  { id: 'wood', name: 'Timber', unit: 'cubic ft', costPer: 1200, icon: '🪵' },
  { id: 'paint', name: 'Paint', unit: 'liters', costPer: 250, icon: '🎨' },
  { id: 'electrical', name: 'Electrical Supplies', unit: 'sets', costPer: 5000, icon: '⚡' },
  { id: 'plumbing', name: 'Plumbing Kit', unit: 'sets', costPer: 8000, icon: '🔧' },
];

export const CONSTRUCTION_PROJECTS = [
  { id: 'house', name: 'Residential House', reward: 500000, duration: 2 * 3600, resources: { cement: 200, steel: 500, bricks: 5000, sand: 100, wood: 50, paint: 40, electrical: 2, plumbing: 2 } },
  { id: 'apartment', name: 'Apartment Building', reward: 2000000, duration: 6 * 3600, resources: { cement: 800, steel: 2000, bricks: 20000, sand: 400, gravel: 200, wood: 100, paint: 150, electrical: 8, plumbing: 8 } },
  { id: 'office', name: 'Office Complex', reward: 5000000, duration: 12 * 3600, resources: { cement: 1500, steel: 5000, bricks: 30000, sand: 600, gravel: 400, wood: 200, paint: 300, electrical: 15, plumbing: 12 } },
  { id: 'mall', name: 'Shopping Mall', reward: 10000000, duration: 24 * 3600, resources: { cement: 3000, steel: 10000, bricks: 50000, sand: 1000, gravel: 800, wood: 400, paint: 500, electrical: 30, plumbing: 25 } },
  { id: 'bridge', name: 'Bridge Construction', reward: 25000000, duration: 48 * 3600, resources: { cement: 8000, steel: 30000, sand: 3000, gravel: 2000 } },
];

export const IT_PROJECTS = [
  { id: 'website', name: 'Business Website', reward: 200000, duration: 1 * 3600, requirements: { junior_dev: 1, designer: 1 } },
  { id: 'mobile_app', name: 'Mobile App', reward: 500000, duration: 3 * 3600, requirements: { junior_dev: 2, senior_dev: 1, designer: 1 } },
  { id: 'ecommerce', name: 'E-Commerce Platform', reward: 1500000, duration: 6 * 3600, requirements: { junior_dev: 3, senior_dev: 2, designer: 1, manager: 1 } },
  { id: 'erp', name: 'ERP System', reward: 3000000, duration: 12 * 3600, requirements: { junior_dev: 5, senior_dev: 3, designer: 2, manager: 1 } },
  { id: 'ai_platform', name: 'AI/ML Platform', reward: 8000000, duration: 24 * 3600, requirements: { junior_dev: 5, senior_dev: 5, designer: 2, manager: 2 } },
  { id: 'banking_system', name: 'Banking System', reward: 15000000, duration: 48 * 3600, requirements: { junior_dev: 10, senior_dev: 8, designer: 3, manager: 3 } },
];

export const BANK_SETTINGS_DEFAULTS = {
  loanRate: 12,
  savingsRate: 4,
  loanRateRange: { min: 6, max: 24 },
  savingsRateRange: { min: 2, max: 10 },
  facilities: {
    upi: { name: 'UPI Payments', cost: 200000, enabled: false },
    cards: { name: 'Debit/Credit Cards', cost: 500000, enabled: false },
    netbanking: { name: 'Net Banking', cost: 300000, enabled: false },
    locker: { name: 'Safe Deposit Locker', cost: 1000000, enabled: false },
    insurance: { name: 'Insurance Services', cost: 800000, enabled: false },
  },
  taxRate: 0.06,
  taxFrequency: 'quarterly',
};

export const getBusinessRequirements = (categoryId) => {
  return {
    staff: STAFF_TYPES[categoryId] || [],
    equipment: EQUIPMENT_TYPES[categoryId] || [],
    licenses: LICENSE_TYPES[categoryId] || [],
    inventory: INVENTORY_TYPES[categoryId] || [],
    vehicles: VEHICLE_CATEGORIES[categoryId] || null,
  };
};