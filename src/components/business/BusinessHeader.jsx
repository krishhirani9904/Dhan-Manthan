import { Briefcase } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';

function BusinessHeader() {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  return (
    <div className="flex-shrink-0 flex items-center gap-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center
        ${isDark ? 'bg-blue-500/15' : 'bg-blue-50'}`}>
        <Briefcase className="w-5 h-5 text-blue-500" />
      </div>
      <h2 className={`text-lg font-extrabold ${t.text.primary}`}>Business</h2>
    </div>
  );
}

export default BusinessHeader;