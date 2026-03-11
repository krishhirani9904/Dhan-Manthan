// src/data/mergerBusinesses.js
import {
  Coffee, Sparkles, Store, UtensilsCrossed, CarFront,
  Truck, ShoppingBag, HeartPulse, Cpu, Hotel,
  Flame, Rocket, Crown, Building2
} from 'lucide-react';
import { getCategoryById } from './businessCategories';

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
      { categoryId: 'chai-stall', count: 2, label: 'Chai Stall' },
      { categoryId: 'restaurant', subCategoryId: 'street-food', count: 1, label: 'Street Food Stall' },
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
      { categoryId: 'salon', count: 2, label: 'Salon' },
      { categoryId: 'medical-store', count: 1, label: 'Medical Store' },
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
      { categoryId: 'shop', subCategoryId: 'small-chain', count: 1, label: 'Small Chain Shop' },
      { categoryId: 'shop', subCategoryId: 'large-chain', count: 1, label: 'Large Chain Shop' },
      { categoryId: 'shipping', count: 1, label: 'Shipping Company' },
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
      { categoryId: 'restaurant', subCategoryId: 'family-restaurant', count: 1, label: 'Family Restaurant' },
      { categoryId: 'restaurant', subCategoryId: 'fine-dining', count: 1, label: 'Fine Dining' },
      { categoryId: 'ice-cream', count: 2, label: 'Ice Cream Parlour' },
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
      { categoryId: 'garage', count: 1, label: 'Auto Garage' },
      { categoryId: 'car-dealership', count: 1, label: 'Car Dealership' },
      { categoryId: 'factory', count: 1, label: 'Factory' },
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
      { categoryId: 'taxi', count: 2, label: 'Taxi Company' },
      { categoryId: 'shipping', count: 1, label: 'Shipping Company' },
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
      { categoryId: 'shop', subCategoryId: 'large-chain', count: 2, label: 'Large Chain Shop' },
      { categoryId: 'factory', count: 1, label: 'Factory' },
      { categoryId: 'shipping', count: 1, label: 'Shipping Company' },
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
      { categoryId: 'tuition', count: 2, label: 'Tuition Center' },
      { categoryId: 'it-company', count: 1, label: 'IT Company' },
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
      { categoryId: 'hospital', subCategoryId: 'clinic', count: 1, label: 'Clinic' },
      { categoryId: 'medical-store', count: 2, label: 'Medical Store' },
      { categoryId: 'shipping', count: 1, label: 'Shipping (Medical Supply)' },
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
      { categoryId: 'it-company', count: 2, label: 'IT Company' },
      { categoryId: 'bank', count: 1, label: 'Bank' },
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
      { categoryId: 'hotel', count: 2, label: 'Hotel (any type)' },
      { categoryId: 'restaurant', count: 2, label: 'Restaurant (any type)' },
      { categoryId: 'sports-club', count: 1, label: 'Sports Club' },
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
      { categoryId: 'oil-gas', count: 1, label: 'Oil & Gas Company' },
      { categoryId: 'factory', count: 2, label: 'Factory' },
      { categoryId: 'shipping', count: 1, label: 'Shipping Company' },
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
      { type: 'categories', count: 7, label: 'Own 7 Different Business Categories' },
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
      { categoryId: 'airlines', count: 1, label: 'Airlines' },
      { categoryId: 'it-company', count: 2, label: 'IT Company' },
      { categoryId: 'oil-gas', count: 1, label: 'Oil & Gas' },
      { categoryId: 'factory', count: 1, label: 'Factory' },
    ],
  },
];

export const getMergerStatus = (merger, ownedBusinesses, mergedBusinesses) => {
  const isActivated = (mergedBusinesses || []).some(m => m.mergerId === merger.id);

  const requirementStatuses = merger.requirements.map(req => {
    if (req.type === 'categories') {
      const unique = new Set((ownedBusinesses || []).map(b => b.categoryId));
      return { ...req, current: unique.size, met: unique.size >= req.count };
    }

    const matching = (ownedBusinesses || []).filter(b => {
      if (b.categoryId !== req.categoryId) return false;
      if (req.subCategoryId && b.subCategoryId !== req.subCategoryId) return false;
      return true;
    });

    return { ...req, current: matching.length, met: matching.length >= req.count };
  });

  const allRequirementsMet = requirementStatuses.every(r => r.met);
  const metCount = requirementStatuses.filter(r => r.met).length;

  return {
    isActivated,
    requirementStatuses,
    allRequirementsMet,
    metCount,
    totalRequirements: requirementStatuses.length,
  };
};

export const getRequirementIcon = (req) => {
  if (req.type === 'categories') return null;
  return getCategoryById(req.categoryId);
};