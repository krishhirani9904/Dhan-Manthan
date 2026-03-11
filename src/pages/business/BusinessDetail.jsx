// src/pages/business/BusinessDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Settings, TrendingUp, MonitorPlay, Signal,
  Building2, ShoppingBag, ArrowUpRight, Clock, Tag,
  Users, Car, Wrench, Package, FileText, FolderKanban,
  Landmark, ChevronRight, Gauge, Check, AlertTriangle
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme, getColorShades } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { getCategoryById } from '../../data/businessCategories';
import {
  getBusinessRequirements, VEHICLE_CATEGORIES,
  CONSTRUCTION_RESOURCES, BANK_SETTINGS_DEFAULTS
} from '../../data/businessRequirements';
import { formatCurrency, formatNumber } from '../../utils/formatCurrency';
import { formatTime, formatTimeShort } from '../../utils/formatTime';
import { getLevelLabel } from '../../utils/helpers';
import { MAX_BUSINESS_LEVEL } from '../../config/constants';
import AdSpace from '../../components/common/AdSpace';

function BusinessDetail() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const {
    ownedBusinesses, balance, startExpansion, skipExpansion,
    startBizAdBoost, getExpansionCost
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
          <button onClick={() => navigate('/business')}
            className="mt-3 text-yellow-500 underline text-sm">Go back</button>
        </div>
      </div>
    );
  }

  const cat = getCategoryById(biz.categoryId);
  const Icon = cat?.icon || Building2;
  const color = cat?.color || 'bg-gray-500';
  const shades = getColorShades(color);
  const level = biz.level || 1;
  const isExpanding = biz.expansionEndTime && Date.now() < biz.expansionEndTime;
  const expansionCost = getExpansionCost(bizId);
  const canExpand = level < MAX_BUSINESS_LEVEL && !isExpanding && balance >= expansionCost;
  const profitGrowth = cat?.profitGrowthPercent || 15;
  const expectedNewIncome = Math.floor(biz.incomePerHour * (1 + profitGrowth / 100));
  const hasBizAdBoost = biz.bizAdBoostEndTime && Date.now() < biz.bizAdBoostEndTime;

  const reqs = getBusinessRequirements(biz.categoryId);
  const hasStaff = reqs.staff && reqs.staff.length > 0;
  const hasVehicles = reqs.vehicles !== null;
  const hasEquipment = reqs.equipment && reqs.equipment.length > 0;
  const hasInventory = reqs.inventory && reqs.inventory.length > 0;
  const hasLicenses = reqs.licenses && reqs.licenses.length > 0;
  const hasProjects = biz.categoryId === 'construction' || biz.categoryId === 'it-company';
  const hasBankSettings = biz.categoryId === 'bank';

  // Computed stats
  const totalStaff = Object.values(biz.staff || {}).reduce((a, b) => a + b, 0);
  const activeVehicles = (biz.vehicles || []).filter(v => v.active);
  const retiredVehicles = (biz.vehicles || []).filter(v => !v.active);
  const totalEquipment = Object.values(biz.equipment || {}).reduce((a, b) => a + b, 0);
  const obtainedLicenses = Object.values(biz.licenses || {}).filter(Boolean).length;
  const activeProjects = (biz.projects || []).filter(p => p.status === 'active');
  const completedProjects = (biz.projects || []).filter(p => p.status === 'completed');
  const vehicleConfig = VEHICLE_CATEGORIES[biz.categoryId];

  const handleRaiseIncome = () => {
    if (hasBizAdBoost || adWatching) return;
    setAdWatching(true);
    setTimeout(() => { setAdWatching(false); startBizAdBoost(bizId, 15, 4); }, 2000);
  };

  const handleStartExpansion = () => { if (canExpand) startExpansion(bizId); };

  const handleSkipExpansion = () => {
    if (!isExpanding || skipAdWatching) return;
    setSkipAdWatching(true);
    setTimeout(() => { setSkipAdWatching(false); skipExpansion(bizId); }, 2000);
  };

  // Section card component
  const SectionCard = ({ icon: SIcon, iconColor, iconBg, title, subtitle, onClick, children, badge }) => (
    <button onClick={onClick}
      className={`w-full rounded-xl p-3.5 text-left transition-all active:scale-[0.98]
        ${t.bg.card} border ${t.border.default} hover:border-yellow-500/30`}>
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
          {badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
          )}
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
          <button onClick={() => navigate('/business')}
            className="w-9 h-9 rounded-xl flex items-center justify-center
              bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <button onClick={() => navigate(`/business/settings/${bizId}`)}
            className="w-9 h-9 rounded-xl flex items-center justify-center
              bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors">
            <Settings className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="relative z-10 flex flex-col items-center py-5 pb-7">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center
            bg-white/20 backdrop-blur-sm shadow-lg">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <p className="text-white text-lg font-bold mt-2.5">{biz.name}</p>
          <p className="text-white/60 text-[10px] mt-0.5">
            {biz.categoryName}{biz.subCategoryName ? ` • ${biz.subCategoryName}` : ''}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-2.5
        -mt-3 relative z-10">

        {/* Income Card */}
        <button onClick={handleRaiseIncome}
          disabled={hasBizAdBoost || adWatching}
          className={`w-full rounded-xl p-3.5 text-left
            ${t.bg.card} border ${t.border.default}
            transition-all active:scale-[0.98]
            ${!hasBizAdBoost && !adWatching ? 'hover:border-yellow-500/50 cursor-pointer' : 'cursor-default'}
            ${adWatching ? 'animate-pulse' : ''}`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs ${t.text.secondary}`}>Income Per Hour</span>
            {hasBizAdBoost && bizBoostRem > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full
                bg-green-500/15 text-green-500">
                +{biz.bizAdBoostPercent}% for {formatTimeShort(bizBoostRem)}
              </span>
            )}
          </div>
          <p className={`text-3xl font-black ${hasBizAdBoost ? 'text-green-500' : shades.text}`}>
            {formatCurrency(biz.incomePerHour)}
            <span className={`text-lg font-normal ml-1 ${t.text.tertiary}`}>/hr</span>
          </p>
          {!hasBizAdBoost && (
            <div className={`mt-2 flex items-center gap-2 py-2 px-3 rounded-lg
              ${isDark ? 'bg-gray-800' : 'bg-gray-100'} ${adWatching ? 'opacity-50' : ''}`}>
              <MonitorPlay className={`w-4 h-4 ${shades.text}`} />
              <span className={`text-xs font-medium ${t.text.secondary}`}>
                {adWatching ? 'Watching ad...' : 'Raise Income (+15% for 4h)'}
              </span>
            </div>
          )}
        </button>

        {/* Level + Category */}
        <div className="flex gap-2">
          <div className={`flex-1 rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <div className="flex justify-center mb-1.5">
              <Signal className={`w-5 h-5 ${shades.text}`} />
            </div>
            <p className={`text-center text-xl font-black ${t.text.primary}`}>
              {level}/{MAX_BUSINESS_LEVEL}
            </p>
            <p className={`text-center text-[10px] ${t.text.secondary}`}>
              {getLevelLabel(level)}
            </p>
          </div>
          <div className={`flex-1 rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <div className="flex justify-center mb-1.5">
              <Tag className={`w-5 h-5 ${shades.text}`} />
            </div>
            <p className={`text-center text-sm font-bold truncate ${t.text.primary}`}>
              {biz.categoryName}
            </p>
            <p className={`text-center text-[10px] ${t.text.tertiary}`}>Category</p>
          </div>
        </div>

        {/* ═══ STAFF SECTION ═══ */}
        {hasStaff && (
          <SectionCard
            icon={Users} iconColor="text-blue-500"
            iconBg={isDark ? 'bg-blue-500/15' : 'bg-blue-50'}
            title="Staff & Employees"
            subtitle={totalStaff > 0 ? `${totalStaff} hired` : 'No staff hired yet'}
            badge={totalStaff > 0 ? { label: `${totalStaff}`, bg: 'bg-blue-500/15', text: 'text-blue-500' } : null}
            onClick={() => navigate(`/business/manage/${bizId}/staff`)}
          >
            {totalStaff > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {reqs.staff.map(s => {
                  const count = biz.staff?.[s.id] || 0;
                  if (count === 0) return null;
                  return (
                    <span key={s.id} className={`text-[10px] font-medium px-2 py-1 rounded-lg
                      ${isDark ? 'bg-gray-800' : 'bg-gray-100'} ${t.text.secondary}`}>
                      {s.name}: {count}/{s.max}
                    </span>
                  );
                })}
                {reqs.staff.some(s => (biz.staff?.[s.id] || 0) === 0) && (
                  <span className="text-[10px] font-medium px-2 py-1 rounded-lg
                    bg-yellow-500/10 text-yellow-500">
                    + Hire More
                  </span>
                )}
              </div>
            ) : (
              <p className={`text-[10px] ${t.text.tertiary}`}>
                Tap to hire {reqs.staff.map(s => s.name.toLowerCase()).join(', ')}
              </p>
            )}
          </SectionCard>
        )}

        {/* ═══ VEHICLES SECTION ═══ */}
        {hasVehicles && vehicleConfig && (
          <SectionCard
            icon={Car} iconColor="text-yellow-500"
            iconBg={isDark ? 'bg-yellow-500/15' : 'bg-yellow-50'}
            title="Vehicle Fleet"
            subtitle={`${activeVehicles.length} active${retiredVehicles.length > 0 ? ` • ${retiredVehicles.length} retired` : ''}`}
            badge={activeVehicles.length > 0 ? { label: `${activeVehicles.length}`, bg: 'bg-yellow-500/15', text: 'text-yellow-500' } : null}
            onClick={() => navigate(`/business/manage/${bizId}/vehicles`)}
          >
            {activeVehicles.length > 0 ? (
              <div className="space-y-1.5">
                {activeVehicles.slice(0, 3).map(v => {
                  const pct = ((v.kmDriven || 0) / v.maxKm * 100);
                  const isLow = pct > 80;
                  const vType = vehicleConfig.types.find(vt => vt.id === v.type);
                  return (
                    <div key={v.id} className="flex items-center gap-2">
                      <span className="text-sm">{vType?.icon || '🚗'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-medium truncate ${t.text.secondary}`}>
                            {v.name}
                          </span>
                          <span className={`text-[10px] font-bold
                            ${isLow ? 'text-red-400' : 'text-green-500'}`}>
                            {formatNumber(Math.floor(v.kmDriven || 0))}/{formatNumber(v.maxKm)}km
                          </span>
                        </div>
                        <div className={`w-full h-1 rounded-full overflow-hidden mt-0.5
                          ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                          <div className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {activeVehicles.length > 3 && (
                  <p className={`text-[10px] ${t.text.tertiary}`}>
                    +{activeVehicles.length - 3} more vehicles
                  </p>
                )}
              </div>
            ) : (
              <p className={`text-[10px] ${t.text.tertiary}`}>
                Tap to buy vehicles — {vehicleConfig.types.map(v => v.name).join(', ')}
              </p>
            )}
          </SectionCard>
        )}

        {/* ═══ EQUIPMENT SECTION ═══ */}
        {hasEquipment && (
          <SectionCard
            icon={Wrench} iconColor="text-orange-500"
            iconBg={isDark ? 'bg-orange-500/15' : 'bg-orange-50'}
            title="Equipment"
            subtitle={totalEquipment > 0 ? `${totalEquipment} items owned` : 'No equipment yet'}
            badge={totalEquipment > 0 ? { label: `${totalEquipment}`, bg: 'bg-orange-500/15', text: 'text-orange-500' } : null}
            onClick={() => navigate(`/business/manage/${bizId}/equipment`)}
          >
            {totalEquipment > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {reqs.equipment.map(eq => {
                  const owned = biz.equipment?.[eq.id] || 0;
                  if (owned === 0) return null;
                  const max = eq.max || 999;
                  return (
                    <span key={eq.id} className={`text-[10px] font-medium px-2 py-1 rounded-lg
                      ${owned >= max
                        ? 'bg-green-500/10 text-green-500'
                        : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {eq.name}: {owned}{max < 999 ? `/${max}` : ''} {owned >= max ? '✓' : ''}
                    </span>
                  );
                })}
                {reqs.equipment.filter(eq => eq.required && !(biz.equipment?.[eq.id])).length > 0 && (
                  <span className="text-[10px] font-medium px-2 py-1 rounded-lg
                    bg-red-500/10 text-red-400">
                    ⚠ Missing required
                  </span>
                )}
              </div>
            ) : (
              <div>
                <p className={`text-[10px] ${t.text.tertiary}`}>
                  Tap to buy equipment
                </p>
                {reqs.equipment.filter(eq => eq.required).length > 0 && (
                  <p className="text-[10px] text-red-400 mt-0.5">
                    ⚠ {reqs.equipment.filter(eq => eq.required).length} required item(s)
                  </p>
                )}
              </div>
            )}
          </SectionCard>
        )}

        {/* ═══ INVENTORY SECTION ═══ */}
        {hasInventory && (
          <SectionCard
            icon={Package} iconColor="text-green-500"
            iconBg={isDark ? 'bg-green-500/15' : 'bg-green-50'}
            title="Inventory & Stock"
            subtitle="Manage supplies"
            onClick={() => navigate(`/business/manage/${bizId}/inventory`)}
          >
            <div className="flex flex-wrap gap-1.5">
              {reqs.inventory.map(inv => {
                const stock = biz.inventory?.[inv.id] || 0;
                const isLow = stock <= 2 && stock > 0;
                return (
                  <span key={inv.id} className={`text-[10px] font-medium px-2 py-1 rounded-lg
                    ${stock === 0
                      ? 'bg-red-500/10 text-red-400'
                      : isLow
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {inv.name}: {stock} {inv.costPerDay ? 'days' : 'units'}
                    {stock === 0 ? ' ⚠' : isLow ? ' ↓' : ''}
                  </span>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* ═══ LICENSES SECTION ═══ */}
        {hasLicenses && (
          <SectionCard
            icon={FileText} iconColor="text-emerald-500"
            iconBg={isDark ? 'bg-emerald-500/15' : 'bg-emerald-50'}
            title="Licenses & Permits"
            subtitle={`${obtainedLicenses}/${reqs.licenses.length} obtained`}
            badge={obtainedLicenses === reqs.licenses.length
              ? { label: '✓ All', bg: 'bg-green-500/15', text: 'text-green-500' }
              : reqs.licenses.some(l => l.required && !(biz.licenses?.[l.id]))
                ? { label: '⚠ Required', bg: 'bg-red-500/15', text: 'text-red-400' }
                : null
            }
            onClick={() => navigate(`/business/manage/${bizId}/licenses`)}
          >
            <div className="flex flex-wrap gap-1.5">
              {reqs.licenses.map(lic => {
                const owned = biz.licenses?.[lic.id] || false;
                return (
                  <span key={lic.id} className={`text-[10px] font-medium px-2 py-1 rounded-lg
                    ${owned
                      ? 'bg-green-500/10 text-green-500'
                      : lic.required
                        ? 'bg-red-500/10 text-red-400'
                        : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {owned ? '✓ ' : lic.required ? '✕ ' : ''}{lic.name}
                  </span>
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* ═══ PROJECTS SECTION ═══ */}
        {hasProjects && (
          <SectionCard
            icon={FolderKanban} iconColor="text-purple-500"
            iconBg={isDark ? 'bg-purple-500/15' : 'bg-purple-50'}
            title="Projects"
            subtitle={`${activeProjects.length} active${completedProjects.length > 0 ? ` • ${completedProjects.length} ready` : ''}`}
            badge={completedProjects.length > 0
              ? { label: `${completedProjects.length} Collect`, bg: 'bg-green-500/15', text: 'text-green-500' }
              : activeProjects.length > 0
                ? { label: `${activeProjects.length}/3`, bg: 'bg-purple-500/15', text: 'text-purple-500' }
                : null
            }
            onClick={() => navigate(`/business/manage/${bizId}/projects`)}
          >
            {activeProjects.length > 0 ? (
              <div className="space-y-1.5">
                {activeProjects.slice(0, 2).map(proj => {
                  const remaining = Math.max(0, Math.floor((proj.endTime - Date.now()) / 1000));
                  const total = Math.floor((proj.endTime - proj.startTime) / 1000);
                  const progress = total > 0 ? ((total - remaining) / total * 100) : 100;
                  return (
                    <div key={proj.id}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-[10px] font-medium ${t.text.secondary}`}>
                          {proj.name}
                        </span>
                        <span className="text-[10px] font-bold text-orange-400">
                          {formatTime(remaining)}
                        </span>
                      </div>
                      <div className={`w-full h-1 rounded-full overflow-hidden
                        ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                        <div className="h-full rounded-full bg-purple-500 transition-all"
                          style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={`text-[10px] ${t.text.tertiary}`}>
                {biz.categoryId === 'construction'
                  ? 'Buy resources and start construction projects'
                  : 'Hire developers and take on IT projects'}
              </p>
            )}
          </SectionCard>
        )}

        {/* ═══ BANK SETTINGS SECTION ═══ */}
        {hasBankSettings && (
          <SectionCard
            icon={Landmark} iconColor="text-cyan-500"
            iconBg={isDark ? 'bg-cyan-500/15' : 'bg-cyan-50'}
            title="Bank Settings"
            subtitle="Rates & facilities"
            onClick={() => navigate(`/business/manage/${bizId}/bizsettings`)}
          >
            <div className="flex gap-2">
              <span className={`text-[10px] font-medium px-2 py-1 rounded-lg
                ${isDark ? 'bg-gray-800' : 'bg-gray-100'} ${t.text.secondary}`}>
                Loan: {biz.bankSettings?.loanRate || BANK_SETTINGS_DEFAULTS.loanRate}%
              </span>
              <span className={`text-[10px] font-medium px-2 py-1 rounded-lg
                ${isDark ? 'bg-gray-800' : 'bg-gray-100'} ${t.text.secondary}`}>
                Savings: {biz.bankSettings?.savingsRate || BANK_SETTINGS_DEFAULTS.savingsRate}%
              </span>
              <span className={`text-[10px] font-medium px-2 py-1 rounded-lg
                ${isDark ? 'bg-gray-800' : 'bg-gray-100'} ${t.text.secondary}`}>
                {Object.values(biz.bankSettings?.facilities || {}).filter(Boolean).length} facilities
              </span>
            </div>
          </SectionCard>
        )}

        {/* ═══ EXPANSION ═══ */}
        <div className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className={`w-4 h-4 ${shades.text}`} />
            <span className={`text-sm font-bold ${t.text.primary}`}>Expansion</span>
          </div>

          {isExpanding ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className={`text-xs font-bold ${t.text.primary}`}>
                  Expansion in Progress
                </span>
              </div>
              <p className={`text-lg font-black text-center my-2 ${shades.text}`}>
                {formatTime(expansionRemaining)}
              </p>
              <p className={`text-[10px] text-center mb-3 ${t.text.tertiary}`}>Remaining Time</p>
              <button onClick={handleSkipExpansion} disabled={skipAdWatching}
                className={`w-full flex items-center justify-center gap-2
                  py-2.5 rounded-xl text-sm font-bold transition-all
                  ${skipAdWatching ? 'opacity-50' : ''}
                  bg-gradient-to-r from-purple-500 to-violet-600
                  text-white shadow-lg shadow-purple-500/20 active:scale-95`}>
                <MonitorPlay className="w-4 h-4" />
                {skipAdWatching ? 'Watching ad...' : 'Skip Expansion Time'}
              </button>
            </div>
          ) : level >= MAX_BUSINESS_LEVEL ? (
            <div className="text-center py-4">
              <p className={`text-sm font-bold ${shades.text}`}>🏆 Max Level Reached!</p>
              <p className={`text-xs ${t.text.tertiary} mt-1`}>Your business is at its peak</p>
            </div>
          ) : (
            <div>
              <div className="mb-2">
                <p className={`text-xs ${t.text.secondary}`}>Required Investment</p>
                <p className={`text-xl font-black ${t.text.primary}`}>{formatCurrency(expansionCost)}</p>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
                <div>
                  <p className="text-sm font-bold text-green-500">
                    {formatCurrency(expectedNewIncome)}/hr
                  </p>
                  <p className={`text-[9px] ${t.text.tertiary}`}>Expected Profit Growth</p>
                </div>
              </div>
              <button onClick={handleStartExpansion} disabled={!canExpand}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all
                  ${canExpand
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 active:scale-95'
                    : isDark ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}>
                Open New Outlets
              </button>
              <p className={`text-center text-[10px] mt-2 ${t.text.tertiary}`}>
                Balance: {formatCurrency(balance)}
              </p>
            </div>
          )}
        </div>
      </div>

      <AdSpace />
    </div>
  );
}

export default BusinessDetail;