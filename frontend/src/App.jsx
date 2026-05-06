import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SearchBar from './components/SearchBar';
import PriceChart from './components/PriceChart';
import RiskGauge from './components/RiskGauge';
import RecommendationAlert from './components/RecommendationAlert';
import LoadingOverlay from './components/LoadingOverlay';
import FeatureRadar from './components/FeatureRadar';
import { WatchlistPanel, HistoryPanel } from './components/Watchlist';
import CursorGlow from './components/CursorGlow';
import ScrollReveal from './components/ScrollReveal';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const HEADER_H = 64;

function generateMockPriceData(currentPrice, days = 60) {
  const data = [];
  const volatility = currentPrice * 0.012;
  let price = currentPrice * (1 - (Math.random() * 0.06 - 0.01));
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const drift = i < 5 ? (currentPrice - price) * 0.3 : 0;
    price += drift + (Math.random() - 0.48) * volatility;
    price = Math.max(price, currentPrice * 0.85);
    const c = parseFloat(price.toFixed(2));
    data.push({
      date: label, close: c,
      open: parseFloat((c * (1 - Math.random() * 0.004)).toFixed(2)),
      high: parseFloat((c * (1 + Math.random() * 0.007)).toFixed(2)),
      low: parseFloat((c * (1 - Math.random() * 0.007)).toFixed(2)),
    });
  }
  data[data.length - 1].close = currentPrice;
  return data;
}

function loadFromStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}

function riskColor(level) {
  if (!level) return 'var(--text-muted)';
  const l = level.toLowerCase();
  if (l.includes('high')) return 'var(--status-danger)';
  if (l.includes('medium')) return 'var(--gold)';
  return 'var(--status-safe)';
}

export default function App() {
  const [page, setPage] = useState('home');
  const [pageKey, setPageKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isRealData, setIsRealData] = useState(false);
  const [watchlist, setWatchlist] = useState(() => loadFromStorage('tfro_watchlist', []));
  const [predHistory, setPredHistory] = useState(() => loadFromStorage('tfro_history', []));
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toolsPanelOpen, setToolsPanelOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Page transition
  const switchPage = (p) => {
    if (p === page) return;
    setPage(p);
    setPageKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetToHome = () => {
    setPage('home');
    setResult(null);
    setError(null);
    setChartData([]);
    setIsRealData(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (ticker) => {
    setIsLoading(true); setError(null); setResult(null); setChartData([]); setIsRealData(false);
    if (page !== 'home') switchPage('home');
    try {
      const [predRes, histRes] = await Promise.all([
        fetch(`${API_BASE}/predict/${encodeURIComponent(ticker)}`),
        fetch(`${API_BASE}/history/${encodeURIComponent(ticker)}`).catch(() => ({ ok: false })),
      ]);
      if (!predRes.ok) {
        const body = await predRes.json().catch(() => ({}));
        throw new Error(body.detail || `Request failed (${predRes.status})`);
      }
      const [data, histData] = await Promise.all([
        predRes.json(),
        histRes.ok ? histRes.json() : Promise.resolve(null),
      ]);
      setResult(data);
      if (histData?.data?.length > 5) { setChartData(histData.data); setIsRealData(true); }
      else { setChartData(generateMockPriceData(data.current_price)); setIsRealData(false); }
      const entry = { ticker: data.ticker, score: data.hidden_risk_score, riskLevel: data.risk_level, price: data.current_price, currency: data.currency, timestamp: new Date().toISOString() };
      setPredHistory(prev => {
        const updated = [entry, ...prev.filter(h => h.ticker !== data.ticker)].slice(0, 10);
        localStorage.setItem('tfro_history', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      setError(err.message || 'Failed to connect to the analysis server.');
    } finally { setIsLoading(false); }
  };

  const addToWatchlist = () => {
    if (!result) return;
    const item = { ticker: result.ticker, score: result.hidden_risk_score, riskLevel: result.risk_level, price: result.current_price, currency: result.currency };
    setWatchlist(prev => {
      const updated = [item, ...prev.filter(w => w.ticker !== result.ticker)].slice(0, 10);
      localStorage.setItem('tfro_watchlist', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWatchlist = (ticker) => {
    setWatchlist(prev => {
      const updated = prev.filter(w => w.ticker !== ticker);
      localStorage.setItem('tfro_watchlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isInWatchlist = result && watchlist.some(w => w.ticker === result.ticker);

  // Show sidebar only when dashboard has results/loading/error (not on hero)
  const showSidebar = page === 'home' && (result || isLoading || error);

  return (
    <div className="app-shell">

      {/* Scroll progress */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <div className="app-content">
        {/* Navbar */}
        <Navbar page={page} setPage={switchPage} onLogoClick={resetToHome} mobileSidebarOpen={toolsPanelOpen} setMobileSidebarOpen={setToolsPanelOpen} />

        {/* Body */}
        <div style={{ display: 'flex', maxWidth: showSidebar ? 1400 : 'none', margin: '0 auto', width: '100%' }}>
          {/* Mobile overlay */}
          {mobileSidebarOpen && (
            <div className="mobile-overlay lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
          )}

          {/* Sidebar — only shown when dashboard has content */}
          {showSidebar && (
            <aside className={`${mobileSidebarOpen ? 'flex fixed z-40 w-72 shadow-xl' : 'hidden'} lg:flex sidebar-glass`}
              style={{
                flexDirection: 'column', width: mobileSidebarOpen ? 288 : 224, flexShrink: 0, borderRight: '1px solid var(--border-subtle)', padding: 20,
                position: mobileSidebarOpen ? 'fixed' : 'sticky', top: HEADER_H, height: `calc(100vh - ${HEADER_H}px)`, overflowY: 'auto', zIndex: mobileSidebarOpen ? 40 : 'auto'
              }}>
              {mobileSidebarOpen && (
                <button style={{ alignSelf: 'flex-end', marginBottom: 12, width: 32, height: 32, borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  onClick={() => setMobileSidebarOpen(false)} aria-label="Close sidebar">
                  <svg width="14" height="14" fill="none" stroke="var(--text-primary)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
              <WatchlistPanel watchlist={watchlist} onSelect={t => { handleSearch(t); setMobileSidebarOpen(false); }} onRemove={removeFromWatchlist} />
              <HistoryPanel history={predHistory} onSelect={t => { handleSearch(t); setMobileSidebarOpen(false); }} />
              {/* Mobile nav */}
              <div className="sm:hidden" style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[{ id: 'home', label: 'Dashboard' }].map(({ id, label }) => (
                  <button key={id} onClick={() => { switchPage(id); setMobileSidebarOpen(false); }}
                    style={{ textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: page === id ? 700 : 500, color: page === id ? 'var(--text-primary)' : 'var(--text-secondary)', background: page === id ? 'var(--bg-surface)' : 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer' }}>{label}</button>
                ))}
              </div>
            </aside>
          )}

          {/* Tools Panel — slides in from right when hamburger is clicked */}
          {toolsPanelOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} onClick={() => setToolsPanelOpen(false)}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }} />
              <div onClick={e => e.stopPropagation()} style={{
                position: 'absolute', right: 0, top: 0, bottom: 0, width: 320,
                background: 'var(--bg-base)', borderLeft: '1px solid var(--border-subtle)',
                boxShadow: '-8px 0 30px rgba(0,0,0,0.1)', padding: 24, overflowY: 'auto',
                animation: 'slide-in-left 0.3s var(--ease-out) both',
                display: 'flex', flexDirection: 'column', gap: 24
              }}>
                {/* Close button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="label-sm">System Console</span>
                  <button onClick={() => setToolsPanelOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <svg width="14" height="14" fill="none" stroke="var(--text-primary)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Engine Telemetry */}
                <div style={{ padding: '20px', background: '#1A1A2E', borderRadius: 14, color: 'var(--text-inverse)', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div className="animate-glow-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--status-safe)', boxShadow: '0 0 8px var(--status-safe)' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em' }}>SYSTEM TELEMETRY</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 11, color: '#8A8AA0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Ensemble</span>
                      <span style={{ color: '#E8C547' }}>[3:2:1] XGB/RF/LR</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Calibration</span>
                      <span style={{ color: '#60A5FA' }}>T = 0.4</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Topology</span>
                      <span style={{ color: '#E8C547' }}>Takens d=3, τ=1</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>PCA Compression</span>
                      <span style={{ color: '#059669' }}>40 → 5 dims</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Target Window</span>
                      <span style={{ color: '#60A5FA' }}>5-day fwd</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>ATR Multiplier</span>
                      <span style={{ color: '#E8C547' }}>1.5×</span>
                    </div>
                  </div>
                </div>

                {/* Data Export */}
                <div>
                  <span className="label-xs" style={{ display: 'block', marginBottom: 12 }}>Data Export</span>
                  <button className="btn-glass" style={{ width: '100%', justifyContent: 'flex-start', fontSize: 12, padding: '10px 14px', opacity: result ? 1 : 0.4, pointerEvents: result ? 'auto' : 'none' }} onClick={() => {
                    if (!result) return;
                    const rows = [
                      ['Field', 'Value'],
                      ['Ticker', result.ticker],
                      ['Current Price', `${result.current_price} (${result.currency || 'USD'})`],
                      ['Risk Score', result.hidden_risk_score],
                      ['Risk Level', result.risk_level],
                      ['Backtest Accuracy (%)', result.historical_accuracy_pct],
                      ['Model Confidence (%)', result.model_confidence_pct],
                      ['RSI', result.features?.RSI],
                      ['MACD', result.features?.MACD],
                      ['BB_Width', result.features?.BB_Width],
                      ['BB_Pivot', result.features?.BB_Pivot],
                      ['ATR', result.features?.ATR],
                      ['Recommendation', result.recommendation],
                    ];
                    const csv = rows.map(r => r.join(',')).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${result.ticker}_risk_report.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}>
                    <span style={{ color: 'var(--blue)' }}>↓</span> Export Risk Report (CSV)
                  </button>
                  {!result && <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>Search a ticker first to enable export.</p>}
                </div>

                {/* Navigation */}
                <div>
                  <span className="label-xs" style={{ display: 'block', marginBottom: 12 }}>Navigation</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {[{ id: 'home', label: 'Dashboard', icon: '◈' }].map(({ id, label, icon }) => (
                      <button key={id} onClick={() => { switchPage(id); setToolsPanelOpen(false); }}
                        style={{ textAlign: 'left', padding: '10px 14px', fontSize: 13, fontWeight: page === id ? 700 : 500, color: page === id ? 'var(--text-primary)' : 'var(--text-secondary)', background: page === id ? 'var(--gold-bg)' : 'transparent', border: page === id ? '1px solid var(--gold-border)' : '1px solid transparent', borderRadius: 10, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center', transition: 'all 0.2s' }}>
                        <span style={{ fontSize: 11 }}>{icon}</span> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main */}
          <main key={pageKey} className="page-wrapper" style={{ flex: 1, minWidth: 0, padding: showSidebar ? '32px 24px 48px' : '0' }}>
            {page === 'home' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {/* Search bar (shown when results exist) */}
                {(result || isLoading || error) && (
                  <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                  </section>
                )}

                {/* Error */}
                {error && (
                  <div className="animate-shake" style={{ padding: '16px 20px', borderRadius: 14, background: 'var(--status-danger-bg)', border: '1px solid rgba(220,38,38,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--status-danger)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--status-danger)', marginBottom: 2 }}>Analysis Failed</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{error}</p>
                    </div>
                  </div>
                )}

                {isLoading && <LoadingOverlay />}

                {/* Results */}
                {result && !isLoading && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Ticker header */}
                    <ScrollReveal variant="fade-up">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{result.ticker}</h2>
                          <span style={{
                            padding: '4px 12px', borderRadius: 8, background: riskColor(result.risk_level) === 'var(--status-safe)' ? 'var(--status-safe-bg)' : riskColor(result.risk_level) === 'var(--gold)' ? 'var(--gold-bg)' : 'var(--status-danger-bg)',
                            border: `1px solid ${riskColor(result.risk_level)}22`, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: riskColor(result.risk_level)
                          }}>
                            {result.risk_level} Risk
                          </span>
                        </div>

                        <button onClick={addToWatchlist}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10,
                            border: `1px solid ${isInWatchlist ? 'var(--gold-border)' : 'var(--border-default)'}`,
                            background: isInWatchlist ? 'var(--gold-bg)' : 'var(--bg-glass)',
                            color: isInWatchlist ? 'var(--gold)' : 'var(--text-secondary)',
                            fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.25s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold-border)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = isInWatchlist ? 'var(--gold-border)' : 'var(--border-default)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                          {isInWatchlist ? '✓ Watching' : '+ Watch'}
                        </button>
                      </div>
                    </ScrollReveal>

                    {/* Chart */}
                    <ScrollReveal variant="fade-up" delay={100}>
                      <PriceChart data={chartData} ticker={result.ticker} isRealData={isRealData} currency={result.currency} />
                    </ScrollReveal>

                    {/* System Inference */}
                    <ScrollReveal variant="fade-up" delay={200}>
                      <div className="card-premium">
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', borderRadius: '20px 20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>System Inference</h2>
                            <p className="label-xs" style={{ marginTop: 3 }}>Topological Manifold Analysis · {result.ticker}</p>
                          </div>

                        </div>
                        <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <RiskGauge score={result.hidden_risk_score} riskLevel={result.risk_level} />
                            </div>
                            <FeatureRadar features={result.features || {}} currentPrice={result.current_price} currency={result.currency} />
                          </div>
                          <div style={{ height: 1, background: 'var(--border-subtle)' }} />
                          <RecommendationAlert
                            riskLevel={result.risk_level}
                            recommendation={result.recommendation}
                            currentPrice={result.current_price}
                            currency={result.currency}
                            features={result.features || {}}
                            modelConfidence={result.model_confidence_pct}
                            historicalAccuracy={result.historical_accuracy_pct}
                          />
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>
                )}

                {/* Hero (empty state) */}
                {!result && !isLoading && !error && (
                  <HeroSection onSearch={handleSearch} isLoading={isLoading} />
                )}
              </div>
            )}
          </main>
        </div>

        {/* Footer */}
        <footer className="footer-glass" style={{ borderTop: '1px solid var(--border-subtle)', padding: '24px 0', marginTop: 'auto' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Topological Financial Risk Optimizer</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
