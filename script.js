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

const speakerGrid = document.querySelector('#speaker-grid');

if (speakerGrid) {
  speakerGrid.replaceChildren();

  const columns = 14;
  const rows = 14;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const cell = document.createElement('span');
      cell.className = 'grid-speaker-cell';
      cell.style.left = `${(column * 100) / columns}%`;
      cell.style.top = `${(row * 100) / rows}%`;
      speakerGrid.appendChild(cell);

      cell.addEventListener('mouseenter', () => {
        cell.classList.add('is-hovered');
      });

      cell.addEventListener('mouseleave', () => {
        cell.classList.remove('is-hovered');
      });
    }
  }
}
