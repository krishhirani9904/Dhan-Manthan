const PREFIXES = [
  'Shree', 'New', 'Royal', 'Golden', 'Star', 'Diamond', 'Lucky', 'Super',
  'Metro', 'City', 'Desi', 'Modern', 'Classic', 'Prime', 'Elite', 'Bharat',
  'National', 'United', 'Apna', 'Jai', 'Om', 'Raj', 'Sai', 'Balaji',
];

const SUFFIXES = {
  'chai-stall': ['Chai Wala', 'Tea Corner', 'Chai Point', 'Tea House'],
  'shop': ['Mart', 'Store', 'Traders', 'Emporium', 'Bazaar'],
  'local-shop': ['Corner Shop', 'Store', 'Daily Mart', 'Kirana'],
  'small-chain': ['Markets', 'Retail Chain', 'Stores'],
  'large-chain': ['Mega Mart', 'Hypermart', 'Super Chain'],
  'salon': ['Salon', 'Beauty Parlour', 'Hair Studio', 'Makeover'],
  'taxi': ['Cab', 'Rides', 'Transport', 'Taxi Service'],
  'restaurant': ['Kitchen', 'Restaurant', 'Food Corner', 'Dhaba'],
  'street-food': ['Chaat Corner', 'Food Stall', 'Nashta Point'],
  'family-restaurant': ['Family Dining', 'Bhojnalaya', 'Restaurant'],
  'fine-dining': ['Gourmet', 'Fine Dine', 'The Table'],
  'medical-store': ['Pharmacy', 'Medical Store', 'Chemist'],
  'ice-cream': ['Ice Cream', 'Frozen Treats', 'Cream Corner'],
  'tuition': ['Classes', 'Academy', 'Coaching', 'Institute'],
  'garage': ['Auto Works', 'Garage', 'Car Care'],
  'shipping': ['Logistics', 'Cargo', 'Express', 'Freight'],
  'factory': ['Industries', 'Manufacturing', 'Works'],
  'construction': ['Builders', 'Construction', 'Developers'],
  'car-dealership': ['Motors', 'Auto Hub', 'Car World'],
  'it-company': ['Tech', 'Solutions', 'Software', 'InfoTech'],
  'hotel': ['Hotel', 'Inn', 'Residency', 'Stay'],
  'budget-hotel': ['Lodge', 'Inn', 'Guest House'],
  'business-hotel': ['Business Suites', 'Executive Stay'],
  'luxury-resort': ['Resort & Spa', 'Grand Palace'],
  'bank': ['Bank', 'Finance Corp', 'Financial Services'],
  'hospital': ['Hospital', 'Medical Center', 'Healthcare'],
  'clinic': ['Clinic', 'Health Center', 'Dispensary'],
  'small-hospital': ['Hospital', 'Medical Center'],
  'multi-specialty': ['Multi-Specialty Hospital'],
  'sports-club': ['Sports Club', 'FC', 'Athletics Academy'],
  'media': ['Media House', 'Broadcasting', 'Entertainment'],
  'oil-gas': ['Energy Corp', 'Petroleum', 'Oil Industries'],
  'airlines': ['Airlines', 'Airways', 'Aviation'],
};

export const getRandomBusinessName = (categoryId, subCategoryId) => {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const key = subCategoryId || categoryId;
  const suffixList = SUFFIXES[key] || SUFFIXES['shop'] || ['Enterprise'];
  const suffix = suffixList[Math.floor(Math.random() * suffixList.length)];
  return `${prefix} ${suffix}`;
};