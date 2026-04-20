/**
 * RecommendationAlert — Final system verdict with high-contrast tiles.
 */
export default function RecommendationAlert({ 
  riskLevel, 
  recommendation, 
  ticker, 
  currentPrice 
}) {
  const isHighRisk = riskLevel.toLowerCase().includes('high');
  const isMediumRisk = riskLevel.toLowerCase().includes('medium');

  const getTheme = () => {
    if (isHighRisk) return {
      color: "var(--accent-neon-orange)",
      label: "Critical Condition",
      hex: "#ff5500"
    };
    if (isMediumRisk) return {
      color: "var(--accent-neon-yellow)",
      label: "Pre-Shatter Warning",
      hex: "#ffdd00"
    };
    return {
      color: "var(--accent-neon-green)",
      label: "Operational Integrity",
      hex: "#00ff88"
    };
  };

  const theme = getTheme();

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Metrics Row */}
      <div className="flex items-end justify-between border-b border-white/5 pb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-[var(--text-muted)] mb-3">Live Valuation</p>
          <p className="text-5xl font-black text-white font-outfit tracking-tighter">
            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div 
          className="px-8 py-3 rounded-xl border-2 font-black text-sm uppercase tracking-widest shadow-[0_0_25px_-5px_rgba(255,255,255,0.1)]"
          style={{ borderColor: theme.color, color: theme.color, boxShadow: `0 0 30px ${theme.hex}22` }}
        >
          {riskLevel}
        </div>
      </div>

      {/* Primary Verdict Card */}
      <div className="bg-[var(--bg-surface)] rounded-3xl p-10 border border-white/5 relative overflow-hidden group">
        <div 
          className="absolute top-0 left-0 w-1.5 h-full"
          style={{ backgroundColor: theme.color, boxShadow: `0 0 20px ${theme.hex}` }}
        />
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">{theme.label}</span>
          </div>
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tight font-outfit">
            System Recommendation
          </h3>
          <p className="text-lg leading-relaxed text-[var(--text-secondary)] font-medium">
            {recommendation}
          </p>
        </div>
      </div>

      {/* Execution Sub-Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border border-white/5 bg-black/40 hover:bg-black/60 transition-colors">
          <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-2">Safe Stop-Loss</p>
          <p className="text-sm font-bold text-white uppercase tracking-tighter">Manifold -2.50%</p>
        </div>
        <div className="p-6 rounded-2xl border border-white/5 bg-black/40 hover:bg-black/60 transition-colors">
          <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-2">Liquidity Delta</p>
          <p className="text-sm font-bold text-white uppercase tracking-tighter">Optimal Capture</p>
        </div>
      </div>
    </div>
  );
}
