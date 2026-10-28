// A damped spring in Apple's designer terms: dampingRatio (1 = no overshoot,
// < 1 = bounce) and response (seconds to reach the target, roughly).
// It always moves from its current value and keeps its velocity when the
// target changes, so scrolling back mid-motion never jumps.
export const createSpring = (value, { dampingRatio = 1, response = 0.4 } = {}) => {
  const stiffness = Math.pow((2 * Math.PI) / response, 2);
  const damping = (4 * Math.PI * dampingRatio) / response;
  const s = {
    value,
    velocity: 0,
    step(target, dt) {
      // Sub-step so a long frame (tab switch, slow phone) can't destabilise it
      const n = Math.max(1, Math.ceil(dt / (1 / 120)));
      const h = Math.min(dt, 0.1) / n;
      for (let i = 0; i < n; i++) {
        const accel = -stiffness * (s.value - target) - damping * s.velocity;
        s.velocity += accel * h;
        s.value += s.velocity * h;
      }
      return s.value;
    },
    atRest(target, eps = 0.0003) {
      return Math.abs(s.value - target) < eps && Math.abs(s.velocity) < eps * 10;
    },
    snap(v) {
      s.value = v;
      s.velocity = 0;
    },
  };
  return s;
};
