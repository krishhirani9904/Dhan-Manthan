// src/pages/business/merger/MergerNameInput.jsx
import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Shuffle } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { MERGER_BUSINESSES } from '../../../data/mergerBusinesses';
import { getRandomMergerName } from '../../../data/mergerFlowData';
import { formatCurrency } from '../../../utils/formatCurrency';

function MergerNameInput() {
  const { mergerId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, initMergerFlow } = useGame();

  const merger = MERGER_BUSINESSES.find(m => m.id === mergerId);
  const [name, setName] = useState(() => getRandomMergerName(mergerId));

  if (!merger) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Merger not found</p>
        <button onClick={() => navigate('/business/mergers')}
          className="mt-3 text-yellow-500 underline text-sm">Go back</button>
      </div>
    );
  }

  const MergerIcon = merger.icon;
  const canAfford = balance >= merger.investment;
  const validName = name.trim().length >= 2;

  const handleShuffle = useCallback(() => {
    setName(getRandomMergerName(mergerId));
  }, [mergerId]);

  // FIX: Always navigate to /business after starting merger
  const handleStart = useCallback(() => {
    if (!canAfford || !validName) return;
    initMergerFlow(mergerId, name.trim());
    // Navigate to business page immediately — flow appears in owned list
    navigate('/business');
  }, [canAfford, validName, mergerId, name, initMergerFlow, navigate]);

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate(`/business/merger/confirm/${mergerId}`)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Name Your Business</h1>
      </div>

      <div className="flex-1 flex flex-col px-4 py-6 max-w-lg mx-auto w-full">
        <div className="flex justify-center mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${merger.color}`}>
            <MergerIcon className="w-8 h-8 text-white" />
          </div>
        </div>

        <p className={`text-center text-sm font-medium mb-1 ${t.text.primary}`}>
          {merger.name}
        </p>
        <p className={`text-center text-xs mb-6 ${t.text.tertiary}`}>
          Give your merged business a name
        </p>

        <label className={`text-xs font-medium mb-2 ${t.text.secondary}`}>Business Name</label>
        <div className={`flex items-center rounded-xl border overflow-hidden mb-6
          ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          focus-within:border-yellow-500 transition-colors`}>
          <button onClick={handleShuffle}
            className={`flex-shrink-0 p-3 transition-colors
              ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} active:scale-90`}>
            <Shuffle className={`w-5 h-5 ${t.text.brand}`} />
          </button>
          <input type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter business name..."
            maxLength={30}
            className={`flex-1 py-3 pr-4 text-sm font-medium outline-none bg-transparent ${t.text.primary}`} />
        </div>

        <div className={`rounded-xl p-4 mb-6 ${isDark ? 'bg-gray-800/60' : 'bg-gray-50'} border ${t.border.default}`}>
          <p className={`text-xs font-medium mb-1 ${t.text.secondary}`}>Investment Required</p>
          <p className={`text-2xl font-black ${t.text.brand}`}>{formatCurrency(merger.investment)}</p>
          {!canAfford && (
            <p className="text-[10px] text-red-400 mt-1">
              You need {formatCurrency(merger.investment - balance)} more
            </p>
          )}
        </div>

        <button onClick={handleStart}
          disabled={!canAfford || !validName}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all
            ${canAfford && validName
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-95'
              : isDark ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
          Start Merger
        </button>

        <p className={`text-center text-[10px] mt-3 ${t.text.tertiary}`}>
          Your balance: {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
}

export default MergerNameInput;