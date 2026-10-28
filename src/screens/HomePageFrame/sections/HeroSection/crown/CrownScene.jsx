import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { Bloom, DepthOfField, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { buildCrown, createMaterials } from "./buildCrown";
import { CROWN_REST_Y, intro, track, smoothstep } from "./timeline";
import { createSpring } from "./spring";
import { Library } from "./Library";
import { HEAD, Sovereign } from "./Sovereign";

const BG = "#03140e";
const CROWN_SCALE = 0.36; // sized to the figure's head

// Reflections: a generated studio room straight away, then a photographed
// studio (Poly Haven "Studio Small 09", CC0) once its 1.6 MB file arrives.
// Gold only looks like gold when it reflects real light.
const StudioEnvironment = () => {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    let env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.6;
    let cancelled = false;
    new RGBELoader().load("/hdr/studio_small_09_1k.hdr", (hdr) => {
      if (cancelled) return hdr.dispose();
      const next = pmrem.fromEquirectangular(hdr).texture;
      hdr.dispose();
      env.dispose();
      env = next;
      scene.environment = env;
      scene.environmentIntensity = 0.85;
      // Turn the studio so its big softbox sits up and to the right of the crown
      scene.environmentRotation.set(0, -0.9, 0);
      invalidate();
    });
    return () => {
      cancelled = true;
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, invalidate]);
  return null;
};

// Film look: focus pulled onto the crown, gold highlights bloom, a soft
// vignette and fine grain. Phones keep only the cheap parts.
const Cinematic = ({ focus, isSmall }) => (
  <EffectComposer multisampling={isSmall ? 0 : 4} disableNormalPass>
    {!isSmall && <DepthOfField target={focus} focalLength={0.03} bokehScale={3.2} height={480} />}
    <Bloom intensity={0.55} luminanceThreshold={0.82} luminanceSmoothing={0.2} mipmapBlur />
    <Vignette offset={0.32} darkness={0.62} />
    {!isSmall && <Noise opacity={0.035} blendFunction={BlendFunction.SOFT_LIGHT} />}
    <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
  </EffectComposer>
);
// Gold dust in the air; foreground specks pass the lens as the camera pulls back.
const Dust = ({ count }) => {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 1] = Math.random() * 5;
      pos[i * 3 + 2] = -2.5 + Math.random() * 8;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
  return (
    <points geometry={geo}>
      <pointsMaterial color="#f2c161" size={0.012} sizeAttenuation transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
};

const Rig = ({ store, overlay, isSmall, reduce }) => {
  const { camera, invalidate, clock } = useThree();
  const crownRef = useRef();
  const keyRef = useRef();
  const rimRef = useRef();
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const started = useRef(null);
  const landedAt = useRef(-10);
  const glintRef = useRef();
  const headRef = useRef();
  const chestRef = useRef();
  const focus = useMemo(() => new THREE.Vector3(0, 4.2, -0.06), []);
  const pointer = useMemo(() => ({ x: 0, y: 0 }), []);
  // Damping/response pairs follow Apple's fluid-motion defaults: critically
  // damped for the camera, a touch of bounce only where there's real momentum.
  const springs = useMemo(
    () => ({
      progress: createSpring(store.current, { dampingRatio: 1, response: 0.45 }),
      crownY: createSpring(track(store.current, { isSmall }).crownY, { dampingRatio: 0.78, response: 0.5 }),
      crownRot: createSpring(track(store.current, { isSmall }).crownRot + intro(0).spin, { dampingRatio: 0.9, response: 0.7 }),
      // Head and camera drift are reactions, not momentum: critically damped.
      headPitch: createSpring(0, { dampingRatio: 1, response: 0.8 }),
      lookX: createSpring(0, { dampingRatio: 1, response: 0.9 }),
      lookY: createSpring(0, { dampingRatio: 1, response: 0.9 }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    store.invalidate = invalidate;
    invalidate();
    return () => {
      store.invalidate = null;
    };
  }, [store, invalidate]);

  // The entrance waits for the site preloader to fade, so nobody misses it.
  const [revealed, setRevealed] = useState(() => typeof window !== "undefined" && !!window.__soltanePreloaded);
  useEffect(() => {
    if (revealed) return;
    const go = () => setRevealed(true);
    window.addEventListener("soltane:preloaded", go);
    return () => window.removeEventListener("soltane:preloaded", go);
  }, [revealed]);
  useEffect(() => {
    if (revealed) invalidate();
  }, [revealed, invalidate]);

  // Desktop only: the camera drifts a little with the mouse, as if you were
  // looking around the library.
  useEffect(() => {
    if (isSmall || reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (store.visible) invalidate();
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [isSmall, reduce, pointer, store, invalidate]);

  useFrame((_, delta) => {
    const now = clock.getElapsedTime();
    if (started.current === null && revealed) started.current = now + 0.5;

    // The camera rides a critically damped spring on scroll progress: smooth,
    // no overshoot, and a fast flick still lands on exactly the right frame.
    const dt = Math.min(delta, 0.1);
    const ps = springs.progress;
    if (reduce) ps.snap(store.target);
    else ps.step(store.target, dt);
    let moving = !ps.atRest(store.target, 0.0002);
    if (!moving) ps.snap(store.target);
    const p = (store.current = Math.min(1, Math.max(0, ps.value)));

    const s = track(p, { isSmall, aspect: camera.aspect });
    const lx = springs.lookX.step(pointer.x, dt);
    const ly = springs.lookY.step(pointer.y, dt);
    if (!springs.lookX.atRest(pointer.x) || !springs.lookY.atRest(pointer.y)) moving = true;
    // Parallax grows as the camera pulls back, so the close-up stays steady
    const drift = 0.1 + 0.25 * smoothstep(0.15, 0.6, p);
    camera.position.set(s.cam[0] + lx * drift, s.cam[1] - ly * drift * 0.5, s.cam[2]);
    lookAt.set(s.look[0] + lx * drift * 0.25, s.look[1], s.look[2]);
    camera.lookAt(lookAt);
    if (camera.fov !== s.fov) {
      camera.fov = s.fov;
      camera.updateProjectionMatrix();
    }

    // Arrival on load, then a slow idle turn while the visitor hasn't scrolled far.
    const t = started.current === null ? 0 : Math.max(0, now - started.current);
    const fly = reduce ? intro(Infinity) : intro(t);
    const idle = reduce ? 0 : 1 - smoothstep(0.08, 0.3, p);
    const sway = idle * Math.sin(t * 0.55) * 0.12;
    const bob = idle * Math.sin(t * 0.9) * 0.012;

    // The crown has its own weight: a slightly under-damped spring chases the
    // timeline height, so it lags a moving scroll and swings like a hung object.
    const ys = springs.crownY;
    const rs = springs.crownRot;
    const targetY = s.crownY + fly.y + bob;
    const targetRot = s.crownRot + fly.spin + sway;
    if (reduce) {
      ys.snap(targetY);
      rs.snap(targetRot);
    } else {
      ys.step(targetY, dt);
      rs.step(targetRot, dt);
    }
    // It can't pass through the head: on contact it bounces once, losing most of its energy.
    if (ys.value < CROWN_REST_Y) {
      ys.value = CROWN_REST_Y;
      // A real touchdown (not a slow creep) sets off the coronation glint
      if (ys.velocity < -0.05 && now - landedAt.current > 1.5) landedAt.current = now;
      if (ys.velocity < 0) ys.velocity = -ys.velocity * 0.22;
    }
    // Glint: a warm flash on the gold right after contact, fading over ~1s
    const since = now - landedAt.current;
    const glint = since < 1.2 ? Math.sin(Math.min(1, since / 1.2) * Math.PI) * (1 - since / 1.2) : 0;
    glintRef.current.intensity = glint * 14;
    if (glint > 0) moving = true;
    const vy = ys.velocity;
    // Pendulum tilt from vertical speed, plus a little sideways sway from its turning speed
    const tiltX = s.crownTilt + THREE.MathUtils.clamp(-vy * 0.35, -0.14, 0.14);
    const tiltZ = THREE.MathUtils.clamp(rs.velocity * 0.04, -0.06, 0.06);

    const crown = crownRef.current;
    crown.position.set(HEAD.x, ys.value, HEAD.z + fly.z);
    crown.rotation.set(tiltX, rs.value, tiltZ);
    if (!ys.atRest(targetY) || !rs.atRest(targetRot)) moving = true;

    // The figure looks up as the crown comes down, then lowers its chin proudly once crowned.
    const lookUp = smoothstep(0.45, 0.7, p) * (1 - smoothstep(0.7, 0.8, p));
    const pitch = springs.headPitch.step(reduce ? 0 : -0.32 * lookUp, dt);
    if (!springs.headPitch.atRest(-0.32 * lookUp)) moving = true;
    headRef.current.rotation.x = pitch;
    // Slow breathing, only while the hero is on screen
    const breathe = reduce ? 0 : Math.sin(now * 1.25) * 0.5 + 0.5;
    chestRef.current.scale.set(1 + breathe * 0.006, 1, 1 + breathe * 0.014);
    if (!reduce && store.visible && p > 0.5) moving = true;

    focus.set(HEAD.x, ys.value + 0.1, HEAD.z + fly.z);

    keyRef.current.intensity = s.key * (1 + glint * 0.25);
    rimRef.current.intensity = s.rim * (1 + glint * 0.6);

    if (started.current !== null && (!fly.done || idle > 0.001)) moving = true;
    if (moving && store.visible !== false) invalidate();

    // DOM text shares the same progress value
    if (overlay.intro.current) overlay.intro.current.style.opacity = String((1 - smoothstep(0.02, 0.12, p)) * smoothstep(2.0, 3.0, t));
    if (overlay.final.current) {
      const f = smoothstep(0.86, 0.97, p);
      overlay.final.current.style.opacity = String(f);
      overlay.final.current.style.transform = `translate3d(0, ${(1 - f) * 28}px, 0)`;
      overlay.final.current.style.pointerEvents = f > 0.6 ? "auto" : "none";
    }
  });

  const crown = useMemo(() => {
    const c = buildCrown(createMaterials());
    c.scale.setScalar(CROWN_SCALE);
    return c;
  }, []);

  return (
    <>
      <ambientLight intensity={0.1} color="#cfe8dc" />
      <spotLight
        ref={keyRef}
        position={[2.4, 6.2, 4.2]}
        angle={0.55}
        penumbra={1}
        decay={0}
        color="#fff0d2"
        castShadow
        shadow-mapSize={isSmall ? [1024, 1024] : [2048, 2048]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
      />
      <spotLight ref={rimRef} position={[-2.2, 5, -2.2]} angle={0.7} penumbra={1} decay={0} color="#9be6c0" />
      <pointLight position={[-1.8, 3.6, 1.8]} intensity={3} decay={2} color="#f2c161" />

      <primitive object={crown} ref={crownRef} />
      <pointLight ref={glintRef} position={[0.35, 3.05, 0.55]} intensity={0} distance={2.2} decay={2} color="#ffd88a" />
      <Sovereign headRef={headRef} chestRef={chestRef} />
      <Library lite={isSmall} />
      <Dust count={isSmall ? 160 : 360} />
      {!reduce && <Cinematic focus={focus} isSmall={isSmall} />}
    </>
  );
};

export default function CrownScene({ store, overlay, isSmall, reduce }) {
  return (
    <Canvas
      frameloop="demand"
      shadows="soft"
      dpr={isSmall ? [1, 1.5] : [1, 1.75]}
      camera={{ fov: 30, near: 0.03, far: 40, position: [0, 4.3, 0.5] }}
      gl={{ antialias: !!reduce, powerPreference: "high-performance" }}
      onCreated={({ gl, scene }) => {
        // With the film pass on, tone mapping happens there instead
        gl.toneMapping = reduce ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
        gl.toneMappingExposure = 1.1;
        scene.background = new THREE.Color(BG);
        scene.fog = new THREE.FogExp2(BG, 0.07);
      }}
    >
      <StudioEnvironment />
      <Rig store={store} overlay={overlay} isSmall={isSmall} reduce={reduce} />
    </Canvas>
  );
}
