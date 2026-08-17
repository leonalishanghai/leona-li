export function mountNavigation() {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 28);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  if (!toggle || !menu) return;

  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('span').textContent = 'Menu';
    menu.hidden = true;
    document.body.classList.remove('menu-open');
  };

  toggle.addEventListener('click', () => {
    const opening = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.querySelector('span').textContent = opening ? 'Close' : 'Menu';
    menu.hidden = !opening;
    document.body.classList.toggle('menu-open', opening);
  });

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}
