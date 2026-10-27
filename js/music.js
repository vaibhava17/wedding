// Original, low-key wedding ambience in Raag Yaman, generated in code (no copyrighted audio).
// Tanpura drone + santoor-like plucks + an occasional bansuri-like phrase, through a soft reverb.
// It is rendered offline into a WAV and played with an <audio> element: on iPhone, live Web Audio is
// silenced by the ring/silent switch, while media elements still play.

const SR = 32000;          // sample rate (smaller file, plenty for soft music)
const LOOP = 48;           // seconds per loop (multiple of the 4 s tanpura cycle)
const TAIL = 6;            // extra render time; folded back onto the start for a seamless loop
const SA = 146.83;         // Sa = D3
// Yaman: S R G M# P D N  (semitones from Sa)
const SW = { S: 0, R: 2, G: 4, M: 6, P: 7, D: 9, N: 11 };
const hz = (note, oct = 0) => SA * Math.pow(2, (SW[note] + 12 * oct) / 12);

function impulse(ctx, seconds = 3.2, decay = 2.6) {
  const len = Math.floor(SR * seconds), buf = ctx.createBuffer(2, len, SR);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

function tanpuraString(ctx, out, f, t, dur = 3.6, level = 0.11) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(level, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass'; lp.Q.value = 6;
  lp.frequency.setValueAtTime(f * 10, t);
  lp.frequency.exponentialRampToValueAtTime(f * 3, t + dur); // "jawari" shimmer settling
  for (const det of [-3, 0, 3]) {
    const o = ctx.createOscillator();
    o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = det;
    o.connect(lp); o.start(t); o.stop(t + dur + 0.05);
  }
  lp.connect(g).connect(out);
}

function santoor(ctx, out, f, t, level = 0.06) {
  // struck string: bright attack, partials decaying at different rates
  for (const [mult, lv, dec] of [[1, 1, 2.2], [2, 0.35, 1.2], [3, 0.12, 0.7], [4.02, 0.05, 0.4]]) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = f * mult;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(level * lv, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0005, t + dec);
    o.connect(g).connect(out); o.start(t); o.stop(t + dec + 0.05);
  }
}

function bansuri(ctx, out, f, t, len, level = 0.035) {
  const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), vib = ctx.createOscillator(), vg = ctx.createGain();
  o.type = 'sine'; o.frequency.value = f;
  o2.type = 'triangle'; o2.frequency.value = f * 2; const g2 = ctx.createGain(); g2.gain.value = 0.18;
  vib.frequency.value = 5.2; vg.gain.value = f * 0.006;
  vib.connect(vg); vg.connect(o.frequency); vg.connect(o2.frequency);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(level, t + 0.35);
  g.gain.setValueAtTime(level, t + len - 0.4);
  g.gain.linearRampToValueAtTime(0, t + len);
  o.connect(g); o2.connect(g2).connect(g); g.connect(out);
  for (const n of [o, o2, vib]) { n.start(t); n.stop(t + len + 0.05); }
}

async function render() {
  const total = LOOP + TAIL;
  const ctx = new OfflineAudioContext(2, Math.ceil(SR * total), SR);
  const master = ctx.createGain(); master.gain.value = 0.9;
  const soft = ctx.createBiquadFilter(); soft.type = 'lowpass'; soft.frequency.value = 4200;
  const dry = ctx.createGain(); dry.gain.value = 0.7;
  const wet = ctx.createGain(); wet.gain.value = 0.42;
  const verb = ctx.createConvolver(); verb.buffer = impulse(ctx);
  const bus = ctx.createGain();
  bus.connect(dry).connect(soft);
  bus.connect(verb).connect(wet).connect(soft);
  soft.connect(master).connect(ctx.destination);

  // stereo placement
  const pan = (p) => { const n = ctx.createStereoPanner(); n.pan.value = p; n.connect(bus); return n; };
  const tanL = pan(-0.25), tanR = pan(0.25), mel = pan(0.1), flute = pan(-0.1);

  // tanpura: Pa – Sa' – Sa' – Sa (low), one string per second
  for (let t = 0; t < total; t += 4) {
    tanpuraString(ctx, tanL, hz('P', -1), t);
    tanpuraString(ctx, tanR, hz('S'), t + 1);
    tanpuraString(ctx, tanR, hz('S'), t + 2);
    tanpuraString(ctx, tanL, hz('S', -1), t + 3, 3.8, 0.13);
  }

  // santoor phrases (calm Yaman movements), [note, octave, beat]
  const phrases = [
    [['N', -1, 0], ['R', 0, 0.5], ['G', 0, 1], ['R', 0, 2], ['S', 0, 3]],
    [['G', 0, 0], ['M', 0, 0.5], ['P', 0, 1], ['M', 0, 2], ['G', 0, 2.5], ['R', 0, 3], ['S', 0, 4]],
    [['P', 0, 0], ['D', 0, 0.5], ['N', 0, 1], ['S', 1, 2], ['N', 0, 3], ['D', 0, 3.5], ['P', 0, 4]],
    [['M', 0, 0], ['G', 0, 0.5], ['R', 0, 1], ['G', 0, 1.5], ['R', 0, 2], ['S', 0, 3], ['N', -1, 3.5], ['S', 0, 4.5]],
  ];
  const beat = 0.55;
  phrases.forEach((ph, i) => {
    const start = 2 + i * 12;
    for (const [n, o, b] of ph) {
      santoor(ctx, mel, hz(n, o + 1), start + b * beat);
      santoor(ctx, mel, hz(n, o + 1) * 1.003, start + b * beat + 0.04, 0.025); // tremolo-ish second strike
    }
  });

  // bansuri: two long, gentle phrases
  [[['G', 0, 0, 2.2], ['M', 0, 2.2, 1.2], ['P', 0, 3.4, 3]], [['N', 0, 0, 1.6], ['D', 0, 1.6, 1.2], ['P', 0, 2.8, 3.4]]]
    .forEach((ph, i) => { const s = 8 + i * 24; for (const [n, o, at, len] of ph) bansuri(ctx, flute, hz(n, o + 1), s + at, len); });

  const buf = await ctx.startRendering();
  // fold the tail onto the start so the loop has no seam
  const L = Math.floor(SR * LOOP), T = buf.length - L;
  const chans = [0, 1].map((c) => {
    const d = buf.getChannelData(c), out = new Float32Array(L);
    out.set(d.subarray(0, L));
    for (let i = 0; i < T; i++) out[i] += d[L + i];
    return out;
  });
  return wav(chans);
}

function wav([l, r]) {
  let peak = 0;
  for (let i = 0; i < l.length; i++) peak = Math.max(peak, Math.abs(l[i]), Math.abs(r[i]));
  const norm = peak > 0 ? 0.35 / peak : 1;        // quiet on purpose: background music
  const n = l.length, bytes = 44 + n * 4, dv = new DataView(new ArrayBuffer(bytes));
  const str = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); dv.setUint32(4, bytes - 8, true); str(8, 'WAVE'); str(12, 'fmt ');
  dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true);
  dv.setUint32(24, SR, true); dv.setUint32(28, SR * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true);
  str(36, 'data'); dv.setUint32(40, n * 4, true);
  for (let i = 0, o = 44; i < n; i++, o += 4) {
    dv.setInt16(o, Math.max(-1, Math.min(1, l[i] * norm)) * 32767, true);
    dv.setInt16(o + 2, Math.max(-1, Math.min(1, r[i] * norm)) * 32767, true);
  }
  return new Blob([dv], { type: 'audio/wav' });
}

// 0.1 s of silence: played inside the tap to "unlock" the element on iOS before the music is ready
const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

export function createMusic(audio, { src = '' } = {}) {
  let url = src ? new URL(src, location.href).href : null, wantPlay = false, ready = !!src;
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0.6; // ignored on iPhone (hardware volume only), softens it elsewhere
  if (src) audio.src = url;
  else {
    const go = () => render().then((blob) => {
      url = URL.createObjectURL(blob); ready = true;
      if (wantPlay) { audio.src = url; audio.play().catch(() => {}); }
    }).catch((e) => console.warn('music render failed', e));
    // render after first paint so it never competes with the opening animation
    ('requestIdleCallback' in window) ? requestIdleCallback(go, { timeout: 2500 }) : setTimeout(go, 1200);
  }
  return {
    // must be called from a user gesture (tap) the first time
    play() {
      wantPlay = true;
      if (ready) {
        if (audio.src !== url) audio.src = url;
        return audio.play().then(() => true).catch(() => false);
      }
      audio.src = SILENT; audio.play().catch(() => {});
      return Promise.resolve(true);
    },
    pause() { wantPlay = false; audio.pause(); },
    get playing() { return wantPlay; },
  };
}
