const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav-links');
if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

const brand = document.querySelector('.brand');
const brandText = brand?.querySelector('span:first-child');
const brandBars = brand?.querySelector('.brand-bars');
if (brandText && brandBars) {
  const matchBrandWidth = () => {
    brandBars.style.width = `${brandText.getBoundingClientRect().width}px`;
  };
  matchBrandWidth();
  window.addEventListener('resize', matchBrandWidth);
}

const heroBrand = document.querySelector('.hero-brand');
const heroBars = document.querySelector('.hero-bars');
const heroInner = document.querySelector('.hero-inner');
if (heroBrand && heroBars && heroInner) {
  const matchHeroWidth = () => {
    const textWidth = heroBrand.getBoundingClientRect().width;
    const availableWidth = heroInner.getBoundingClientRect().width;
    heroBars.style.width = `${Math.min(textWidth, availableWidth)}px`;
  };
  matchHeroWidth();
  window.addEventListener('resize', matchHeroWidth);
}

const storyCopy = document.querySelector('.experience-item.accent-green p');
if (storyCopy) {
  storyCopy.innerHTML = storyCopy.innerHTML.replace(
    'motion graphics, web design all at Fast Cut Films.',
    'motion graphics, web design all at<br><span style="white-space: nowrap;">Fast Cut Films.</span>'
  );
}

const linkedinUrl = 'https://www.linkedin.com/in/marksusman/';

if (!document.querySelector('#linkedin-link-styles')) {
  const extraStyles = document.createElement('style');
  extraStyles.id = 'linkedin-link-styles';
  extraStyles.textContent = `
    .linkedin-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 18px;
      color: #24272b;
      font-size: .95rem;
      font-weight: 700;
      text-decoration: none;
    }
    .linkedin-link::before {
      content: "in";
      display: inline-grid;
      place-items: center;
      width: 25px;
      height: 25px;
      border: 1px solid #cfd4d8;
      border-radius: 3px;
      font-size: .78rem;
      font-weight: 800;
      line-height: 1;
    }
    .linkedin-link:hover { text-decoration: underline; }
    .footer-linkedin {
      color: #d4d8dd;
      text-decoration: none;
      white-space: nowrap;
    }
    .footer-linkedin:hover { text-decoration: underline; }
    .turnstile-wrap { margin: 6px 0 20px; min-height: 65px; }
    .send-button:disabled { opacity: .62; cursor: wait; transform: none; }
    @media (max-width: 600px) {
      .linkedin-link { margin-top: 12px; }
    }
  `;
  document.head.appendChild(extraStyles);
}

const contactCopy = document.querySelector('.contact-copy');
const contactBars = contactCopy?.querySelector('.contact-bars');
if (contactCopy && contactBars && !contactCopy.querySelector('.linkedin-link')) {
  const contactLinkedin = document.createElement('a');
  contactLinkedin.className = 'linkedin-link';
  contactLinkedin.href = linkedinUrl;
  contactLinkedin.target = '_blank';
  contactLinkedin.rel = 'noopener noreferrer';
  contactLinkedin.setAttribute('aria-label', 'Connect with Mark Susman on LinkedIn');
  contactLinkedin.textContent = 'Connect on LinkedIn';
  contactCopy.insertBefore(contactLinkedin, contactBars);
}

const footerWrap = document.querySelector('.footer-wrap');
if (footerWrap && !footerWrap.querySelector('.footer-linkedin')) {
  const footerLinkedin = document.createElement('a');
  footerLinkedin.className = 'footer-linkedin';
  footerLinkedin.href = linkedinUrl;
  footerLinkedin.target = '_blank';
  footerLinkedin.rel = 'noopener noreferrer';
  footerLinkedin.setAttribute('aria-label', 'Mark Susman on LinkedIn');
  footerLinkedin.textContent = 'LinkedIn';
  footerWrap.appendChild(footerLinkedin);
}

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
if (form && status) {
  const sendButton = form.querySelector('.send-button');
  const formNote = form.querySelector('.form-note');

  form.method = 'post';
  form.action = '/api/contact';

  const turnstileWrap = document.createElement('div');
  turnstileWrap.className = 'turnstile-wrap';
  turnstileWrap.innerHTML = '<div class="cf-turnstile" data-sitekey="0x4AAAAAAEV78pDTzjhEQKUG" data-action="contact"></div>';
  sendButton?.before(turnstileWrap);

  if (!document.querySelector('script[data-turnstile-script]')) {
    const turnstileScript = document.createElement('script');
    turnstileScript.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    turnstileScript.async = true;
    turnstileScript.defer = true;
    turnstileScript.dataset.turnstileScript = 'true';
    document.head.appendChild(turnstileScript);
  }

  if (formNote) {
    formNote.textContent = 'Protected against spam by Cloudflare Turnstile.';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    status.textContent = 'Sending…';
    if (sendButton) sendButton.disabled = true;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: new FormData(form)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Your message could not be sent. Please try again.');
      }

      form.reset();
      status.textContent = 'Thanks — your message has been sent.';
      if (window.turnstile) window.turnstile.reset();
    } catch (error) {
      status.textContent = error.message || 'Your message could not be sent. Please try again.';
      if (window.turnstile) window.turnstile.reset();
    } finally {
      if (sendButton) sendButton.disabled = false;
    }
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
