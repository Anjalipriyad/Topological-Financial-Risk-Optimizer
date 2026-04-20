/**
 * RiskGauge — Technical monochrome gauge with neon alerts.
 */
export default function RiskGauge({ score }) {
  const normalizedRadius = 45;
  const normalizedCircumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = normalizedCircumference - (score / 100) * normalizedCircumference;

  // Determine neon accent based on score
  const getNeonColor = () => {
    if (score < 40) return "var(--accent-neon-green)";
    if (score < 70) return "var(--accent-neon-yellow)";
    return "var(--accent-neon-orange)";
  };

  const getLabel = () => {
    if (score < 40) return "SAFE";
    if (score < 70) return "VOLATILE";
    return "IMMINENT";
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Subtle Outer Ring */}
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="#111"
            strokeWidth="0.5"
            fill="none"
          />
          
          {/* Main Track */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#111"
            strokeWidth="8"
            fill="none"
          />
          
          {/* Glow filter definition */}
          <defs>
             <filter id="neonGlow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
             </filter>
          </defs>

          {/* Active Neon Bar */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={getNeonColor()}
            strokeWidth="8"
            fill="none"
            strokeDasharray={normalizedCircumference}
            style={{ strokeDashoffset }}
            strokeLinecap="butt"
            filter="url(#neonGlow)"
            className="transition-all duration-1000"
          />
        </svg>

        {/* Technical Score Layout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[10px] uppercase font-black tracking-[0.4em] text-[var(--text-muted)] mb-2">Manifold Coefficient</div>
          <div className="text-7xl font-black text-white leading-none font-outfit tracking-tighter">
            {score}
          </div>
          <div 
            className="text-[11px] font-black uppercase tracking-[0.2em] mt-3 px-4 py-1 rounded border animate-neon-pulse"
            style={{ color: getNeonColor(), borderColor: getNeonColor(), boxShadow: `0 0 10px ${getNeonColor()}33` }}
          >
            {getLabel()}
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-6 opacity-30 text-[9px] font-black uppercase tracking-[0.3em]">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>Topological Shattering Rate</span>
         </div>
         <span>v2.4_Stable</span>
      </div>
    </div>
  );
}
