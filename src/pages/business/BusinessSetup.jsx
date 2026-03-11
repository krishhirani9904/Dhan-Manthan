import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Shuffle } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { getCategoryById } from '../../data/businessCategories';
import { getRandomBusinessName } from '../../utils/businessNames';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';

function BusinessSetup() {
  const navigate = useNavigate();
  const { categoryId, subCategoryId } = useParams();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { balance, buyBusiness } = useGame();

  const category = getCategoryById(categoryId);
  const subCategory = subCategoryId && category?.subCategories
    ? category.subCategories.find(s => s.id === subCategoryId) : null;

  const cost = subCategory ? subCategory.cost : (category?.from || 0);
  const typeName = subCategory ? subCategory.name : (category?.name || 'Business');

  const [name, setName] = useState(() =>
    getRandomBusinessName(categoryId, subCategoryId)
  );

  const canAfford = balance >= cost;

  const handleShuffle = useCallback(() => {
    setName(getRandomBusinessName(categoryId, subCategoryId));
  }, [categoryId, subCategoryId]);

  const handleStart = useCallback(() => {
    const trimmedName = name.trim();
    if (!canAfford || !trimmedName || trimmedName.length < 2) return;

    buyBusiness({
      name: trimmedName,
      categoryId,
      subCategoryId: subCategoryId || null,
      categoryName: category?.name || '',
      subCategoryName: subCategory?.name || '',
      cost,
    });
    navigate('/business');
  }, [canAfford, name, categoryId, subCategoryId, category, subCategory, cost, buyBusiness, navigate]);

  if (!category) {
    return (
      <div className={`h-screen flex flex-col items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Category not found</p>
        <button onClick={() => navigate('/business/start')}
          className="mt-4 text-yellow-500 underline text-sm">Go back</button>
      </div>
    );
  }

  const Icon = category.icon;

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button
          onClick={() => {
            if (subCategoryId) navigate(`/business/category/${categoryId}`);
            else navigate('/business/start');
          }}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Enter {typeName} Name</h1>
      </div>

      <div className="flex-1 flex flex-col px-4 py-6 max-w-lg mx-auto w-full">
        <div className="flex justify-center mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${category.color}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>

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
            className={`flex-1 py-3 pr-4 text-sm font-medium outline-none bg-transparent
              ${t.text.primary}`} />
        </div>

        <div className={`rounded-xl p-4 mb-6
          ${isDark ? 'bg-gray-800/60' : 'bg-gray-50'} border ${t.border.default}`}>
          <p className={`text-xs font-medium mb-1 ${t.text.secondary}`}>Opening Cost</p>
          <p className={`text-2xl font-black ${t.text.brand}`}>{formatCurrency(cost)}</p>
          {!canAfford && (
            <p className="text-[10px] text-red-400 mt-1">
              You need {formatCurrency(cost - balance)} more
            </p>
          )}
        </div>

        <button onClick={handleStart}
          disabled={!canAfford || !name.trim() || name.trim().length < 2}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all
            ${canAfford && name.trim().length >= 2
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-95'
              : isDark ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
          {canAfford
            ? `Start ${name.trim() || typeName}`
            : `Need ${formatCurrency(cost - balance)} more`
          }
        </button>

        <p className={`text-center text-[10px] mt-3 ${t.text.tertiary}`}>
          Your balance: {formatCurrency(balance)}
        </p>
      </div>
      <AdSpace />
    </div>
  );
}

export default BusinessSetup;