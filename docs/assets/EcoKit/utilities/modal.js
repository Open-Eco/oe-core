/**
 * EcoKit Modal Utility
 * Simple modal/dialog utility
 */

class EcoModal {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      closeOnBackdrop: options.closeOnBackdrop !== false,
      closeOnEscape: options.closeOnEscape !== false,
      trapFocus: options.trapFocus !== false,
      ...options
    };
    
    this.backdrop = null;
    this.isOpen = false;
    this.previouslyFocusedElement = null;
    this.focusableElements = [];
    
    this.init();
  }

  init() {
    this.createBackdrop();
    this.setupEventListeners();
  }

  createBackdrop() {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'eco-modal__backdrop';
    this.backdrop.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      opacity: 0;
      transition: opacity var(--duration-normal) var(--easing-ease-out);
      pointer-events: none;
    `;
    document.body.appendChild(this.backdrop);
    
    if (this.options.closeOnBackdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }
  }

  setupEventListeners() {
    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', this.handleEscape.bind(this));
    }
  }

  handleEscape(event) {
    if (event.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }

  getFocusableElements() {
    const selector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(this.element.querySelectorAll(selector));
  }

  trapFocus() {
    if (!this.options.trapFocus) return;
    
    this.focusableElements = this.getFocusableElements();
    
    if (this.focusableElements.length === 0) return;
    
    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];
    
    this.element.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.previouslyFocusedElement = document.activeElement;
    
    // Show backdrop
    this.backdrop.style.pointerEvents = 'auto';
    setTimeout(() => {
      this.backdrop.style.opacity = '1';
    }, 10);
    
    // Show modal
    this.element.style.display = 'block';
    this.element.style.zIndex = '1000';
    this.element.setAttribute('aria-hidden', 'false');
    this.element.setAttribute('aria-modal', 'true');
    this.element.setAttribute('role', 'dialog');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    this.trapFocus();
    const firstFocusable = this.getFocusableElements()[0];
    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      this.element.focus();
    }
    
    // Trigger custom event
    this.element.dispatchEvent(new CustomEvent('eco-modal:open'));
  }

  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    
    // Hide backdrop
    this.backdrop.style.opacity = '0';
    setTimeout(() => {
      this.backdrop.style.pointerEvents = 'none';
    }, 200);
    
    // Hide modal
    this.element.style.display = 'none';
    this.element.setAttribute('aria-hidden', 'true');
    this.element.removeAttribute('aria-modal');
    this.element.removeAttribute('role');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Restore focus
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
    
    // Trigger custom event
    this.element.dispatchEvent(new CustomEvent('eco-modal:close'));
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  destroy() {
    this.close();
    if (this.backdrop) {
      this.backdrop.remove();
    }
    document.removeEventListener('keydown', this.handleEscape);
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EcoModal;
}

