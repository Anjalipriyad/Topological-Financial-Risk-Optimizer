import { useRef, useCallback } from 'react';

/**
 * TiltCard — 3D tilt effect wrapper. Card rotates slightly
 * toward mouse position, with a glare highlight following cursor.
 */
export default function TiltCard({
  children,
  maxTilt = 6,
  glareOpacity = 0.12,
  scale = 1.02,
  className = '',
  style = {},
  borderRadius = 16,
}) {
  const cardRef = useRef(null);

  const handleMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    const rotateX = ((centerY - y) / centerY) * maxTilt;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    card.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
  }, [maxTilt, scale]);

  const handleLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  }, []);

  return (
    <div className="perspective-container" style={{ borderRadius }}>
      <div
        ref={cardRef}
        className={`tilt-card ${className}`}
        style={{
          ...style,
          borderRadius,
          position: 'relative',
          transition: 'transform 0.2s ease-out',
        }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {children}
        {glareOpacity > 0 && (
          <div
            className="tilt-glare"
            style={{
              borderRadius,
              background: `radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,${glareOpacity}) 0%, transparent 60%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
