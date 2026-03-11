import { useLocation, useNavigate } from 'react-router-dom';
import { IndianRupee, Briefcase, TrendingUp, ShoppingBag, User } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';

const TABS = [
  { name: 'Investing', path: '/investing', icon: TrendingUp, color: 'green' },
  { name: 'Business', path: '/business', icon: Briefcase, color: 'blue' },
  { name: 'Earnings', path: '/earnings', icon: IndianRupee, color: 'yellow' },
  { name: 'Items', path: '/items', icon: ShoppingBag, color: 'purple' },
  { name: 'Profile', path: '/profile', icon: User, color: 'pink' },
];

const colorMap = {
  blue:   { bg: 'bg-blue-500',   shadow: 'shadow-blue-500/40',   text: 'text-blue-500' },
  green:  { bg: 'bg-green-500',  shadow: 'shadow-green-500/40',  text: 'text-green-500' },
  yellow: { bg: 'bg-yellow-500', shadow: 'shadow-yellow-500/40', text: 'text-yellow-500' },
  purple: { bg: 'bg-purple-500', shadow: 'shadow-purple-500/40', text: 'text-purple-500' },
  pink:   { bg: 'bg-pink-500',   shadow: 'shadow-pink-500/40',   text: 'text-pink-500' },
};

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  const isActive = (path) => {
    if (location.pathname === '/' && path === '/earnings') return true;
    return location.pathname === path;
  };

  return (
    <nav className={`flex-shrink-0 mx-2 rounded-2xl
      ${t.bg.secondary} border ${t.border.strong}
      transition-colors duration-300
      shadow-lg ${isDark ? 'shadow-black/30' : 'shadow-gray-300/50'}`}>
      <ul className="flex items-center justify-around h-14 sm:h-16 lg:h-14 px-1">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          const c = colorMap[tab.color];

          return (
            <li key={tab.name} className="flex-1 flex justify-center">
              <button
                onClick={() => navigate(tab.path)}
                className="flex items-center justify-center transition-all duration-200
                  flex-col sm:flex-col lg:flex-row lg:gap-1.5"
              >
                <div className={`flex items-center justify-center transition-all duration-300
                  w-9 h-9 rounded-xl
                  ${active
                    ? `${c.bg} ${c.shadow} shadow-md`
                    : isDark ? 'bg-gray-800/50' : 'bg-gray-100/80'
                  }`}>
                  <Icon className={`w-4 h-4 transition-all duration-200
                    ${active ? 'text-white' : t.text.secondary}`} />
                </div>
                <span className={`font-medium transition-colors
                  hidden sm:block
                  text-[10px] sm:mt-0.5 lg:mt-0 lg:text-sm md:text-sm
                  ${active
                    ? (isDark ? 'text-white' : c.text)
                    : t.text.secondary
                  }`}>
                  {tab.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Navbar;