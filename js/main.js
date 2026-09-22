const root = document.documentElement;

/* ---------- Mobile nav ---------- */
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Section title word reveal ---------- */
document.querySelectorAll('.section-title').forEach((title) => {
  const accent = title.querySelector('.serif-accent');
  const accentText = accent ? accent.textContent.trim() : null;
  const words = title.textContent.trim().split(/\s+/);
  title.textContent = '';
  words.forEach((word, i) => {
    const wrap = document.createElement('span');
    wrap.className = 'word-wrap';
    const inner = document.createElement('span');
    inner.className = 'word-in';
    inner.style.transitionDelay = `${i * 0.09}s`;
    if (accentText && word === accentText) inner.classList.add('serif-accent');
    inner.textContent = word;
    wrap.appendChild(inner);
    title.appendChild(wrap);
  });
});

/* ---------- Typewriter ---------- */
const roles = [
  'lead-capturing funnels',
  'AI agents that book for you',
  'workflow automations',
  'email & SMS campaigns',
  'GoHighLevel systems',
];
const typeEl = document.querySelector('.typewriter');
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const current = roles[roleIndex];
  charIndex += deleting ? -1 : 1;

  typeEl.textContent = current.slice(0, charIndex);

  let delay = deleting ? 45 : 90;

  if (!deleting && charIndex === current.length) {
    delay = 1900;
    deleting = true;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(type, delay);
}

type();

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('section-title')) {
          entry.target.classList.add('in-view');
        }
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach((el) => {
  if (reduceMotion) {
    el.classList.add('visible');
    if (el.classList.contains('section-title')) {
      el.classList.add('in-view');
    }
  } else {
    revealObserver.observe(el);
  }
});

/* ---------- Stat counters ---------- */
const statNumbers = document.querySelectorAll('.stat-number[data-count]');

function animateCount(el, target, suffix, duration = 1200) {
  const t0 = performance.now();
  function frame(now) {
    const p = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if (statNumbers.length) {
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        if (reduceMotion) {
          el.textContent = `${target}${suffix}`;
        } else {
          animateCount(el, target, suffix);
        }
        statObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  statNumbers.forEach((el) => statObserver.observe(el));
}

/* ---------- Active nav link ---------- */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);

sections.forEach((section) => spyObserver.observe(section));

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Header shadow on scroll ---------- */
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 8 ? '0 8px 30px -20px rgba(0,0,0,0.6)' : 'none';
});

/* ---------- Particle text (studio-merge style) ---------- */
const ptEls = document.querySelectorAll('.particles-text');
const reduceMotionParticles = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PT_FONT = '"Inter Tight", "Inter", system-ui, sans-serif';
const ptGold = getComputedStyle(document.documentElement)
  .getPropertyValue('--accent')
  .trim() || '#1e3a5f';

function initParticles(el) {
  const text = el.dataset.text || '';
  let canvas = el.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    el.appendChild(canvas);
  }
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const baseColor = getComputedStyle(el).color || '#2a2520';

  let width = 0;
  let height = 0;
  let baseY = 0;
  let particles = [];
  let raf = null;

  function layout() {
    width = el.clientWidth;
    let fs = 200;
    ctx.font = `800 ${fs}px ${PT_FONT}`;
    let tw = ctx.measureText(text).width;
    if (!tw) tw = 1;
    fs = Math.min(fs * ((width * 0.96) / tw), width * 0.32);
    height = fs * 1.45;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `800 ${fs}px ${PT_FONT}`;
    ctx.textBaseline = 'alphabetic';
    baseY = fs * 1.18;

    const chars = Array.from(text);
    particles = chars.map((ch, i) => ({
      ch,
      x: i === 0 ? 0 : ctx.measureText(text.slice(0, i)).width,
      phaseA: Math.random() * Math.PI * 2,
      phaseB: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.55,
      ampY: 3 + Math.random() * 6,
      ampX: 1.5 + Math.random() * 3,
      gold: i % 6 === 0,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, width, height);
    ctx.textAlign = 'left';
    particles.forEach((p) => {
      const dx = Math.cos(t * 0.001 * p.speed + p.phaseA) * p.ampX;
      const dy = Math.sin(t * 0.0012 * p.speed + p.phaseB) * p.ampY;
      ctx.fillStyle = p.gold ? ptGold : baseColor;
      ctx.fillText(p.ch, p.x + dx, baseY + dy);
    });
    raf = requestAnimationFrame(draw);
  }

  function staticDraw() {
    ctx.clearRect(0, 0, width, height);
    ctx.textAlign = 'left';
    particles.forEach((p) => {
      ctx.fillStyle = p.gold ? ptGold : baseColor;
      ctx.fillText(p.ch, p.x, baseY);
    });
  }

  layout();
  if (reduceMotionParticles) {
    staticDraw();
  } else {
    raf = requestAnimationFrame(draw);
  }

  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => {
      if (el.clientWidth > 0) layout();
    });
    ro.observe(el);
  }
}

ptEls.forEach(initParticles);

/* ---------- Testimonials slider ---------- */
const track = document.getElementById('t-track');
const slides = track.children;
const prevBtn = document.getElementById('t-prev');
const nextBtn = document.getElementById('t-next');
const dotsWrap = document.getElementById('t-dots');
const slider = document.getElementById('t-slider');

const total = slides.length;
let current = 0;
let autoplayId = null;
let startX = 0;

for (let i = 0; i < total; i += 1) {
  const dot = document.createElement('button');
  dot.className = 'slider-dot';
  dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
  dot.addEventListener('click', () => {
    current = i;
    render();
    restartAutoplay();
  });
  dotsWrap.appendChild(dot);
}

function render() {
  track.style.transform = `translateX(-${current * 100}%)`;
  [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle('active', i === current));
}

function go(delta) {
  current = (current + delta + total) % total;
  render();
}

function restartAutoplay() {
  if (reduceMotion) return;
  clearInterval(autoplayId);
  autoplayId = setInterval(() => go(1), 5500);
}

prevBtn.addEventListener('click', () => { go(-1); restartAutoplay(); });
nextBtn.addEventListener('click', () => { go(1); restartAutoplay(); });

slider.addEventListener('mouseenter', () => clearInterval(autoplayId));
slider.addEventListener('mouseleave', restartAutoplay);

track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; clearInterval(autoplayId); }, { passive: true });
track.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;
  if (Math.abs(diff) > 50) {
    go(diff < 0 ? 1 : -1);
  }
  restartAutoplay();
}, { passive: true });

render();
restartAutoplay();

/* ---------- Showcase slideshows ---------- */
document.querySelectorAll('.showcase').forEach((showcase) => {
  const mainImg = showcase.querySelector('img[data-main]');
  const thumbs = [...showcase.querySelectorAll('.sc-thumb')];
  const count = showcase.querySelector('.showcase-count');
  const prev = showcase.querySelector('.sc-prev');
  const next = showcase.querySelector('.sc-next');

  if (!mainImg || !count || thumbs.length === 0) return;

  let idx = thumbs.findIndex((t) => t.classList.contains('active'));
  idx = idx < 0 ? 0 : idx;

  function show(i) {
    idx = (i + thumbs.length) % thumbs.length;
    const label = thumbs[idx].querySelector('span');
    mainImg.src = thumbs[idx].dataset.full;
    mainImg.alt = `${label ? label.textContent : 'Screenshot'} — ${idx + 1} of ${thumbs.length}`;
    thumbs.forEach((t, ti) => t.classList.toggle('active', ti === idx));
    count.textContent = `${idx + 1} / ${thumbs.length}`;
  }

  thumbs.forEach((t, ti) => t.addEventListener('click', () => show(ti)));
  prev.addEventListener('click', () => show(idx - 1));
  next.addEventListener('click', () => show(idx + 1));

  showcase.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { show(idx - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { show(idx + 1); e.preventDefault(); }
  });

  show(idx);
});

/* ---------- Case study modals ---------- */
let lastTrigger = null;

function openModal(id) {
  const modal = document.getElementById(`modal-${id}`);
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastTrigger) lastTrigger.focus();
}

document.querySelectorAll('[data-open]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    lastTrigger = trigger;
    openModal(trigger.dataset.open);
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      lastTrigger = trigger;
      openModal(trigger.dataset.open);
    }
  });
});

document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeModal(modal);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const open = document.querySelector('.modal.open');
  if (open) closeModal(open);
});

/* ---------- Contact form (EmailJS) ---------- */
const contactForm = document.getElementById('contact-form');

emailjs.init({
  publicKey: 'YOUR_PUBLIC_KEY',
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const message = document.getElementById('f-message').value.trim();

  if (!name || !email || !message) {
    showFormStatus('Please fill in your name, email and project details.', 'error');
    return;
  }

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  emailjs
    .sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm, {
      from_name: name,
      reply_to: email,
    })
    .then(() => {
      showFormStatus('Message sent — I\'ll get back to you within 24 hours!', 'ok');
      contactForm.reset();
    })
    .catch(() => {
      showFormStatus('Something went wrong. Please email me directly at afsheen.ghl@gmail.com.', 'error');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    });
});

function showFormStatus(text, type) {
  let note = contactForm.querySelector('.form-note');
  note.textContent = text;
  note.style.color = type === 'ok' ? 'var(--accent-soft)' : '#f87171';
  setTimeout(() => {
    note.textContent = 'Prefer email? Drop me a line at afsheen.ghl@gmail.com';
    note.style.color = 'var(--text-muted)';
  }, 6000);
}