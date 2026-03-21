// src/data/mergerFlowData.js
import {
  Users, TrendingUp, ShoppingBag, Sparkles, Megaphone,
  Palette, Rocket, Target, Globe, Cpu, Heart,
  Building2, Plane, Fuel, Trophy, Hotel,
  BookOpen, Wrench, UtensilsCrossed, Truck, Store,
  Shield, Zap, Crown, Coffee, Scissors, Stethoscope,
  Monitor, Landmark, Factory, Car
} from 'lucide-react';

// ═══════════════════════════════════════════════════════
// MERGER TRENDS — Real-world trends per business merger
// ═══════════════════════════════════════════════════════

export const MERGER_TRENDS = {
  // ─── Street Food Chain ───
  street_food_chain: [
    {
      id: 'health_street',
      title: 'Healthy Street Food',
      description: 'Consumers are shifting towards organic, oil-free, and nutrient-rich street food. Millets, sprouts, and baked snacks are replacing traditional fried items.',
      details: 'The health-conscious movement has penetrated even the street food segment. Offering guilt-free versions of popular snacks like baked samosas, millet chaat, and sugar-free lassi can attract the urban health-aware crowd.',
      minInvestment: 8000,
      maxInvestment: 25000,
      emoji: '🥗',
    },
    {
      id: 'fusion_street',
      title: 'Fusion Street Food',
      description: 'Indo-Chinese, Mexican-Indian, and other fusion cuisines are dominating street food markets across metro cities.',
      details: 'Combining global flavors with desi street food creates unique offerings. Think tandoori momos, paneer tacos, masala fries, and chai-flavored desserts. This trend appeals to millennials seeking Instagram-worthy food.',
      minInvestment: 10000,
      maxInvestment: 30000,
      emoji: '🌮',
    },
    {
      id: 'regional_authentic',
      title: 'Regional Authenticity',
      description: 'Customers crave authentic regional recipes — Rajasthani kachori, Bengali jhalmuri, South Indian filter coffee with local spice blends.',
      details: 'The authenticity movement celebrates traditional recipes passed down through generations. By sourcing original ingredients from specific regions and maintaining traditional cooking methods, you build a brand rooted in heritage.',
      minInvestment: 6000,
      maxInvestment: 20000,
      emoji: '🍛',
    },
  ],

  // ─── Beauty & Wellness ───
  beauty_wellness: [
    {
      id: 'organic_beauty',
      title: 'Organic & Ayurvedic Beauty',
      description: 'Chemical-free, plant-based beauty treatments using turmeric, neem, aloe vera, and traditional Ayurvedic formulations are booming.',
      details: 'The global shift towards clean beauty has reached India strongly. Customers pay premium prices for organic facials, herbal hair treatments, and Ayurvedic spa therapies. Certifications from AYUSH ministry add credibility.',
      minInvestment: 20000,
      maxInvestment: 60000,
      emoji: '🌿',
    },
    {
      id: 'tech_beauty',
      title: 'Tech-Enhanced Beauty',
      description: 'Laser treatments, LED therapy, microdermabrasion, and AI-powered skin analysis are revolutionizing the beauty industry.',
      details: 'Advanced technology in beauty services commands higher prices and attracts premium clientele. AI skin analyzers, automated hair styling, and personalized beauty algorithms based on skin type create a futuristic salon experience.',
      minInvestment: 40000,
      maxInvestment: 100000,
      emoji: '💎',
    },
    {
      id: 'mens_grooming',
      title: 'Men\'s Grooming Revolution',
      description: 'The male grooming market is exploding — beard care, skin routines, and wellness packages specifically designed for men.',
      details: 'Men\'s grooming has evolved beyond basic haircuts. Premium beard sculpting, anti-aging treatments, and stress-relief massages targeting working professionals represent a largely untapped market with high repeat customer potential.',
      minInvestment: 15000,
      maxInvestment: 50000,
      emoji: '💈',
    },
  ],

  // ─── Retail Empire ───
  retail_empire: [
    {
      id: 'omnichannel',
      title: 'Omnichannel Retail',
      description: 'Seamless integration of online stores, mobile apps, and physical outlets. Customers order online, pick up in-store, or get same-day delivery.',
      details: 'Modern retail demands presence everywhere. Build a unified inventory system, offer click-and-collect, integrate with major e-commerce platforms, and use data analytics to predict demand patterns across all channels.',
      minInvestment: 100000,
      maxInvestment: 300000,
      emoji: '🛒',
    },
    {
      id: 'private_label',
      title: 'Private Label Strategy',
      description: 'Create your own product lines with higher margins — from groceries to clothing, under your own brand name.',
      details: 'Private labels offer 40-60% higher margins compared to selling other brands. Start with daily essentials, then expand to premium segments. Quality control and consistent branding are key to building customer trust.',
      minInvestment: 150000,
      maxInvestment: 400000,
      emoji: '🏷️',
    },
    {
      id: 'experience_retail',
      title: 'Experience-Based Retail',
      description: 'Transform stores into experience centers — interactive displays, product demos, VR trials, and community events.',
      details: 'The future of physical retail is experiential. Create zones where customers can try products, attend workshops, and engage with the brand beyond transactions. This drives footfall and builds emotional brand connection.',
      minInvestment: 80000,
      maxInvestment: 250000,
      emoji: '🎪',
    },
  ],

  // ─── Food Empire ───
  food_empire: [
    {
      id: 'cloud_kitchen',
      title: 'Cloud Kitchen Network',
      description: 'Virtual restaurants operating from centralized kitchens, serving multiple cuisines through delivery platforms with minimal overhead.',
      details: 'Cloud kitchens eliminate expensive dine-in costs. One kitchen can operate 5-8 virtual brands simultaneously. Partner with Swiggy, Zomato, and direct ordering apps. Focus on packaging innovation and delivery speed.',
      minInvestment: 200000,
      maxInvestment: 600000,
      emoji: '☁️',
    },
    {
      id: 'farm_to_table',
      title: 'Farm-to-Table Dining',
      description: 'Direct sourcing from organic farms, transparent supply chains, and seasonal menus that change with harvest cycles.',
      details: 'Premium customers pay 30-40% more for verified farm-to-table experiences. Build partnerships with local farmers, create seasonal menus, and showcase the journey from farm to plate. This builds trust and commands premium pricing.',
      minInvestment: 300000,
      maxInvestment: 800000,
      emoji: '🌾',
    },
    {
      id: 'franchise_model',
      title: 'Franchise Expansion Model',
      description: 'Standardize recipes, build training programs, and expand through franchise partners across multiple cities.',
      details: 'Franchising allows rapid expansion without proportional capital investment. Create a detailed operations manual, standardize every recipe to exact measurements, build a franchise training academy, and implement quality audit systems.',
      minInvestment: 250000,
      maxInvestment: 700000,
      emoji: '🏢',
    },
  ],

  // ─── Auto Group ───
  auto_group: [
    {
      id: 'ev_transition',
      title: 'Electric Vehicle Revolution',
      description: 'EV sales are growing 40% annually. Setting up EV showrooms, charging stations, and specialized EV service centers positions you for the future.',
      details: 'The Indian government aims for 30% EV penetration by 2030. Early movers in EV sales and service will dominate. Install fast-charging stations, train mechanics on EV technology, and partner with emerging EV brands for exclusive dealerships.',
      minInvestment: 500000,
      maxInvestment: 1500000,
      emoji: '⚡',
    },
    {
      id: 'premium_custom',
      title: 'Premium Customization',
      description: 'High-end vehicle customization — custom interiors, performance upgrades, ceramic coating, and bespoke modifications.',
      details: 'Luxury car owners spend ₹2-10 lakhs on customization. Offer ceramic coatings, custom wraps, performance ECU tuning, premium sound systems, and bespoke interior leather work. This segment has margins exceeding 60%.',
      minInvestment: 400000,
      maxInvestment: 1200000,
      emoji: '🏎️',
    },
    {
      id: 'used_car_certified',
      title: 'Certified Pre-Owned Program',
      description: 'Launch a trusted certified pre-owned vehicle program with warranties, inspections, and financing options.',
      details: 'The used car market is 1.5x the new car market in India. A certification program with 150-point inspection, warranty coverage, and easy financing builds trust. Digital platforms for transparent pricing eliminate buyer anxiety.',
      minInvestment: 600000,
      maxInvestment: 1800000,
      emoji: '🚗',
    },
  ],

  // ─── Logistics Kingdom ───
  logistics_kingdom: [
    {
      id: 'last_mile',
      title: 'Last-Mile Innovation',
      description: 'Drone deliveries, electric cargo bikes, and micro-fulfillment centers for ultra-fast urban delivery within 30 minutes.',
      details: 'Last-mile delivery accounts for 53% of total shipping costs. Innovations like electric cargo bikes for city centers, drone delivery for remote areas, and neighborhood micro-warehouses dramatically reduce costs and delivery time.',
      minInvestment: 800000,
      maxInvestment: 2500000,
      emoji: '🚁',
    },
    {
      id: 'cold_chain',
      title: 'Cold Chain Logistics',
      description: 'Temperature-controlled supply chain for pharmaceuticals, fresh food, and dairy products — a ₹50,000 crore market.',
      details: 'India wastes 16% of food production due to poor cold chain infrastructure. Build refrigerated transport, cold storage warehouses, and real-time temperature monitoring systems. Partner with pharma companies and food delivery platforms.',
      minInvestment: 1200000,
      maxInvestment: 3000000,
      emoji: '❄️',
    },
    {
      id: 'smart_logistics',
      title: 'AI-Powered Smart Logistics',
      description: 'Route optimization, predictive demand, automated warehousing with robots, and real-time tracking for maximum efficiency.',
      details: 'AI reduces logistics costs by 15-20%. Implement route optimization algorithms, demand prediction models, warehouse robotics, and IoT-based fleet tracking. Smart logistics commands premium rates from enterprise clients.',
      minInvestment: 1000000,
      maxInvestment: 2800000,
      emoji: '🤖',
    },
  ],

  // ─── Fashion Brand ───
  fashion_brand: [
    {
      id: 'retro_fashion',
      title: 'Retro Fashion Revival',
      description: 'Vintage aesthetics from the 70s-90s are making a massive comeback. Bell-bottoms, oversized silhouettes, and classic prints dominate runways.',
      details: 'Retro clothing is prized for its quality and nostalgic appeal. Premium fabrics that match the aesthetics of bygone eras, combined with modern comfort standards, create collections that resonate with both millennials and Gen Z.',
      minInvestment: 1000000,
      maxInvestment: 3000000,
      emoji: '👔',
    },
    {
      id: 'sustainable_fashion',
      title: 'Sustainable & Eco Fashion',
      description: 'Recycled materials, organic cotton, zero-waste manufacturing, and carbon-neutral supply chains define the future of fashion.',
      details: 'Consumers increasingly pay premium for sustainable fashion. Use recycled polyester from ocean plastic, organic cotton, hemp fabrics, and implement zero-waste cutting techniques. Sustainability certifications boost brand value significantly.',
      minInvestment: 1500000,
      maxInvestment: 4000000,
      emoji: '♻️',
    },
    {
      id: 'tech_wear',
      title: 'Technology in Clothing',
      description: 'Gadgets are becoming an integral part of the closet! Clothes with heating functions, built-in batteries, and antibacterial coatings are becoming a hit.',
      details: 'Smart textiles represent a $5.3 billion global market. Temperature-regulating fabrics, UV-protective coatings, moisture-wicking technology, and even garments with built-in fitness trackers attract the tech-savvy premium audience.',
      minInvestment: 2000000,
      maxInvestment: 5000000,
      emoji: '🔬',
    },
  ],

  // ─── Education Group ───
  education_group: [
    {
      id: 'ai_learning',
      title: 'AI-Personalized Learning',
      description: 'Adaptive learning platforms that customize curriculum based on each student\'s pace, strengths, and weaknesses using artificial intelligence.',
      details: 'AI tutors can identify knowledge gaps in real-time and adjust difficulty levels automatically. Combine with human mentors for hybrid learning. This approach shows 40% better outcomes compared to traditional one-size-fits-all teaching.',
      minInvestment: 600000,
      maxInvestment: 2000000,
      emoji: '🧠',
    },
    {
      id: 'skill_based',
      title: 'Skill-Based Certification',
      description: 'Industry-recognized certifications in coding, data science, digital marketing, and emerging technologies with job placement guarantees.',
      details: 'Traditional degrees are losing value. Short-term, intensive bootcamps with guaranteed job placement attract working professionals. Partner with tech companies for curriculum design and hiring pipeline. Revenue sharing models ensure quality.',
      minInvestment: 500000,
      maxInvestment: 1800000,
      emoji: '📜',
    },
    {
      id: 'immersive_learning',
      title: 'VR/AR Immersive Education',
      description: 'Virtual reality classrooms, augmented reality textbooks, and 3D simulations for subjects like science, medicine, and engineering.',
      details: 'VR education improves retention by 75% compared to lectures. Create virtual chemistry labs, historical recreations, anatomical explorations, and engineering simulations. Premium pricing for an unmatched learning experience.',
      minInvestment: 800000,
      maxInvestment: 2500000,
      emoji: '🥽',
    },
  ],

  // ─── Healthcare Group ───
  healthcare_group: [
    {
      id: 'telemedicine',
      title: 'Telemedicine Platform',
      description: 'Virtual consultations, AI symptom checkers, e-prescriptions, and remote patient monitoring for accessible healthcare.',
      details: 'Telemedicine grew 500% post-pandemic. Build a platform connecting patients with specialists, integrate AI for initial symptom assessment, enable digital prescriptions, and offer doorstep medicine delivery through your pharmacy network.',
      minInvestment: 5000000,
      maxInvestment: 12000000,
      emoji: '📱',
    },
    {
      id: 'preventive_health',
      title: 'Preventive Health Programs',
      description: 'Annual health packages, corporate wellness programs, genetic testing, and lifestyle disease management plans.',
      details: 'Prevention is cheaper than cure. Offer comprehensive health screening packages, corporate tie-ups for employee wellness, DNA-based health risk assessments, and chronic disease management programs. Subscription models ensure recurring revenue.',
      minInvestment: 4000000,
      maxInvestment: 10000000,
      emoji: '🛡️',
    },
    {
      id: 'specialty_centers',
      title: 'Specialty Care Centers',
      description: 'Focused centers for cardiology, orthopedics, dermatology, and fertility treatments with world-class expertise.',
      details: 'Specialty hospitals achieve 30% higher margins than general hospitals. Focus on one area of excellence, recruit top specialists, invest in cutting-edge equipment, and build reputation through success rates and patient testimonials.',
      minInvestment: 8000000,
      maxInvestment: 18000000,
      emoji: '🏥',
    },
  ],

  // ─── Tech Conglomerate ───
  tech_conglomerate: [
    {
      id: 'fintech_platform',
      title: 'FinTech Super App',
      description: 'Unified financial platform — payments, lending, insurance, investments, and credit scoring all in one ecosystem.',
      details: 'FinTech super apps achieve ₹10,000+ revenue per user annually. Combine UPI payments, micro-lending, insurance aggregation, mutual fund investments, and AI credit scoring. Network effects create a powerful moat against competitors.',
      minInvestment: 15000000,
      maxInvestment: 35000000,
      emoji: '💳',
    },
    {
      id: 'ai_saas',
      title: 'AI-as-a-Service Platform',
      description: 'Cloud-based AI tools for businesses — chatbots, document processing, predictive analytics, and computer vision APIs.',
      details: 'The AI-as-a-Service market grows 35% annually. Build pre-trained models that businesses can integrate via APIs. Offer chatbot builders, invoice processors, demand forecasters, and quality inspection systems. Usage-based pricing ensures scalability.',
      minInvestment: 12000000,
      maxInvestment: 30000000,
      emoji: '🤖',
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity Solutions',
      description: 'Enterprise security — threat detection, data encryption, compliance management, and security operations center (SOC).',
      details: 'Cybercrime costs businesses $8 trillion annually. Offer managed security services, penetration testing, compliance auditing (GDPR, PCI-DSS), and 24/7 security monitoring. Enterprise contracts provide stable, high-margin recurring revenue.',
      minInvestment: 10000000,
      maxInvestment: 25000000,
      emoji: '🔒',
    },
  ],

  // ─── Hospitality Chain ───
  hospitality_chain: [
    {
      id: 'boutique_hotels',
      title: 'Boutique Hotel Experience',
      description: 'Unique, themed hotels with personalized service — heritage properties, eco-resorts, and design hotels with local character.',
      details: 'Boutique hotels command 40-60% premium over standard hotels. Each property has a unique theme reflecting local culture, art, and cuisine. Personalized concierge service, curated local experiences, and Instagram-worthy designs drive bookings.',
      minInvestment: 25000000,
      maxInvestment: 60000000,
      emoji: '🏨',
    },
    {
      id: 'integrated_resort',
      title: 'Integrated Resort & Entertainment',
      description: 'Complete destination — hotels, dining, spa, adventure sports, shopping, and entertainment all in one campus.',
      details: 'Integrated resorts achieve 3x the revenue per guest compared to standalone hotels. Guests stay longer, spend more on F&B and activities. Build water parks, golf courses, convention centers, and luxury retail within the resort ecosystem.',
      minInvestment: 30000000,
      maxInvestment: 80000000,
      emoji: '🎢',
    },
    {
      id: 'smart_hospitality',
      title: 'Smart Hotel Technology',
      description: 'IoT-enabled rooms, AI concierge, contactless check-in, robot room service, and personalized guest experience through data.',
      details: 'Smart hotels reduce operational costs by 20% while improving guest satisfaction. Implement keyless entry, voice-controlled rooms, AI-powered personalization (remembering guest preferences), and automated housekeeping schedules.',
      minInvestment: 20000000,
      maxInvestment: 50000000,
      emoji: '🏠',
    },
  ],

  // ─── Energy Corporation ───
  energy_corp: [
    {
      id: 'renewable_energy',
      title: 'Renewable Energy Integration',
      description: 'Solar farms, wind energy, and green hydrogen production alongside traditional oil & gas for a diversified energy portfolio.',
      details: 'Renewable energy costs have dropped 85% in a decade. Smart energy companies are diversifying into solar, wind, and green hydrogen while maintaining traditional operations. Government incentives and carbon credits add additional revenue streams.',
      minInvestment: 60000000,
      maxInvestment: 150000000,
      emoji: '☀️',
    },
    {
      id: 'petrochemicals',
      title: 'Petrochemical Processing',
      description: 'Value-added petrochemical products — plastics, synthetic fibers, fertilizers, and specialty chemicals with high margins.',
      details: 'Raw crude oil generates $10/barrel profit. Refining and petrochemical processing generates $25-40/barrel. Invest in cracking units, polymer plants, and specialty chemical processing to multiply revenue from the same barrel of crude.',
      minInvestment: 80000000,
      maxInvestment: 200000000,
      emoji: '🧪',
    },
    {
      id: 'energy_trading',
      title: 'Energy Trading & Storage',
      description: 'Strategic petroleum reserves, energy futures trading, and battery storage systems for grid stabilization.',
      details: 'Energy trading firms profit from price volatility. Build strategic storage capacity, trade energy futures and options, and invest in grid-scale battery storage. As renewable energy grows, storage becomes increasingly valuable.',
      minInvestment: 50000000,
      maxInvestment: 120000000,
      emoji: '📊',
    },
  ],

  // ─── Conglomerate Holdings ───
  conglomerate: [
    {
      id: 'vertical_integration',
      title: 'Vertical Integration Strategy',
      description: 'Control every step from raw materials to end consumer — manufacturing, distribution, retail, and after-sales service.',
      details: 'Vertically integrated conglomerates capture margins at every stage. When you own the factory, the logistics, the retail stores, and the service centers, your total margin can exceed 60% compared to 15-20% at any single stage.',
      minInvestment: 100000000,
      maxInvestment: 300000000,
      emoji: '🔗',
    },
    {
      id: 'global_expansion',
      title: 'Global Market Expansion',
      description: 'Take your conglomerate international — establish presence in Southeast Asia, Middle East, Africa, and beyond.',
      details: 'Indian conglomerates are expanding globally. Leverage the Indian diaspora, establish manufacturing in low-cost countries, acquire international brands, and build a global supply chain. Think Tata, Reliance, and Adani scale.',
      minInvestment: 150000000,
      maxInvestment: 400000000,
      emoji: '🌍',
    },
    {
      id: 'innovation_hub',
      title: 'Innovation & R&D Hub',
      description: 'Centralized R&D center driving innovation across all subsidiaries — new products, patents, and breakthrough technologies.',
      details: 'Top conglomerates spend 3-5% of revenue on R&D. A centralized innovation hub shares discoveries across all business units. Patents generate licensing revenue. Breakthrough innovations create entirely new business verticals.',
      minInvestment: 120000000,
      maxInvestment: 350000000,
      emoji: '💡',
    },
  ],

  // ─── Space Agency ───
  space_agency: [
    {
      id: 'satellite_services',
      title: 'Satellite Communication Services',
      description: 'Launch communication satellites for internet, broadcasting, GPS, and Earth observation — the backbone of modern connectivity.',
      details: 'The satellite services market is worth $280 billion. Offer broadband internet to remote areas, provide Earth imaging for agriculture and defense, and launch broadcasting satellites. Each satellite generates recurring revenue for 15+ years.',
      minInvestment: 300000000,
      maxInvestment: 700000000,
      emoji: '🛰️',
    },
    {
      id: 'space_tourism',
      title: 'Space Tourism & Research',
      description: 'Suborbital flights for tourists, microgravity research labs, and partnerships with space agencies for crew transport.',
      details: 'Space tourism tickets sell for $250,000-$500,000. Initially offer suborbital experiences, then progress to orbital stays. Microgravity research labs attract pharmaceutical and materials science companies paying premium for experiments.',
      minInvestment: 400000000,
      maxInvestment: 800000000,
      emoji: '🚀',
    },
    {
      id: 'launch_services',
      title: 'Commercial Launch Services',
      description: 'Reusable rocket technology for affordable satellite deployment — serve governments, telecom companies, and research organizations.',
      details: 'Reusable rockets reduced launch costs by 90%. Offer dedicated launches for large satellites and rideshare missions for small satellites. Long-term contracts with governments and telecom giants ensure stable, massive revenue streams.',
      minInvestment: 500000000,
      maxInvestment: 1000000000,
      emoji: '🏗️',
    },
  ],
};

// ═══════════════════════════════════════════════════════
// MERGER ANALYSTS — Expert recommendations per trend
// ═══════════════════════════════════════════════════════

const ANALYST_POOL = {
  food: [
    { id: 'a_food_1', name: 'Chef Rajesh Mehta', role: 'Culinary Business Consultant', emoji: '👨‍🍳' },
    { id: 'a_food_2', name: 'Priya Sharma', role: 'F&B Industry Analyst', emoji: '👩‍💼' },
    { id: 'a_food_3', name: 'Amit Kulkarni', role: 'Restaurant Chain Advisor', emoji: '👨‍💼' },
  ],
  beauty: [
    { id: 'a_beauty_1', name: 'Dr. Meera Patel', role: 'Dermatology Expert', emoji: '👩‍⚕️' },
    { id: 'a_beauty_2', name: 'Kavita Reddy', role: 'Beauty Industry Strategist', emoji: '💄' },
    { id: 'a_beauty_3', name: 'Arjun Nair', role: 'Wellness Brand Consultant', emoji: '🧘' },
  ],
  retail: [
    { id: 'a_retail_1', name: 'Vikram Singh', role: 'Retail Strategy Expert', emoji: '🏪' },
    { id: 'a_retail_2', name: 'Sneha Gupta', role: 'E-Commerce Analyst', emoji: '📊' },
    { id: 'a_retail_3', name: 'Rahul Joshi', role: 'Supply Chain Consultant', emoji: '📦' },
  ],
  auto: [
    { id: 'a_auto_1', name: 'Suresh Rajan', role: 'Automotive Industry Expert', emoji: '🚗' },
    { id: 'a_auto_2', name: 'Deepa Menon', role: 'EV Market Analyst', emoji: '⚡' },
    { id: 'a_auto_3', name: 'Karthik Iyer', role: 'Auto Dealership Advisor', emoji: '🏎️' },
  ],
  logistics: [
    { id: 'a_log_1', name: 'Naveen Kumar', role: 'Supply Chain Expert', emoji: '🚛' },
    { id: 'a_log_2', name: 'Anita Desai', role: 'Logistics Tech Analyst', emoji: '📡' },
    { id: 'a_log_3', name: 'Manish Agarwal', role: 'Fleet Management Consultant', emoji: '🗺️' },
  ],
  fashion: [
    { id: 'a_fashion_1', name: 'Simran Kaur', role: 'Fashion Design Director', emoji: '👗' },
    { id: 'a_fashion_2', name: 'Rohan Malhotra', role: 'Textile Industry Expert', emoji: '🧵' },
    { id: 'a_fashion_3', name: 'Nisha Verma', role: 'Brand Strategy Consultant', emoji: '✨' },
  ],
  education: [
    { id: 'a_edu_1', name: 'Prof. Arun Saxena', role: 'EdTech Pioneer', emoji: '🎓' },
    { id: 'a_edu_2', name: 'Divya Krishnan', role: 'Learning Science Expert', emoji: '📚' },
    { id: 'a_edu_3', name: 'Sanjay Bhatt', role: 'Education Policy Advisor', emoji: '🏫' },
  ],
  health: [
    { id: 'a_health_1', name: 'Dr. Aisha Khan', role: 'Healthcare Strategy Consultant', emoji: '🩺' },
    { id: 'a_health_2', name: 'Dr. Raghav Srinivasan', role: 'Hospital Management Expert', emoji: '🏥' },
    { id: 'a_health_3', name: 'Pooja Mittal', role: 'HealthTech Analyst', emoji: '💊' },
  ],
  tech: [
    { id: 'a_tech_1', name: 'Anand Krishnamurthy', role: 'Tech Venture Strategist', emoji: '💻' },
    { id: 'a_tech_2', name: 'Ritu Agarwal', role: 'AI/ML Industry Expert', emoji: '🤖' },
    { id: 'a_tech_3', name: 'Varun Shenoy', role: 'FinTech Consultant', emoji: '📈' },
  ],
  hospitality: [
    { id: 'a_hosp_1', name: 'Kabir Anand', role: 'Luxury Hospitality Expert', emoji: '🏨' },
    { id: 'a_hosp_2', name: 'Maya Chatterjee', role: 'Tourism Industry Analyst', emoji: '✈️' },
    { id: 'a_hosp_3', name: 'Harsh Vardhan', role: 'Hotel Revenue Strategist', emoji: '📊' },
  ],
  energy: [
    { id: 'a_energy_1', name: 'Dr. Sunita Narain', role: 'Energy Policy Expert', emoji: '⚡' },
    { id: 'a_energy_2', name: 'Rakesh Mohan', role: 'Petroleum Industry Veteran', emoji: '🛢️' },
    { id: 'a_energy_3', name: 'Anjali Bhargava', role: 'Renewable Energy Analyst', emoji: '☀️' },
  ],
  conglomerate: [
    { id: 'a_cong_1', name: 'Rajiv Kapoor', role: 'Corporate Strategy Advisor', emoji: '👑' },
    { id: 'a_cong_2', name: 'Lakshmi Narayan', role: 'M&A Specialist', emoji: '🤝' },
    { id: 'a_cong_3', name: 'Arvind Subramanian', role: 'Global Business Consultant', emoji: '🌐' },
  ],
  space: [
    { id: 'a_space_1', name: 'Dr. Kartik Raman', role: 'Aerospace Engineer', emoji: '🚀' },
    { id: 'a_space_2', name: 'Neha Bhaskar', role: 'Space Economy Analyst', emoji: '🛰️' },
    { id: 'a_space_3', name: 'Prof. V.K. Sharma', role: 'ISRO Former Scientist', emoji: '🔭' },
  ],
};

const MERGER_TO_ANALYST_CATEGORY = {
  street_food_chain: 'food',
  beauty_wellness: 'beauty',
  retail_empire: 'retail',
  food_empire: 'food',
  auto_group: 'auto',
  logistics_kingdom: 'logistics',
  fashion_brand: 'fashion',
  education_group: 'education',
  healthcare_group: 'health',
  tech_conglomerate: 'tech',
  hospitality_chain: 'hospitality',
  energy_corp: 'energy',
  conglomerate: 'conglomerate',
  space_agency: 'space',
};

// Dynamic analyst quotes for each trend
const ANALYST_QUOTES = {
  // Street Food Chain
  health_street: [
    'Health-conscious street food is the fastest growing segment — expect 35% year-over-year growth in metro cities.',
    'Millets and organic ingredients add 20-30% to ingredient costs but command 50-60% higher prices from customers.',
    'The key differentiator is transparency — show customers your ingredients and preparation methods openly.',
  ],
  fusion_street: [
    'Fusion food creates viral social media moments. Budget 15% of revenue for Instagram marketing.',
    'Indo-Chinese fusion alone is a ₹25,000 crore market. But innovation must be continuous.',
    'Start with 3-4 signature fusion items, perfect them, then expand. Quality over variety wins.',
  ],
  regional_authentic: [
    'Authenticity is your moat — competitors cannot easily replicate generations-old recipes.',
    'Source spices directly from the region of origin. Customers can taste the difference.',
    'Build stories around each dish — the heritage, the region, the traditional cooking methods.',
  ],

  // Beauty & Wellness
  organic_beauty: [
    'Organic beauty market in India is growing at 25% CAGR — much faster than conventional beauty.',
    'Ayurvedic certifications from AYUSH ministry can increase pricing power by 40%.',
    'Partner with organic farms for ingredient sourcing and showcase the farm-to-face journey.',
  ],
  tech_beauty: [
    'LED therapy and laser treatments have 70% margins — invest in technology, recoup in months.',
    'AI skin analysis creates personalized treatment plans and builds long-term customer relationships.',
    'Train staff on advanced equipment — customer safety and trust are paramount with tech treatments.',
  ],
  mens_grooming: [
    'Men\'s grooming market is growing 15% annually — most salons still don\'t cater specifically to men.',
    'Create a masculine, comfortable environment — leather chairs, sports channels, premium beverages.',
    'Subscription models for monthly grooming packages ensure recurring revenue and customer loyalty.',
  ],

  // Retail Empire
  omnichannel: [
    'Omnichannel customers spend 4x more than single-channel customers. Integration is key.',
    'Unified inventory management prevents stockouts and overstock — saving 15-20% on working capital.',
    'Same-day delivery capability increases online order conversion by 40% in your serviceable area.',
  ],
  private_label: [
    'Private labels achieve 40-60% gross margins versus 15-20% for third-party brands.',
    'Start with daily essentials — customers are willing to try new brands for staples.',
    'Quality consistency is critical — one bad batch can destroy years of private label brand building.',
  ],
  experience_retail: [
    'Experiential stores see 3x footfall compared to traditional formats.',
    'Interactive product demos convert 28% of walk-ins versus 8% for passive display.',
    'Community events build emotional connections — workshops, launches, and seasonal celebrations.',
  ],

  // Food Empire
  cloud_kitchen: [
    'Cloud kitchens can operate 5-8 virtual brands from one location — maximizing kitchen utilization.',
    'Menu engineering is crucial — each virtual brand should have 15-20 optimized items, not 100.',
    'Delivery packaging innovation can reduce food quality complaints by 60%.',
  ],
  farm_to_table: [
    'Farm-to-table restaurants command 30-40% premium pricing. Customers pay for trust.',
    'Build direct relationships with 10-15 farmers — this becomes your marketing story.',
    'Seasonal menus create excitement and reduce waste — customers return to try new offerings.',
  ],
  franchise_model: [
    'Successful franchise systems have operations manuals exceeding 500 pages — detail is everything.',
    'Charge 5-8% royalty on revenue plus initial franchise fee. This ensures alignment of interests.',
    'Mystery shoppers and regular audits maintain quality standards across all franchise locations.',
  ],

  // Auto Group
  ev_transition: [
    'EV after-sales service has 60% lower competition than ICE vehicles — first movers win big.',
    'Install fast-charging stations — they attract customers and generate ₹15-20 per kWh revenue.',
    'Train mechanics on high-voltage battery systems — certified EV technicians are scarce and valuable.',
  ],
  premium_custom: [
    'Premium customization has margins exceeding 60% — customers don\'t price-compare bespoke work.',
    'Ceramic coating alone can be a ₹50,000-1,00,000 service. One car per day at these margins is profitable.',
    'Build a portfolio of completed projects — visual proof drives referrals in the luxury segment.',
  ],
  used_car_certified: [
    'The used car market is 1.5x the new car market — massive opportunity with trust as the differentiator.',
    '150-point inspection certification gives buyers confidence and justifies 10-15% premium over market.',
    'In-house financing increases average transaction profit by 30% — partner with NBFCs.',
  ],

  // Logistics Kingdom
  last_mile: [
    'Last-mile delivery is 53% of total shipping cost — any efficiency here impacts profitability massively.',
    'Electric cargo bikes for city centers reduce delivery costs by 40% and navigate traffic better.',
    'Micro-fulfillment centers within 3km of demand clusters enable 30-minute delivery promises.',
  ],
  cold_chain: [
    'India loses ₹92,000 crore worth of food annually due to poor cold chains — massive opportunity.',
    'Real-time temperature monitoring with IoT sensors ensures compliance and builds trust with pharma clients.',
    'Cold chain logistics commands 3x the rates of standard logistics — margins are significantly higher.',
  ],
  smart_logistics: [
    'AI route optimization reduces fuel costs by 15% and delivery time by 20% — immediate ROI.',
    'Predictive demand models help position inventory before orders come in — reducing delivery time.',
    'Warehouse robotics can increase throughput by 300% while reducing errors to near zero.',
  ],

  // Fashion Brand
  retro_fashion: [
    'Retro clothing is prized for its quality, so buyers favor premium fabrics that match the aesthetics of the era.',
    'Vintage-inspired collections at fashion weeks consistently outperform modern minimalist designs by 25%.',
    'Social media nostalgia content paired with retro collections creates powerful emotional marketing.',
  ],
  sustainable_fashion: [
    'Sustainable fashion consumers have 35% higher brand loyalty — they don\'t switch for small discounts.',
    'Recycled polyester costs only 10% more than virgin material but commands 40% higher retail price.',
    'B Corp and GOTS certifications are worth the investment — they open doors to international markets.',
  ],
  tech_wear: [
    'Smart textiles market is growing at 26% CAGR — temperature-regulating fabrics are the gateway product.',
    'Partner with textile research institutes for proprietary fabric technology — patents protect your advantage.',
    'Tech-wear appeals to the 25-40 age group with disposable income — price sensitivity is lowest here.',
  ],

  // Education Group
  ai_learning: [
    'AI-personalized learning shows 40% better outcomes — parents will pay premium for proven results.',
    'Adaptive learning platforms require significant upfront investment but scale with near-zero marginal cost.',
    'Combine AI with human mentors for the sweet spot — technology for practice, humans for motivation.',
  ],
  skill_based: [
    'Industry certifications with job placement guarantees attract working professionals seeking career switches.',
    'Revenue-sharing with placement companies ensures quality — you only earn when students get placed.',
    'Focus on 3-5 high-demand skills rather than 50 mediocre courses. Depth beats breadth.',
  ],
  immersive_learning: [
    'VR education improves retention by 75% — students remember experiences, not lectures.',
    'Create virtual science labs, historical recreations, and engineering simulations that are impossible in reality.',
    'Partner with schools for VR classroom hours — subscription model at ₹500/student/month is viable.',
  ],

  // Healthcare Group
  telemedicine: [
    'Telemedicine consultations grew 500% post-pandemic — patients now expect virtual options as standard.',
    'AI symptom checker as the first touchpoint reduces doctor workload by 30% and improves triage.',
    'Integrate pharmacy delivery with teleconsultation — patients get medicine within 2 hours of consultation.',
  ],
  preventive_health: [
    'Prevention programs have 3x ROI — corporate clients save on employee healthcare costs significantly.',
    'Subscription health packages with annual check-ups ensure 80% customer retention year over year.',
    'Genetic testing for health risks is the premium tier — customers pay ₹25,000-50,000 for comprehensive reports.',
  ],
  specialty_centers: [
    'Specialty hospitals achieve 30% higher margins than multi-specialty general hospitals.',
    'Top specialists attract patients from across the country — invest in talent acquisition.',
    'International medical tourism to Indian specialty centers grows 20% annually — build for global patients.',
  ],

  // Tech Conglomerate
  fintech_platform: [
    'FinTech super apps achieve ₹10,000+ revenue per user annually through cross-selling financial products.',
    'Start with payments, build transaction history, then offer lending based on spending patterns.',
    'RBI digital lending guidelines require compliance — invest in regulatory technology from day one.',
  ],
  ai_saas: [
    'AI-as-a-Service market grows 35% annually — enterprise clients prefer APIs over building in-house.',
    'Usage-based pricing aligns costs with customer value — start free, scale pricing with usage.',
    'Pre-trained models for specific industries (legal, medical, retail) command 5x premium over generic models.',
  ],
  cybersecurity: [
    'Cybercrime costs businesses $8 trillion annually — security budgets are the last to be cut.',
    'Managed security services with 24/7 SOC generate recurring annual contracts of ₹50 lakhs+.',
    'Compliance management (GDPR, PCI-DSS) is a must-have — companies pay to avoid penalties.',
  ],

  // Hospitality Chain
  boutique_hotels: [
    'Boutique hotels command 40-60% premium over standard hotels — uniqueness is the value proposition.',
    'Each property should tell a story — local art, cuisine, and culture create memorable experiences.',
    'Instagram-worthy design drives organic marketing — invest 20% more in interiors for 3x the bookings.',
  ],
  integrated_resort: [
    'Integrated resorts achieve 3x revenue per guest — guests stay longer and spend on activities.',
    'Convention and wedding venues can contribute 30% of resort revenue with high margins.',
    'Build in phases — start with hotel and F&B, add entertainment and retail in year 2-3.',
  ],
  smart_hospitality: [
    'Smart hotel technology reduces operational costs by 20% while improving guest satisfaction scores.',
    'Contactless check-in reduces front desk staff by 50% — guests also prefer the convenience.',
    'AI-powered personalization (remembering guest preferences) increases repeat booking rates by 35%.',
  ],

  // Energy Corporation
  renewable_energy: [
    'Solar energy is now cheaper than coal — ₹2.5/kWh vs ₹4/kWh. The economics are irrefutable.',
    'Carbon credits generate additional ₹800-1200 per tonne of CO2 avoided — meaningful revenue stream.',
    'Government incentives cover 40% of renewable energy project costs — accelerated depreciation benefits.',
  ],
  petrochemicals: [
    'Petrochemical processing multiplies crude oil value 3-4x — the margin is in processing, not extraction.',
    'Specialty chemicals have margins of 25-35% versus 8-12% for commodity chemicals.',
    'Build backward integration — owning feedstock supply ensures consistent margins regardless of crude prices.',
  ],
  energy_trading: [
    'Energy price volatility creates trading opportunities — skilled traders generate 15-20% annual returns.',
    'Grid-scale battery storage earns revenue from arbitrage — store cheap night power, sell expensive peak power.',
    'Strategic petroleum reserves provide security and generate revenue when prices spike.',
  ],

  // Conglomerate Holdings
  vertical_integration: [
    'Vertically integrated companies capture 3-4x the margin of single-stage businesses.',
    'Control from raw materials to retail eliminates middlemen — each eliminated layer adds 5-10% to margins.',
    'Internal transfer pricing optimization across subsidiaries can reduce total tax burden legally.',
  ],
  global_expansion: [
    'Indian conglomerates with global presence trade at 30% premium valuation multiples.',
    'Start with markets having Indian diaspora — Middle East, Southeast Asia, Africa for easier entry.',
    'Acquire established local brands rather than building from scratch — faster market penetration.',
  ],
  innovation_hub: [
    'Companies spending 3-5% on R&D grow revenue 2x faster than industry peers over 10 years.',
    'Centralized R&D shares innovations across all business units — one discovery benefits entire conglomerate.',
    'Patent portfolios generate licensing revenue — some conglomerates earn ₹500+ crores from patents alone.',
  ],

  // Space Agency
  satellite_services: [
    'Each communication satellite generates ₹200-500 crore annual revenue for 15+ years — incredible ROI.',
    'Earth observation data demand grows 25% annually — agriculture, defense, and urban planning clients.',
    'Satellite internet for remote areas has zero competition from terrestrial providers — captive market.',
  ],
  space_tourism: [
    'Space tourism tickets at $250,000-500,000 already have waitlists of 800+ wealthy customers.',
    'Microgravity research labs attract pharma companies paying $50,000/day for experiments.',
    'Start with stratospheric balloon flights at ₹50 lakhs — lower risk, builds brand, funds rocket development.',
  ],
  launch_services: [
    'Reusable rockets reduced launch costs by 90% — each reuse saves ₹200-400 crore.',
    'Small satellite rideshare missions have 18-month waitlists — massive demand for affordable launches.',
    'Government contracts for military and communication satellites provide stable, long-term revenue.',
  ],
};

export const getMergerAnalysts = (mergerId, trendId) => {
  const category = MERGER_TO_ANALYST_CATEGORY[mergerId] || 'retail';
  const analysts = ANALYST_POOL[category] || ANALYST_POOL.retail;
  const quotes = ANALYST_QUOTES[trendId] || [
    'This market segment shows strong growth potential over the next 5 years.',
    'Early entrants in this space will capture the majority of market share.',
    'Focus on quality and customer experience to build a sustainable competitive advantage.',
  ];

  return analysts.map((analyst, idx) => ({
    ...analyst,
    quote: quotes[idx] || quotes[0],
  }));
};


// ═══════════════════════════════════════════════════════
// CONFIGURATOR OPTIONS — Parameters per merger type
// ═══════════════════════════════════════════════════════

const CONFIGURATOR_DEFINITIONS = {
  // Street Food Chain
  street_food_chain: {
    style: {
      label: 'Menu Style',
      icon: UtensilsCrossed,
      options: [
        { id: 'traditional', name: 'Traditional Recipes', subtitle: 'Classic flavors, proven sellers', score: 75 },
        { id: 'modern_twist', name: 'Modern Twist', subtitle: 'Updated classics with creative presentation', score: 90 },
        { id: 'experimental', name: 'Experimental Fusion', subtitle: 'Bold new flavor combinations', score: 65 },
        { id: 'regional_mix', name: 'Multi-Regional Mix', subtitle: 'Best dishes from across India', score: 85 },
      ],
    },
    quality: {
      label: 'Ingredient Quality',
      icon: Shield,
      options: [
        { id: 'budget', name: 'Budget Sourcing', subtitle: 'Wholesale market ingredients', score: 50 },
        { id: 'standard', name: 'Standard Quality', subtitle: 'Reliable supplier partnerships', score: 70 },
        { id: 'premium', name: 'Premium Organic', subtitle: 'Organic, farm-fresh ingredients', score: 95 },
        { id: 'mixed', name: 'Smart Mix', subtitle: 'Premium for key items, standard for rest', score: 85 },
      ],
    },
    audience: {
      label: 'Target Audience',
      icon: Users,
      options: [
        { id: 'students', name: 'Students & Youth', subtitle: 'Affordable, trendy, social media worthy', score: 70 },
        { id: 'office', name: 'Office Workers', subtitle: 'Quick, quality lunch options', score: 85 },
        { id: 'families', name: 'Family Customers', subtitle: 'Safe, hygienic, kid-friendly', score: 80 },
        { id: 'foodies', name: 'Food Enthusiasts', subtitle: 'Unique flavors, premium experience', score: 90 },
      ],
    },
    price: {
      label: 'Pricing Strategy',
      icon: Target,
      options: [
        { id: 'value', name: 'Value for Money', subtitle: '₹30-80 per item', score: 65 },
        { id: 'mid_range', name: 'Mid-Range', subtitle: '₹80-200 per item', score: 80 },
        { id: 'premium', name: 'Premium Street Food', subtitle: '₹200-500 per item', score: 90 },
        { id: 'dynamic', name: 'Dynamic Pricing', subtitle: 'Peak hours premium, off-peak discounts', score: 85 },
      ],
    },
  },

  // Beauty & Wellness
  beauty_wellness: {
    style: {
      label: 'Service Style',
      icon: Sparkles,
      options: [
        { id: 'classic', name: 'Classic Beauty', subtitle: 'Timeless treatments and techniques', score: 70 },
        { id: 'modern', name: 'Modern & Trendy', subtitle: 'Latest beauty trends and techniques', score: 85 },
        { id: 'holistic', name: 'Holistic Wellness', subtitle: 'Mind-body approach to beauty', score: 90 },
        { id: 'clinical', name: 'Clinical Beauty', subtitle: 'Medical-grade treatments', score: 80 },
      ],
    },
    quality: {
      label: 'Product Quality',
      icon: Shield,
      options: [
        { id: 'local', name: 'Local Brands', subtitle: 'Affordable domestic products', score: 55 },
        { id: 'national', name: 'National Premium', subtitle: 'Top Indian beauty brands', score: 75 },
        { id: 'international', name: 'International Premium', subtitle: 'Global luxury brands', score: 95 },
        { id: 'organic', name: 'Organic & Natural', subtitle: 'Pure, chemical-free products', score: 85 },
      ],
    },
    audience: {
      label: 'Target Audience',
      icon: Users,
      options: [
        { id: 'budget', name: 'Budget-Conscious', subtitle: 'Students and young professionals', score: 60 },
        { id: 'working_women', name: 'Working Women', subtitle: 'Career professionals seeking quality', score: 85 },
        { id: 'luxury', name: 'Luxury Seekers', subtitle: 'HNI clients wanting exclusive experiences', score: 95 },
        { id: 'men', name: 'Men\'s Market', subtitle: 'Growing male grooming segment', score: 80 },
      ],
    },
    price: {
      label: 'Pricing Tier',
      icon: Target,
      options: [
        { id: 'affordable', name: 'Affordable', subtitle: 'Mass market pricing', score: 55 },
        { id: 'mid', name: 'Mid-Premium', subtitle: 'Quality at reasonable prices', score: 75 },
        { id: 'premium', name: 'Premium', subtitle: 'High-end pricing for exclusivity', score: 90 },
        { id: 'membership', name: 'Membership Model', subtitle: 'Monthly subscriptions with perks', score: 85 },
      ],
    },
  },

  // Fashion Brand
  fashion_brand: {
    style: {
      label: 'Design Direction',
      icon: Palette,
      options: [
        { id: 'minimalism', name: 'Minimalism', subtitle: 'Clean lines, neutral tones, timeless', score: 85 },
        { id: 'vintage', name: 'Vintage Revival', subtitle: 'Retro aesthetics, classic cuts', score: 80 },
        { id: 'modern', name: 'Modern Fashion', subtitle: 'Contemporary trends, bold statements', score: 75 },
        { id: 'avantgarde', name: 'Avant-Garde', subtitle: 'Experimental, boundary-pushing designs', score: 70 },
      ],
    },
    quality: {
      label: 'Fabric Quality',
      icon: Shield,
      options: [
        { id: 'standard', name: 'Standard Fabrics', subtitle: 'Cotton blends, polyester mix', score: 55 },
        { id: 'premium', name: 'Premium Fabrics', subtitle: 'Egyptian cotton, silk, linen', score: 90 },
        { id: 'sustainable', name: 'Sustainable Materials', subtitle: 'Recycled, organic, eco-certified', score: 95 },
        { id: 'tech_fabric', name: 'Technical Fabrics', subtitle: 'Smart textiles, performance materials', score: 85 },
      ],
    },
    audience: {
      label: 'Target Market',
      icon: Users,
      options: [
        { id: 'youth', name: 'Youth Market', subtitle: 'Gen Z, trend-driven, social media savvy', score: 70 },
        { id: 'professional', name: 'Business Professionals', subtitle: 'Corporate wear, formal elegance', score: 85 },
        { id: 'luxury', name: 'Luxury Consumers', subtitle: 'HNI clients, exclusive collections', score: 95 },
        { id: 'mass', name: 'Mass Market', subtitle: 'Affordable fashion for everyone', score: 60 },
      ],
    },
    price: {
      label: 'Price Positioning',
      icon: Target,
      options: [
        { id: 'affordable', name: 'Affordable', subtitle: 'Competitive pricing, high volume', score: 55 },
        { id: 'mid_premium', name: 'Mid-Premium', subtitle: 'Balanced quality and price', score: 80 },
        { id: 'luxury', name: 'Luxury Pricing', subtitle: 'Premium pricing for exclusivity', score: 95 },
        { id: 'value_luxury', name: 'Accessible Luxury', subtitle: 'Luxury feel at achievable prices', score: 90 },
      ],
    },
  },

  // Default — used for mergers without specific configurator
  _default: {
    style: {
      label: 'Business Strategy',
      icon: TrendingUp,
      options: [
        { id: 'conservative', name: 'Conservative Growth', subtitle: 'Steady, low-risk expansion', score: 70 },
        { id: 'balanced', name: 'Balanced Approach', subtitle: 'Moderate risk, moderate growth', score: 80 },
        { id: 'aggressive', name: 'Aggressive Expansion', subtitle: 'High risk, high reward strategy', score: 65 },
        { id: 'innovation', name: 'Innovation-Led', subtitle: 'Technology-first approach', score: 90 },
      ],
    },
    quality: {
      label: 'Service Quality',
      icon: Shield,
      options: [
        { id: 'basic', name: 'Basic Quality', subtitle: 'Meet minimum standards', score: 50 },
        { id: 'good', name: 'Good Quality', subtitle: 'Above average standards', score: 70 },
        { id: 'excellent', name: 'Excellent Quality', subtitle: 'Best-in-class delivery', score: 90 },
        { id: 'world_class', name: 'World-Class', subtitle: 'Global benchmark standards', score: 100 },
      ],
    },
    audience: {
      label: 'Target Segment',
      icon: Users,
      options: [
        { id: 'mass', name: 'Mass Market', subtitle: 'Wide reach, volume-driven', score: 60 },
        { id: 'mid', name: 'Mid-Segment', subtitle: 'Quality-conscious customers', score: 75 },
        { id: 'premium', name: 'Premium Segment', subtitle: 'High-value customers', score: 90 },
        { id: 'niche', name: 'Niche Market', subtitle: 'Specialized, loyal customer base', score: 85 },
      ],
    },
    price: {
      label: 'Pricing Model',
      icon: Target,
      options: [
        { id: 'low_cost', name: 'Cost Leader', subtitle: 'Lowest price in market', score: 55 },
        { id: 'value', name: 'Value Pricing', subtitle: 'Fair price for quality offered', score: 75 },
        { id: 'premium', name: 'Premium Pricing', subtitle: 'Higher price, higher perceived value', score: 90 },
        { id: 'freemium', name: 'Freemium Model', subtitle: 'Free basics, paid premium features', score: 80 },
      ],
    },
  },
};

// Copy specific configs for mergers that share patterns
CONFIGURATOR_DEFINITIONS.retail_empire = {
  style: {
    label: 'Retail Format',
    icon: Store,
    options: [
      { id: 'department', name: 'Department Store', subtitle: 'Multi-category, organized sections', score: 80 },
      { id: 'specialty', name: 'Specialty Retail', subtitle: 'Expert in specific categories', score: 85 },
      { id: 'warehouse', name: 'Warehouse Club', subtitle: 'Bulk buying, membership model', score: 75 },
      { id: 'experience', name: 'Experience Store', subtitle: 'Interactive, immersive shopping', score: 90 },
    ],
  },
  quality: CONFIGURATOR_DEFINITIONS._default.quality,
  audience: CONFIGURATOR_DEFINITIONS._default.audience,
  price: CONFIGURATOR_DEFINITIONS._default.price,
};

CONFIGURATOR_DEFINITIONS.food_empire = {
  style: {
    label: 'Dining Concept',
    icon: UtensilsCrossed,
    options: [
      { id: 'multi_cuisine', name: 'Multi-Cuisine', subtitle: 'Diverse menu for all tastes', score: 75 },
      { id: 'signature', name: 'Signature Cuisine', subtitle: 'One cuisine, perfected', score: 90 },
      { id: 'fast_casual', name: 'Fast Casual', subtitle: 'Quick service, quality food', score: 80 },
      { id: 'fine_dining', name: 'Fine Dining Focus', subtitle: 'Premium experience, premium pricing', score: 85 },
    ],
  },
  quality: {
    label: 'Ingredient Sourcing',
    icon: Shield,
    options: [
      { id: 'local_market', name: 'Local Market', subtitle: 'Fresh from local vendors', score: 65 },
      { id: 'verified', name: 'Verified Suppliers', subtitle: 'Quality-checked supply chain', score: 80 },
      { id: 'organic', name: 'Organic & Premium', subtitle: 'Certified organic ingredients', score: 95 },
      { id: 'imported', name: 'Imported Specialties', subtitle: 'Global ingredients for authenticity', score: 85 },
    ],
  },
  audience: CONFIGURATOR_DEFINITIONS.street_food_chain.audience,
  price: CONFIGURATOR_DEFINITIONS._default.price,
};

CONFIGURATOR_DEFINITIONS.auto_group = {
  style: {
    label: 'Auto Strategy',
    icon: Car,
    options: [
      { id: 'full_service', name: 'Full Service Center', subtitle: 'Sales, service, parts — everything', score: 85 },
      { id: 'ev_focused', name: 'EV-Focused', subtitle: 'Electric vehicle specialization', score: 90 },
      { id: 'luxury_only', name: 'Luxury Segment', subtitle: 'Premium and luxury brands only', score: 80 },
      { id: 'volume', name: 'Volume Player', subtitle: 'Mass-market, high volume sales', score: 70 },
    ],
  },
  quality: CONFIGURATOR_DEFINITIONS._default.quality,
  audience: CONFIGURATOR_DEFINITIONS._default.audience,
  price: CONFIGURATOR_DEFINITIONS._default.price,
};

CONFIGURATOR_DEFINITIONS.logistics_kingdom = {
  style: {
    label: 'Logistics Model',
    icon: Truck,
    options: [
      { id: 'asset_heavy', name: 'Asset-Heavy', subtitle: 'Own fleet, full control', score: 75 },
      { id: 'asset_light', name: 'Asset-Light Platform', subtitle: 'Aggregator model, low capex', score: 85 },
      { id: 'specialized', name: 'Specialized Logistics', subtitle: 'Cold chain, hazmat, oversized', score: 90 },
      { id: 'hybrid', name: 'Hybrid Model', subtitle: 'Core fleet + partner network', score: 80 },
    ],
  },
  quality: CONFIGURATOR_DEFINITIONS._default.quality,
  audience: CONFIGURATOR_DEFINITIONS._default.audience,
  price: CONFIGURATOR_DEFINITIONS._default.price,
};

CONFIGURATOR_DEFINITIONS.education_group = {
  style: {
    label: 'Education Model',
    icon: BookOpen,
    options: [
      { id: 'traditional', name: 'Traditional Coaching', subtitle: 'Classroom-based, exam-focused', score: 65 },
      { id: 'hybrid', name: 'Hybrid Learning', subtitle: 'Online + offline blend', score: 85 },
      { id: 'pure_digital', name: 'Pure Digital', subtitle: 'Fully online, scalable', score: 80 },
      { id: 'experiential', name: 'Experiential Learning', subtitle: 'Project-based, hands-on approach', score: 90 },
    ],
  },
  quality: CONFIGURATOR_DEFINITIONS._default.quality,
  audience: {
    label: 'Student Segment',
    icon: Users,
    options: [
      { id: 'k12', name: 'K-12 Students', subtitle: 'School-age competitive exam prep', score: 75 },
      { id: 'college', name: 'College Students', subtitle: 'Degree supplements, skill courses', score: 80 },
      { id: 'professionals', name: 'Working Professionals', subtitle: 'Upskilling, career transitions', score: 90 },
      { id: 'all', name: 'All Age Groups', subtitle: 'Lifelong learning platform', score: 70 },
    ],
  },
  price: CONFIGURATOR_DEFINITIONS._default.price,
};

CONFIGURATOR_DEFINITIONS.healthcare_group = {
  style: {
    label: 'Healthcare Model',
    icon: Stethoscope,
    options: [
      { id: 'general', name: 'General Healthcare', subtitle: 'Multi-specialty, all-inclusive', score: 75 },
      { id: 'specialty', name: 'Specialty Focus', subtitle: 'Expert in specific treatments', score: 90 },
      { id: 'preventive', name: 'Preventive Health', subtitle: 'Wellness-focused, proactive care', score: 85 },
      { id: 'digital_health', name: 'Digital Health Platform', subtitle: 'Telemedicine + physical hybrid', score: 80 },
    ],
  },
  quality: {
    label: 'Medical Standards',
    icon: Shield,
    options: [
      { id: 'standard', name: 'Standard Care', subtitle: 'Meet regulatory requirements', score: 60 },
      { id: 'accredited', name: 'NABH Accredited', subtitle: 'National quality certification', score: 80 },
      { id: 'jci', name: 'JCI Accredited', subtitle: 'International gold standard', score: 95 },
      { id: 'research', name: 'Research Hospital', subtitle: 'Teaching + research + treatment', score: 90 },
    ],
  },
  audience: CONFIGURATOR_DEFINITIONS._default.audience,
  price: CONFIGURATOR_DEFINITIONS._default.price,
};

CONFIGURATOR_DEFINITIONS.tech_conglomerate = {
  style: {
    label: 'Tech Strategy',
    icon: Cpu,
    options: [
      { id: 'product', name: 'Product Company', subtitle: 'Own products, global market', score: 90 },
      { id: 'services', name: 'IT Services', subtitle: 'Outsourcing, consulting, support', score: 70 },
      { id: 'platform', name: 'Platform Business', subtitle: 'Marketplace, ecosystem play', score: 95 },
      { id: 'hybrid_tech', name: 'Products + Services', subtitle: 'Balanced approach', score: 80 },
    ],
  },
  quality: CONFIGURATOR_DEFINITIONS._default.quality,
  audience: CONFIGURATOR_DEFINITIONS._default.audience,
  price: CONFIGURATOR_DEFINITIONS._default.price,
};

CONFIGURATOR_DEFINITIONS.hospitality_chain = {
  style: {
    label: 'Hospitality Concept',
    icon: Hotel,
    options: [
      { id: 'luxury', name: 'Ultra Luxury', subtitle: '5-star+ premium experience', score: 90 },
      { id: 'boutique', name: 'Boutique & Unique', subtitle: 'Themed, Instagram-worthy properties', score: 95 },
      { id: 'business', name: 'Business Hotels', subtitle: 'Corporate-focused, efficient service', score: 75 },
      { id: 'resort', name: 'Resort & Leisure', subtitle: 'Vacation destinations, experiences', score: 85 },
    ],
  },
  quality: CONFIGURATOR_DEFINITIONS._default.quality,
  audience: CONFIGURATOR_DEFINITIONS._default.audience,
  price: CONFIGURATOR_DEFINITIONS._default.price,
};

CONFIGURATOR_DEFINITIONS.energy_corp = {
  style: {
    label: 'Energy Strategy',
    icon: Zap,
    options: [
      { id: 'traditional', name: 'Traditional Energy', subtitle: 'Oil & gas extraction focus', score: 65 },
      { id: 'renewable', name: 'Renewable First', subtitle: 'Solar, wind, green hydrogen', score: 90 },
      { id: 'integrated', name: 'Integrated Energy', subtitle: 'All sources, balanced portfolio', score: 85 },
      { id: 'downstream', name: 'Downstream Focus', subtitle: 'Refining, petrochemicals, retail', score: 80 },
    ],
  },
  quality: CONFIGURATOR_DEFINITIONS._default.quality,
  audience: CONFIGURATOR_DEFINITIONS._default.audience,
  price: CONFIGURATOR_DEFINITIONS._default.price,
};

CONFIGURATOR_DEFINITIONS.conglomerate = {
  style: {
    label: 'Conglomerate Strategy',
    icon: Crown,
    options: [
      { id: 'related', name: 'Related Diversification', subtitle: 'Synergistic business portfolio', score: 90 },
      { id: 'unrelated', name: 'Unrelated Diversification', subtitle: 'Diverse, uncorrelated portfolio', score: 70 },
      { id: 'vertical', name: 'Vertical Integration', subtitle: 'Control entire value chains', score: 85 },
      { id: 'platform', name: 'Platform Conglomerate', subtitle: 'Digital ecosystem connecting all units', score: 95 },
    ],
  },
  quality: CONFIGURATOR_DEFINITIONS._default.quality,
  audience: CONFIGURATOR_DEFINITIONS._default.audience,
  price: CONFIGURATOR_DEFINITIONS._default.price,
};

CONFIGURATOR_DEFINITIONS.space_agency = {
  style: {
    label: 'Space Strategy',
    icon: Rocket,
    options: [
      { id: 'launch', name: 'Launch Services', subtitle: 'Satellite deployment specialist', score: 85 },
      { id: 'satellite', name: 'Satellite Operations', subtitle: 'Build, launch, operate satellites', score: 90 },
      { id: 'exploration', name: 'Deep Space Exploration', subtitle: 'Moon, Mars, and beyond', score: 75 },
      { id: 'full_spectrum', name: 'Full Spectrum', subtitle: 'Launch + satellites + tourism + research', score: 95 },
    ],
  },
  quality: CONFIGURATOR_DEFINITIONS._default.quality,
  audience: {
    label: 'Client Segment',
    icon: Users,
    options: [
      { id: 'government', name: 'Government Agencies', subtitle: 'Defense, research, communication', score: 80 },
      { id: 'commercial', name: 'Commercial Clients', subtitle: 'Telecom, broadcasting, internet', score: 85 },
      { id: 'research', name: 'Research Organizations', subtitle: 'Universities, space agencies', score: 75 },
      { id: 'all_clients', name: 'All Segments', subtitle: 'Diversified client base', score: 90 },
    ],
  },
  price: CONFIGURATOR_DEFINITIONS._default.price,
};

export const getConfiguratorOptions = (mergerId) => {
  return CONFIGURATOR_DEFINITIONS[mergerId] || CONFIGURATOR_DEFINITIONS._default;
};

export const calculateConfigScore = (config, mergerId) => {
  const options = getConfiguratorOptions(mergerId);
  let totalScore = 0;
  let maxScore = 0;
  const categories = ['style', 'quality', 'audience', 'price'];

  categories.forEach(cat => {
    const catOptions = options[cat]?.options || [];
    const selected = catOptions.find(o => o.id === config[cat]);
    if (selected) totalScore += selected.score;
    maxScore += 100;
  });

  return { totalScore, maxScore, percentage: Math.round((totalScore / maxScore) * 100) };
};

export const getIncomeMultiplier = (scorePercentage) => {
  if (scorePercentage >= 90) return 1.5;    
  if (scorePercentage >= 80) return 1.35;   
  if (scorePercentage >= 70) return 1.2;    
  if (scorePercentage >= 60) return 1.1;    
  if (scorePercentage >= 50) return 1.0;    
  if (scorePercentage >= 40) return 0.85;   
  if (scorePercentage >= 30) return 0.7;    
  return 0.5;                               
};

// MERGER PHASES — 4 development phases per merger type
const PHASE_DEFINITIONS = {
  street_food_chain: [
    {
      id: 'recipe_dev', title: 'Recipe Development', icon: UtensilsCrossed,
      description: 'Hire expert chefs to standardize recipes across all outlets. Create a signature menu that defines your brand identity and ensures consistent taste at every location.',
      investmentPercent: 0.15, duration: 4 * 3600, color: 'bg-amber-500',
    },
    {
      id: 'branding', title: 'Brand Identity & Packaging', icon: Palette,
      description: 'Design a memorable brand identity — logo, color scheme, uniforms, and packaging. Create Instagram-worthy food presentations that customers share on social media.',
      investmentPercent: 0.12, duration: 3 * 3600, color: 'bg-pink-500',
    },
    {
      id: 'supply_chain', title: 'Supply Chain Setup', icon: Truck,
      description: 'Establish centralized ingredient sourcing, quality control, and daily supply distribution to all outlets. Negotiate bulk deals with suppliers for better margins.',
      investmentPercent: 0.18, duration: 3.5 * 3600, color: 'bg-blue-500',
    },
    {
      id: 'launch', title: 'Grand Chain Launch', icon: Rocket,
      description: 'Official launch across all locations with influencer partnerships, free sampling events, and social media campaigns. Create buzz and build initial customer base.',
      investmentPercent: 0.20, duration: 2 * 3600, color: 'bg-green-500',
    },
  ],

  beauty_wellness: [
    {
      id: 'treatment_dev', title: 'Treatment Menu Design', icon: Sparkles,
      description: 'Develop a comprehensive treatment menu combining beauty and wellness services. Create signature treatments that competitors cannot easily replicate.',
      investmentPercent: 0.15, duration: 4 * 3600, color: 'bg-pink-500',
    },
    {
      id: 'training', title: 'Staff Training Academy', icon: Users,
      description: 'Train beauticians, therapists, and wellness experts in your signature techniques. Create certification programs ensuring consistent service quality.',
      investmentPercent: 0.18, duration: 5 * 3600, color: 'bg-blue-500',
    },
    {
      id: 'product_line', title: 'Product Line Development', icon: ShoppingBag,
      description: 'Launch your own branded beauty and wellness products — serums, creams, hair care, and wellness supplements for additional revenue and brand building.',
      investmentPercent: 0.20, duration: 4 * 3600, color: 'bg-purple-500',
    },
    {
      id: 'launch', title: 'Wellness Brand Launch', icon: Rocket,
      description: 'Grand opening with beauty influencer events, free consultation camps, and membership drive. Build a loyal customer base from day one.',
      investmentPercent: 0.15, duration: 2 * 3600, color: 'bg-green-500',
    },
  ],

  fashion_brand: [
    {
      id: 'designers', title: 'Fashion Designers', icon: Palette,
      description: 'The first step in creating your own clothing brand is the development of a starter clothing collection. To stand out from other well-known brands, you need to hire famous fashion designers who will create the first collection with a recognizable look and in line with current fashion and comfort standards.',
      investmentPercent: 0.20, duration: 4 * 3600, color: 'bg-purple-500',
    },
    {
      id: 'marketing', title: 'Marketing Campaign', icon: Megaphone,
      description: 'Launch a comprehensive marketing campaign across social media, fashion magazines, and influencer partnerships. Build anticipation for your brand before the first collection drops.',
      investmentPercent: 0.18, duration: 3 * 3600, color: 'bg-blue-500',
    },
    {
      id: 'collection', title: 'Collection Release', icon: ShoppingBag,
      description: 'Release your debut collection across retail outlets and online platforms. Coordinate with fashion media for reviews and feature articles. Host exclusive preview events.',
      investmentPercent: 0.22, duration: 2.5 * 3600, color: 'bg-rose-500',
    },
    {
      id: 'launch', title: 'Brand Grand Launch', icon: Sparkles,
      description: 'Official brand launch with fashion shows, celebrity endorsements, and pop-up stores. This is where your brand transitions from a label to a lifestyle choice.',
      investmentPercent: 0.25, duration: 1.5 * 3600, color: 'bg-yellow-500',
    },
  ],

  retail_empire: [
    {
      id: 'system', title: 'Technology Infrastructure', icon: Monitor,
      description: 'Build unified POS systems, inventory management, and e-commerce platform. Integrate all retail channels for seamless omnichannel experience.',
      investmentPercent: 0.20, duration: 5 * 3600, color: 'bg-cyan-500',
    },
    {
      id: 'supply', title: 'Supply Chain Optimization', icon: Truck,
      description: 'Centralize procurement, negotiate with major distributors, and set up regional warehouses for efficient stock distribution across all outlets.',
      investmentPercent: 0.18, duration: 4 * 3600, color: 'bg-amber-500',
    },
    {
      id: 'branding', title: 'Brand Unification', icon: Palette,
      description: 'Rebrand all outlets under unified identity. Design new store layouts, staff uniforms, and marketing materials that create a cohesive premium retail experience.',
      investmentPercent: 0.15, duration: 3 * 3600, color: 'bg-blue-500',
    },
    {
      id: 'launch', title: 'Empire Launch Day', icon: Rocket,
      description: 'Grand relaunch of all stores simultaneously. Opening sales, loyalty program launch, and media blitz to announce the new retail empire.',
      investmentPercent: 0.17, duration: 2 * 3600, color: 'bg-green-500',
    },
  ],

  food_empire: [
    {
      id: 'menu', title: 'Master Menu Engineering', icon: UtensilsCrossed,
      description: 'Create a unified yet diverse menu system across all food properties. Each restaurant maintains uniqueness while sharing the empire\'s quality standards.',
      investmentPercent: 0.18, duration: 4.5 * 3600, color: 'bg-orange-500',
    },
    {
      id: 'kitchen', title: 'Central Kitchen Setup', icon: Factory,
      description: 'Build a state-of-the-art central kitchen for prep work, sauce making, and quality control. This feeds all outlets ensuring consistency.',
      investmentPercent: 0.22, duration: 5 * 3600, color: 'bg-red-500',
    },
    {
      id: 'delivery', title: 'Delivery Network', icon: Truck,
      description: 'Launch branded delivery service with custom packaging, real-time tracking, and temperature-controlled transport. Partner with major food delivery platforms.',
      investmentPercent: 0.18, duration: 3.5 * 3600, color: 'bg-blue-500',
    },
    {
      id: 'launch', title: 'Food Empire Launch', icon: Rocket,
      description: 'Grand food festival across all locations. Celebrity chef appearances, cooking demonstrations, and grand offers to attract food enthusiasts.',
      investmentPercent: 0.20, duration: 2 * 3600, color: 'bg-green-500',
    },
  ],

  auto_group: [
    {
      id: 'showroom', title: 'Showroom Redesign', icon: Building2,
      description: 'Transform all locations into modern, branded showrooms with interactive displays, VR car configurators, and premium customer lounges.',
      investmentPercent: 0.22, duration: 5 * 3600, color: 'bg-red-500',
    },
    {
      id: 'service', title: 'Service Center Excellence', icon: Wrench,
      description: 'Equip service centers with latest diagnostic equipment, trained technicians, and customer-friendly processes. Launch doorstep service and pickup-drop facility.',
      investmentPercent: 0.18, duration: 4 * 3600, color: 'bg-orange-500',
    },
    {
      id: 'digital', title: 'Digital Platform', icon: Monitor,
      description: 'Build an online platform for vehicle browsing, financing, insurance, and service booking. Enable virtual showroom tours and online purchasing.',
      investmentPercent: 0.20, duration: 3.5 * 3600, color: 'bg-cyan-500',
    },
    {
      id: 'launch', title: 'Auto Group Launch', icon: Rocket,
      description: 'Grand launch event with test drive festivals, auto exhibitions, and exclusive launch offers. Partner with automotive media for maximum coverage.',
      investmentPercent: 0.18, duration: 2 * 3600, color: 'bg-green-500',
    },
  ],

  logistics_kingdom: [
    {
      id: 'tech_platform', title: 'Logistics Technology', icon: Monitor,
      description: 'Build an AI-powered logistics platform with route optimization, real-time tracking, automated dispatch, and predictive demand forecasting.',
      investmentPercent: 0.25, duration: 5 * 3600, color: 'bg-cyan-500',
    },
    {
      id: 'fleet', title: 'Fleet Expansion', icon: Truck,
      description: 'Acquire additional vehicles, set up maintenance centers, and establish regional hubs for faster pickup and delivery across the network.',
      investmentPercent: 0.22, duration: 4.5 * 3600, color: 'bg-yellow-600',
    },
    {
      id: 'network', title: 'Distribution Network', icon: Globe,
      description: 'Build a nationwide network of sorting centers, cross-docking facilities, and last-mile delivery hubs in tier-2 and tier-3 cities.',
      investmentPercent: 0.20, duration: 4 * 3600, color: 'bg-blue-500',
    },
    {
      id: 'launch', title: 'Kingdom Launch', icon: Rocket,
      description: 'Launch nationwide logistics service with corporate onboarding, API integrations for e-commerce clients, and promotional pricing.',
      investmentPercent: 0.18, duration: 2 * 3600, color: 'bg-green-500',
    },
  ],

  education_group: [
    {
      id: 'curriculum', title: 'Curriculum Development', icon: BookOpen,
      description: 'Design comprehensive, industry-aligned curriculum with AI-powered personalization. Create video lectures, interactive assignments, and assessment frameworks.',
      investmentPercent: 0.22, duration: 5 * 3600, color: 'bg-indigo-500',
    },
    {
      id: 'platform', title: 'Learning Platform', icon: Monitor,
      description: 'Build a scalable EdTech platform with live classes, recorded content, doubt resolution, progress tracking, and parent/employer dashboards.',
      investmentPercent: 0.25, duration: 4.5 * 3600, color: 'bg-cyan-500',
    },
    {
      id: 'faculty', title: 'Faculty Recruitment', icon: Users,
      description: 'Recruit top educators, industry experts, and mentors. Create a faculty training program ensuring consistent teaching quality across all programs.',
      investmentPercent: 0.18, duration: 3.5 * 3600, color: 'bg-blue-500',
    },
    {
      id: 'launch', title: 'EdTech Launch', icon: Rocket,
      description: 'Launch with free demo classes, scholarship programs, and campus ambassador programs. Partner with companies for placement and upskilling programs.',
      investmentPercent: 0.15, duration: 2 * 3600, color: 'bg-green-500',
    },
  ],

  healthcare_group: [
    {
      id: 'integration', title: 'Healthcare Integration', icon: Stethoscope,
      description: 'Integrate clinics, pharmacies, and diagnostic labs into a unified healthcare ecosystem. Shared patient records, referral systems, and coordinated care protocols.',
      investmentPercent: 0.20, duration: 6 * 3600, color: 'bg-emerald-500',
    },
    {
      id: 'digital', title: 'Digital Health Platform', icon: Monitor,
      description: 'Build a comprehensive health app — teleconsultation, appointment booking, e-prescriptions, medicine delivery, health records, and wellness tracking.',
      investmentPercent: 0.25, duration: 5 * 3600, color: 'bg-cyan-500',
    },
    {
      id: 'quality', title: 'Quality Accreditation', icon: Shield,
      description: 'Obtain NABH accreditation for all facilities. Implement clinical protocols, patient safety standards, and quality monitoring systems that meet international benchmarks.',
      investmentPercent: 0.22, duration: 4.5 * 3600, color: 'bg-blue-500',
    },
    {
      id: 'launch', title: 'Healthcare Brand Launch', icon: Rocket,
      description: 'Launch with free health camps, corporate wellness tie-ups, and community health programs. Establish trust through transparency and patient testimonials.',
      investmentPercent: 0.18, duration: 2.5 * 3600, color: 'bg-green-500',
    },
  ],

  tech_conglomerate: [
    {
      id: 'rd', title: 'R&D Lab Setup', icon: Cpu,
      description: 'Establish cutting-edge R&D laboratories for AI, blockchain, and cloud technologies. Hire top-tier engineers and data scientists to drive innovation.',
      investmentPercent: 0.25, duration: 6 * 3600, color: 'bg-cyan-500',
    },
    {
      id: 'product', title: 'Product Development', icon: Monitor,
      description: 'Develop flagship tech products — FinTech platform, AI tools, or cybersecurity suite. Build MVP, run beta testing, and iterate based on user feedback.',
      investmentPercent: 0.28, duration: 5 * 3600, color: 'bg-purple-500',
    },
    {
      id: 'market', title: 'Go-to-Market Strategy', icon: Megaphone,
      description: 'Craft enterprise sales strategy, build partnerships with system integrators, and create developer documentation and API marketplaces.',
      investmentPercent: 0.22, duration: 4 * 3600, color: 'bg-blue-500',
    },
    {
      id: 'launch', title: 'Tech Platform Launch', icon: Rocket,
      description: 'Official product launch at tech conferences. Developer hackathons, free tier onboarding, and enterprise pilot programs to build initial traction.',
      investmentPercent: 0.20, duration: 2.5 * 3600, color: 'bg-green-500',
    },
  ],

  hospitality_chain: [
    {
      id: 'design', title: 'Property Design & Renovation', icon: Palette,
      description: 'Redesign all hotel properties with unified brand aesthetics while maintaining each location\'s unique character. Upgrade rooms, lobbies, and amenities.',
      investmentPercent: 0.25, duration: 6 * 3600, color: 'bg-purple-500',
    },
    {
      id: 'service', title: 'Service Excellence Program', icon: Users,
      description: 'Train all staff in world-class hospitality standards. Create signature service moments, personalized guest experience protocols, and quality benchmarks.',
      investmentPercent: 0.20, duration: 5 * 3600, color: 'bg-blue-500',
    },
    {
      id: 'tech', title: 'Smart Hotel Technology', icon: Monitor,
      description: 'Implement smart room systems, AI concierge, booking platform, loyalty program, and data-driven personalization across all properties.',
      investmentPercent: 0.22, duration: 4.5 * 3600, color: 'bg-cyan-500',
    },
    {
      id: 'launch', title: 'Hospitality Brand Launch', icon: Rocket,
      description: 'Grand launch with VIP events, media familiarization trips, travel blogger invitations, and founding member loyalty program with exclusive benefits.',
      investmentPercent: 0.18, duration: 2.5 * 3600, color: 'bg-green-500',
    },
  ],

  energy_corp: [
    {
      id: 'infrastructure', title: 'Energy Infrastructure', icon: Zap,
      description: 'Build extraction, refining, and distribution infrastructure. Establish pipelines, storage facilities, and processing plants for efficient operations.',
      investmentPercent: 0.28, duration: 8 * 3600, color: 'bg-slate-600',
    },
    {
      id: 'renewable', title: 'Renewable Integration', icon: Globe,
      description: 'Set up solar farms, wind turbines, and green hydrogen plants alongside traditional operations. Diversify energy portfolio for long-term sustainability.',
      investmentPercent: 0.25, duration: 6 * 3600, color: 'bg-green-500',
    },
    {
      id: 'distribution', title: 'Distribution Network', icon: Truck,
      description: 'Build retail fuel stations, industrial supply contracts, and energy trading desk. Establish B2B and B2C distribution channels nationwide.',
      investmentPercent: 0.22, duration: 5 * 3600, color: 'bg-yellow-600',
    },
    {
      id: 'launch', title: 'Energy Corp Launch', icon: Rocket,
      description: 'Official launch with government partnerships, industrial contracts, and retail station openings. Media campaign positioning as responsible energy leader.',
      investmentPercent: 0.18, duration: 3 * 3600, color: 'bg-blue-500',
    },
  ],

  conglomerate: [
    {
      id: 'holding', title: 'Holding Structure', icon: Crown,
      description: 'Establish the holding company structure with proper legal framework, governance policies, and cross-subsidiary synergy programs.',
      investmentPercent: 0.20, duration: 6 * 3600, color: 'bg-amber-600',
    },
    {
      id: 'synergy', title: 'Synergy Programs', icon: TrendingUp,
      description: 'Implement shared services — centralized HR, finance, legal, and procurement. Create cross-selling programs and internal resource sharing protocols.',
      investmentPercent: 0.22, duration: 5 * 3600, color: 'bg-blue-500',
    },
    {
      id: 'expansion', title: 'Strategic Acquisition', icon: Building2,
      description: 'Identify and acquire complementary businesses that strengthen the conglomerate\'s portfolio. Due diligence, negotiations, and integration planning.',
      investmentPercent: 0.28, duration: 5.5 * 3600, color: 'bg-purple-500',
    },
    {
      id: 'launch', title: 'Conglomerate Unveiling', icon: Rocket,
      description: 'Public unveiling of the conglomerate with investor presentations, media conferences, and strategic vision announcement.',
      investmentPercent: 0.20, duration: 3 * 3600, color: 'bg-green-500',
    },
  ],

  space_agency: [
    {
      id: 'facility', title: 'Launch Facility Construction', icon: Building2,
      description: 'Build launch pads, mission control centers, satellite assembly clean rooms, and testing facilities. This is the foundation of your space operations.',
      investmentPercent: 0.30, duration: 10 * 3600, color: 'bg-slate-600',
    },
    {
      id: 'rocket', title: 'Rocket Development', icon: Rocket,
      description: 'Design, build, and test your launch vehicle. Engine development, structural engineering, avionics systems, and multiple static fire tests before first flight.',
      investmentPercent: 0.30, duration: 8 * 3600, color: 'bg-orange-500',
    },
    {
      id: 'satellite', title: 'Satellite Systems', icon: Globe,
      description: 'Develop communication and Earth observation satellites. Build ground stations for satellite operations and data processing centers.',
      investmentPercent: 0.25, duration: 6 * 3600, color: 'bg-cyan-500',
    },
    {
      id: 'launch', title: 'First Launch Mission', icon: Sparkles,
      description: 'The historic first launch! Weeks of preparation, countdown procedures, and the moment your rocket breaks through the atmosphere. This defines your agency.',
      investmentPercent: 0.20, duration: 4 * 3600, color: 'bg-violet-600',
    },
  ],
};

export const getMergerPhases = (mergerId, totalInvestment) => {
  const phases = PHASE_DEFINITIONS[mergerId] || PHASE_DEFINITIONS.retail_empire;

  return phases.map(phase => ({
    ...phase,
    investment: Math.floor(totalInvestment * phase.investmentPercent),
  }));
};


// ═══════════════════════════════════════════════════════
// MERGER NAME SUGGESTIONS
// ═══════════════════════════════════════════════════════

const MERGER_NAME_PREFIXES = {
  street_food_chain: ['Desi', 'Street', 'Chatpata', 'Masala', 'Spice', 'Urban', 'Royal', 'Golden'],
  beauty_wellness: ['Glow', 'Aura', 'Radiance', 'Bliss', 'Serene', 'Luxe', 'Divine', 'Pristine'],
  retail_empire: ['Metro', 'Grand', 'Prime', 'Star', 'Royal', 'United', 'National', 'Supreme'],
  food_empire: ['Feast', 'Grand', 'Royal', 'Golden', 'Spice', 'Saffron', 'Imperial', 'Chef\'s'],
  auto_group: ['Auto', 'Motor', 'Drive', 'Speed', 'Premium', 'Elite', 'Classic', 'Pro'],
  logistics_kingdom: ['Swift', 'Flash', 'Express', 'Rapid', 'Speed', 'Quick', 'Smart', 'Prime'],
  fashion_brand: ['Style', 'Vogue', 'Chic', 'Urban', 'Elite', 'Luxe', 'Mode', 'Trend'],
  education_group: ['Bright', 'Smart', 'Genius', 'Future', 'Learn', 'Skill', 'Edge', 'Pro'],
  healthcare_group: ['Care', 'Health', 'Life', 'Vital', 'Medi', 'Heal', 'Well', 'Pure'],
  tech_conglomerate: ['Byte', 'Pixel', 'Nexus', 'Code', 'Logic', 'Cyber', 'Quantum', 'Nano'],
  hospitality_chain: ['Grand', 'Royal', 'Imperial', 'Palace', 'Premier', 'Luxe', 'Crown', 'Zenith'],
  energy_corp: ['Power', 'Energy', 'Fuel', 'Volt', 'Solar', 'Green', 'Mega', 'Force'],
  conglomerate: ['Apex', 'Summit', 'Pinnacle', 'Crown', 'Empire', 'Global', 'Titan', 'Vertex'],
  space_agency: ['Cosmos', 'Stellar', 'Orbit', 'Astro', 'Nova', 'Galaxy', 'Zenith', 'Sky'],
};

const MERGER_NAME_SUFFIXES = {
  street_food_chain: ['Bites', 'Kitchen', 'Street Eats', 'Food Co.', 'Flavors'],
  beauty_wellness: ['Beauty', 'Wellness', 'Spa & Salon', 'Aesthetics', 'Beauty Bar'],
  retail_empire: ['Mart', 'Retail Group', 'Stores', 'Markets', 'Trading Co.'],
  food_empire: ['Foods', 'Dining Group', 'Restaurants', 'Hospitality', 'F&B Group'],
  auto_group: ['Motors', 'Automotive', 'Auto Group', 'Mobility', 'Vehicles'],
  logistics_kingdom: ['Logistics', 'Delivery', 'Transport', 'Cargo', 'Supply Chain'],
  fashion_brand: ['Fashion', 'Apparel', 'Clothing Co.', 'Wear', 'Label'],
  education_group: ['Academy', 'Learning', 'Education', 'Institute', 'EdTech'],
  healthcare_group: ['Healthcare', 'Medical Group', 'Health Systems', 'MedCare', 'Hospitals'],
  tech_conglomerate: ['Technologies', 'Tech Corp', 'Digital', 'Solutions', 'Systems'],
  hospitality_chain: ['Hotels', 'Hospitality', 'Resorts', 'Stays', 'Hotels & Resorts'],
  energy_corp: ['Energy', 'Power Corp', 'Resources', 'Petroleum', 'Energy Group'],
  conglomerate: ['Holdings', 'Group', 'Corporation', 'Enterprises', 'Industries'],
  space_agency: ['Space', 'Aerospace', 'Space Systems', 'Launch Co.', 'Space Agency'],
};

export const getRandomMergerName = (mergerId) => {
  const prefixes = MERGER_NAME_PREFIXES[mergerId] || MERGER_NAME_PREFIXES.conglomerate;
  const suffixes = MERGER_NAME_SUFFIXES[mergerId] || MERGER_NAME_SUFFIXES.conglomerate;
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix} ${suffix}`;
};
// ═══════════════════════════════════════════════════════
// CONFIG TIMER DURATIONS (seconds)
// ═══════════════════════════════════════════════════════

const CONFIG_TIMER_DURATIONS = {
  street_food_chain: 10 * 60,
  beauty_wellness: 15 * 60,
  retail_empire: 25 * 60,
  food_empire: 30 * 60,
  auto_group: 35 * 60,
  logistics_kingdom: 40 * 60,
  fashion_brand: 45 * 60,
  education_group: 30 * 60,
  healthcare_group: 60 * 60,
  tech_conglomerate: 75 * 60,
  hospitality_chain: 90 * 60,
  energy_corp: 120 * 60,
  conglomerate: 150 * 60,
  space_agency: 180 * 60,
};

export const getConfigTimerDuration = (mergerId) =>
  CONFIG_TIMER_DURATIONS[mergerId] || 30 * 60;