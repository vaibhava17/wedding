import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { setLang, initialLang, lang, onLang, t } from './i18n.js';
import { initFloral } from './floral.js';
import { groomOnHorse, bride, dholi, trumpeter, haveli, kid, hallMandap, familyNamaste } from './illustrations.js';

gsap.registerPlugin(ScrollTrigger);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
document.documentElement.classList.add('js');
// always start at the top behind the doors (iOS restores old scroll when it reloads a background tab)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const toTop = () => { window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; };
toTop();
addEventListener('load', toTop);
addEventListener('pageshow', (e) => { if (e.persisted && !document.getElementById('gate').hidden) toTop(); });

const WEDDING = new Date('2026-12-10T11:00:00+05:30');
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => { const k = clamp01((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const pad = (n) => String(n).padStart(2, '0');

// ---------- decorative SVG ----------
const KNOT = `
  <path class="knot-a" d="M4 46c18-2 30-14 46-22s30-6 30 4-14 14-24 6-4-24 16-26 36 8 44 18" fill="none" stroke="#c8102e" stroke-width="7" stroke-linecap="round"/>
  <path class="knot-b" d="M116 46c-18-2-30-14-46-22S40 18 40 28s14 14 24 6 4-24-16-26S12 16 4 26" fill="none" stroke="#ffc93c" stroke-width="5" stroke-linecap="round"/>
  <circle cx="60" cy="28" r="5" fill="#d6246e"/>`;
$$('.knot, .pk-sang svg').forEach((svg) => { svg.innerHTML = KNOT; });

function mandala() {
  const petals = (r, n, w, h, color) => {
    let out = '';
    for (let i = 0; i <= n; i++) out += `<ellipse cx="0" cy="${-r}" rx="${w}" ry="${h}" transform="rotate(${90 * (i / n) + 90})" fill="${color}"/>`;
    return out;
  };
  const dots = (r, n, rad, color) => {
    let out = '';
    for (let i = 0; i <= n; i++) { const a = (Math.PI / 2) * (i / n); out += `<circle cx="${(Math.cos(a) * r).toFixed(2)}" cy="${(Math.sin(a) * r).toFixed(2)}" r="${rad}" fill="${color}"/>`; }
    return out;
  };
  return `<svg viewBox="0 0 100 100" aria-hidden="true">
    <circle r="16" fill="#c8102e"/><circle r="9" fill="#ffc93c"/><circle r="4" fill="#d6246e"/>
    ${petals(26, 6, 6, 11, '#d6246e')}${petals(44, 9, 4.5, 8, '#ff8c00')}${dots(58, 12, 2.6, '#c8102e')}
    <path d="M70 0A70 70 0 0 1 0 70" fill="none" stroke="#f1b93f" stroke-width="2.4" stroke-dasharray="1 5" stroke-linecap="round"/>
    <path d="M80 0A80 80 0 0 1 0 80" fill="none" stroke="#c8102e" stroke-width="1.6"/>
  </svg>`;
}
$$('.mandala').forEach((m) => { m.innerHTML = mandala(); });

// string lights (jhalar): sagging strands with bulbs
function lightStrings(el, { strands = 1, bulbs = 26, sag = 18, y0 = 6, r = 1, colors = ['#fff1b8'] } = {}) {
  let out = '<svg viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">';
  for (let s = 0; s < strands; s++) {
    const yb = y0 + s * 26, scallops = 3 + s;
    let d = '', dots = '';
    for (let i = 0; i <= 100; i++) {
      const u = (i / 100) * scallops;
      d += `${i ? 'L' : 'M'}${i * 10} ${(yb + Math.sin((u % 1) * Math.PI) * sag).toFixed(1)}`;
    }
    for (let i = 0; i < bulbs; i++) {
      const x = ((i + 0.5) / bulbs) * 1000, u = ((i + 0.5) / bulbs) * scallops;
      const y = yb + Math.sin((u % 1) * Math.PI) * sag + 4;
      dots += `<ellipse class="bulb" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${4 * r}" ry="${6 * r}" fill="${colors[i % colors.length]}" style="animation-delay:${((i * 37) % 13) / 10}s"/>`;
    }
    out += `<path d="${d}" fill="none" stroke="#3a1d2a" stroke-width="1.6" vector-effect="non-scaling-stroke" opacity=".7"/>${dots}`;
  }
  el.innerHTML = out + '</svg>';
}
lightStrings($('#jLights'), { strands: 1, bulbs: innerWidth < 600 ? 18 : 34, sag: 30, y0: 10 });
lightStrings($('.lights'), { strands: 2, bulbs: innerWidth < 600 ? 12 : 22, sag: 18, y0: 6, r: 0.6, colors: ['#fff1b8', '#ffc93c', '#ff9fc8', '#fff1b8'] });

// illustrations
$('#kidIll').innerHTML = kid();
$('#hall').innerHTML = hallMandap();
$('#jBaraat').innerHTML = dholi() + trumpeter() + groomOnHorse();
$('#jBride').innerHTML = bride();
$('#fsHaveli').innerHTML = haveli();
$('#fsBride').innerHTML = bride();
$('#fsBaraat').innerHTML = dholi() + trumpeter() + groomOnHorse();

// ---------- language ----------
const guestParam = (new URLSearchParams(location.search).get('to') || '').trim().slice(0, 60);
function applyGuest() {
  const el = $('#guestName');
  if (guestParam) { el.removeAttribute('data-i18n'); el.textContent = guestParam; }
}
setLang(initialLang());
applyGuest();
$('#langBtn').addEventListener('click', () => setLang(lang() === 'hi' ? 'en' : 'hi'));
onLang(() => { applyGuest(); updateClock(lastHour, true); fitPatrika(); ScrollTrigger.refresh(); });

// ---------- smooth scroll ----------
// native scrolling (smoothest on phones)

// ---------- 3D marigolds ----------
let floral = null;
try {
  floral = initFloral($('#floral'), { reducedMotion });
  gsap.ticker.add((_, dt) => floral.tick(dt / 1000));
} catch (err) {
  console.warn('WebGL unavailable, continuing without flowers', err);
}
addEventListener('pointerdown', (e) => {
  if (!floral || e.target.closest('button, a, input, label, iframe, .controls')) return;
  floral.burst(e.clientX, e.clientY, 14, 0.55);
});

// ---------- music (optional) ----------
const MUSIC_SRC = ''; // e.g. 'assets/audio/shehnai.mp3'
const music = $('#music');
const musicBtn = $('#musicBtn');
if (MUSIC_SRC) { music.src = MUSIC_SRC; musicBtn.hidden = false; }
function setMusic(on) {
  if (!MUSIC_SRC) return;
  musicBtn.setAttribute('aria-pressed', String(on));
  if (on) { music.volume = 0.6; music.play().catch(() => musicBtn.setAttribute('aria-pressed', 'false')); }
  else music.pause();
}
musicBtn.addEventListener('click', () => setMusic(music.paused));

// ---------- gate: quick, smooth hand-off to the hero ----------
const gate = $('#gate');
let opened = false;
function openGate() {
  if (opened) return;
  opened = true;
  toTop();
  setMusic(true);
  gate.classList.add('is-open');
  if (floral) {
    floral.burst(innerWidth / 2, innerHeight * 0.45, reducedMotion ? 0 : 60, 1.1);
    floral.gust(1800);
    setTimeout(() => floral.shower(innerWidth < 600 ? 60 : 110), 250);
    floral.setAmbient(innerWidth < 600 ? 1.2 : 2);
  }
  heroIntro();
  setTimeout(() => {
    gate.hidden = true;
    toTop();
    document.body.classList.remove('is-locked');
    ScrollTrigger.refresh();
    fitPatrika();
  }, reducedMotion ? 30 : 1250);
}
$('#openBtn').addEventListener('click', openGate);
gate.addEventListener('click', (e) => { if (!e.target.closest('.controls')) openGate(); });
$('#openBtn').focus({ preventScroll: true });

function drawPaths(svg, dur = 1.6, delay = 0) {
  svg.querySelectorAll('path').forEach((p, i) => {
    const L = p.getTotalLength();
    gsap.fromTo(p, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: dur, delay: delay + i * 0.2, ease: 'power2.inOut' });
  });
}
// hero entrance: everything waits hidden behind the doors, then plays as they part
const HERO_PARTS = ['.hero-sun', '.hero-kicker', '.name-groom', '.name-bride', '.sang', '.hero-date', '.countdown > div', '.btn-std', '.scroll-cue'];
if (!reducedMotion) {
  gsap.set(HERO_PARTS, { opacity: 0 });
  $$('.knot path').forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
}
function heroIntro() {
  if (reducedMotion) return;
  const tl = gsap.timeline({ delay: 0.35 });
  tl.fromTo('.hero-sun', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 1.8, ease: 'power3.out' }, 0)
    .fromTo('.hero-kicker', { opacity: 0, y: -24, letterSpacing: '.3em' }, { opacity: 1, y: 0, letterSpacing: '.02em', duration: 0.9, ease: 'power3.out' }, 0.1)
    .fromTo('.name-groom', { opacity: 0, x: -90, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power4.out' }, 0.3)
    .fromTo('.name-bride', { opacity: 0, x: 90, filter: 'blur(12px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power4.out' }, 0.45)
    .add(() => drawPaths($('.knot'), 1.2), 0.7)
    .fromTo('.sang', { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.4)' }, 1.0)
    .fromTo('.hero-date', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 1.05)
    .fromTo('.countdown > div', { opacity: 0, rotationX: -90, transformPerspective: 500, y: 10 }, { opacity: 1, rotationX: 0, y: 0, duration: 0.7, stagger: 0.09, ease: 'back.out(1.7)' }, 1.25)
    .fromTo('.btn-std', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.2)' }, 1.6)
    .fromTo('.scroll-cue', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.9);
}

// ---------- countdown ----------
const cd = $('#countdown');
function tickCountdown() {
  const ms = WEDDING - Date.now();
  if (ms <= 0) { cd.classList.add('done'); cd.textContent = t('cd.done'); return; }
  const s = Math.floor(ms / 1000);
  $('[data-cd="d"]', cd).textContent = pad(Math.floor(s / 86400));
  $('[data-cd="h"]', cd).textContent = pad(Math.floor(s / 3600) % 24);
  $('[data-cd="m"]', cd).textContent = pad(Math.floor(s / 60) % 60);
  $('[data-cd="s"]', cd).textContent = pad(s % 60);
}
tickCountdown();
setInterval(tickCountdown, 1000);

ScrollTrigger.create({
  trigger: '.hero', start: 'bottom 60%',
  onEnter: () => floral?.setAmbient(0.35),
  onLeaveBack: () => floral?.setAmbient(innerWidth < 600 ? 1.2 : 2),
});

// ---------- toast ----------
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg; el.classList.add('is-on');
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('is-on'), 2200);
}

// ---------- save the date ----------
const GCAL = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
  + '&text=' + encodeURIComponent('Vibhor & Deepanshi — Wedding (विभोर संग दीपांशी)')
  + '&dates=20261210T053000Z/20261210T133000Z&ctz=Asia/Kolkata'
  + '&location=' + encodeURIComponent('Hotel Seeta Kiran, Civil Lines, Bareilly')
  + '&details=' + encodeURIComponent('शुभ विवाह — विभोर संग दीपांशी\n\nघुड़चढ़ी — प्रातः 11:00 बजे\nबारात प्रस्थान — अपराह्न 12:00 बजे\nजयमाला एवं प्रीतिभोज — अपराह्न 2:00 बजे\nवधू आगमन — सायं 6:00 बजे\n\n' + location.href.split('?')[0]);
const ICS = 'assets/vibhor-deepanshi-wedding.ics';
const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
function saveTheDate(btn) {
  const r = btn?.getBoundingClientRect();
  if (r && floral) floral.burst(r.left + r.width / 2, r.top, 36, 0.8);
  toast(t('std.saved'));
  if (isApple) location.href = ICS; // iOS / macOS: opens the Calendar "add event" sheet
  else window.open(GCAL, '_blank', 'noopener'); // Android: opens the Google Calendar app
}
$$('[data-save-date]').forEach((b) => b.addEventListener('click', () => saveTheDate(b)));

// ---------- reveals ----------
if (!reducedMotion) {
  ScrollTrigger.batch('.reveal', {
    start: 'top 92%', once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'power3.out' }),
  });
  gsap.utils.toArray('.mandala').forEach((m, i) => {
    gsap.to(m.querySelector('svg'), { rotate: i % 2 ? -50 : 50, ease: 'none', scrollTrigger: { trigger: '.patrika', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  });
  ScrollTrigger.create({ trigger: '.pk-sang', start: 'top 85%', once: true, onEnter: () => drawPaths($('.pk-sang svg'), 1.4) });
} else {
  $$('.reveal').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
}

// ---------- invitation paper: always fits one screen ----------
const pkBody = $('.patrika-body');
const pkPaper = $('.patrika-paper');
function fitPatrika() {
  pkBody.style.fontSize = '';
  const avail = innerHeight - (innerWidth < 600 ? 26 : 56);
  for (let i = 0; i < 3; i++) {
    const h = pkPaper.offsetHeight;
    if (h <= avail) break;
    const cur = parseFloat(getComputedStyle(pkBody).fontSize);
    pkBody.style.fontSize = Math.max(10.5, cur * (avail / h) * 0.985) + 'px';
  }
}
document.fonts?.ready.then(fitPatrika);
fitPatrika();

// ---------- the day passes ----------
const sky = $('.sky');
const sunEl = $('.sun');
const eventsEl = $$('.event');
const jBaraat = $('#jBaraat'), jBride = $('#jBride'), jLights = $('#jLights'), journey = $('.journey');
const H0 = 10.5, H1 = 18.7;
const KEYS = [
  { h: 10.5, top: '#7cc4ff', bot: '#ffe0a6', line: '#7a1530', line2: '#5c0f26', win: '#ffe7b0', core: '#fff1b0', edge: '#ffb000', cloud: 0.85 },
  { h: 12.5, top: '#3d9bff', bot: '#bfe8ff', line: '#8a1a3a', line2: '#6a1430', win: '#ffe7b0', core: '#fffbe0', edge: '#ffd040', cloud: 0.9 },
  { h: 14.5, top: '#4f8fe8', bot: '#ffe08a', line: '#7a1530', line2: '#5c0f26', win: '#ffd36b', core: '#fff1b0', edge: '#ffa800', cloud: 0.8 },
  { h: 16.6, top: '#ff7a59', bot: '#ffd37a', line: '#5c0f2e', line2: '#45092a', win: '#ffc93c', core: '#ffe08a', edge: '#ff6a00', cloud: 0.55 },
  { h: 17.6, top: '#6b2a8c', bot: '#ff5f7a', line: '#30123f', line2: '#240c33', win: '#ffc93c', core: '#ffb36b', edge: '#ff3d3d', cloud: 0.3 },
  { h: 18.7, top: '#1c1240', bot: '#6a2a7a', line: '#160c2c', line2: '#100822', win: '#ffcf5a', core: '#ff9a6b', edge: '#c82050', cloud: 0.08 },
];
const mix = (a, b, k) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s) => Math.round(((pa >> s) & 255) + (((pb >> s) & 255) - ((pa >> s) & 255)) * k);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
};
let lastHour = H0, activeIdx = -1, lastBx = 0, stillTimer;

function hourLabel(h) {
  const hh = Math.floor(h), mm = Math.floor(((h - hh) * 60) / 5) * 5;
  const h12 = ((hh + 11) % 12) + 1;
  const suffix = lang() === 'hi' ? (hh < 12 ? 'प्रातः' : hh < 17 ? 'अपराह्न' : 'सायं') : (hh < 12 ? 'AM' : 'PM');
  return [`${h12}:${pad(mm)}`, suffix];
}
function updateClock(h, force = false) {
  const [time, suf] = hourLabel(h);
  const tEl = $('#clockTime'), sEl = $('#clockAmpm');
  if (force || tEl.textContent !== time) tEl.textContent = time;
  if (force || sEl.textContent !== suf) sEl.textContent = suf;
}

// baraat route: home (left) → venue (right) for jaimala → back home with the bride at dusk
function baraatX(h, W, bw) {
  const brideW = jBride.offsetWidth || bw * 0.3;
  const home = W < 700 ? 4 : W * 0.03;
  const venue = W < 700 ? W - bw - brideW * 0.75 : Math.max(home, W * 0.6 - bw * 0.4);
  if (h < 11.6) return home;
  if (h < 13.2) return home + (venue - home) * smooth(11.6, 13.2, h); // 1.6h walk, ends exactly at step 2
  if (h < 16.75) return venue;
  return venue + (home - venue) * smooth(16.75, 18.35, h); // same 1.6h walk as the outbound trip
}

function setDay(p) {
  const h = H0 + p * (H1 - H0);
  lastHour = h;
  let i = 0;
  while (i < KEYS.length - 2 && h > KEYS[i + 1].h) i++;
  const A = KEYS[i], B = KEYS[i + 1], k = smooth(A.h, B.h, h);
  const set = (n, v) => sky.style.setProperty(n, v);
  set('--sky-top', mix(A.top, B.top, k)); set('--sky-bottom', mix(A.bot, B.bot, k));
  set('--skyline', mix(A.line, B.line, k)); set('--skyline-2', mix(A.line2, B.line2, k));
  set('--window', mix(A.win, B.win, k));
  set('--cloud', (A.cloud + (B.cloud - A.cloud) * k).toFixed(3));
  sunEl.style.setProperty('--sun-core', mix(A.core, B.core, k));
  sunEl.style.setProperty('--sun-edge', mix(A.edge, B.edge, k));
  set('--stars', smooth(17.8, 18.6, h).toFixed(3));

  const W = innerWidth, Hh = innerHeight, narrow = W < 900;
  const u = clamp01((h - 10.2) / (18.2 - 10.2));
  const x = W * (0.1 + u * 0.8);
  const y = (narrow ? Hh * (0.5 - Math.sin(u * Math.PI) * 0.3) : Hh * (0.66 - Math.sin(u * Math.PI) * 0.5)) + smooth(17.4, 18.3, h) * Hh * 0.3;
  sunEl.style.setProperty('--sun-x', x + 'px');
  sunEl.style.setProperty('--sun-y', y + 'px');
  sunEl.style.opacity = String(1 - smooth(17.9, 18.4, h));
  jLights.classList.toggle('on', h > 17.5);

  // procession
  const bw = jBaraat.offsetWidth || W * 0.4;
  const bx = baraatX(h, W, bw);
  const returning = h >= 16.75;
  jBaraat.style.setProperty('--bx', `${bx}px`);
  jBaraat.style.setProperty('--dir', returning ? '-1' : '1');
  jBaraat.style.opacity = String(smooth(10.55, 10.95, h));
  // bride waits at the venue, then rides home just ahead of the baraat
  const brideW = jBride.offsetWidth || bw * 0.3;
  const brideX = Math.min(W - brideW - 6, bx + bw * 0.99);
  jBride.style.setProperty('--brx', `${brideX}px`);
  jBride.style.setProperty('--bro', String(smooth(13.5, 14, h)));
  if (Math.abs(bx - lastBx) > 0.5) {
    journey.classList.remove('is-still');
    clearTimeout(stillTimer);
    stillTimer = setTimeout(() => journey.classList.add('is-still'), 220);
  }
  lastBx = bx;

  updateClock(h);

  let idx = 0;
  eventsEl.forEach((ev, j) => { if (h >= Number(ev.dataset.hour) - 0.35) idx = j; });
  if (idx !== activeIdx) {
    eventsEl.forEach((ev, j) => { ev.classList.toggle('is-active', j === idx); ev.classList.toggle('is-past', j < idx); });
    if (activeIdx !== -1 && floral && idx > activeIdx) {
      const r = eventsEl[idx].getBoundingClientRect();
      floral.burst(r.left + 30, r.top + r.height / 2, idx === 3 ? 50 : 20, idx === 3 ? 0.9 : 0.6);
    }
    activeIdx = idx;
  }
}
// ---------- stepped programme: one gesture = one event ----------
// The section locks when it reaches the top of the screen. Each scroll/swipe/arrow key plays a smooth
// transition to the next event; extra input during the transition (and trackpad inertia after it) is ignored.
const STEP_HOURS = [11.05, 13.2, 14.3, 18.35];          // ghudchadhi, baraat at the venue, jaimala, vadhu aagman
const STEP_P = STEP_HOURS.map((hr) => (hr - H0) / (H1 - H0));
const STEP = { SEC_PER_HOUR: 0.8, WHEEL_THRESHOLD: 40, TOUCH_THRESHOLD: 45, QUIET_MS: 220, COOLDOWN_MS: 300 };
const day = { p: STEP_P[0] };
let step = 0, locked = false, animating = false, cooldownUntil = 0, lastInputAt = 0, gestureUsed = false;
let wheelAcc = 0, lastAbs = 0, touchY = null, prevY = window.scrollY, releasing = false;
setDay(day.p);
journey.classList.add('is-still');

const journeyTop = () => journey.getBoundingClientRect().top + window.scrollY;
const htmlEl = document.documentElement;

function lock(at) {
  locked = true;
  step = at;
  gsap.killTweensOf(day);
  day.p = STEP_P[at];
  setDay(day.p);
  htmlEl.classList.add('day-locked');
  window.scrollTo(0, journeyTop());
  lastInputAt = performance.now(); // the swipe that brought us here doesn't count as a step
  gestureUsed = true;
  wheelAcc = at === 0 ? 1 : -1; // momentum direction we arrived with
  lastAbs = 1e6;                 // so its decaying momentum never looks like a new swipe
}
function unlock(dir) {
  locked = false;
  releasing = true;
  htmlEl.classList.remove('day-locked');
  const target = dir > 0 ? journeyTop() + journey.offsetHeight : $('#invite').getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: target, behavior: 'smooth' });
  setTimeout(() => { releasing = false; prevY = window.scrollY; }, 900);
}
function go(dir) {
  if (animating) return;
  const next = step + dir;
  if (next < 0 || next >= STEP_P.length) { unlock(dir); return; }
  step = next;
  animating = true;
  // constant pace: duration follows how many hours of the day pass in this step
  const hours = Math.abs(STEP_HOURS[step] - STEP_HOURS[step - dir]);
  gsap.to(day, {
    p: STEP_P[step], duration: hours * STEP.SEC_PER_HOUR, ease: 'sine.inOut',
    onUpdate: () => setDay(day.p),
    onComplete: () => { animating = false; cooldownUntil = performance.now() + STEP.COOLDOWN_MS; },
  });
}
if (!reducedMotion) {
  // engage when the section's top edge is crossed (either direction)
  addEventListener('scroll', () => {
    const y = window.scrollY;
    if (!locked && !releasing && opened) {
      const top = journeyTop();
      const near = Math.abs(y - top) < innerHeight * 0.6; // real scrolling, not a jump (link, restore)
      if (near && prevY < top - 1 && y >= top - 1) lock(0);
      else if (near && prevY > top + 1 && y <= top + 1) lock(STEP_P.length - 1);
    }
    prevY = window.scrollY;
  }, { passive: true });

  // A new swipe is either input after a quiet gap, or a sudden jump in strength (trackpad momentum only
  // ever decays, so a rising delta means the fingers moved again).
  addEventListener('wheel', (e) => {
    if (!locked) return;
    e.preventDefault();
    const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    const abs = Math.abs(d);
    if (abs < 0.5) return;
    const now = performance.now();
    const fresh = now - lastInputAt > STEP.QUIET_MS || (abs > lastAbs * 1.8 && abs > 12) || Math.sign(d) !== Math.sign(wheelAcc);
    lastInputAt = now;
    lastAbs = abs;
    if (fresh) { wheelAcc = 0; gestureUsed = false; }
    wheelAcc += d;
    if (animating || now < cooldownUntil) { gestureUsed = true; return; } // swipes during/just after a transition are cancelled, not queued
    if (gestureUsed) return;
    if (Math.abs(wheelAcc) < STEP.WHEEL_THRESHOLD) return;
    gestureUsed = true;
    go(Math.sign(wheelAcc));
  }, { passive: false });

  addEventListener('touchstart', (e) => { if (locked) { touchY = e.touches[0].clientY; gestureUsed = false; } }, { passive: true });
  addEventListener('touchmove', (e) => {
    if (!locked) return;
    e.preventDefault();
    if (touchY === null || gestureUsed || animating || performance.now() < cooldownUntil) return;
    const dy = touchY - e.touches[0].clientY;
    if (Math.abs(dy) > STEP.TOUCH_THRESHOLD) { gestureUsed = true; lastInputAt = performance.now(); go(Math.sign(dy)); }
  }, { passive: false });
  addEventListener('touchend', () => { touchY = null; }, { passive: true });

  addEventListener('keydown', (e) => {
    if (!locked) return;
    const down = ['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key);
    const up = ['ArrowUp', 'PageUp'].includes(e.key);
    if (!down && !up) return;
    e.preventDefault();
    if (!animating) go(down ? 1 : -1);
  });
} else {
  setDay(1);
  eventsEl.forEach((ev) => ev.classList.add('is-active'));
}

// ---------- kid's handwritten note ----------
let kidDone = false;
function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  const seg = typeof Intl.Segmenter === 'function' ? [...new Intl.Segmenter(lang(), { granularity: 'grapheme' }).segment(text)].map((s) => s.segment) : [...text];
  for (const g of seg) { const s = document.createElement('span'); s.className = 'char'; s.textContent = g; el.appendChild(s); }
}
function writeKid() {
  if (reducedMotion || kidDone) return;
  kidDone = true;
  $$('.kid-line').forEach(splitChars);
  const chars = $$('.kid .char');
  gsap.set(chars, { opacity: 0 });
  gsap.to(chars, { opacity: 1, duration: 0.01, stagger: 0.04, ease: 'none' });
  gsap.from('.kid-sign', { opacity: 0, x: 20, duration: 0.6, delay: chars.length * 0.04 + 0.2 });
}
ScrollTrigger.create({ trigger: '.kid-note', start: 'top 78%', once: true, onEnter: writeKid });
if (!reducedMotion) {
  gsap.from('.kid-note', { rotate: -10, y: 60, opacity: 0, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.kid', start: 'top 80%', once: true } });
  gsap.from('.kid-ill', { y: 120, opacity: 0, duration: 0.9, ease: 'back.out(1.8)', delay: 0.15, scrollTrigger: { trigger: '.kid', start: 'top 80%', once: true } });
}

// ---------- venue: stage curtains part as you scroll ----------
// Each drape is redrawn from one "openness" value t (0 closed → 1 tied back). The inner edge curves into a
// gold tie-back and flares out again to the floor, like a real stage curtain.
const S = 400;
const lerp = (a, b, k) => a + (b - a) * k;
function drapePath(t, mirror) {
  const X = (x) => (mirror ? S - x : x);
  const top = lerp(201, 150, t), tieY = lerp(250, 232, t), tieX = lerp(201, 34, t), bot = lerp(201, 74, t);
  const c1y = tieY * 0.5, c2x = tieX + (top - tieX) * 0.35;
  const edge = `M${X(top)} 0C${X(top)} ${c1y} ${X(c2x)} ${tieY * 0.78} ${X(tieX)} ${tieY}C${X(tieX - 4)} ${tieY + 42} ${X(bot)} ${S - 46} ${X(bot)} ${S}`;
  return { cloth: `M${X(0)} 0L${X(top)} 0${edge.slice(edge.indexOf('C'))}L${X(0)} ${S}Z`.replace(`L${X(top)} 0C`, `L${X(top)} 0C`), edge, tieX: X(tieX), tieY };
}
function drawDrapes(t) {
  for (const [id, mirror, tie] of [['#drapeL', false, '#tieL'], ['#drapeR', true, '#tieR']]) {
    const d = drapePath(t, mirror);
    const g = $(id);
    g.querySelector('.dr-cloth').setAttribute('d', d.cloth);
    g.querySelector('.dr-shade').setAttribute('d', d.cloth);
    g.querySelector('.dr-edge').setAttribute('d', d.edge);
    const c = $(tie);
    c.setAttribute('cx', d.tieX); c.setAttribute('cy', d.tieY);
    c.style.opacity = String(smooth(0.55, 0.9, t));
  }
}
if (!reducedMotion) {
  drawDrapes(0);
  const cur = { t: 0 };
  ScrollTrigger.create({
    trigger: '.stage-frame', start: 'top 70%', end: 'center 45%',
    onUpdate: (st) => gsap.to(cur, { t: st.progress, duration: 0.6, ease: 'power2.out', overwrite: true, onUpdate: () => drawDrapes(cur.t) }),
  });
} else {
  drawDrapes(1);
}

// "Open in Maps": Apple Maps on iPhone/Mac, Google Maps everywhere else
if (/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)) {
  $('#mapsBtn').href = 'https://maps.apple.com/?q=' + encodeURIComponent('Hotel Seeta Kiran') + '&address=' + encodeURIComponent('Civil Lines, Bareilly, Uttar Pradesh');
}

// ---------- finale (pinned) ----------
// Phase 1: the baraat walks up to the bride at the haveli.
// Phase 2: the family (hands folded in namaste) and the blessing flow into the empty space on the left.
// On phones there's no empty space, so the baraat first walks into the haveli.
const fsBaraat = $('#fsBaraat'), fsBride = $('#fsBride'), fsHaveli = $('#fsHaveli'), fsFamily = $('#fsFamily'), fsBless = $('#fsBless');
const finale = $('.finale'), scene = $('.finale-scene'), finaleCopy = $('.finale-copy');
fsFamily.innerHTML = familyNamaste();
let arrived = false, fsStill, stopAt = 0, startAt = 0, finaleST = null, narrowFinale = false, famLeft = 0;
const COPY_LIFT = 46; // phones: the date block moves up to make room for the blessing
function layoutFinale() {
  const W = innerWidth, H = scene.clientHeight - 40;
  narrowFinale = W < 700;
  const hh = Math.max(110, Math.min(H * 0.92, (W * (narrowFinale ? 0.92 : 0.5)) / 1.4));
  const hw = hh * 1.4, right = narrowFinale ? -W * 0.16 : W * 0.06;
  Object.assign(fsHaveli.style, { height: hh + 'px', right: right + 'px' });
  const bh = hh * 0.46, bw = bh * (140 / 240);
  const brideLeft = W - right - hw * 0.5 - bw / 2;
  Object.assign(fsBride.style, { height: bh + 'px', left: brideLeft + 'px', bottom: 40 + hh * 0.005 + 'px' });
  fsBaraat.style.height = hh * (narrowFinale ? 0.62 : 0.58) + 'px';
  const baW = fsBaraat.offsetWidth;
  stopAt = brideLeft - baW + baW * 0.04;
  startAt = -baW - 20;

  // family + blessing
  const pad = narrowFinale ? 12 : Math.max(24, W * 0.04);
  const freeW = narrowFinale ? W - pad * 2 : Math.max(240, stopAt - pad * 2);
  const famH = Math.min(hh * (narrowFinale ? 0.72 : 0.62), (freeW / (392 / 210)));
  fsFamily.style.height = famH + 'px';
  const famW = famH * (392 / 210);
  famLeft = narrowFinale ? (W - famW) / 2 : pad + (freeW - famW) / 2;
  fsFamily.style.left = famLeft + 'px';
  const names = fsBless.querySelector('.foot-names');
  names.style.fontSize = Math.min(narrowFinale ? 34 : 60, (narrowFinale ? W - 24 : freeW) / 10.5) + 'px';
  const copyBottom = finaleCopy.offsetTop + finaleCopy.offsetHeight;
  Object.assign(fsBless.style, narrowFinale
    ? { left: '12px', right: '12px', width: 'auto', bottom: 'auto', top: (copyBottom - COPY_LIFT + 22) + 'px' }
    : { left: pad + 'px', width: freeW + 'px', right: 'auto', top: 'auto', bottom: (38 + famH + 22) + 'px' });
}
const blessParts = () => [...fsBless.children];
function renderFinale(pr) {
  // phase 1 — walk
  const walk = smooth(0.04, 0.42, pr);
  let x = startAt + (stopAt - startAt) * walk;
  let baraatOpacity = 1;
  if (narrowFinale) { // into the haveli
    const enter = smooth(0.5, 0.62, pr);
    x += (fsBride.offsetLeft - stopAt - fsBaraat.offsetWidth * 0.55) * enter;
    baraatOpacity = 1 - smooth(0.56, 0.64, pr);
  }
  fsBaraat.style.transform = `translateX(${x}px)`;
  fsBaraat.style.opacity = baraatOpacity;
  fsBride.style.opacity = narrowFinale ? String(1 - smooth(0.58, 0.66, pr)) : '1'; // bride goes in with the groom
  finaleCopy.style.transform = narrowFinale ? `translateY(${-COPY_LIFT * smooth(0.6, 0.72, pr)}px)` : '';

  // phase 2 — family walks in from the left, blessing flows in line by line
  const fam = smooth(0.55, 0.78, pr);
  fsFamily.style.opacity = String(smooth(0.55, 0.62, pr));
  fsFamily.style.transform = `translateX(${(1 - fam) * -(famLeft + fsFamily.offsetWidth + 40)}px)`;
  fsBless.style.opacity = pr > 0.6 ? '1' : '0';
  blessParts().forEach((el, i) => {
    const k = smooth(0.66 + i * 0.06, 0.8 + i * 0.06, pr);
    el.style.opacity = String(k);
    el.style.transform = `translateX(${(1 - k) * -60}px)`;
  });
}
layoutFinale();
if (!reducedMotion) {
  finaleST = ScrollTrigger.create({
    trigger: '.finale-pin', start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onRefresh: () => { layoutFinale(); renderFinale(finaleST ? finaleST.progress : 0); },
    onUpdate(st) {
      renderFinale(st.progress);
      finale.classList.remove('is-still');
      clearTimeout(fsStill); fsStill = setTimeout(() => finale.classList.add('is-still'), 200);
      const walked = smooth(0.04, 0.42, st.progress);
      if (walked > 0.985 && !arrived && floral) {
        arrived = true;
        const r = fsBride.getBoundingClientRect();
        floral.burst(r.left + r.width / 2, r.top + r.height * 0.3, 80, 1);
      }
      if (walked < 0.8) arrived = false;
    },
  });
  renderFinale(0);
  finale.classList.add('is-still');
} else {
  renderFinale(1);
}

// ---------- share ----------
$('#shareBtn').addEventListener('click', async () => {
  const url = location.href.split('#')[0];
  const data = { title: t('meta.title'), text: `${t('gate.couple')} — ${t('hero.date')}`, url };
  try {
    if (navigator.share) { await navigator.share(data); return; }
    await navigator.clipboard.writeText(url);
    toast(t('ui.shared'));
  } catch { /* cancelled */ }
});

let rT;
addEventListener('resize', () => {
  clearTimeout(rT);
  rT = setTimeout(() => { fitPatrika(); layoutFinale(); ScrollTrigger.refresh(); if (locked) window.scrollTo(0, journeyTop()); setDay(day.p); }, 150);
});
