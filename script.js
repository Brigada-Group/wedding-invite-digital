// ─── Family ID mapping ───
// Share personalized links: yoursite.com/#familyId
const FAMILIES = {
  'gashi':    'Gashi',
  'hoxha':    'Hoxha',
  'krasniqi': 'Krasniqi',
  'berisha':  'Berisha',
  'shala':    'Shala',
  'ramadani': 'Ramadani',
  'mustafa':  'Mustafa',
  'ahmeti':   'Ahmeti',
  // Add more: 'id': 'Mbiemri',
};

function getFamilyName() {
  const hash = window.location.hash.slice(1).toLowerCase();
  return FAMILIES[hash] || null;
}

function setFamilyName(name) {
  const el = document.getElementById('familyName');
  const label = document.querySelector('.family-greeting .label');

  if (name) {
    el.textContent = 'Familja ' + name;
    label.textContent = 'Jeni të ftuar me nderim';
  } else {
    el.textContent = 'Ju';
    label.textContent = 'Jeni të ftuar me nderim';
  }
}

// ─── Hero video: PNG → intro (holds on last frame when it ends) ───
function initHeroVideo() {
  const hero = document.getElementById('heroPhoto');
  const intro = document.getElementById('heroIntro');
  if (!hero || !intro) return;

  intro.addEventListener('error', () => console.warn('hero intro video failed to load'));

  const startIntro = () => {
    hero.classList.add('intro-playing');
    intro.play().catch(() => {
      // Autoplay blocked — drop the overlay so the PNG shows.
      hero.classList.remove('intro-playing');
    });
  };

  if (intro.readyState >= 2) startIntro();
  else intro.addEventListener('canplay', startIntro, { once: true });
}

// ─── Countdown Timer ───
const WEDDING_DATE = new Date('2026-07-04T19:00:00+02:00');

function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    document.getElementById('cdDays').textContent = '0';
    document.getElementById('cdHours').textContent = '0';
    document.getElementById('cdMins').textContent = '0';
    document.getElementById('cdSecs').textContent = '0';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cdDays').textContent = days;
  document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');
}

function initCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ─── Save to Calendar (.ics) ───
function initCalendarButton() {
  const btn = document.getElementById('calendarBtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding//Loti&Matina//SQ',
      'BEGIN:VEVENT',
      'DTSTART:20260704T170000Z',
      'DTEND:20260705T000000Z',
      'SUMMARY:Dasma e Loti & Matina',
      'DESCRIPTION:Jeni të ftuar të festoni dasmën e Loti & Matina Gashi',
      'LOCATION:Hills Restaurant\\, Ferizaj\\, Kosovë',
      'GEO:42.3703;21.1558',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dasma-loti-matina.ics';
    a.click();
    URL.revokeObjectURL(url);
  });
}

// ─── RSVP via WhatsApp ───
function initRSVP() {
  const btn = document.getElementById('rsvpBtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const familyName = getFamilyName();
    const name = familyName ? 'Familja ' + familyName : '';
    const message = encodeURIComponent(
      `Përshëndetje! ${name} do të marrim pjesë në dasmën tuaj me gëzim! 🎉`
    );
    window.open(`https://wa.me/38344434679?text=${message}`, '_blank');
  });
}

// ─── Floating pink particles ───
function spawnGoldParticles() {
  const container = document.getElementById('goldParticles');
  if (!container) return;

  const count = window.innerWidth < 600 ? 15 : 25;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('gp');

    const size = 2 + Math.random() * 5;
    const startX = Math.random() * 100;
    const drift = (Math.random() - 0.5) * 30;
    const duration = 6 + Math.random() * 8;
    const delay = Math.random() * 6;
    const opacity = 0.15 + Math.random() * 0.35;

    p.style.cssText = `
      left: ${startX}%;
      width: ${size}px;
      height: ${size}px;
      opacity: 0;
      --drift: ${drift}px;
      --opacity: ${opacity};
      animation: float-up ${duration}s ease-in-out ${delay}s infinite;
    `;

    container.appendChild(p);
  }
}

// ─── Scroll-triggered reveal ───
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach((el) => observer.observe(el));
}

// ─── Envelope scene → Invitation transition ───
function initEnvelope() {
  const scene = document.getElementById('envelopeScene');
  const wrapper = document.getElementById('envelopeWrapper');
  const overlay = document.getElementById('invitationOverlay');
  const stage = document.querySelector('.envelope-stage');
  const intro = document.getElementById('envelopeIntro');
  let opened = false;
  let finished = false;

  function revealInvitation() {
    if (finished) return;
    finished = true;
    if (intro) intro.pause();
    // Fade the whole envelope scene (envelope + flower frames) together
    scene.classList.add('fading');
    overlay.classList.add('visible');
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    spawnGoldParticles();
    initReveal();
    initCountdown();
    initHeroVideo();
    setTimeout(() => scene.classList.add('hidden'), 900);
  }

  function startEnvelopeVideo() {
    if (!stage || !intro) {
      revealInvitation();
      return;
    }

    stage.classList.add('intro-playing');
    intro.currentTime = 0;
    intro.addEventListener('ended', revealInvitation, { once: true });
    intro.addEventListener('error', revealInvitation, { once: true });
    intro.play().catch(() => revealInvitation());
  }

  function openEnvelope() {
    if (opened) {
      revealInvitation();
      return;
    }
    opened = true;
    wrapper.classList.add('opened');
    startEnvelopeVideo();
  }

  scene.addEventListener('click', openEnvelope);

  scene.setAttribute('tabindex', '0');
  scene.setAttribute('role', 'button');
  scene.setAttribute('aria-label', 'Hapni ftesën e dasmës');
  scene.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  setFamilyName(getFamilyName());
  initEnvelope();
  initCalendarButton();
  initRSVP();
});
