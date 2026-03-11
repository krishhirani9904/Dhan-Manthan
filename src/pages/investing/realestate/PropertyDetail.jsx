import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Check, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { PROPERTIES, PROPERTY_IMPROVEMENTS, getPropertyMarketValue, getPropertyRentalIncome } from '../../../data/realEstate';
import { formatCurrency } from '../../../utils/formatCurrency';
import { PROPERTY_SELL_TAX } from '../../../config/constants';
import AdSpace from '../../../components/common/AdSpace';

function PropertyDetail() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, ownedProperties, sellProperty, buyImprovement } = useGame();

  const [showSellConfirm, setShowSellConfirm] = useState(false);
  const [improvedId, setImprovedId] = useState(null); // feedback state

  const prop = PROPERTIES.find(p => p.id === propertyId);
  const owned = ownedProperties.find(op => op.propertyId === propertyId);

  if (!prop || !owned) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Property not found</p>
        <button onClick={() => navigate('/investing/realestate/owned')}
          className="mt-3 text-yellow-500 underline text-sm">Go back</button>
      </div>
    );
  }

  const improvements = PROPERTY_IMPROVEMENTS[propertyId] || [];
  const done = owned.improvements || [];
  const available = improvements.filter(imp => !done.includes(imp.id));
  const completed = improvements.filter(imp => done.includes(imp.id));
  const marketValue = getPropertyMarketValue(propertyId, done);
  const rentalIncome = getPropertyRentalIncome(propertyId, done);
  const sellAmount = Math.floor(marketValue * (1 - PROPERTY_SELL_TAX));

  const handleSell = () => {
    sellProperty(propertyId);
    navigate('/investing/realestate/owned');
  };

  const handleImprove = (imp) => {
    if (balance >= imp.cost && !done.includes(imp.id)) {
      buyImprovement(propertyId, imp.id, imp.cost);
      // FIXED: Show feedback
      setImprovedId(imp.id);
      setTimeout(() => setImprovedId(null), 2000);
    }
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/investing/realestate/owned')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <p className={`text-xs ${t.text.secondary}`}>
          Balance: <span className={`font-bold ${t.text.primary}`}>{formatCurrency(balance)}</span>
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4">
        <div className={`h-40 rounded-xl flex items-center justify-center text-6xl
          ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {prop.image}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xl font-black ${t.text.brand}`}>{formatCurrency(marketValue)}</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>Income Per Hour: +{formatCurrency(rentalIncome)}</p>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <p className={`text-xs ${t.text.secondary}`}>{prop.country} {prop.location}</p>
          </div>
        </div>

        {/* Improvement success feedback */}
        {improvedId && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/15 animate-fade-in">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-xs font-bold text-green-500">Improvement completed!</span>
          </div>
        )}

        {completed.length > 0 && (
          <div>
            <p className={`text-xs font-bold mb-2 text-green-500`}>Improvements Done</p>
            <div className="flex flex-wrap gap-2">
              {completed.map(imp => (
                <span key={imp.id} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px]
                  font-bold bg-green-500/10 text-green-500">
                  {imp.icon} {imp.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {available.length > 0 && (
          <div>
            <p className={`text-xs font-bold mb-2 ${t.text.primary}`}>Available Improvements</p>
            <div className="space-y-2">
              {available.map(imp => {
                const canBuy = balance >= imp.cost;
                const newValue = marketValue + imp.valueIncrease;
                return (
                  <button key={imp.id} onClick={() => handleImprove(imp)}
                    disabled={!canBuy}
                    className={`w-full flex items-center justify-between p-3 rounded-xl
                      text-left transition-all active:scale-[0.98]
                      ${t.bg.card} border ${t.border.default}
                      ${canBuy ? 'hover:border-green-500/30' : 'opacity-50'}`}>
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{imp.icon}</span>
                      <div>
                        <p className={`text-xs font-bold ${t.text.primary}`}>{imp.name}</p>
                        <p className={`text-[10px] ${t.text.tertiary}`}>{formatCurrency(imp.cost)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] ${t.text.secondary}`}>Market Value:</p>
                      <p className={`text-xs font-bold ${t.text.brand}`}>{formatCurrency(newValue)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className={`rounded-xl p-3 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex justify-between">
            <span className={`text-xs ${t.text.secondary}`}>Market Value</span>
            <span className={`text-sm font-bold ${t.text.primary}`}>{formatCurrency(marketValue)}</span>
          </div>
        </div>

        {/* FIXED: Sell button shows confirmation first */}
        <button onClick={() => setShowSellConfirm(true)}
          className="w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95
            bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/20">
          <span>Sell Property — {formatCurrency(sellAmount)}</span>
          <span className="block text-[10px] font-normal opacity-70 mt-0.5">
            Sales Tax: {(PROPERTY_SELL_TAX * 100).toFixed(0)}%
          </span>
        </button>
      </div>

      {/* FIXED: Sell confirmation modal */}
      {showSellConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4
          bg-black/60 backdrop-blur-sm" onClick={() => setShowSellConfirm(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm rounded-2xl p-5
              ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className={`text-sm font-bold ${t.text.primary}`}>Sell {prop.name}?</p>
                <p className={`text-xs ${t.text.secondary}`}>{prop.country} {prop.location}</p>
              </div>
            </div>
            <div className={`rounded-xl p-3 mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="flex justify-between mb-1">
                <span className={`text-xs ${t.text.secondary}`}>Market Value</span>
                <span className={`text-xs font-bold ${t.text.primary}`}>{formatCurrency(marketValue)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className={`text-xs ${t.text.secondary}`}>Sales Tax ({(PROPERTY_SELL_TAX * 100).toFixed(0)}%)</span>
                <span className="text-xs font-bold text-red-400">-{formatCurrency(marketValue - sellAmount)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-dashed border-gray-600">
                <span className={`text-xs font-bold ${t.text.primary}`}>You Receive</span>
                <span className="text-xs font-bold text-green-500">{formatCurrency(sellAmount)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowSellConfirm(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold
                  ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                Cancel
              </button>
              <button onClick={handleSell}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold
                  bg-red-500 text-white active:scale-95">
                Sell Property
              </button>
            </div>
          </div>
        </div>
      )}

      <AdSpace />
    </div>
  );
}

export default PropertyDetail;