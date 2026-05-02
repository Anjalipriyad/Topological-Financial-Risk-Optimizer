import { useEffect, useState } from 'react';

function riskPalette(score) {
  if (score < 40) return { color: 'var(--status-safe)', bg: 'var(--status-safe-bg)', label: 'SAFE', glow: 'rgba(5,150,105,0.3)' };
  if (score < 70) return { color: 'var(--gold)', bg: 'var(--gold-bg)', label: 'VOLATILE', glow: 'var(--gold-glow)' };
  return { color: 'var(--status-danger)', bg: 'var(--status-danger-bg)', label: 'CRITICAL', glow: 'rgba(220,38,38,0.3)' };
}

export default function RiskGauge({ score, riskLevel }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const r = 42;
  const circumference = r * 2 * Math.PI;
  const dashOffset = circumference - (animatedScore / 100) * circumference;
  const palette = riskPalette(score);

  useEffect(() => {
    let frame;
    let start = null;
    const duration = 1200;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const ticks = [0, 40, 70, 100].map((pct) => {
    const angle = (pct / 100) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    return { x1: 50+47*Math.cos(rad), y1: 50+47*Math.sin(rad), x2: 50+51*Math.cos(rad), y2: 50+51*Math.sin(rad) };
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
      <div style={{ position:'relative', width:220, height:220 }}>
        {/* Glow behind gauge */}
        <div className="animate-breathe" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:140, height:140, borderRadius:'50%', background:`radial-gradient(circle, ${palette.glow} 0%, transparent 70%)`, opacity:0.5 }} />
        <svg style={{ width:'100%', height:'100%', transform:'rotate(-90deg)' }} viewBox="0 0 100 100">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--status-safe)" />
              <stop offset="50%" stopColor="var(--gold)" />
              <stop offset="100%" stopColor="var(--status-danger)" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="49" stroke="var(--border-subtle)" strokeWidth="0.5" fill="none" />
          <circle cx="50" cy="50" r={r} stroke="var(--border-subtle)" strokeWidth="6" fill="none" />
          <circle cx="50" cy="50" r={r} stroke="url(#gaugeGrad)" strokeWidth="6" fill="none"
            strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round"
            style={{ transition:'stroke-dashoffset 0.1s ease-out', filter:`drop-shadow(0 0 4px ${palette.glow})` }} />
          {ticks.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--text-muted)" strokeWidth="0.8" strokeOpacity="0.4" />
          ))}
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:4 }}>Risk Score</p>
          <p style={{ fontSize:52, fontWeight:900, color:'var(--text-primary)', lineHeight:1, fontFamily:'var(--font-mono)' }}>{animatedScore}</p>
          <div style={{ marginTop:10, padding:'4px 14px', borderRadius:20, background:palette.bg, border:`1px solid ${palette.color}33`, fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:palette.color }}>
            {palette.label}
          </div>
        </div>
      </div>
      <p style={{ fontSize:10, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-muted)', opacity:0.7 }}>
        Manifold Shattering Coefficient
      </p>
    </div>
  );
}
