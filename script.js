// ===== Настройки контактов — поменяйте здесь =====
const CONFIG = {
  whatsapp: '77000000000', // номер без +, пробелов и скобок
  whatsappText: 'Здравствуйте! Хочу записаться на диагностику.',
  social: {
    instagram: '',
    telegram: '',
    youtube: '',
  },
};

document.documentElement.classList.remove('no-js');

// WhatsApp links
const waHref = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappText)}`;
document.querySelectorAll('.js-wa').forEach((a) => {
  a.href = waHref;
  a.target = '_blank';
  a.rel = 'noopener';
});

// Social links: hide the ones without a URL
document.querySelectorAll('.js-social').forEach((a) => {
  const url = CONFIG.social[a.dataset.key];
  if (url) {
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
  } else {
    a.remove();
  }
});

// Header shadow + mobile menu
const header = document.querySelector('.header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const setMenu = (open) => {
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
};
burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

// Active nav item
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach((s) => spy.observe(s));

// Reveal on scroll
const revealer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 7) * 50}ms`;
  revealer.observe(el);
});

// FAQ: keep one answer open at a time
const qas = document.querySelectorAll('.qa');
qas.forEach((qa) => qa.addEventListener('toggle', () => {
  if (qa.open) qas.forEach((other) => { if (other !== qa) other.open = false; });
}));

// Reviews carousel
const track = document.getElementById('reviewsTrack');
const step = () => track.firstElementChild.getBoundingClientRect().width + 18;
document.querySelector('.carousel__btn--prev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
document.querySelector('.carousel__btn--next').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

// Video modal
const modal = document.getElementById('videoModal');
const media = document.getElementById('videoMedia');
const closeModal = () => { modal.hidden = true; media.innerHTML = ''; };
track.querySelectorAll('.story').forEach((card) => {
  const src = card.dataset.video;
  if (!src) { card.classList.add('is-empty'); card.disabled = true; return; }
  card.addEventListener('click', () => {
    media.innerHTML = /\.(mp4|webm)$/i.test(src)
      ? `<video src="${src}" controls autoplay playsinline></video>`
      : `<iframe src="${src}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
    modal.hidden = false;
  });
});
modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('.modal__close')) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
