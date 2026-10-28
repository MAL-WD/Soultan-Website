import React, { useMemo } from "react";
import * as THREE from "three";

// The customer: a faceless person in a flowing black robe with gold trim,
// seated on a throne whose back is the Soltane arch. No face, so it stands for
// every customer rather than one person.

// Head geometry is shared with the timeline so the crown lands exactly on it.
// Head is a lathed egg: base (chin) at y, widest r at about 60% of its height.
export const HEAD = { x: 0, y: 2.4, z: -0.06, r: 0.216, h: 0.52, sz: 1.1 };

// Profiles for lathed body parts: [radius, height] pairs from bottom to top.
const lathe = (pts, segments = 48) =>
  new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), segments);

const HEAD_PROFILE = [
  [0, 0], [0.09, 0.012], [0.15, 0.06], [0.19, 0.15], [0.212, 0.26], [0.216, 0.32],
  [0.205, 0.4], [0.17, 0.465], [0.1, 0.505], [0, 0.52],
];
// Hips → waist → chest → shoulders, softly tapering into the neck.
const TORSO_PROFILE = [
  [0, 0], [0.19, 0.02], [0.235, 0.14], [0.215, 0.36], [0.245, 0.58], [0.262, 0.76],
  [0.255, 0.88], [0.21, 0.98], [0.12, 1.05], [0.085, 1.08],
];

const V2 = (x, y) => new THREE.Vector2(x, y);
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

// The robe below the waist, drawn from the side (x here = depth, y = height):
// over the lap, round the knees and down to a hem on the floor. Extruded across
// the body, then given soft vertical folds where the fabric hangs.
const buildSkirt = () => {
  const s = new THREE.Shape();
  s.moveTo(-0.28, 0.94);
  s.splineThru([V2(-0.3, 1.18), V2(0.05, 1.24), V2(0.45, 1.2), V2(0.74, 1.12), V2(0.85, 0.97), V2(0.87, 0.6), V2(0.92, 0.22), V2(0.96, 0.03)]);
  s.lineTo(0.42, 0.03);
  s.splineThru([V2(0.47, 0.48), V2(0.5, 0.86)]);
  s.lineTo(-0.28, 0.94);
  const depth = 0.6;
  const geo = new THREE.ExtrudeGeometry(s, {
    depth,
    steps: 56,
    curveSegments: 64,
    bevelEnabled: true,
    bevelSize: 0.05,
    bevelThickness: 0.07,
    bevelSegments: 6,
  });
  geo.translate(0, 0, -depth / 2);
  geo.rotateY(-Math.PI / 2); // profile depth → world z, extrusion → world x
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // Folds deepen towards the hem and are strongest on the front drop
    const hang = THREE.MathUtils.smoothstep(1.05 - y, 0, 0.9) * (z > 0.55 ? 1 : 0.35);
    pos.setZ(i, z + (Math.sin(x * 24 + y * 2.5) * 0.7 + Math.sin(x * 57) * 0.3) * 0.02 * hang);
  }
  geo.computeVertexNormals();
  return geo;
};

// A sleeve that follows the arm and opens into a bell at the wrist.
const SLEEVE_PATH = (s) => [V3(s * 0.33, 2.03, -0.14), V3(s * 0.49, 1.76, -0.12), V3(s * 0.56, 1.53, -0.06), V3(s * 0.6, 1.47, 0.16), V3(s * 0.61, 1.46, 0.32)];
const buildSleeve = (s) => {
  const curve = new THREE.CatmullRomCurve3(SLEEVE_PATH(s));
  const segs = 48;
  const radial = 24;
  const geo = new THREE.TubeGeometry(curve, segs, 0.1, radial, false);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) {
    const u = i / segs;
    const centre = curve.getPointAt(u);
    const widen = 0.92 + 0.12 * Math.sin(u * Math.PI) + THREE.MathUtils.smoothstep(u, 0.6, 1) * 0.42;
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, k).sub(centre).multiplyScalar(widen).add(centre);
      pos.setXYZ(k, v.x, v.y, v.z);
    }
  }
  geo.computeVertexNormals();
  const end = curve.getPointAt(1);
  const tangent = curve.getTangentAt(1);
  return { geo, end, cuffQ: new THREE.Quaternion().setFromUnitVectors(V3(0, 0, 1), tangent), cuffR: 0.1 * 1.34 };
};

// Mantle over the shoulders: one smooth lathed piece, so there are no joints.
const MANTLE_PROFILE = [
  [0.105, 0], [0.16, -0.03], [0.29, -0.1], [0.41, -0.21], [0.465, -0.34], [0.48, -0.47],
];
const archShape = (w, h) => {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo(-w / 2, h - w / 2);
  s.absarc(0, h - w / 2, w / 2, Math.PI, 0, true);
  s.lineTo(w / 2, 0);
  s.lineTo(-w / 2, 0);
  return s;
};

export const Sovereign = ({ headRef, chestRef }) => {
  const m = useMemo(
    () => ({
      skin: new THREE.MeshPhysicalMaterial({
        color: "#0b0b0c",
        roughness: 0.38,
        clearcoat: 0.55,
        clearcoatRoughness: 0.28,
        sheen: 0.6,
        sheenColor: new THREE.Color("#4a4a48"),
      }),
      velvet: new THREE.MeshPhysicalMaterial({
        color: "#0c3a28",
        roughness: 1,
        sheen: 1,
        sheenRoughness: 0.45,
        sheenColor: new THREE.Color("#3f8a64"),
      }),
      gold: new THREE.MeshPhysicalMaterial({ color: "#d4a14b", metalness: 1, roughness: 0.28, clearcoat: 0.3 }),
      robe: new THREE.MeshPhysicalMaterial({
        color: "#0e0e10",
        roughness: 0.55,
        sheen: 1,
        sheenRoughness: 0.32,
        sheenColor: new THREE.Color("#6a6470"),
        side: THREE.DoubleSide,
      }),
    }),
    []
  );

  const shapes = useMemo(
    () => ({
      head: lathe(HEAD_PROFILE, 64),
      torso: lathe(TORSO_PROFILE, 64),
      mantle: lathe(MANTLE_PROFILE, 72),
      skirt: buildSkirt(),
      sleeves: [buildSleeve(-1), buildSleeve(1)],
    }),
    []
  );

  const throne = useMemo(() => {
    const back = new THREE.ExtrudeGeometry(archShape(1.08, 2.05), { depth: 0.12, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, curveSegments: 48 });
    const frameShape = archShape(1.22, 2.14);
    frameShape.holes.push(new THREE.Path(archShape(1.08, 2.05).getPoints(64)));
    const frame = new THREE.ExtrudeGeometry(frameShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, curveSegments: 48 });
    return { back, frame };
  }, []);

  return (
    <group>
      {/* Throne */}
      <group>
        <mesh material={m.velvet} position={[0, 0.88, 0.04]} castShadow receiveShadow>
          <boxGeometry args={[1.06, 0.16, 0.96]} />
        </mesh>
        <mesh material={m.gold} position={[0, 0.77, 0.04]} castShadow receiveShadow>
          <boxGeometry args={[1.14, 0.07, 1.02]} />
        </mesh>
        {[
          [-0.5, 0.5],
          [0.5, 0.5],
          [-0.5, -0.4],
          [0.5, -0.4],
        ].map(([x, z]) => (
          <mesh key={`${x}${z}`} material={m.gold} position={[x, 0.37, z]} castShadow>
            <cylinderGeometry args={[0.035, 0.045, 0.74, 16]} />
          </mesh>
        ))}
        <group position={[0, 0.82, -0.5]} rotation-x={-0.1}>
          <mesh geometry={throne.back} material={m.velvet} position={[0, 0, -0.06]} castShadow receiveShadow />
          <mesh geometry={throne.frame} material={m.gold} position={[0, -0.02, -0.04]} castShadow receiveShadow />
        </group>
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh material={m.gold} position={[s * 0.6, 1.34, 0.04]} castShadow receiveShadow>
              <boxGeometry args={[0.13, 0.07, 0.88]} />
            </mesh>
            <mesh material={m.gold} position={[s * 0.6, 1.1, 0.42]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.45, 12]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Figure: chest and mantle breathe together */}
      <group ref={chestRef} position={[0, 0, -0.12]}>
        <mesh geometry={shapes.torso} material={m.robe} position={[0, 1.0, -0.01]} rotation-x={-0.05} scale={[1.3, 1.14, 0.78]} castShadow receiveShadow />
        <mesh geometry={shapes.mantle} material={m.robe} position={[0, 2.26, 0]} scale={[1, 1, 0.64]} castShadow receiveShadow />
        <mesh material={m.gold} position={[0, 1.79, 0]} rotation-x={Math.PI / 2} scale={[1, 0.64, 1]} castShadow>
          <torusGeometry args={[0.48, 0.011, 10, 96]} />
        </mesh>
        <mesh material={m.gold} position={[0, 2.255, 0]} rotation-x={Math.PI / 2} scale={[1, 0.64, 1]}>
          <torusGeometry args={[0.107, 0.012, 10, 48]} />
        </mesh>
      </group>
      <mesh geometry={shapes.skirt} material={m.robe} castShadow receiveShadow />
      {shapes.sleeves.map((sl, i) => (
        <group key={i}>
          <mesh geometry={sl.geo} material={m.robe} castShadow receiveShadow />
          <mesh material={m.gold} position={sl.end} quaternion={sl.cuffQ}>
            <torusGeometry args={[sl.cuffR, 0.011, 10, 48]} />
          </mesh>
        </group>
      ))}
      {[-1, 1].map((s) => (
        <group key={s}>
          {/* Hand resting on the armrest, emerging from the sleeve */}
          <mesh material={m.skin} position={[s * 0.61, 1.435, 0.42]} rotation-y={s * 0.08} scale={[0.062, 0.045, 0.11]} castShadow>
            <sphereGeometry args={[1, 24, 16]} />
          </mesh>
          {/* Shoe tips under the hem */}
          <mesh material={m.skin} position={[s * 0.17, 0.045, 0.99]} scale={[0.07, 0.045, 0.1]} castShadow receiveShadow>
            <sphereGeometry args={[1, 20, 12]} />
          </mesh>
        </group>
      ))}
      <mesh material={m.skin} position={[0, 2.33, -0.1]} castShadow>
        <cylinderGeometry args={[0.083, 0.095, 0.26, 32]} />
      </mesh>      {/* Faceless head */}
      {/* Pivots at the base of the skull so it can look up */}
      <group ref={headRef} position={[HEAD.x, HEAD.y, HEAD.z]}>
        <mesh geometry={shapes.head} material={m.skin} scale={[1, 1, HEAD.sz]} castShadow receiveShadow />
      </group>
    </group>
  );
};
