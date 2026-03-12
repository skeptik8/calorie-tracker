import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';
import { formatDayName } from '../../utils/dateUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-dark-500/60 rounded-xl p-3 shadow-xl">
        <p className="text-xs text-dark-100 mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
            <span className="text-xs capitalize" style={{ color: entry.fill }}>
              {entry.dataKey}: {Math.round(entry.value)}g
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function MacroChart({ data, type = 'bar' }) {
  const chartData = data.map((d) => ({
    ...d,
    day: formatDayName(d.date),
  }));

  if (type === 'radar') {
    const today = chartData[chartData.length - 1] || {};
    const radarData = [
      { subject: 'Protein', value: today.protein || 0, fullMark: 200 },
      { subject: 'Carbs', value: today.carbs || 0, fullMark: 300 },
      { subject: 'Fat', value: today.fat || 0, fullMark: 100 },
    ];

    return (
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#2A2A2A" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#666', fontSize: 11 }}
            />
            <Radar
              name="Today"
              dataKey="value"
              stroke="#39FF14"
              fill="#39FF14"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
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
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />

          <Bar dataKey="protein" fill="#00D4FF" radius={[4, 4, 0, 0]} maxBarSize={20} />
          <Bar dataKey="carbs" fill="#FFD60A" radius={[4, 4, 0, 0]} maxBarSize={20} />
          <Bar dataKey="fat" fill="#FF6B00" radius={[4, 4, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
