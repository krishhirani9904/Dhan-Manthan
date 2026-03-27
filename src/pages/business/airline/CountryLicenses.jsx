// src/pages/business/airline/CountryLicenses.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Globe, Check, Lock
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { COUNTRY_LICENSES, LICENSE_REGIONS } from '../../../data/airlineData';
import { formatCurrency } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

function CountryLicenses() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  const { ownedBusinesses, balance, buyAirlineLicense } = useGame();
  const biz = ownedBusinesses.find(b => b.id === bizId);

  const [regionFilter, setRegionFilter] = useState('all');

  if (!biz || !biz.airline) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const ownedLicenses = biz.airline.licenses || [];

  const filteredLicenses = regionFilter === 'all'
    ? COUNTRY_LICENSES
    : COUNTRY_LICENSES.filter(l => l.region === regionFilter);

  const handleBuy = (license) => {
    if (ownedLicenses.includes(license.id) || balance < license.cost) return;
    buyAirlineLicense(bizId, license.id, license.cost);
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
            <p className={`text-base font-bold ${t.text.primary}`}>Country Flying Licenses</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>{ownedLicenses.length}/{COUNTRY_LICENSES.length} licensed</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs ${t.text.tertiary}`}>Balance</span>
          <span className={`text-lg font-black ${t.text.brand}`}>{formatCurrency(balance)}</span>
        </div>
      </div>

      {/* Region Filters */}
      <div className={`flex-shrink-0 px-3 py-2 border-b ${t.border.default}`}>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {LICENSE_REGIONS.map(r => (
            <button key={r.id} onClick={() => setRegionFilter(r.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                ${regionFilter === r.id
                  ? 'bg-blue-500 text-white'
                  : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}>
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* License List */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-2.5">
        {filteredLicenses.map(license => {
          const owned = ownedLicenses.includes(license.id);
          const canBuy = !owned && balance >= license.cost;

          return (
            <div key={license.id}
              className={`rounded-xl p-4 ${t.bg.card} border
                ${owned ? (isDark ? 'border-green-500/30' : 'border-green-200') : t.border.default}`}>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{license.flag}</span>
                  <div>
                    <p className={`text-sm font-bold ${t.text.primary}`}>{license.name}</p>
                    <p className={`text-[10px] ${t.text.tertiary}`}>{license.region}</p>
                  </div>
                </div>
                {owned && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isDark ? 'bg-green-500/15' : 'bg-green-50'}`}>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-[10px] font-bold text-green-500">Licensed</span>
                  </div>
                )}
              </div>

              {!owned && (
                <button onClick={() => handleBuy(license)} disabled={!canBuy}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all
                    ${canBuy
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95'
                      : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                    }`}>
                  {canBuy
                    ? `Buy License — ${formatCurrency(license.cost)}`
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

export default CountryLicenses;