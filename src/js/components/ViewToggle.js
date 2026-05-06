class ViewToggle {
  constructor() {
    this._callback = null;
  }

  init(toggleEl) {
    this._toggleEl = toggleEl;
    const buttons = toggleEl.querySelectorAll('[data-view]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        if (this._callback) {
          this._callback(view);
        }
      });
    });
  }

  onChange(callback) {
    this._callback = callback;
  }

  setActive(view) {
    const buttons = this._toggleEl.querySelectorAll('[data-view]');
    buttons.forEach(btn => {
      if (btn.getAttribute('data-view') === view) {
        btn.classList.add('view-toggle__btn--active');
      } else {
        btn.classList.remove('view-toggle__btn--active');
      }
    });
  }
}
