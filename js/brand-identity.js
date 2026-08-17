const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));

function smoothstep(start, end, value) {
  const progress = clamp((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
}

const randomBetween = (minimum, maximum) => minimum + Math.random() * (maximum - minimum);

export class BrandIdentity {
  constructor(root) {
    this.root = root;
    this.wordmark = root?.querySelector('.brand-identity__wordmark');
    this.letters = [...(root?.querySelectorAll('[data-brand-letter]') ?? [])];
    this.variations = [];
    this.ticking = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  mount() {
    if (!this.root || !this.letters.length) return;
    this.createVariations();
    if (this.reducedMotion) {
      this.render(0);
      return;
    }
    window.addEventListener('scroll', this.requestUpdate, { passive: true });
    window.addEventListener('resize', this.requestUpdate, { passive: true });
    this.update();
  }

  createVariations() {
    const slots = this.letters.map((letter) => ({
      x: Number(letter.dataset.x2),
      y: Number(letter.dataset.y2),
      rotation: Number(letter.dataset.r2),
      scale: Number(letter.dataset.s2),
    }));

    this.variations = slots.map((slot) => ({
      x: slot.x + randomBetween(-1.8, 1.8),
      y: slot.y + randomBetween(-2.4, 2.4),
      rotation: slot.rotation + randomBetween(-1.8, 1.8),
      scale: slot.scale + randomBetween(-0.035, 0.035),
      timing: randomBetween(-0.025, 0.025),
    }));
  }

  requestUpdate = () => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(this.update);
  };

  update = () => {
    const rect = this.root.getBoundingClientRect();
    const start = window.innerHeight * 0.82;
    const end = window.innerHeight * 0.14;
    const progress = clamp((start - rect.top) / Math.max(1, start - end));
    this.render(progress);
    this.ticking = false;
  };

  render(progress) {
    const riseProgress = smoothstep(0.08, 0.48, progress);
    const groupBreakProgress = smoothstep(0.28, 0.72, progress);
    const mobile = window.innerWidth < 760;
    const distanceScale = mobile ? 0.43 : 1;
    const rotationScale = mobile ? 0.55 : 1;
    const riseDistance = mobile ? 3 : 4.5;

    this.letters.forEach((letter, index) => {
      const variation = this.variations[index];
      const breakProgress = smoothstep(0.28 + variation.timing, 0.7 + variation.timing, progress);
      const floatProgress = smoothstep(0.68 + variation.timing, 0.98 + variation.timing, progress);
      const midX = variation.x * 0.34;
      const midY = variation.y * 0.38;
      const midRotation = variation.rotation * 0.36;
      const x = (midX * breakProgress + (variation.x - midX) * floatProgress) * distanceScale;
      const y = (midY * breakProgress + (variation.y - midY) * floatProgress) * distanceScale;
      const restX = Number(letter.dataset.restX);
      const restY = Number(letter.dataset.restY);
      const restRotation = Number(letter.dataset.restR);
      const restScale = Number(letter.dataset.restS);
      const baseOpacity = Number(letter.dataset.opacity);
      const rotation = restRotation + (midRotation * breakProgress + (variation.rotation - midRotation) * floatProgress) * rotationScale;
      const scale = restScale + (variation.scale - restScale) * floatProgress;
      const opacity = baseOpacity - floatProgress * (index % 2 ? 0.08 : 0.025);
      letter.style.transform = `translate3d(calc(${x}vw + ${restX}px), calc(${y}vh + ${restY}px), 0) rotate(${rotation}deg) scale(${scale})`;
      letter.style.opacity = opacity.toFixed(3);
    });

    if (this.wordmark) {
      this.wordmark.style.transform = `translate3d(-50%, calc(-50% - ${riseProgress * riseDistance}vh), 0) scale(${1 - groupBreakProgress * 0.025})`;
    }

  }
}
