/**
 * ImageSlider — modular vanilla JS slider library (ES6 Class)
 * Features: translateX track animation, seamless infinite loop via clones,
 * dynamic clickable dots, prev/next controls, responsive (% based math).
 */
class ImageSlider {
  /**
   * @param {string} rootSelector - CSS selector for slider root
   * @param {Array<{src:string, alt:string}>} images - slide data
   */
  constructor(rootSelector, images = []) {
    this.root = document.querySelector(rootSelector);
    if (!this.root) throw new Error(`Slider root "${rootSelector}" not found`);

    this.viewport = this.root.querySelector('.slider-viewport');
    this.track = this.root.querySelector('.slider-track');
    this.prevBtn = this.root.querySelector('.prev');
    this.nextBtn = this.root.querySelector('.next');
    this.dotsContainer = this.root.querySelector('.slider-dots');

    this.images = images;
    this.realCount = images.length;
    this.currentIndex = 1; // 1-based inside cloned track (0 = last-clone)
    this.isAnimating = false;
    this.dots = [];

    this.init();
  }

  init() {
    this.buildSlides();
    this.buildClones();
    this.buildDots();
    this.bindEvents();
    // Jump to first real slide without animation
    this.jumpTo(this.currentIndex);
    this.updateDots();
  }

  /* Build real slides from data */
  buildSlides() {
    this.track.innerHTML = '';
    this.images.forEach((img) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      const el = document.createElement('img');
      el.src = img.src;
      el.alt = img.alt || '';
      el.loading = 'lazy';
      slide.appendChild(el);
      this.track.appendChild(slide);
    });
  }

  /* Clone first/last for seamless boundary wrapping */
  buildClones() {
    const slides = this.track.children;
    if (slides.length === 0) return;
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.setAttribute('aria-hidden', 'true');
    lastClone.setAttribute('aria-hidden', 'true');
    this.track.prepend(lastClone);
    this.track.append(firstClone);
    this.allSlides = this.track.querySelectorAll('.slide');
  }

  /* Dynamic dots = exact number of real slides */
  buildDots() {
    this.dotsContainer.innerHTML = '';
    this.dots = this.images.map((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
      return dot;
    });
  }

  bindEvents() {
    this.nextBtn.addEventListener('click', () => this.next());
    this.prevBtn.addEventListener('click', () => this.prev());
    this.track.addEventListener('transitionend', () => this.handleLoop());

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft') this.prev();
    });

    // Basic touch swipe
    let startX = 0;
    this.viewport.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    this.viewport.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx < -40) this.next();
      if (dx > 40) this.prev();
    });
  }

  /* Layout math: each slide = 100% of viewport */
  slideTo(index, animate = true) {
    this.track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
    this.track.style.transform = `translateX(-${index * 100}%)`;
  }

  jumpTo(index) {
    this.slideTo(index, false);
  }

  realIndex() {
    // Map cloned-track index -> 0-based real index
    return (this.currentIndex - 1 + this.realCount) % this.realCount;
  }

  goTo(realIdx) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.currentIndex = realIdx + 1;
    this.slideTo(this.currentIndex, true);
    this.updateDots();
  }

  next() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.currentIndex += 1;
    this.slideTo(this.currentIndex, true);
    this.updateDots();
  }

  prev() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.currentIndex -= 1;
    this.slideTo(this.currentIndex, true);
    this.updateDots();
  }

  /* Seamless wrap: when landing on a clone, jump (no transition) to real counterpart */
  handleLoop() {
    const last = this.allSlides.length - 1;
    if (this.currentIndex === last) {
      // landed on first-clone -> jump to first real
      this.currentIndex = 1;
      this.jumpTo(this.currentIndex);
    } else if (this.currentIndex === 0) {
      // landed on last-clone -> jump to last real
      this.currentIndex = last - 1;
      this.jumpTo(this.currentIndex);
    }
    this.isAnimating = false;
    this.updateDots();
  }

  updateDots() {
    const real = (this.currentIndex - 1 + this.realCount) % this.realCount;
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === real);
    });
  }
}

// Expose globally for non-module usage
window.ImageSlider = ImageSlider;
