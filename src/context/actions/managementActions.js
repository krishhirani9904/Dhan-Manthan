// src/context/actions/managementActions.js

import { calcTotalIncome } from '../helpers/incomeCalculator';
import { VEHICLE_CATEGORIES, BANK_SETTINGS_DEFAULTS } from '../../data/businessRequirements';
import { generateId } from '../../utils/helpers';

export const createManagementActions = (setState) => {

  // ═══ HIRE STAFF ═══
  const hireStaff = (bizId, staffType, count, totalCost) => {
    setState(p => {
      if (p.balance < totalCost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const s = { ...b.staff };
        s[staffType] = (s[staffType] || 0) + count;
        return { ...b, staff: s };
      });
      return {
        ...p,
        balance: p.balance - totalCost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  // ═══ FIRE STAFF ═══
  const fireStaff = (bizId, staffType, count) => {
    setState(p => {
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const s = { ...b.staff };
        s[staffType] = Math.max(0, (s[staffType] || 0) - count);
        if (s[staffType] === 0) delete s[staffType];
        return { ...b, staff: s };
      });
      return {
        ...p,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  // ═══ BUY VEHICLE ═══
  const buyVehicle = (bizId, vehicleType, vehicleData) => {
    setState(p => {
      if (p.balance < vehicleData.cost) return p;
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz) return p;
      const vc = VEHICLE_CATEGORIES[biz.categoryId];
      const parkingDefault = vc?.parkingDefault || 10;
      const expansionSlots = vc?.parkingExpansionSlots || 5;
      const totalSlots = parkingDefault + ((biz.parkingExpansions || 0) * expansionSlots);
      const activeCount = (biz.vehicles || []).filter(v => v.active).length;
      if (activeCount >= totalSlots) return p;

      const newVehicle = {
        id: generateId('veh'),
        type: vehicleType,
        name: vehicleData.name,
        cost: vehicleData.cost,
        incomePerHour: vehicleData.incomePerHour,
        maxKm: vehicleData.maxKm,
        kmDriven: 0,
        active: true,
        purchasedAt: Date.now(),
        retiredAt: null,
        capacity: vehicleData.capacity || null,
        range: vehicleData.range || null,
      };

      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, vehicles: [...(b.vehicles || []), newVehicle] } : b
      );
      return {
        ...p,
        balance: p.balance - vehicleData.cost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  // ═══ EXPAND PARKING ═══
  const expandParking = (bizId) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz) return p;
      const cost = VEHICLE_CATEGORIES[biz.categoryId]?.parkingExpansionCost || 25000;
      if (p.balance < cost) return p;
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId ? { ...b, parkingExpansions: (b.parkingExpansions || 0) + 1 } : b
      );
      return { ...p, balance: p.balance - cost, ownedBusinesses: updated };
    });
  };

  // ═══ BUY EQUIPMENT ═══
  const buyEquipment = (bizId, equipmentId, count, totalCost) => {
    setState(p => {
      if (p.balance < totalCost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const eq = { ...b.equipment };
        eq[equipmentId] = (eq[equipmentId] || 0) + count;
        return { ...b, equipment: eq };
      });
      return {
        ...p,
        balance: p.balance - totalCost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  // ═══ BUY LICENSE ═══
  const buyLicense = (bizId, licenseId, cost) => {
    setState(p => {
      if (p.balance < cost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const lic = { ...b.licenses };
        lic[licenseId] = true;
        return { ...b, licenses: lic };
      });
      return {
        ...p,
        balance: p.balance - cost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  // ═══ BUY INVENTORY ═══
  const buyInventory = (bizId, inventoryId, amount, cost) => {
    setState(p => {
      if (p.balance < cost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const inv = { ...b.inventory };
        inv[inventoryId] = (inv[inventoryId] || 0) + amount;
        return { ...b, inventory: inv };
      });
      return {
        ...p,
        balance: p.balance - cost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  // ═══ BUY RESOURCES (Construction) ═══
  const buyResources = (bizId, resourceId, quantity, totalCost) => {
    setState(p => {
      if (p.balance < totalCost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const res = { ...b.resources };
        res[resourceId] = (res[resourceId] || 0) + quantity;
        return { ...b, resources: res };
      });
      return { ...p, balance: p.balance - totalCost, ownedBusinesses: updated };
    });
  };

  // ═══ START PROJECT ═══
  const startProject = (bizId, project) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz) return p;

      const activeProjects = (biz.projects || []).filter(pr => pr.status === 'active');
      if (activeProjects.length >= 3) return p;
      if ((biz.projects || []).some(pr => pr.projectId === project.id && pr.status === 'active')) return p;

      const newProject = {
        id: generateId('proj'),
        projectId: project.id,
        name: project.name,
        reward: project.reward,
        status: 'active',
        startTime: Date.now(),
        endTime: Date.now() + project.duration * 1000,
      };

      // Check and deduct resources
      if (project.resources) {
        const res = { ...biz.resources };
        for (const [rId, qty] of Object.entries(project.resources)) {
          if ((res[rId] || 0) < qty) return p;
        }
        for (const [rId, qty] of Object.entries(project.resources)) {
          res[rId] -= qty;
          if (res[rId] <= 0) delete res[rId];
        }
        const updated = p.ownedBusinesses.map(b =>
          b.id === bizId
            ? { ...b, resources: res, projects: [...(b.projects || []), newProject] }
            : b
        );
        return { ...p, ownedBusinesses: updated };
      }

      // Check staff requirements
      if (project.requirements) {
        const staff = biz.staff || {};
        for (const [role, count] of Object.entries(project.requirements)) {
          if ((staff[role] || 0) < count) return p;
        }
        const updated = p.ownedBusinesses.map(b =>
          b.id === bizId
            ? { ...b, projects: [...(b.projects || []), newProject] }
            : b
        );
        return { ...p, ownedBusinesses: updated };
      }

      return p;
    });
  };

  // ═══ COLLECT PROJECT REWARD ═══
  const collectProjectReward = (bizId, projectInstanceId) => {
    setState(p => {
      const biz = p.ownedBusinesses.find(b => b.id === bizId);
      if (!biz) return p;
      const proj = (biz.projects || []).find(
        pr => pr.id === projectInstanceId && pr.status === 'completed'
      );
      if (!proj) return p;
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId
          ? { ...b, projects: b.projects.filter(pr => pr.id !== projectInstanceId) }
          : b
      );
      return { ...p, balance: p.balance + proj.reward, ownedBusinesses: updated };
    });
  };

  // ═══ UPDATE BANK SETTINGS ═══
  const updateBankSettings = (bizId, settings) => {
    setState(p => {
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId
          ? { ...b, bankSettings: { ...(b.bankSettings || {}), ...settings } }
          : b
      );
      return {
        ...p,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  // ═══ BUY BANK FACILITY ═══
  const buyBankFacility = (bizId, facilityId, cost) => {
    setState(p => {
      if (p.balance < cost) return p;
      const updated = p.ownedBusinesses.map(b => {
        if (b.id !== bizId) return b;
        const s = b.bankSettings || {};
        const f = { ...(s.facilities || {}) };
        f[facilityId] = true;
        return { ...b, bankSettings: { ...s, facilities: f } };
      });
      return {
        ...p,
        balance: p.balance - cost,
        ownedBusinesses: updated,
        incomePerHour: calcTotalIncome(updated, p.mergedBusinesses, p.ownedProperties, p.ownedStocks),
      };
    });
  };

  // ═══ REMOVE RETIRED VEHICLES ═══
  const removeRetiredVehicles = (bizId) => {
    setState(p => {
      const updated = p.ownedBusinesses.map(b =>
        b.id === bizId
          ? { ...b, vehicles: (b.vehicles || []).filter(v => v.active) }
          : b
      );
      return { ...p, ownedBusinesses: updated };
    });
  };

  return {
    hireStaff, fireStaff,
    buyVehicle, expandParking,
    buyEquipment, buyLicense, buyInventory,
    buyResources, startProject, collectProjectReward,
    updateBankSettings, buyBankFacility,
    removeRetiredVehicles,
  };
};