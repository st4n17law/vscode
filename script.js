const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('.form-status');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = new FormData(form).get('name');
  formStatus.textContent = `Спасибо${name ? `, ${name}` : ''}! Мы свяжемся с вами в ближайшее время.`;
  form.reset();
});
