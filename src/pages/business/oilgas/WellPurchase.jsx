// src/pages/business/oilgas/WellPurchase.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Droplets, Flame, TrendingUp,
  Clock, AlertTriangle, ShoppingCart
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { WELL_TYPES } from '../../../data/oilGasData';
import { formatCurrency, formatNumber } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

function WellPurchase() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  const { ownedBusinesses, balance, buyWell } = useGame();
  const biz = ownedBusinesses.find(b => b.id === bizId);

  const [fuelTab, setFuelTab] = useState('oil');

  if (!biz || !biz.oilgas) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const oilgas = biz.oilgas;
  const oilWells = (oilgas.wells?.oil || []);
  const gasWells = (oilgas.wells?.gas || []);
  const activeOilWells = oilWells.filter(w => w.active);
  const activeGasWells = gasWells.filter(w => w.active);
  const retiredOilWells = oilWells.filter(w => !w.active);
  const retiredGasWells = gasWells.filter(w => !w.active);

  const wellTypes = WELL_TYPES[fuelTab] || [];

  const handleBuy = (wellDef) => {
    if (balance < wellDef.cost) return;
    buyWell(bizId, fuelTab, wellDef);
  };

  const activeWells = fuelTab === 'oil' ? activeOilWells : activeGasWells;
  const retiredWells = fuelTab === 'oil' ? retiredOilWells : retiredGasWells;

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex-shrink-0 px-4 pt-3 pb-3 ${t.bg.card} border-b ${t.border.default}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/business/oilgas/${bizId}`)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <p className={`text-base font-bold ${t.text.primary}`}>Wells & Production</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>
              {activeOilWells.length} oil • {activeGasWells.length} gas wells active
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs ${t.text.tertiary}`}>Balance</span>
          <span className={`text-lg font-black ${t.text.brand}`}>{formatCurrency(balance)}</span>
        </div>
      </div>

      {/* Oil / Gas Tabs */}
      <div className={`flex-shrink-0 px-3 py-2 border-b ${t.border.default}`}>
        <div className="flex gap-2">
          <button onClick={() => setFuelTab('oil')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all
              ${fuelTab === 'oil'
                ? 'bg-amber-500 text-white'
                : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}>
            <Droplets className="w-4 h-4" />
            Oil Wells
          </button>
          <button onClick={() => setFuelTab('gas')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all
              ${fuelTab === 'gas'
                ? 'bg-blue-500 text-white'
                : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}>
            <Flame className="w-4 h-4" />
            Gas Wells
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">

        {/* Add New Well */}
        <div>
          <p className={`text-xs font-bold mb-2 ${t.text.secondary}`}>
            Add New {fuelTab === 'oil' ? 'Oil' : 'Gas'} Well
          </p>
          <div className="space-y-2.5">
            {wellTypes.map(well => {
              const canAfford = balance >= well.cost;
              const isOil = fuelTab === 'oil';

              return (
                <div key={well.id}
                  className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{well.image}</span>
                      <div>
                        <p className={`text-sm font-bold ${t.text.primary}`}>{well.name}</p>
                        <p className={`text-xl font-black ${canAfford ? t.text.brand : 'text-red-400'}`}>
                          {formatCurrency(well.cost)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                      ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-[10px] font-bold text-green-500">
                        {formatNumber(well.productionPerDay)} {well.unit}/day
                      </span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                      ${isDark ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span className="text-[10px] font-bold text-orange-500">
                        {well.maxLifespan} days lifespan
                      </span>
                    </div>
                  </div>

                  <button onClick={() => handleBuy(well)} disabled={!canAfford}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all
                      ${canAfford
                        ? `bg-gradient-to-r ${isOil ? 'from-amber-500 to-orange-500' : 'from-blue-500 to-cyan-500'} text-white shadow-lg active:scale-95`
                        : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                      }`}>
                    <ShoppingCart className="w-4 h-4" />
                    {canAfford ? `Purchase Well` : `Need ${formatCurrency(well.cost - balance)}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Wells */}
        {activeWells.length > 0 && (
          <div>
            <p className={`text-xs font-bold mb-2 ${t.text.secondary}`}>
              Active Wells ({activeWells.length})
            </p>
            <div className="space-y-2">
              {activeWells.map(well => {
                const lifespanPercent = (well.daysActive / well.maxLifespan) * 100;
                const isOld = lifespanPercent > 80;

                return (
                  <div key={well.id}
                    className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}
                      ${isOld ? (isDark ? 'border-orange-500/20' : 'border-orange-200') : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{well.image}</span>
                        <div>
                          <p className={`text-xs font-bold ${t.text.primary}`}>{well.name}</p>
                          <p className={`text-[10px] ${t.text.tertiary}`}>
                            {formatNumber(well.productionPerDay)} {well.unit}/day
                          </p>
                        </div>
                      </div>
                      {isOld && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/15">
                          <AlertTriangle className="w-3 h-3 text-orange-500" />
                          <span className="text-[9px] font-bold text-orange-500">Aging</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] ${t.text.tertiary}`}>
                        Day {Math.floor(well.daysActive)} of {well.maxLifespan}
                      </span>
                      <span className={`text-[10px] font-bold ${isOld ? 'text-orange-500' : 'text-green-500'}`}>
                        {lifespanPercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                      <div className={`h-full rounded-full transition-all ${isOld ? 'bg-orange-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(100, lifespanPercent)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Retired Wells */}
        {retiredWells.length > 0 && (
          <div>
            <p className={`text-xs font-bold mb-2 ${t.text.secondary}`}>
              Depleted Wells ({retiredWells.length})
            </p>
            <div className="space-y-1.5">
              {retiredWells.map(well => (
                <div key={well.id}
                  className={`rounded-lg p-2.5 opacity-50 ${t.bg.card} border ${t.border.default}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{well.image}</span>
                    <div>
                      <p className={`text-xs font-medium ${t.text.primary}`}>{well.name}</p>
                      <p className={`text-[10px] ${t.text.tertiary}`}>
                        {well.maxLifespan} days completed • Depleted
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

export default WellPurchase;