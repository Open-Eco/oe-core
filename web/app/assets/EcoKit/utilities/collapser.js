/**
 * EcoKit Collapser Utility
 * Provides reusable collapse/expand functionality for any element
 */
class EcoCollapser {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      collapsedClass: options.collapsedClass || 'eco-collapsed',
      triggerSelector: options.triggerSelector || null, // Selector for trigger button
      onCollapse: options.onCollapse || null,
      onExpand: options.onExpand || null,
      onToggle: options.onToggle || null,
      persistState: options.persistState !== false, // Default to true
      storageKey: options.storageKey || null, // localStorage key for persistence
      direction: options.direction || 'horizontal', // 'horizontal' or 'vertical'
      collapsedValue: options.collapsedValue || '0', // Value when collapsed (e.g., '0', '0px')
      expandedValue: options.expandedValue || null, // Value when expanded (null = auto)
      animate: options.animate !== false, // Default to true
      ...options
    };

    this.isCollapsed = this.element.classList.contains(this.options.collapsedClass);
    this.init();
  }

  init() {
    // Set up trigger if provided
    if (this.options.triggerSelector) {
      const trigger = typeof this.options.triggerSelector === 'string'
        ? document.querySelector(this.options.triggerSelector)
        : this.options.triggerSelector;
      
      if (trigger) {
        trigger.addEventListener('click', () => this.toggle());
      }
    }

    // Restore state from localStorage if persistence is enabled
    if (this.options.persistState && this.options.storageKey) {
      const savedState = localStorage.getItem(this.options.storageKey);
      if (savedState === 'true') {
        this.collapse(false); // false = don't save to localStorage (already saved)
      } else if (savedState === 'false') {
        this.expand(false);
      }
    } else {
      // Apply initial state
      if (this.isCollapsed) {
        this.applyCollapsedState();
      } else {
        this.applyExpandedState();
      }
    }
  }

  toggle(animate = true) {
    if (this.isCollapsed) {
      this.expand(animate);
    } else {
      this.collapse(animate);
    }
  }

  collapse(animate = true) {
    if (this.isCollapsed) return;

    this.isCollapsed = true;
    this.element.classList.add(this.options.collapsedClass);
    
    if (animate && this.options.animate) {
      this.animateToCollapsed();
    } else {
      this.applyCollapsedState();
    }

    // Save state
    if (this.options.persistState && this.options.storageKey) {
      localStorage.setItem(this.options.storageKey, 'true');
    }

    // Callbacks
    if (this.options.onCollapse) {
      this.options.onCollapse(this);
    }
    if (this.options.onToggle) {
      this.options.onToggle(this, true);
    }

    this.element.dispatchEvent(new CustomEvent('eco-collapse', {
      detail: { collapsed: true }
    }));
  }

  expand(animate = true) {
    if (!this.isCollapsed) return;

    this.isCollapsed = false;
    this.element.classList.remove(this.options.collapsedClass);
    
    if (animate && this.options.animate) {
      this.animateToExpanded();
    } else {
      this.applyExpandedState();
    }

    // Save state
    if (this.options.persistState && this.options.storageKey) {
      localStorage.setItem(this.options.storageKey, 'false');
    }

    // Callbacks
    if (this.options.onExpand) {
      this.options.onExpand(this);
    }
    if (this.options.onToggle) {
      this.options.onToggle(this, false);
    }

    this.element.dispatchEvent(new CustomEvent('eco-expand', {
      detail: { collapsed: false }
    }));
  }

  applyCollapsedState() {
    if (this.options.direction === 'horizontal') {
      this.element.style.width = this.options.collapsedValue;
      this.element.style.minWidth = this.options.collapsedValue;
    } else {
      this.element.style.height = this.options.collapsedValue;
      this.element.style.minHeight = this.options.collapsedValue;
    }
  }

  applyExpandedState() {
    if (this.options.direction === 'horizontal') {
      if (this.options.expandedValue) {
        this.element.style.width = this.options.expandedValue;
      } else {
        this.element.style.width = '';
      }
      this.element.style.minWidth = '';
    } else {
      if (this.options.expandedValue) {
        this.element.style.height = this.options.expandedValue;
      } else {
        this.element.style.height = '';
      }
      this.element.style.minHeight = '';
    }
  }

  animateToCollapsed() {
    // Get current dimensions
    const rect = this.element.getBoundingClientRect();
    const currentSize = this.options.direction === 'horizontal' ? rect.width : rect.height;
    
    // Set transition
    const property = this.options.direction === 'horizontal' ? 'width' : 'height';
    this.element.style.transition = `${property} var(--duration-normal) var(--easing-ease-out)`;
    
    // Apply collapsed state
    this.applyCollapsedState();
  }

  animateToExpanded() {
    // Set transition
    const property = this.options.direction === 'horizontal' ? 'width' : 'height';
    this.element.style.transition = `${property} var(--duration-normal) var(--easing-ease-out)`;
    
    // Apply expanded state
    this.applyExpandedState();
  }

  getCollapsed() {
    return this.isCollapsed;
  }

  setCollapsed(collapsed, animate = true) {
    if (collapsed) {
      this.collapse(animate);
    } else {
      this.expand(animate);
    }
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EcoCollapser;
}

