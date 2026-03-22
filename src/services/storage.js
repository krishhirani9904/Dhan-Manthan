import { STORAGE_KEY, THEME_KEY, BOOST_STORAGE_KEY, BOOST_STATE_VERSION, AD_WATCH_TIME } from '../config/constants';

export const storage = {
  saveGame: (state) => {
    try {
      const data = JSON.stringify({ ...state, lastSaved: Date.now() });
      const sizeInMB = new Blob([data]).size / (1024 * 1024);
      if (sizeInMB > 4.5) {
        console.warn('Save data large:', sizeInMB.toFixed(2), 'MB');
      }
      localStorage.setItem(STORAGE_KEY, data);
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded!');
      }
      console.error('Save error:', e);
      return false;
    }
  },

  loadGame: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Load error:', e);
      localStorage.removeItem(STORAGE_KEY);
    }
    return null;
  },

  clearGame: () => localStorage.removeItem(STORAGE_KEY),

  saveTheme: (isDark) => {
    try { localStorage.setItem(THEME_KEY, JSON.stringify(isDark)); }
    catch (e) { console.error('Theme save error:', e); }
  },

  loadTheme: () => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved ? JSON.parse(saved) : true;
    } catch { return true; }
  },
};

// ═══════════════════════════════════════
// BOOST STATE PERSISTENCE
// For future: When real ads are added, this helps restore state
// ═══════════════════════════════════════

export const boostStorage = {
  saveBoostState: (boostState) => {
    try {
      const data = {
        version: BOOST_STATE_VERSION,
        boostActive: boostState.boostActive || false,
        boostEndTime: boostState.boostEndTime || null,
        adStatus: boostState.adStatus || 'idle',
        watchStartTime: boostState.watchStartTime || null,
        savedAt: Date.now(),
      };
      localStorage.setItem(BOOST_STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Boost save error:', e);
      return false;
    }
  },

  loadBoostState: () => {
    try {
      const raw = localStorage.getItem(BOOST_STORAGE_KEY);
      if (!raw) return null;

      const data = JSON.parse(raw);
      
      // Version check
      if (data.version !== BOOST_STATE_VERSION) {
        boostStorage.clearBoostState();
        return null;
      }

      // Check if boost already expired
      if (data.boostEndTime && Date.now() > data.boostEndTime) {
        boostStorage.clearBoostState();
        return null;
      }

      // Check if watching state expired (use constant instead of magic number)
      if (data.adStatus === 'watching' && data.watchStartTime) {
        const watchedDuration = (Date.now() - data.watchStartTime) / 1000;
        // If more than AD_WATCH_TIME + buffer passed, clear state
        if (watchedDuration > AD_WATCH_TIME + 3) {
          boostStorage.clearBoostState();
          return null;
        }
      }

      return data;
    } catch (e) {
      console.error('Boost load error:', e);
      boostStorage.clearBoostState();
      return null;
    }
  },

  clearBoostState: () => {
    try {
      localStorage.removeItem(BOOST_STORAGE_KEY);
    } catch (e) {
      console.error('Boost clear error:', e);
    }
  },
};