/**
 * LoadingOverlay — Technical monochrome loading state.
 */
export default function LoadingOverlay() {
  return (
    <div className="w-full max-w-2xl mx-auto py-24 flex flex-col items-center animate-fade-in-up">
      {/* Industrial Loader */}
      <div className="relative w-20 h-20 mb-12">
        {/* Static Background Ring */}
        <div className="absolute inset-0 rounded-xl border-4 border-white/5" />
        
        {/* Rotating Outer Ring */}
        <div className="absolute inset-0 rounded-xl border-4 border-white border-t-transparent animate-spin" />
        
        {/* Inner Pulsing Pulse */}
        <div className="absolute inset-4 rounded-md bg-white/10 animate-pulse flex items-center justify-center">
           <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
        </div>
      </div>

      <div className="text-center flex flex-col items-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-neon-pulse mb-6 shadow-[0_0_10px_white]" />
        <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-outfit mb-4">
          EXTRACTING_MANIFOLD
        </h3>
        <p className="text-sm text-[var(--text-secondary)] font-medium max-w-xs leading-relaxed uppercase tracking-widest opacity-60">
          Running high-dimensional TDA pipeline... Computed persistence diagrams in Real-Time. 
          Latency: ~10.4s
        </p>
      </div>

      {/* Progress indicators */}
      <div className="mt-16 flex gap-10">
         {[1, 2, 3].map(i => (
           <div key={i} className="flex flex-col items-center gap-2">
             <div className="w-1 h-1 bg-white rounded-full opacity-20" />
             <div className="h-4 w-[1px] bg-gradient-to-b from-white/20 to-transparent" />
           </div>
         ))}
      </div>
    </div>
  );
}
