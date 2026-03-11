// src/pages/business/management/BranchManagement.jsx
import { useParams } from 'react-router-dom';
import { Building2, Plus, MapPin } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { EQUIPMENT_TYPES } from '../../../data/businessRequirements';
import { formatCurrency } from '../../../utils/formatCurrency';
import ManagementHeader from '../../../components/business/ManagementHeader';
import AdSpace from '../../../components/common/AdSpace';

function BranchManagement() {
  const { bizId } = useParams();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedBusinesses, balance, buyEquipment } = useGame();

  const biz = ownedBusinesses.find(b => b.id === bizId);

  if (!biz) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const equipmentTypes = EQUIPMENT_TYPES[biz.categoryId] || [];
  const branchEquip = equipmentTypes.filter(e =>
    ['branch', 'rooms', 'emergency', 'surgery', 'icu'].includes(e.id)
  );

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <ManagementHeader
        bizId={bizId}
        title="Branches & Facilities"
        subtitle="Expand your reach"
        icon={Building2}
        iconColor="text-indigo-500"
      />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
        <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-[10px] ${t.text.tertiary}`}>Available Balance</p>
          <p className={`text-xl font-black ${t.text.brand}`}>{formatCurrency(balance)}</p>
        </div>

        {branchEquip.map(equip => {
          const owned = biz.equipment?.[equip.id] || 0;
          const maxTotal = equip.max || 999;
          const isMaxed = owned >= maxTotal;
          const canBuy = balance >= equip.cost && !isMaxed;

          return (
            <div key={equip.id}
              className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${isDark ? 'bg-indigo-500/15' : 'bg-indigo-50'}`}>
                    {equip.id === 'rooms' ? <MapPin className="w-5 h-5 text-indigo-500" /> :
                      <Building2 className="w-5 h-5 text-indigo-500" />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${t.text.primary}`}>{equip.name}</p>
                    <p className={`text-[10px] ${t.text.tertiary}`}>
                      {formatCurrency(equip.cost)} each • +{equip.incomeBoost}% income
                      {equip.required && <span className="text-red-400 ml-1">• Required</span>}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${t.text.primary}`}>{owned}</p>
                  {maxTotal < 999 && (
                    <p className={`text-[10px] ${t.text.tertiary}`}>max {maxTotal}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => buyEquipment(bizId, equip.id, 1, equip.cost)}
                disabled={!canBuy}
                className={`w-full flex items-center justify-center gap-1.5
                  py-2.5 rounded-xl text-sm font-bold transition-all
                  ${canBuy
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
                    : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                  }`}>
                <Plus className="w-4 h-4" />
                {isMaxed ? 'Maximum Reached' : `Add ${equip.name} — ${formatCurrency(equip.cost)}`}
              </button>
            </div>
          );
        })}
      </div>

      <AdSpace />
    </div>
  );
}

export default BranchManagement;