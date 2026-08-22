const primaryNavigation = document.querySelector('header nav[aria-label="Primary navigation"]');
const header = primaryNavigation?.closest('header');

if (primaryNavigation && header) {
  const menuId = 'inner-mobile-menu';
  const toggle = document.createElement('button');
  const menu = document.createElement('nav');

  toggle.className = 'inner-menu-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', menuId);
  toggle.innerHTML = '<span>Menu</span>';

  menu.className = 'inner-mobile-menu';
  menu.id = menuId;
  menu.hidden = true;
  menu.setAttribute('aria-label', 'Mobile navigation');
  menu.innerHTML = primaryNavigation.innerHTML;

  header.append(toggle);
  header.insertAdjacentElement('afterend', menu);

  const close = ({ restoreFocus = false } = {}) => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('span').textContent = 'Menu';
    menu.hidden = true;
    document.body.classList.remove('inner-menu-open');
    if (restoreFocus) toggle.focus();
  };

  const focusable = () => [toggle, ...menu.querySelectorAll('a')];

  const open = () => {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.querySelector('span').textContent = 'Close';
    menu.hidden = false;
    document.body.classList.add('inner-menu-open');
    menu.querySelector('a')?.focus();
  };

  toggle.addEventListener('click', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') close();
    else open();
  });

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => close()));

  window.addEventListener('keydown', (event) => {
    if (menu.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close({ restoreFocus: true });
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusable();
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760 && !menu.hidden) close();
  });
}
