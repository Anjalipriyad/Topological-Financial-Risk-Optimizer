import { useState } from 'react';
import SearchBar from './components/SearchBar';
import PriceChart from './components/PriceChart';
import RiskGauge from './components/RiskGauge';
import RecommendationAlert from './components/RecommendationAlert';
import LoadingOverlay from './components/LoadingOverlay';
import './App.css';

const API_BASE = 'http://localhost:8000';

function generateMockPriceData(currentPrice, days = 30) {
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

    data.push({ date: label, close: parseFloat(price.toFixed(2)) });
  }
  data[data.length - 1].close = currentPrice;
  return data;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  const handleSearch = async (ticker) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setChartData([]);

    try {
      const res = await fetch(`${API_BASE}/predict/${ticker}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setResult(data);
      setChartData(generateMockPriceData(data.current_price));
    } catch (err) {
      setError(err.message || 'Failed to connect to the analysis server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[var(--bg-primary)]">
      {/* ── Noir Header ─────────────────────────────────────────────────── */}
      <header className="w-full glass-noir sticky top-0 z-50 py-5 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Minimal Logo */}
            <div className="w-9 h-9 rounded-lg border-2 border-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              <div className="w-1.5 h-4 bg-white rounded-full transform -rotate-12" />
              <div className="w-1.5 h-4 bg-white rounded-full transform rotate-12 -ml-0.5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase font-outfit">
                TFRO <span className="font-light text-[var(--text-secondary)]">/ Mini</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-neon-green)] animate-neon-pulse shadow-[0_0_8px_var(--accent-neon-green)]" />
               <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--accent-neon-green)]">Engine Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ───────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-4xl px-4 flex flex-col items-center gap-16 py-16">
        
        {/* Search Section (Perfectly Centered) */}
        <section className="w-full flex flex-col items-center gap-4">
           <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Error State */}
        {error && (
          <div className="w-full max-w-xl rounded-xl border border-red-900/50 bg-red-950/20 p-5 text-center animate-fade-in-up">
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && <LoadingOverlay />}

        {/* Success State */}
        {result && !isLoading && (
          <div className="w-full flex flex-col gap-12 animate-fade-in-up">
            <PriceChart data={chartData} ticker={result.ticker} />

            {/* Analysis Grid */}
            <div className="card-noir rounded-3xl p-8 md:p-12 flex flex-col gap-12">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-8">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight font-outfit">
                    SYSTEM INFERENCE
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] font-medium mt-1 uppercase tracking-widest">
                    Topological Manifold Analysis — {result.ticker}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-tighter">Certainty</div>
                  <div className="text-2xl font-bold font-jetbrains text-white">
                    {result.historical_accuracy_pct}<span className="text-sm text-[var(--text-muted)] ml-0.5">%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-16 items-center">
                {/* Gauge Section */}
                <div className="flex-shrink-0">
                  <RiskGauge score={result.hidden_risk_score} />
                </div>

                {/* Info Section */}
                <div className="flex-1 w-full">
                  <RecommendationAlert
                    riskLevel={result.risk_level}
                    recommendation={result.recommendation}
                    ticker={result.ticker}
                    currentPrice={result.current_price}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && !error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 animate-fade-in-up opacity-80">
            <div className="w-20 h-20 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center mb-8 rotate-3 shadow-[0_0_30px_rgba(255,255,255,0.03)]">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21l-8.244-4.76V7.76L12 3l8.244 4.76v8.48L12 21z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
               Ready for Ingestion
            </h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed font-medium">
              Enter a ticker to compute high-dimensional risk coefficients 
              and predict structural crashes using TDA.
            </p>
          </div>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="w-full py-16 mt-auto border-t border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-xs font-black text-white italic tracking-tighter uppercase font-outfit">TFRO / RESEARCH</p>
            <p className="text-[10px] text-[var(--text-muted)] font-medium">© 2026 High-Fidelity Risks Labs</p>
          </div>
          
          <div className="flex items-center gap-8 text-[9px] uppercase tracking-[0.25em] font-black text-[var(--text-muted)]">
             <span className="hover:text-white transition-colors cursor-default">Giotto-TDA</span>
             <span className="hover:text-white transition-colors cursor-default">XGBoost_v2</span>
             <span className="hover:text-white transition-colors cursor-default">FastAPI_RT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
