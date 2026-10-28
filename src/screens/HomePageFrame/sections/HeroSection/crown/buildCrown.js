import * as THREE from "three";

// Procedural crown, drawn from the Soltane logo: ogee prongs with a diamond
// cut-out, a jewelled band, two crossing arches and an emerald on top.
// All sizes are in metres-ish scene units; the band is ~1.25 wide.

const R = 0.62; // band radius
const BAND_H = 0.22;

// Subtle hand-finished look: low-contrast noise used as a roughness map.
const makeRoughnessMap = () => {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = 150 + Math.random() * 60;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  // A few soft streaks, like polishing marks.
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = "#000";
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    const y = Math.random() * size;
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + (Math.random() - 0.5) * 30);
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
};

// Engraved band: a repeating frieze of the logo's diamond between pointed arches,
// used as a bump map so the light catches the cuts.
const makeEngraving = () => {
  const w = 1024;
  const h = 128;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  const n = 16;
  const step = w / n;
  for (let i = 0; i < n; i++) {
    const cx = i * step + step / 2;
    ctx.beginPath();
    ctx.moveTo(cx - step * 0.42, h * 0.78);
    ctx.quadraticCurveTo(cx - step * 0.42, h * 0.3, cx - step * 0.08, h * 0.2);
    ctx.moveTo(cx + step * 0.42, h * 0.78);
    ctx.quadraticCurveTo(cx + step * 0.42, h * 0.3, cx + step * 0.08, h * 0.2);
    ctx.stroke();
  }
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.12);
  ctx.lineTo(w, h * 0.12);
  ctx.moveTo(0, h * 0.88);
  ctx.lineTo(w, h * 0.88);
  ctx.stroke();
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
};

export const createMaterials = () => {
  const roughnessMap = makeRoughnessMap();
  return {
    gold: new THREE.MeshPhysicalMaterial({
      color: "#e2ad55",
      metalness: 1,
      roughness: 0.24,
      roughnessMap,
      bumpMap: roughnessMap,
      bumpScale: 0.06,
      clearcoat: 0.5,
      clearcoatRoughness: 0.12,
    }),
    // Mirror-polished, faceted gold for the set jewels so they sparkle against the band
    goldPolished: new THREE.MeshPhysicalMaterial({
      color: "#f0bd5c",
      metalness: 1,
      roughness: 0.08,
      flatShading: true,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    }),
    goldBand: new THREE.MeshPhysicalMaterial({
      color: "#e2ad55",
      metalness: 1,
      roughness: 0.22,
      roughnessMap,
      bumpMap: makeEngraving(),
      bumpScale: 1.2,
      clearcoat: 0.5,
      clearcoatRoughness: 0.12,
    }),
    emerald: new THREE.MeshPhysicalMaterial({
      color: "#0d6a43",
      flatShading: true,
      emissive: "#03271a",
      emissiveIntensity: 0.6,
      metalness: 0,
      roughness: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      ior: 1.58,
      specularIntensity: 1,
      specularColor: new THREE.Color("#c9ffe4"),
    }),
    pearl: new THREE.MeshPhysicalMaterial({
      color: "#f3eee0",
      roughness: 0.28,
      metalness: 0,
      sheen: 1,
      sheenColor: new THREE.Color("#f2c161"),
      clearcoat: 0.6,
    }),
    velvet: new THREE.MeshPhysicalMaterial({
      color: "#06231a",
      roughness: 1,
      sheen: 1,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color("#2a6b4c"),
    }),
  };
};

const largeProngShape = () => {
  const w = 0.42;
  const H = 0.6;
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo(-w / 2, H * 0.22);
  s.quadraticCurveTo(-w / 2, H * 0.72, 0, H);
  s.quadraticCurveTo(w / 2, H * 0.72, w / 2, H * 0.22);
  s.lineTo(w / 2, 0);
  s.lineTo(-w / 2, 0);
  // Diamond window, as in the logo
  const d = new THREE.Path();
  const cy = H * 0.46;
  d.moveTo(0, cy + 0.11);
  d.lineTo(0.07, cy);
  d.lineTo(0, cy - 0.11);
  d.lineTo(-0.07, cy);
  d.lineTo(0, cy + 0.11);
  s.holes.push(d);
  return { shape: s, height: H };
};

const smallProngShape = () => {
  const w = 0.2;
  const H = 0.32;
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.quadraticCurveTo(-w * 0.45, H * 0.6, 0, H);
  s.quadraticCurveTo(w * 0.45, H * 0.6, w / 2, 0);
  s.lineTo(-w / 2, 0);
  const hole = new THREE.Path();
  hole.absellipse(0, H * 0.38, 0.032, 0.05, 0, Math.PI * 2, false);
  s.holes.push(hole);
  return { shape: s, height: H };
};

const extrude = (shape) => {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.028,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.008,
    bevelSegments: 3,
    curveSegments: 24,
  });
  geo.translate(0, 0, -0.014);
  return geo;
};

export const buildCrown = (m) => {
  const crown = new THREE.Group();
  const add = (geo, mat, setup) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    setup?.(mesh);
    crown.add(mesh);
    return mesh;
  };

  // Band: a lathed profile so it has real thickness and a softened edge.
  const Ri = R - 0.035;
  const profile = [
    new THREE.Vector2(Ri, 0),
    new THREE.Vector2(R, 0),
    new THREE.Vector2(R + 0.014, 0.025),
    new THREE.Vector2(R + 0.014, BAND_H - 0.025),
    new THREE.Vector2(R, BAND_H),
    new THREE.Vector2(Ri, BAND_H),
    new THREE.Vector2(Ri, 0),
  ];
  add(new THREE.LatheGeometry(profile, 160), m.goldBand);

  // Rolled rims
  const rimGeo = new THREE.TorusGeometry(R + 0.012, 0.02, 16, 160);
  add(rimGeo, m.gold, (r) => (r.rotation.x = Math.PI / 2));
  add(rimGeo, m.gold, (r) => {
    r.rotation.x = Math.PI / 2;
    r.position.y = BAND_H;
  });

  // Jewels around the band: emerald cabochons between pearls
  // Faceted stones: flat facets throw sharp glints instead of a plastic sheen.
  const cab = new THREE.IcosahedronGeometry(0.045, 1);
  const pearlGeo = new THREE.SphereGeometry(0.02, 20, 12);
  const settingGeo = new THREE.TorusGeometry(0.047, 0.008, 10, 32);
  const N = 16;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const x = Math.sin(a) * (R + 0.02);
    const z = Math.cos(a) * (R + 0.02);
    if (i % 2 === 0) {
      add(cab, m.emerald, (g) => {
        g.position.set(x, BAND_H / 2, z);
        g.rotation.y = a;
        g.scale.set(0.95, 1.15, 0.6);
      });
      add(settingGeo, m.gold, (g) => {
        g.position.set(Math.sin(a) * (R + 0.017), BAND_H / 2, Math.cos(a) * (R + 0.017));
        g.rotation.y = a;
        g.scale.set(1, 1.15, 1);
      });
    } else {
      add(pearlGeo, m.pearl, (g) => g.position.set(x, BAND_H / 2, z));
    }
  }

  // Prongs: 8 around the crown, large ones on the axes
  const large = largeProngShape();
  const small = smallProngShape();
  const largeGeo = extrude(large.shape);
  const smallGeo = extrude(small.shape);
  const tipGeo = new THREE.SphereGeometry(0.034, 24, 16);
  const jewelGeo = new THREE.OctahedronGeometry(1, 0);
  const beadGeo = new THREE.SphereGeometry(1, 20, 14);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const isLarge = i % 2 === 0;
    const holder = new THREE.Group();
    holder.position.set(Math.sin(a) * (R + 0.004), BAND_H - 0.015, Math.cos(a) * (R + 0.004));
    holder.rotation.y = a;
    const prong = new THREE.Mesh(isLarge ? largeGeo : smallGeo, m.gold);
    prong.castShadow = prong.receiveShadow = true;
    const lean = 0.14; // outwards, towards the holder's local +z
    prong.rotation.x = lean;
    holder.add(prong);
    // Gold jewel set in each window, as in the logo: a faceted diamond in the
    // large prongs, a bead in the small ones. Children of the prong, so they lean with it.
    const jewel = new THREE.Mesh(isLarge ? jewelGeo : beadGeo, m.goldPolished);
    if (isLarge) {
      jewel.position.set(0, large.height * 0.46, 0);
      jewel.scale.set(0.054, 0.086, 0.036);
    } else {
      jewel.position.set(0, small.height * 0.38, 0);
      jewel.scale.set(0.026, 0.04, 0.022);
    }
    jewel.castShadow = true;
    prong.add(jewel);
    if (isLarge) {
      const tip = new THREE.Mesh(tipGeo, m.pearl);
      tip.position.set(0, large.height * Math.cos(lean) + 0.03, large.height * Math.sin(lean));
      tip.castShadow = true;
      holder.add(tip);
    }
    crown.add(holder);
  }

  // Two crossing arches meeting under the orb
  const archGeo = new THREE.TorusGeometry(R * 0.93, 0.024, 16, 72, Math.PI);
  for (const rotY of [0, Math.PI / 2]) {
    add(archGeo, m.gold, (g) => {
      g.position.y = BAND_H;
      g.rotation.y = rotY;
      g.scale.y = 0.82;
    });
  }

  // Velvet cap inside
  const cap = new THREE.SphereGeometry(R * 0.9, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  add(cap, m.velvet, (g) => {
    g.position.y = BAND_H * 0.6;
    g.scale.y = 0.74;
  });

  // Orb and emerald finial, the logo's diamond
  const topY = BAND_H + R * 0.93 * 0.82;
  add(new THREE.SphereGeometry(0.065, 32, 24), m.gold, (g) => (g.position.y = topY + 0.05));
  add(new THREE.OctahedronGeometry(0.07, 0), m.emerald, (g) => {
    g.position.y = topY + 0.18;
    g.scale.set(0.75, 1.35, 0.75);
  });

  return crown;
};

export const CROWN_BAND_HEIGHT = BAND_H;
export const CROWN_RADIUS = R;
