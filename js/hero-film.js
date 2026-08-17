export const heroSlides = [
  { image: './assets/images/hero/hero-01-2400.webp', imageSmall: './assets/images/hero/hero-01-1000.webp', textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-02-831.webp', imageSmall: './assets/images/hero/hero-02-831.webp', imageWidth: 831, textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-03-2061.webp', imageSmall: './assets/images/hero/hero-03-1000.webp', imageWidth: 2061, textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-04-2400.webp', imageSmall: './assets/images/hero/hero-04-1000.webp', textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-05-2400.webp', imageSmall: './assets/images/hero/hero-05-1000.webp', textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-06-2400.webp', imageSmall: './assets/images/hero/hero-06-1000.webp', textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-07-2400.webp', imageSmall: './assets/images/hero/hero-07-1000.webp', textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-08-611.webp', imageSmall: './assets/images/hero/hero-08-611.webp', imageWidth: 611, textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-09-2400.webp', imageSmall: './assets/images/hero/hero-09-1000.webp', textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-10-2400.webp', imageSmall: './assets/images/hero/hero-10-1000.webp', textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-11-2400.webp', imageSmall: './assets/images/hero/hero-11-1000.webp', textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-12-2400.webp', imageSmall: './assets/images/hero/hero-12-1000.webp', textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-13-2400.webp', imageSmall: './assets/images/hero/hero-13-1000.webp', textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-14-2400.webp', imageSmall: './assets/images/hero/hero-14-1000.webp', textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-15-1024.webp', imageSmall: './assets/images/hero/hero-15-1000.webp', imageWidth: 1024, textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-16-2400.webp', imageSmall: './assets/images/hero/hero-16-1000.webp', textPosition: 'right-bottom' },
  { image: './assets/images/hero/hero-17-2400.webp', imageSmall: './assets/images/hero/hero-17-1000.webp', textPosition: 'right-bottom' },
];

export class HeroFilm {
  constructor(root) {
    this.root = root;
    this.stage = root?.querySelector('[data-hero-stage]');
    this.sequence = root?.querySelector('[data-hero-sequence]');
    this.counter = root?.querySelector('[data-hero-current]');
    this.frames = [];
    this.index = 0;
    this.timer = null;
    this.isVisible = true;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  mount() {
    if (!this.root || !this.sequence) return;
    this.renderFrames();
    this.hydrate(0, true);
    this.hydrate(1, true);
    this.frames[0]?.classList.add('is-active');
    this.applyTextPosition(0);

    if (!this.reducedMotion) {
      this.startTimer();
      this.root.addEventListener('pointermove', this.handlePointerMove, { passive: true });
      this.root.addEventListener('pointerleave', this.resetPointer, { passive: true });
      window.addEventListener('scroll', this.requestScrollUpdate, { passive: true });
      window.addEventListener('resize', this.requestScrollUpdate, { passive: true });
      this.observeVisibility();
      this.updateScroll();
    }

    document.addEventListener('visibilitychange', this.handleVisibility);
  }

  renderFrames() {
    const fragment = document.createDocumentFragment();
    heroSlides.forEach((slide, index) => {
      const frame = document.createElement('figure');
      frame.className = 'hero-frame';
      frame.dataset.heroFrame = '';
      frame.append(this.createImage(slide, index));
      fragment.append(frame);
    });
    this.sequence.replaceChildren(fragment);
    this.frames = [...this.sequence.querySelectorAll('[data-hero-frame]')];
  }

  createImage(slide, index) {
    const element = document.createElement('img');
    element.className = 'hero-frame__image';
    element.alt = '';
    element.sizes = '100vw';
    element.decoding = 'async';
    element.loading = index < 2 ? 'eager' : 'lazy';
    element.dataset.src = slide.image;
    const largeWidth = slide.imageWidth || 2400;
    element.dataset.srcset = slide.imageSmall === slide.image
      ? `${slide.image} ${largeWidth}w`
      : `${slide.imageSmall} 1000w, ${slide.image} ${largeWidth}w`;
    return element;
  }

  applyTextPosition(index) {
    this.root.dataset.textPosition = heroSlides[index]?.textPosition || 'right-bottom';
  }

  hydrate(index, priority = false) {
    const frame = this.frames[(index + this.frames.length) % this.frames.length];
    const images = [...(frame?.querySelectorAll('img') ?? [])];
    images.forEach((image) => {
      if (!image.dataset.src) return;
      if (priority) image.fetchPriority = 'high';
      image.srcset = image.dataset.srcset;
      image.src = image.dataset.src;
      delete image.dataset.src;
      delete image.dataset.srcset;
    });
  }

  show(nextIndex) {
    const normalized = (nextIndex + this.frames.length) % this.frames.length;
    this.hydrate(normalized, true);
    this.frames.forEach((frame) => frame.classList.remove('is-scroll-next'));
    this.frames[this.index]?.classList.remove('is-active');
    this.index = normalized;
    this.frames[this.index]?.classList.add('is-active');
    this.applyTextPosition(this.index);
    this.hydrate(this.index + 1);
    if (this.counter) this.counter.textContent = String(this.index + 1).padStart(2, '0');
    this.updateScroll();
  }

  startTimer() {
    if (this.timer || this.reducedMotion || !this.isVisible || document.hidden) return;
    this.timer = window.setInterval(() => this.show(this.index + 1), 4800);
  }

  stopTimer() {
    window.clearInterval(this.timer);
    this.timer = null;
  }

  observeVisibility() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      this.isVisible = entry.isIntersecting;
      if (this.isVisible) this.startTimer();
      else this.stopTimer();
    });
    observer.observe(this.root);
  }

  requestScrollUpdate = () => {
    if (this.scrollTicking) return;
    this.scrollTicking = true;
    requestAnimationFrame(this.updateScroll);
  };

  updateScroll = () => {
    const rect = this.root.getBoundingClientRect();
    const travel = Math.max(1, this.root.offsetHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / travel));
    const nextFrame = this.frames[(this.index + 1) % this.frames.length];
    this.hydrate(this.index + 1);
    this.frames.forEach((frame) => frame.classList.remove('is-scroll-next'));
    if (progress > 0.01) nextFrame?.classList.add('is-scroll-next');
    this.stage?.style.setProperty('--hero-scroll-reveal', progress.toFixed(3));
    this.sequence?.style.setProperty('--scroll-y', `${progress * -20}px`);
    this.scrollTicking = false;
  };

  handlePointerMove = (event) => {
    if (!this.sequence || window.innerWidth < 760) return;
    const x = ((event.clientX / window.innerWidth) - 0.5) * 10;
    const y = ((event.clientY / window.innerHeight) - 0.5) * 7;
    this.sequence.style.setProperty('--mouse-x', `${x}px`);
    this.sequence.style.setProperty('--mouse-y', `${y}px`);
  };

  resetPointer = () => {
    this.sequence?.style.setProperty('--mouse-x', '0px');
    this.sequence?.style.setProperty('--mouse-y', '0px');
  };

  handleVisibility = () => {
    if (document.hidden) this.stopTimer();
    else this.startTimer();
  };
}
