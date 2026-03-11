// src/pages/business/management/InventoryManagement.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Package, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { INVENTORY_TYPES } from '../../../data/businessRequirements';
import { formatCurrency } from '../../../utils/formatCurrency';
import ManagementHeader from '../../../components/business/ManagementHeader';
import AdSpace from '../../../components/common/AdSpace';

function InventoryManagement() {
  const { bizId } = useParams();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedBusinesses, balance, buyInventory } = useGame();

  const biz = ownedBusinesses.find(b => b.id === bizId);
  const inventoryTypes = INVENTORY_TYPES[biz?.categoryId] || [];
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
  const getStock = (id) => biz.inventory?.[id] || 0;

  const getUnitCost = (inv) => {
    if (inv.costPerDay) return inv.costPerDay;
    if (inv.costPercent) return Math.floor(biz.cost * inv.costPercent);
    return 0;
  };

  const handleBuy = (inv) => {
    const qty = getQty(inv.id);
    const unitCost = getUnitCost(inv);
    const totalCost = unitCost * qty;
    if (balance < totalCost) return;
    buyInventory(bizId, inv.id, qty, totalCost);
    setQty(inv.id, 1);
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <ManagementHeader
        bizId={bizId}
        title="Inventory & Stock"
        subtitle="Manage your supplies"
        icon={ShoppingCart} iconColor="text-green-500"
      />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
        <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-[10px] ${t.text.tertiary}`}>Available Balance</p>
          <p className={`text-xl font-black ${t.text.brand}`}>{formatCurrency(balance)}</p>
        </div>

        {inventoryTypes.map(inv => {
          const stock = getStock(inv.id);
          const unitCost = getUnitCost(inv);
          const qty = getQty(inv.id);
          const totalCost = unitCost * qty;
          const canBuy = balance >= totalCost;
          const isLow = stock <= 2 && stock > 0;

          return (
            <div key={inv.id}
              className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${isDark ? 'bg-green-500/15' : 'bg-green-50'}`}>
                    <Package className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${t.text.primary}`}>
                      {inv.name}
                      {inv.required && (
                        <span className="text-red-400 text-[9px] ml-1">REQUIRED</span>
                      )}
                    </p>
                    <p className={`text-[10px] ${t.text.tertiary}`}>
                      {inv.costPerDay
                        ? `${formatCurrency(inv.costPerDay)} per day supply`
                        : `${(inv.costPercent * 100).toFixed(0)}% of capital = ${formatCurrency(unitCost)}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-between mb-3 px-3 py-2 rounded-lg
                ${stock === 0
                  ? isDark ? 'bg-red-500/10' : 'bg-red-50'
                  : isLow
                    ? isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'
                    : isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex items-center gap-1.5">
                  {(isLow || stock === 0) && <AlertTriangle className={`w-3 h-3 ${stock === 0 ? 'text-red-400' : 'text-yellow-500'}`} />}
                  <span className={`text-xs ${stock === 0 ? 'text-red-400' : isLow ? 'text-yellow-500' : t.text.secondary}`}>
                    Current Stock
                  </span>
                </div>
                <span className={`text-sm font-bold ${t.text.primary}`}>
                  {stock} {inv.costPerDay ? 'days' : 'units'}
                </span>
              </div>

              {inv.description && (
                <p className={`text-[10px] mb-3 ${t.text.tertiary}`}>{inv.description}</p>
              )}

              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs ${t.text.secondary}`}>Buy:</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setQty(inv.id, qty - 1)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center
                      ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
                      active:scale-90 transition-all`}>
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input type="number" value={qty}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      if (!isNaN(v) && v >= 1) setQty(inv.id, v);
                    }}
                    className={`w-16 h-8 rounded-lg text-center text-sm font-bold
                      outline-none border transition-colors
                      ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:border-green-500'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-green-500'}`}
                  />
                  <button onClick={() => setQty(inv.id, qty + 1)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center
                      ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
                      active:scale-90 transition-all`}>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button onClick={() => handleBuy(inv)} disabled={!canBuy}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all
                  ${canBuy
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20 active:scale-95'
                    : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
                Buy {qty} — {formatCurrency(totalCost)}
              </button>
            </div>
          );
        })}
      </div>

      <AdSpace />
    </div>
  );
}

export default InventoryManagement;