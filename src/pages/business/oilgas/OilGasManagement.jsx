// src/pages/business/oilgas/OilGasManagement.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Settings, MonitorPlay, Fuel, Droplets,
  Flame, ChevronRight, Users, FileText, Wrench,
  Clock, TrendingUp, BarChart3, Handshake
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme, getColorShades } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { getCategoryById } from '../../../data/businessCategories';
import {
  calcDailyProduction, calcProductionPerHour,
  getNextAvailableCustomer,
} from '../../../data/oilGasData';
import { STAFF_TYPES, LICENSE_TYPES, EQUIPMENT_TYPES } from '../../../data/businessRequirements';
import { calcBusinessIncome } from '../../../context/helpers/incomeCalculator';
import { formatCurrency, formatNumber } from '../../../utils/formatCurrency';
import { formatTime } from '../../../utils/formatTime';
import AdSpace from '../../../components/common/AdSpace';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';

function OilGasManagement() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isOnline } = useNetworkStatus();
  const t = isDark ? theme.dark : theme.light;

  const {
    ownedBusinesses, balance, startBizAdBoost,
    collectContractReward
  } = useGame();

  const biz = ownedBusinesses.find(b => b.id === bizId);

  const [adWatching, setAdWatching] = useState(false);
  const [bizBoostRem, setBizBoostRem] = useState(0);
  const [contractRemaining, setContractRemaining] = useState(0);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!biz) return;
    const interval = setInterval(() => {
      setTick(p => p + 1);
      if (biz.bizAdBoostEndTime) {
        setBizBoostRem(Math.max(0, Math.floor((biz.bizAdBoostEndTime - Date.now()) / 1000)));
      } else setBizBoostRem(0);

      if (biz.oilgas?.activeContract?.endTime) {
        const rem = Math.max(0, Math.floor((biz.oilgas.activeContract.endTime - Date.now()) / 1000));
        setContractRemaining(rem);
      } else setContractRemaining(0);
    }, 500);
    return () => clearInterval(interval);
  }, [biz]);

  if (!biz || !biz.oilgas) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <div className="text-center">
          <p className={`text-sm ${t.text.secondary}`}>Business not found</p>
          <button onClick={() => navigate('/business')} className="mt-3 text-yellow-500 underline text-sm">Go back</button>
        </div>
      </div>
    );
  }

  const cat = getCategoryById(biz.categoryId);
  const color = cat?.color || 'bg-slate-600';
  const shades = getColorShades(color);

  const oilgas = biz.oilgas;
  const stock = oilgas.stock || { oil: 0, gas: 0 };
  const activeContract = oilgas.activeContract;
  const completedContracts = oilgas.completedContracts || 0;

  const oilWells = (oilgas.wells?.oil || []).filter(w => w.active);
  const gasWells = (oilgas.wells?.gas || []).filter(w => w.active);
  const totalWells = oilWells.length + gasWells.length;

  const hourlyProduction = calcProductionPerHour(oilgas.wells);
  const dailyProduction = calcDailyProduction(oilgas.wells);

  const hasBizAdBoost = biz.bizAdBoostEndTime && Date.now() < biz.bizAdBoostEndTime;
  const effectiveIncome = calcBusinessIncome(biz);

  // Contract status
  const isContractActive = activeContract && activeContract.endTime && Date.now() < activeContract.endTime;
  const isContractComplete = activeContract && activeContract.endTime && Date.now() >= activeContract.endTime;

  // Staff & equipment counts
  const totalStaff = Object.values(biz.staff || {}).reduce((a, b) => a + b, 0);
  const staffTypes = STAFF_TYPES[biz.categoryId] || [];
  const licenseTypes = LICENSE_TYPES[biz.categoryId] || [];
  const equipmentTypes = EQUIPMENT_TYPES[biz.categoryId] || [];
  const obtainedLicenses = Object.values(biz.licenses || {}).filter(Boolean).length;
  const totalEquipment = Object.values(biz.equipment || {}).reduce((a, b) => a + b, 0);

  const handleRaiseIncome = () => {
  if (!isOnline || hasBizAdBoost || adWatching || effectiveIncome === 0) return;
  setAdWatching(true);
  setTimeout(() => {
    setAdWatching(false);
    startBizAdBoost(bizId, 15, 4);
  }, 2000);
};

  const handleCollectReward = () => {
    if (!isContractComplete) return;
    collectContractReward(bizId);
  };

  const SectionCard = ({ icon: SIcon, iconColor, iconBg, title, subtitle, onClick, badge, warning }) => (
    <button onClick={onClick}
      className={`w-full rounded-xl p-3.5 text-left transition-all active:scale-[0.98]
        ${t.bg.card} border ${warning ? (isDark ? 'border-red-500/20' : 'border-red-200') : t.border.default}
        hover:border-amber-500/30`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
            <SIcon className={`w-4.5 h-4.5 ${iconColor}`} />
          </div>
          <div>
            <p className={`text-sm font-bold ${t.text.primary}`}>{title}</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
          )}
          {warning && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-400">REQUIRED</span>
          )}
          <ChevronRight className={`w-4 h-4 ${t.text.tertiary}`} />
        </div>
      </div>
    </button>
  );

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Hero */}
      <div className="flex-shrink-0 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b ${shades.gradient} opacity-90`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        <div className="relative z-10 flex items-center justify-between px-4 pt-3">
          <button onClick={() => navigate('/business')}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <button onClick={() => navigate(`/business/settings/${bizId}`)}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <Settings className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center py-5 pb-7">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-lg">
            <Fuel className="w-7 h-7 text-white" />
          </div>
          <p className="text-white text-lg font-bold mt-2.5">{biz.name}</p>
          <p className="text-white/60 text-[10px] mt-0.5">{biz.categoryName}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-2.5 -mt-3 relative z-10">

        {/* Income Card */}
        <button onClick={handleRaiseIncome}
  disabled={!isOnline || hasBizAdBoost || adWatching || effectiveIncome === 0}
          className={`w-full rounded-xl p-3.5 text-left ${t.bg.card} border ${t.border.default}
            transition-all active:scale-[0.98] ${adWatching ? 'animate-pulse' : ''}`}>
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
            <p className="text-[10px] text-red-400 mt-1">⚠ Add wells to start production</p>
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

        {/* ═══ STOCK DISPLAY ═══ */}
        <div className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className={`w-4 h-4 ${shades.text}`} />
            <span className={`text-sm font-bold ${t.text.primary}`}>Current Stock</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Oil Stock */}
            <div className={`rounded-xl p-3 ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}
              border ${isDark ? 'border-amber-500/20' : 'border-amber-200'}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Droplets className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-bold text-amber-500">Crude Oil</span>
              </div>
              <p className={`text-xl font-black ${t.text.primary}`}>
                {formatNumber(Math.floor(stock.oil))}
              </p>
              <p className={`text-[9px] ${t.text.tertiary}`}>bbl</p>
              {hourlyProduction.oil > 0 && (
                <p className="text-[9px] text-green-500 font-medium mt-1">
                  +{formatNumber(hourlyProduction.oil)}/hr
                </p>
              )}
            </div>

            {/* Gas Stock */}
            <div className={`rounded-xl p-3 ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}
              border ${isDark ? 'border-blue-500/20' : 'border-blue-200'}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Flame className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-bold text-blue-500">Natural Gas</span>
              </div>
              <p className={`text-xl font-black ${t.text.primary}`}>
                {formatNumber(Math.floor(stock.gas))}
              </p>
              <p className={`text-[9px] ${t.text.tertiary}`}>m³</p>
              {hourlyProduction.gas > 0 && (
                <p className="text-[9px] text-green-500 font-medium mt-1">
                  +{formatNumber(hourlyProduction.gas)}/hr
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ═══ ACTIVE CONTRACT ═══ */}
        {isContractActive && (
          <div className={`rounded-xl p-3.5 ${isDark ? 'bg-green-500/10' : 'bg-green-50'}
            border ${isDark ? 'border-green-500/20' : 'border-green-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Handshake className="w-4 h-4 text-green-500" />
              <span className="text-xs font-bold text-green-500">Active Contract</span>
            </div>
            <p className={`text-sm font-bold ${t.text.primary}`}>{activeContract.description}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-orange-500" />
                <span className="text-sm font-bold text-orange-500">{formatTime(contractRemaining)}</span>
              </div>
              <span className="text-sm font-bold text-green-500">
                +{formatCurrency(activeContract.reward)}
              </span>
            </div>
            {/* Progress Bar */}
            <div className={`w-full h-2 rounded-full overflow-hidden mt-2 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
              {(() => {
                const total = (activeContract.endTime - activeContract.startTime) / 1000;
                const elapsed = total - contractRemaining;
                const pct = total > 0 ? Math.min(100, (elapsed / total) * 100) : 0;
                return (
                  <div className="h-full rounded-full bg-green-500 transition-all duration-1000"
                    style={{ width: `${pct}%` }} />
                );
              })()}
            </div>
          </div>
        )}

        {/* Contract Complete — Collect */}
        {isContractComplete && (
          <button onClick={handleCollectReward}
            className="w-full rounded-xl p-4 text-center bg-gradient-to-r from-green-500 to-emerald-600
              text-white shadow-lg shadow-green-500/20 active:scale-95 transition-all">
            <Handshake className="w-6 h-6 mx-auto mb-1" />
            <p className="text-sm font-bold">Contract Complete!</p>
            <p className="text-xl font-black mt-1">Collect {formatCurrency(activeContract.reward)}</p>
          </button>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`rounded-xl p-2.5 text-center ${t.bg.card} border ${t.border.default}`}>
            <Droplets className={`w-4 h-4 mx-auto mb-1 text-amber-500`} />
            <p className={`text-lg font-black ${t.text.primary}`}>{oilWells.length}</p>
            <p className={`text-[9px] ${t.text.tertiary}`}>Oil Wells</p>
          </div>
          <div className={`rounded-xl p-2.5 text-center ${t.bg.card} border ${t.border.default}`}>
            <Flame className={`w-4 h-4 mx-auto mb-1 text-blue-500`} />
            <p className={`text-lg font-black ${t.text.primary}`}>{gasWells.length}</p>
            <p className={`text-[9px] ${t.text.tertiary}`}>Gas Wells</p>
          </div>
          <div className={`rounded-xl p-2.5 text-center ${t.bg.card} border ${t.border.default}`}>
            <Handshake className={`w-4 h-4 mx-auto mb-1 text-green-500`} />
            <p className={`text-lg font-black ${t.text.primary}`}>{completedContracts}</p>
            <p className={`text-[9px] ${t.text.tertiary}`}>Contracts</p>
          </div>
        </div>

        {/* ═══ MANAGEMENT SECTIONS ═══ */}

        {/* Wells */}
        <SectionCard
          icon={Fuel}
          iconColor="text-amber-500"
          iconBg={isDark ? 'bg-amber-500/15' : 'bg-amber-50'}
          title="Wells & Production"
          subtitle={totalWells > 0 ? `${oilWells.length} oil • ${gasWells.length} gas wells` : 'No wells yet'}
          onClick={() => navigate(`/business/oilgas/${bizId}/wells`)}
          badge={totalWells > 0 ? { label: `${totalWells}`, bg: 'bg-amber-500/15', text: 'text-amber-500' } : null}
          warning={totalWells === 0}
        />

        {/* Customer Contracts */}
        <SectionCard
          icon={Handshake}
          iconColor="text-green-500"
          iconBg={isDark ? 'bg-green-500/15' : 'bg-green-50'}
          title="Customer Contracts"
          subtitle={isContractActive ? 'Contract in progress' :
            stock.oil > 0 || stock.gas > 0 ? 'Stock available for contracts' : 'Need stock first'}
          onClick={() => navigate(`/business/oilgas/${bizId}/contracts`)}
          badge={isContractActive ? { label: 'ACTIVE', bg: 'bg-green-500/15', text: 'text-green-500' } : null}
        />

        {/* Staff */}
        {staffTypes.length > 0 && (
          <SectionCard
            icon={Users}
            iconColor="text-blue-500"
            iconBg={isDark ? 'bg-blue-500/15' : 'bg-blue-50'}
            title="Staff & Employees"
            subtitle={totalStaff > 0 ? `${totalStaff} hired` : 'No staff hired'}
            onClick={() => navigate(`/business/manage/${bizId}/staff`)}
            badge={totalStaff > 0 ? { label: `${totalStaff}`, bg: 'bg-blue-500/15', text: 'text-blue-500' } : null}
          />
        )}

        {/* Equipment */}
        {equipmentTypes.length > 0 && (
          <SectionCard
            icon={Wrench}
            iconColor="text-orange-500"
            iconBg={isDark ? 'bg-orange-500/15' : 'bg-orange-50'}
            title="Equipment"
            subtitle={totalEquipment > 0 ? `${totalEquipment} items` : 'No equipment'}
            onClick={() => navigate(`/business/manage/${bizId}/equipment`)}
          />
        )}

        {/* Licenses */}
        {licenseTypes.length > 0 && (
          <SectionCard
            icon={FileText}
            iconColor="text-emerald-500"
            iconBg={isDark ? 'bg-emerald-500/15' : 'bg-emerald-50'}
            title="Licenses & Permits"
            subtitle={`${obtainedLicenses}/${licenseTypes.length} obtained`}
            onClick={() => navigate(`/business/manage/${bizId}/licenses`)}
            warning={obtainedLicenses === 0 && licenseTypes.some(l => l.required)}
          />
        )}

        {/* Daily Production Summary */}
        {totalWells > 0 && (
          <div className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}`}>
            <p className={`text-xs font-bold mb-2 ${t.text.primary}`}>📊 Daily Production</p>
            <div className="grid grid-cols-2 gap-2">
              <div className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <Droplets className="w-3.5 h-3.5 text-amber-500" />
                <div>
                  <p className={`text-xs font-bold ${t.text.primary}`}>{formatNumber(dailyProduction.oil)} bbl</p>
                  <p className={`text-[9px] ${t.text.tertiary}`}>Oil / day</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <Flame className="w-3.5 h-3.5 text-blue-500" />
                <div>
                  <p className={`text-xs font-bold ${t.text.primary}`}>{formatNumber(dailyProduction.gas)} m³</p>
                  <p className={`text-[9px] ${t.text.tertiary}`}>Gas / day</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AdSpace />
    </div>
  );
}

export default OilGasManagement;