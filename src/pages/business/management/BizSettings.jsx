// src/pages/business/management/BizSettings.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Landmark, TrendingUp, TrendingDown, CreditCard,
  Shield, Smartphone, Globe, Lock, Check
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { BANK_SETTINGS_DEFAULTS } from '../../../data/businessRequirements';
import { formatCurrency } from '../../../utils/formatCurrency';
import ManagementHeader from '../../../components/business/ManagementHeader';
import AdSpace from '../../../components/common/AdSpace';

const FACILITY_ICONS = {
  upi: Smartphone,
  cards: CreditCard,
  netbanking: Globe,
  locker: Lock,
  insurance: Shield,
};

function BizSettings() {
  const { bizId } = useParams();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedBusinesses, balance, updateBankSettings, buyBankFacility } = useGame();

  const biz = ownedBusinesses.find(b => b.id === bizId);

  if (!biz || biz.categoryId !== 'bank') {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const settings = biz.bankSettings || BANK_SETTINGS_DEFAULTS;
  const loanRate = settings.loanRate || BANK_SETTINGS_DEFAULTS.loanRate;
  const savingsRate = settings.savingsRate || BANK_SETTINGS_DEFAULTS.savingsRate;
  const facilities = settings.facilities || {};

  const [localLoanRate, setLocalLoanRate] = useState(loanRate);
  const [localSavingsRate, setLocalSavingsRate] = useState(savingsRate);

  const handleSaveRates = () => {
    updateBankSettings(bizId, {
      loanRate: localLoanRate,
      savingsRate: localSavingsRate,
    });
  };

  const handleBuyFacility = (facId) => {
    const fac = BANK_SETTINGS_DEFAULTS.facilities[facId];
    if (!fac || facilities[facId] || balance < fac.cost) return;
    buyBankFacility(bizId, facId, fac.cost);
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <ManagementHeader
        bizId={bizId}
        title="Bank Settings"
        subtitle="Configure rates & services"
        icon={Landmark}
        iconColor="text-cyan-500"
      />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
        <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-[10px] ${t.text.tertiary}`}>Available Balance</p>
          <p className={`text-xl font-black ${t.text.brand}`}>{formatCurrency(balance)}</p>
        </div>

        {/* Interest Rates */}
        <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-sm font-bold mb-3 ${t.text.primary}`}>Interest Rates</p>

          {/* Loan Rate */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                <span className={`text-xs font-medium ${t.text.secondary}`}>Loan Interest Rate</span>
              </div>
              <span className={`text-sm font-bold ${t.text.primary}`}>{localLoanRate}%</span>
            </div>
            <input type="range"
              min={BANK_SETTINGS_DEFAULTS.loanRateRange.min}
              max={BANK_SETTINGS_DEFAULTS.loanRateRange.max}
              value={localLoanRate}
              onChange={(e) => setLocalLoanRate(parseInt(e.target.value))}
              className="w-full accent-green-500 h-2"
            />
            <div className="flex justify-between mt-1">
              <span className={`text-[9px] ${t.text.tertiary}`}>
                {BANK_SETTINGS_DEFAULTS.loanRateRange.min}%
              </span>
              <span className={`text-[9px] ${t.text.tertiary}`}>
                Low = More customers, less earning
              </span>
              <span className={`text-[9px] ${t.text.tertiary}`}>
                {BANK_SETTINGS_DEFAULTS.loanRateRange.max}%
              </span>
            </div>
          </div>

          {/* Savings Rate */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-blue-500" />
                <span className={`text-xs font-medium ${t.text.secondary}`}>Savings Interest Rate</span>
              </div>
              <span className={`text-sm font-bold ${t.text.primary}`}>{localSavingsRate}%</span>
            </div>
            <input type="range"
              min={BANK_SETTINGS_DEFAULTS.savingsRateRange.min}
              max={BANK_SETTINGS_DEFAULTS.savingsRateRange.max}
              value={localSavingsRate}
              onChange={(e) => setLocalSavingsRate(parseInt(e.target.value))}
              className="w-full accent-blue-500 h-2"
            />
            <div className="flex justify-between mt-1">
              <span className={`text-[9px] ${t.text.tertiary}`}>
                {BANK_SETTINGS_DEFAULTS.savingsRateRange.min}%
              </span>
              <span className={`text-[9px] ${t.text.tertiary}`}>
                High = More deposits, more cost
              </span>
              <span className={`text-[9px] ${t.text.tertiary}`}>
                {BANK_SETTINGS_DEFAULTS.savingsRateRange.max}%
              </span>
            </div>
          </div>

          <button onClick={handleSaveRates}
            className="w-full py-2.5 rounded-xl text-sm font-bold
              bg-gradient-to-r from-cyan-500 to-blue-500 text-white
              shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
            Save Interest Rates
          </button>
        </div>

        {/* Facilities */}
        <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-sm font-bold mb-3 ${t.text.primary}`}>Banking Facilities</p>
          <div className="space-y-2.5">
            {Object.entries(BANK_SETTINGS_DEFAULTS.facilities).map(([facId, fac]) => {
              const owned = facilities[facId] || false;
              const canBuy = balance >= fac.cost && !owned;
              const FacIcon = FACILITY_ICONS[facId] || Shield;

              return (
                <div key={facId}
                  className={`flex items-center justify-between p-3 rounded-xl
                    ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}
                    ${owned ? (isDark ? 'border border-green-500/20' : 'border border-green-200') : ''}`}>
                  <div className="flex items-center gap-2.5">
                    <FacIcon className={`w-4 h-4 ${owned ? 'text-green-500' : t.text.tertiary}`} />
                    <div>
                      <p className={`text-xs font-bold ${t.text.primary}`}>{fac.name}</p>
                      <p className={`text-[10px] ${t.text.tertiary}`}>
                        {formatCurrency(fac.cost)}
                      </p>
                    </div>
                  </div>
                  {owned ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-500
                      px-2 py-1 rounded-full bg-green-500/10">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <button onClick={() => handleBuyFacility(facId)}
                      disabled={!canBuy}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all
                        ${canBuy
                          ? 'bg-cyan-500 text-white active:scale-95'
                          : isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                        }`}>
                      Enable
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tax Info */}
        <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-sm font-bold mb-2 ${t.text.primary}`}>Tax Information</p>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className={`text-xs ${t.text.secondary}`}>Tax Rate</span>
              <span className={`text-xs font-bold text-red-400`}>
                {(BANK_SETTINGS_DEFAULTS.taxRate * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`text-xs ${t.text.secondary}`}>Payment Frequency</span>
              <span className={`text-xs font-bold ${t.text.primary}`}>
                {BANK_SETTINGS_DEFAULTS.taxFrequency}
              </span>
            </div>
          </div>
          <p className={`text-[10px] mt-2 ${t.text.tertiary}`}>
            Tax is automatically deducted from your business income
          </p>
        </div>
      </div>

      <AdSpace />
    </div>
  );
}

export default BizSettings;