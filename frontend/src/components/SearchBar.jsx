import { useState } from 'react';
import MagneticButton from './MagneticButton';

const QUICK_TICKERS = ['NVDA', 'TSLA', 'BTC', 'RELIANCE.NS'];

export default function SearchBar({ onSearch, isLoading }) {
  const [ticker, setTicker] = useState('');
  const [focused, setFocused] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticker.trim()) { setShaking(true); setTimeout(() => setShaking(false), 500); return; }
    onSearch(ticker.trim().toUpperCase());
  };

  return (
    <div style={{ width:'100%', maxWidth:580 }} className="animate-fade-in-up">
      <p className="label-xs" style={{ textAlign:'center', marginBottom:14, letterSpacing:'0.12em', color:'var(--text-muted)' }}>
        Topological Risk Analysis Engine
      </p>
      <form onSubmit={handleSubmit}>
        <div className={shaking ? 'animate-shake' : ''} style={{
          display:'flex', borderRadius:14, overflow:'hidden',
          background:'var(--bg-glass-strong)', backdropFilter:'blur(12px)',
          border:`1.5px solid ${focused ? 'var(--gold)' : 'var(--border-default)'}`,
          boxShadow: focused ? '0 4px 24px rgba(212,168,67,0.12), var(--shadow-md)' : 'var(--shadow-md)',
          transition:'border-color 0.3s, box-shadow 0.3s',
        }}>
          <div style={{ display:'flex', alignItems:'center', paddingLeft:16, color:'var(--text-muted)' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>
          </div>
          <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="Symbol — BTC, NVDA, RELIANCE.NS…" disabled={isLoading} autoComplete="off" spellCheck={false}
            style={{ flex:1, background:'transparent', border:'none', outline:'none', padding:'14px 12px', fontSize:14, fontWeight:500, color:'var(--text-primary)', letterSpacing:'0.01em' }} />
          <MagneticButton type="submit" disabled={isLoading||!ticker.trim()} magnetRange={35} magnetStrength={0.12} className="btn-primary"
            style={{ borderRadius:0, padding:'0 24px', fontSize:11, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', opacity:(isLoading||!ticker.trim())?0.5:1, cursor:(isLoading||!ticker.trim())?'not-allowed':'pointer' }}>
            {isLoading ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{animation:'spin-cw 0.8s linear infinite'}}><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
            ) : (<>Ingest <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></>)}
          </MagneticButton>
        </div>
      </form>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:14, flexWrap:'wrap' }}>
        <span className="label-xs">Quick</span>
        <div style={{ width:1, height:12, background:'var(--border-default)' }} />
        {QUICK_TICKERS.map(t=>(
          <button key={t} onClick={()=>{setTicker(t);onSearch(t);}} disabled={isLoading}
            style={{ padding:'4px 12px', borderRadius:8, background:'var(--bg-glass)', border:'1px solid var(--border-subtle)', fontSize:11, fontWeight:600, color:'var(--text-secondary)', fontFamily:'var(--font-mono)', cursor:isLoading?'not-allowed':'pointer', transition:'all 0.2s', opacity:isLoading?0.4:1 }}
            onMouseEnter={e=>{if(!isLoading){e.currentTarget.style.background='var(--gold-bg)';e.currentTarget.style.borderColor='var(--gold-border)';e.currentTarget.style.color='var(--gold)';}}}
            onMouseLeave={e=>{e.currentTarget.style.background='var(--bg-glass)';e.currentTarget.style.borderColor='var(--border-subtle)';e.currentTarget.style.color='var(--text-secondary)';}}>{t}</button>
        ))}
      </div>
    </div>
  );
}
