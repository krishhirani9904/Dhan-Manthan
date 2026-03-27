// src/pages/business/airline/AircraftPurchase.jsx
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plane, Users, Gauge, TrendingUp,
  MapPin, Wrench, ShoppingCart, Lock
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import {
  AIRCRAFT_TYPES, AIRCRAFT_TYPE_FILTERS,
  getAllAircraft
} from '../../../data/airlineData';
import { formatCurrency, formatNumber } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

function AircraftPurchase() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  const { ownedBusinesses, balance, buyAirlineAircraft } = useGame();
  const biz = ownedBusinesses.find(b => b.id === bizId);

  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedAircraft, setSelectedAircraft] = useState(null);

  if (!biz || !biz.airline) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const airline = biz.airline;
  const totalHubCapacity = (airline.hubs || []).reduce((s, h) => s + (h.capacity || 0), 0);
  const currentAircraftCount = (airline.aircraft || []).filter(a => a.active).length;
  const availableSlots = totalHubCapacity - currentAircraftCount;
  const hasHubs = (airline.hubs || []).length > 0;

  const allAircraft = getAllAircraft();

  const filteredAircraft = useMemo(() => {
    if (typeFilter === 'all') return allAircraft;
    return allAircraft.filter(a => a.type === typeFilter);
  }, [allAircraft, typeFilter]);

  const handleSelect = (aircraft) => {
    setSelectedAircraft(aircraft);
  };

  const handleBuy = () => {
    if (!selectedAircraft || balance < selectedAircraft.price || availableSlots <= 0) return;
    buyAirlineAircraft(bizId, selectedAircraft);
    setSelectedAircraft(null);
  };

  const canBuy = selectedAircraft && balance >= selectedAircraft.price && availableSlots > 0;

  const getTypeColor = (type) => {
    switch (type) {
      case 'small': return { bg: 'bg-green-500/15', text: 'text-green-500' };
      case 'medium': return { bg: 'bg-blue-500/15', text: 'text-blue-500' };
      case 'large': return { bg: 'bg-purple-500/15', text: 'text-purple-500' };
      case 'extra_large': return { bg: 'bg-amber-500/15', text: 'text-amber-500' };
      default: return { bg: 'bg-gray-500/15', text: 'text-gray-500' };
    }
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
            <p className={`text-base font-bold ${t.text.primary}`}>Purchase Aircraft</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>
              {currentAircraftCount}/{totalHubCapacity} aircraft • {availableSlots} slots available
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs ${t.text.tertiary}`}>Balance</span>
          <span className={`text-lg font-black ${t.text.brand}`}>{formatCurrency(balance)}</span>
        </div>
      </div>

      {/* Type Filters */}
      <div className={`flex-shrink-0 px-3 py-2 border-b ${t.border.default}`}>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button onClick={() => setTypeFilter('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
              ${typeFilter === 'all'
                ? 'bg-sky-500 text-white'
                : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}>
            All
          </button>
          {AIRCRAFT_TYPE_FILTERS.map(f => (
            <button key={f.id} onClick={() => setTypeFilter(f.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                ${typeFilter === f.id
                  ? 'bg-sky-500 text-white'
                  : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}>
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Aircraft List */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-2.5">
        {!hasHubs && (
          <div className={`rounded-xl p-4 text-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}
            border ${isDark ? 'border-red-500/20' : 'border-red-200'}`}>
            <Lock className={`w-8 h-8 mx-auto mb-2 ${t.text.tertiary}`} />
            <p className="text-sm font-bold text-red-500">No Hubs Available</p>
            <p className={`text-[10px] ${t.text.tertiary} mt-1`}>Buy a hub first to park aircraft</p>
          </div>
        )}

        {availableSlots <= 0 && hasHubs && (
          <div className={`rounded-xl p-3 ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'}
            border ${isDark ? 'border-orange-500/20' : 'border-orange-200'}`}>
            <p className="text-xs font-bold text-orange-500">⚠ Hub Capacity Full</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>Buy more hubs to add aircraft</p>
          </div>
        )}

        {filteredAircraft.map(aircraft => {
          const isSelected = selectedAircraft?.id === aircraft.id;
          const canAfford = balance >= aircraft.price;
          const typeColor = getTypeColor(aircraft.type);
          const typeName = AIRCRAFT_TYPE_FILTERS.find(f => f.id === aircraft.type)?.name || aircraft.type;

          return (
            <button key={aircraft.id}
              onClick={() => handleSelect(aircraft)}
              disabled={!hasHubs || availableSlots <= 0}
              className={`w-full rounded-xl p-3.5 text-left transition-all active:scale-[0.98]
                ${isSelected
                  ? isDark ? 'bg-sky-500/15 border-2 border-sky-500' : 'bg-sky-50 border-2 border-sky-400'
                  : `${t.bg.card} border ${t.border.default}`
                }
                ${(!hasHubs || availableSlots <= 0) ? 'opacity-50' : ''}`}>

              <div className="flex items-start gap-3">
                {/* Aircraft Icon */}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl
                  ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  {aircraft.image}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name & Type */}
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-bold ${t.text.primary}`}>{aircraft.name}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${typeColor.bg} ${typeColor.text}`}>
                      {typeName}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-500" />
                      <span className={`text-[10px] ${t.text.tertiary}`}>{aircraft.capacity} seats</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-500" />
                      <span className={`text-[10px] ${t.text.tertiary}`}>{aircraft.range}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-[10px] text-green-500 font-medium">
                        {formatCurrency(aircraft.incomePerHour)}/hr
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-orange-500" />
                      <span className={`text-[10px] ${t.text.tertiary}`}>
                        {formatCurrency(aircraft.maintenanceCost)}/mo
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <p className={`text-lg font-black mt-2 ${canAfford ? t.text.brand : 'text-red-400'}`}>
                    {formatCurrency(aircraft.price)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Purchase Panel */}
      {selectedAircraft && (
        <div className={`flex-shrink-0 px-3 py-3 ${t.bg.card} border-t ${t.border.default}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`text-[10px] ${t.text.tertiary}`}>Selected Aircraft</p>
              <p className={`text-sm font-bold ${t.text.primary}`}>{selectedAircraft.name}</p>
              <p className={`text-[10px] ${t.text.tertiary}`}>
                {selectedAircraft.capacity} seats • {selectedAircraft.range}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-[10px] ${t.text.tertiary}`}>Price</p>
              <p className={`text-xl font-black ${canBuy ? t.text.brand : 'text-red-400'}`}>
                {formatCurrency(selectedAircraft.price)}
              </p>
            </div>
          </div>

          <button onClick={handleBuy} disabled={!canBuy}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
              ${canBuy
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20 active:scale-95'
                : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
              }`}>
            <ShoppingCart className="w-5 h-5" />
            {availableSlots <= 0 ? 'No Hub Space' :
              !canBuy ? `Need ${formatCurrency(selectedAircraft.price - balance)}` :
              'Purchase Aircraft'}
          </button>
        </div>
      )}

      {!selectedAircraft && <AdSpace />}
    </div>
  );
}

export default AircraftPurchase;