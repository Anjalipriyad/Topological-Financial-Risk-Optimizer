import { useState } from 'react';

/**
 * SearchBar — Minimalist high-contrast search.
 */
export default function SearchBar({ onSearch, isLoading }) {
  const [ticker, setTicker] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSearch(ticker.toUpperCase());
    }
  };

  return (
    <div className="w-full max-w-2xl animate-fade-in-up">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center bg-[var(--bg-surface)] rounded-2xl p-1.5 shadow-2xl border border-[var(--border-subtle)] focus-within:border-[var(--text-muted)] focus-within:bg-[var(--bg-card)] transition-all">
          <div className="pl-5 flex items-center gap-3 text-[var(--text-muted)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Search symbol (e.g. BTC, NVDA, RELIANCE.NS)"
            className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-lg font-bold text-white placeholder:text-[var(--text-muted)] placeholder:font-medium font-outfit"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !ticker.trim()}
            className="flex items-center gap-2 px-10 py-4 rounded-xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-[var(--text-secondary)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-10 disabled:pointer-events-none shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Ingest"
            )}
          </button>
        </div>
      </form>

      {/* Suggestion tags */}
      <div className="flex items-center justify-center gap-5 mt-8">
        <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-[0.3em]">Quicklink</span>
        {['NVDA', 'TSLA', 'BTC', 'RELIANCE.NS'].map(t => (
          <button
            key={t}
            onClick={() => { setTicker(t); onSearch(t); }}
            className="text-[11px] font-bold text-[var(--text-secondary)] hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
