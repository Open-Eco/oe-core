/**
 * EcoKit Resize Utility
 * Provides a reusable resize handle for resizing elements
 */
class EcoResize {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      direction: options.direction || 'horizontal', // 'horizontal' or 'vertical'
      minSize: options.minSize || 100,
      maxSize: options.maxSize || Infinity,
      handleWidth: options.handleWidth || 4,
      onResize: options.onResize || null,
      onResizeStart: options.onResizeStart || null,
      onResizeEnd: options.onResizeEnd || null,
      ...options
    };

    this.isResizing = false;
    this.startX = 0;
    this.startY = 0;
    this.startSize = 0;

    this.init();
  }

  init() {
    // Create resize handle
    this.handle = document.createElement('div');
    this.handle.className = 'eco-resize-handle';
    this.handle.style.cssText = `
      position: absolute;
      ${this.options.direction === 'horizontal' ? 'right: 0; top: 0; width: ' + this.options.handleWidth + 'px; height: 100%; cursor: col-resize;' : 'bottom: 0; left: 0; width: 100%; height: ' + this.options.handleWidth + 'px; cursor: row-resize;'}
      z-index: 10;
      background: transparent;
      transition: background var(--duration-fast) var(--easing-ease-out);
    `;

    // Add hover effect
    this.handle.addEventListener('mouseenter', () => {
      if (!this.isResizing) {
        this.handle.style.background = 'var(--brand-blue-600)';
      }
    });

    this.handle.addEventListener('mouseleave', () => {
      if (!this.isResizing) {
        this.handle.style.background = 'transparent';
      }
    });

    // Make element position relative if not already
    const computedStyle = window.getComputedStyle(this.element);
    if (computedStyle.position === 'static') {
      this.element.style.position = 'relative';
    }

    // Append handle to element
    this.element.appendChild(this.handle);

    // Bind events
    this.handle.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseup', () => this.handleMouseUp());
  }

  handleMouseDown(e) {
    this.isResizing = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

    if (this.options.direction === 'horizontal') {
      this.startSize = parseInt(window.getComputedStyle(this.element).width, 10);
    } else {
      this.startSize = parseInt(window.getComputedStyle(this.element).height, 10);
    }

    document.body.style.cursor = this.options.direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
    this.handle.style.background = 'var(--brand-blue-700)';

    if (this.options.onResizeStart) {
      this.options.onResizeStart(this.startSize);
    }

    e.preventDefault();
  }

  handleMouseMove(e) {
    if (!this.isResizing) return;

    let newSize;
    if (this.options.direction === 'horizontal') {
      newSize = this.startSize + (e.clientX - this.startX);
    } else {
      newSize = this.startSize + (e.clientY - this.startY);
    }

    // Apply min/max constraints
    newSize = Math.max(this.options.minSize, Math.min(this.options.maxSize, newSize));

    // Update element size
    if (this.options.direction === 'horizontal') {
      this.element.style.width = newSize + 'px';
    } else {
      this.element.style.height = newSize + 'px';
    }

    // Call resize callback
    if (this.options.onResize) {
      this.options.onResize(newSize);
    }
  }

  handleMouseUp() {
    if (!this.isResizing) return;

    this.isResizing = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    this.handle.style.background = 'transparent';

    const finalSize = this.options.direction === 'horizontal'
      ? parseInt(window.getComputedStyle(this.element).width, 10)
      : parseInt(window.getComputedStyle(this.element).height, 10);

    if (this.options.onResizeEnd) {
      this.options.onResizeEnd(finalSize);
    }
  }

  destroy() {
    if (this.handle && this.handle.parentNode) {
      this.handle.parentNode.removeChild(this.handle);
    }
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EcoResize;
}

