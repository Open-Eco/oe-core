/**
 * EcoKit Accordion Component
 * Handles accordion expand/collapse functionality
 */
class EcoAccordion {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      allowMultiple: options.allowMultiple || false,
      ...options
    };

    this.items = Array.from(element.querySelectorAll('.eco-accordion__item'));
    this.init();
  }

  init() {
    this.items.forEach(item => {
      const trigger = item.querySelector('.eco-accordion__trigger');
      const content = item.querySelector('.eco-accordion__content');

      if (!trigger || !content) return;

      trigger.addEventListener('click', () => {
        this.toggleItem(item, trigger, content);
      });
    });
  }

  toggleItem(item, trigger, content) {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

    if (this.options.allowMultiple) {
      // Allow multiple items to be open
      if (isExpanded) {
        this.collapseItem(trigger, content);
      } else {
        this.expandItem(trigger, content);
      }
    } else {
      // Only allow one item open at a time
      if (isExpanded) {
        this.collapseItem(trigger, content);
      } else {
        // Close all other items
        this.items.forEach(otherItem => {
          if (otherItem !== item) {
            const otherTrigger = otherItem.querySelector('.eco-accordion__trigger');
            const otherContent = otherItem.querySelector('.eco-accordion__content');
            if (otherTrigger && otherContent) {
              this.collapseItem(otherTrigger, otherContent);
            }
          }
        });
        // Open this item
        this.expandItem(trigger, content);
      }
    }
  }

  expandItem(trigger, content) {
    trigger.setAttribute('aria-expanded', 'true');
    content.setAttribute('aria-hidden', 'false');
    // Set max-height to actual scroll height for smooth animation
    content.style.maxHeight = content.scrollHeight + 'px';
  }

  collapseItem(trigger, content) {
    trigger.setAttribute('aria-expanded', 'false');
    content.setAttribute('aria-hidden', 'true');
    content.style.maxHeight = '0';
  }

  expand(index) {
    const item = this.items[index];
    if (item) {
      const trigger = item.querySelector('.eco-accordion__trigger');
      const content = item.querySelector('.eco-accordion__content');
      if (trigger && content) {
        this.toggleItem(item, trigger, content);
      }
    }
  }
}

// Auto-initialize accordions on page load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.eco-accordion').forEach(element => {
    if (!element.ecoAccordionInstance) {
      element.ecoAccordionInstance = new EcoAccordion(element);
    }
  });
});

