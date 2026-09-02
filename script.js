// Custom cursor dot.
const dot = document.getElementById('cursorDot');
if (dot) {
  window.addEventListener('mousemove', event => {
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
  });
}

// Mobile navigation toggle.
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    });
  });
}

// Respect reduced-motion preferences.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll reveal.
if (reduceMotion) {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('in'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

// Session-format tabs (home page install section).
const installTabs = document.querySelectorAll('.install-tabs button');
const installLine = document.getElementById('installLine');
if (installTabs.length && installLine) {
  const lines = {
    'In person': 'trial@justingenmaths.com → 20–30 min free lesson — Melbourne',
    'Online': 'trial@justingenmaths.com → 20–30 min free lesson — anywhere'
  };
  installTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      installTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      installLine.textContent = lines[tab.textContent.trim()] || installLine.textContent;
    });
  });
}

// Contact form: accessible validation, a spam honeypot, and clear state changes.
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const formError = document.getElementById('formError');
  const formSuccess = document.getElementById('formSuccess');
  const submitButton = document.getElementById('submitBtn');
  const honeypot = document.getElementById('website');

  const showError = message => {
    formError.textContent = message;
    formError.hidden = false;
  };

  const markInvalidFields = () => {
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      if (field.id === 'website') return;
      if (field.validity.valid) {
        field.removeAttribute('aria-invalid');
      } else {
        field.setAttribute('aria-invalid', 'true');
      }
    });
  };

  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      if (field.validity.valid) field.removeAttribute('aria-invalid');
      if (contactForm.checkValidity()) formError.hidden = true;
    });
  });

  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    formError.hidden = true;

    markInvalidFields();
    if (!contactForm.checkValidity()) {
      const firstInvalid = contactForm.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      showError('Please complete the required fields with a valid email address.');
      return;
    }

    if (honeypot && honeypot.value) return;

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        const detail = result?.errors?.map(error => error.message).join(', ');
        throw new Error(detail || 'Something went wrong sending that.');
      }

      contactForm.hidden = true;
      formSuccess.hidden = false;
      formSuccess.focus();
    } catch (error) {
      showError(`${error.message} Please try again, or email directly instead.`);
      submitButton.disabled = false;
      submitButton.textContent = 'Send message';
    }
  });
}
