import { useState, useEffect } from 'react';

/**
 * Reusable hook to monitor network connectivity
 * Returns: { isOnline: boolean, wasOffline: boolean }
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Track if user was offline (useful for showing "back online" messages)
      if (!isOnline) {
        setWasOffline(true);
        // Reset after 3 seconds
        setTimeout(() => setWasOffline(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Listen to browser events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);

  return { isOnline, wasOffline };
}