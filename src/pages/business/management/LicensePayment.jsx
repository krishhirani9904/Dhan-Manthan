// src/pages/business/management/LicensePayment.jsx
import { useParams } from 'react-router-dom';
import { FileText, Check, Lock } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { LICENSE_TYPES } from '../../../data/businessRequirements';
import { formatCurrency } from '../../../utils/formatCurrency';
import ManagementHeader from '../../../components/business/ManagementHeader';
import AdSpace from '../../../components/common/AdSpace';

function LicensePayment() {
  const { bizId } = useParams();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedBusinesses, balance, buyLicense } = useGame();

  const biz = ownedBusinesses.find(b => b.id === bizId);
  const licenseTypes = LICENSE_TYPES[biz?.categoryId] || [];

  if (!biz) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <ManagementHeader
        bizId={bizId}
        title="Licenses & Permits"
        subtitle={`${Object.values(biz.licenses || {}).filter(Boolean).length}/${licenseTypes.length} obtained`}
        icon={FileText}
        iconColor="text-emerald-500"
      />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
        <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-[10px] ${t.text.tertiary}`}>Available Balance</p>
          <p className={`text-xl font-black ${t.text.brand}`}>{formatCurrency(balance)}</p>
        </div>

        {licenseTypes.map(license => {
          const owned = biz.licenses?.[license.id] || false;
          const canBuy = balance >= license.cost && !owned;

          return (
            <div key={license.id}
              className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}
                ${owned ? (isDark ? 'border-green-500/30' : 'border-green-200') : ''}`}>
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${owned
                      ? isDark ? 'bg-green-500/15' : 'bg-green-50'
                      : isDark ? 'bg-emerald-500/15' : 'bg-emerald-50'
                    }`}>
                    {owned
                      ? <Check className="w-5 h-5 text-green-500" />
                      : <FileText className="w-5 h-5 text-emerald-500" />
                    }
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${t.text.primary}`}>
                      {license.name}
                      {license.required && !owned && (
                        <span className="text-red-400 text-[9px] ml-1">MANDATORY</span>
                      )}
                    </p>
                    <p className={`text-[10px] ${t.text.tertiary}`}>
                      {license.description}
                    </p>
                  </div>
                </div>
              </div>

              {owned ? (
                <div className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                  ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold text-green-500">License Obtained</span>
                </div>
              ) : (
                <button
                  onClick={() => buyLicense(bizId, license.id, license.cost)}
                  disabled={!canBuy}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all
                    ${canBuy
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20 active:scale-95'
                      : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                    }`}>
                  {canBuy
                    ? `Obtain License — ${formatCurrency(license.cost)}`
                    : `Need ${formatCurrency(license.cost - balance)} more`
                  }
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

export default LicensePayment;