// src/pages/business/fleet/FleetManagement.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Settings, TrendingUp, MonitorPlay, Car,
  Truck, Plus, Clock, ChevronRight, Zap, Users,
  FileText, Wrench
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme, getColorShades } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { getCategoryById } from '../../../data/businessCategories';
import {
  getExpansionConfig, getFiltersForCategory,
  getDefaultFleetCapacity
} from '../../../data/fleetVehicles';
import { STAFF_TYPES, LICENSE_TYPES } from '../../../data/businessRequirements';
import { calcBusinessIncome } from '../../../context/helpers/incomeCalculator';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatTime } from '../../../utils/formatTime';
import AdSpace from '../../../components/common/AdSpace';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';

function FleetManagement() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isOnline } = useNetworkStatus();
  const t = isDark ? theme.dark : theme.light;

  const {
    ownedBusinesses, balance,
    startFleetExpansion, skipFleetExpansion,
    startBizAdBoost
  } = useGame();

  const biz = ownedBusinesses.find(b => b.id === bizId);
  const [adWatching, setAdWatching] = useState(false);
  const [skipAdWatching, setSkipAdWatching] = useState(false);
  const [expansionRemaining, setExpansionRemaining] = useState(0);
  const [bizBoostRem, setBizBoostRem] = useState(0);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!biz) return;
    const interval = setInterval(() => {
      setTick(p => p + 1);
      if (biz.fleet?.expansionEndTime) {
        setExpansionRemaining(Math.max(0, Math.floor((biz.fleet.expansionEndTime - Date.now()) / 1000)));
      } else {
        setExpansionRemaining(0);
      }
      if (biz.bizAdBoostEndTime) {
        setBizBoostRem(Math.max(0, Math.floor((biz.bizAdBoostEndTime - Date.now()) / 1000)));
      } else {
        setBizBoostRem(0);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [biz]);

  if (!biz || !biz.fleet) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <div className="text-center">
          <p className={`text-sm ${t.text.secondary}`}>Business not found</p>
          <button onClick={() => navigate('/business')} className="mt-3 text-yellow-500 underline text-sm">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const cat = getCategoryById(biz.categoryId);
  const Icon = biz.categoryId === 'shipping' ? Truck : Car;
  const color = cat?.color || 'bg-yellow-500';
  const shades = getColorShades(color);

  const fleet = biz.fleet;
  const capacity = fleet.capacity || getDefaultFleetCapacity(biz.categoryId);
  const activeVehicles = (fleet.vehicles || []).filter(v => v.active);
  const retiredVehicles = (fleet.vehicles || []).filter(v => !v.active);
  const vehicleCount = activeVehicles.length;
  const capacityPercent = capacity > 0 ? Math.round((vehicleCount / capacity) * 100) : 0;
  const isFull = vehicleCount >= capacity;

  const isExpanding = fleet.expansionEndTime && Date.now() < fleet.expansionEndTime;
  const expansionConfig = getExpansionConfig(biz.categoryId);

  const hasBizAdBoost = biz.bizAdBoostEndTime && Date.now() < biz.bizAdBoostEndTime;
  const effectiveIncome = calcBusinessIncome(biz);

  // Staff & License counts
  const totalStaff = Object.values(biz.staff || {}).reduce((a, b) => a + b, 0);
  const staffTypes = STAFF_TYPES[biz.categoryId] || [];
  const licenseTypes = LICENSE_TYPES[biz.categoryId] || [];
  const obtainedLicenses = Object.values(biz.licenses || {}).filter(Boolean).length;

  const handleRaiseIncome = () => {
  if (!isOnline || hasBizAdBoost || adWatching || effectiveIncome === 0) return;
  setAdWatching(true);
  setTimeout(() => {
    setAdWatching(false);
    startBizAdBoost(bizId, 15, 4);
  }, 2000);
};

  const handleStartExpansion = (tierId) => {
    if (isExpanding) return;
    startFleetExpansion(bizId, tierId);
  };

  const handleSkipExpansion = () => {
  if (!isOnline || !isExpanding || skipAdWatching) return;
  setSkipAdWatching(true);
  setTimeout(() => {
    setSkipAdWatching(false);
    skipFleetExpansion(bizId);
  }, 2000);
};

  // Calculate expansion costs with multiplier
  const getExpansionCost = (tier) => {
    const expansionCount = fleet.expansionCount || 0;
    const costMultiplier = Math.pow(1.15, expansionCount);
    return Math.floor(tier.cost * costMultiplier);
  };

  const getExpansionTime = (tier) => {
    const expansionCount = fleet.expansionCount || 0;
    const timeMultiplier = Math.pow(expansionConfig.timeIncreasePerExpansion, expansionCount);
    return Math.floor(tier.time * timeMultiplier);
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Hero Header */}
      <div className="flex-shrink-0 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b ${shades.gradient} opacity-90`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        <div className="relative z-10 flex items-center justify-between px-4 pt-3">
          <button
            onClick={() => navigate('/business')}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => navigate(`/business/settings/${bizId}`)}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <Settings className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center py-5 pb-7">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-lg">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <p className="text-white text-lg font-bold mt-2.5">{biz.name}</p>
          <p className="text-white/60 text-[10px] mt-0.5">
            {biz.categoryName}{biz.subCategoryName ? ` • ${biz.subCategoryName}` : ''}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-2.5 -mt-3 relative z-10">

        {/* Income Card */}
        <button
  onClick={handleRaiseIncome}
  disabled={!isOnline || hasBizAdBoost || adWatching || effectiveIncome === 0}
          className={`w-full rounded-xl p-3.5 text-left ${t.bg.card} border ${t.border.default}
            transition-all active:scale-[0.98] ${adWatching ? 'animate-pulse' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs ${t.text.secondary}`}>Income Per Hour</span>
            {hasBizAdBoost && bizBoostRem > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/15 text-green-500">
                +{biz.bizAdBoostPercent}% for {formatTime(bizBoostRem)}
              </span>
            )}
          </div>
          <p className={`text-3xl font-black ${hasBizAdBoost ? 'text-green-500' : effectiveIncome > 0 ? shades.text : 'text-red-400'}`}>
            {formatCurrency(effectiveIncome)}
            <span className={`text-lg font-normal ml-1 ${t.text.tertiary}`}>/hr</span>
          </p>
          {effectiveIncome === 0 && (
            <p className="text-[10px] text-red-400 mt-1">⚠ No vehicles — Buy cars to earn</p>
          )}
          {!hasBizAdBoost && effectiveIncome > 0 && (
            <div className={`mt-2 flex items-center gap-2 py-2 px-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <MonitorPlay className={`w-4 h-4 ${shades.text}`} />
              <span className={`text-xs font-medium ${t.text.secondary}`}>
  {!isOnline ? '📡 Offline — No Ads' : adWatching ? 'Watching ad...' : 'Raise Income (+15% for 4h)'}
</span>
            </div>
          )}
        </button>

        {/* Balance */}
        <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-[10px] ${t.text.tertiary}`}>Balance</p>
          <p className={`text-xl font-black ${t.text.brand}`}>{formatCurrency(balance)}</p>
        </div>

        {/* ═══ EXPAND FLEET CAPACITY ═══ */}
        <div className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center gap-2 mb-3">
            <Zap className={`w-4 h-4 ${shades.text}`} />
            <span className={`text-sm font-bold ${t.text.primary}`}>Expand Fleet Capacity</span>
          </div>

          {isExpanding ? (
            /* Expansion In Progress */
            <div className={`rounded-xl p-4 ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'} border ${isDark ? 'border-orange-500/20' : 'border-orange-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className={`text-xs font-bold ${t.text.primary}`}>Expansion in Progress</span>
              </div>
              <p className={`text-2xl font-black text-center my-3 ${shades.text}`}>
                {formatTime(expansionRemaining)}
              </p>
              <p className={`text-[10px] text-center mb-3 ${t.text.tertiary}`}>
                +{fleet.expansionSlots || 5} slots incoming
              </p>
              <button
  onClick={handleSkipExpansion}
  disabled={!isOnline || skipAdWatching}
  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold
    ${(!isOnline || skipAdWatching) ? 'opacity-50' : ''} bg-gradient-to-r from-purple-500 to-violet-600 text-white active:scale-95`}
>
  <MonitorPlay className="w-4 h-4" />
  {!isOnline ? '📡 Offline' : skipAdWatching ? 'Watching ad...' : 'Skip the Expansion Time'}
</button>
            </div>
          ) : (
            /* Expansion Options */
            <div className="grid grid-cols-3 gap-2">
              {expansionConfig.tiers.map(tier => {
                const cost = getExpansionCost(tier);
                const time = getExpansionTime(tier);
                const canAfford = balance >= cost;

                return (
                  <button
                    key={tier.id}
                    onClick={() => handleStartExpansion(tier.id)}
                    disabled={!canAfford}
                    className={`rounded-xl p-3 text-center transition-all active:scale-95
                      ${canAfford
                        ? `${t.bg.card} border-2 ${isDark ? 'border-yellow-500/30 hover:border-yellow-500' : 'border-yellow-200 hover:border-yellow-400'}`
                        : `${isDark ? 'bg-gray-900' : 'bg-gray-100'} border ${t.border.default} opacity-50`
                      }`}
                  >
                    <p className={`text-xl font-black ${canAfford ? shades.text : t.text.tertiary}`}>
                      +{tier.slots}
                    </p>
                    <p className={`text-[10px] font-medium ${t.text.secondary}`}>places</p>
                    <p className={`text-xs font-bold mt-2 ${canAfford ? t.text.primary : t.text.tertiary}`}>
                      {formatCurrency(cost)}
                    </p>
                    <p className={`text-[9px] ${t.text.tertiary}`}>{formatTime(time)}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ═══ CAR FLEET BOX ═══ */}
        <div className="flex gap-2">
          {/* Car Fleet */}
          <button
            onClick={() => navigate(`/business/fleet/${bizId}/list`)}
            className={`flex-1 rounded-xl p-3.5 text-left transition-all active:scale-[0.98]
              ${t.bg.card} border ${t.border.default} hover:border-yellow-500/30`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${t.text.primary}`}>Car Fleet</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded
                ${isFull ? 'bg-green-500/15 text-green-500' : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                {isFull ? 'FULL' : `${capacityPercent}%`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className={`w-full h-2 rounded-full overflow-hidden mb-2 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-green-500' : shades.dark}`}
                style={{ width: `${capacityPercent}%` }}
              />
            </div>

            <p className={`text-[10px] ${t.text.tertiary}`}>
              Cars: <span className={`font-bold ${t.text.primary}`}>{vehicleCount}</span>
            </p>

            <div className="flex items-center justify-end mt-1">
              <ChevronRight className={`w-4 h-4 ${t.text.tertiary}`} />
            </div>
          </button>

          {/* Capacity Box */}
          <div className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}
            ${isFull ? (isDark ? 'border-green-500/30' : 'border-green-200') : ''}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2
              ${isFull ? 'bg-green-500/15' : isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Icon className={`w-6 h-6 ${isFull ? 'text-green-500' : shades.text}`} />
            </div>
            <p className={`text-center text-[10px] ${t.text.tertiary}`}>Capacity</p>
            <p className={`text-center text-lg font-black ${t.text.primary}`}>{capacity}</p>
          </div>
        </div>

        {/* ═══ BUY A NEW CAR ═══ */}
        <button
          onClick={() => navigate(`/business/fleet/${bizId}/buy`)}
          disabled={isFull}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
            ${isFull
              ? isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
              : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-amber-500/20 active:scale-95'
            }`}
        >
          <Plus className="w-5 h-5" />
          {isFull ? 'Fleet Full — Expand Capacity' : 'Buy a New Car'}
        </button>

        {/* ═══ STAFF SECTION ═══ */}
        {staffTypes.length > 0 && (
          <button
            onClick={() => navigate(`/business/manage/${bizId}/staff`)}
            className={`w-full rounded-xl p-3.5 text-left transition-all active:scale-[0.98]
              ${t.bg.card} border ${t.border.default} hover:border-blue-500/30`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/15' : 'bg-blue-50'}`}>
                  <Users className="w-4.5 h-4.5 text-blue-500" />
                </div>
                <div>
                  <p className={`text-sm font-bold ${t.text.primary}`}>Staff & Employees</p>
                  <p className={`text-[10px] ${t.text.tertiary}`}>
                    {totalStaff > 0 ? `${totalStaff} hired` : 'No staff hired'}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${t.text.tertiary}`} />
            </div>
          </button>
        )}

        {/* ═══ LICENSES SECTION ═══ */}
        {licenseTypes.length > 0 && (
          <button
            onClick={() => navigate(`/business/manage/${bizId}/licenses`)}
            className={`w-full rounded-xl p-3.5 text-left transition-all active:scale-[0.98]
              ${t.bg.card} border ${t.border.default} hover:border-emerald-500/30`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-500/15' : 'bg-emerald-50'}`}>
                  <FileText className="w-4.5 h-4.5 text-emerald-500" />
                </div>
                <div>
                  <p className={`text-sm font-bold ${t.text.primary}`}>Licenses</p>
                  <p className={`text-[10px] ${t.text.tertiary}`}>
                    {obtainedLicenses}/{licenseTypes.length} obtained
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${t.text.tertiary}`} />
            </div>
          </button>
        )}

        {/* Retired Vehicles Notice */}
        {retiredVehicles.length > 0 && (
          <div className={`rounded-xl p-3 ${isDark ? 'bg-red-500/10' : 'bg-red-50'} border ${isDark ? 'border-red-500/20' : 'border-red-200'}`}>
            <p className={`text-xs font-bold text-red-500`}>
              ⚠ {retiredVehicles.length} vehicle{retiredVehicles.length > 1 ? 's' : ''} retired
            </p>
            <p className={`text-[10px] ${t.text.tertiary} mt-0.5`}>
              View fleet to remove and free up income display
            </p>
          </div>
        )}
      </div>

      <AdSpace />
    </div>
  );
}

export default FleetManagement;