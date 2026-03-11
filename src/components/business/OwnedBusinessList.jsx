import { useNavigate } from 'react-router-dom';
import { Building2, ChevronRight } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useGame } from '../../hooks/useGame';
import { theme } from '../../design/tokens';
import { formatCurrency } from '../../utils/formatCurrency';
import { getCategoryById } from '../../data/businessCategories';

function OwnedBusinessList() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedBusinesses } = useGame();

  const getCategoryInfo = (categoryId) => {
    const cat = getCategoryById(categoryId);
    return cat
      ? { Icon: cat.icon, color: cat.color, name: cat.name }
      : { Icon: Building2, color: 'bg-gray-500', name: 'Unknown' };
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full">
      <h3 className={`text-sm font-bold mb-2 ${t.text.primary}`}>
        My Companies
      </h3>

      {(!ownedBusinesses || ownedBusinesses.length === 0) ? (
        <div className={`flex-1 flex items-center justify-center rounded-xl
          border border-dashed ${t.border.default}`}>
          <div className="text-center py-8">
            <Building2 className={`w-10 h-10 mx-auto mb-3 ${t.text.tertiary}`} />
            <p className={`text-sm font-medium ${t.text.secondary}`}>
              You don't own any businesses.
            </p>
            <p className={`text-xs mt-1 ${t.text.tertiary}`}>
              Start a business to see it here
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            {ownedBusinesses.map((biz) => {
              const { Icon, color } = getCategoryInfo(biz.categoryId);
              const level = biz.level || 1;

              return (
                <button
                  key={biz.id}
                  onClick={() => navigate(`/business/detail/${biz.id}`)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl
                    text-left transition-all duration-200 active:scale-[0.98]
                    ${t.bg.card} border ${t.border.default}
                    hover:border-yellow-500/30`}
                >
                  {/* Icon with business category color */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                    flex-shrink-0 ${color}`}>
                    <Icon className="w-5.5 h-5.5 text-white" />
                  </div>

                  {/* Info section */}
                  <div className="flex-1 min-w-0">
                    {/* Business Name */}
                    <p className={`text-sm font-bold truncate ${t.text.primary}`}>
                      {biz.name}
                    </p>
                    
                    {/* Category type */}
                    <p className={`text-[11px] mt-0.5 ${t.text.tertiary}`}>
                      {biz.categoryName}
                      {biz.subCategoryName ? ` • ${biz.subCategoryName}` : ''}
                    </p>

                    {/* Bottom row: Level left, Income right */}
                    <div className="flex items-center justify-between mt-1.5">
                      {/* Level */}
                      <span className={`text-[11px] font-medium ${t.text.secondary}`}>
                        Level {level} of 10
                      </span>

                      {/* Income */}
                      <div className="flex items-baseline gap-1">
                        <span className={`text-sm font-bold ${t.text.primary}`}>
                          {formatCurrency(biz.incomePerHour)}
                        </span>
                        <span className={`text-[10px] ${t.text.tertiary}`}>
                          per hour
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${t.text.tertiary}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnedBusinessList;