import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { getCategoryById } from '../../data/businessCategories';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';

function BusinessCategory() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  const category = getCategoryById(categoryId);

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
  const subs = category.subCategories || [];

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/business/start')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <h1 className={`text-lg font-bold ${t.text.primary}`}>{category.name}</h1>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3">
        <p className={`text-xs font-medium mb-3 ${t.text.secondary}`}>
          Choose a type of {category.name.toLowerCase()}
        </p>
        <div className="space-y-2.5">
          {subs.map((sub) => (
            <button key={sub.id}
              onClick={() => navigate(`/business/setup/${categoryId}/${sub.id}`)}
              className={`w-full flex items-center justify-between
                px-4 py-3.5 rounded-xl text-left
                transition-all duration-200 active:scale-[0.98]
                border hover:border-yellow-500/50
                ${isDark
                  ? 'bg-gray-800/80 border-gray-700/50 hover:bg-gray-800'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}>
              <div>
                <p className={`text-sm font-bold ${t.text.primary}`}>{sub.name}</p>
                <p className={`text-xs mt-0.5 ${t.text.tertiary}`}>
                  Opening Cost: {formatCurrency(sub.cost)}
                </p>
              </div>
              <p className={`text-sm font-black ${t.text.brand}`}>
                {formatCurrency(sub.cost)}
              </p>
            </button>
          ))}
        </div>
      </div>
      <AdSpace />
    </div>
  );
}

export default BusinessCategory;