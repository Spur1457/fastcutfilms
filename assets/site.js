const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav-links');
if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
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
