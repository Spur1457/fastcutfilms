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

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
if (form && status) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = 'Thanks — the form layout is working. Email delivery will be connected in the next setup step.';
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
