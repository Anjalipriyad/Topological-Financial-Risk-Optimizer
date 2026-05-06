import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import TiltCard from './TiltCard';

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{ background:'var(--bg-glass-strong)', backdropFilter:'blur(16px)', border:'1px solid var(--border-default)', borderRadius:12, padding:'12px 16px', boxShadow:'var(--shadow-lg)' }}>
      <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:4 }}>{label}</p>
      <p style={{ fontSize:20, fontWeight:800, color:'var(--text-primary)', fontFamily:'var(--font-mono)' }}>
        {payload[0].value?.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} ({currency})
      </p>
      {d?.high && d?.low && (
        <div style={{ display:'flex', gap:14, marginTop:8, fontSize:11, color:'var(--text-secondary)', fontWeight:500 }}>
          <span>H <strong style={{color:'var(--text-primary)', fontFamily:'var(--font-mono)'}}>{d.high.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} ({currency})</strong></span>
          <span>L <strong style={{color:'var(--text-primary)', fontFamily:'var(--font-mono)'}}>{d.low.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} ({currency})</strong></span>
        </div>
      )}
    </div>
  );
};

export default function PriceChart({ data = [], ticker = '', isRealData = false, currency = 'USD' }) {
  if (!data.length) return null;
  const prices = data.map(d => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const current = prices[prices.length - 1];
  const first = prices[0];
  const pctChange = (current - first) / first * 100;
  const isPos = pctChange >= 0;
  const trendColor = isPos ? 'var(--status-safe)' : 'var(--status-danger)';
  const gradId = 'priceGrad' + ticker;

  return (
    <TiltCard maxTilt={3} glareOpacity={0.06} scale={1.005} borderRadius={20} className="card-premium" style={{ background:'white' }}>
      <div className="animate-fade-in-up">
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'20px 24px 16px' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <span style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.01em' }}>{ticker}</span>
              <span style={{ fontSize:14, color:'var(--text-muted)', fontWeight:400 }}>/</span>
              <span style={{ fontSize:13, color:'var(--text-secondary)', fontWeight:600 }}>{currency}</span>
              {isRealData && (
                <span style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:12, background:'var(--status-safe-bg)', fontSize:9, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--status-safe)' }}>
                  <span className="animate-breathe" style={{ width:5, height:5, borderRadius:'50%', background:'var(--status-safe)', display:'inline-block' }} />Live
                </span>
              )}
            </div>
            <p className="label-xs">60-Day Window</p>
          </div>
          <div style={{ textAlign:'right' }}>
            <p style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', fontFamily:'var(--font-mono)' }}>
              {current.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} ({currency})
            </p>
            <p style={{ fontSize:12, fontWeight:700, color:trendColor, marginTop:3, fontFamily:'var(--font-mono)' }}>
              {isPos?'+':''}{pctChange.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Chart */}
        <div style={{ padding:'8px 8px 0' }}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top:6, right:8, left:0, bottom:0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPos ? '#059669' : '#DC2626'} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={isPos ? '#059669' : '#DC2626'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize:9, fill:'var(--text-muted)', fontWeight:600 }} axisLine={{ stroke:'var(--border-default)' }} tickLine={false} interval="preserveStartEnd" dy={10} />
              <YAxis domain={[minPrice*0.99, maxPrice*1.01]} tick={{ fontSize:9, fill:'var(--text-muted)', fontWeight:600, fontFamily:'var(--font-mono)' }} axisLine={false} tickLine={false} width={65}
                tickFormatter={v=>`${v.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0})} ${currency}`} />
              <Tooltip content={<CustomTooltip currency={currency} />} cursor={{ stroke:'var(--gold)', strokeWidth:1, strokeDasharray:'4 4' }} />
              <Area type="monotone" dataKey="close" stroke={isPos ? '#059669' : '#DC2626'} strokeWidth={2} fill={`url(#${gradId})`} dot={false}
                activeDot={{ r:4, fill:'var(--text-primary)', stroke:'white', strokeWidth:2, style:{filter:'drop-shadow(0 0 4px rgba(0,0,0,0.2))'} }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Range footer */}
        <div style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 24px 18px', borderTop:'1px solid var(--border-subtle)', margin:'8px 0 0' }}>
          <div>
            <p className="label-xs">60D Low</p>
            <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginTop:3, fontFamily:'var(--font-mono)' }}>
              {minPrice.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} ({currency})
            </p>
          </div>
          <div style={{ flex:1, position:'relative', height:4, background:'var(--border-subtle)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, right:`${(1-(current-minPrice)/(maxPrice-minPrice))*100}%`, background:'linear-gradient(90deg, var(--gold), var(--blue-light))', borderRadius:2 }} />
            <div style={{ position:'absolute', left:`${((current-minPrice)/(maxPrice-minPrice))*100}%`, top:-2, transform:'translateX(-50%)', width:8, height:8, borderRadius:'50%', background:'var(--gold)', border:'2px solid white', boxShadow:'0 1px 4px rgba(0,0,0,0.15)' }} />
          </div>
          <div style={{ textAlign:'right' }}>
            <p className="label-xs">60D High</p>
            <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginTop:3, fontFamily:'var(--font-mono)' }}>
              {maxPrice.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} ({currency})
            </p>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
