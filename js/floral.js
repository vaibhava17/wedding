// Marigold toran (garland) with swinging ladis + falling petals.
// Orthographic camera in CSS pixels: x right, y = -screenY.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const COLORS = {
  genda: new THREE.Color('#ff8a00'),
  gendaDeep: new THREE.Color('#f26a00'),
  haldi: new THREE.Color('#ffc21a'),
  rose: new THREE.Color('#d0102e'),
  white: new THREE.Color('#fff1d6'),
  leaf: new THREE.Color('#2f8a3a'),
};
const PETAL_COLORS = [COLORS.genda, COLORS.haldi, COLORS.rose, COLORS.gendaDeep, new THREE.Color('#ff4f9a')];

function marigoldGeometry() {
  const g = new THREE.SphereGeometry(1, 28, 18);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const th = Math.atan2(v.z, v.x), ph = Math.acos(THREE.MathUtils.clamp(v.y, -1, 1));
    const ruffle = 1 + 0.13 * Math.sin(th * 13) * Math.sin(ph * 9) + 0.06 * Math.sin(th * 29 + ph * 5);
    v.multiplyScalar(ruffle);
    v.z *= 0.8; // a bit flatter towards the viewer
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function leafGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(0.55, -0.6, 0, -1.6);
  s.quadraticCurveTo(-0.55, -0.6, 0, 0);
  return new THREE.ShapeGeometry(s, 8);
}

function petalGeometry() {
  const g = new THREE.PlaneGeometry(1, 1.5, 2, 6);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    p.setX(i, x * (1 - Math.abs(y) * 0.35));
    p.setZ(i, 0.35 * y * y + 0.2 * x * x);
  }
  g.computeVertexNormals();
  return g;
}

export function initFloral(canvas, { reducedMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  const dprCap = matchMedia('(pointer: coarse)').matches ? 1.6 : 2;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, dprCap));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.setClearColor(0, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.35;
  const key = new THREE.DirectionalLight('#fff3dc', 2.4);
  key.position.set(-0.4, 1, 1.2);
  scene.add(key, new THREE.HemisphereLight('#ffe7b0', '#7a1530', 1.1));

  const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -500, 500);

  // ---------- materials / meshes ----------
  const flowerMat = new THREE.MeshStandardMaterial({ roughness: 0.78, metalness: 0, flatShading: true });
  const leafMat = new THREE.MeshStandardMaterial({ color: COLORS.leaf, roughness: 0.55, side: THREE.DoubleSide });
  const bellMat = new THREE.MeshStandardMaterial({ color: '#f1b93f', metalness: 0.9, roughness: 0.28 });
  const petalMat = new THREE.MeshStandardMaterial({ roughness: 0.6, side: THREE.DoubleSide });

  const MAX_FLOWERS = 900, MAX_LEAVES = 120, MAX_BELLS = 60, MAX_PETALS = reducedMotion ? 0 : 260;
  const flowers = new THREE.InstancedMesh(marigoldGeometry(), flowerMat, MAX_FLOWERS);
  const leaves = new THREE.InstancedMesh(leafGeometry(), leafMat, MAX_LEAVES);
  const bellGeo = new THREE.ConeGeometry(1, 1.4, 18, 1, true);
  bellGeo.translate(0, -0.7, 0);
  const bells = new THREE.InstancedMesh(bellGeo, bellMat, MAX_BELLS);
  const petals = new THREE.InstancedMesh(petalGeometry(), petalMat, Math.max(1, MAX_PETALS));
  [flowers, leaves, bells, petals].forEach((m) => { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; scene.add(m); });

  // ---------- garland model ----------
  let W = 1, H = 1, R = 12;          // viewport + flower radius (px)
  let rope = [];                      // toran flowers [{x,y}] (static-ish)
  let strands = [];                   // [{pts:[{x,y,px,py}], colors:[], anchorX}]
  let leafSpots = [];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const flowerRot = Array.from({ length: MAX_FLOWERS }, () => new THREE.Euler(rnd(0, 6.3), rnd(0, 6.3), rnd(0, 6.3)));

  function ropeY(x) {
    // catenary-ish sag between scallops
    const scallop = Math.max(160, W / Math.max(2, Math.round(W / 320)));
    const u = ((x % scallop) + scallop) % scallop / scallop;
    return R * 1.4 + Math.sin(u * Math.PI) * Math.min(46, W * 0.05);
  }

  function build() {
    R = W < 600 ? 10.5 : 13.5;
    const gap = R * 1.75;
    rope = [];
    for (let x = -R; x <= W + R; x += gap) rope.push({ x, y: ropeY(x) });
    leafSpots = [];
    for (let x = R * 2; x < W; x += R * 4.2) leafSpots.push({ x: x + rnd(-4, 4), a: rnd(-0.35, 0.35) });

    strands = [];
    const spacing = W < 600 ? 58 : 74;
    const n = Math.max(3, Math.floor(W / spacing));
    const start = (W - (n - 1) * spacing) / 2;
    for (let i = 0; i < n; i++) {
      const x = start + i * spacing;
      const centerBoost = 1 - Math.abs(i / (n - 1) - 0.5) * 2; // longer at the edges, shorter at the centre
      const count = Math.round((W < 600 ? 5 : 7) + (1 - centerBoost) * (W < 600 ? 4 : 6) + (i % 2 ? -1 : 1));
      const pts = [];
      const y0 = ropeY(x);
      for (let k = 0; k <= count; k++) pts.push({ x, y: y0 + k * gap * 0.98, px: x, py: y0 + k * gap * 0.98 });
      const colors = pts.map((_, k) => (k === count ? COLORS.rose : (Math.floor(k / 2) % 2 ? COLORS.haldi : COLORS.genda)));
      strands.push({ pts, colors, anchorX: x, len: gap * 0.98 });
    }
  }

  // ---------- petals ----------
  const P = Array.from({ length: MAX_PETALS }, () => ({ alive: false }));
  let ambient = 0; // petals per second from the top
  function spawn(x, y, vx, vy) {
    const p = P.find((q) => !q.alive);
    if (!p) return;
    Object.assign(p, {
      alive: true, x, y, vx, vy,
      rx: rnd(0, 6.3), ry: rnd(0, 6.3), rz: rnd(0, 6.3),
      sx: rnd(-3, 3), sy: rnd(-3, 3), sz: rnd(-2, 2),
      s: rnd(5, 9) * (W < 600 ? 0.9 : 1.1), ph: rnd(0, 6.3),
    });
    petals.setColorAt(P.indexOf(p), PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0]);
    petals.instanceColor.needsUpdate = true;
  }
  function burst(x, y, n = 40, power = 1) {
    for (let i = 0; i < n; i++) {
      const a = rnd(0, Math.PI * 2), v = rnd(120, 520) * power;
      spawn(x, y, Math.cos(a) * v, Math.sin(a) * v - 260 * power);
    }
  }
  function shower(n = 120) {
    for (let i = 0; i < n; i++) setTimeout(() => spawn(rnd(0, W), rnd(-80, -10), rnd(-40, 40), rnd(40, 140)), i * 12);
  }

  // ---------- input ----------
  const pointer = { x: -999, y: -999, vx: 0, vy: 0, t: 0 };
  let wind = 0, gyro = 0, scrollY = 0;
  addEventListener('pointermove', (e) => {
    const now = performance.now(), dt = Math.max(8, now - pointer.t);
    if (pointer.t) { pointer.vx = (e.clientX - pointer.x) / dt * 16; pointer.vy = (e.clientY - pointer.y) / dt * 16; }
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.t = now;
  }, { passive: true });
  addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
  function enableGyro() {
    const handler = (e) => { if (e.gamma != null) gyro = THREE.MathUtils.clamp(e.gamma / 30, -1.5, 1.5); };
    const DOE = window.DeviceOrientationEvent;
    if (DOE && typeof DOE.requestPermission === 'function') {
      DOE.requestPermission().then((s) => { if (s === 'granted') addEventListener('deviceorientation', handler); }).catch(() => {});
    } else if (DOE) addEventListener('deviceorientation', handler);
  }

  // ---------- resize ----------
  function resize() {
    W = innerWidth; H = innerHeight;
    renderer.setSize(W, H, false);
    camera.left = 0; camera.right = W; camera.top = 0; camera.bottom = -H;
    camera.updateProjectionMatrix();
    build();
  }
  addEventListener('resize', resize);
  resize();

  // ---------- simulation ----------
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e3 = new THREE.Euler(), pos = new THREE.Vector3(), scl = new THREE.Vector3();
  const GRAV = 1400;
  let time = 0;

  function stepStrands(dt) {
    const breeze = Math.sin(time * 0.8) * 90 + Math.sin(time * 2.1 + 1) * 40 + gyro * 380 + wind;
    for (const s of strands) {
      const p0 = s.pts[0];
      p0.x = s.anchorX; p0.y = ropeY(s.anchorX);
      for (let k = 1; k < s.pts.length; k++) {
        const p = s.pts[k];
        const vx = (p.x - p.px) * 0.985, vy = (p.y - p.py) * 0.985;
        p.px = p.x; p.py = p.y;
        let ax = breeze * (0.4 + k * 0.12), ay = GRAV;
        // pointer push (pointer is in screen coords; garland scrolls with page)
        const dx = p.x - pointer.x, dy = (p.y - scrollY) - pointer.y;
        const d2 = dx * dx + dy * dy, rad = 90;
        if (d2 < rad * rad) {
          const f = 1 - Math.sqrt(d2) / rad;
          ax += pointer.vx * 900 * f; ay += pointer.vy * 500 * f;
        }
        p.x += vx + ax * dt * dt;
        p.y += vy + ay * dt * dt;
      }
      for (let it = 0; it < 5; it++) {
        for (let k = 1; k < s.pts.length; k++) {
          const a = s.pts[k - 1], b = s.pts[k];
          const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
          const diff = (d - s.len) / d;
          if (k === 1) { b.x -= dx * diff; b.y -= dy * diff; }
          else { a.x += dx * diff * 0.5; a.y += dy * diff * 0.5; b.x -= dx * diff * 0.5; b.y -= dy * diff * 0.5; }
        }
      }
    }
    pointer.vx *= 0.85; pointer.vy *= 0.85;
    wind *= 0.95;
  }

  function writeGarland() {
    let fi = 0, li = 0, bi = 0;
    const oy = scrollY; // garland belongs to the top of the page
    const put = (x, y, r, rot, color) => {
      if (fi >= MAX_FLOWERS) return;
      pos.set(x, -(y - oy), 0);
      q.setFromEuler(rot);
      scl.setScalar(r);
      m4.compose(pos, q, scl);
      flowers.setMatrixAt(fi, m4);
      flowers.setColorAt(fi, color);
      fi++;
    };
    // toran rope: two rows of flowers for fullness
    rope.forEach((p, i) => {
      put(p.x, p.y, R * 1.05, flowerRot[i], i % 3 === 0 ? COLORS.haldi : COLORS.genda);
      put(p.x + R * 0.9, p.y - R * 0.9, R * 0.8, flowerRot[i + 300], i % 2 ? COLORS.gendaDeep : COLORS.rose);
    });
    // mango leaves hanging off the rope
    for (const l of leafSpots) {
      if (li >= MAX_LEAVES) break;
      const sway = Math.sin(time * 1.6 + l.x * 0.05) * 0.12;
      pos.set(l.x, -(ropeY(l.x) + R * 0.6 - oy), -2);
      q.setFromEuler(e3.set(0.3, 0, l.a + sway));
      scl.set(R * 1.3, R * 1.9, 1);
      m4.compose(pos, q, scl);
      leaves.setMatrixAt(li++, m4);
    }
    // strands
    let ri = 600;
    for (const s of strands) {
      s.pts.forEach((p, k) => {
        if (k === 0) return;
        put(p.x, p.y, R * (k === s.pts.length - 1 ? 0.95 : 1), flowerRot[ri++ % MAX_FLOWERS], s.colors[k]);
      });
      const tail = s.pts[s.pts.length - 1], prev = s.pts[s.pts.length - 2];
      if (bi < MAX_BELLS) {
        const ang = Math.atan2(tail.x - prev.x, tail.y - prev.y);
        pos.set(tail.x, -(tail.y + R * 0.9 - oy), 1);
        q.setFromEuler(e3.set(0, 0, ang));
        scl.set(R * 0.62, R * 0.62, R * 0.62);
        m4.compose(pos, q, scl);
        bells.setMatrixAt(bi++, m4);
      }
    }
    flowers.count = fi; leaves.count = li; bells.count = bi;
    flowers.instanceMatrix.needsUpdate = true;
    if (flowers.instanceColor) flowers.instanceColor.needsUpdate = true;
    leaves.instanceMatrix.needsUpdate = true;
    bells.instanceMatrix.needsUpdate = true;
  }

  let spawnAcc = 0;
  function stepPetals(dt) {
    let alive = 0;
    spawnAcc += ambient * dt;
    while (spawnAcc > 1) { spawnAcc -= 1; spawn(rnd(0, W), -20, rnd(-30, 30), rnd(30, 90)); }
    P.forEach((p, i) => {
      if (!p.alive) { m4.makeScale(0, 0, 0); petals.setMatrixAt(i, m4); return; }
      alive++;
      p.ph += dt * 3;
      p.vx += (Math.sin(p.ph) * 60 + gyro * 120 - p.vx * 0.9) * dt;
      p.vy += (260 - p.vy * 1.6) * dt; // drag → slow terminal fall
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.rx += p.sx * dt; p.ry += p.sy * dt; p.rz += p.sz * dt;
      if (p.y > H + 40 || p.x < -60 || p.x > W + 60) p.alive = false;
      pos.set(p.x, -p.y, 40);
      q.setFromEuler(e3.set(p.rx, p.ry, p.rz));
      scl.setScalar(p.s);
      m4.compose(pos, q, scl);
      petals.setMatrixAt(i, m4);
    });
    petals.instanceMatrix.needsUpdate = true;
    return alive;
  }

  // init colours buffers
  flowers.setColorAt(0, COLORS.genda);
  if (MAX_PETALS) petals.setColorAt(0, COLORS.genda);

  let garlandOn = true;
  const api = {
    burst, shower, enableGyro,
    setAmbient(n) { ambient = reducedMotion ? 0 : n; },
    gust(v) { wind += v; },
    tick(dt) {
      time += dt;
      const garlandVisible = garlandOn && scrollY < H * 1.1;
      if (garlandVisible && !reducedMotion) {
        const sub = 2, h = Math.min(dt, 1 / 30) / sub;
        for (let i = 0; i < sub; i++) stepStrands(h);
      }
      flowers.visible = leaves.visible = bells.visible = garlandVisible;
      if (garlandVisible) writeGarland();
      const alive = MAX_PETALS ? stepPetals(Math.min(dt, 1 / 30)) : 0;
      if (garlandVisible || alive > 0 || api._dirty) {
        renderer.render(scene, camera);
        api._dirty = garlandVisible || alive > 0;
      }
    },
    _dirty: true,
  };
  return api;
}
