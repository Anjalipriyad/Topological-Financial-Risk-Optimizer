import { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal — IntersectionObserver-based reveal animation wrapper.
 * Adds animation class when element enters viewport.
 */
export default function ScrollReveal({
  children,
  variant = 'fade-up',   // 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'blur'
  delay = 0,
  threshold = 0.15,
  once = true,
  className = '',
  style = {},
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const variantClass = {
    'fade-up': '',
    'fade-left': 'reveal-left',
    'fade-right': 'reveal-right',
    'scale': 'reveal-scale',
    'blur': 'reveal-blur',
  }[variant] || '';

  return (
    <div
      ref={ref}
      className={`reveal ${variantClass} ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{
        ...style,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
