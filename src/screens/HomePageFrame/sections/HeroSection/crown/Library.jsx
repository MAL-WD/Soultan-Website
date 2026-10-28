import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// The hall the crown travels through: Soltane is a مكتبة, so the set is a
// library — arched niches of bookshelves behind the throne, shelves running
// down both side walls, warm reading lamps. Books are one instanced mesh.

const BOOK_COLORS = ["#0f3d2c", "#1d4a3a", "#5a1f1f", "#2b2b3a", "#d9c8a0", "#8a6a2f", "#123326", "#3b2f2a", "#6b5a3a", "#e8dcc0"];

const rand = (() => {
  // Seeded, so the shelves look the same on every visit
  let s = 7;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
})();

// Fill a shelf run (local x from 0 to length) with upright books.
const fillShelf = (out, length, baseY, place) => {
  let x = 0.03;
  while (x < length - 0.05) {
    const w = 0.035 + rand() * 0.05;
    const h = 0.24 + rand() * 0.12;
    const d = 0.2 + rand() * 0.05;
    const gap = rand() < 0.06 ? 0.08 : 0.004;
    const lean = rand() < 0.04 ? (rand() - 0.5) * 0.35 : 0;
    out.push({ ...place(x + w / 2, baseY + h / 2, d), w, h, d, lean, color: BOOK_COLORS[Math.floor(rand() * BOOK_COLORS.length)] });
    x += w + gap;
  }
};

const archShape = (w, h) => {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo(-w / 2, h - w / 2);
  s.absarc(0, h - w / 2, w / 2, Math.PI, 0, true);
  s.lineTo(w / 2, 0);
  s.lineTo(-w / 2, 0);
  return s;
};

const archFrame = (w, h, t) => {
  const s = archShape(w, h);
  const inner = archShape(w - t * 2, h - t);
  s.holes.push(new THREE.Path(inner.getPoints(64)));
  return s;
};

export const Library = ({ lite }) => {
  const booksRef = useRef();
  const boardsRef = useRef();

  const { books, boards } = useMemo(() => {
    const books = [];
    const boards = [];
    const rows = 7;
    const rowH = 0.46;

    // Three arched niches in the back wall (z = -3)
    const niches = [
      { x: 0, w: 2.3, h: 4.7 },
      { x: -2.75, w: 1.9, h: 4.1 },
      { x: 2.75, w: 1.9, h: 4.1 },
    ];
    for (const n of niches) {
      const shelfW = n.w - 0.12;
      for (let r = 0; r < rows; r++) {
        const y = 0.35 + r * rowH;
        if (y + rowH > n.h - n.w / 2 + 0.2) break;
        boards.push({ x: n.x, y, z: -3.05, w: shelfW, h: 0.03, d: 0.3, rotY: 0 });
        fillShelf(books, shelfW, y + 0.015, (lx, ly, d) => ({ x: n.x - shelfW / 2 + lx, y: ly, z: -3.2 + d / 2, rotY: 0 }));
      }
    }

    // Side walls, running towards the viewer
    if (!lite) {
      for (const side of [-1, 1]) {
        const wallX = side * 4.1;
        const runZ0 = -2.6;
        const runLen = 6;
        for (let r = 0; r < rows + 1; r++) {
          const y = 0.35 + r * rowH;
          boards.push({ x: wallX - side * 0.15, y, z: runZ0 + runLen / 2, w: runLen, h: 0.03, d: 0.3, rotY: Math.PI / 2 });
          fillShelf(books, runLen, y + 0.015, (lx, ly, d) => ({ x: wallX - side * (d / 2 + 0.01), y: ly, z: runZ0 + lx, rotY: Math.PI / 2 }));
        }
      }
    }
    return { books, boards };
  }, [lite]);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const c = new THREE.Color();
    books.forEach((b, i) => {
      e.set(0, b.rotY, b.lean);
      q.setFromEuler(e);
      m.compose(new THREE.Vector3(b.x, b.y, b.z), q, new THREE.Vector3(b.w, b.h, b.d));
      booksRef.current.setMatrixAt(i, m);
      booksRef.current.setColorAt(i, c.set(b.color));
    });
    booksRef.current.instanceMatrix.needsUpdate = true;
    booksRef.current.instanceColor.needsUpdate = true;
    boards.forEach((b, i) => {
      q.setFromEuler(e.set(0, b.rotY, 0));
      m.compose(new THREE.Vector3(b.x, b.y, b.z), q, new THREE.Vector3(b.w, b.h, b.d));
      boardsRef.current.setMatrixAt(i, m);
    });
    boardsRef.current.instanceMatrix.needsUpdate = true;
  }, [books, boards]);

  const geos = useMemo(() => {
    const wallShape = new THREE.Shape();
    wallShape.moveTo(-6, 0);
    wallShape.lineTo(6, 0);
    wallShape.lineTo(6, 7);
    wallShape.lineTo(-6, 7);
    wallShape.lineTo(-6, 0);
    for (const n of [
      { x: 0, w: 2.3, h: 4.7 },
      { x: -2.75, w: 1.9, h: 4.1 },
      { x: 2.75, w: 1.9, h: 4.1 },
    ]) {
      const hole = archShape(n.w, n.h);
      wallShape.holes.push(new THREE.Path(hole.getPoints(64).map((p) => new THREE.Vector2(p.x + n.x, p.y))));
    }
    return {
      wall: new THREE.ExtrudeGeometry(wallShape, { depth: 0.35, bevelEnabled: false, curveSegments: 48 }),
      centreFrame: new THREE.ExtrudeGeometry(archFrame(2.42, 4.76, 0.06), { depth: 0.04, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, curveSegments: 64 }),
      sideFrame: new THREE.ExtrudeGeometry(archFrame(2.02, 4.16, 0.05), { depth: 0.04, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, curveSegments: 64 }),
    };
  }, []);

  const mats = useMemo(
    () => ({
      plaster: new THREE.MeshStandardMaterial({ color: "#0b2a1f", roughness: 0.9 }),
      wood: new THREE.MeshStandardMaterial({ color: "#2a1d12", roughness: 0.6 }),
      gold: new THREE.MeshStandardMaterial({ color: "#c99a45", roughness: 0.3, metalness: 1 }),
      back: new THREE.MeshStandardMaterial({ color: "#081d16", roughness: 1 }),
      floor: new THREE.MeshStandardMaterial({ color: "#07150f", roughness: 0.42, metalness: 0.2 }),
      rug: new THREE.MeshStandardMaterial({ color: "#0d3a28", roughness: 1 }),
      bulb: new THREE.MeshBasicMaterial({ color: "#ffd99a" }),
      books: new THREE.MeshStandardMaterial({ roughness: 0.75, metalness: 0.05 }),
    }),
    []
  );

  return (
    <group>
      {/* Back wall with its three arches, and the dark recess behind the shelves */}
      <mesh geometry={geos.wall} material={mats.plaster} position={[0, 0, -2.95]} receiveShadow />
      <mesh material={mats.back} position={[0, 3, -3.3]}>
        <planeGeometry args={[12, 7]} />
      </mesh>
      <mesh geometry={geos.centreFrame} material={mats.gold} position={[0, 0, -2.58]} />
      <mesh geometry={geos.sideFrame} material={mats.gold} position={[-2.75, 0, -2.58]} />
      <mesh geometry={geos.sideFrame} material={mats.gold} position={[2.75, 0, -2.58]} />

      <instancedMesh ref={booksRef} args={[undefined, undefined, books.length]} material={mats.books} castShadow={false} receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      <instancedMesh ref={boardsRef} args={[undefined, undefined, boards.length]} material={mats.wood} receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>

      {/* Side walls behind the side shelves */}
      {!lite &&
        [-1, 1].map((side) => (
          <mesh key={side} material={mats.plaster} position={[side * 4.35, 3.5, 0.4]} rotation-y={-side * Math.PI / 2}>
            <planeGeometry args={[8, 7]} />
          </mesh>
        ))}

      {/* Reading lamps between the niches */}
      {[-1.42, 1.42].map((x) => (
        <group key={x} position={[x, 3.15, -2.55]}>
          <mesh material={mats.gold} position={[0, 0.16, -0.05]}>
            <cylinderGeometry args={[0.012, 0.012, 0.3, 8]} />
          </mesh>
          <mesh material={mats.bulb}>
            <sphereGeometry args={[0.06, 16, 12]} />
          </mesh>
          <pointLight color="#ffc978" intensity={2.2} distance={4.5} decay={2} position={[0, -0.05, 0.25]} />
        </group>
      ))}

      {/* Floor and a round rug under the throne */}
      <mesh rotation-x={-Math.PI / 2} material={mats.floor} receiveShadow>
        <planeGeometry args={[14, 14]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 0.2]} material={mats.rug} receiveShadow>
        <circleGeometry args={[1.6, 64]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.007, 0.2]} material={mats.gold}>
        <ringGeometry args={[1.5, 1.54, 96]} />
      </mesh>
    </group>
  );
};
