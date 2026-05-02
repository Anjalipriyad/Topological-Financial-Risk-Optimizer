import { useEffect, useRef } from 'react';

/**
 * ParticleField — DRAMATIC interactive particle constellation.
 * Much more visible, with glowing particles, thick connection lines,
 * and animated mesh background gradient.
 */
export default function ParticleField({ height = '100%', particleCount = 90 }) {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const particles = useRef([]);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = [
      { r: 212, g: 168, b: 67, a: 0.7 },    // gold bright
      { r: 232, g: 197, b: 71, a: 0.6 },    // gold-light
      { r: 37,  g: 99,  b: 235, a: 0.5 },   // blue
      { r: 96,  g: 165, b: 250, a: 0.55 },   // blue-light
      { r: 212, g: 168, b: 67, a: 0.45 },    // gold medium
    ];

    particles.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * (w || 1200),
      y: Math.random() * (h || 700),
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 3 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.current.x = -9999; mouse.current.y = -9999; };
    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('mouseleave', onLeave);

    const CONNECTION_DIST = 150;
    const MOUSE_DIST = 200;

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      const pts = particles.current;

      // Draw connections first (behind particles)
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.18;
            // Gold-tinted connection lines
            const grad = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
            grad.addColorStop(0, `rgba(212, 168, 67, ${alpha})`);
            grad.addColorStop(1, `rgba(96, 165, 250, ${alpha * 0.7})`);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.pulse += p.pulseSpeed;

        // Mouse interaction
        const dmx = p.x - mouse.current.x;
        const dmy = p.y - mouse.current.y;
        const distMouse = Math.sqrt(dmx * dmx + dmy * dmy);
        if (distMouse < MOUSE_DIST && distMouse > 0) {
          const force = (1 - distMouse / MOUSE_DIST) * 1.2;
          p.vx += (dmx / distMouse) * force;
          p.vy += (dmy / distMouse) * force;
        }

        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const { r: cr, g: cg, b: cb, a: ca } = p.color;
        const pulseFactor = 0.7 + Math.sin(p.pulse) * 0.3;
        const currentAlpha = ca * pulseFactor;
        const currentRadius = p.r * (0.85 + Math.sin(p.pulse) * 0.15);

        // Large glow
        const glowR = currentRadius * 8;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        glow.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${currentAlpha * 0.35})`);
        glow.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, ${currentAlpha * 0.08})`);
        glow.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Mouse proximity glow boost
        if (distMouse < MOUSE_DIST) {
          const boostAlpha = (1 - distMouse / MOUSE_DIST) * 0.5;
          const boostR = currentRadius * 15;
          const boostGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, boostR);
          boostGlow.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${boostAlpha})`);
          boostGlow.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, boostR, 0, Math.PI * 2);
          ctx.fillStyle = boostGlow;
          ctx.fill();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${currentAlpha})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.6})`;
        ctx.fill();
      }

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [particleCount]);

  return (
    <div style={{ position: 'absolute', inset: 0, height, overflow: 'hidden', pointerEvents: 'auto' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
