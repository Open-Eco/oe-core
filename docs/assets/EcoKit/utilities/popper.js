/**
 * EcoKit Popper Utility
 * Simple positioning utility for tooltips, popovers, and dropdowns
 */

class EcoPopper {
  constructor(element, target, options = {}) {
    this.element = element;
    this.target = target;
    this.options = {
      placement: options.placement || 'bottom',
      offset: options.offset || 8,
      arrow: options.arrow !== false,
      ...options
    };
    this.arrowElement = null;
    this.isVisible = false;
    
    this.init();
  }

  init() {
    if (this.options.arrow) {
      this.createArrow();
    }
    
    this.updatePosition();
    this.setupListeners();
  }

  createArrow() {
    this.arrowElement = document.createElement('div');
    this.arrowElement.className = 'eco-popper__arrow';
    this.element.appendChild(this.arrowElement);
  }

  updatePosition() {
    if (!this.element || !this.target) return;

    const targetRect = this.target.getBoundingClientRect();
    const elementRect = this.element.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    let top = 0;
    let left = 0;
    let arrowPosition = {};

    const placement = this.getPlacement();

    switch (placement) {
      case 'top':
        top = targetRect.top + scrollY - elementRect.height - this.options.offset;
        left = targetRect.left + scrollX + (targetRect.width / 2) - (elementRect.width / 2);
        arrowPosition = { bottom: -8, left: '50%', transform: 'translateX(-50%)' };
        break;
      case 'bottom':
        top = targetRect.bottom + scrollY + this.options.offset;
        left = targetRect.left + scrollX + (targetRect.width / 2) - (elementRect.width / 2);
        arrowPosition = { top: -8, left: '50%', transform: 'translateX(-50%)' };
        break;
      case 'left':
        top = targetRect.top + scrollY + (targetRect.height / 2) - (elementRect.height / 2);
        left = targetRect.left + scrollX - elementRect.width - this.options.offset;
        arrowPosition = { right: -8, top: '50%', transform: 'translateY(-50%)' };
        break;
      case 'right':
        top = targetRect.top + scrollY + (targetRect.height / 2) - (elementRect.height / 2);
        left = targetRect.right + scrollX + this.options.offset;
        arrowPosition = { left: -8, top: '50%', transform: 'translateY(-50%)' };
        break;
    }

    // Keep within viewport
    const padding = 8;
    if (left < padding) left = padding;
    if (left + elementRect.width > window.innerWidth - padding) {
      left = window.innerWidth - elementRect.width - padding;
    }
    if (top < padding) top = padding;
    if (top + elementRect.height > window.innerHeight + scrollY - padding) {
      top = window.innerHeight + scrollY - elementRect.height - padding;
    }

    this.element.style.position = 'absolute';
    this.element.style.top = `${top}px`;
    this.element.style.left = `${left}px`;
    this.element.style.zIndex = '1000';

    if (this.arrowElement) {
      Object.assign(this.arrowElement.style, arrowPosition);
    }
  }

  getPlacement() {
    // Auto-adjust placement if element would go off-screen
    const targetRect = this.target.getBoundingClientRect();
    const elementRect = this.element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let placement = this.options.placement;

    if (placement === 'bottom' && targetRect.bottom + elementRect.height > viewportHeight) {
      placement = 'top';
    } else if (placement === 'top' && targetRect.top - elementRect.height < 0) {
      placement = 'bottom';
    } else if (placement === 'right' && targetRect.right + elementRect.width > viewportWidth) {
      placement = 'left';
    } else if (placement === 'left' && targetRect.left - elementRect.width < 0) {
      placement = 'right';
    }

    return placement;
  }

  setupListeners() {
    window.addEventListener('resize', () => this.updatePosition());
    window.addEventListener('scroll', () => this.updatePosition(), true);
  }

  show() {
    this.element.style.display = 'block';
    this.isVisible = true;
    this.updatePosition();
  }

  hide() {
    this.element.style.display = 'none';
    this.isVisible = false;
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  destroy() {
    window.removeEventListener('resize', () => this.updatePosition());
    window.removeEventListener('scroll', () => this.updatePosition(), true);
    if (this.arrowElement) {
      this.arrowElement.remove();
    }
  }
}

// CSS for popper arrow
const popperStyles = `
.eco-popper__arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.eco-popper__arrow[style*="bottom"] {
  border-width: 8px 8px 0 8px;
  border-color: var(--neutral-200) transparent transparent transparent;
}

.eco-popper__arrow[style*="top"] {
  border-width: 0 8px 8px 8px;
  border-color: transparent transparent var(--neutral-200) transparent;
}

.eco-popper__arrow[style*="left"] {
  border-width: 8px 0 8px 8px;
  border-color: transparent transparent transparent var(--neutral-200);
}

.eco-popper__arrow[style*="right"] {
  border-width: 8px 8px 8px 0;
  border-color: transparent var(--neutral-200) transparent transparent;
}
`;

// Inject styles if not already present
if (!document.getElementById('eco-popper-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'eco-popper-styles';
  styleSheet.textContent = popperStyles;
  document.head.appendChild(styleSheet);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EcoPopper;
}

