const elements = [...document.querySelectorAll('[data-reveal]')];

elements.forEach((element) => {
  if (element.getBoundingClientRect().top < window.innerHeight * 1.05) {
    element.classList.add('is-visible');
  }
});

if (!('IntersectionObserver' in window)) {
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
