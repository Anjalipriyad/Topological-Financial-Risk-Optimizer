import ScrollReveal from './ScrollReveal';
import TiltCard from './TiltCard';

const PIPELINE_STEPS = [
  { id:'01', label:'Raw OHLC', sub:'2-Year Window', icon:'📊' },
  { id:'02', label:'Sliding Window', sub:'Size=20, Stride=1', icon:'⧉' },
  { id:'03', label:'Takens Embedding', sub:'3D, τ=1', icon:'⬡' },
  { id:'04', label:'Vietoris-Rips', sub:'H₀, H₁ Homology', icon:'◎' },
  { id:'05', label:'Persistence Landscape', sub:'10 bins × 2 dims', icon:'≋' },
  { id:'06', label:'Manifold Velocity', sub:'First Derivative (Δ)', icon:'∂' },
  { id:'07', label:'PCA Compression', sub:'40+ → 5 Components', icon:'⊕' },
  { id:'08', label:'Ensemble Vote', sub:'XGB + RF + LR', icon:'⊗' },
];

const PERFORMANCE_DATA = [
  { model:'Baseline (TA Only)', accuracy:'67.4%', f1:'0.383', mcc:'0.172', notes:'RSI + MACD only' },
  { model:'TDA Only', accuracy:'71.2%', f1:'0.421', mcc:'0.238', notes:'Topology, no TA' },
  { model:'Full Ensemble', accuracy:'75.3%', f1:'0.450', mcc:'0.291', notes:'TDA + TA fusion', highlight:true },
];

const PROBLEMS = [
  { title:'Euclidean Blindspot', desc:'Traditional models treat price as a 1D time series, missing multi-dimensional structural topology that precedes crashes.', icon:'🔍' },
  { title:'Class Imbalance', desc:'Crashes are rare events (<5% of trading days). Standard classifiers bias toward predicting "safe" at all times.', icon:'⚖️' },
  { title:'Regime Drift', desc:'A model trained on 2020 data fails in 2024. Static weights cannot adapt to market phase transitions.', icon:'🌊' },
];

const TECH_STACK = [
  { name:'Giotto-TDA', role:'Topological Data Analysis', color:'var(--gold)' },
  { name:'XGBoost', role:'Gradient Boosting Classifier', color:'var(--status-safe)' },
  { name:'scikit-learn', role:'RF + LR + Ensemble Voting', color:'var(--blue)' },
  { name:'FastAPI', role:'Async REST Backend', color:'var(--status-safe)' },
  { name:'yfinance', role:'Market Data Fetcher', color:'var(--gold)' },
  { name:'React + Vite', role:'Frontend Interface', color:'var(--blue)' },
];

export default function ResearchPage() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:64, paddingTop:8 }}>
      {/* Hero */}
      <ScrollReveal variant="fade-up">
        <div style={{ borderBottom:'1px solid var(--border-subtle)', paddingBottom:32 }}>
          <div style={{ display:'inline-flex', padding:'5px 14px', background:'var(--blue-bg)', borderRadius:20, border:'1px solid rgba(37,99,235,0.15)', marginBottom:16 }}>
            <span style={{ fontSize:10, fontWeight:700, color:'var(--blue)', letterSpacing:'0.08em', textTransform:'uppercase' }}>Academic Research</span>
          </div>
          <h1 style={{ fontSize:'clamp(32px, 5vw, 48px)', fontWeight:900, color:'var(--text-primary)', letterSpacing:'-0.03em', lineHeight:1.1, marginBottom:12 }}>
            Research<br />Methodology
          </h1>
          <p style={{ fontSize:15, color:'var(--text-secondary)', maxWidth:560, lineHeight:1.8 }}>
            TFRO applies Topological Data Analysis to detect manifold shattering — the geometric precursor to structural market crashes — before they register as price movements.
          </p>
        </div>
      </ScrollReveal>

      {/* The Problem */}
      <Section num="01" title="The Problem">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:12, marginTop:20 }}>
          {PROBLEMS.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 100} variant="fade-up">
              <TiltCard maxTilt={5} glareOpacity={0.08} borderRadius={16}>
                <div style={{ background:'white', borderRadius:16, padding:'24px', border:'1px solid var(--border-subtle)', height:'100%' }}>
                  <span style={{ fontSize:24, display:'block', marginBottom:12 }}>{p.icon}</span>
                  <h3 style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)', marginBottom:10, letterSpacing:'-0.01em' }}>{p.title}</h3>
                  <p style={{ fontSize:13, lineHeight:1.75, color:'var(--text-secondary)' }}>{p.desc}</p>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* TDA Pipeline */}
      <Section num="02" title="TDA Pipeline">
        <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.75, maxWidth:640, marginTop:8, marginBottom:20 }}>
          Instead of treating price as a 1D signal, TFRO projects it into a high-dimensional topological space and measures how fast the manifold is shattering.
        </p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, alignItems:'center' }}>
          {PIPELINE_STEPS.map((step, i) => (
            <ScrollReveal key={step.id} delay={i * 80} variant="scale">
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ background:'white', borderRadius:12, border:'1px solid var(--border-default)', padding:'14px 16px', minWidth:100, transition:'all 0.25s', cursor:'default' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold-border)'; e.currentTarget.style.boxShadow='var(--shadow-gold)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-default)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)'; }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <span style={{ fontSize:16 }}>{step.icon}</span>
                    <span style={{ fontSize:9, fontWeight:700, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{step.id}</span>
                  </div>
                  <p style={{ fontSize:11, fontWeight:800, color:'var(--text-primary)', marginBottom:2 }}>{step.label}</p>
                  <p style={{ fontSize:9, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{step.sub}</p>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--gold)" strokeWidth={2} style={{ opacity:0.4, flexShrink:0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Manifold Velocity */}
      <Section num="03" title="Manifold Velocity">
        <ScrollReveal variant="fade-up" delay={100}>
          <div style={{ background:'white', borderRadius:16, border:'1px solid var(--border-default)', padding:'28px 32px', marginTop:16, boxShadow:'var(--shadow-sm)' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32 }}>
              <div>
                <h3 style={{ fontSize:13, fontWeight:800, color:'var(--text-primary)', marginBottom:12 }}>The Innovation</h3>
                <p style={{ fontSize:13, lineHeight:1.8, color:'var(--text-secondary)' }}>
                  Standard TDA extracts static topological features. TFRO computes their <strong style={{color:'var(--text-primary)'}}>first derivative</strong> — how fast the topology is changing. A market approaching a crash exhibits <em style={{color:'var(--status-danger)'}}>rapidly shattering topology</em>.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize:13, fontWeight:800, color:'var(--text-primary)', marginBottom:12 }}>Why It Works</h3>
                <p style={{ fontSize:13, lineHeight:1.8, color:'var(--text-secondary)' }}>
                  The 40+ raw TDA features are compressed via PCA to 5 principal components, preventing overfitting on 2-year datasets (~500 rows) while retaining maximum topological signal.
                </p>
              </div>
            </div>
            <div style={{ borderTop:'1px solid var(--border-subtle)', paddingTop:16, marginTop:20 }}>
              <code style={{ fontSize:12, color:'var(--status-safe)', fontFamily:'var(--font-mono)', background:'var(--status-safe-bg)', padding:'6px 12px', borderRadius:8, display:'inline-block' }}>
                Δ(landscape) = landscape[t] − landscape[t−1] → PCA(hstack(landscape, Δ), n=5) → fuse(X_tda, X_ta)
              </code>
            </div>
          </div>
        </ScrollReveal>
      </Section>

      {/* Ensemble Architecture */}
      <Section num="04" title="Ensemble Architecture">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12, marginTop:16 }}>
          {[
            { name:'XGBoost', role:'Non-linear specialist', color:'var(--status-safe)', desc:'Captures complex topological shattering signals with √pos_ratio sample weighting.' },
            { name:'Random Forest', role:'Variance reducer', color:'var(--gold)', desc:'Bagging-based hedge against overfitting on small regime-specific datasets.' },
            { name:'Logistic Regression', role:'Linear baseline', color:'var(--blue)', desc:'Keeps the ensemble grounded when non-linear models diverge from trend.' },
          ].map((m, i) => (
            <ScrollReveal key={m.name} delay={i * 100} variant="fade-up">
              <TiltCard maxTilt={4} glareOpacity={0.08} borderRadius={16}>
                <div style={{ background:'white', borderRadius:16, padding:'20px 22px', border:'1px solid var(--border-subtle)', position:'relative', overflow:'hidden', height:'100%' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${m.color}, transparent)`, borderRadius:'16px 16px 0 0' }} />
                  <h3 style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)', marginBottom:4, marginTop:8 }}>{m.name}</h3>
                  <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:m.color, marginBottom:12 }}>{m.role}</p>
                  <p style={{ fontSize:13, lineHeight:1.75, color:'var(--text-secondary)' }}>{m.desc}</p>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal variant="fade-up" delay={300}>
          <div style={{ background:'var(--bg-surface)', borderRadius:12, border:'1px solid var(--border-subtle)', padding:'16px 20px', marginTop:12 }}>
            <p className="label-xs" style={{ marginBottom:6 }}>Voting Strategy</p>
            <p style={{ fontSize:13, lineHeight:1.75, color:'var(--text-secondary)' }}>
              <strong style={{color:'var(--text-primary)'}}>Soft voting</strong> — averages class probabilities across all three estimators. The final crash probability is a balanced signal.
            </p>
          </div>
        </ScrollReveal>
      </Section>

      {/* Ablation Study */}
      <Section num="05" title="Ablation Study">
        <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:8, marginBottom:16 }}>
          Evaluated on MSFT 2-year dataset, chronological 80/20 split. No data leakage.
        </p>
        <ScrollReveal variant="scale">
          <div style={{ borderRadius:16, border:'1px solid var(--border-default)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'var(--bg-surface)' }}>
                  {['Model','Accuracy','F1-Score','MCC','Notes'].map(h => (
                    <th key={h} style={{ padding:'12px 18px', textAlign:'left', fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-muted)', borderBottom:'1px solid var(--border-default)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERFORMANCE_DATA.map(row => (
                  <tr key={row.model} style={{ background: row.highlight ? 'var(--gold-bg)' : 'white', borderBottom:'1px solid var(--border-subtle)', transition:'background 0.2s' }}
                    onMouseEnter={e => { if(!row.highlight) e.currentTarget.style.background='var(--bg-surface)'; }}
                    onMouseLeave={e => { if(!row.highlight) e.currentTarget.style.background='white'; }}>
                    <td style={{ padding:'14px 18px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:13, fontWeight: row.highlight ? 800 : 500, color: row.highlight ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{row.model}</span>
                        {row.highlight && <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', padding:'2px 8px', borderRadius:6, background:'var(--gold)', color:'white' }}>Best</span>}
                      </div>
                    </td>
                    <td style={{ padding:'14px 18px', fontSize:14, fontWeight:800, color:'var(--text-primary)', fontFamily:'var(--font-mono)' }}>{row.accuracy}</td>
                    <td style={{ padding:'14px 18px', fontSize:13, color:'var(--text-secondary)', fontFamily:'var(--font-mono)' }}>{row.f1}</td>
                    <td style={{ padding:'14px 18px', fontSize:13, color:'var(--text-secondary)', fontFamily:'var(--font-mono)' }}>{row.mcc}</td>
                    <td style={{ padding:'14px 18px', fontSize:12, color:'var(--text-muted)' }}>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </Section>

      {/* Tech Stack */}
      <Section num="06" title="Technology Stack">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:8, marginTop:16 }}>
          {TECH_STACK.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 60} variant="fade-up">
              <div style={{ background:'white', borderRadius:12, padding:'16px 18px', border:'1px solid var(--border-subtle)', display:'flex', alignItems:'center', gap:14, transition:'all 0.25s', cursor:'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold-border)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:t.color, boxShadow:`0 0 8px ${t.color}33`, flexShrink:0 }} />
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{t.name}</p>
                  <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{t.role}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ num, title, children }) {
  return (
    <ScrollReveal variant="fade-up">
      <section>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
          <span style={{ fontSize:28, fontWeight:900, color:'var(--border-default)', fontFamily:'var(--font-mono)' }}>{num}</span>
          <div style={{ width:1, height:20, background:'var(--border-default)' }} />
          <h2 style={{ fontSize:20, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em' }}>{title}</h2>
        </div>
        {children}
      </section>
    </ScrollReveal>
  );
}
