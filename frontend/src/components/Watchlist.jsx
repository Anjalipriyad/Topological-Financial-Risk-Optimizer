function riskColor(riskLevel) {
  if (!riskLevel) return 'var(--text-muted)';
  const l = riskLevel.toLowerCase();
  if (l.includes('high')) return 'var(--status-danger)';
  if (l.includes('medium')) return 'var(--gold)';
  return 'var(--status-safe)';
}

export function WatchlistPanel({ watchlist, onSelect, onRemove }) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <span className="label-xs">Watchlist</span>
        <span style={{ fontSize:10, fontWeight:600, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{watchlist.length}/10</span>
      </div>
      <div style={{ height:1, background:'var(--border-subtle)', marginBottom:10 }} />
      {watchlist.length === 0 ? (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'24px 0', gap:10, textAlign:'center' }}>
          <div className="animate-float" style={{ width:40, height:40, borderRadius:12, background:'var(--bg-surface)', border:'1px solid var(--border-subtle)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth={1.5} style={{ opacity:0.5 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <p style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.5 }}>Search a ticker and<br/>pin it here.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {watchlist.map(item => (
            <WatchlistItem key={item.ticker} item={item} onSelect={onSelect} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  );
}

function WatchlistItem({ item, onSelect, onRemove }) {
  const color = riskColor(item.riskLevel);
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 10px', borderRadius:10, border:'1px solid var(--border-subtle)', background:'white', cursor:'pointer', transition:'all 0.25s var(--ease-smooth)' }}
      onClick={() => onSelect(item.ticker)} role="button" tabIndex={0}
      onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold-border)'; e.currentTarget.style.background='var(--gold-bg)'; e.currentTarget.style.transform='translateX(4px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.background='white'; e.currentTarget.style.transform='translateX(0)'; }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
        <div className="animate-glow-dot" style={{ width:6, height:6, borderRadius:'50%', background:color, boxShadow:`0 0 6px ${color}`, flexShrink:0 }} />
        <span style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.ticker}</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {item.score !== undefined && (
          <span style={{ fontSize:12, fontWeight:800, color, fontFamily:'var(--font-mono)' }}>{item.score}</span>
        )}
        <button onClick={e => { e.stopPropagation(); onRemove(item.ticker); }} aria-label={`Remove ${item.ticker}`}
          style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:2, fontSize:16, lineHeight:1, borderRadius:4, opacity:0, transition:'all 0.15s', display:'flex', alignItems:'center', justifyContent:'center', width:20, height:20 }}
          onMouseEnter={e => { e.target.style.opacity=1; e.target.style.color='var(--status-danger)'; e.target.style.background='var(--status-danger-bg)'; }}
          onMouseLeave={e => { e.target.style.opacity=0; e.target.style.color='var(--text-muted)'; e.target.style.background='none'; }}>×</button>
      </div>
    </div>
  );
}

export function HistoryPanel({ history, onSelect }) {
  if (!history.length) return null;
  return (
    <div style={{ marginTop:24, paddingTop:16, borderTop:'1px solid var(--border-subtle)' }}>
      <span className="label-xs" style={{ display:'block', marginBottom:10 }}>Recent</span>
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        {history.slice(0, 6).map(item => (
          <button key={item.ticker + item.timestamp} onClick={() => onSelect(item.ticker)}
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 10px', background:'transparent', border:'none', cursor:'pointer', textAlign:'left', borderRadius:8, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--bg-surface)'; e.currentTarget.style.transform='translateX(4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.transform='translateX(0)'; }}>
            <div style={{ display:'flex', flexDirection:'column', minWidth:0 }}>
              <span style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.ticker}</span>
              <span style={{ fontSize:11, color:'var(--text-muted)', marginTop:2, fontFamily:'var(--font-mono)' }}>${item.price?.toLocaleString(undefined,{minimumFractionDigits:2})}</span>
            </div>
            <span style={{ fontSize:12, fontWeight:800, color:riskColor(item.riskLevel), flexShrink:0, fontFamily:'var(--font-mono)' }}>{item.score}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
