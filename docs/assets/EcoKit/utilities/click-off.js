/**
 * EcoKit Click-Off Utility
 * Standardized utility for handling click-outside events
 */

class EcoClickOff {
  constructor(element, callback, options = {}) {
    this.element = element;
    this.callback = callback;
    this.options = {
      exclude: options.exclude || [],
      enabled: options.enabled !== false,
      ...options
    };
    
    this.handleClick = this.handleClick.bind(this);
    this.init();
  }

  init() {
    if (this.options.enabled) {
      this.enable();
    }
  }

  handleClick(event) {
    // Check if click is inside the element
    if (this.element && this.element.contains(event.target)) {
      return;
    }

    // Check if click is on any excluded elements
    for (const exclude of this.options.exclude) {
      if (typeof exclude === 'string') {
        const elements = document.querySelectorAll(exclude);
        for (const el of elements) {
          if (el.contains(event.target)) {
            return;
          }
        }
      } else if (exclude && exclude.contains && exclude.contains(event.target)) {
        return;
      }
    }

    // Click is outside, call callback
    this.callback(event);
  }

  enable() {
    if (!this.isEnabled) {
      document.addEventListener('click', this.handleClick, true);
      this.isEnabled = true;
    }
  }

  disable() {
    if (this.isEnabled) {
      document.removeEventListener('click', this.handleClick, true);
      this.isEnabled = false;
    }
  }

  destroy() {
    this.disable();
    this.element = null;
    this.callback = null;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EcoClickOff;
}

