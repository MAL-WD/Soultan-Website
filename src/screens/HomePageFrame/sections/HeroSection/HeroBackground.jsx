import React, { useRef, useEffect } from 'react';

const HeroBackground = () => {
  const canvasRef = useRef(null);
  const mousePosition = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', () => {
      mousePosition.current = { x: -1000, y: -1000 };
    });

    // Particles
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      color: Math.random() > 0.5 ? 'rgba(255, 255, 255, ' : 'rgba(242, 193, 97, ',
      opacity: Math.random() * 0.2 + 0.1,
    }));

    // Orbs
    const orbs = Array.from({ length: 4 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 70 + 80,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.5 ? 'rgba(2, 17, 12, ' : 'rgba(21, 48, 43, ',
    }));

    let time = 0;

    const draw = () => {
      time += 0.005;

      // Clear canvas each frame (transparent background)
      ctx.clearRect(0, 0, width, height);

      // Aurora gradients
      const cx1 = width * 0.5 + Math.sin(time) * width * 0.3;
      const cy1 = height * 0.5 + Math.cos(time * 0.8) * height * 0.3;
      const gradient1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, height * 0.8);
      gradient1.addColorStop(0, 'rgba(21, 48, 43, 0.4)');
      gradient1.addColorStop(1, 'rgba(2, 17, 12, 0)');

      const cx2 = width * 0.5 + Math.cos(time * 1.2) * width * 0.4;
      const cy2 = height * 0.5 + Math.sin(time * 0.5) * height * 0.4;
      const gradient2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, height * 0.8);
      gradient2.addColorStop(0, 'rgba(10, 46, 31, 0.3)');
      gradient2.addColorStop(1, 'rgba(2, 17, 12, 0)');

      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      // Dot grid
      const gridSpacing = 50;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let x = 0; x < width; x += gridSpacing) {
        for (let y = 0; y < height; y += gridSpacing) {
          const dx = mousePosition.current.x - x;
          const dy = mousePosition.current.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          let dotSize = 1;
          let alpha = 0.05;
          if (dist < 150) {
            const intensity = 1 - dist / 150;
            dotSize += intensity * 1.5;
            alpha += intensity * 0.15;
            ctx.fillStyle = `rgba(242, 193, 97, ${alpha})`;
          } else {
             ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          }
          
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Orbs
      orbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.radius) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = height + orb.radius;
        if (orb.y > height + orb.radius) orb.y = -orb.radius;

        const dx = mousePosition.current.x - orb.x;
        const dy = mousePosition.current.y - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 300) {
          orb.x -= (dx / dist) * 0.5;
          orb.y -= (dy / dist) * 0.5;
        }

        ctx.beginPath();
        const orbGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        orbGrad.addColorStop(0, `${orb.color}0.08)`);
        orbGrad.addColorStop(1, `${orb.color}0)`);
        ctx.fillStyle = orbGrad;
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full object-cover"
    />
  );
};

export default HeroBackground;
