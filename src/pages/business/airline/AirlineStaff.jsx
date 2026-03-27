// src/pages/business/airline/AirlineStaff.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Users, Plus, Minus, TrendingUp, Plane
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { AIRLINE_STAFF } from '../../../data/airlineData';
import { formatCurrency } from '../../../utils/formatCurrency';
import AdSpace from '../../../components/common/AdSpace';

function AirlineStaff() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  const { ownedBusinesses, balance, hireAirlineStaff } = useGame();
  const biz = ownedBusinesses.find(b => b.id === bizId);

  const [quantities, setQuantities] = useState({});

  if (!biz || !biz.airline) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const airline = biz.airline;
  const staffCounts = airline.staff || {};
  const totalStaff = Object.values(staffCounts).reduce((a, b) => a + b, 0);
  const aircraftCount = (airline.aircraft || []).filter(a => a.active).length;
  const hubCount = (airline.hubs || []).length;

  const getQty = (id) => quantities[id] || 1;
  const setQty = (id, val) => setQuantities(prev => ({ ...prev, [id]: Math.max(1, val) }));

  const getRequired = (staff) => {
    if (staff.perAircraft) return aircraftCount * staff.perAircraft;
    if (staff.perHub) return hubCount * staff.perHub;
    return 0;
  };

  const handleHire = (staff) => {
    const qty = getQty(staff.id);
    const cost = qty * staff.costPer;
    if (balance < cost) return;
    hireAirlineStaff(bizId, staff.id, qty, cost);
    setQty(staff.id, 1);
  };

  const getStaffIcon = (staffId) => {
    switch (staffId) {
      case 'pilot':
      case 'copilot': return '👨‍✈️';
      case 'cabin_crew': return '👩‍✈️';
      case 'ground_staff': return '🧑‍💼';
      case 'maintenance': return '🔧';
      case 'atc': return '🗼';
      default: return '👤';
    }
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
            <p className={`text-base font-bold ${t.text.primary}`}>Airline Staff</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>{totalStaff} total staff</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs ${t.text.tertiary}`}>Balance</span>
          <span className={`text-lg font-black ${t.text.brand}`}>{formatCurrency(balance)}</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">

        {/* Fleet Info */}
        <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-sky-500" />
              <span className={`text-xs ${t.text.secondary}`}>Fleet Size</span>
            </div>
            <span className={`text-sm font-bold ${t.text.primary}`}>
              {aircraftCount} aircraft • {hubCount} hubs
            </span>
          </div>
        </div>

        {/* Staff Types */}
        {AIRLINE_STAFF.map(staff => {
          const current = staffCounts[staff.id] || 0;
          const required = getRequired(staff);
          const isMet = !staff.required || current >= required;
          const qty = getQty(staff.id);
          const totalCost = qty * staff.costPer;
          const canAfford = balance >= totalCost;

          return (
            <div key={staff.id}
              className={`rounded-xl p-4 ${t.bg.card} border
                ${!isMet && required > 0 ? (isDark ? 'border-red-500/20' : 'border-red-200') : t.border.default}`}>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{getStaffIcon(staff.id)}</span>
                  <div>
                    <p className={`text-sm font-bold ${t.text.primary}`}>{staff.name}</p>
                    <p className={`text-[10px] ${t.text.tertiary}`}>
                      {formatCurrency(staff.costPer)} / person
                      {staff.required && <span className="text-red-400 ml-1">• Required</span>}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${!isMet && required > 0 ? 'text-red-400' : t.text.primary}`}>
                    {current}
                  </p>
                  {required > 0 && (
                    <p className={`text-[9px] ${current >= required ? 'text-green-500' : 'text-red-400'}`}>
                      need {required}
                    </p>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-[10px] font-medium text-green-500">
                    +{staff.incomeBoost}% income per hire
                  </span>
                </div>
                {staff.perAircraft && (
                  <span className={`text-[9px] px-2 py-1 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'} ${t.text.tertiary}`}>
                    {staff.perAircraft} per aircraft
                  </span>
                )}
                {staff.perHub && (
                  <span className={`text-[9px] px-2 py-1 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'} ${t.text.tertiary}`}>
                    {staff.perHub} per hub
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs ${t.text.secondary}`}>Hire:</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setQty(staff.id, qty - 1)}
                    disabled={qty <= 1}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center
                      ${qty > 1
                        ? isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                        : isDark ? 'bg-gray-900 text-gray-700' : 'bg-gray-50 text-gray-300'
                      } active:scale-90 transition-all`}>
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <input type="number" value={qty}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      if (!isNaN(v) && v >= 1) setQty(staff.id, v);
                    }}
                    className={`w-16 h-8 rounded-lg text-center text-sm font-bold outline-none border transition-colors
                      ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:border-sky-500'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-sky-500'}`}
                  />

                  <button onClick={() => setQty(staff.id, qty + 1)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center
                      ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
                      active:scale-90 transition-all`}>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button onClick={() => handleHire(staff)} disabled={!canAfford}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all
                  ${canAfford
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 active:scale-95'
                    : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                  }`}>
                Hire {qty} {staff.name}{qty > 1 ? 's' : ''} — {formatCurrency(totalCost)}
              </button>
            </div>
          );
        })}
      </div>

      <AdSpace />
    </div>
  );
}

export default AirlineStaff;