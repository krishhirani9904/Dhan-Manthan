// src/pages/business/management/StaffHiring.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Plus, Minus, UserMinus, TrendingUp } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { STAFF_TYPES } from '../../../data/businessRequirements';
import { formatCurrency } from '../../../utils/formatCurrency';
import ManagementHeader from '../../../components/business/ManagementHeader';
import AdSpace from '../../../components/common/AdSpace';

function StaffHiring() {
  const { bizId } = useParams();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedBusinesses, balance, hireStaff, fireStaff } = useGame();

  const biz = ownedBusinesses.find(b => b.id === bizId);
  const staffTypes = STAFF_TYPES[biz?.categoryId] || [];
  const [quantities, setQuantities] = useState({});

  if (!biz) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Business not found</p>
      </div>
    );
  }

  const getQty = (id) => quantities[id] || 1;
  const setQty = (id, val) => setQuantities(prev => ({ ...prev, [id]: Math.max(1, val) }));
  const getCurrentCount = (staffId) => biz.staff?.[staffId] || 0;

  const handleHire = (staffType) => {
    const qty = getQty(staffType.id);
    const cost = qty * staffType.costPer;
    const currentCount = getCurrentCount(staffType.id);
    if (balance < cost || currentCount + qty > staffType.max) return;
    hireStaff(bizId, staffType.id, qty, cost);
    setQty(staffType.id, 1);
  };

  const handleFire = (staffId) => {
    if (getCurrentCount(staffId) <= 0) return;
    fireStaff(bizId, staffId, 1);
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <ManagementHeader
        bizId={bizId}
        title="Staff & Employees"
        subtitle={`${Object.values(biz.staff || {}).reduce((a, b) => a + b, 0)} total hired`}
        icon={Users} iconColor="text-blue-500"
      />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
        <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-[10px] ${t.text.tertiary}`}>Available Balance</p>
          <p className={`text-xl font-black ${t.text.brand}`}>{formatCurrency(balance)}</p>
        </div>

        {staffTypes.map(staff => {
          const current = getCurrentCount(staff.id);
          const qty = getQty(staff.id);
          const maxHirable = staff.max - current;
          const totalCost = qty * staff.costPer;
          const canAfford = balance >= totalCost;
          const canHire = current + qty <= staff.max && canAfford;
          const isMaxed = current >= staff.max;

          return (
            <div key={staff.id}
              className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${isDark ? 'bg-blue-500/15' : 'bg-blue-50'}`}>
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${t.text.primary}`}>{staff.name}</p>
                    <p className={`text-[10px] ${t.text.tertiary}`}>
                      {formatCurrency(staff.costPer)} / person
                      {staff.required && <span className="text-red-400 ml-1">• Required</span>}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${t.text.primary}`}>{current}/{staff.max}</p>
                  <p className={`text-[10px] ${t.text.tertiary}`}>Hired</p>
                </div>
              </div>

              <div className={`flex items-center gap-1.5 mb-3 px-2.5 py-1.5 rounded-lg
                ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-[10px] font-medium text-green-500">
                  +{staff.incomeBoost}% income per hire
                </span>
                {staff.perVehicle && (
                  <span className={`text-[10px] ml-1 ${t.text.tertiary}`}>
                    ({staff.perVehicleCount || 1} per vehicle)
                  </span>
                )}
              </div>

              {!isMaxed ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs ${t.text.secondary}`}>Hire:</span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setQty(staff.id, qty - 1)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center
                          ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
                          active:scale-90 transition-all`}>
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input type="number" value={qty}
                        onChange={(e) => {
                          const v = parseInt(e.target.value);
                          if (!isNaN(v) && v >= 1) setQty(staff.id, Math.min(v, maxHirable));
                        }}
                        className={`w-16 h-8 rounded-lg text-center text-sm font-bold
                          outline-none border transition-colors
                          ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                            : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'}`}
                      />
                      <button onClick={() => setQty(staff.id, Math.min(qty + 1, maxHirable))}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center
                          ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
                          active:scale-90 transition-all`}>
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button onClick={() => handleHire(staff)} disabled={!canHire}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all
                      ${canHire
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95'
                        : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                      }`}>
                    Hire {qty} {staff.name}{qty > 1 ? 's' : ''} — {formatCurrency(totalCost)}
                  </button>
                </>
              ) : (
                <div className={`text-center py-2 rounded-xl
                  ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <p className={`text-xs font-medium ${t.text.tertiary}`}>Maximum reached</p>
                </div>
              )}

              {current > 0 && (
                <button onClick={() => handleFire(staff.id)}
                  className={`w-full mt-2 flex items-center justify-center gap-1.5
                    py-2 rounded-xl text-xs font-medium transition-all border active:scale-95
                    ${isDark
                      ? 'border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/15'
                      : 'border-red-200 text-red-500 bg-red-50 hover:bg-red-100'}`}>
                  <UserMinus className="w-3.5 h-3.5" />
                  Fire 1 {staff.name}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <AdSpace />
    </div>
  );
}

export default StaffHiring;   