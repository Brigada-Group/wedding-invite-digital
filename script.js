// ─── Family ID mapping ───
// Share personalized links: yoursite.com/#family-slug
const FAMILIES = {
  'halla-kadire': {
    name: 'Halla Kadire',
    members: ['Halla Kadire', 'Bahtiri', 'Naseri', 'Sara', 'Aferdita', 'Ganja', 'Luta', 'Mihanja'],
  },
  'bahrija': {
    name: 'Bahrija',
    members: ['Afrimi', 'Bahrija'],
  },
  'mihanja': {
    name: 'Mihanja',
    members: ['Ramadan', 'Mihanja'],
  },
  'halla-nif': {
    name: 'Halla Nif',
    members: ['Halla Nif', 'Mesudi', 'Sheribani', 'Rinesa', 'Fitorja', 'Mihanja', 'Mirveti', 'Zyrafeti', 'Sahadeti', 'Liria', 'Hidajeti', 'Luljeta', 'Shkurta'],
  },
  'halla-raz': {
    name: 'Halla Raz',
    members: ['Halla Raz', 'Blerimi', 'Zoja', 'Parimi', 'Mihanja', 'Havushi', 'Xemi', 'Dona', 'Niti', 'Diona'],
  },
  'agroni': {
    name: 'Agroni',
    members: ['Agroni', 'Aferdita'],
  },
  'dritoni': {
    name: 'Dritoni',
    members: ['Dritoni', 'Ajna', 'Olti'],
  },
  'maliqi': {
    name: 'Maliqi',
    members: ['Maliqi', 'Dona'],
  },
  'zbulimi': {
    name: 'Zbulimi',
    members: ['Zbulimi', 'Drita'],
  },
  'qendresa': {
    name: 'Qendresa',
    members: ['Arsimi', 'Qendresa'],
  },
  'halla-nizaqet': {
    name: 'Halla Nizaqet',
    members: ['Halla Nizaqet', 'Lenti', 'Valdrina',  'Blerina'],
  },
  'tina': {
    name: 'Tina',
    members: ['Arlind', 'Tina']
  },
  'adelina': {
    name: 'Adelina',
    members: ['Alban', 'Adelina']
  },
  'mergime': {
    name: 'Mergime',
    members: ['Defrim', 'Mergime']
  },
  'daja-ibrahim': {
    name: 'Daja Ibrahim',
    members: ['Daja Ibrahim', 'Bajra', 'Alisa', 'Dini', 'Adisa'],
  },
  'adisa': {
    name: 'Adisa',
    members: ['Ramzo', 'Adisa'],
  },
  'asmiri': {
    name: 'Asmiri',
    members: ['Asmiri', 'Amra', 'Amar']
  },
  'daja-islam': {
    name: 'Daja Islam',
    members: ['Daja Islam', 'Safeti', 'Arbeni', 'Dona', 'Avdyli', 'Linda me bashkeshort', 'Lindita me bashkeshort'],
  },
  'arsim': {
    name: 'Arsimi',
    members: ['Arsimi', 'Nina', 'Xhemka'],
  },
  'naseri':{
    name: 'Naseri',
    members: ["Naseri", "Ajsella", "Azemina", "Leo"]
  },
  'ymeri': {
    name: 'Ymeri',
    members: ["Ymeri", "Ajsha", "Dion"]
  },
  'gazmendi': {
    name: 'Gazmendi',
    members: ['Tezja Shukri', 'Gazmendi', 'Linda', 'Sabian', 'Edi'],
  },
  'nasidi': {
    name: 'Nasidi',
    members: ['Nasidi', 'Pranvera', 'Lona', 'Tina'],
  },
  'astriti': {
    name: 'Astriti',
    members: ['Astriti', 'Vildanja', 'Eduardi'],
  },
  'frasheri': {
    name: 'Frasheri',
    members: ['Frasheri', 'Xhemile'],
  },
  'malsore': {
    name: 'Malsore',
    members: ['Qendrim', "Malsore"],
  },
  'korabi': {
    name: 'Korabi',
    members: ['Korabi', 'Antigona'],
  },
  'bardhosh': {
    name: 'Bardhosh',
    members: ['Bardhosh', 'Lona'],
  },
  'ardi': {
    name: 'Ardi',
    members: ['Ardi', 'Saranda'],
  },
  'enisi': {
    name: 'Enisi',
    members: ['Enisi', 'Arjeta', 'Albina'],
  },
  'besniki': {
    name: 'Besniki',
    members: ['Babuli', 'Besniki', 'Blerta'],
  }, 
  'agroni-xhaferi': {
    name: 'Agroni',
    members: ['Agroni', 'Hana', 'Merisa']
  },
  'vjosa': {
    name: 'Vjosa',
    members: ['Blini', 'Vjosa']
  },
  'medina': {
    name: 'Medina',
    members: ['Arber', 'Medina']
  },
  'arditi': {
    name: 'Arditi',
    members: ['Arditi', 'Yllka']
  },
  'besimi': {
    name: 'Besimi',
    members: ['Besimi', 'Drita', 'Besniki (me gru)', 'Besiani (me gru)'],
  },
  'bucki': {
    name: 'bucki',
    members: ['Bucki', 'Mersia', 'Tada'],
  },
  'baci-sabri': {
    name: 'Baci Sabri',
    members: ['Baci Sabri', 'Hyra', 'Amiri', 'Me gru'],
  },
  'qamili': {
    name: 'Qamili',
    members: ['Qamili', 'Me gru'],
  },
  'adili': {
    name: 'Adili',
    members: ['Adili', 'Me gru'],
  },
  'daja-jakup': {
    name: 'Daja Jakup',
    members: ['Daja Jakup', 'Hamidja', 'Flakroni', 'Kaltrina', 'Xoni', 'Lironi'],
  },
  'pimi':{
    name: "Pimi",
    members: ["Pimi"],
  },
  'januzi':{
    name: 'Januzi',
    members: ['Januzi', 'Valbona']
  },
  'daja-ragip': {
    name: 'Daja Ragip',
    members: ["Daja Ragip", "Parimi", "Bidja"]
  },
  'sitki-baftiu': {
    name: 'Sitki Baftiu',
    members: ["Sitki", "Syria", "Limi", "Zoja", "Premta", "Raimonda", "Roma"]
  },
  'gani-avdulli':{
    name: 'Gani Avdulli',
    members: ["Gani Avdulli", "Qamile", "Ahmeti", "Dona", "Marigona", "Bioneta"]
  },
  'izjadin-spahiu':{
    name: 'Izjadin Spahiu',
    members: ["Izjadin Spahiu", "Bahrija", "Artoni", "Besiana", "Lisjeta", "Bajrami", "Rita"],
  },
  'valoni': {
    name: 'Valoni',
    members: ['Valoni', 'Kaltrina'],
  },
  'lavdimi': {
    name: 'Lavdimi',
    members: ['Lavdimi', 'Me gru'],
  },
  'loriki': {
    name: 'Loriki',
    members: ['Loriki', 'Me gru'],
  },
  'albani': {
    name: 'Albani',
    members: ['Albani', 'Me gru'],
  },
  'valdrini': {
    name: 'Valdrini',
    members: ['Valdrini', 'Me gru'],
  },
  'agroni-lipovica': {
    name: 'Agroni',
    members: ['Agroni', 'Me gru'],
  },
  'agoni': {
    name: 'Agoni',
    members: ['Agoni'],
  },
  'bujari': {
    name: 'Bujari',
    members: ['Bujari', 'Me gru'],
  },
  'visari': {
    name: 'Visari',
    members: ['Visari', 'Hava'],
  },
  'dati': {
    name: 'Dati',
    members: ['Dati', 'Me gru'],
  },
  'arbeni': {
    name: 'Arbeni',
    members: ['Arbeni', 'Me gru'],
  },
  'havisha': {
    name: 'Havisha',
    members: ['Havisha', 'Arta', 'Krenarja', 'Fitorja', 'Besiana'],
  },
  'rina': {
    name: 'Rina',
    members: ['Rina', 'Erda'],
  },
  'ajete': {
    name: 'Ajete',
    members: ['Ajete', 'Fitore'],
  },
  'emini': {
    name: 'Emini',
    members: ['Emini', 'Endriti', 'Berati', 'Doni', 'Qendrim'],
  },
  'ariani': {
    name: 'Ariani',
    members: ['Ariani', 'Arianiti'],
  },
  'endrit-azemi': {
    name: 'Endrit Azemi',
    members: ['Endrit Azemi'],
  },
  'ardiani': {
    name: 'Ardiani',
    members: ['Ardiani', 'Agoni', 'Hetemi'],
  },
  'geti': {
    name: 'Geti',
    members: ['Geti', 'Mozi', 'Besi'],
  },
};

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

function setFamilyName(family) {
  const greeting = document.querySelector('.family-greeting');
  const el = document.getElementById('familyName');
  const label = greeting.querySelector('.label');
  const existingList = greeting.querySelector('.family-members');

  label.textContent = 'Jeni të ftuar me nderim';

  if (family) {
    el.textContent = 'Familja ' + family.name;

    if (existingList) existingList.remove();
    if (family.members && family.members.length) {
      const list = document.createElement('ul');
      list.className = 'family-members';
      for (const member of family.members) {
        const li = document.createElement('li');
        li.textContent = member;
        list.appendChild(li);
      }
      el.insertAdjacentElement('afterend', list);
    }
  } else {
    el.textContent = 'Ju';
    if (existingList) existingList.remove();
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
    const family = getFamily();
    const name = family ? 'Familja ' + family.name : '';
    const phone = family ? family.phone : FAMILY_PHONE;
    const message = encodeURIComponent(
      `Përshëndetje! ${name} do të marrim pjesë në dasmën tuaj me gëzim! 🎉`
    );
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
  setFamilyName(getFamily());
  initEnvelope();
  initCalendarButton();
  initRSVP();
});
