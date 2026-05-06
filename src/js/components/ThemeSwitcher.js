'use strict';

const THEMES = [
  { id: 'nostromo', name: 'NOSTROMO' },
  { id: 'amber',    name: 'AMBER'    },
  { id: 'folio',    name: 'FOLIO'    },
  { id: 'void',     name: 'VOID'     },
];

const VALID_THEME_IDS = new Set(THEMES.map(t => t.id));
const STORAGE_KEY = 'ontology-viewer-theme';
const DEFAULT_THEME_ID = 'nostromo';
const FLICKER_MIDPOINT_MS = 210;

class ThemeSwitcher {
  constructor(containerEl) {
    this._containerEl = containerEl;
    this._isAnimating = false;
    this._chips = new Map();

    this._renderChips();
    const initialTheme = this._loadFromStorage();
    this._applyDirect(initialTheme, true);
  }

  _loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return VALID_THEME_IDS.has(saved) ? saved : DEFAULT_THEME_ID;
    } catch (err) {
      return DEFAULT_THEME_ID;
    }
  }

  _saveToStorage(themeId) {
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
    } catch (err) {
      // silent — storage unavailable
    }
  }

  _renderChips() {
    const label = document.createElement('span');
    label.className = 'theme-switcher__label';
    label.textContent = 'THEME';
    label.setAttribute('aria-hidden', 'true');
    this._containerEl.appendChild(label);

    THEMES.forEach(theme => {
      const chip = document.createElement('button');
      chip.className = 'theme-chip';
      chip.dataset.themeId = theme.id;
      chip.setAttribute('aria-label', `テーマ: ${theme.name}`);
      chip.title = theme.name;
      chip.addEventListener('click', () => this.applyTheme(theme.id));
      this._containerEl.appendChild(chip);
      this._chips.set(theme.id, chip);
    });
  }

  _applyDirect(themeId, silent = false) {
    if (themeId === DEFAULT_THEME_ID) {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = themeId;
    }
    this._saveToStorage(themeId);
    this._syncActiveChip(themeId);
    if (!silent) {
      document.dispatchEvent(
        new CustomEvent('ontology-theme-change', { detail: { themeId } })
      );
    }
  }

  _syncActiveChip(themeId) {
    this._chips.forEach((chip, id) => {
      chip.classList.toggle('theme-chip--active', id === themeId);
    });
  }

  applyTheme(themeId) {
    if (this._isAnimating) return;
    if (!VALID_THEME_IDS.has(themeId)) return;

    const current = document.documentElement.dataset.theme || DEFAULT_THEME_ID;
    if (current === themeId) return;

    this._isAnimating = true;
    this._syncActiveChip(themeId);

    this._playFlicker(() => this._applyDirect(themeId)).then(() => {
      this._isAnimating = false;
    });
  }

  _playFlicker(onMidpoint) {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'crt-flicker-overlay';
      document.body.appendChild(overlay);

      setTimeout(onMidpoint, FLICKER_MIDPOINT_MS);

      overlay.addEventListener('animationend', () => {
        overlay.remove();
        resolve();
      }, { once: true });
    });
  }
}
