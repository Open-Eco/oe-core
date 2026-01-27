/**
 * EcoKit Media Query Utility
 * Reactive utility for handling media query changes
 */

class EcoMediaQuery {
  constructor(query, callback, options = {}) {
    this.query = query;
    this.callback = callback;
    this.options = {
      immediate: options.immediate !== false,
      ...options
    };
    
    this.mediaQuery = window.matchMedia(query);
    this.handleChange = this.handleChange.bind(this);
    
    this.init();
  }

  init() {
    this.mediaQuery.addEventListener('change', this.handleChange);
    
    if (this.options.immediate) {
      this.handleChange(this.mediaQuery);
    }
  }

  handleChange(mediaQuery) {
    this.callback(mediaQuery.matches, mediaQuery);
  }

  matches() {
    return this.mediaQuery.matches;
  }

  destroy() {
    this.mediaQuery.removeEventListener('change', this.handleChange);
  }
}

// Convenience function for common breakpoints
EcoMediaQuery.breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)'
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EcoMediaQuery;
}

