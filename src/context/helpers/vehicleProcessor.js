// src/context/helpers/vehicleProcessor.js

export const processVehicleWear = (vehicles, kmPerHourConfig) => {
  if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) return vehicles;

  return vehicles.map(v => {
    if (!v.active) return v;

    const minKm = kmPerHourConfig?.min || 20;
    const maxKm = kmPerHourConfig?.max || 60;
    const kmThisSecond = (minKm + Math.random() * (maxKm - minKm)) / 3600;
    const newKmDriven = (v.kmDriven || 0) + kmThisSecond;

    if (newKmDriven >= v.maxKm) {
      return { ...v, active: false, kmDriven: v.maxKm, retiredAt: Date.now() };
    }

    return { ...v, kmDriven: newKmDriven };
  });
};