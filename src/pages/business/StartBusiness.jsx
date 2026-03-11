import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { BUSINESS_CATEGORIES } from '../../data/businessCategories';
import { formatCurrency } from '../../utils/formatCurrency';
import AdSpace from '../../components/common/AdSpace';

function StartBusiness() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  const handleCategoryClick = (category) => {
    if (category.subCategories && category.subCategories.length > 0) {
      navigate(`/business/category/${category.id}`);
    } else {
      navigate(`/business/setup/${category.id}`);
    }
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
        ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/business')}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            transition-colors duration-200
            ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Start a Business</h1>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3">
        <p className={`text-xs font-medium mb-3 ${t.text.secondary}`}>
          Choose a business category
        </p>

        {/* Grid - Square cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {BUSINESS_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`rounded-xl p-4 flex flex-col justify-between
                  aspect-square text-left
                  transition-all duration-200 active:scale-[0.95]
                  border hover:border-yellow-500/50
                  ${isDark
                    ? 'bg-gray-800/80 border-gray-700/50 hover:bg-gray-800'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {/* Top: Icon (large) */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center
                  ${category.color}`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Bottom: Name + Price */}
                <div className="mt-auto">
                  <p className={`text-lg font-bold leading-tight mb-1
                    ${t.text.primary} line-clamp-2`}>
                    {category.name}
                  </p>
                  <p className={`text-[16px] font-medium ${t.text.brand}`}>
                    From {formatCurrency(category.from)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <AdSpace />
    </div>
  );
}

export default StartBusiness;