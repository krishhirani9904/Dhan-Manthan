// src/pages/NotFound.jsx
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, SearchX } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { theme } from '../design/tokens';

function NotFound() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  return (
    <div className={`h-screen flex flex-col items-center justify-center px-6
      ${t.bg.primary} transition-colors duration-300`}>
      
      <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6
        ${isDark ? 'bg-red-500/15' : 'bg-red-50'}`}>
        <SearchX className="w-12 h-12 text-red-500" />
      </div>

      <h1 className={`text-6xl font-black mb-2 ${t.text.primary}`}>404</h1>
      <p className={`text-lg font-bold mb-1 ${t.text.primary}`}>Page Not Found</p>
      <p className={`text-sm text-center max-w-xs mb-8 ${t.text.secondary}`}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex gap-3">
        <button onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold
            transition-all active:scale-95
            ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
        <button onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold
            bg-gradient-to-r from-yellow-500 to-amber-500 text-white
            shadow-lg shadow-amber-500/20 active:scale-95 transition-all">
          <Home className="w-4 h-4" />
          Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;