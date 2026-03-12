import { motion } from 'framer-motion';
import ProgressBar from '../UI/ProgressBar';
import AnimatedNumber from '../UI/AnimatedNumber';

const MACRO_CONFIG = {
  protein: { label: 'Protein', color: '#00D4FF', unit: 'g', emoji: '🥩' },
  carbs:   { label: 'Carbs',   color: '#FFD60A', unit: 'g', emoji: '🌾' },
  fat:     { label: 'Fat',     color: '#FF6B00', unit: 'g', emoji: '🥑' },
};

export default function MacroCard({ macro, value, goal, delay = 0 }) {
  const config = MACRO_CONFIG[macro];
  const percent = goal > 0 ? Math.min(100, (value / goal) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-dark-800 border border-dark-500/50 rounded-2xl p-4 hover:border-dark-400/70 transition-all duration-300"
      style={{
        background: `radial-gradient(ellipse at top right, ${config.color}08 0%, transparent 60%), #111111`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.emoji}</span>
          <span className="text-sm font-medium text-dark-100">{config.label}</span>
        </div>
        <span className="text-xs text-dark-200 font-mono">{Math.round(percent)}%</span>
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span
          className="text-2xl font-bold"
          style={{ color: config.color }}
        >
          <AnimatedNumber value={value} />
        </span>
        <span className="text-dark-100 text-sm">/ {goal}{config.unit}</span>
      </div>

      <ProgressBar
        value={value}
        max={goal}
        color={config.color}
        height="h-1.5"
      />
    </motion.div>
  );
}
