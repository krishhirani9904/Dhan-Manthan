import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit3, DollarSign, TrendingUp,
  Receipt, Building2, MonitorPlay, AlertTriangle, X
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme, getColorShades } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { getCategoryById } from '../../data/businessCategories';
import { formatCurrency } from '../../utils/formatCurrency';
import { RENAME_COST } from '../../config/constants';
import AdSpace from '../../components/common/AdSpace';

function BusinessSettings() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedBusinesses, balance, renameBusiness, closeBusiness } = useGame();

  const biz = ownedBusinesses.find(b => b.id === bizId);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(biz?.name || '');
  const [closeAdWatching, setCloseAdWatching] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  if (!biz) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <div className="text-center">
          <p className={`text-sm ${t.text.secondary}`}>Business not found</p>
          <button onClick={() => navigate('/business')}
            className="mt-3 text-yellow-500 underline text-sm">Go back</button>
        </div>
      </div>
    );
  }

  const cat = getCategoryById(biz.categoryId);
  const Icon = cat?.icon || Building2;
  const color = cat?.color || 'bg-gray-500';
  const shades = getColorShades(color);
  const taxRate = cat?.taxRate || 0.03;
  const taxPerHour = Math.floor(biz.incomePerHour * taxRate);
  const closeRefund60 = Math.floor(biz.cost * 0.6);
  const closeRefund100 = biz.cost;

  const handleRename = () => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed.length < 2 || trimmed === biz.name) {
      setIsEditing(false);
      return;
    }
    if (balance < RENAME_COST) return;
    renameBusiness(bizId, trimmed);
    setIsEditing(false);
  };

  const handleClose60 = () => {
    closeBusiness(bizId, false);
    navigate('/business');
  };

  const handleClose100 = () => {
    if (closeAdWatching) return;
    setCloseAdWatching(true);
    setTimeout(() => {
      setCloseAdWatching(false);
      closeBusiness(bizId, true);
      navigate('/business');
    }, 2000);
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate(`/business/detail/${bizId}`)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Settings</h1>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
        {/* Icon + Name */}
        <div className="flex flex-col items-center py-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center gap-2 mt-3">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input type="text" value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  maxLength={30}
                  className={`text-sm font-bold text-center px-3 py-1.5 rounded-lg
                    outline-none border transition-colors
                    ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}
                    focus:border-yellow-500`}
                  autoFocus />
                <button onClick={handleRename}
                  disabled={balance < RENAME_COST}
                  className="text-xs font-bold text-yellow-500 px-2 py-1
                    rounded-lg bg-yellow-500/10">
                  Save ({formatCurrency(RENAME_COST)})
                </button>
                <button onClick={() => { setIsEditing(false); setNewName(biz.name); }}
                  className={`p-1 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className={`text-lg font-bold ${t.text.primary}`}>{biz.name}</p>
                <button onClick={() => setIsEditing(true)}
                  className={`p-1.5 rounded-lg transition-colors
                    ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  <Edit3 className={`w-3.5 h-3.5 ${t.text.tertiary}`} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className={`text-xs font-bold ${t.text.primary}`}>Earnings (All Time)</span>
          </div>
          <p className="text-xl font-black text-green-500">
            {formatCurrency(Math.floor(biz.totalEarnings || 0))}
          </p>
        </div>

        <div className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className={`w-4 h-4 ${shades.text}`} />
            <span className={`text-xs font-bold ${t.text.primary}`}>Capitalization</span>
          </div>
          <p className={`text-xl font-black ${t.text.primary}`}>{formatCurrency(biz.cost)}</p>
        </div>

        <div className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className={`text-xs font-bold ${t.text.primary}`}>Income Per Hour</span>
          </div>
          <p className="text-xl font-black text-blue-500">{formatCurrency(biz.incomePerHour)}</p>
        </div>

        <div className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}`}>
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="w-4 h-4 text-red-400" />
            <span className={`text-xs font-bold ${t.text.primary}`}>Tax Per Hour</span>
          </div>
          <p className="text-xl font-black text-red-400">-{formatCurrency(taxPerHour)}</p>
          <p className={`text-[10px] mt-1 ${t.text.tertiary}`}>
            Tax rate: {(taxRate * 100).toFixed(0)}% — Auto-deducted
          </p>
        </div>

        {/* Close Business */}
        <div>
          <p className={`text-xs font-medium mb-2 ${t.text.secondary}`}>
            Close your business and receive a portion of your capital back.
          </p>
          <button onClick={() => setShowCloseConfirm(true)}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-all mb-2
              border-2 border-red-500/30 text-red-500 active:scale-95
              ${isDark ? 'bg-red-500/10 hover:bg-red-500/15' : 'bg-red-50 hover:bg-red-100'}`}>
            Close Business (+60%) — {formatCurrency(closeRefund60)}
          </button>
          <button onClick={handleClose100}
            disabled={closeAdWatching}
            className={`w-full flex items-center justify-center gap-2
              py-3 rounded-xl text-sm font-bold transition-all
              ${closeAdWatching ? 'opacity-50' : ''}
              bg-gradient-to-r from-red-500 to-rose-600
              text-white shadow-lg shadow-red-500/20 active:scale-95`}>
            <MonitorPlay className="w-4 h-4" />
            {closeAdWatching ? 'Watching ad...' : `Close Business (+100%) — ${formatCurrency(closeRefund100)}`}
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showCloseConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4
          bg-black/60 backdrop-blur-sm" onClick={() => setShowCloseConfirm(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm rounded-2xl p-5
              ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className={`text-sm font-bold ${t.text.primary}`}>Close Business?</p>
                <p className={`text-xs ${t.text.secondary}`}>This action cannot be undone</p>
              </div>
            </div>
            <p className={`text-xs mb-4 ${t.text.secondary}`}>
              You will receive <span className="font-bold text-green-500">
              {formatCurrency(closeRefund60)}</span> (60% of {formatCurrency(biz.cost)}) back.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowCloseConfirm(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold
                  ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                Cancel
              </button>
              <button onClick={handleClose60}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold
                  bg-red-500 text-white active:scale-95">
                Close Business
              </button>
            </div>
          </div>
        </div>
      )}

      <AdSpace />
    </div>
  );
}

export default BusinessSettings;