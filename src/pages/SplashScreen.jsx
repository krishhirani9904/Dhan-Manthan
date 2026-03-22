// src/pages/SplashScreen.jsx
import { useState } from 'react';
import { Crown } from 'lucide-react';
import { storage } from '../services/storage';

function SplashScreen() {
  const [isDark] = useState(() => {
    try {
      return storage.loadTheme();
    } catch {
      return true;
    }
  });

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center
        ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}
    >
      {/* Crown Logo */}
      <div className="relative mb-8">
        <div
          className={`w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400
            to-amber-600 flex items-center justify-center shadow-2xl
            ${isDark ? 'shadow-yellow-500/30' : 'shadow-yellow-500/20'}`}
        >
          <Crown className="w-12 h-12 text-white" strokeWidth={2} />
        </div>

        {/* Ping Ring */}
        <div
          className={`absolute inset-0 w-24 h-24 rounded-full border-2
            animate-ping
            ${isDark ? 'border-yellow-400/30' : 'border-yellow-500/25'}`}
        />
      </div>

      {/* Title */}
      <h1
        className={`text-3xl font-black tracking-tight
          ${isDark ? 'text-white' : 'text-gray-900'}`}
      >
        Dhan
        <span className={isDark ? 'text-yellow-500' : 'text-yellow-600'}>
          -Manthan
        </span>
      </h1>

      {/* Tagline */}
      <p
        className={`text-sm mt-2 tracking-wider
          ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
      >
        Paisa Hi Paisa
      </p>

      {/* Loading Bar */}
      <div
        className={`mt-12 w-48 h-1 rounded-full overflow-hidden
          ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
      >
        <div
          className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"
          style={{ animation: 'loading-bar 2s ease-in-out forwards' }}
        />
      </div>

      {/* Loading Text */}
      <p
        className={`text-xs mt-3
          ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
      >
        Loading...
      </p>
    </div>
  );
}

export default SplashScreen;