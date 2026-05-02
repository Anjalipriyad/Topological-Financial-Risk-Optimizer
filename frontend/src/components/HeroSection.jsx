import { useState, useEffect, useRef } from 'react';
import ParticleField from './ParticleField';
import MagneticButton from './MagneticButton';

const QUICK = ['NVDA', 'TSLA', 'BTC', 'RELIANCE.NS'];

export default function HeroSection({ onSearch, isLoading, onNavigateResearch }) {
  const [ticker, setTicker] = useState('');
  const [vis, setVis] = useState(false);
  const [mp, setMp] = useState({ x: 0, y: 0 });
  const cRef = useRef(null);

  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);

  const onMM = (e) => {
    const r = cRef.current?.getBoundingClientRect();
    if (!r) return;
    setMp({ x: (e.clientX - r.left - r.width/2) / r.width, y: (e.clientY - r.top - r.height/2) / r.height });
  };

  const onSubmit = (e) => { e.preventDefault(); if (ticker.trim()) onSearch(ticker.trim().toUpperCase()); };

  return (
    <div ref={cRef} onMouseMove={onMM} style={{
      position: 'relative',
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px 60px',
      overflow: 'hidden',
      /* Dramatic gradient background */
      background: 'linear-gradient(180deg, #F0EBE0 0%, #FAFAF8 30%, #F5F0E8 60%, #E8E3D8 100%)',
    }}>
      {/* Multiple background layers for depth */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 50% at 20% 30%, rgba(212, 168, 67, 0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 70%, rgba(37, 99, 235, 0.08) 0%, transparent 60%), radial-gradient(ellipse 100% 40% at 50% 100%, rgba(212, 168, 67, 0.06) 0%, transparent 50%)',
      }} />

      {/* Animated orb blobs */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212, 168, 67, 0.15) 0%, transparent 70%)',
        top: '10%', left: '-5%', filter: 'blur(60px)',
        animation: 'float-slow 12s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
        bottom: '5%', right: '-5%', filter: 'blur(50px)',
        animation: 'float-slow 15s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232, 197, 71, 0.1) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)', filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Particle constellation */}
      <ParticleField height="100%" particleCount={80} />

      {/* Floating math symbols — LARGER, more dramatic */}
      {['∂', 'Σ', '∫', 'Δ', '∞', 'π', '∇', 'λ'].map((s, i) => (
        <span key={i} className="animate-float-slow" style={{
          position: 'absolute',
          fontSize: 32 + i * 12,
          fontWeight: 200,
          color: i % 2 === 0 ? 'rgba(212, 168, 67, 0.12)' : 'rgba(37, 99, 235, 0.08)',
          top: `${8 + (i * 11) % 80}%`,
          left: `${5 + (i * 13) % 85}%`,
          transform: `translate(${mp.x * (8 + i * 4)}px, ${mp.y * (8 + i * 4)}px)`,
          transition: 'transform 0.5s ease-out',
          pointerEvents: 'none', userSelect: 'none',
          animationDelay: `${i * 0.6}s`,
          fontFamily: 'Georgia, serif',
          zIndex: 1,
        }}>{s}</span>
      ))}

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        maxWidth: 760,
        transform: `translate(${mp.x * 5}px, ${mp.y * 5}px)`,
        transition: 'transform 0.5s ease-out',
      }}>
        {/* Eyebrow badge */}
        <div className={vis ? 'animate-fade-in-up' : ''} style={{ opacity: vis ? 1 : 0, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{
            padding: '6px 18px', borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(212, 168, 67, 0.15) 0%, rgba(232, 197, 71, 0.1) 100%)',
            border: '1px solid rgba(212, 168, 67, 0.3)',
            boxShadow: '0 2px 12px rgba(212, 168, 67, 0.15)',
            fontSize: 11, fontWeight: 700, color: '#B8941F',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            ◈ TDA-Powered Engine
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Non-Euclidean Risk Detection</span>
        </div>

        {/* Headline — MASSIVE, dramatic */}
        <h2 style={{ marginBottom: 20 }}>
          {['Predict', 'Market'].map((w, i) => (
            <span key={w} className={vis ? 'animate-slide-up' : ''} style={{
              display: 'inline-block', fontSize: 'clamp(42px, 7vw, 76px)', fontWeight: 900,
              color: 'var(--text-primary)', lineHeight: 1.05, letterSpacing: '-0.04em',
              marginRight: 18, opacity: vis ? 1 : 0, animationDelay: `${200 + i * 150}ms`,
            }}>{w}</span>
          ))}
          <span className={vis ? 'animate-slide-up' : ''} style={{
            display: 'inline-block', fontSize: 'clamp(42px, 7vw, 76px)', fontWeight: 900,
            lineHeight: 1.05, letterSpacing: '-0.04em', marginRight: 18,
            opacity: vis ? 1 : 0, animationDelay: '500ms',
            /* Gold gradient text */
            background: 'linear-gradient(135deg, #C5A028 0%, #E8C547 50%, #D4A843 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 4px rgba(212, 168, 67, 0.3))',
          }}>Crashes</span>
          <br />
          {['Before', 'They', 'Happen.'].map((w, i) => (
            <span key={w} className={vis ? 'animate-slide-up' : ''} style={{
              display: 'inline-block', fontSize: 'clamp(42px, 7vw, 76px)', fontWeight: 900,
              color: 'var(--text-primary)', lineHeight: 1.05, letterSpacing: '-0.04em',
              marginRight: 18, opacity: vis ? 1 : 0, animationDelay: `${650 + i * 150}ms`,
            }}>{w}</span>
          ))}
        </h2>

        {/* Subtitle */}
        <p className={vis ? 'animate-fade-in-up' : ''} style={{
          fontSize: 17, fontWeight: 400, color: 'var(--text-secondary)', maxWidth: 540,
          lineHeight: 1.7, marginBottom: 44, opacity: vis ? 1 : 0, animationDelay: '1000ms',
        }}>
          Detect manifold shattering — the geometric precursor to structural market crashes — before they register as price movements.
        </p>

        {/* Search bar — PREMIUM glass effect */}
        <form onSubmit={onSubmit} className={vis ? 'animate-slide-up' : ''} style={{ width: '100%', maxWidth: 560, opacity: vis ? 1 : 0, animationDelay: '1200ms' }}>
          <div style={{
            display: 'flex', borderRadius: 20,
            background: 'rgba(255, 255, 255, 0.80)',
            backdropFilter: 'blur(20px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
            border: '1.5px solid rgba(212, 168, 67, 0.20)',
            boxShadow: '0 8px 40px rgba(26, 26, 46, 0.08), 0 2px 8px rgba(212, 168, 67, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
            overflow: 'hidden', transition: 'all 0.4s',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212, 168, 67, 0.5)';
            e.currentTarget.style.boxShadow = '0 12px 50px rgba(212, 168, 67, 0.15), 0 4px 16px rgba(26, 26, 46, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              e.currentTarget.style.borderColor = 'rgba(212, 168, 67, 0.20)';
              e.currentTarget.style.boxShadow = '0 8px 40px rgba(26, 26, 46, 0.08), 0 2px 8px rgba(212, 168, 67, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 20, color: 'var(--text-muted)' }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
            </div>
            <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} placeholder="Enter ticker — NVDA, BTC, RELIANCE.NS…" disabled={isLoading} autoComplete="off" spellCheck={false}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '18px 14px', fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '0.01em' }} />
            <MagneticButton type="submit" disabled={isLoading || !ticker.trim()} magnetRange={50} magnetStrength={0.2} className="btn-primary"
              style={{ borderRadius: '0 18px 18px 0', padding: '0 32px', minHeight: 60, fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: (isLoading || !ticker.trim()) ? 0.5 : 1, cursor: (isLoading || !ticker.trim()) ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg, #C5A028 0%, #D4A843 50%, #E8C547 100%)' }}>
              {isLoading ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: 'spin-cw 0.8s linear infinite' }}><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
              ) : (<>Analyze <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></>)}
            </MagneticButton>
          </div>
        </form>

        {/* Quick tickers — glass pills */}
        <div className={vis ? 'animate-fade-in-up' : ''} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24, opacity: vis ? 1 : 0, animationDelay: '1400ms', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Quick</span>
          <div style={{ width: 1, height: 16, background: 'var(--border-default)' }} />
          {QUICK.map(t => (
            <button key={t} onClick={() => { setTicker(t); onSearch(t); }} disabled={isLoading}
              style={{
                padding: '7px 18px', borderRadius: 12,
                background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(212, 168, 67, 0.15)',
                boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
                fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s var(--ease-spring)', opacity: isLoading ? 0.4 : 1,
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = 'rgba(212,168,67,0.12)'; e.currentTarget.style.borderColor = 'rgba(212,168,67,0.4)'; e.currentTarget.style.color = '#B8941F'; e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(212,168,67,0.15)'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(212,168,67,0.15)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,26,46,0.04)'; }}>{t}</button>
          ))}
        </div>

        {/* CTA link */}
        <button onClick={onNavigateResearch} className={vis ? 'animate-fade-in-up' : ''} style={{ marginTop: 28, fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', opacity: vis ? 1 : 0, animationDelay: '1600ms', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 8 }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
          Explore the research methodology
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </button>


      </div>
    </div>
  );
}
