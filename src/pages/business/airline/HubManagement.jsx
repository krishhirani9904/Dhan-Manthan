// src/pages/business/airline/HubManagement.jsx
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, Check, Lock, Plane, MapPin
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { AIRLINE_HUBS } from '../../../data/airlineData';
import { formatCurrency } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

function HubManagement() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  const { ownedBusinesses, balance, buyAirlineHub } = useGame();
  const biz = ownedBusinesses.find(b => b.id === bizId);

  if (!biz || !biz.airline) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const ownedLicenses = biz.airline.licenses || [];
  const ownedHubs = biz.airline.hubs || [];
  const ownedHubIds = ownedHubs.map(h => h.hubId);
  const totalCapacity = ownedHubs.reduce((s, h) => s + (h.capacity || 0), 0);

  // Group hubs by country
  const hubsByCountry = {};
  AIRLINE_HUBS.forEach(hub => {
    if (!hubsByCountry[hub.country]) {
      hubsByCountry[hub.country] = {
        country: hub.country,
        countryName: hub.countryName,
        flag: hub.flag,
        licensed: ownedLicenses.includes(hub.country),
        hubs: [],
      };
    }
    hubsByCountry[hub.country].hubs.push(hub);
  });

  const handleBuy = (hubDef) => {
    if (ownedHubIds.includes(hubDef.id) || balance < hubDef.cost) return;
    if (!ownedLicenses.includes(hubDef.country)) return;
    buyAirlineHub(bizId, hubDef);
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex-shrink-0 px-4 pt-3 pb-3 ${t.bg.card} border-b ${t.border.default}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/business/airline/${bizId}`)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <p className={`text-base font-bold ${t.text.primary}`}>Airport Hubs</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>
              {ownedHubs.length} hubs • {totalCapacity} aircraft capacity
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs ${t.text.tertiary}`}>Balance</span>
          <span className={`text-lg font-black ${t.text.brand}`}>{formatCurrency(balance)}</span>
        </div>
      </div>

      {/* Hub List */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
        {ownedLicenses.length === 0 && (
          <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'} border ${isDark ? 'border-red-500/20' : 'border-red-200'}`}>
            <Lock className={`w-8 h-8 mx-auto mb-2 ${t.text.tertiary}`} />
            <p className="text-sm font-bold text-red-500">No Country Licenses</p>
            <p className={`text-[10px] ${t.text.tertiary} mt-1`}>Buy a country license first to access hubs</p>
          </div>
        )}

        {Object.values(hubsByCountry).map(group => (
          <div key={group.country}>
            {/* Country Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{group.flag}</span>
              <p className={`text-xs font-bold ${t.text.primary}`}>{group.countryName}</p>
              {!group.licensed && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-400">
                  <Lock className="w-2.5 h-2.5 inline mr-0.5" />LOCKED
                </span>
              )}
              {group.licensed && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-500/15 text-green-500">
                  LICENSED
                </span>
              )}
            </div>

            <div className="space-y-2 mb-3">
              {group.hubs.map(hub => {
                const owned = ownedHubIds.includes(hub.id);
                const canBuy = group.licensed && !owned && balance >= hub.cost;

                return (
                  <div key={hub.id}
                    className={`rounded-xl p-3.5 ${t.bg.card} border
                      ${owned ? (isDark ? 'border-green-500/30' : 'border-green-200') :
                        !group.licensed ? (isDark ? 'border-gray-800' : 'border-gray-200') : t.border.default}
                      ${!group.licensed ? 'opacity-50' : ''}`}>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className={`w-4 h-4 ${owned ? 'text-green-500' : 'text-purple-500'}`} />
                        <div>
                          <p className={`text-sm font-bold ${t.text.primary}`}>{hub.name}</p>
                          <p className={`text-[10px] ${t.text.tertiary}`}>
                            Capacity: {hub.capacity} aircraft
                          </p>
                        </div>
                      </div>
                      {owned && <Check className="w-5 h-5 text-green-500" />}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                        <Plane className="w-3 h-3 text-purple-500" />
                        <span className="text-[10px] font-bold text-purple-500">{hub.capacity} slots</span>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
                        <MapPin className="w-3 h-3 text-orange-500" />
                        <span className="text-[10px] font-bold text-orange-500">
                          {formatCurrency(hub.maintenanceCost)}/mo
                        </span>
                      </div>
                    </div>

                    {!owned && (
                      <button onClick={() => handleBuy(hub)} disabled={!canBuy}
                        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all
                          ${canBuy
                            ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/20 active:scale-95'
                            : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                          }`}>
                        {!group.licensed ? 'License Required' :
                          canBuy ? `Buy Hub — ${formatCurrency(hub.cost)}` :
                          `Need ${formatCurrency(hub.cost - balance)} more`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <AdSpace />
    </div>
  );
}

export default HubManagement;