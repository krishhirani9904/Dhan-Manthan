// src/pages/business/fleet/CarFleetList.jsx
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Car, Truck, Gauge, TrendingUp,
  AlertTriangle, Trash2, Filter
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import {
  getFiltersForCategory, sortFleetVehicles,
  FLEET_SORT_OPTIONS
} from '../../../data/fleetVehicles';
import { formatCurrency, formatNumber } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

function CarFleetList() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  const { ownedBusinesses } = useGame();
  const biz = ownedBusinesses.find(b => b.id === bizId);

  const [sortBy, setSortBy] = useState('highest_income');
  const [typeFilter, setTypeFilter] = useState('all');

  if (!biz || !biz.fleet) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const isShipping = biz.categoryId === 'shipping';
  const Icon = isShipping ? Truck : Car;
  const typeFilters = getFiltersForCategory(biz.categoryId);

  const fleet = biz.fleet;
  const allVehicles = fleet.vehicles || [];
  const activeVehicles = allVehicles.filter(v => v.active);
  const retiredVehicles = allVehicles.filter(v => !v.active);

  // Filter and sort
  const filteredAndSorted = useMemo(() => {
    let result = [...activeVehicles];

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(v => v.type === typeFilter);
    }

    // Sort
    result = sortFleetVehicles(result, sortBy, biz.categoryId);

    return result;
  }, [activeVehicles, typeFilter, sortBy, biz.categoryId]);

  const totalIncome = activeVehicles.reduce((sum, v) => sum + (v.incomePerHour || 0), 0);

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex-shrink-0 px-4 pt-3 pb-3 ${t.bg.card} border-b ${t.border.default}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/business/fleet/${bizId}`)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <p className={`text-base font-bold ${t.text.primary}`}>Car Fleet</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>
              {activeVehicles.length} active • {formatCurrency(totalIncome)}/hr total
            </p>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className={`flex-shrink-0 px-3 py-2 border-b ${t.border.default}`}>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {FLEET_SORT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap
                ${sortBy === opt.id
                  ? 'bg-yellow-500 text-white'
                  : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filters */}
      <div className={`flex-shrink-0 px-3 py-2 border-b ${t.border.default}`}>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setTypeFilter('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all
              ${typeFilter === 'all'
                ? 'bg-blue-500 text-white'
                : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}
          >
            All Types
          </button>
          {typeFilters.map(f => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap
                ${typeFilter === f.id
                  ? 'bg-blue-500 text-white'
                  : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle List */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-2.5">
        {activeVehicles.length === 0 ? (
          <div className={`flex-1 flex items-center justify-center rounded-xl border border-dashed ${t.border.default} py-12`}>
            <div className="text-center">
              <Icon className={`w-10 h-10 mx-auto mb-3 ${t.text.tertiary}`} />
              <p className={`text-sm font-medium ${t.text.secondary}`}>No vehicles yet</p>
              <p className={`text-xs mt-1 ${t.text.tertiary}`}>Buy cars to start earning</p>
              <button
                onClick={() => navigate(`/business/fleet/${bizId}/buy`)}
                className="mt-4 px-4 py-2 rounded-xl text-sm font-bold bg-yellow-500 text-white active:scale-95"
              >
                Buy Your First Car
              </button>
            </div>
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className={`text-center py-8 ${t.text.tertiary}`}>
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No vehicles match this filter</p>
          </div>
        ) : (
          filteredAndSorted.map(vehicle => {
            const kmPercent = ((vehicle.kmDriven || 0) / vehicle.resourceKm) * 100;
            const isLowLife = kmPercent > 80;
            const isCritical = kmPercent > 95;

            return (
              <div
                key={vehicle.id}
                className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}
                  ${isCritical ? (isDark ? 'border-red-500/30' : 'border-red-200') : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Vehicle Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                    ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {vehicle.image || '🚗'}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name & Type */}
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-bold ${t.text.primary}`}>{vehicle.name}</p>
                      {isLowLife && (
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded
                          ${isCritical ? 'bg-red-500/15' : 'bg-orange-500/15'}`}>
                          <AlertTriangle className={`w-3 h-3 ${isCritical ? 'text-red-500' : 'text-orange-500'}`} />
                          <span className={`text-[9px] font-bold ${isCritical ? 'text-red-500' : 'text-orange-500'}`}>
                            {isCritical ? 'Critical' : 'Low Life'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Income */}
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-bold text-green-500">
                        {formatCurrency(vehicle.incomePerHour)}
                      </span>
                      <span className={`text-[10px] ${t.text.tertiary}`}>per hour</span>
                    </div>

                    {/* Type Badge */}
                    <span className={`inline-block mt-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded
                      ${isShipping
                        ? vehicle.type === 'city' ? 'bg-blue-500/15 text-blue-500' : 'bg-purple-500/15 text-purple-500'
                        : vehicle.type === 'economy' ? 'bg-green-500/15 text-green-500'
                          : vehicle.type === 'comfort' ? 'bg-blue-500/15 text-blue-500'
                            : vehicle.type === 'comfort_plus' ? 'bg-cyan-500/15 text-cyan-500'
                              : vehicle.type === 'business' ? 'bg-purple-500/15 text-purple-500'
                                : vehicle.type === 'premier' ? 'bg-amber-500/15 text-amber-500'
                                  : 'bg-yellow-500/15 text-yellow-600'
                      }`}>
                      {typeFilters.find(f => f.id === vehicle.type)?.name || vehicle.type}
                    </span>

                    {/* KM Progress */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] ${t.text.tertiary}`}>
                          {formatNumber(Math.floor(vehicle.kmDriven || 0))} of {formatNumber(vehicle.resourceKm)} km
                        </span>
                      </div>
                      <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-300
                            ${isCritical ? 'bg-red-500' : isLowLife ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(100, kmPercent)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Retired Vehicles Section */}
        {retiredVehicles.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className={`text-xs font-bold ${t.text.secondary}`}>
                Retired Vehicles ({retiredVehicles.length})
              </p>
            </div>

            <div className="space-y-2">
              {retiredVehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  className={`rounded-xl p-3 opacity-50 ${t.bg.card} border ${t.border.default}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{vehicle.image || '🚗'}</span>
                    <div className="flex-1">
                      <p className={`text-xs font-medium ${t.text.primary}`}>{vehicle.name}</p>
                      <p className={`text-[10px] ${t.text.tertiary}`}>
                        {formatNumber(vehicle.resourceKm)} km done • Retired
                      </p>
                    </div>
                    <Trash2 className={`w-4 h-4 ${t.text.tertiary}`} />
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

export default CarFleetList;