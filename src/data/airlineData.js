// src/data/airlineData.js
// ═══════════════════════════════════════════════════════
// AIRLINE SYSTEM DATA — Aircraft, Hubs, Licenses, Flights
// ═══════════════════════════════════════════════════════

// ─── AIRCRAFT TYPES ───
export const AIRCRAFT_TYPES = [
  {
    id: 'small',
    name: 'Small',
    aircraft: [
      { id: 'turboprop_100', name: 'TurboProp 100', type: 'small', price: 2000000000, incomePerHour: 200000, capacity: 40, range: 'Domestic Short', maintenanceCost: 500000, image: '🛩️' },
      { id: 'regional_jet_s', name: 'Regional Jet S', type: 'small', price: 3500000000, incomePerHour: 350000, capacity: 60, range: 'Domestic', maintenanceCost: 800000, image: '🛩️' },
      { id: 'commuter_air', name: 'Commuter Air', type: 'small', price: 5000000000, incomePerHour: 500000, capacity: 80, range: 'Domestic+', maintenanceCost: 1200000, image: '✈️' },
    ],
  },
  {
    id: 'medium',
    name: 'Medium',
    aircraft: [
      { id: 'narrow_body_m', name: 'Narrow Body M', type: 'medium', price: 10000000000, incomePerHour: 1200000, capacity: 150, range: 'Domestic Long', maintenanceCost: 3000000, image: '✈️' },
      { id: 'midrange_jet', name: 'Midrange Jet', type: 'medium', price: 14000000000, incomePerHour: 1700000, capacity: 180, range: 'International Short', maintenanceCost: 4000000, image: '✈️' },
      { id: 'transcontinental', name: 'Transcontinental', type: 'medium', price: 18000000000, incomePerHour: 2200000, capacity: 220, range: 'International', maintenanceCost: 5500000, image: '🛫' },
    ],
  },
  {
    id: 'large',
    name: 'Large',
    aircraft: [
      { id: 'wide_body_l', name: 'Wide Body L', type: 'large', price: 25000000000, incomePerHour: 3500000, capacity: 300, range: 'International Long', maintenanceCost: 8000000, image: '🛫' },
      { id: 'jumbo_liner', name: 'Jumbo Liner', type: 'large', price: 35000000000, incomePerHour: 5000000, capacity: 400, range: 'Intercontinental', maintenanceCost: 12000000, image: '🛬' },
    ],
  },
  {
    id: 'extra_large',
    name: 'Extra Large',
    aircraft: [
      { id: 'super_jumbo', name: 'Super Jumbo', type: 'extra_large', price: 50000000000, incomePerHour: 8000000, capacity: 550, range: 'Global', maintenanceCost: 18000000, image: '🛬' },
      { id: 'mega_airliner', name: 'Mega Airliner', type: 'extra_large', price: 70000000000, incomePerHour: 12000000, capacity: 700, range: 'Global+', maintenanceCost: 25000000, image: '🛬' },
    ],
  },
];

export const AIRCRAFT_TYPE_FILTERS = [
  { id: 'small', name: 'Small' },
  { id: 'medium', name: 'Medium' },
  { id: 'large', name: 'Large' },
  { id: 'extra_large', name: 'Extra Large' },
];

// ─── COUNTRY LICENSES ───
export const COUNTRY_LICENSES = [
  { id: 'india', name: 'India', flag: '🇮🇳', cost: 50000000, region: 'Asia' },
  { id: 'uae', name: 'UAE', flag: '🇦🇪', cost: 80000000, region: 'Middle East' },
  { id: 'singapore', name: 'Singapore', flag: '🇸🇬', cost: 100000000, region: 'Asia' },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', cost: 150000000, region: 'Europe' },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', cost: 140000000, region: 'Europe' },
  { id: 'france', name: 'France', flag: '🇫🇷', cost: 130000000, region: 'Europe' },
  { id: 'usa', name: 'United States', flag: '🇺🇸', cost: 200000000, region: 'Americas' },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', cost: 120000000, region: 'Americas' },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', cost: 160000000, region: 'Asia' },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', cost: 130000000, region: 'Oceania' },
  { id: 'brazil', name: 'Brazil', flag: '🇧🇷', cost: 90000000, region: 'Americas' },
  { id: 'south_africa', name: 'South Africa', flag: '🇿🇦', cost: 70000000, region: 'Africa' },
  { id: 'china', name: 'China', flag: '🇨🇳', cost: 180000000, region: 'Asia' },
  { id: 'south_korea', name: 'South Korea', flag: '🇰🇷', cost: 110000000, region: 'Asia' },
  { id: 'thailand', name: 'Thailand', flag: '🇹🇭', cost: 60000000, region: 'Asia' },
  { id: 'russia', name: 'Russia', flag: '🇷🇺', cost: 100000000, region: 'Europe' },
];

export const LICENSE_REGIONS = [
  { id: 'all', name: 'All' },
  { id: 'Asia', name: 'Asia' },
  { id: 'Europe', name: 'Europe' },
  { id: 'Americas', name: 'Americas' },
  { id: 'Middle East', name: 'Middle East' },
  { id: 'Africa', name: 'Africa' },
  { id: 'Oceania', name: 'Oceania' },
];

// ─── HUBS (Airports/Parking Areas) ───
export const AIRLINE_HUBS = [
  { id: 'hub_india_del', name: 'Delhi Hub', country: 'india', countryName: 'India', flag: '🇮🇳', cost: 500000000, capacity: 10, maintenanceCost: 5000000 },
  { id: 'hub_india_mum', name: 'Mumbai Hub', country: 'india', countryName: 'India', flag: '🇮🇳', cost: 600000000, capacity: 12, maintenanceCost: 6000000 },
  { id: 'hub_india_blr', name: 'Bangalore Hub', country: 'india', countryName: 'India', flag: '🇮🇳', cost: 450000000, capacity: 8, maintenanceCost: 4500000 },
  { id: 'hub_uae_dxb', name: 'Dubai Hub', country: 'uae', countryName: 'UAE', flag: '🇦🇪', cost: 1000000000, capacity: 20, maintenanceCost: 10000000 },
  { id: 'hub_sg_sin', name: 'Singapore Hub', country: 'singapore', countryName: 'Singapore', flag: '🇸🇬', cost: 800000000, capacity: 15, maintenanceCost: 8000000 },
  { id: 'hub_uk_lhr', name: 'London Heathrow Hub', country: 'uk', countryName: 'UK', flag: '🇬🇧', cost: 1500000000, capacity: 25, maintenanceCost: 15000000 },
  { id: 'hub_us_jfk', name: 'New York JFK Hub', country: 'usa', countryName: 'USA', flag: '🇺🇸', cost: 2000000000, capacity: 30, maintenanceCost: 20000000 },
  { id: 'hub_us_lax', name: 'Los Angeles Hub', country: 'usa', countryName: 'USA', flag: '🇺🇸', cost: 1800000000, capacity: 25, maintenanceCost: 18000000 },
  { id: 'hub_jp_nrt', name: 'Tokyo Narita Hub', country: 'japan', countryName: 'Japan', flag: '🇯🇵', cost: 1200000000, capacity: 18, maintenanceCost: 12000000 },
  { id: 'hub_au_syd', name: 'Sydney Hub', country: 'australia', countryName: 'Australia', flag: '🇦🇺', cost: 900000000, capacity: 14, maintenanceCost: 9000000 },
  { id: 'hub_de_fra', name: 'Frankfurt Hub', country: 'germany', countryName: 'Germany', flag: '🇩🇪', cost: 1100000000, capacity: 16, maintenanceCost: 11000000 },
  { id: 'hub_br_gru', name: 'São Paulo Hub', country: 'brazil', countryName: 'Brazil', flag: '🇧🇷', cost: 700000000, capacity: 12, maintenanceCost: 7000000 },
];

// ─── AIRLINE STAFF ───
export const AIRLINE_STAFF = [
  { id: 'pilot', name: 'Pilot', costPer: 100000, perAircraft: 2, required: true, incomeBoost: 5 },
  { id: 'copilot', name: 'Co-Pilot', costPer: 70000, perAircraft: 1, required: true, incomeBoost: 3 },
  { id: 'cabin_crew', name: 'Cabin Crew', costPer: 30000, perAircraft: 6, required: true, incomeBoost: 2 },
  { id: 'ground_staff', name: 'Ground Staff', costPer: 15000, perHub: 10, required: true, incomeBoost: 1 },
  { id: 'maintenance', name: 'Maintenance Engineer', costPer: 50000, perHub: 5, required: true, incomeBoost: 3 },
  { id: 'atc', name: 'Air Traffic Controller', costPer: 80000, perHub: 2, required: false, incomeBoost: 4 },
];

// ─── FLIGHT CONFIGURATION ───
export const FLIGHT_CONFIG = {
  minStaffForFlight: { pilot: 2, copilot: 1, cabin_crew: 4 },
  flightDuration: {
    domestic_short: 2 * 3600,
    domestic: 3 * 3600,
    domestic_plus: 4 * 3600,
    domestic_long: 5 * 3600,
    international_short: 6 * 3600,
    international: 8 * 3600,
    international_long: 10 * 3600,
    intercontinental: 14 * 3600,
    global: 18 * 3600,
    global_plus: 22 * 3600,
  },
  rangeToFlightType: {
    'Domestic Short': 'domestic_short',
    'Domestic': 'domestic',
    'Domestic+': 'domestic_plus',
    'Domestic Long': 'domestic_long',
    'International Short': 'international_short',
    'International': 'international',
    'International Long': 'international_long',
    'Intercontinental': 'intercontinental',
    'Global': 'global',
    'Global+': 'global_plus',
  },
};

// ─── HELPER FUNCTIONS ───

export const getAllAircraft = () => {
  return AIRCRAFT_TYPES.flatMap(type => type.aircraft);
};

export const getAircraftById = (aircraftId) => {
  return getAllAircraft().find(a => a.id === aircraftId) || null;
};

export const getAircraftByType = (typeId) => {
  const type = AIRCRAFT_TYPES.find(t => t.id === typeId);
  return type ? type.aircraft : [];
};

export const getLicenseById = (licenseId) => {
  return COUNTRY_LICENSES.find(l => l.id === licenseId) || null;
};

export const getHubById = (hubId) => {
  return AIRLINE_HUBS.find(h => h.id === hubId) || null;
};

export const getHubsForCountry = (countryId) => {
  return AIRLINE_HUBS.filter(h => h.country === countryId);
};

export const getFlightDuration = (aircraftRange) => {
  const flightType = FLIGHT_CONFIG.rangeToFlightType[aircraftRange];
  return FLIGHT_CONFIG.flightDuration[flightType] || 4 * 3600;
};

export const canStartFlight = (biz, aircraftId) => {
  const aircraft = biz.airline?.aircraft?.find(a => a.id === aircraftId);
  if (!aircraft || !aircraft.active) return { canStart: false, reason: 'Aircraft not available' };

  const aircraftDef = getAircraftById(aircraft.aircraftDefId);
  if (!aircraftDef) return { canStart: false, reason: 'Aircraft type not found' };

  // Check if aircraft is already on a flight
  const onFlight = (biz.airline?.activeFlights || []).some(f => f.aircraftId === aircraftId);
  if (onFlight) return { canStart: false, reason: 'Aircraft already on a flight' };

  // Check hub availability
  const hubs = biz.airline?.hubs || [];
  if (hubs.length === 0) return { canStart: false, reason: 'No hub available' };

  // Check license
  const licenses = biz.airline?.licenses || [];
  if (licenses.length === 0) return { canStart: false, reason: 'No flying license' };

  // Check minimum staff
  const staff = biz.airline?.staff || {};
  const totalAircraft = (biz.airline?.aircraft || []).filter(a => a.active).length;
  const minPilots = totalAircraft * FLIGHT_CONFIG.minStaffForFlight.pilot;
  const minCopilots = totalAircraft * FLIGHT_CONFIG.minStaffForFlight.copilot;
  const minCrew = totalAircraft * FLIGHT_CONFIG.minStaffForFlight.cabin_crew;

  if ((staff.pilot || 0) < minPilots) return { canStart: false, reason: `Need ${minPilots} pilots (have ${staff.pilot || 0})` };
  if ((staff.copilot || 0) < minCopilots) return { canStart: false, reason: `Need ${minCopilots} co-pilots` };
  if ((staff.cabin_crew || 0) < minCrew) return { canStart: false, reason: `Need ${minCrew} cabin crew` };

  return { canStart: true, reason: '' };
};

export const calcAirlineIncome = (biz) => {
  if (!biz.airline) return 0;
  let income = 0;

  // Active flights income
  (biz.airline.activeFlights || []).forEach(flight => {
    income += flight.incomePerHour || 0;
  });

  // Staff boost
  const staff = biz.airline.staff || {};
  AIRLINE_STAFF.forEach(s => {
    const count = staff[s.id] || 0;
    if (count > 0) income += Math.floor(income * (s.incomeBoost * count) / 100);
  });

  return income;
};