// src/pages/business/BusinessDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Settings, TrendingUp, MonitorPlay, Signal,
  Building2, ShoppingBag, ArrowUpRight, Clock, Tag,
  Users, Car, Wrench, Package, FileText, FolderKanban,
  Landmark, ChevronRight, Check, AlertTriangle, Store, Plus
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme, getColorShades } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { getCategoryById } from '../../data/businessCategories';
import {
  getBusinessRequirements, VEHICLE_CATEGORIES,
  BANK_SETTINGS_DEFAULTS, STAFF_TYPES, EQUIPMENT_TYPES,
  LICENSE_TYPES, INVENTORY_TYPES, isFleetBased, isContractBased
} from '../../data/businessRequirements';
import { calcBusinessIncome, countActiveOutlets, checkRequiredComplete } from '../../context/helpers/incomeCalculator';
import { formatCurrency, formatNumber } from '../../utils/formatCurrency';
import { formatTime, formatTimeShort } from '../../utils/formatTime';
import { getLevelLabel } from '../../utils/helpers';
import { MAX_BUSINESS_LEVEL } from '../../config/constants';
import AdSpace from '../../components/common/AdSpace';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

function BusinessDetail() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isOnline } = useNetworkStatus();
  const t = isDark ? theme.dark : theme.light;
  const {
    ownedBusinesses, balance, startExpansion, skipExpansion,
    startBizAdBoost, getExpansionCost, getExpansionTime,
    hireOutletStaff, buyOutletEquipment, buyOutletLicense, buyOutletInventory
  } = useGame();

  const biz = ownedBusinesses.find(b => b.id === bizId);

  // ═══ REDIRECT FOR SPECIAL BUSINESS TYPES ═══
  useEffect(() => {
    if (!biz) return;

    // Fleet-based businesses (taxi, shipping) → FleetManagement
    if (isFleetBased(biz.categoryId) && biz.categoryId !== 'airlines') {
      navigate(`/business/fleet/${bizId}`, { replace: true });
      return;
    }

    // Airlines → AirlineManagement (Phase 2)
    if (biz.categoryId === 'airlines') {
      navigate(`/business/airline/${bizId}`, { replace: true });
      return;
    }

    // Oil & Gas → OilGasManagement (Phase 3)
    if (isContractBased(biz.categoryId)) {
      navigate(`/business/oilgas/${bizId}`, { replace: true });
      return;
    }
  }, [biz, bizId, navigate]);

  const [adWatching, setAdWatching] = useState(false);
  const [skipAdWatching, setSkipAdWatching] = useState(false);
  const [expansionRemaining, setExpansionRemaining] = useState(0);
  const [bizBoostRem, setBizBoostRem] = useState(0);
  const [selectedOutlet, setSelectedOutlet] = useState(0);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!biz) return;
    const interval = setInterval(() => {
      setTick(p => p + 1);
      if (biz.expansionEndTime) {
        setExpansionRemaining(Math.max(0, Math.floor((biz.expansionEndTime - Date.now()) / 1000)));
      } else setExpansionRemaining(0);
      if (biz.bizAdBoostEndTime) {
        setBizBoostRem(Math.max(0, Math.floor((biz.bizAdBoostEndTime - Date.now()) / 1000)));
      } else setBizBoostRem(0);
    }, 500);
    return () => clearInterval(interval);
  }, [biz]);

  if (!biz) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <div className="text-center">
          <p className={`text-sm ${t.text.secondary}`}>Business not found</p>
          <button onClick={() => navigate('/business')} className="mt-3 text-yellow-500 underline text-sm">Go back</button>
        </div>
      </div>
    );
  }

  // If redirecting, show loading
  if (isFleetBased(biz.categoryId) || isContractBased(biz.categoryId)) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className={`text-sm ${t.text.secondary}`}>Loading...</p>
        </div>
      </div>
    );
  }

  const cat = getCategoryById(biz.categoryId);
  const Icon = cat?.icon || Building2;
  const color = cat?.color || 'bg-gray-500';
  const shades = getColorShades(color);
  const level = biz.level || 1;
  const outlets = biz.outlets || 1;
  const isExpanding = biz.expansionEndTime && Date.now() < biz.expansionEndTime;
  const expansionCost = getExpansionCost(bizId);
  const canExpand = level < MAX_BUSINESS_LEVEL && !isExpanding && balance >= expansionCost;
  const profitGrowth = cat?.profitGrowthPercent || 15;
  const expectedNewIncome = Math.floor(biz.incomePerHour * (1 + profitGrowth / 100));
  const hasBizAdBoost = biz.bizAdBoostEndTime && Date.now() < biz.bizAdBoostEndTime;
  const effectiveIncome = calcBusinessIncome(biz);
  const activeOutletCount = countActiveOutlets(biz);
  const expansionTimeSecs = getExpansionTime ? getExpansionTime(bizId) : 0;

  const reqs = getBusinessRequirements(biz.categoryId);
  const hasStaff = reqs.staff?.length > 0;
  const hasVehicles = reqs.vehicles !== null;
  const hasEquipment = reqs.equipment?.length > 0;
  const hasInventory = reqs.inventory?.length > 0;
  const hasLicenses = reqs.licenses?.length > 0;
  const hasProjects = biz.categoryId === 'construction' || biz.categoryId === 'it-company';
  const hasBankSettings = biz.categoryId === 'bank';

  const totalStaff = Object.values(biz.staff || {}).reduce((a, b) => a + b, 0);
  const activeVehicles = (biz.vehicles || []).filter(v => v.active);
  const retiredVehicles = (biz.vehicles || []).filter(v => !v.active);
  const totalEquipment = Object.values(biz.equipment || {}).reduce((a, b) => a + b, 0);
  const obtainedLicenses = Object.values(biz.licenses || {}).filter(Boolean).length;
  const activeProjects = (biz.projects || []).filter(p => p.status === 'active');
  const completedProjects = (biz.projects || []).filter(p => p.status === 'completed');
  const vehicleConfig = VEHICLE_CATEGORIES[biz.categoryId];

  // ═══ OUTLET REQUIREMENT HELPERS ═══
  const getOutletData = (outletIdx) => {
    if (outletIdx === 0) {
      return { staff: biz.staff || {}, equipment: biz.equipment || {}, licenses: biz.licenses || {}, inventory: biz.inventory || {} };
    }
    return biz.outletRequirements?.[outletIdx] || { staff: {}, equipment: {}, licenses: {}, inventory: {} };
  };

  const isOutletReqsMet = (outletIdx) => {
    const data = getOutletData(outletIdx);
    const staffDefs = STAFF_TYPES[biz.categoryId] || [];
    for (const s of staffDefs) {
      if ((s.required || s.min > 0) && (data.staff?.[s.id] || 0) < Math.max(s.min || 1, 1)) return false;
    }
    const equipDefs = EQUIPMENT_TYPES[biz.categoryId] || [];
    for (const e of equipDefs) {
      if (e.required && !(data.equipment?.[e.id])) return false;
    }
    const licenseDefs = LICENSE_TYPES[biz.categoryId] || [];
    for (const l of licenseDefs) {
      if (l.required && !data.licenses?.[l.id]) return false;
    }
    const invDefs = INVENTORY_TYPES[biz.categoryId] || [];
    for (const i of invDefs) {
      if (i.required && (data.inventory?.[i.id] || 0) <= 0) return false;
    }
    return true;
  };

  const handleRaiseIncome = () => {
  if (!isOnline || hasBizAdBoost || adWatching) return;
  setAdWatching(true);
  setTimeout(() => { setAdWatching(false); startBizAdBoost(bizId, 15, 4); }, 2000);
};

  const handleStartExpansion = () => { if (canExpand) startExpansion(bizId); };

  const handleSkipExpansion = () => {
  if (!isOnline || !isExpanding || skipAdWatching) return;
  setSkipAdWatching(true);
  setTimeout(() => { setSkipAdWatching(false); skipExpansion(bizId); }, 2000);
};

  const SectionCard = ({ icon: SIcon, iconColor, iconBg, title, subtitle, onClick, children, badge }) => (
    <button onClick={onClick}
      className={`w-full rounded-xl p-3.5 text-left transition-all active:scale-[0.98] ${t.bg.card} border ${t.border.default} hover:border-yellow-500/30`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
            <SIcon className={`w-4.5 h-4.5 ${iconColor}`} />
          </div>
          <div>
            <p className={`text-sm font-bold ${t.text.primary}`}>{title}</p>
            {subtitle && <p className={`text-[10px] ${t.text.tertiary}`}>{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>{badge.label}</span>}
          <ChevronRight className={`w-4 h-4 ${t.text.tertiary}`} />
        </div>
      </div>
      {children}
    </button>
  );

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Hero */}
      <div className="flex-shrink-0 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b ${shades.gradient} opacity-90`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="relative z-10 flex items-center justify-between px-4 pt-3">
          <button onClick={() => navigate('/business')} className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <button onClick={() => navigate(`/business/settings/${bizId}`)} className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-sm">
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
        <button onClick={handleRaiseIncome} disabled={!isOnline || hasBizAdBoost || adWatching}
          className={`w-full rounded-xl p-3.5 text-left ${t.bg.card} border ${t.border.default}
            transition-all active:scale-[0.98] ${adWatching ? 'animate-pulse' : ''}`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs ${t.text.secondary}`}>Income Per Hour</span>
            {hasBizAdBoost && bizBoostRem > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/15 text-green-500">
                +{biz.bizAdBoostPercent}% for {formatTimeShort(bizBoostRem)}
              </span>
            )}
          </div>
          <p className={`text-3xl font-black ${hasBizAdBoost ? 'text-green-500' : effectiveIncome > 0 ? shades.text : 'text-red-400'}`}>
            {formatCurrency(effectiveIncome)}
            <span className={`text-lg font-normal ml-1 ${t.text.tertiary}`}>/hr</span>
          </p>
          {effectiveIncome === 0 && (
            <p className="text-[10px] text-red-400 mt-1">⚠ Requirements not met — No income</p>
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

        {/* Stats Row */}
        <div className="flex gap-2">
          <div className={`flex-1 rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <div className="flex justify-center mb-1"><Signal className={`w-5 h-5 ${shades.text}`} /></div>
            <p className={`text-center text-xl font-black ${t.text.primary}`}>{level}/{MAX_BUSINESS_LEVEL}</p>
            <p className={`text-center text-[10px] ${t.text.secondary}`}>{getLevelLabel(level)}</p>
          </div>
          <div className={`flex-1 rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <div className="flex justify-center mb-1"><Store className={`w-5 h-5 ${shades.text}`} /></div>
            <p className={`text-center text-xl font-black ${t.text.primary}`}>{activeOutletCount}/{outlets}</p>
            <p className={`text-center text-[10px] ${t.text.secondary}`}>Outlets Active</p>
          </div>
          <div className={`flex-1 rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <div className="flex justify-center mb-1"><Tag className={`w-5 h-5 ${shades.text}`} /></div>
            <p className={`text-center text-sm font-bold truncate ${t.text.primary}`}>{biz.categoryName}</p>
            <p className={`text-center text-[10px] ${t.text.tertiary}`}>Category</p>
          </div>
        </div>

        {/* ═══ OUTLET SELECTOR ═══ */}
        {outlets > 1 && (
          <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <p className={`text-xs font-bold mb-2 ${t.text.primary}`}>Outlet Management</p>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: outlets }, (_, i) => {
                const met = isOutletReqsMet(i);
                return (
                  <button key={i} onClick={() => setSelectedOutlet(i)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all
                      ${selectedOutlet === i
                        ? `${shades.dark} text-white`
                        : met
                          ? isDark ? 'bg-green-500/15 text-green-500' : 'bg-green-50 text-green-600'
                          : isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500'
                      }`}>
                    {i === 0 ? 'Main' : `#${i + 1}`} {met ? '✓' : '⚠'}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ OUTLET REQUIREMENTS (for outlets > 0) ═══ */}
        {selectedOutlet > 0 && (
          <div className={`rounded-xl p-3.5 ${t.bg.card} border ${isDark ? 'border-yellow-500/20' : 'border-yellow-200'}`}>
            <p className={`text-xs font-bold mb-3 ${t.text.primary}`}>
              Outlet #{selectedOutlet + 1} — Requirements
              {isOutletReqsMet(selectedOutlet)
                ? <span className="text-green-500 ml-2">✓ All Met</span>
                : <span className="text-red-400 ml-2">⚠ Incomplete</span>
              }
            </p>

            <div className="space-y-2">
              {/* Staff */}
              {(STAFF_TYPES[biz.categoryId] || []).filter(s => s.required || s.min > 0).map(s => {
                const outletData = getOutletData(selectedOutlet);
                const current = outletData.staff?.[s.id] || 0;
                const needed = s.required ? Math.max(s.min || 1, 1) : (s.min || 0);
                const met = current >= needed;
                return (
                  <div key={`staff-${s.id}`} className={`flex items-center justify-between p-2.5 rounded-lg
                    ${met ? isDark ? 'bg-green-500/8' : 'bg-green-50' : isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                      <Users className={`w-3.5 h-3.5 ${met ? 'text-green-500' : 'text-blue-500'}`} />
                      <div>
                        <p className={`text-[11px] font-bold ${t.text.primary}`}>{s.name}</p>
                        <p className={`text-[9px] ${t.text.tertiary}`}>{current}/{needed} • {formatCurrency(s.costPer)}/person</p>
                      </div>
                    </div>
                    {met ? <Check className="w-4 h-4 text-green-500" />
                      : <button onClick={() => hireOutletStaff(bizId, selectedOutlet, s.id, 1, s.costPer)}
                          disabled={balance < s.costPer}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold
                            ${balance >= s.costPer ? 'bg-blue-500 text-white active:scale-95' : 'bg-gray-300 text-gray-500'}`}>
                          <Plus className="w-3 h-3 inline mr-0.5" />Hire
                        </button>
                    }
                  </div>
                );
              })}

              {/* Equipment */}
              {(EQUIPMENT_TYPES[biz.categoryId] || []).filter(e => e.required).map(e => {
                const outletData = getOutletData(selectedOutlet);
                const owned = outletData.equipment?.[e.id] || 0;
                const met = owned >= 1;
                return (
                  <div key={`equip-${e.id}`} className={`flex items-center justify-between p-2.5 rounded-lg
                    ${met ? isDark ? 'bg-green-500/8' : 'bg-green-50' : isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                      <Wrench className={`w-3.5 h-3.5 ${met ? 'text-green-500' : 'text-orange-500'}`} />
                      <div>
                        <p className={`text-[11px] font-bold ${t.text.primary}`}>{e.name}</p>
                        <p className={`text-[9px] ${t.text.tertiary}`}>{formatCurrency(e.cost)}</p>
                      </div>
                    </div>
                    {met ? <Check className="w-4 h-4 text-green-500" />
                      : <button onClick={() => buyOutletEquipment(bizId, selectedOutlet, e.id, 1, e.cost)}
                          disabled={balance < e.cost}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold
                            ${balance >= e.cost ? 'bg-orange-500 text-white active:scale-95' : 'bg-gray-300 text-gray-500'}`}>
                          <Plus className="w-3 h-3 inline mr-0.5" />Buy
                        </button>
                    }
                  </div>
                );
              })}

              {/* Licenses */}
              {(LICENSE_TYPES[biz.categoryId] || []).filter(l => l.required).map(l => {
                const outletData = getOutletData(selectedOutlet);
                const owned = outletData.licenses?.[l.id] || false;
                return (
                  <div key={`lic-${l.id}`} className={`flex items-center justify-between p-2.5 rounded-lg
                    ${owned ? isDark ? 'bg-green-500/8' : 'bg-green-50' : isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                      <FileText className={`w-3.5 h-3.5 ${owned ? 'text-green-500' : 'text-emerald-500'}`} />
                      <div>
                        <p className={`text-[11px] font-bold ${t.text.primary}`}>{l.name}</p>
                        <p className={`text-[9px] ${t.text.tertiary}`}>{formatCurrency(l.cost)}</p>
                      </div>
                    </div>
                    {owned ? <Check className="w-4 h-4 text-green-500" />
                      : <button onClick={() => buyOutletLicense(bizId, selectedOutlet, l.id, l.cost)}
                          disabled={balance < l.cost}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold
                            ${balance >= l.cost ? 'bg-emerald-500 text-white active:scale-95' : 'bg-gray-300 text-gray-500'}`}>
                          <Plus className="w-3 h-3 inline mr-0.5" />Get
                        </button>
                    }
                  </div>
                );
              })}

              {/* Inventory */}
              {(INVENTORY_TYPES[biz.categoryId] || []).filter(inv => inv.required).map(inv => {
                const outletData = getOutletData(selectedOutlet);
                const stock = outletData.inventory?.[inv.id] || 0;
                const met = stock > 0;
                const unitCost = inv.costPerDay || Math.floor((biz.cost || 0) * (inv.costPercent || 0));
                return (
                  <div key={`inv-${inv.id}`} className={`flex items-center justify-between p-2.5 rounded-lg
                    ${met ? isDark ? 'bg-green-500/8' : 'bg-green-50' : isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                      <Package className={`w-3.5 h-3.5 ${met ? 'text-green-500' : 'text-green-600'}`} />
                      <div>
                        <p className={`text-[11px] font-bold ${t.text.primary}`}>{inv.name}</p>
                        <p className={`text-[9px] ${t.text.tertiary}`}>Stock: {stock} • {formatCurrency(unitCost)}/unit</p>
                      </div>
                    </div>
                    {met ? <Check className="w-4 h-4 text-green-500" />
                      : <button onClick={() => buyOutletInventory(bizId, selectedOutlet, inv.id, 1, unitCost)}
                          disabled={balance < unitCost}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold
                            ${balance >= unitCost ? 'bg-green-500 text-white active:scale-95' : 'bg-gray-300 text-gray-500'}`}>
                          <Plus className="w-3 h-3 inline mr-0.5" />Buy
                        </button>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ MAIN OUTLET MANAGEMENT SECTIONS (when selectedOutlet === 0) ═══ */}
        {selectedOutlet === 0 && (
          <>
            {hasStaff && (
              <SectionCard icon={Users} iconColor="text-blue-500" iconBg={isDark ? 'bg-blue-500/15' : 'bg-blue-50'}
                title="Staff & Employees" subtitle={totalStaff > 0 ? `${totalStaff} hired` : 'No staff hired'}
                badge={totalStaff > 0 ? { label: `${totalStaff}`, bg: 'bg-blue-500/15', text: 'text-blue-500' } : null}
                onClick={() => navigate(`/business/manage/${bizId}/staff`)}>
                <p className={`text-[10px] ${t.text.tertiary}`}>
                  {totalStaff > 0 ? 'Tap to manage staff' : 'Tap to hire staff'}
                </p>
              </SectionCard>
            )}

            {hasVehicles && vehicleConfig && (
              <SectionCard icon={Car} iconColor="text-yellow-500" iconBg={isDark ? 'bg-yellow-500/15' : 'bg-yellow-50'}
                title="Vehicle Fleet" subtitle={`${activeVehicles.length} active`}
                onClick={() => navigate(`/business/manage/${bizId}/vehicles`)}>
                <p className={`text-[10px] ${t.text.tertiary}`}>Tap to manage vehicles</p>
              </SectionCard>
            )}

            {hasEquipment && (
              <SectionCard icon={Wrench} iconColor="text-orange-500" iconBg={isDark ? 'bg-orange-500/15' : 'bg-orange-50'}
                title="Equipment" subtitle={`${totalEquipment} items`}
                onClick={() => navigate(`/business/manage/${bizId}/equipment`)}>
                <p className={`text-[10px] ${t.text.tertiary}`}>Tap to manage equipment</p>
              </SectionCard>
            )}

            {hasInventory && (
              <SectionCard icon={Package} iconColor="text-green-500" iconBg={isDark ? 'bg-green-500/15' : 'bg-green-50'}
                title="Inventory & Stock" subtitle="Manage supplies"
                onClick={() => navigate(`/business/manage/${bizId}/inventory`)}>
                <p className={`text-[10px] ${t.text.tertiary}`}>Tap to manage inventory</p>
              </SectionCard>
            )}

            {hasLicenses && (
              <SectionCard icon={FileText} iconColor="text-emerald-500" iconBg={isDark ? 'bg-emerald-500/15' : 'bg-emerald-50'}
                title="Licenses" subtitle={`${obtainedLicenses}/${reqs.licenses.length}`}
                onClick={() => navigate(`/business/manage/${bizId}/licenses`)}>
                <p className={`text-[10px] ${t.text.tertiary}`}>Tap to manage licenses</p>
              </SectionCard>
            )}

            {hasProjects && (
              <SectionCard icon={FolderKanban} iconColor="text-purple-500" iconBg={isDark ? 'bg-purple-500/15' : 'bg-purple-50'}
                title="Projects" subtitle={`${activeProjects.length} active`}
                onClick={() => navigate(`/business/manage/${bizId}/projects`)}>
                <p className={`text-[10px] ${t.text.tertiary}`}>Tap to manage projects</p>
              </SectionCard>
            )}

            {hasBankSettings && (
              <SectionCard icon={Landmark} iconColor="text-cyan-500" iconBg={isDark ? 'bg-cyan-500/15' : 'bg-cyan-50'}
                title="Bank Settings" subtitle="Rates & facilities"
                onClick={() => navigate(`/business/manage/${bizId}/bizsettings`)}>
                <p className={`text-[10px] ${t.text.tertiary}`}>Tap to configure</p>
              </SectionCard>
            )}
          </>
        )}

        {/* ═══ EXPANSION ═══ */}
        <div className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className={`w-4 h-4 ${shades.text}`} />
            <span className={`text-sm font-bold ${t.text.primary}`}>Open New Outlet</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'} ${t.text.tertiary}`}>
              #{outlets + 1}
            </span>
          </div>

          {isExpanding ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className={`text-xs font-bold ${t.text.primary}`}>New Outlet Opening...</span>
              </div>
              <p className={`text-lg font-black text-center my-2 ${shades.text}`}>{formatTime(expansionRemaining)}</p>
              <button onClick={handleSkipExpansion} disabled={!isOnline || skipAdWatching}
  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold
    ${(!isOnline || skipAdWatching) ? 'opacity-50' : ''} bg-gradient-to-r from-purple-500 to-violet-600 text-white active:scale-95`}>
  <MonitorPlay className="w-4 h-4" />
  {!isOnline ? '📡 Offline' : skipAdWatching ? 'Watching ad...' : 'Skip (Open Instantly)'}
</button>
            </div>
          ) : level >= MAX_BUSINESS_LEVEL ? (
            <div className="text-center py-4">
              <p className={`text-sm font-bold ${shades.text}`}>🏆 Max Level!</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div>
                  <p className={`text-xs ${t.text.secondary}`}>Cost</p>
                  <p className={`text-xl font-black ${t.text.primary}`}>{formatCurrency(expansionCost)}</p>
                </div>
                <div>
                  <p className={`text-xs ${t.text.secondary}`}>Time</p>
                  <p className={`text-sm font-bold ${t.text.primary}`}>{formatTime(expansionTimeSecs)}</p>
                </div>
              </div>
              <p className={`text-[10px] mb-3 ${t.text.tertiary}`}>
                ⚠ New outlet needs its own staff, equipment & licenses
              </p>
              <button onClick={handleStartExpansion} disabled={!canExpand}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all
                  ${canExpand
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 active:scale-95'
                    : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
                Open New Outlet
              </button>
            </div>
          )}
        </div>
      </div>

      <AdSpace />
    </div>
  );
}

export default BusinessDetail;