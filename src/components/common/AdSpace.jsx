import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';

function AdSpace() {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  return (
    <div className={`flex-shrink-0 mx-2 mb-2 rounded-xl overflow-hidden
      ${t.bg.card} border ${t.border.default}`}>
      <div className={`h-14 flex items-center justify-center
        ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
        <span className={`text-xs ${t.text.tertiary}`}>
          Ad Space — Google AdSense
        </span>
      </div>
    </div>
  );
}

export default AdSpace;