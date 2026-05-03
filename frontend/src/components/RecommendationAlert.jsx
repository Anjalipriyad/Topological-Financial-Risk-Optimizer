import TiltCard from './TiltCard';

function riskPalette(riskLevel) {
  if (!riskLevel) return { color:'var(--text-muted)', bg:'var(--bg-surface)', label:'Analysis Complete', glow:'transparent' };
  const l = riskLevel.toLowerCase();
  if (l.includes('high')) return { color:'var(--status-danger)', bg:'var(--status-danger-bg)', label:'Critical Condition', glow:'rgba(220,38,38,0.15)' };
  if (l.includes('medium')) return { color:'var(--gold)', bg:'var(--gold-bg)', label:'Pre-Shatter Warning', glow:'var(--gold-glow)' };
  return { color:'var(--status-safe)', bg:'var(--status-safe-bg)', label:'Operational Integrity', glow:'rgba(5,150,105,0.15)' };
}

export default function RecommendationAlert({ riskLevel, recommendation, currentPrice, features = {}, modelConfidence, historicalAccuracy }) {
  const palette = riskPalette(riskLevel);
  const atr = features?.ATR || 0;
  const stopLoss = atr > 0 ? currentPrice - atr * 2 : null;
  const stopLossPct = atr > 0 ? ((atr * 2) / currentPrice * 100).toFixed(2) : '2.50';
  const positionPct = atr > 0 ? Math.min(100, 1 / parseFloat(stopLossPct) * 100).toFixed(1) : null;
  const rsi = features?.RSI;
  const rsiLabel = rsi != null ? (rsi > 70 ? `Overbought — RSI ${rsi.toFixed(0)}` : rsi < 30 ? `Oversold — RSI ${rsi.toFixed(0)}` : `Neutral — RSI ${rsi.toFixed(0)}`) : null;
  const bbPivot = features?.BB_Pivot;
  const bbLabel = bbPivot != null ? (bbPivot > 0.8 ? 'Near Upper Band' : bbPivot < 0.2 ? 'Near Lower Band' : 'Mid-Band') : 'N/A';

  const metrics = [
    { label:'Stop-Loss', value: stopLoss != null ? `$${stopLoss.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}` : 'N/A', sub:`−${stopLossPct}% · 2× ATR` },
    { label:'ATR 14D', value: atr > 0 ? `$${atr.toFixed(2)}` : 'N/A', sub:'Avg True Range' },
    { label:'Position Size', value: positionPct ? `${positionPct}%` : 'N/A', sub:'1% Risk Rule' },
    { label:'BB Position', value: bbPivot != null ? `${(bbPivot*100).toFixed(1)}%` : 'N/A', sub:bbLabel },
    { label:'Model Confidence', value: modelConfidence ? `${modelConfidence}%` : 'N/A', sub:'Ensemble Consensus' },
    { label:'Backtest Acc.', value: historicalAccuracy ? `${historicalAccuracy}%` : 'N/A', sub:'Historical Performance' },
  ];

  return (
    <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:20 }}>
      {/* Price + Badge */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', paddingBottom:20, borderBottom:'1px solid var(--border-subtle)', flexWrap:'wrap', gap:12 }}>
        <div>
          <p className="label-xs" style={{ marginBottom:6 }}>Live Valuation</p>
          <p style={{ fontSize:40, fontWeight:900, color:'var(--text-primary)', lineHeight:1, fontFamily:'var(--font-mono)' }}>
            ${currentPrice.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
          </p>
          {rsiLabel && <p style={{ fontSize:12, color:'var(--text-secondary)', marginTop:8 }}>{rsiLabel}</p>}
        </div>
        <div style={{ padding:'8px 18px', borderRadius:12, background:palette.bg, border:`1px solid ${palette.color}33`, fontSize:11, fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase', color:palette.color, flexShrink:0 }}>
          {riskLevel}
        </div>
      </div>

      {/* Verdict */}
      <div style={{ background:'var(--bg-surface)', borderRadius:16, padding:'20px 24px 20px 28px', position:'relative', overflow:'hidden', border:'1px solid var(--border-subtle)' }}>
        <div style={{ position:'absolute', top:0, left:0, bottom:0, width:4, borderRadius:'4px 0 0 4px', background:palette.color, boxShadow:`0 0 12px ${palette.glow}` }} />
        <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:palette.color, marginBottom:6 }}>{palette.label}</p>
        <h3 style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)', marginBottom:10, letterSpacing:'-0.01em' }}>System Recommendation</h3>
        <p style={{ fontSize:14, lineHeight:1.75, color:'var(--text-secondary)' }}>{recommendation}</p>
      </div>

      {/* Metric tiles */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:8 }}>
        {metrics.map(tile => (
          <TiltCard key={tile.label} maxTilt={4} glareOpacity={0.08} scale={1.01} borderRadius={14}>
            <div style={{ background:'white', borderRadius:14, padding:'16px 18px', border:'1px solid var(--border-subtle)' }}>
              <p className="label-xs" style={{ marginBottom:6 }}>{tile.label}</p>
              <p style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', fontFamily:'var(--font-mono)' }}>{tile.value}</p>
              <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>{tile.sub}</p>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}
