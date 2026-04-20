import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-white/20">
      <p className="text-[10px] uppercase tracking-tighter font-black text-[var(--text-muted)] mb-1">Observation: {label}</p>
      <p className="text-xl font-black text-white font-jetbrains">
        ${payload[0].value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};

export default function PriceChart({ data = [], ticker = '' }) {
  if (!data.length) return null;

  return (
    <div className="card-noir rounded-[32px] p-10 animate-fade-in-up">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
           <div className="w-1 h-10 bg-white" />
           <div>
              <h2 className="text-4xl font-black text-white tracking-tighter font-outfit uppercase">
                {ticker} <span className="text-[var(--text-muted)] font-light ml-2">/ TIME-SERIES</span>
              </h2>
           </div>
        </div>
        <div className="text-right">
           <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] border border-[var(--border-subtle)] px-4 py-2 rounded-lg">
            Window: 30D
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fff" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="1 6"
            stroke="#1a1a1a"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#555', fontWeight: 900 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            dy={20}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 10, fill: '#555', fontWeight: 900 }}
            axisLine={false}
            tickLine={false}
            width={70}
            tickFormatter={(v) => `$${v.toLocaleString()}`}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#333', strokeWidth: 1 }} 
          />
          <Area
            type="stepAfter"
            dataKey="close"
            stroke="#ffffff"
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{
              r: 5,
              fill: '#ffffff',
              stroke: '#000',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
