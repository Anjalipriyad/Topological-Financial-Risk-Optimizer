import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

function buildRadarData(features, currentPrice, currency) {
  const { RSI=50, MACD=0, BB_Width=0.05, BB_Pivot=0.5, ATR=0 } = features;
  const sigmoid = (x, k=1) => 100/(1+Math.exp(-k*x));
  return [
    { metric:'RSI', value:Math.max(0,Math.min(100,RSI)), raw:RSI.toFixed(1), hint:RSI>70?'Overbought':RSI<30?'Oversold':'Neutral' },
    { metric:'MACD', value:Math.round(sigmoid(MACD,80)), raw:MACD.toFixed(4), hint:MACD>0?'Bullish momentum':'Bearish momentum' },
    { metric:'Volatility', value:Math.round(Math.min(100,BB_Width*600)), raw:BB_Width.toFixed(4), hint:BB_Width>0.08?'High volatility':'Low volatility' },
    { metric:'BB Pos', value:Math.round(Math.max(0,Math.min(100,BB_Pivot*100))), raw:(BB_Pivot*100).toFixed(1)+'%', hint:BB_Pivot>0.8?'Near upper band':BB_Pivot<0.2?'Near lower band':'Mid-band' },
    { metric:'ATR', value:currentPrice>0?Math.round(Math.min(100,(ATR/currentPrice)*3000)):50, raw:`${ATR.toFixed(2)} (${currency})`, hint:'Avg True Range' },
  ];
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div style={{ background:'var(--bg-glass-strong)', backdropFilter:'blur(16px)', border:'1px solid var(--border-default)', borderRadius:12, padding:'12px 16px', boxShadow:'var(--shadow-lg)' }}>
      <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:4 }}>{d.metric}</p>
      <p style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', fontFamily:'var(--font-mono)' }}>{d.raw}</p>
      <p style={{ fontSize:11, color:'var(--text-secondary)', marginTop:4 }}>{d.hint}</p>
    </div>
  );
};

export default function FeatureRadar({ features, currentPrice, currency = 'USD' }) {
  if (!features || Object.keys(features).length === 0) {
    return (
      <div style={{ background:'var(--bg-surface)', borderRadius:16, border:'1px solid var(--border-default)', display:'flex', alignItems:'center', justifyContent:'center', height:240 }}>
        <p style={{ fontSize:13, color:'var(--text-muted)' }}>Feature data unavailable</p>
      </div>
    );
  }
  const data = buildRadarData(features, currentPrice, currency);

  return (
    <div style={{ background:'var(--bg-surface)', borderRadius:16, border:'1px solid var(--border-default)', padding:'20px 20px 16px' }}>
      <div style={{ marginBottom:12 }}>
        <h3 style={{ fontSize:13, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.01em' }}>Feature Decomposition</h3>
        <p className="label-xs" style={{ marginTop:4 }}>TA Signal Strengths · Normalised 0–100</p>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <RadarChart data={data} margin={{ top:8, right:20, bottom:8, left:20 }}>
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="var(--border-default)" strokeWidth={0.5} />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize:10, fill:'var(--text-secondary)', fontWeight:600 }} tickLine={false} />
          <Radar name="Signal" dataKey="value" stroke="var(--gold)" strokeWidth={2} fill="url(#radarFill)" fillOpacity={1}
            dot={{ r:3, fill:'var(--gold)', strokeWidth:0 }} activeDot={{ r:5, fill:'var(--gold)', stroke:'white', strokeWidth:2 }} />
          <Tooltip content={<CustomTooltip/>} />
        </RadarChart>
      </ResponsiveContainer>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:8, borderTop:'1px solid var(--border-subtle)', paddingTop:12, marginTop:4 }}>
        {data.map(d => (
          <div key={d.metric} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--text-muted)' }}>{d.metric}</span>
            <span style={{ fontSize:12, fontWeight:800, color:'var(--text-primary)', fontFamily:'var(--font-mono)' }}>{d.raw}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
