import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../design/tokens';

/**
 * Reusable network status indicator
 * Shows offline warning & reconnection success
 */
function NetworkStatus() {
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { isOnline, wasOffline } = useNetworkStatus();

  // Don't render anything if online and was never offline
  if (isOnline && !wasOffline) return null;

  return (
    <>
      {/* Offline Warning */}
      {!isOnline && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50
          px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-md
          border animate-slide-up
          ${isDark 
            ? 'bg-red-500/90 border-red-400 text-white' 
            : 'bg-red-500 border-red-400 text-white'
          }`}>
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <div>
              <p className="text-sm font-bold">No Internet Connection</p>
              <p className="text-xs opacity-90">
                Please On Your Internet Connection
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Back Online Success */}
      {isOnline && wasOffline && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50
          px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-md
          border animate-slide-up
          ${isDark 
            ? 'bg-green-500/90 border-green-400 text-white' 
            : 'bg-green-500 border-green-400 text-white'
          }`}>
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            <div>
              <p className="text-sm font-bold">Back Online!</p>
              <p className="text-xs opacity-90">
                Internet connection restored
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NetworkStatus;