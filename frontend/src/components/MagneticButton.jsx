import { useRef, useCallback } from 'react';

/**
 * MagneticButton — Button that slightly follows cursor when within range.
 * Includes click ripple effect.
 */
export default function MagneticButton({
  children,
  onClick,
  className = '',
  style = {},
  magnetRange = 60,
  magnetStrength = 0.3,
  disabled = false,
  type = 'button',
  ...props
}) {
  const btnRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (disabled) return;
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < magnetRange) {
      const pull = (1 - dist / magnetRange) * magnetStrength;
      btn.style.transform = `translate(${dx * pull}px, ${dy * pull}px) scale(1.03)`;
    }
  }, [magnetRange, magnetStrength, disabled]);

  const handleMouseLeave = useCallback(() => {
    const btn = btnRef.current;
    if (btn) btn.style.transform = 'translate(0, 0) scale(1)';
  }, []);

  const handleClick = useCallback((e) => {
    if (disabled) return;
    const btn = btnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height) * 0.5}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    }
    onClick?.(e);
  }, [onClick, disabled]);

  return (
    <button
      ref={btnRef}
      type={type}
      className={`ripple-container ${className}`}
      style={{
        ...style,
        transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
