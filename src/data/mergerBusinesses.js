// src/data/mergerBusinesses.js
import {
  Coffee, Sparkles, Store, UtensilsCrossed, CarFront,
  Truck, ShoppingBag, HeartPulse, Cpu, Hotel,
  Flame, Rocket, Crown, Building2
} from 'lucide-react';
import { getCategoryById } from './businessCategories';
import { getTotalOutletsForCategory, getUniqueCategoryCount } from '../context/helpers/incomeCalculator';

export const MERGER_BUSINESSES = [
  {
    id: 'street_food_chain',
    name: 'Street Food Chain',
    icon: Coffee,
    color: 'bg-amber-500',
    description: 'Combine chai stalls and food stalls into a unified street food brand',
    investment: 50000,
    incomePerHour: 5000,
    requirements: [
      { categoryId: 'chai-stall', count: 5, label: 'Chai Stalls' },
      { categoryId: 'restaurant', subCategoryId: 'street-food', count: 3, label: 'Street Food Stalls' },
    ],
  },
  {
    id: 'beauty_wellness',
    name: 'Beauty & Wellness',
    icon: Sparkles,
    color: 'bg-pink-400',
    description: 'Merge salons and medical stores into a wellness brand',
    investment: 100000,
    incomePerHour: 8000,
    requirements: [
      { categoryId: 'salon', count: 5, label: 'Salons' },
      { categoryId: 'medical-store', count: 3, label: 'Medical Stores' },
    ],
  },
  {
    id: 'retail_empire',
    name: 'Retail Empire',
    icon: Store,
    color: 'bg-blue-500',
    description: 'Build a retail empire with shops and distribution',
    investment: 500000,
    incomePerHour: 40000,
    requirements: [
      { categoryId: 'shop', subCategoryId: 'small-chain', count: 5, label: 'Small Chain Shops' },
      { categoryId: 'shop', subCategoryId: 'large-chain', count: 3, label: 'Large Chain Shops' },
      { categoryId: 'shipping', count: 2, label: 'Shipping Companies' },
    ],
  },
  {
    id: 'food_empire',
    name: 'Food Empire',
    icon: UtensilsCrossed,
    color: 'bg-orange-500',
    description: 'Create a food conglomerate spanning restaurants and desserts',
    investment: 1000000,
    incomePerHour: 80000,
    requirements: [
      { categoryId: 'restaurant', subCategoryId: 'family-restaurant', count: 5, label: 'Family Restaurants' },
      { categoryId: 'restaurant', subCategoryId: 'fine-dining', count: 3, label: 'Fine Dining' },
      { categoryId: 'ice-cream', count: 5, label: 'Ice Cream Parlours' },
    ],
  },
  {
    id: 'auto_group',
    name: 'Auto Group',
    icon: CarFront,
    color: 'bg-red-500',
    description: 'Combine automotive sales, service, and manufacturing',
    investment: 2000000,
    incomePerHour: 150000,
    requirements: [
      { categoryId: 'garage', count: 5, label: 'Auto Garages' },
      { categoryId: 'car-dealership', count: 3, label: 'Car Dealerships' },
      { categoryId: 'factory', count: 2, label: 'Factories' },
    ],
  },
  {
    id: 'logistics_kingdom',
    name: 'Logistics Kingdom',
    icon: Truck,
    color: 'bg-yellow-600',
    description: 'Dominate transport and delivery across the nation',
    investment: 4000000,
    incomePerHour: 300000,
    requirements: [
      { categoryId: 'taxi', count: 8, label: 'Taxi Companies' },
      { categoryId: 'shipping', count: 5, label: 'Shipping Companies' },
    ],
  },
  {
    id: 'fashion_brand',
    name: 'Fashion Brand',
    icon: ShoppingBag,
    color: 'bg-rose-500',
    description: 'Launch your own fashion label with retail and production',
    investment: 5000000,
    incomePerHour: 350000,
    requirements: [
      { categoryId: 'shop', subCategoryId: 'large-chain', count: 8, label: 'Large Chain Shops' },
      { categoryId: 'factory', count: 5, label: 'Factories' },
      { categoryId: 'shipping', count: 3, label: 'Shipping Companies' },
    ],
  },
  {
    id: 'education_group',
    name: 'Education Group',
    icon: Building2,
    color: 'bg-indigo-500',
    description: 'EdTech platform combining coaching and technology',
    investment: 3000000,
    incomePerHour: 200000,
    requirements: [
      { categoryId: 'tuition', count: 8, label: 'Tuition Centers' },
      { categoryId: 'it-company', count: 3, label: 'IT Companies' },
    ],
  },
  {
    id: 'healthcare_group',
    name: 'Healthcare Group',
    icon: HeartPulse,
    color: 'bg-emerald-500',
    description: 'Integrated healthcare with hospitals and pharmacies',
    investment: 20000000,
    incomePerHour: 1200000,
    requirements: [
      { categoryId: 'hospital', subCategoryId: 'clinic', count: 5, label: 'Clinics' },
      { categoryId: 'medical-store', count: 8, label: 'Medical Stores' },
      { categoryId: 'shipping', count: 3, label: 'Shipping (Medical Supply)' },
    ],
  },
  {
    id: 'tech_conglomerate',
    name: 'Tech Conglomerate',
    icon: Cpu,
    color: 'bg-cyan-500',
    description: 'Tech giant with software development and fintech services',
    investment: 50000000,
    incomePerHour: 2500000,
    requirements: [
      { categoryId: 'it-company', count: 10, label: 'IT Companies' },
      { categoryId: 'bank', count: 3, label: 'Banks' },
    ],
  },
  {
    id: 'hospitality_chain',
    name: 'Hospitality Chain',
    icon: Hotel,
    color: 'bg-purple-500',
    description: 'Premium hospitality brand with hotels, dining, and leisure',
    investment: 100000000,
    incomePerHour: 5000000,
    requirements: [
      { categoryId: 'hotel', count: 8, label: 'Hotels (any type)' },
      { categoryId: 'restaurant', count: 10, label: 'Restaurants (any type)' },
      { categoryId: 'sports-club', count: 3, label: 'Sports Clubs' },
    ],
  },
  {
    id: 'energy_corp',
    name: 'Energy Corporation',
    icon: Flame,
    color: 'bg-slate-600',
    description: 'Vertically integrated energy company with extraction and processing',
    investment: 250000000,
    incomePerHour: 10000000,
    requirements: [
      { categoryId: 'oil-gas', count: 5, label: 'Oil & Gas Companies' },
      { categoryId: 'factory', count: 8, label: 'Factories' },
      { categoryId: 'shipping', count: 5, label: 'Shipping Companies' },
    ],
  },
  {
    id: 'conglomerate',
    name: 'Conglomerate Holdings',
    icon: Crown,
    color: 'bg-amber-600',
    description: 'Massive multi-industry holding company spanning diverse sectors',
    investment: 500000000,
    incomePerHour: 25000000,
    requirements: [
      { type: 'categories', count: 10, label: 'Own 10 Different Business Categories' },
    ],
  },
  {
    id: 'space_agency',
    name: 'Space Agency',
    icon: Rocket,
    color: 'bg-violet-600',
    description: 'The ultimate venture — reach for the stars with aerospace technology',
    investment: 1000000000,
    incomePerHour: 30000000,
    requirements: [
      { categoryId: 'airlines', count: 5, label: 'Airlines' },
      { categoryId: 'it-company', count: 10, label: 'IT Companies' },
      { categoryId: 'oil-gas', count: 5, label: 'Oil & Gas' },
      { categoryId: 'factory', count: 8, label: 'Factories' },
    ],
  },
];

export const getMergerStatus = (merger, ownedBusinesses, mergedBusinesses, activeMergerFlows, state) => {
  // Only block if same merger is currently IN PROGRESS (not completed)
  const isInProgress = (activeMergerFlows || []).some(f => f.mergerId === merger.id);

  const requirementStatuses = merger.requirements.map(req => {
    if (req.type === 'categories') {
      const unique = getUniqueCategoryCount(ownedBusinesses);
      return { ...req, current: unique, met: unique >= req.count };
    }

    const total = getTotalOutletsForCategory(
      ownedBusinesses, req.categoryId, req.subCategoryId
    );

    return { ...req, current: total, met: total >= req.count };
  });

  const allRequirementsMet = requirementStatuses.every(r => r.met);
  const metCount = requirementStatuses.filter(r => r.met).length;

  // Calculate portfolio value for investment check
  const portfolioValue = state ? calcPortfolioValueSimple(state) : 0;
  const investmentMet = state ? portfolioValue >= merger.investment : true;

  return {
    isInProgress,
    requirementStatuses,
    allRequirementsMet,
    metCount,
    totalRequirements: requirementStatuses.length,
    portfolioValue,
    investmentMet,
  };
};

// Simple portfolio value calc (no circular import)
const calcPortfolioValueSimple = (state) => {
  let total = state.balance || 0;

  (state.ownedStocks || []).forEach(st => {
    total += (st.quantity || 0) * (st.avgBuyPrice || 0);
  });

  (state.ownedCrypto || []).forEach(c => {
    total += (c.quantity || 0) * (c.avgBuyPrice || 0);
  });

  (state.ownedProperties || []).forEach(p => {
    total += p.purchasePrice || 0;
  });

  (state.ownedBusinesses || []).forEach(b => {
    total += b.cost || 0;
  });

  return total;
};

export const getRequirementIcon = (req) => {
  if (req.type === 'categories') return null;
  return getCategoryById(req.categoryId);
};