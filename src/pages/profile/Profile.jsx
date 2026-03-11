import { useNavigate } from 'react-router-dom';
import { User, Sun, Moon, RotateCcw, ChevronRight, AlertTriangle,
  TrendingUp, Briefcase, Building2, Car, Coins } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { formatCurrency, formatNumber } from '../../utils/formatCurrency';
import { getFortuneLevel, getGameProgress } from '../../data/fortuneLevels';
import { INSIGNIAS } from '../../data/insigniasData';
import { PROPERTIES } from '../../data/realEstate';
import { STOCKS } from '../../data/stockMarket';
import { CRYPTOCURRENCIES, getSimulatedCryptoPrice } from '../../data/cryptoData';

function Profile() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const gameState = useGame();
  const {
    balance, ownedBusinesses, ownedStocks, ownedProperties,
    ownedCrypto, ownedCars, ownedAircraft, ownedYachts,
    ownedCollections, ownedNFTs, ownedIslands,
    mergedBusinesses, incomePerHour, totalClicks, priceSeed,
    resetGame
  } = gameState;

  const [showReset, setShowReset] = useState(false);

  const fortune = useMemo(() => getFortuneLevel(balance), [balance]);
  const progress = useMemo(() => getGameProgress(gameState), [gameState]);

  // Earned insignias
  const earnedInsignias = useMemo(() =>
    INSIGNIAS.filter(ins => ins.check(gameState)), [gameState]);

  // Calculate totals
  const stocksValue = useMemo(() =>
    (ownedStocks || []).reduce((sum, os) => {
      const def = STOCKS.find(s => s.id === os.stockId);
      if (!def) return sum;
      return sum + os.quantity * os.avgBuyPrice;
    }, 0), [ownedStocks]);

  const cryptoValue = useMemo(() =>
    (ownedCrypto || []).reduce((sum, oc) => {
      const def = CRYPTOCURRENCIES.find(c => c.id === oc.cryptoId);
      if (!def) return sum;
      return sum + getSimulatedCryptoPrice(def, priceSeed) * oc.quantity;
    }, 0), [ownedCrypto, priceSeed]);

  const transportValue = (ownedCars || []).length + (ownedAircraft || []).length + (ownedYachts || []).length;
  const collectionsCount = Object.values(ownedCollections || {}).reduce((s, arr) => s + arr.length, 0);

  const statGrid = [
    { label: 'Balance', value: formatCurrency(balance), color: 'border-yellow-500', pct: 30 },
    { label: 'Businesses', value: String((ownedBusinesses || []).length), color: 'border-blue-500', pct: 15 },
    { label: 'Stocks', value: formatCurrency(stocksValue), color: 'border-green-500', pct: 15 },
    { label: 'Real Estate', value: String((ownedProperties || []).length), color: 'border-purple-500', pct: 10 },
    { label: 'Transport', value: String(transportValue), color: 'border-red-500', pct: 10 },
    { label: 'Collections', value: String(collectionsCount), color: 'border-pink-500', pct: 5 },
    { label: 'Crypto Assets', value: formatCurrency(cryptoValue), color: 'border-orange-500', pct: 10 },
    { label: 'Residence', value: String((ownedIslands || []).length), color: 'border-cyan-500', pct: 5 },
  ];

  const handleReset = () => { resetGame(); setShowReset(false); };

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto scrollbar-hide">
      <div className="px-3 py-2 space-y-3">
        {/* Page Name */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center
            ${isDark ? 'bg-pink-500/15' : 'bg-pink-50'}`}>
            <User className="w-5 h-5 text-pink-500" />
          </div>
          <h2 className={`text-lg font-extrabold ${t.text.primary}`}>Profile</h2>
        </div>

        {/* Balance + Fortune + Insignias */}
        <div className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-2xl font-black ${t.text.primary}`}>{formatCurrency(balance)}</p>
              <p className={`text-xs mt-1 ${t.text.brand}`}>
                {fortune.emoji} {fortune.label}
              </p>
            </div>
            <div className="flex gap-1">
              {earnedInsignias.slice(0, 3).map(ins => (
                <div key={ins.id} className={`w-9 h-9 rounded-lg flex items-center justify-center
                  ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <span className="text-lg">{ins.image}</span>
                </div>
              ))}
              {earnedInsignias.length === 0 && (
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center
                  ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <span className="text-lg opacity-30">🏅</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold ${t.text.secondary}`}>Game Progress</span>
            <span className={`text-xs font-black ${t.text.brand}`}>{progress}%</span>
          </div>
          <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Stats Grid 2x4 */}
        <div className="grid grid-cols-2 gap-2">
          {statGrid.map(stat => (
            <div key={stat.label}
              className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}
                border-l-4 ${stat.color}`}>
              <p className={`text-lg font-black ${t.text.primary}`}>{stat.value}</p>
              <p className={`text-[10px] ${t.text.tertiary}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Taxes */}
        <button onClick={() => navigate('/profile/taxes')}
          className={`w-full rounded-xl p-4 flex items-center justify-between
            ${t.bg.card} border ${t.border.default} active:scale-[0.98] transition-all`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧾</span>
            <div className="text-left">
              <p className={`text-sm font-bold ${t.text.primary}`}>Taxes</p>
              <p className={`text-[10px] ${t.text.tertiary}`}>View & pay pending taxes</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 ${t.text.tertiary}`} />
        </button>

        {/* Forbes List */}
        <button onClick={() => navigate('/profile/forbes')}
          className={`w-full rounded-xl p-4 flex items-center justify-between
            ${t.bg.card} border ${t.border.default} active:scale-[0.98] transition-all`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div className="text-left">
              <p className={`text-sm font-bold ${t.text.primary}`}>Forbes List</p>
              <p className={`text-[10px] ${t.text.tertiary}`}>Your ranking among the richest</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 ${t.text.tertiary}`} />
        </button>

        {/* Statistics */}
        <button onClick={() => navigate('/profile/statistics')}
          className={`w-full rounded-xl p-4 flex items-center justify-between
            ${t.bg.card} border ${t.border.default} active:scale-[0.98] transition-all`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <p className={`text-sm font-bold ${t.text.primary}`}>Statistics</p>
              <p className={`text-[10px] ${t.text.tertiary}`}>All your game stats</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 ${t.text.tertiary}`} />
        </button>

        {/* Theme Toggle */}
        <button onClick={toggleTheme}
          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl
            ${t.bg.card} border ${t.border.default} transition-all`}>
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
            <span className={`text-sm font-bold ${t.text.primary}`}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <div className={`w-10 h-6 rounded-full flex items-center px-0.5
            transition-colors ${isDark ? 'bg-blue-500' : 'bg-gray-300'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform
              ${isDark ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>

        {/* Reset */}
        <button onClick={() => setShowReset(true)}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl
            border-2 border-red-500/30 ${isDark ? 'bg-red-500/5' : 'bg-red-50'}
            text-red-500 active:scale-95 transition-all mb-4`}>
          <RotateCcw className="w-5 h-5" />
          <span className="text-sm font-bold">Reset Game</span>
        </button>
      </div>

      {/* Reset Modal */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4
          bg-black/60 backdrop-blur-sm" onClick={() => setShowReset(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm rounded-2xl p-5
              ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className={`text-sm font-bold ${t.text.primary}`}>Reset Game?</p>
                <p className={`text-xs ${t.text.secondary}`}>All progress will be lost forever</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowReset(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold
                  ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                Cancel
              </button>
              <button onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold
                  bg-red-500 text-white active:scale-95">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;