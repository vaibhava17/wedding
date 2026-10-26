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
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
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
// the hero is already fully laid out behind the doors; it only blooms as they swing open
function heroIntro() {
  if (reducedMotion) return;
  gsap.fromTo('.hero-inner', { scale: 0.94, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.15 });
  gsap.fromTo('.name', { y: 18 }, { y: 0, duration: 1.1, ease: 'back.out(1.6)', stagger: 0.12, delay: 0.25 });
  drawPaths($('.knot'), 1.4, 0.5);
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
  const home = W * 0.03, venue = Math.max(home, W * 0.6 - bw * 0.4);
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
  const brideX = Math.min(W - bw * 0.28, bx + bw * 1.02);
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

// ---------- snapping: hero ↔ invitation, and one stop per event ----------
const EVENT_STOPS = [11.05, 12.9, 14.3, 18.35].map((hr) => (hr - H0) / (H1 - H0));
let snapping = false, idleT = null, lastY = 0, dirY = 1;
function snapNow() {
  if (!lenis || snapping || !opened) return;
  const y = lenis.scroll;
  const inv = $('#invite').offsetTop;
  let target = null;
  if (y > 2 && y < inv - 2) {
    target = dirY > 0 ? (y > inv * 0.06 ? inv : 0) : (y < inv * 0.94 ? 0 : inv);
  } else if (journeyST && y > journeyST.start - 4 && y < journeyST.end + 4) {
    const span = journeyST.end - journeyST.start;
    const p = (y - journeyST.start) / span;
    const stops = [0, ...EVENT_STOPS, 1];
    const best = dirY > 0 ? (stops.find((s) => s >= p - 0.004) ?? 1) : ([...stops].reverse().find((s) => s <= p + 0.004) ?? 0);
    if (Math.abs(best - p) < 0.22) target = journeyST.start + best * span;
  }
  if (target !== null && Math.abs(target - y) > 3) {
    snapping = true;
    lenis.scrollTo(target, { duration: 0.7, easing: (x) => 1 - Math.pow(1 - x, 3), onComplete: () => { snapping = false; } });
    setTimeout(() => { snapping = false; }, 850);
  }
}
if (lenis) {
  lenis.on('scroll', ({ scroll }) => {
    if (Math.abs(scroll - lastY) > 0.5) dirY = scroll > lastY ? 1 : -1;
    lastY = scroll;
    if (snapping) return;
    clearTimeout(idleT);
    idleT = setTimeout(snapNow, 130);
  });
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

// ---------- finale: the baraat walks up to the bride ----------
const fsBaraat = $('#fsBaraat'), fsBride = $('#fsBride'), finale = $('.finale');
let arrived = false, fsStill;
function placeBaraat(progress) {
  const stopAt = fsBride.offsetLeft - fsBaraat.offsetWidth * 0.98;
  const start = -fsBaraat.offsetWidth;
  fsBaraat.style.transform = `translateX(${start + (stopAt - start) * smooth(0, 1, progress)}px)`;
}
if (!reducedMotion) {
  ScrollTrigger.create({
    trigger: '.finale-scene', start: 'top bottom', end: 'bottom bottom', scrub: 0.6,
    onUpdate(st) {
      placeBaraat(st.progress);
      finale.classList.remove('is-still');
      clearTimeout(fsStill); fsStill = setTimeout(() => finale.classList.add('is-still'), 220);
      if (st.progress > 0.97 && !arrived && floral) {
        arrived = true;
        const r = fsBride.getBoundingClientRect();
        floral.burst(r.left + r.width / 2, r.top + r.height * 0.3, 70, 1);
      }
      if (st.progress < 0.8) arrived = false;
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
  rT = setTimeout(() => { fitPatrika(); ScrollTrigger.refresh(); setDay(journeyST ? journeyST.progress : 0); }, 150);
});
