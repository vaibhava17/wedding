import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import Lenis from 'lenis';
import { setLang, initialLang, lang, onLang, t } from './i18n.js';
import { initFloral } from './floral.js';
import { groomOnHorse, bride, dholi, trumpeter, haveli, kid } from './illustrations.js';

gsap.registerPlugin(ScrollTrigger);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
document.documentElement.classList.add('js');
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

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
let lenis = null;
if (!reducedMotion) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: true, syncTouchLerp: 0.09, virtualScroll: (d) => pager(d) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}

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
  floral?.enableGyro();
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
    document.body.classList.remove('is-locked');
    lenis?.start();
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
const HERO_PARTS = ['.hero-sun', '.hero-kicker', '.name-groom', '.name-bride', '.sang', '.hero-date', '.hero-place', '.countdown > div', '.btn-std', '.scroll-cue'];
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
    .fromTo(['.hero-date', '.hero-place'], { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 1.05)
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
  if (h < 12) return home;
  if (h < 13.6) return home + (venue - home) * smooth(12, 13.6, h);
  if (h < 16.8) return venue;
  return venue + (home - venue) * smooth(16.8, 18.1, h);
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
  const returning = h >= 16.8;
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
setDay(0);
journey.classList.add('is-still');
let journeyST = null;
if (!reducedMotion) {
  journeyST = ScrollTrigger.create({ trigger: '.journey', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: (st) => setDay(st.progress) });
} else {
  setDay(1);
  eventsEl.forEach((ev) => ev.classList.add('is-active'));
}

// ---------- pager: one gesture = one page (hero, invitation, each event, venue, ...) ----------
const EVENT_STOPS = [11.05, 12.9, 14.3, 16.1, 17.4, 18.35].map((hr) => (hr - H0) / (H1 - H0));
let paging = false, swallowUntil = 0;
function snapPoints() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const top = (id) => $(id).getBoundingClientRect().top + window.scrollY;
  const pts = [0, top('#invite')];
  if (journeyST) { const span = journeyST.end - journeyST.start; [0, ...EVENT_STOPS, 1].forEach((s) => pts.push(journeyST.start + s * span)); }
  pts.push(top('#venue'), top('#kid'), top('#family'));
  if (finaleST) { const span = finaleST.end - finaleST.start; pts.push(finaleST.start, finaleST.start + span * 0.5, finaleST.end); }
  pts.push(max);
  return [...new Set(pts.map((p) => Math.round(Math.min(max, Math.max(0, p)))))].sort((a, b) => a - b);
}
function pager({ deltaY, event }) {
  if (!opened || !lenis) return true;
  const now = performance.now();
  if (paging || now < swallowUntil) {
    if (event.cancelable) event.preventDefault();
    if (!paging) swallowUntil = now + 180; // keep eating trackpad inertia until it stops
    return false;
  }
  if (event.type === 'touchstart' || event.type === 'touchend' || Math.abs(deltaY) < 3) return true;
  const y = lenis.scroll, d = Math.sign(deltaY);
  const pts = snapPoints();
  const next = d > 0 ? pts.find((p) => p > y + 6) : [...pts].reverse().find((p) => p < y - 6);
  if (next === undefined || Math.abs(next - y) > innerHeight * 1.12) return true; // tall content: scroll freely
  if (event.cancelable) event.preventDefault();
  paging = true;
  const dist = Math.abs(next - y) / innerHeight;
  lenis.scrollTo(next, {
    duration: 0.75 + Math.min(0.5, dist * 0.35), lock: true, force: true,
    easing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    onComplete: () => { paging = false; swallowUntil = performance.now() + 260; },
  });
  setTimeout(() => { if (paging) { paging = false; swallowUntil = performance.now() + 200; } }, 1600);
  return false;
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

// ---------- venue map (lazy) ----------
const iframe = $('.jharokha iframe');
new IntersectionObserver(([e], io) => { if (e.isIntersecting) { iframe.src = iframe.dataset.src; io.disconnect(); } }, { rootMargin: '400px 0px' }).observe(iframe);

// ---------- venue curtains part as you scroll ----------
if (!reducedMotion) {
  const ctl = gsap.timeline({ scrollTrigger: { trigger: '.jharokha', start: 'top 62%', end: 'center 45%', scrub: 0.8 } });
  ctl.to('.curtain-l', { scaleX: 0.24, ease: 'power2.inOut' }, 0)
    .to('.curtain-r', { scaleX: 0.24, ease: 'power2.inOut' }, 0)
    .to('.tieback', { opacity: 1, duration: 0.2 }, 0.75);
} else {
  gsap.set('.curtain', { display: 'none' });
}

// ---------- finale (pinned): the baraat walks up to the bride waiting at the haveli ----------
const fsBaraat = $('#fsBaraat'), fsBride = $('#fsBride'), fsHaveli = $('#fsHaveli'), finale = $('.finale'), scene = $('.finale-scene');
let arrived = false, fsStill, stopAt = 0, startAt = 0, finaleST = null;
function layoutFinale() {
  const W = innerWidth, H = scene.clientHeight - 40;
  const narrow = W < 700;
  const hh = Math.max(110, Math.min(H * 0.92, (W * (narrow ? 0.92 : 0.5)) / 1.4));
  const hw = hh * 1.4, right = narrow ? -W * 0.16 : W * 0.06;
  Object.assign(fsHaveli.style, { height: hh + 'px', right: right + 'px' });
  const bh = hh * 0.46, bw = bh * (140 / 240);
  const brideLeft = W - right - hw * 0.5 - bw / 2;
  Object.assign(fsBride.style, { height: bh + 'px', left: brideLeft + 'px', bottom: 40 + hh * 0.005 + 'px' });
  fsBaraat.style.height = hh * (W < 700 ? 0.62 : 0.58) + 'px';
  const baW = fsBaraat.offsetWidth;
  stopAt = brideLeft - baW + baW * 0.04;
  startAt = -baW - 20;
}
function placeBaraat(p) {
  fsBaraat.style.transform = `translateX(${startAt + (stopAt - startAt) * p}px)`;
}
layoutFinale();
if (!reducedMotion) {
  finaleST = ScrollTrigger.create({
    trigger: '.finale-pin', start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onRefresh: layoutFinale,
    onUpdate(st) {
      const p = smooth(0.08, 0.9, st.progress);
      placeBaraat(p);
      finale.classList.remove('is-still');
      clearTimeout(fsStill); fsStill = setTimeout(() => finale.classList.add('is-still'), 200);
      if (p > 0.985 && !arrived && floral) {
        arrived = true;
        const r = fsBride.getBoundingClientRect();
        floral.burst(r.left + r.width / 2, r.top + r.height * 0.3, 80, 1);
      }
      if (p < 0.8) arrived = false;
    },
  });
  placeBaraat(0);
  finale.classList.add('is-still');
} else {
  placeBaraat(1);
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
  rT = setTimeout(() => { fitPatrika(); layoutFinale(); ScrollTrigger.refresh(); setDay(journeyST ? journeyST.progress : 0); }, 150);
});
