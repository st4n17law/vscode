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

const consentBox = document.querySelector('#contact-form input[name="consent"]');
const submitButton = document.querySelector('#contact-form button[type="submit"]');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const successModal = document.getElementById('submission-modal');
const modalCloseButton = successModal.querySelector('.submission-close');
const modalDoneButton = successModal.querySelector('.submission-done');
const nameInput = contactForm.querySelector('input[name="name"]');

const syncConsent = () => {
  submitButton.disabled = !consentBox.checked;
};

if (consentBox && submitButton) {
  consentBox.addEventListener('change', syncConsent);
  syncConsent();
}

const closeSuccessModal = () => {
  successModal.hidden = true;
  document.body.classList.remove('modal-open');
  nameInput.focus();
};

modalCloseButton.addEventListener('click', closeSuccessModal);
modalDoneButton.addEventListener('click', closeSuccessModal);
successModal.addEventListener('click', (event) => {
  if (event.target === successModal) {
    closeSuccessModal();
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !successModal.hidden) {
    closeSuccessModal();
  }
});

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    return;
  }

  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());
  const controls = Array.from(contactForm.elements);
  const disabledStates = controls.map((control) => control.disabled);
  const endpoint = new URL(contactForm.action);
  endpoint.pathname = `/ajax${endpoint.pathname}`;

  controls.forEach((control) => {
    control.disabled = true;
  });
  contactForm.setAttribute('aria-busy', 'true');
  formStatus.hidden = false;
  formStatus.removeAttribute('data-state');
  formStatus.textContent = 'Отправляем заявку…';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok || !result || (result.success !== true && result.success !== 'true')) {
      throw new Error(result && result.message ? result.message : `FormSubmit returned ${response.status}`);
    }

    contactForm.reset();
    formStatus.hidden = true;
    document.body.classList.add('modal-open');
    successModal.hidden = false;
    modalCloseButton.focus();
  } catch (error) {
    console.error('Contact form submission failed:', error);
    formStatus.dataset.state = 'error';
    formStatus.textContent = 'Не удалось отправить заявку. Проверьте подключение к интернету и попробуйте ещё раз.';
  } finally {
    controls.forEach((control, index) => {
      control.disabled = disabledStates[index];
    });
    contactForm.removeAttribute('aria-busy');
    syncConsent();
  }
});

const cookieBanner = document.getElementById('cookie-banner');
const cookieAccept = document.getElementById('cookie-accept');

if (cookieBanner && cookieAccept) {
  if (localStorage.getItem('cookie-consent') !== 'accepted') {
    cookieBanner.hidden = false;
  }
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    cookieBanner.hidden = true;
  });
}