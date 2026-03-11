import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';

function PageHeader({ title, subtitle, backTo, onBack, rightContent }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  const handleBack = () => {
    if (onBack) onBack();
    else if (backTo) navigate(backTo);
    else if (window.history.length > 2) navigate(-1);
    else navigate('/');
  };

  return (
    <div className={`flex-shrink-0 flex items-center justify-between gap-3 px-4 py-3
      ${t.bg.secondary} border-b ${t.border.default}`}>
      <div className="flex items-center gap-3">
        <button onClick={handleBack}
          className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
            transition-colors active:scale-90`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <div>
          <h1 className={`text-lg font-bold ${t.text.primary}`}>{title}</h1>
          {subtitle && <p className={`text-[10px] ${t.text.tertiary}`}>{subtitle}</p>}
        </div>
      </div>
      {rightContent}
    </div>
  );
}

export default PageHeader;