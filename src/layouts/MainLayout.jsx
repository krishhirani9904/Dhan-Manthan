import { Outlet } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { theme } from '../design/tokens';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';
import AdSpace from '../components/common/AdSpace';

function MainLayout() {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  return (
    <div className={`h-screen overflow-hidden flex flex-col
      ${t.bg.primary} transition-colors duration-300`}>
      <Header />
      <main className="flex-1 min-h-0 pt-16">
        <Outlet />
      </main>
      <Navbar />
      <AdSpace />
    </div>
  );
}

export default MainLayout;