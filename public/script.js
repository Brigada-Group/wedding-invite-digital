// ─── Family ID mapping ───
// Source of truth: storage/families.json, served by /families.json.php
// and edited via /edit/. The map below is populated on page load.
let FAMILIES = {};

async function loadFamilies() {
  try {
    const res = await fetch('/families.json.php', { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    if (data && typeof data === 'object') FAMILIES = data;
  } catch (err) {
    console.warn('Could not load families.json — personalization disabled.', err);
  }
}

// ─── Phone numbers per invitee group ───
const FAMILY_PHONE = '38344434679';
const GUEST_PHONE  = '355684642402'; // TODO: replace with second WhatsApp number

// ─── Friends / individual guests (separate WhatsApp number) ───
const GUESTS = {
  'dritan-berisha':  { name: 'Dritan Berisha',   members: ['Dritan Berisha', 'Familjarisht'] },
  'enkelejda-noka':  { name: 'Enkelejda Noka',   members: ['Enkelejda Noka', 'Familjarisht'] },
  'fabiola-sali':    { name: 'Fabiola Sali',     members: ['Fabiola Sali', 'Familjarisht'] },
  'albi-taga':       { name: 'Albi Taga',        members: ['Albi Taga', 'Bashkëshorti/ja'] },
  'ladi-rahmanaj':   { name: 'Ladi Rahmanaj',    members: ['Ladi Rahmanaj', 'Bashkëshorti/ja'] },
  'mimoza-muka':     { name: 'Mimoza Muka',      members: ['Mimoza Muka'] },
  'gezim-sina':      { name: 'Gëzim Sina',       members: ['Gëzim Sina', 'Bashkëshorti/ja'] },
  'kasem-tali':      { name: 'Kasem Tali',       members: ['Kasem Tali', 'Bashkëshorti/ja'] },
  'bruna':           { name: 'Bruna',            members: ['Bruna', 'Bashkëshorti/ja'] },
  'alma-groshiti':   { name: 'Alma Groshiti',    members: ['Alma Groshiti', 'Bashkëshorti/ja'] },
  'eraldo-adelina':  { name: 'Eraldo & Adelina', members: ['Eraldo', 'Adelina'] },
  'arian-kameri':    { name: 'Arian Kameri',     members: ['Arian Kameri', 'Bashkëshorti/ja'] },
  'haxhi-tarja':     { name: 'Haxhi Tarja',      members: ['Haxhi Tarja', 'Bashkëshorti/ja'] },
  'broni-mantho':    { name: 'Broni Mantho',     members: ['Broni Mantho', 'Bashkëshorti/ja'] },
};

function getFamily() {
  const hash = window.location.hash.slice(1).toLowerCase();
  if (FAMILIES[hash]) return { ...FAMILIES[hash], phone: FAMILY_PHONE };
  if (GUESTS[hash])   return { ...GUESTS[hash],   phone: GUEST_PHONE };
  return null;
}

// Turn the raw members[] array into rows + notes:
//  - Parenthesized entries become notes rendered under the list.
//  - Empty entries are dropped.
//  - Everything else (names and "&" lines alike) renders as its own row,
//    preserving the vertical spacing the editor intended.
function shapeMembers(members) {
  const rows = [];
  const notes = [];
  for (const raw of members) {
    const s = String(raw).trim();
    if (s === '') continue;
    if (s.startsWith('(') && s.endsWith(')')) {
      const inner = s.slice(1, -1).trim();
      if (inner) notes.push(inner);
    } else {
      rows.push(s);
    }
  }
  return { rows, notes };
}

function setFamilyName(family) {
  const greeting = document.querySelector('.family-greeting');
  const el = document.getElementById('familyName');
  const label = greeting.querySelector('.label');
  greeting.querySelector('.family-members')?.remove();
  greeting.querySelector('.family-note')?.remove();

  label.textContent = 'Jeni të ftuar me nderim';
  el.textContent = '';

  if (!family || !family.members || !family.members.length) return;

  const { rows, notes } = shapeMembers(family.members);

  if (rows.length) {
    const list = document.createElement('ul');
    list.className = 'family-members';
    for (const text of rows) {
      const li = document.createElement('li');
      li.textContent = text;
      if (text === '&') li.classList.add('separator');
      list.appendChild(li);
    }
    el.insertAdjacentElement('afterend', list);
  }

  if (notes.length) {
    const note = document.createElement('p');
    note.className = 'family-note';
    note.textContent = notes.join(' · ');
    const anchor = greeting.querySelector('.family-members') || el;
    anchor.insertAdjacentElement('afterend', note);
  }
}

// ─── Hero video: PNG → intro (holds on last frame when it ends) ───
// Start the video the instant the hero photo finishes its fade-up. The
// video starts loading at DOMContentLoaded (see preloadHeroVideo) so by
// the time the envelope animation is done and the photo is visible, the
// video has usually buffered enough to start instantly.
function preloadHeroVideo() {
  const intro = document.getElementById('heroIntro');
  if (!intro) return;
  // Safari ignores preload="auto" — explicit load() nudges it to start
  // buffering during the envelope animation rather than at first play().
  try { intro.load(); } catch (e) {}
}

function initHeroVideo() {
  const hero = document.getElementById('heroPhoto');
  const intro = document.getElementById('heroIntro');
  if (!hero || !intro) return;

  intro.addEventListener('error', () => console.warn('hero intro video failed to load'));

  let started = false;
  const startNow = () => {
    if (started) return;
    started = true;
    // Guarantee the user sees frame 0 even if Safari decoded a few frames
    // silently while buffering.
    try { intro.currentTime = 0; } catch (e) {}
    hero.classList.add('intro-playing');
    intro.play().catch(() => {
      // Autoplay blocked — show PNG instead.
      hero.classList.remove('intro-playing');
    });
  };

  // Fire the moment the photo's fade-up CSS animation completes.
  const onAnimEnd = (e) => {
    if (e.target !== hero) return; // ignore bubbled animations from children
    hero.removeEventListener('animationend', onAnimEnd);
    startNow();
  };
  hero.addEventListener('animationend', onAnimEnd);

  // Fallback if the animation never runs (reduced-motion users, already
  // visible when init ran). Matches the fade-up timing (0.1s delay + 0.8s).
  setTimeout(startNow, 1000);
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
      'GEO:42.3700709;21.1060237',
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
    const family = getFamily();
    const phone = family ? family.phone : FAMILY_PHONE;
    const message = encodeURIComponent('Përshëndetje! Do të marrim pjesë në dasmën tuaj me gëzim! 🎉');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  });
}

// ─── Decline via WhatsApp ───
function initDecline() {
  const btn = document.getElementById('declineBtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const family = getFamily();
    const phone = family ? family.phone : FAMILY_PHONE;
    const message = encodeURIComponent('Përshëndetje! Ju falënderojmë për ftesën, por fatkeqësisht nuk do të mund të marrim pjesë. Ju urojmë gjithë të mirat! 💐');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
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
    intro.playbackRate = 1.5; // open ~33% faster without losing the animation
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
  // Render once with whatever data we have (probably none on first paint),
  // then again after the fetch resolves. Envelope animation takes >1s so
  // the second render almost always lands before the invitation is visible.
  setFamilyName(getFamily());
  loadFamilies().then(() => setFamilyName(getFamily()));

  initEnvelope();
  initCalendarButton();
  initRSVP();
  initDecline();

  // Kick off hero video buffering immediately so it's ready by the time
  // the envelope animation finishes and the photo fades in.
  preloadHeroVideo();
});
