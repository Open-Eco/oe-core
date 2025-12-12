/**
 * EcoKit Rating Component
 * Interactive star rating with hover preview
 */

class EcoRating {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      maxRating: options.maxRating || 5,
      allowHalf: options.allowHalf !== false,
      readonly: options.readonly || element.classList.contains('eco-rating--readonly'),
      onRate: options.onRate || null,
      ...options
    };
    
    this.currentRating = 0;
    this.hoverRating = 0;
    this.stars = [];
    
    this.init();
  }

  init() {
    // Get or create stars
    this.stars = Array.from(this.element.querySelectorAll('.eco-rating__star'));
    
    if (this.stars.length === 0) {
      this.createStars();
    }
    
    if (!this.options.readonly) {
      this.setupInteractivity();
    }
    
    // Get initial rating from filled stars
    this.updateCurrentRating();
  }

  createStars() {
    for (let i = 0; i < this.options.maxRating; i++) {
      const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      star.className = 'eco-rating__star';
      star.setAttribute('viewBox', '0 0 24 24');
      star.setAttribute('fill', 'currentColor');
      star.innerHTML = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>';
      this.element.appendChild(star);
      this.stars.push(star);
    }
  }

  setupInteractivity() {
    this.stars.forEach((star, index) => {
      const starNumber = index + 1;
      
      // Handle mouse move for half-star detection
      star.addEventListener('mousemove', (e) => this.handleMouseMove(e, starNumber));
      star.addEventListener('mouseenter', () => this.handleMouseEnter(starNumber));
      star.addEventListener('mouseleave', () => this.handleMouseLeave());
      star.addEventListener('click', (e) => this.handleClick(e, starNumber));
    });
    
    this.element.addEventListener('mouseleave', () => this.handleMouseLeave());
  }

  handleMouseMove(event, starNumber) {
    if (this.options.readonly || !this.options.allowHalf) return;
    
    const star = event.currentTarget;
    const rect = star.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    
    // If mouse is in left half, show half star
    if (x < width / 2) {
      this.hoverRating = starNumber - 0.5;
    } else {
      this.hoverRating = starNumber;
    }
    
    this.updateDisplay();
  }

  handleMouseEnter(starNumber) {
    if (this.options.readonly) return;
    // Default to full star on enter, mouse move will adjust if needed
    if (!this.options.allowHalf) {
      this.hoverRating = starNumber;
      this.updateDisplay();
    }
  }

  handleMouseLeave() {
    if (this.options.readonly) return;
    this.hoverRating = 0;
    this.updateDisplay();
  }

  handleClick(event, starNumber) {
    if (this.options.readonly) return;
    
    let rating = starNumber;
    
    // Check if clicking on left half for half-star
    if (this.options.allowHalf) {
      const star = event.currentTarget;
      const rect = star.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const width = rect.width;
      
      if (x < width / 2) {
        rating = starNumber - 0.5;
      }
    }
    
    this.currentRating = rating;
    this.hoverRating = 0;
    this.updateDisplay();
    
    if (this.options.onRate) {
      this.options.onRate(this.currentRating);
    }
    
    // Dispatch custom event
    this.element.dispatchEvent(new CustomEvent('eco-rating:change', {
      detail: { rating: this.currentRating }
    }));
  }

  updateDisplay() {
    const displayRating = this.hoverRating || this.currentRating;
    
    this.stars.forEach((star, index) => {
      const starNumber = index + 1;
      
      star.classList.remove('eco-rating__star--filled', 'eco-rating__star--half');
      
      if (starNumber <= Math.floor(displayRating)) {
        // Full star
        star.classList.add('eco-rating__star--filled');
      } else if (this.options.allowHalf && starNumber === Math.ceil(displayRating) && displayRating % 1 !== 0) {
        // Half star
        star.classList.add('eco-rating__star--half');
      }
    });
    
    // Update value display if present
    const valueElement = this.element.querySelector('.eco-rating__value');
    if (valueElement && displayRating > 0) {
      valueElement.textContent = displayRating.toFixed(1);
    }
  }

  updateCurrentRating() {
    const filledStars = this.element.querySelectorAll('.eco-rating__star--filled').length;
    const halfStar = this.element.querySelector('.eco-rating__star--half');
    this.currentRating = filledStars + (halfStar ? 0.5 : 0);
  }

  setRating(rating) {
    this.currentRating = Math.min(Math.max(0, rating), this.options.maxRating);
    this.updateDisplay();
  }

  getRating() {
    return this.currentRating;
  }
}

// Auto-initialize ratings on page load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.eco-rating').forEach(element => {
    if (!element.ecoRatingInstance) {
      element.ecoRatingInstance = new EcoRating(element);
    }
  });
});

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EcoRating;
}

