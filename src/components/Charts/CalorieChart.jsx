import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { formatDayName, formatShortDate } from '../../utils/dateUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="bg-dark-800 border border-dark-500/60 rounded-xl p-3 shadow-xl">
        <p className="text-xs text-dark-100 mb-2">{formatShortDate(label)}</p>
        <div className="space-y-1">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-dark-100 capitalize">{entry.name}:</span>
              <span className="text-xs font-bold text-white">{Math.round(entry.value)} kcal</span>
            </div>
          ))}
          {data?.goal && (
            <div className="flex items-center gap-2 pt-1 border-t border-dark-500/50">
              <div className="w-2 h-2 rounded-full bg-dark-300" />
              <span className="text-xs text-dark-100">Goal:</span>
              <span className="text-xs font-bold text-dark-100">{data.goal} kcal</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function CalorieChart({ data, goal }) {
  const chartData = data.map((d) => ({
    ...d,
    date: d.date,
    day: formatDayName(d.date),
  }));

  return (
    <div style={{ height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="calorieGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2A2A2A"
            vertical={false}
          />

          <XAxis
            dataKey="day"
            tick={{ fill: '#666', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: '#666', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: 'rgba(57,255,20,0.2)', strokeWidth: 1 }}
          />

          {goal && (
            <ReferenceLine
              y={goal}
              stroke="#39FF14"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
              label={{ value: 'Goal', fill: '#39FF14', fontSize: 10, position: 'right' }}
            />
          )}

          <Area
            type="monotone"
            dataKey="calories"
            name="calories"
            stroke="#39FF14"
            strokeWidth={2}
            fill="url(#calorieGrad)"
            dot={{ fill: '#39FF14', strokeWidth: 0, r: 4 }}
            activeDot={{
              r: 6,
              fill: '#39FF14',
              stroke: '#0A0A0A',
              strokeWidth: 2,
              style: { filter: 'drop-shadow(0 0 6px #39FF14)' },
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
