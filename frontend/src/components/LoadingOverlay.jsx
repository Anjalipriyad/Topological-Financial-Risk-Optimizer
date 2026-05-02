import { useEffect, useState } from 'react';

const STEPS = [
  { label: 'Fetching market data', icon: '📡', duration: 1200 },
  { label: 'Building sliding window', icon: '⧉', duration: 2400 },
  { label: 'Computing persistence diagrams', icon: '◎', duration: 3900 },
  { label: 'Extracting manifold velocity', icon: '∂', duration: 5800 },
  { label: 'Running ensemble vote', icon: '⊗', duration: 8200 },
];

export default function LoadingOverlay() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((step, i) =>
      setTimeout(() => setActiveStep(i + 1), step.duration)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="animate-fade-in-up" style={{ width:'100%', maxWidth:520, margin:'0 auto', padding:'48px 0', display:'flex', flexDirection:'column', alignItems:'center' }}>
      {/* Animated spinner */}
      <div style={{ position:'relative', width:64, height:64, marginBottom:32 }}>
        <div style={{ position:'absolute', inset:0, borderRadius:16, border:'1px solid var(--border-default)', background:'var(--bg-glass)', backdropFilter:'blur(8px)' }} />
        <div className="animate-spin-slow" style={{ position:'absolute', inset:8, borderRadius:12, border:'2px solid transparent', borderTopColor:'var(--gold)', borderRightColor:'var(--blue-light)' }} />
        <div className="animate-breathe" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:8, height:8, borderRadius:'50%', background:'linear-gradient(135deg, var(--gold), var(--blue-light))', boxShadow:'0 0 12px var(--gold-glow)' }} />
      </div>

      <h3 style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.01em', marginBottom:6 }}>
        Analyzing Topology
      </h3>
      <p style={{ fontSize:11, fontWeight:600, color:'var(--text-muted)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:28 }}>
        TDA Pipeline
      </p>

      {/* Progress bar */}
      <div style={{ width:'100%', height:3, borderRadius:2, background:'var(--border-subtle)', marginBottom:28, overflow:'hidden' }}>
        <div className="animate-progress-bar" style={{ height:'100%', borderRadius:2, background:'linear-gradient(90deg, var(--gold), var(--blue-light))', boxShadow:'0 0 8px var(--gold-glow)' }} />
      </div>

      {/* Steps */}
      <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:6 }}>
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <div key={step.label} style={{ display:'flex', alignItems:'center', gap:14, padding:'8px 12px', borderRadius:10, background: active ? 'var(--gold-bg)' : 'transparent', border: active ? '1px solid var(--gold-border)' : '1px solid transparent', opacity: done ? 0.45 : active ? 1 : 0.25, transition:'all 0.4s var(--ease-smooth)' }}>
              <div style={{ width:28, height:28, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, background: done ? 'var(--status-safe-bg)' : active ? 'var(--gold-bg)' : 'var(--bg-surface)', border:`1px solid ${done ? 'rgba(5,150,105,0.2)' : active ? 'var(--gold-border)' : 'var(--border-subtle)'}`, flexShrink:0 }}>
                {done ? (
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--status-safe)" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                ) : active ? (
                  <div className="animate-breathe" style={{ width:6, height:6, borderRadius:'50%', background:'var(--gold)', boxShadow:'0 0 6px var(--gold-glow)' }} />
                ) : (
                  <span style={{ fontSize:11, color:'var(--text-muted)' }}>{step.icon}</span>
                )}
              </div>
              <span style={{ fontSize:13, fontWeight: active ? 700 : 400, color: done ? 'var(--text-muted)' : active ? 'var(--text-primary)' : 'var(--text-muted)', textDecoration: done ? 'line-through' : 'none', letterSpacing:'0.01em' }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
