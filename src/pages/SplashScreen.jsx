import { Crown } from 'lucide-react';

function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600
          flex items-center justify-center shadow-2xl shadow-yellow-500/30">
          <Crown className="w-12 h-12 text-white" strokeWidth={2} />
        </div>
        <div className="absolute inset-0 w-24 h-24 rounded-full border-2
          border-yellow-400/30 animate-ping" />
      </div>
      <h1 className="text-3xl font-black text-white tracking-tight">
        Dhan<span className="text-yellow-500">-Manthan</span>
      </h1>
      <p className="text-gray-500 text-sm mt-2 tracking-wider">Paisa Hi Paisa</p>
      <div className="mt-12 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"
          style={{ animation: 'loading-bar 2s ease-in-out forwards' }} />
      </div>
      <p className="text-gray-600 text-xs mt-3">Loading...</p>
    </div>
  );
}

export default SplashScreen;