import { Crown } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import ThemeToggle from './ThemeToggle';
import logo from '../../assets/logo2.png';

function Header() {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50
      ${t.bg.secondary} border-b ${t.border.strong}
      transition-colors duration-300 mx-2 mt-1 rounded-2xl`}>
      <div className="px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            {/* <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600
              flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Crown className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div> */}

            {/* <div className="w-90 h-12 rounded-xl overflow-hidden shadow-lg"> */}
              <img src={logo} alt="logo" className={`h-10 w-auto max-w-[200px] object-contain`} /> 
              {/* </div> */}
            {/* <div>
              <h1 className={`text-xl font-bold leading-none ${t.text.primary}`}>
                Dhan<span className={t.text.brand}>-Manthan</span>
              </h1>
              <p className={`text-[12px] ${t.text.tertiary} leading-none mt-0.5`}>
                Paisa Hi Paisa
              </p>
            </div> */}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;