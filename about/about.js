import '../js/inner-navigation.js';

const elements = [...document.querySelectorAll('[data-reveal]')];

// Keep the opening composition present on first paint; later sections retain
// the restrained editorial reveal as they enter the viewport.
elements.forEach((element) => {
  if (element.getBoundingClientRect().top < window.innerHeight * 1.05) {
    element.classList.add('is-visible');
  }
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  elements.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
  );

  elements.forEach((element) => observer.observe(element));
}
