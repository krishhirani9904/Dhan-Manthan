// src/components/business/ManagementHeader.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';

function ManagementHeader({ bizId, title, subtitle, icon: IconComp, iconColor }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  return (
    <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3
      ${t.bg.secondary} border-b ${t.border.default}`}>
      <button onClick={() => navigate(`/business/detail/${bizId}`)}
        className={`w-9 h-9 rounded-xl flex items-center justify-center
          ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
        <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
      </button>
      <div className="flex items-center gap-2.5">
        {IconComp && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center
            ${isDark ? 'bg-opacity-15' : 'bg-opacity-10'}`}
            style={{ backgroundColor: 'currentColor', opacity: 0 }}>
            <IconComp className={`w-4 h-4 ${iconColor}`} />
          </div>
        )}
        <div>
          <h1 className={`text-lg font-bold ${t.text.primary}`}>{title}</h1>
          {subtitle && <p className={`text-[10px] ${t.text.tertiary}`}>{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export default ManagementHeader;