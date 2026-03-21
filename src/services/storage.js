import { STORAGE_KEY, THEME_KEY, BOOST_STORAGE_KEY, BOOST_STATE_VERSION } from '../config/constants';

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
// BOOST STATE PERSISTENCE (NEW)
// ═══════════════════════════════════════

export const boostStorage = {
  saveBoostState: (boostState) => {
    try {
      const data = {
        version: BOOST_STATE_VERSION,
        boostActive: boostState.boostActive,
        boostEndTime: boostState.boostEndTime,
        adStatus: boostState.adStatus,
        watchStartTime: boostState.watchStartTime,
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
      
      if (data.version !== BOOST_STATE_VERSION) {
        boostStorage.clearBoostState();
        return null;
      }

      if (data.boostEndTime && Date.now() > data.boostEndTime) {
        boostStorage.clearBoostState();
        return null;
      }

      if (data.adStatus === 'watching' && data.watchStartTime) {
        const watchedDuration = (Date.now() - data.watchStartTime) / 1000;
        if (watchedDuration > 5) {
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