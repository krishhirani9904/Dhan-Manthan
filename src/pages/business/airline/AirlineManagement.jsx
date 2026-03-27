// src/pages/business/airline/AirlineManagement.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Settings, MonitorPlay, Plane, MapPin,
  FileText, Users, ChevronRight, Clock, Zap,
  Globe, Building2, Navigation
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme, getColorShades } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { getCategoryById } from '../../../data/businessCategories';
import { AIRLINE_STAFF } from '../../../data/airlineData';
import { calcBusinessIncome } from '../../../context/helpers/incomeCalculator';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatTime } from '../../../utils/formatTime';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import AdSpace from '../../../components/common/AdSpace';

function AirlineManagement() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isOnline } = useNetworkStatus();
  const t = isDark ? theme.dark : theme.light;

  const { ownedBusinesses, balance, startBizAdBoost } = useGame();
  const biz = ownedBusinesses.find(b => b.id === bizId);

  const [adWatching, setAdWatching] = useState(false);
  const [bizBoostRem, setBizBoostRem] = useState(0);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!biz) return;
    const interval = setInterval(() => {
      setTick(p => p + 1);
      if (biz.bizAdBoostEndTime) {
        setBizBoostRem(Math.max(0, Math.floor((biz.bizAdBoostEndTime - Date.now()) / 1000)));
      } else setBizBoostRem(0);
    }, 500);
    return () => clearInterval(interval);
  }, [biz]);

  if (!biz || !biz.airline) {
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
  const color = cat?.color || 'bg-sky-500';
  const shades = getColorShades(color);

  const airline = biz.airline;
  const licenseCount = (airline.licenses || []).length;
  const hubCount = (airline.hubs || []).length;
  const aircraftCount = (airline.aircraft || []).filter(a => a.active).length;
  const activeFlights = (airline.activeFlights || []).filter(f => f.endTime && Date.now() < f.endTime);
  const totalHubCapacity = (airline.hubs || []).reduce((s, h) => s + (h.capacity || 0), 0);

  const hasBizAdBoost = biz.bizAdBoostEndTime && Date.now() < biz.bizAdBoostEndTime;
  const effectiveIncome = calcBusinessIncome(biz);

  // Staff counts
  const staffCounts = airline.staff || {};
  const totalStaff = Object.values(staffCounts).reduce((a, b) => a + b, 0);

  const handleRaiseIncome = () => {
  if (!isOnline || hasBizAdBoost || adWatching || effectiveIncome === 0) return;
  setAdWatching(true);
  setTimeout(() => {
    setAdWatching(false);
    startBizAdBoost(bizId, 15, 4);
  }, 2000);
};

  // Check what's missing for operations
  const canOperate = licenseCount > 0 && hubCount > 0 && aircraftCount > 0 && totalStaff > 0;

  const SectionCard = ({ icon: SIcon, iconColor, iconBg, title, subtitle, onClick, badge, warning }) => (
    <button onClick={onClick}
      className={`w-full rounded-xl p-3.5 text-left transition-all active:scale-[0.98]
        ${t.bg.card} border ${warning ? (isDark ? 'border-red-500/20' : 'border-red-200') : t.border.default}
        hover:border-sky-500/30`}>
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
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-400">
              REQUIRED
            </span>
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
            <Plane className="w-7 h-7 text-white" />
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
            <p className="text-[10px] text-red-400 mt-1">
              {licenseCount === 0 ? '⚠ Get a flying license first' :
               hubCount === 0 ? '⚠ Buy a hub to park aircraft' :
               aircraftCount === 0 ? '⚠ Purchase aircraft' :
               '⚠ Start flights to earn income'}
            </p>
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

        {/* Operations Status */}
        {!canOperate && (
          <div className={`rounded-xl p-3.5 ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'}
            border ${isDark ? 'border-orange-500/20' : 'border-orange-200'}`}>
            <p className="text-xs font-bold text-orange-500 mb-1">⚠ Setup Required</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>
              Complete these steps to start flying:
            </p>
            <div className="mt-2 space-y-1">
              {licenseCount === 0 && (
                <p className="text-[10px] text-red-400">① Buy a Country Flying License</p>
              )}
              {hubCount === 0 && (
                <p className="text-[10px] text-red-400">② Purchase a Hub (Airport)</p>
              )}
              {aircraftCount === 0 && (
                <p className="text-[10px] text-red-400">③ Buy Aircraft</p>
              )}
              {totalStaff === 0 && (
                <p className="text-[10px] text-red-400">④ Hire Staff (Pilots, Crew)</p>
              )}
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          <div className={`rounded-xl p-2.5 text-center ${t.bg.card} border ${t.border.default}`}>
            <Globe className={`w-4 h-4 mx-auto mb-1 ${shades.text}`} />
            <p className={`text-lg font-black ${t.text.primary}`}>{licenseCount}</p>
            <p className={`text-[9px] ${t.text.tertiary}`}>Licenses</p>
          </div>
          <div className={`rounded-xl p-2.5 text-center ${t.bg.card} border ${t.border.default}`}>
            <Building2 className={`w-4 h-4 mx-auto mb-1 ${shades.text}`} />
            <p className={`text-lg font-black ${t.text.primary}`}>{hubCount}</p>
            <p className={`text-[9px] ${t.text.tertiary}`}>Hubs</p>
          </div>
          <div className={`rounded-xl p-2.5 text-center ${t.bg.card} border ${t.border.default}`}>
            <Plane className={`w-4 h-4 mx-auto mb-1 ${shades.text}`} />
            <p className={`text-lg font-black ${t.text.primary}`}>{aircraftCount}</p>
            <p className={`text-[9px] ${t.text.tertiary}`}>Aircraft</p>
          </div>
          <div className={`rounded-xl p-2.5 text-center ${t.bg.card} border ${t.border.default}`}>
            <Navigation className={`w-4 h-4 mx-auto mb-1 ${activeFlights.length > 0 ? 'text-green-500' : t.text.tertiary}`} />
            <p className={`text-lg font-black ${activeFlights.length > 0 ? 'text-green-500' : t.text.primary}`}>
              {activeFlights.length}
            </p>
            <p className={`text-[9px] ${t.text.tertiary}`}>Flights</p>
          </div>
        </div>

        {/* ═══ MANAGEMENT SECTIONS ═══ */}

        {/* 1. Country Licenses */}
        <SectionCard
          icon={Globe}
          iconColor="text-blue-500"
          iconBg={isDark ? 'bg-blue-500/15' : 'bg-blue-50'}
          title="Country Flying Licenses"
          subtitle={licenseCount > 0 ? `${licenseCount} countries licensed` : 'No licenses yet'}
          onClick={() => navigate(`/business/airline/${bizId}/licenses`)}
          badge={licenseCount > 0 ? { label: `${licenseCount}`, bg: 'bg-blue-500/15', text: 'text-blue-500' } : null}
          warning={licenseCount === 0}
        />

        {/* 2. Hubs */}
        <SectionCard
          icon={Building2}
          iconColor="text-purple-500"
          iconBg={isDark ? 'bg-purple-500/15' : 'bg-purple-50'}
          title="Airport Hubs"
          subtitle={hubCount > 0 ? `${hubCount} hubs • ${totalHubCapacity} aircraft capacity` : 'No hubs yet'}
          onClick={() => navigate(`/business/airline/${bizId}/hubs`)}
          badge={hubCount > 0 ? { label: `${hubCount}`, bg: 'bg-purple-500/15', text: 'text-purple-500' } : null}
          warning={licenseCount > 0 && hubCount === 0}
        />

        {/* 3. Aircraft */}
        <SectionCard
          icon={Plane}
          iconColor="text-sky-500"
          iconBg={isDark ? 'bg-sky-500/15' : 'bg-sky-50'}
          title="Aircraft Fleet"
          subtitle={aircraftCount > 0
            ? `${aircraftCount}/${totalHubCapacity} aircraft`
            : hubCount > 0 ? 'No aircraft yet' : 'Need a hub first'}
          onClick={() => navigate(`/business/airline/${bizId}/aircraft`)}
          badge={aircraftCount > 0 ? { label: `${aircraftCount}`, bg: 'bg-sky-500/15', text: 'text-sky-500' } : null}
          warning={hubCount > 0 && aircraftCount === 0}
        />

        {/* 4. Flight Operations */}
        <SectionCard
          icon={Navigation}
          iconColor="text-green-500"
          iconBg={isDark ? 'bg-green-500/15' : 'bg-green-50'}
          title="Flight Operations"
          subtitle={activeFlights.length > 0
            ? `${activeFlights.length} active flights`
            : aircraftCount > 0 ? 'No active flights' : 'Need aircraft first'}
          onClick={() => navigate(`/business/airline/${bizId}/flights`)}
          badge={activeFlights.length > 0 ? { label: `${activeFlights.length} active`, bg: 'bg-green-500/15', text: 'text-green-500' } : null}
        />

        {/* 5. Staff */}
        <SectionCard
          icon={Users}
          iconColor="text-orange-500"
          iconBg={isDark ? 'bg-orange-500/15' : 'bg-orange-50'}
          title="Airline Staff"
          subtitle={totalStaff > 0 ? `${totalStaff} total staff` : 'No staff hired'}
          onClick={() => navigate(`/business/airline/${bizId}/staff`)}
          badge={totalStaff > 0 ? { label: `${totalStaff}`, bg: 'bg-orange-500/15', text: 'text-orange-500' } : null}
          warning={aircraftCount > 0 && totalStaff === 0}
        />

        {/* 6. Normal Licenses (AOC etc) */}
        <SectionCard
          icon={FileText}
          iconColor="text-emerald-500"
          iconBg={isDark ? 'bg-emerald-500/15' : 'bg-emerald-50'}
          title="Operating Licenses"
          subtitle={`${Object.values(biz.licenses || {}).filter(Boolean).length} obtained`}
          onClick={() => navigate(`/business/manage/${bizId}/licenses`)}
        />

        {/* Active Flights Preview */}
        {activeFlights.length > 0 && (
          <div className={`rounded-xl p-3.5 ${t.bg.card} border ${isDark ? 'border-green-500/20' : 'border-green-200'}`}>
            <p className={`text-xs font-bold mb-2 ${t.text.primary}`}>✈️ Active Flights</p>
            <div className="space-y-2">
              {activeFlights.slice(0, 3).map(flight => {
                const remaining = Math.max(0, Math.floor((flight.endTime - Date.now()) / 1000));
                return (
                  <div key={flight.id} className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                      <Plane className="w-3.5 h-3.5 text-green-500" />
                      <div>
                        <p className={`text-[11px] font-bold ${t.text.primary}`}>{flight.aircraftName}</p>
                        <p className={`text-[9px] ${t.text.tertiary}`}>{formatCurrency(flight.incomePerHour)}/hr</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span className="text-[10px] font-bold text-orange-500">{formatTime(remaining)}</span>
                    </div>
                  </div>
                );
              })}
              {activeFlights.length > 3 && (
                <p className={`text-[10px] text-center ${t.text.tertiary}`}>
                  +{activeFlights.length - 3} more flights
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <AdSpace />
    </div>
  );
}

export default AirlineManagement;