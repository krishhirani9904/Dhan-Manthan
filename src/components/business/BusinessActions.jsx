import { useNavigate } from 'react-router-dom';
import { Plus, GitMerge } from 'lucide-react';

function BusinessActions() {
  const navigate = useNavigate();

  return (
    <div className="flex-shrink-0 flex gap-2.5 w-full">
      <button
        onClick={() => navigate('/business/start')}
        className="flex-1 flex items-center justify-center gap-2
          py-2.5 rounded-xl font-semibold text-sm
          transition-all duration-200 active:scale-[0.97]
          bg-gradient-to-r from-blue-500 to-blue-600
          text-white shadow-lg shadow-blue-500/25
          hover:shadow-blue-500/40"
      >
        <Plus className="w-5 h-5" />
        <span className="text-xs sm:text-sm">Start a Business</span>
      </button>

      <button
        onClick={() => navigate('/business/mergers')}
        className="flex-1 flex items-center justify-center gap-2
          py-2.5 rounded-xl font-semibold text-sm
          transition-all duration-200 active:scale-[0.97]
          bg-gradient-to-r from-purple-500 to-violet-600
          text-white shadow-lg shadow-purple-500/25
          hover:shadow-purple-500/40"
      >
        <GitMerge className="w-4 h-4" />
        <span className="text-xs sm:text-sm">Business Mergers</span>
      </button>
    </div>
  );
}

export default BusinessActions;