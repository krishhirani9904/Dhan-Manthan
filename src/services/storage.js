import { STORAGE_KEY, THEME_KEY } from '../config/constants';

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