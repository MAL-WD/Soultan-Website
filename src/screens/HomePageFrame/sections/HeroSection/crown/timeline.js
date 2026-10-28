// One master timeline: every scene property is a function of scroll progress p (0..1).
// Keyframes are joined with monotone cubic curves, so motion flows through each
// key without stopping and never overshoots between them.

export const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Fritsch–Carlson monotone cubic interpolation
const monotone = (xs, ys) => {
  const n = xs.length;
  const d = [];
  const m = new Array(n);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const h = a * a + b * b;
    if (h > 9) {
      const t = 3 / Math.sqrt(h);
      m[i] = t * a * d[i];
      m[i + 1] = t * b * d[i];
    }
  }
  return (x) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const t = (x - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h * m[i + 1]
    );
  };
};

const P = [0, 0.15, 0.35, 0.55, 0.75, 0.88, 1];

// The crown is scaled to the figure (see Sovereign.jsx): it hovers high in the
// hall, is lowered, and rests on the head at CROWN_REST_Y.
// Stage 1 (0–.15) close-up · Stage 2 (.15–.55) pull back and begin descent ·
// Stage 3 (.55–.9) the figure is revealed and crowned · .9–1 final composition.
const desktop = {
  camX: [0.05, 0.08, 0.22, 0.35, 0.3, 0.12, 0],
  camY: [4.28, 4.3, 4.35, 3.95, 3.25, 2.65, 2.5],
  camZ: [0.78, 0.98, 1.7, 2.8, 3.9, 4.5, 4.8],
  lookY: [4.33, 4.32, 4.24, 3.6, 2.95, 2.4, 2.25],
  lookZ: [-0.06, -0.06, -0.06, -0.06, -0.06, -0.06, -0.06],
  fov: [30, 30, 30, 30, 31, 31, 31],
};

const mobile = {
  camX: [0.04, 0.06, 0.18, 0.28, 0.25, 0.1, 0],
  camY: [4.28, 4.3, 4.4, 4.05, 3.35, 2.6, 2.45],
  camZ: [0.95, 1.2, 2.2, 3.6, 5.4, 7.0, 7.6],
  lookY: [4.33, 4.32, 4.24, 3.55, 2.8, 1.95, 1.62],
  lookZ: [-0.08, -0.08, -0.08, -0.08, -0.08, -0.08, -0.08],
  fov: [38, 38, 38, 38, 40, 40, 40],
};

const REST = 2.755;
export const CROWN_REST_Y = REST; // band rests where the head narrows to its inner radius
const shared = {
  crownY: [4.2, 4.2, 4.15, 3.75, 3.05, REST, REST],
  // A quarter turn: large prongs sit every 90°, so the diamond prong faces camera at both ends.
  crownRot: [-1.571, -1.45, -1.0, -0.55, -0.15, 0, 0],
  crownTilt: [0, 0, 0.03, 0.07, 0.04, 0, 0],
  key: [2.4, 2.6, 2.9, 3.1, 3.3, 3.8, 3.8],
  rim: [1.2, 1.5, 1.7, 1.5, 1.4, 1.7, 1.7],
};

const build = (set) => Object.fromEntries(Object.entries(set).map(([k, v]) => [k, monotone(P, v)]));
const curves = { desktop: build({ ...desktop, ...shared }), mobile: build({ ...mobile, ...shared }) };

export const track = (p, { isSmall }) => {
  const c = isSmall ? curves.mobile : curves.desktop;
  return {
    cam: [c.camX(p), c.camY(p), c.camZ(p)],
    look: [0, c.lookY(p), c.lookZ(p)],
    fov: c.fov(p),
    crownY: c.crownY(p), // the landing bounce comes from the crown's spring, see CrownScene
    crownRot: c.crownRot(p),
    crownTilt: c.crownTilt(p),
    key: c.key(p),
    rim: c.rim(p),
  };
};

// On load, before any scroll: the crown flies in from the far end of the hall,
// turning as it comes. t is seconds since the scene appeared.
export const INTRO_SECONDS = 2.8;
export const intro = (t) => {
  const x = Math.min(1, Math.max(0, t / INTRO_SECONDS));
  const e = 1 - Math.pow(1 - x, 3);
  return { done: x >= 1, z: (1 - e) * -9, y: (1 - e) * 0.9, spin: (1 - e) * 3.4 };
};