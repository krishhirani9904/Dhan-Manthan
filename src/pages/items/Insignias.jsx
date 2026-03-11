import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';
import { useGame } from '../../hooks/useGame';
import { INSIGNIAS } from '../../data/insigniasData';
import AdSpace from '../../components/common/AdSpace';

function InsigniasPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const gameState = useGame();
  const earned = gameState.earnedInsignias || [];

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary}`}>
      <div className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 ${t.bg.secondary} border-b ${t.border.default}`}>
        <button onClick={() => navigate('/items')} className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <ArrowLeft className={`w-4 h-4 ${t.text.primary}`} />
        </button>
        <h1 className={`text-lg font-bold ${t.text.primary}`}>Insignias</h1>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-2">
        {INSIGNIAS.map(ins => {
          const isEarned = earned.includes(ins.id) || ins.check(gameState);
          return (
            <div key={ins.id} className={`rounded-xl p-4 ${t.bg.card} border ${t.border.default} ${isEarned ? (isDark ? 'border-green-500/30' : 'border-green-200') : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ins.image}</span>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${t.text.primary}`}>{ins.name}</p>
                  <p className={`text-[10px] ${t.text.tertiary}`}>{ins.description}</p>
                </div>
                {isEarned ? <Check className="w-5 h-5 text-green-500" /> : <Lock className={`w-5 h-5 ${t.text.tertiary}`} />}
              </div>
            </div>
          );
        })}
      </div>
      <AdSpace />
    </div>
  );
}

export default InsigniasPage;