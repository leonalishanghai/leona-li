import '../js/inner-navigation.js';

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

const inquiryForm = document.querySelector('#inquiry-form');

inquiryForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!inquiryForm.reportValidity()) return;

  const data = new FormData(inquiryForm);
  const subject = `Project inquiry — ${data.get('projectType')}`;
  const body = [
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Project type: ${data.get('projectType')}`,
    '',
    `${data.get('message')}`,
  ].join('\n');

  window.location.href = `mailto:leonali_sh@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
