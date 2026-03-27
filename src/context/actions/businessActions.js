// src/context/actions/businessActions.js

import { getCategoryById } from '../../data/businessCategories';
import { isFleetBased, isContractBased, isOutletBased } from '../../data/businessRequirements';
import { getDefaultFleetCapacity, getExpansionConfig } from '../../data/fleetVehicles'; 
import { getFlightDuration } from '../../data/airlineData';
import { calcTotalIncome } from '../helpers/incomeCalculator';
import { generateId } from '../../utils/helpers';
import {
  BUSINESS_INCOME_RATE, RENAME_COST,
  CLOSE_REFUND_NORMAL, CLOSE_REFUND_AD, MAX_BUSINESS_LEVEL
} from '../../config/constants';

export const createBusinessActions = (setState) => {

  // ═══ BUY BUSINESS ═══
  const buyBusiness = (info) => {
    setState(p => {
      if (p.balance < info.cost) return p;

      const categoryId = info.categoryId;

      const newBiz = {
        id: generateId('biz'),
        name: info.name,
        categoryId,
        subCategoryId: info.subCategoryId || null,
        categoryName: info.categoryName || '',
        subCategoryName: info.subCategoryName || '',
        cost: info.cost,
        incomePerHour: Math.floor(info.cost * BUSINESS_INCOME_RATE),
        purchasedAt: Date.now(),
        level: 1,
        totalEarnings: 0,
        bizAdBoostEndTime: null,
        bizAdBoostPercent: 0,

        // Standard fields (used by outlet-based)
        outlets: 1,
        expansionEndTime: null,
        staff: {},
        vehicles: [],
        equipment: {},
        inventory: {},
        licenses: {},
        locations: 1,
        branches: 0,
        resources: {},
        projects: [],
        bankSettings: null,
        parkingExpansions: 0,
        outletRequirements: {},

        // Fleet-based (taxi / shipping)
        fleet: isFleetBased(categoryId) && categoryId !== 'airlines' ? {
          capacity: getDefaultFleetCapacity(categoryId),
          expansionEndTime: null,
          expansionSlots: 0,
          expansionCount: 0,
          vehicles: [],
        } : null,

        // Airline
        airline: categoryId === 'airlines' ? {
          licenses: [],
          hubs: [],
          aircraft: [],
          activeFlights: [],
          staff: {},
        } : null,

        // Oil & Gas
        oilgas: categoryId === 'oil-gas' ? {
          wells: { oil: [], gas: [] },
          stock: { oil: 0, gas: 0 },
          activeContract: null,
          completedContracts: 0,
        } : null,
      };

      const newOwned = [newBiz, ...p.ownedBusinesses];
      return {
        ...p,
        balance: p.balance - info.cost,
        ownedBusinesses: newOwned,
        incomePerHour: calcTotalIncome(
          newOwned, p.mergedBusinesses, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  };

  // ═══ EXPANSION COST (outlet-based only) ═══
  const getExpansionCost = (bizId, ownedBusinesses) => {
    const biz = (ownedBusinesses || []).find(b => b.id === bizId);
    if (!biz) return 0;
    if (!isOutletBased(biz.categoryId)) return 0;
    const cat = getCategoryById(biz.categoryId);
    const outlets = biz.outlets || 1;
    const baseCost = cat?.expansionBase || biz.cost * 0.3;
    return Math.floor(baseCost * Math.pow(1.5, outlets - 1));
  };

  // ═══ EXPANSION TIME (outlet-based only) ═══
  const getExpansionTime = (biz) => {
    if (!isOutletBased(biz.categoryId)) return 0;
    const cat = getCategoryById(biz.categoryId);
    const baseTime = cat?.expansionTime || 2400;
    const outlets = biz.outlets || 1;
    return Math.floor(baseTime * (1 + (outlets - 1) * 0.33));
  };

  // ═══ START EXPANSION (outlet-based only) ═══
  const startExpansion = (bizId) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz || !isOutletBased(biz.categoryId)) return p;
      if (biz.level >= MAX_BUSINESS_LEVEL || biz.expansionEndTime) return p;

      const cost = getExpansionCost(bizId, p.ownedBusinesses);
      if (p.balance < cost) return p;

      const duration = getExpansionTime(biz) * 1000;
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, expansionEndTime: Date.now() + duration } : b
      );
      return { ...p, balance: p.balance - cost, ownedBusinesses: updated };
    });
  };

  // ═══ SKIP EXPANSION (outlet-based only) ═══
  const skipExpansion = (bizId) => {
    setState(p => {
      const updated = p.ownedBusinesses.map(biz => {
        if (biz.id !== bizId || !biz.expansionEndTime) return biz;
        if (!isOutletBased(biz.categoryId)) return biz;
        const cat = getCategoryById(biz.categoryId);
        const growth = cat?.profitGrowthPercent || 15;
        const newOutlets = (biz.outlets || 1) + 1;
        return {
          ...biz,
          level: Math.min((biz.level || 1) + 1, MAX_BUSINESS_LEVEL),
          outlets: newOutlets,
          incomePerHour: Math.floor(biz.incomePerHour * (1 + growth / 100)),
          expansionEndTime: null,
          outletRequirements: {
            ...(biz.outletRequirements || {}),
            [newOutlets - 1]: {
              staff: {},
              equipment: {},
              licenses: {},
              inventory: {},
            },
          },
        };
      });
      return {
        ...p,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(
          updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  };

  // ═══ FLEET EXPANSION (taxi / shipping) ═══
  const startFleetExpansion = (bizId, tierId) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz || !biz.fleet) return p;
      if (biz.fleet.expansionEndTime) return p;

      const config = getExpansionConfig(biz.categoryId);
      const tier = config.tiers.find(t => t.id === tierId);
      if (!tier) return p;

      // Calculate cost with expansion count multiplier
      const expansionCount = biz.fleet.expansionCount || 0;
      const costMultiplier = Math.pow(1.15, expansionCount);
      const cost = Math.floor(tier.cost * costMultiplier);
      if (p.balance < cost) return p;

      // Calculate time with expansion count multiplier
      const timeMultiplier = Math.pow(config.timeIncreasePerExpansion, expansionCount);
      const duration = Math.floor(tier.time * timeMultiplier) * 1000;

      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        return {
          ...b,
          fleet: {
            ...b.fleet,
            expansionEndTime: Date.now() + duration,
            expansionSlots: tier.slots,
          },
        };
      });

      return { ...p, balance: p.balance - cost, ownedBusinesses: updated };
    });
  };

  // ═══ SKIP FLEET EXPANSION (ad watch) ═══
  const skipFleetExpansion = (bizId) => {
    setState(p => {
      const updated = p.ownedBusinesses.map(biz => {
        if (biz.id !== bizId || !biz.fleet?.expansionEndTime) return biz;
        return {
          ...biz,
          fleet: {
            ...biz.fleet,
            capacity: (biz.fleet.capacity || 5) + (biz.fleet.expansionSlots || 5),
            expansionEndTime: null,
            expansionSlots: 0,
            expansionCount: (biz.fleet.expansionCount || 0) + 1,
          },
        };
      });
      return { ...p, ownedBusinesses: updated };
    });
  };

  // ═══ BUY FLEET VEHICLE ═══
  const buyFleetVehicle = (bizId, vehicleDef, quantity) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz || !biz.fleet) return p;

      const qty = Math.min(Math.max(quantity || 1, 1), 10);
      const totalCost = vehicleDef.price * qty;
      if (p.balance < totalCost) return p;

      const activeCount = (biz.fleet.vehicles || []).filter(v => v.active).length;
      const capacity = biz.fleet.capacity || 5;
      if (activeCount + qty > capacity) return p;

      const newVehicles = [];
      for (let i = 0; i < qty; i++) {
        newVehicles.push({
          id: generateId('fv'),
          vehicleDefId: vehicleDef.id,
          name: vehicleDef.name,
          type: vehicleDef.type,
          price: vehicleDef.price,
          incomePerHour: vehicleDef.incomePerHour,
          resourceKm: vehicleDef.resourceKm,
          kmDriven: 0,
          active: true,
          purchasedAt: Date.now(),
          image: vehicleDef.image,
          capacity: vehicleDef.capacity || null,
        });
      }

      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        return {
          ...b,
          fleet: {
            ...b.fleet,
            vehicles: [...(b.fleet.vehicles || []), ...newVehicles],
          },
        };
      });

      return {
        ...p,
        balance: p.balance - totalCost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(
          updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  };

  // ═══ AIRLINE: BUY LICENSE ═══
  const buyAirlineLicense = (bizId, licenseId, cost) => {
    setState(p => {
      if (p.balance < cost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId || !b.airline) return b;
        if (b.airline.licenses.includes(licenseId)) return b;
        return {
          ...b,
          airline: {
            ...b.airline,
            licenses: [...b.airline.licenses, licenseId],
          },
        };
      });
      return { ...p, balance: p.balance - cost, ownedBusinesses: updated };
    });
  };

  // ═══ AIRLINE: BUY HUB ═══
  const buyAirlineHub = (bizId, hubDef) => {
    setState(p => {
      if (p.balance < hubDef.cost) return p;
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz || !biz.airline) return p;

      // Check license for country
      if (!biz.airline.licenses.includes(hubDef.country)) return p;

      // Check if already owned
      if (biz.airline.hubs.some(h => h.hubId === hubDef.id)) return p;

      const newHub = {
        id: generateId('hub'),
        hubId: hubDef.id,
        name: hubDef.name,
        country: hubDef.country,
        countryName: hubDef.countryName,
        flag: hubDef.flag,
        capacity: hubDef.capacity,
        aircraftParked: 0,
        purchasedAt: Date.now(),
      };

      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        return {
          ...b,
          airline: {
            ...b.airline,
            hubs: [...b.airline.hubs, newHub],
          },
        };
      });

      return { ...p, balance: p.balance - hubDef.cost, ownedBusinesses: updated };
    });
  };

  // ═══ AIRLINE: BUY AIRCRAFT ═══
  const buyAirlineAircraft = (bizId, aircraftDef) => {
    setState(p => {
      if (p.balance < aircraftDef.price) return p;
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz || !biz.airline) return p;

      // Check hub capacity
      const totalCapacity = biz.airline.hubs.reduce((s, h) => s + h.capacity, 0);
      const totalAircraft = (biz.airline.aircraft || []).filter(a => a.active).length;
      if (totalAircraft >= totalCapacity) return p;

      const newAircraft = {
        id: generateId('air'),
        aircraftDefId: aircraftDef.id,
        name: aircraftDef.name,
        type: aircraftDef.type,
        price: aircraftDef.price,
        incomePerHour: aircraftDef.incomePerHour,
        capacity: aircraftDef.capacity,
        range: aircraftDef.range,
        maintenanceCost: aircraftDef.maintenanceCost,
        active: true,
        flightCount: 0,
        purchasedAt: Date.now(),
        image: aircraftDef.image,
      };

      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        return {
          ...b,
          airline: {
            ...b.airline,
            aircraft: [...(b.airline.aircraft || []), newAircraft],
          },
        };
      });

      return {
        ...p,
        balance: p.balance - aircraftDef.price,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(
          updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  };

  // ═══ AIRLINE: START FLIGHT ═══
  const startAirlineFlight = (bizId, aircraftId) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz || !biz.airline) return p;

      const aircraft = biz.airline.aircraft.find(a => a.id === aircraftId);
      if (!aircraft || !aircraft.active) return p;

      // Check not already on flight
      if (biz.airline.activeFlights.some(f => f.aircraftId === aircraftId)) return p;

      // Check minimum staff
      const staff = biz.airline.staff || {};
      const totalAircraft = biz.airline.aircraft.filter(a => a.active).length;
      if ((staff.pilot || 0) < totalAircraft * 2) return p;
      if ((staff.copilot || 0) < totalAircraft) return p;
      if ((staff.cabin_crew || 0) < totalAircraft * 4) return p;

      const duration = getFlightDuration(aircraft.range);

      const newFlight = {
        id: generateId('flight'),
        aircraftId,
        aircraftName: aircraft.name,
        incomePerHour: aircraft.incomePerHour,
        startTime: Date.now(),
        endTime: Date.now() + duration * 1000,
      };

      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        return {
          ...b,
          airline: {
            ...b.airline,
            activeFlights: [...b.airline.activeFlights, newFlight],
            aircraft: b.airline.aircraft.map(a =>
              a.id === aircraftId ? { ...a, flightCount: (a.flightCount || 0) + 1 } : a
            ),
          },
        };
      });

      return {
        ...p,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(
          updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  };

  // ═══ AIRLINE: HIRE STAFF ═══
  const hireAirlineStaff = (bizId, staffId, count, totalCost) => {
    setState(p => {
      if (p.balance < totalCost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId || !b.airline) return b;
        const staff = { ...b.airline.staff };
        staff[staffId] = (staff[staffId] || 0) + count;
        return {
          ...b,
          airline: { ...b.airline, staff },
        };
      });
      return {
        ...p,
        balance: p.balance - totalCost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(
          updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  };

  // ═══ OIL & GAS: BUY WELL ═══
  const buyWell = (bizId, fuelType, wellDef) => {
    setState(p => {
      if (p.balance < wellDef.cost) return p;
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz || !biz.oilgas) return p;

      const newWell = {
        id: generateId('well'),
        wellDefId: wellDef.id,
        name: wellDef.name,
        cost: wellDef.cost,
        productionPerDay: wellDef.productionPerDay,
        maxLifespan: wellDef.maxLifespan,
        unit: wellDef.unit,
        active: true,
        daysActive: 0,
        purchasedAt: Date.now(),
        image: wellDef.image,
      };

      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const wells = { ...b.oilgas.wells };
        wells[fuelType] = [...(wells[fuelType] || []), newWell];
        return {
          ...b,
          oilgas: { ...b.oilgas, wells },
        };
      });

      return {
        ...p,
        balance: p.balance - wellDef.cost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(
          updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  };

  // ═══ OIL & GAS: SIGN CONTRACT ═══
  const signContract = (bizId, customerId, contractDef) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz || !biz.oilgas) return p;
      if (biz.oilgas.activeContract) return p;

      // Check stock
      const stock = { ...biz.oilgas.stock };
      for (const [fuelType, amount] of Object.entries(contractDef.requirements)) {
        if ((stock[fuelType] || 0) < amount) return p;
      }

      // Deduct stock
      for (const [fuelType, amount] of Object.entries(contractDef.requirements)) {
        stock[fuelType] = (stock[fuelType] || 0) - amount;
      }

      const activeContract = {
        id: generateId('contract'),
        contractDefId: contractDef.id,
        customerId,
        description: contractDef.description,
        requirements: contractDef.requirements,
        reward: contractDef.reward,
        startTime: Date.now(),
        endTime: Date.now() + contractDef.duration * 1000,
      };

      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        return {
          ...b,
          oilgas: {
            ...b.oilgas,
            stock,
            activeContract,
          },
        };
      });

      return { ...p, ownedBusinesses: updated };
    });
  };

  // ═══ OIL & GAS: COLLECT CONTRACT REWARD ═══
  const collectContractReward = (bizId) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz || !biz.oilgas?.activeContract) return p;

      const contract = biz.oilgas.activeContract;
      if (!contract.endTime || Date.now() < contract.endTime) return p;

      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        return {
          ...b,
          oilgas: {
            ...b.oilgas,
            activeContract: null,
            completedContracts: (b.oilgas.completedContracts || 0) + 1,
          },
        };
      });

      return {
        ...p,
        balance: p.balance + contract.reward,
        ownedBusinesses: updated,
      };
    });
  };

  // ═══ RENAME BUSINESS ═══
  const renameBusiness = (bizId, newName) => {
    setState(p => {
      if (p.balance < RENAME_COST || !newName?.trim() || newName.trim().length < 2) return p;
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, name: newName.trim() } : b
      );
      return { ...p, balance: p.balance - RENAME_COST, ownedBusinesses: updated };
    });
  };

  // ═══ CLOSE BUSINESS ═══
  const closeBusiness = (bizId, fullRefund = false) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz) return p;
      const refund = Math.floor(biz.cost * (fullRefund ? CLOSE_REFUND_AD : CLOSE_REFUND_NORMAL));
      const updated = p.ownedBusinesses.filter(b => b.id !== bizId);
      return {
        ...p,
        balance: p.balance + refund,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(
          updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks
        ),
      };
    });
  };

  // ═══ PER-BUSINESS AD BOOST ═══
  const startBizAdBoost = (bizId, percent = 15, hours = 4) => {
    setState(p => {
      const endTime = Date.now() + hours * 3600 * 1000;
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, bizAdBoostEndTime: endTime, bizAdBoostPercent: percent } : b
      );
      return { ...p, ownedBusinesses: updated };
    });
  };

  // ═══ OUTLET STAFF/EQUIP/LICENSE/INVENTORY ═══
  const hireOutletStaff = (bizId, outletIndex, staffType, count, totalCost) => {
    setState(p => {
      if (p.balance < totalCost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const outletReqs = { ...(b.outletRequirements || {}) };
        const outlet = { ...(outletReqs[outletIndex] || { staff: {}, equipment: {}, licenses: {}, inventory: {} }) };
        const staff = { ...outlet.staff };
        staff[staffType] = (staff[staffType] || 0) + count;
        outlet.staff = staff;
        outletReqs[outletIndex] = outlet;
        return { ...b, outletRequirements: outletReqs };
      });
      return {
        ...p,
        balance: p.balance - totalCost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  const buyOutletEquipment = (bizId, outletIndex, equipmentId, count, totalCost) => {
    setState(p => {
      if (p.balance < totalCost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const outletReqs = { ...(b.outletRequirements || {}) };
        const outlet = { ...(outletReqs[outletIndex] || { staff: {}, equipment: {}, licenses: {}, inventory: {} }) };
        const eq = { ...outlet.equipment };
        eq[equipmentId] = (eq[equipmentId] || 0) + count;
        outlet.equipment = eq;
        outletReqs[outletIndex] = outlet;
        return { ...b, outletRequirements: outletReqs };
      });
      return {
        ...p,
        balance: p.balance - totalCost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  const buyOutletLicense = (bizId, outletIndex, licenseId, cost) => {
    setState(p => {
      if (p.balance < cost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const outletReqs = { ...(b.outletRequirements || {}) };
        const outlet = { ...(outletReqs[outletIndex] || { staff: {}, equipment: {}, licenses: {}, inventory: {} }) };
        const lic = { ...outlet.licenses };
        lic[licenseId] = true;
        outlet.licenses = lic;
        outletReqs[outletIndex] = outlet;
        return { ...b, outletRequirements: outletReqs };
      });
      return {
        ...p,
        balance: p.balance - cost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  const buyOutletInventory = (bizId, outletIndex, inventoryId, amount, cost) => {
    setState(p => {
      if (p.balance < cost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const outletReqs = { ...(b.outletRequirements || {}) };
        const outlet = { ...(outletReqs[outletIndex] || { staff: {}, equipment: {}, licenses: {}, inventory: {} }) };
        const inv = { ...outlet.inventory };
        inv[inventoryId] = (inv[inventoryId] || 0) + amount;
        outlet.inventory = inv;
        outletReqs[outletIndex] = outlet;
        return { ...b, outletRequirements: outletReqs };
      });
      return {
        ...p,
        balance: p.balance - cost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  return {
    buyBusiness,
    startExpansion,
    skipExpansion,
    renameBusiness,
    closeBusiness,
    startBizAdBoost,
    getExpansionCost,
    getExpansionTime,
    hireOutletStaff,
    buyOutletEquipment,
    buyOutletLicense,
    buyOutletInventory,
    // Fleet
    startFleetExpansion,
    skipFleetExpansion,
    buyFleetVehicle,
    // Airline
    buyAirlineLicense,
    buyAirlineHub,
    buyAirlineAircraft,
    startAirlineFlight,
    hireAirlineStaff,
    // Oil & Gas
    buyWell,
    signContract,
    collectContractReward,
  };
};