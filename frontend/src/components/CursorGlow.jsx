import { useEffect, useRef, useState } from 'react';

/**
 * CursorGlow — Custom cursor with golden glow trail
 * The signature "WOW" element. Renders a glowing orb that follows the mouse
 * with spring physics, leaving a fading particle trail.
 */
export default function CursorGlow() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const trail = useRef([]);
  const hovering = useRef(false);
  const raf = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    document.body.classList.add('custom-cursor');
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onOver = (e) => {
      const t = e.target;
      hovering.current =
        t.tagName === 'BUTTON' || t.tagName === 'A' ||
        t.closest('button') || t.closest('a') ||
        t.closest('[role="button"]') ||
        t.tagName === 'INPUT' || t.tagName === 'SELECT';
    };
    const onOut = () => { hovering.current = false; };

    window.addEventListener('mousemove', onMouse);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);

    const TRAIL_LENGTH = 12;
    const LERP = 0.15;

    const loop = () => {
      ctx.clearRect(0, 0, w, h);

      // Lerp position (spring physics)
      pos.current.x += (mouse.current.x - pos.current.x) * LERP;
      pos.current.y += (mouse.current.y - pos.current.y) * LERP;

      // Update trail
      trail.current.unshift({ x: pos.current.x, y: pos.current.y, life: 1 });
      if (trail.current.length > TRAIL_LENGTH) trail.current.pop();

      // Draw trail particles
      for (let i = trail.current.length - 1; i >= 0; i--) {
        const p = trail.current[i];
        p.life -= 0.06;
        if (p.life <= 0) { trail.current.splice(i, 1); continue; }
        const r = p.life * (hovering.current ? 4 : 3);
        const alpha = p.life * 0.35;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = hovering.current
          ? `rgba(37, 99, 235, ${alpha})`
          : `rgba(212, 168, 67, ${alpha})`;
        ctx.fill();
      }

      // Draw main cursor orb
      const size = hovering.current ? 20 : 10;
      const glowSize = hovering.current ? 35 : 18;

      // Outer glow
      const grad = ctx.createRadialGradient(
        pos.current.x, pos.current.y, 0,
        pos.current.x, pos.current.y, glowSize
      );
      if (hovering.current) {
        grad.addColorStop(0, 'rgba(37, 99, 235, 0.20)');
        grad.addColorStop(1, 'rgba(37, 99, 235, 0)');
      } else {
        grad.addColorStop(0, 'rgba(212, 168, 67, 0.18)');
        grad.addColorStop(1, 'rgba(212, 168, 67, 0)');
      }
      ctx.beginPath();
      ctx.arc(pos.current.x, pos.current.y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Inner orb
      ctx.beginPath();
      ctx.arc(pos.current.x, pos.current.y, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = hovering.current
        ? 'rgba(37, 99, 235, 0.7)'
        : 'rgba(212, 168, 67, 0.65)';
      ctx.fill();

      // Bright center dot
      ctx.beginPath();
      ctx.arc(pos.current.x, pos.current.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = hovering.current
        ? 'rgba(96, 165, 250, 0.9)'
        : 'rgba(232, 197, 71, 0.9)';
      ctx.fill();

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      window.removeEventListener('resize', resize);
      document.body.classList.remove('custom-cursor');
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
