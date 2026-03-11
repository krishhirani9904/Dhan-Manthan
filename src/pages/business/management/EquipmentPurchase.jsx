// src/pages/business/management/EquipmentPurchase.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Wrench, Plus, Minus, TrendingUp, Check } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { EQUIPMENT_TYPES } from '../../../data/businessRequirements';
import { formatCurrency } from '../../../utils/formatCurrency';
import ManagementHeader from '../../../components/business/ManagementHeader';
import AdSpace from '../../../components/common/AdSpace';

function EquipmentPurchase() {
  const { bizId } = useParams();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedBusinesses, balance, buyEquipment } = useGame();

  const biz = ownedBusinesses.find(b => b.id === bizId);
  const equipmentTypes = EQUIPMENT_TYPES[biz?.categoryId] || [];
  const [quantities, setQuantities] = useState({});

  if (!biz) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const getQty = (id) => quantities[id] || 1;
  const setQty = (id, val) => setQuantities(prev => ({ ...prev, [id]: Math.max(1, val) }));
  const getOwned = (id) => biz.equipment?.[id] || 0;

  const handleBuy = (equip) => {
    const qty = getQty(equip.id);
    const cost = qty * equip.cost;
    const owned = getOwned(equip.id);
    const maxBuyable = (equip.max || 999) - owned;
    if (balance < cost || qty > maxBuyable) return;
    buyEquipment(bizId, equip.id, qty, cost);
    setQty(equip.id, 1);
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <ManagementHeader
        bizId={bizId}
        title="Equipment"
        subtitle={`${Object.values(biz.equipment || {}).reduce((a, b) => a + b, 0)} total items`}
        icon={Wrench} iconColor="text-orange-500"
      />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
        <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-[10px] ${t.text.tertiary}`}>Available Balance</p>
          <p className={`text-xl font-black ${t.text.brand}`}>{formatCurrency(balance)}</p>
        </div>

        {equipmentTypes.map(equip => {
          const owned = getOwned(equip.id);
          const maxTotal = equip.max || 999;
          const maxBuyable = maxTotal - owned;
          const isMaxed = owned >= maxTotal;
          const qty = getQty(equip.id);
          const totalCost = qty * equip.cost;
          const canBuy = balance >= totalCost && !isMaxed && owned + qty <= maxTotal;

          return (
            <div key={equip.id}
              className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${isDark ? 'bg-orange-500/15' : 'bg-orange-50'}`}>
                    <Wrench className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${t.text.primary}`}>
                      {equip.name}
                      {equip.required && (
                        <span className="text-red-400 text-[9px] ml-1">REQUIRED</span>
                      )}
                    </p>
                    <p className={`text-[10px] ${t.text.tertiary}`}>
                      {formatCurrency(equip.cost)} each
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${t.text.primary}`}>
                    {owned}{maxTotal < 999 ? `/${maxTotal}` : ''}
                  </p>
                  <p className={`text-[10px] ${t.text.tertiary}`}>Owned</p>
                </div>
              </div>

              <div className={`flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg
                ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-[10px] font-medium text-green-500">
                  +{equip.incomeBoost}% income per unit
                </span>
              </div>

              {isMaxed ? (
                <div className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                  ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className={`text-xs font-medium ${t.text.tertiary}`}>Fully equipped</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs ${t.text.secondary}`}>Quantity:</span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setQty(equip.id, qty - 1)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center
                          ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
                          active:scale-90 transition-all`}>
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input type="number" value={qty}
                        onChange={(e) => {
                          const v = parseInt(e.target.value);
                          if (!isNaN(v) && v >= 1) setQty(equip.id, Math.min(v, maxBuyable));
                        }}
                        className={`w-16 h-8 rounded-lg text-center text-sm font-bold
                          outline-none border transition-colors
                          ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500'
                            : 'bg-white border-gray-200 text-gray-900 focus:border-orange-500'}`}
                      />
                      <button onClick={() => setQty(equip.id, Math.min(qty + 1, maxBuyable))}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center
                          ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
                          active:scale-90 transition-all`}>
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button onClick={() => handleBuy(equip)} disabled={!canBuy}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all
                      ${canBuy
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 active:scale-95'
                        : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                      }`}>
                    Buy {qty}x — {formatCurrency(totalCost)}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      <AdSpace />
    </div>
  );
}

export default EquipmentPurchase;