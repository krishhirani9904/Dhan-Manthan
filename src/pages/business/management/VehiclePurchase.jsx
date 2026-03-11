// src/pages/business/management/VehiclePurchase.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Car, ParkingCircle, Gauge, MapPin,
  AlertTriangle, Trash2, TrendingUp
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { VEHICLE_CATEGORIES } from '../../../data/businessRequirements';
import { formatCurrency, formatNumber } from '../../../utils/formatCurrency';
import ManagementHeader from '../../../components/business/ManagementHeader';
import AdSpace from '../../../components/common/AdSpace';

function VehiclePurchase() {
  const { bizId } = useParams();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedBusinesses, balance, buyVehicle, expandParking, removeRetiredVehicles } = useGame();

  const biz = ownedBusinesses.find(b => b.id === bizId);
  const vehicleConfig = VEHICLE_CATEGORIES[biz?.categoryId];
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!biz || !vehicleConfig) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const vehicles = biz.vehicles || [];
  const activeVehicles = vehicles.filter(v => v.active);
  const retiredVehicles = vehicles.filter(v => !v.active);
  const parkingDefault = vehicleConfig.parkingDefault || 10;
  const expansions = biz.parkingExpansions || 0;
  const expansionSlots = vehicleConfig.parkingExpansionSlots || 5;
  const totalSlots = parkingDefault + (expansions * expansionSlots);
  const usedSlots = activeVehicles.length;
  const parkingCost = vehicleConfig.parkingExpansionCost || 25000;
  const canExpandParking = balance >= parkingCost;

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <ManagementHeader
        bizId={bizId}
        title="Vehicle Fleet"
        subtitle={`${activeVehicles.length} active • ${totalSlots} slots`}
        icon={Car} iconColor="text-yellow-500"
      />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
        {/* Balance + Parking */}
        <div className="flex gap-2">
          <div className={`flex-1 rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <p className={`text-[10px] ${t.text.tertiary}`}>Balance</p>
            <p className={`text-lg font-black ${t.text.brand}`}>{formatCurrency(balance)}</p>
          </div>
          <div className={`flex-1 rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <ParkingCircle className="w-3.5 h-3.5 text-purple-500" />
              <p className={`text-[10px] ${t.text.tertiary}`}>Parking</p>
            </div>
            <p className={`text-lg font-black ${t.text.primary}`}>{usedSlots}/{totalSlots}</p>
          </div>
        </div>

        {/* Expand Parking */}
        <button onClick={() => expandParking(bizId)} disabled={!canExpandParking}
          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all active:scale-[0.98]
            ${canExpandParking
              ? `${t.bg.card} border ${t.border.default} hover:border-purple-500/30`
              : isDark ? 'bg-gray-900 border border-gray-800 opacity-50' : 'bg-gray-100 border border-gray-200 opacity-50'}`}>
          <div className="flex items-center gap-2.5">
            <ParkingCircle className="w-5 h-5 text-purple-500" />
            <div>
              <p className={`text-sm font-bold ${t.text.primary}`}>Expand Parking</p>
              <p className={`text-[10px] ${t.text.tertiary}`}>+{expansionSlots} slots</p>
            </div>
          </div>
          <span className={`text-sm font-bold ${t.text.brand}`}>{formatCurrency(parkingCost)}</span>
        </button>

        {/* Buy Vehicles */}
        <div>
          <p className={`text-xs font-bold mb-2 ${t.text.secondary}`}>Buy Vehicles</p>
          <div className="space-y-2.5">
            {vehicleConfig.types.map(vType => {
              const canAfford = balance >= vType.cost;
              const hasParking = usedSlots < totalSlots;
              const canBuy = canAfford && hasParking;

              return (
                <div key={vType.id}
                  className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{vType.icon}</span>
                      <div>
                        <p className={`text-sm font-bold ${t.text.primary}`}>{vType.name}</p>
                        <p className={`text-xl font-black ${t.text.brand}`}>
                          {formatCurrency(vType.cost)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                      ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-[10px] font-bold text-green-500">
                        {formatCurrency(vType.incomePerHour)}/hr
                      </span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                      ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                      <Gauge className="w-3 h-3 text-blue-500" />
                      <span className="text-[10px] font-bold text-blue-500">
                        {formatNumber(vType.maxKm)} km
                      </span>
                    </div>
                    {vType.capacity && (
                      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                        ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                        <Car className="w-3 h-3 text-purple-500" />
                        <span className="text-[10px] font-bold text-purple-500">
                          {vType.capacity}
                        </span>
                      </div>
                    )}
                    {vType.range && (
                      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                        ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
                        <MapPin className="w-3 h-3 text-orange-500" />
                        <span className="text-[10px] font-bold text-orange-500">
                          {vType.range}
                        </span>
                      </div>
                    )}
                  </div>

                  <button onClick={() => buyVehicle(bizId, vType.id, vType)}
                    disabled={!canBuy}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all
                      ${canBuy
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-amber-500/20 active:scale-95'
                        : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
                    {!hasParking ? 'No Parking Space' : !canAfford ? `Need ${formatCurrency(vType.cost - balance)}` : `Buy ${vType.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Fleet */}
        {activeVehicles.length > 0 && (
          <div>
            <p className={`text-xs font-bold mb-2 ${t.text.secondary}`}>
              Active Fleet ({activeVehicles.length})
            </p>
            <div className="space-y-2">
              {activeVehicles.map(v => {
                const pct = ((v.kmDriven || 0) / v.maxKm * 100);
                const isLow = pct > 80;
                const vType = vehicleConfig.types.find(vt => vt.id === v.type);
                return (
                  <div key={v.id}
                    className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{vType?.icon || '🚗'}</span>
                        <div>
                          <p className={`text-xs font-bold ${t.text.primary}`}>{v.name}</p>
                          <p className={`text-[10px] ${t.text.tertiary}`}>
                            {formatCurrency(v.incomePerHour)}/hr
                          </p>
                        </div>
                      </div>
                      {isLow && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15">
                          <AlertTriangle className="w-3 h-3 text-red-400" />
                          <span className="text-[9px] font-bold text-red-400">Low Life</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] ${t.text.tertiary}`}>
                        {formatNumber(Math.floor(v.kmDriven || 0))} / {formatNumber(v.maxKm)} km
                      </span>
                      <span className={`text-[10px] font-bold ${isLow ? 'text-red-400' : 'text-green-500'}`}>
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden
                      ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                      <div className={`h-full rounded-full transition-all
                        ${isLow ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Retired */}
        {retiredVehicles.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-xs font-bold ${t.text.secondary}`}>
                Retired ({retiredVehicles.length})
              </p>
              <button onClick={() => removeRetiredVehicles(bizId)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg
                  text-[10px] font-bold text-red-400 bg-red-500/10 active:scale-95">
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
            <div className="space-y-1.5">
              {retiredVehicles.map(v => (
                <div key={v.id}
                  className={`rounded-lg p-2.5 opacity-50
                    ${t.bg.card} border ${t.border.default}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {vehicleConfig.types.find(vt => vt.id === v.type)?.icon || '🚗'}
                    </span>
                    <div>
                      <p className={`text-xs font-medium ${t.text.primary}`}>{v.name}</p>
                      <p className={`text-[10px] ${t.text.tertiary}`}>
                        {formatNumber(v.maxKm)} km done • Retired
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AdSpace />
    </div>
  );
}

export default VehiclePurchase;