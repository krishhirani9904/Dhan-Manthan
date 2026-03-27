// src/pages/business/fleet/CarPurchase.jsx
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Car, Truck, Gauge, TrendingUp,
  Plus, Minus, ShoppingCart
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import {
  getVehiclesForCategory, getFiltersForCategory,
  getDefaultFleetCapacity
} from '../../../data/fleetVehicles';
import { formatCurrency, formatNumber } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

function CarPurchase() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  const { ownedBusinesses, balance, buyFleetVehicle } = useGame();
  const biz = ownedBusinesses.find(b => b.id === bizId);

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (!biz || !biz.fleet) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const isShipping = biz.categoryId === 'shipping';
  const Icon = isShipping ? Truck : Car;

  const vehicles = getVehiclesForCategory(biz.categoryId);
  const filters = getFiltersForCategory(biz.categoryId);

  const filteredVehicles = useMemo(() => {
    if (selectedFilter === 'all') return vehicles;
    return vehicles.filter(v => v.type === selectedFilter);
  }, [vehicles, selectedFilter]);

  const fleet = biz.fleet;
  const capacity = fleet.capacity || getDefaultFleetCapacity(biz.categoryId);
  const activeVehicles = (fleet.vehicles || []).filter(v => v.active).length;
  const availableSlots = capacity - activeVehicles;

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setQuantity(1);
  };

  const handleQuantityChange = (delta) => {
    const newQty = Math.max(1, Math.min(10, Math.min(quantity + delta, availableSlots)));
    setQuantity(newQty);
  };

  const handleBuy = () => {
    if (!selectedVehicle) return;
    const totalCost = selectedVehicle.price * quantity;
    if (balance < totalCost || quantity > availableSlots) return;

    buyFleetVehicle(bizId, selectedVehicle, quantity);
    setSelectedVehicle(null);
    setQuantity(1);
  };

  const totalCost = selectedVehicle ? selectedVehicle.price * quantity : 0;
  const canBuy = selectedVehicle && balance >= totalCost && quantity <= availableSlots;

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
            <p className={`text-base font-bold ${t.text.primary}`}>Choose a {isShipping ? 'Vehicle' : 'Car'}</p>
          </div>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs ${t.text.tertiary}`}>Balance</span>
          <span className={`text-lg font-black ${t.text.brand}`}>{formatCurrency(balance)}</span>
        </div>
      </div>

      {/* Filters */}
      <div className={`flex-shrink-0 px-3 py-2 border-b ${t.border.default}`}>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
              ${selectedFilter === 'all'
                ? 'bg-yellow-500 text-white'
                : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}
          >
            All
          </button>
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                ${selectedFilter === f.id
                  ? 'bg-yellow-500 text-white'
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
        {availableSlots <= 0 && (
          <div className={`rounded-xl p-3 ${isDark ? 'bg-red-500/10' : 'bg-red-50'} border ${isDark ? 'border-red-500/20' : 'border-red-200'}`}>
            <p className="text-xs font-bold text-red-500">⚠ Fleet Full</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>Expand capacity to buy more vehicles</p>
          </div>
        )}

        {filteredVehicles.map(vehicle => {
          const isSelected = selectedVehicle?.id === vehicle.id;
          const canAfford = balance >= vehicle.price;

          return (
            <button
              key={vehicle.id}
              onClick={() => handleSelectVehicle(vehicle)}
              disabled={availableSlots <= 0}
              className={`w-full rounded-xl p-3.5 text-left transition-all active:scale-[0.98]
                ${isSelected
                  ? isDark ? 'bg-yellow-500/15 border-2 border-yellow-500' : 'bg-yellow-50 border-2 border-yellow-400'
                  : `${t.bg.card} border ${t.border.default}`
                }
                ${availableSlots <= 0 ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start gap-3">
                {/* Vehicle Image/Icon */}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl
                  ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  {vehicle.image}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name & Type */}
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-bold ${t.text.primary}`}>{vehicle.name}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded
                      ${isShipping
                        ? vehicle.type === 'city' ? 'bg-blue-500/15 text-blue-500' : 'bg-purple-500/15 text-purple-500'
                        : vehicle.type === 'economy' ? 'bg-green-500/15 text-green-500'
                          : vehicle.type === 'comfort' ? 'bg-blue-500/15 text-blue-500'
                            : vehicle.type === 'business' ? 'bg-purple-500/15 text-purple-500'
                              : vehicle.type === 'premier' ? 'bg-amber-500/15 text-amber-500'
                                : 'bg-yellow-500/15 text-yellow-600'
                      }`}>
                      {filters.find(f => f.id === vehicle.type)?.name || vehicle.type}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-blue-500" />
                      <span className={`text-[10px] ${t.text.tertiary}`}>
                        {formatNumber(vehicle.resourceKm)} km
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-[10px] text-green-500 font-medium">
                        {formatCurrency(vehicle.incomePerHour)}/hr
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <p className={`text-lg font-black mt-2 ${canAfford ? t.text.brand : 'text-red-400'}`}>
                    {formatCurrency(vehicle.price)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Purchase Panel */}
      {selectedVehicle && (
        <div className={`flex-shrink-0 px-3 py-3 ${t.bg.card} border-t ${t.border.default}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`text-[10px] ${t.text.tertiary}`}>Buying</p>
              <p className={`text-sm font-bold ${t.text.primary}`}>{selectedVehicle.name}</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className={`w-8 h-8 rounded-lg flex items-center justify-center
                  ${quantity > 1
                    ? isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                    : isDark ? 'bg-gray-900 text-gray-700' : 'bg-gray-50 text-gray-300'
                  } active:scale-90 transition-all`}
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className={`w-8 text-center text-lg font-black ${t.text.primary}`}>
                {quantity}
              </span>

              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10 || quantity >= availableSlots}
                className={`w-8 h-8 rounded-lg flex items-center justify-center
                  ${quantity < 10 && quantity < availableSlots
                    ? isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                    : isDark ? 'bg-gray-900 text-gray-700' : 'bg-gray-50 text-gray-300'
                  } active:scale-90 transition-all`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs ${t.text.secondary}`}>Total</span>
            <span className={`text-xl font-black ${canBuy ? t.text.brand : 'text-red-400'}`}>
              {formatCurrency(totalCost)}
            </span>
          </div>

          <button
            onClick={handleBuy}
            disabled={!canBuy}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
              ${canBuy
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 active:scale-95'
                : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
              }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {!canBuy && quantity > availableSlots
              ? 'Not Enough Slots'
              : !canBuy
                ? `Need ${formatCurrency(totalCost - balance)}`
                : 'Buy'
            }
          </button>
        </div>
      )}

      {!selectedVehicle && <AdSpace />}
    </div>
  );
}

export default CarPurchase;