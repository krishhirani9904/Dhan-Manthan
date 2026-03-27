// src/pages/business/oilgas/CustomerContracts.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Handshake, Droplets, Flame,
  Clock, Check, TrendingUp, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { canSignContract } from '../../../data/oilGasData';
import { formatCurrency, formatNumber } from '../../../utils/formatCurrency';
import { formatTime } from '../../../utils/formatTime';
import AdSpace from '../../../components/common/AdSpace';

function CustomerContracts() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  const { 
    ownedBusinesses, 
    signContract, 
    collectContractReward,
    regenerateContract // નવું function add કરો જો user ને contract ન ગમે તો
  } = useGame();
  
  const biz = ownedBusinesses.find(b => b.id === bizId);

  const [contractRemaining, setContractRemaining] = useState(0);

  // Timer માત્ર active contract માટે
  useEffect(() => {
    if (!biz?.oilgas?.activeContract?.endTime) {
      setContractRemaining(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((biz.oilgas.activeContract.endTime - Date.now()) / 1000));
      setContractRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000); // 1 second enough છે
    
    return () => clearInterval(interval);
  }, [biz?.oilgas?.activeContract?.endTime]);

  if (!biz || !biz.oilgas) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const oilgas = biz.oilgas;
  const stock = oilgas.stock || { oil: 0, gas: 0 };
  const activeContract = oilgas.activeContract;
  const pendingContract = oilgas.pendingContract; // 🆕 Stored contract
  const completedContracts = oilgas.completedContracts || 0;

  const isContractActive = activeContract && activeContract.endTime && Date.now() < activeContract.endTime;
  const isContractComplete = activeContract && activeContract.endTime && Date.now() >= activeContract.endTime;

  // 🆕 pendingContract use કરો (pre-generated)
  const canSign = pendingContract && !activeContract && canSignContract(stock, pendingContract.requirements);

  const handleSign = () => {
    if (!canSign || !pendingContract) return;
    signContract(bizId, pendingContract);
  };

  const handleCollect = () => {
    if (!isContractComplete) return;
    collectContractReward(bizId);
  };

  // Optional: Contract ન ગમે તો regenerate કરવા માટે
  const handleRegenerate = () => {
    if (activeContract) return; // Active contract હોય તો regenerate ન થાય
    regenerateContract(bizId);
  };

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
            <p className={`text-base font-bold ${t.text.primary}`}>Customer Contracts</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>
              {completedContracts} completed
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">

        {/* Current Stock */}
        <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
          <p className={`text-[10px] font-bold mb-2 ${t.text.secondary}`}>Available Stock</p>
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-amber-500" />
              <span className={`text-sm font-bold ${t.text.primary}`}>{formatNumber(Math.floor(stock.oil))}</span>
              <span className={`text-[10px] ${t.text.tertiary}`}>bbl oil</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-blue-500" />
              <span className={`text-sm font-bold ${t.text.primary}`}>{formatNumber(Math.floor(stock.gas))}</span>
              <span className={`text-[10px] ${t.text.tertiary}`}>m³ gas</span>
            </div>
          </div>
        </div>

        {/* ═══ ACTIVE CONTRACT ═══ */}
        {isContractActive && (
          <div className={`rounded-xl p-4 ${isDark ? 'bg-green-500/10' : 'bg-green-50'}
            border ${isDark ? 'border-green-500/20' : 'border-green-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Handshake className="w-5 h-5 text-green-500" />
              <span className="text-sm font-bold text-green-500">Contract In Progress</span>
            </div>

            <p className={`text-sm font-bold ${t.text.primary} mb-2`}>{activeContract.description}</p>

            {/* Requirements Used */}
            <div className={`p-2.5 rounded-lg mb-3 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <p className={`text-[10px] font-bold mb-1.5 ${t.text.tertiary}`}>Resources Committed:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(activeContract.requirements || {}).map(([fuel, amount]) => (
                  <div key={fuel} className="flex items-center gap-1">
                    {fuel === 'oil'
                      ? <Droplets className="w-3 h-3 text-amber-500" />
                      : <Flame className="w-3 h-3 text-blue-500" />}
                    <span className={`text-[10px] font-medium ${t.text.primary}`}>
                      {formatNumber(amount)} {fuel === 'oil' ? 'bbl' : 'm³'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-lg font-black text-orange-500">{formatTime(contractRemaining)}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                <span className="text-sm font-bold text-green-500">+{formatCurrency(activeContract.reward)}</span>
              </div>
            </div>

            {/* Progress */}
            {(() => {
              const total = (activeContract.endTime - activeContract.startTime) / 1000;
              const elapsed = total - contractRemaining;
              const pct = total > 0 ? Math.min(100, (elapsed / total) * 100) : 0;
              return (
                <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <div className="h-full rounded-full bg-green-500 transition-all duration-1000"
                    style={{ width: `${pct}%` }} />
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══ CONTRACT COMPLETE ═══ */}
        {isContractComplete && (
          <button onClick={handleCollect}
            className="w-full rounded-xl p-5 text-center bg-gradient-to-r from-green-500 to-emerald-600
              text-white shadow-lg shadow-green-500/20 active:scale-95 transition-all">
            <Check className="w-8 h-8 mx-auto mb-2" />
            <p className="text-base font-bold">Contract Complete!</p>
            <p className="text-2xl font-black mt-2">{formatCurrency(activeContract.reward)}</p>
            <p className="text-xs mt-2 opacity-80">Tap to collect reward</p>
          </button>
        )}

        {/* ═══ PENDING CONTRACT (Pre-generated, no flicker!) ═══ */}
        {!activeContract && pendingContract && (
          <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
            {/* Customer Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{pendingContract.customerLogo}</span>
                <div>
                  <p className={`text-sm font-bold ${t.text.primary}`}>{pendingContract.customerName}</p>
                  <p className={`text-[10px] ${t.text.tertiary} capitalize`}>{pendingContract.customerTier} tier customer</p>
                </div>
              </div>
              
              {/* 🆕 Regenerate Button (Optional) */}
              <button onClick={handleRegenerate}
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} 
                  transition-colors`}
                title="Get different contract">
                <RefreshCw className={`w-4 h-4 ${t.text.secondary}`} />
              </button>
            </div>

            {/* Contract Details */}
            <div className={`rounded-lg p-3 mb-3 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <p className={`text-xs font-bold mb-2 ${t.text.primary}`}>{pendingContract.description}</p>

              {/* Requirements */}
              <p className={`text-[10px] font-bold mb-1.5 ${t.text.tertiary}`}>Requirements:</p>
              <div className="space-y-1.5">
                {Object.entries(pendingContract.requirements).map(([fuel, amount]) => {
                  const hasEnough = (stock[fuel] || 0) >= amount;
                  return (
                    <div key={fuel} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {fuel === 'oil'
                          ? <Droplets className={`w-3.5 h-3.5 ${hasEnough ? 'text-green-500' : 'text-red-400'}`} />
                          : <Flame className={`w-3.5 h-3.5 ${hasEnough ? 'text-green-500' : 'text-red-400'}`} />}
                        <span className={`text-xs font-medium ${t.text.primary}`}>
                          {formatNumber(amount)} {fuel === 'oil' ? 'bbl' : 'm³'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] ${hasEnough ? 'text-green-500' : 'text-red-400'}`}>
                          Have: {formatNumber(Math.floor(stock[fuel] || 0))}
                        </span>
                        {hasEnough
                          ? <Check className="w-3.5 h-3.5 text-green-500" />
                          : <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reward & Duration */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span className={`text-xs ${t.text.secondary}`}>
                  Duration: {formatTime(pendingContract.duration)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                <span className="text-sm font-bold text-green-500">
                  +{formatCurrency(pendingContract.reward)}
                </span>
              </div>
            </div>

            {/* Sign Button */}
            <button onClick={handleSign} disabled={!canSign}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
                ${canSign
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 active:scale-95'
                  : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                }`}>
              <Handshake className="w-5 h-5" />
              {canSign ? 'Sign Contract' : 'Insufficient Stock'}
            </button>
          </div>
        )}

        {/* No Contract Available */}
        {!activeContract && !pendingContract && (
          <div className={`rounded-xl p-6 text-center border border-dashed ${t.border.default}`}>
            <Handshake className={`w-10 h-10 mx-auto mb-3 ${t.text.tertiary}`} />
            <p className={`text-sm font-medium ${t.text.secondary}`}>No contracts available</p>
            <p className={`text-xs mt-1 ${t.text.tertiary}`}>Check back later for new opportunities</p>
          </div>
        )}

        {/* Completed Contracts Count */}
        {completedContracts > 0 && (
          <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className={`text-xs font-bold ${t.text.primary}`}>Contracts Completed</span>
              </div>
              <span className={`text-lg font-black text-green-500`}>{completedContracts}</span>
            </div>
          </div>
        )}
      </div>

      <AdSpace />
    </div>
  );
}

export default CustomerContracts;