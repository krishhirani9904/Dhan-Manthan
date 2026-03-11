// src/pages/investing/Investing.jsx
import { useState, useRef } from 'react';
import { TrendingUp } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import SharesTab from '../../components/investing/SharesTab';
import RealEstateTab from '../../components/investing/RealEstateTab';
import CryptoTab from '../../components/investing/CryptoTab';

const TABS = [
  { id: 'shares', label: 'Shares' },
  { id: 'realestate', label: 'Real Estate' },
  { id: 'crypto', label: 'Cryptocurrency' },
];

function Investing() {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const [activeTab, setActiveTab] = useState('shares');
  const containerRef = useRef(null);

  // Swipe logic
  const touchStart = useRef(null);
  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    const idx = TABS.findIndex(t => t.id === activeTab);
    if (diff > 50 && idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id);
    if (diff < -50 && idx > 0) setActiveTab(TABS[idx - 1].id);
    touchStart.current = null;
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-2 px-3 pt-2 pb-1">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center
          ${isDark ? 'bg-green-500/15' : 'bg-green-50'}`}>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <h2 className={`text-lg font-extrabold ${t.text.primary}`}>Investing</h2>
      </div>

      {/* Sliding Tabs */}
      <div className="flex-shrink-0 px-3 pb-2">
        <div className={`flex rounded-xl p-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {TABS.map(tab => (
            <button key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all
                ${activeTab === tab.id
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                  : t.text.secondary
                }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeTab === 'shares' && <SharesTab />}
        {activeTab === 'realestate' && <RealEstateTab />}
        {activeTab === 'crypto' && <CryptoTab />}
      </div>
    </div>
  );
}

export default Investing;