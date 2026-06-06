/* =========================================================
   NORDEXA — Main JS
   ========================================================= */

// ── Header scroll state ──────────────────────────────────
const hdr = document.getElementById('hdr');
window.addEventListener('scroll', () => {
  hdr.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── Mega-menu (desktop hover / mobile click) ─────────────
const megaItems = document.querySelectorAll('.nav-item.has-mega');

megaItems.forEach(item => {
  const btn = item.querySelector('.nav-link');

  // Desktop: hover
  item.addEventListener('mouseenter', () => {
    closeMegaMenus();
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  });
  item.addEventListener('mouseleave', () => {
    item.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  });

  // Mobile / keyboard: click
  btn.addEventListener('click', (e) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      const isOpen = item.classList.contains('open');
      closeMegaMenus();
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    }
  });
});

function closeMegaMenus() {
  megaItems.forEach(i => {
    i.classList.remove('open');
    const b = i.querySelector('.nav-link');
    if (b) b.setAttribute('aria-expanded', 'false');
  });
}

// Close on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.has-mega')) closeMegaMenus();
});

// ── Mobile burger ────────────────────────────────────────
const burger = document.getElementById('burger');
const mainNav = document.getElementById('mainNav');

burger.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
  burger.innerHTML = open
    ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6 6 18M6 6l12 12"/></svg>'
    : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
});

mainNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mainNav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// ── Reveal on scroll ─────────────────────────────────────
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

// Stagger children in grids
document.querySelectorAll('.solutions-grid, .ind-grid, .why-pillars, .steps-row').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
  });
});

// ── Count-up animation ───────────────────────────────────
function animateCount(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  const dur = 1400;
  const t0 = performance.now();
  function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      countIO.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

// ── Respect prefers-reduced-motion ──────────────────────
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('in');
    el.style.transition = 'none';
  });
}

// ── Contact form ─────────────────────────────────────────
window.handleFormSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const success = document.getElementById('formSuccess');
  form.reset();
  if (success) {
    success.style.display = 'block';
    setTimeout(() => { success.style.display = 'none'; }, 6000);
  }
};

// ── Smooth scroll for anchor links ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
