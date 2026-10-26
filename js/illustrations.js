// Hand-built vector characters for the baraat scenes. Returned as SVG strings so each
// instance can animate its own parts (legs, arms, lights) with CSS.

const SKIN = '#e8a87c';
const SKIN_KID = '#f2b98d';
const HAIR = '#2b1a14';
const GOLD = '#f1b93f';

const ring = (cx, cy, rx, ry, n, r, colors) => {
  let out = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    out += `<circle cx="${(cx + Math.cos(a) * rx).toFixed(1)}" cy="${(cy + Math.sin(a) * ry).toFixed(1)}" r="${r}" fill="${colors[i % colors.length]}"/>`;
  }
  return out;
};

export function groomOnHorse() {
  let sehra = '';
  for (let x = 108; x <= 132; x += 4) sehra += `<line x1="${x}" y1="43" x2="${x}" y2="${60 + (x % 8)}" stroke="#fff7ea" stroke-width="1.8" stroke-dasharray="1.6 2.4" stroke-linecap="round"/>`;
  let tassels = '';
  for (let x = 84; x <= 164; x += 10) tassels += `<circle cx="${x}" cy="${183 - Math.abs(x - 124) * 0.06}" r="3" fill="${GOLD}"/>`;
  return `<svg class="ill ill-groom" viewBox="0 0 260 230" aria-hidden="true">
    <g class="walk">
      <path d="M58 132C36 136 26 160 34 196c8-18 16-34 30-46z" fill="#e2d4c4"/>
      <g class="leg leg-b" style="transform-origin:79px 160px"><rect x="72" y="156" width="14" height="60" rx="6" fill="#e9dccb"/><rect x="71" y="208" width="16" height="10" rx="3" fill="#6b4a32"/></g>
      <g class="leg leg-a" style="transform-origin:177px 160px"><rect x="170" y="156" width="14" height="60" rx="6" fill="#e9dccb"/><rect x="169" y="208" width="16" height="10" rx="3" fill="#6b4a32"/></g>
      <ellipse cx="124" cy="146" rx="72" ry="36" fill="#fbf4ea"/>
      <path d="M60 156c30 22 100 24 130 0-6 20-40 30-66 30s-58-10-64-30z" fill="#efe4d6"/>
      <g class="leg leg-a" style="transform-origin:93px 160px"><rect x="86" y="158" width="14" height="58" rx="6" fill="#fbf4ea"/><rect x="85" y="208" width="16" height="10" rx="3" fill="#6b4a32"/></g>
      <g class="leg leg-b" style="transform-origin:191px 160px"><rect x="184" y="156" width="14" height="60" rx="6" fill="#fbf4ea"/><rect x="183" y="208" width="16" height="10" rx="3" fill="#6b4a32"/></g>
      <path d="M168 136c8-30 18-50 30-66l24 14c-12 20-24 44-32 68z" fill="#fbf4ea"/>
      <path d="M196 66c8-12 26-12 40 8 8 12 6 24-4 26-10 2-18-6-28-14-6-6-10-14-8-20z" fill="#fbf4ea"/>
      <path d="M202 60l4-18 7 17z" fill="#e9dccb"/>
      <circle cx="214" cy="72" r="2.6" fill="${HAIR}"/><circle cx="236" cy="90" r="1.6" fill="#9a7b62"/>
      <path d="M194 62c-12 18-22 40-30 68l-10-4c10-28 20-48 34-68z" fill="#c8102e"/>
      <circle cx="188" cy="72" r="2" fill="${GOLD}"/><circle cx="180" cy="88" r="2" fill="${GOLD}"/><circle cx="172" cy="106" r="2" fill="${GOLD}"/>
      <path d="M206 56c-2-16 6-26 16-30-6 10-8 20-10 30z" fill="#ffc93c"/><circle cx="208" cy="57" r="3" fill="#c8102e"/>
      <path d="M198 74c14 12 26 18 36 20M204 86c6-6 12-12 18-16" stroke="${GOLD}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M174 104c8 4 16 4 24 0" stroke="${GOLD}" stroke-width="4" stroke-dasharray="2 4" stroke-linecap="round" fill="none"/>
      <path d="M84 116q40-10 80 0l6 62q-46 8-92 0z" fill="#c8102e" stroke="${GOLD}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M96 132h56M94 150h60" stroke="${GOLD}" stroke-width="2" stroke-dasharray="3 5"/>
      <circle cx="124" cy="160" r="7" fill="${GOLD}"/><circle cx="124" cy="160" r="3" fill="#c8102e"/>
      ${tassels}
      <g class="rider">
        <path d="M112 112h12l6 54-12 2z" fill="#fff1d6"/><ellipse cx="126" cy="170" rx="10" ry="5" fill="#d4a017"/>
        <path d="M98 64q20-8 42 0l6 54q-26 6-52 0z" fill="#f7e2b0"/>
        <path d="M120 66v50" stroke="#e7c98a" stroke-width="2"/>
        <circle cx="120" cy="76" r="1.8" fill="#b9741c"/><circle cx="120" cy="88" r="1.8" fill="#b9741c"/><circle cx="120" cy="100" r="1.8" fill="#b9741c"/>
        <path d="M100 66l40 46-8 4-36-42z" fill="#c8102e" opacity=".92"/>
        <path d="M136 70l20 26-6 6-20-22z" fill="#f7e2b0"/><circle cx="154" cy="100" r="5" fill="${SKIN}"/>
        <path d="M154 100c26-2 60-8 78-6" stroke="${GOLD}" stroke-width="2" fill="none"/>
        <rect x="114" y="50" width="12" height="14" rx="3" fill="${SKIN}"/>
        <circle cx="120" cy="44" r="14" fill="${SKIN}"/>
        <path d="M104 38c-8 10-10 24-6 38l6-2c-2-12 0-22 4-30z" fill="#ff8c00"/>
        <path d="M104 42c-2-20 34-22 34-2-8-6-26-6-34 2z" fill="#ff8c00"/>
        <path d="M104 40c8-6 26-6 34-2v5c-8-4-26-4-34 2z" fill="#c8102e"/>
        <path d="M122 27c4-12 12-16 18-18-6 6-10 12-14 20z" fill="#fff1b8"/><circle cx="122" cy="28" r="3.2" fill="#fff7ea" stroke="${GOLD}"/>
        ${sehra}
      </g>
    </g>
  </svg>`;
}

export function bride() {
  return `<svg class="ill ill-bride" viewBox="0 0 140 240" aria-hidden="true">
    <g class="sway">
      <path d="M28 232c8-46 22-82 42-98 20 16 34 52 42 98z" fill="#c8102e"/>
      <path d="M50 160l-8 70M70 150v82M90 160l8 70" stroke="#f1b93f" stroke-width="2" opacity=".7"/>
      ${ring(70, 205, 30, 4, 12, 1.6, [GOLD])}
      <path d="M28 232q42 10 84 0" stroke="${GOLD}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M56 96q14-4 28 0l4 40q-18 4-36 0z" fill="#a3122a"/>
      <rect x="52" y="128" width="36" height="7" rx="3" fill="${GOLD}"/>
      <rect x="64" y="82" width="12" height="14" rx="3" fill="${SKIN}"/>
      <path d="M60 96q10 14 20 0" stroke="${GOLD}" stroke-width="3" fill="none"/><circle cx="70" cy="104" r="2.5" fill="#c8102e"/>
      <circle cx="70" cy="70" r="15" fill="${SKIN}"/>
      <path d="M55 70c-1-18 31-18 30 0-3-10-11-14-15-12-4-2-12 2-15 12z" fill="${HAIR}"/>
      <path d="M70 55v7" stroke="${GOLD}" stroke-width="1.6"/><circle cx="70" cy="63.5" r="2.4" fill="${GOLD}"/>
      <path d="M62 71q3 2 6 0M72 71q3 2 6 0" stroke="${HAIR}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M65 78q5 4 10 0" stroke="#a3122a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <circle cx="76" cy="75" r="3.2" fill="none" stroke="${GOLD}" stroke-width="1.2"/>
      <circle cx="58" cy="74" r="3" fill="#ff8fa3" opacity=".5"/><circle cx="82" cy="74" r="3" fill="#ff8fa3" opacity=".5"/>
      <path d="M52 66c-2-22 38-22 36 0l16 94c-6-10-10-30-14-50H50c-4 20-8 40-14 50z" fill="#ff4f9a" opacity=".5" stroke="${GOLD}" stroke-width="2"/>
      <g class="mala-arms">
        <path d="M54 100l-10 34 8 4 8-32zM86 100l10 34-8 4-8-32z" fill="#a3122a"/>
        <circle cx="49" cy="138" r="5" fill="${SKIN}"/><circle cx="91" cy="138" r="5" fill="${SKIN}"/>
        ${ring(70, 150, 22, 13, 16, 4.2, ['#ff8c00', '#ffc93c', '#ff8c00', '#d0102e'])}
      </g>
    </g>
  </svg>`;
}

export function dholi() {
  return `<svg class="ill ill-dhol" viewBox="0 0 100 200" aria-hidden="true">
    <g class="bob">
      <rect x="38" y="140" width="11" height="52" rx="5" fill="#fff7ea"/><rect x="53" y="140" width="11" height="52" rx="5" fill="#fff7ea"/>
      <ellipse cx="43" cy="194" rx="9" ry="4" fill="#d4a017"/><ellipse cx="59" cy="194" rx="9" ry="4" fill="#d4a017"/>
      <path d="M30 70q20-8 40 0l6 78q-26 6-52 0z" fill="#d6246e"/>
      <rect x="44" y="56" width="12" height="14" rx="3" fill="${SKIN}"/>
      <circle cx="50" cy="46" r="13" fill="${SKIN}"/>
      <path d="M43 52q7 4 14 0" stroke="${HAIR}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <circle cx="45" cy="44" r="1.6" fill="${HAIR}"/><circle cx="55" cy="44" r="1.6" fill="${HAIR}"/>
      <path d="M36 44c-2-18 30-20 28 0-6-6-22-6-28 0z" fill="#ffc93c"/><path d="M36 42c-6 8-6 18-2 26l5-3c-2-6-2-14 1-20z" fill="#ffc93c"/>
      <g class="drum"><rect x="20" y="100" width="60" height="30" rx="4" fill="#ff8c00"/>
        <path d="M24 102l10 26M36 102l10 26M48 102l10 26M60 102l10 26" stroke="#fff1d6" stroke-width="1.6"/>
        <ellipse cx="20" cy="115" rx="6" ry="16" fill="#fff1d6" stroke="#b9741c"/><ellipse cx="80" cy="115" rx="6" ry="16" fill="#fff1d6" stroke="#b9741c"/></g>
      <g class="arm arm-l" style="transform-origin:34px 78px"><path d="M34 76l-14 26 6 4 14-24z" fill="#d6246e"/><path d="M22 104l-10-22" stroke="#7a3a12" stroke-width="3" stroke-linecap="round"/></g>
      <g class="arm arm-r" style="transform-origin:66px 78px"><path d="M66 76l14 26-6 4-14-24z" fill="#d6246e"/><path d="M78 104l10-22" stroke="#7a3a12" stroke-width="3" stroke-linecap="round"/></g>
    </g>
  </svg>`;
}

export function trumpeter() {
  return `<svg class="ill ill-trumpet" viewBox="0 0 100 200" aria-hidden="true">
    <g class="bob">
      <rect x="38" y="140" width="11" height="52" rx="5" fill="#fff7ea"/><rect x="53" y="140" width="11" height="52" rx="5" fill="#fff7ea"/>
      <ellipse cx="43" cy="194" rx="9" ry="4" fill="#d4a017"/><ellipse cx="59" cy="194" rx="9" ry="4" fill="#d4a017"/>
      <path d="M30 70q20-8 40 0l6 78q-26 6-52 0z" fill="#ff8c00"/>
      <path d="M50 72v70" stroke="#c8102e" stroke-width="3" stroke-dasharray="4 6"/>
      <rect x="44" y="56" width="12" height="14" rx="3" fill="${SKIN}"/>
      <circle cx="50" cy="46" r="13" fill="${SKIN}"/>
      <circle cx="47" cy="44" r="1.6" fill="${HAIR}"/><circle cx="56" cy="44" r="1.6" fill="${HAIR}"/>
      <path d="M36 44c-2-18 30-20 28 0-6-6-22-6-28 0z" fill="#c8102e"/>
      <g class="horn"><path d="M58 52l28-20 4 6-28 20z" fill="${GOLD}"/><path d="M84 30l12-10 4 20-12-2z" fill="#ffc93c"/>
        <path d="M64 64l14 4-2 6-14-4z" fill="#ff8c00"/></g>
    </g>
  </svg>`;
}

export function haveli() {
  let toran = '';
  for (let i = 0; i <= 14; i++) {
    const t = i / 14, x = 176 + t * 68, y = 184 + Math.sin(t * Math.PI) * 12;
    toran += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${i % 2 ? '#ffc93c' : '#ff8c00'}"/>`;
  }
  let bulbs = '';
  for (let i = 0; i <= 22; i++) {
    const t = i / 22, x = 40 + t * 340, y = 118 + Math.sin(t * Math.PI * 3) * 10 + 8;
    bulbs += `<circle class="bulb" style="animation-delay:${(i % 5) * 0.3}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="#fff1b8"/>`;
  }
  const win = (x, y) => `<path d="M${x} ${y + 44}v-28q16-22 32 0v28z" fill="#ffd36b" stroke="#c8102e" stroke-width="4"/><path d="M${x + 16} ${y + 2}v42" stroke="#c8102e" stroke-width="2"/><path d="M${x - 6} ${y + 46}h44" stroke="#8a0a20" stroke-width="5" stroke-linecap="round"/>`;
  return `<svg class="ill ill-haveli" viewBox="0 0 420 300" aria-hidden="true">
    <path d="M58 100c0-24 24-24 24 0zM338 100c0-24 24-24 24 0z" fill="#ffcf9a"/>
    <rect x="66" y="74" width="4" height="10" fill="${GOLD}"/><rect x="350" y="74" width="4" height="10" fill="${GOLD}"/>
    <path d="M166 104c0-46 88-46 88 0z" fill="#ffcf9a"/><path d="M210 54v-16" stroke="${GOLD}" stroke-width="4"/><circle cx="210" cy="36" r="5" fill="${GOLD}"/>
    <rect x="40" y="108" width="340" height="192" fill="#ffe2c2"/>
    <rect x="34" y="100" width="352" height="14" rx="3" fill="#c8102e"/>
    <path d="M34 114h352" stroke="${GOLD}" stroke-width="3" stroke-dasharray="6 6"/>
    ${win(72, 150)}${win(316, 150)}${win(124, 150)}${win(264, 150)}
    ${win(72, 226)}${win(316, 226)}
    <path d="M176 300V214q34-46 68 0v86z" fill="#8a0a20" stroke="${GOLD}" stroke-width="5"/>
    <path d="M186 300v-80q24-30 48 0v80z" fill="#ffb347" class="door-glow"/>
    ${toran}
    <path d="M40 126c56 18 113-18 170 0s114-18 170 0" stroke="#4a0d18" stroke-width="1.4" fill="none" opacity=".5"/>
    ${bulbs}
    <rect x="150" y="292" width="120" height="8" fill="#c8102e"/>
  </svg>`;
}

export function kid() {
  return `<svg class="ill ill-kid" viewBox="0 0 150 230" aria-hidden="true">
    <g class="balloon"><path d="M30 150C26 120 22 90 26 60" stroke="#4a0d18" stroke-width="1.4" fill="none"/>
      <path d="M26 60c-14-2-22-14-18-26 3-9 13-12 18-5 5-7 15-4 18 5 4 12-4 24-18 26z" fill="#d6246e"/>
      <path d="M18 30q4-6 10-4" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/></g>
    <g class="kid-body">
      <rect x="58" y="168" width="14" height="44" rx="6" fill="#fff7ea"/><rect x="78" y="168" width="14" height="44" rx="6" fill="#fff7ea"/>
      <ellipse cx="64" cy="214" rx="11" ry="6" fill="${GOLD}"/><ellipse cx="86" cy="214" rx="11" ry="6" fill="${GOLD}"/>
      <path d="M46 112q29-12 58 0l6 66q-35 8-70 0z" fill="#ffc93c"/>
      <path d="M46 112l14-4 4 66H40zM104 112l-14-4-4 66h24z" fill="#d6246e"/>
      <circle cx="75" cy="128" r="2.2" fill="${GOLD}"/><circle cx="75" cy="142" r="2.2" fill="${GOLD}"/><circle cx="75" cy="156" r="2.2" fill="${GOLD}"/>
      <path d="M40 174q35 8 70 0" stroke="#c8102e" stroke-width="4" fill="none"/>
      <path d="M46 116l-12 30 8 4 12-28z" fill="#ffc93c"/><circle cx="34" cy="150" r="7" fill="${SKIN_KID}"/>
      <g class="wave" style="transform-origin:104px 116px"><path d="M100 116l14-34 9 4-14 34z" fill="#ffc93c"/><circle cx="120" cy="80" r="7.5" fill="${SKIN_KID}"/></g>
      <rect x="68" y="96" width="14" height="14" rx="4" fill="${SKIN_KID}"/>
      <circle cx="44" cy="70" r="8" fill="${SKIN_KID}"/><circle cx="106" cy="70" r="8" fill="${SKIN_KID}"/>
      <circle cx="75" cy="66" r="32" fill="${SKIN_KID}"/>
      <path d="M43 62c0-32 64-32 64 0-6-14-18-20-32-16-12-6-26 2-32 16z" fill="${HAIR}"/>
      <path d="M60 40q8 8 4 16M76 38q8 8 6 16" stroke="#3d2820" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="63" cy="70" r="4" fill="${HAIR}"/><circle cx="87" cy="70" r="4" fill="${HAIR}"/>
      <circle cx="64.5" cy="68.5" r="1.4" fill="#fff"/><circle cx="88.5" cy="68.5" r="1.4" fill="#fff"/>
      <ellipse cx="55" cy="81" rx="6" ry="3.6" fill="#ff8fa3" opacity=".65"/><ellipse cx="95" cy="81" rx="6" ry="3.6" fill="#ff8fa3" opacity=".65"/>
      <path d="M64 84q11 12 22 0z" fill="#a3122a"/><path d="M68 86q7 4 14 0" stroke="#fff" stroke-width="2" fill="none"/>
      <path d="M75 54v6" stroke="#c8102e" stroke-width="3" stroke-linecap="round"/>
    </g>
  </svg>`;
}
