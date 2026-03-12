import { motion } from 'framer-motion';
import AnimatedNumber from '../UI/AnimatedNumber';

const SIZE = 220;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CalorieRing({ consumed, goal, remaining }) {
  const rawPercent = goal > 0 ? (consumed / goal) * 100 : 0;
  const percent = Math.min(100, rawPercent);
  const isOver = rawPercent > 100;

  const strokeDashoffset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  const ringColor = isOver ? '#FF2D55' : consumed / goal > 0.9 ? '#FFD60A' : '#39FF14';
  const glowColor = isOver ? 'rgba(255, 45, 85, 0.5)' : consumed / goal > 0.9 ? 'rgba(255, 214, 10, 0.5)' : 'rgba(57, 255, 20, 0.5)';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* Background ring */}
        <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#1F1F1F"
            strokeWidth={STROKE_WIDTH}
          />
          {/* Animated progress ring */}
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </svg>

        {/* Inner content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs text-dark-100 uppercase tracking-widest mb-1">Consumed</p>
          <div className="text-4xl font-bold text-white">
            <AnimatedNumber value={consumed} />
          </div>
          <p className="text-sm text-dark-100 mt-0.5">kcal</p>
          <div className="mt-3 h-px w-12 bg-dark-500" />
          <p className="text-xs text-dark-100 mt-2">Goal: {goal.toLocaleString()} kcal</p>
        </div>

        {/* Percent badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{
            background: `${ringColor}20`,
            border: `1px solid ${ringColor}50`,
            color: ringColor,
          }}
        >
          {Math.round(rawPercent)}%
        </motion.div>
      </div>

      {/* Remaining */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4 text-center"
      >
        {isOver ? (
          <p className="text-accent-red font-semibold">
            <AnimatedNumber value={consumed - goal} /> kcal over goal
          </p>
        ) : (
          <p className="text-neon font-semibold">
            <AnimatedNumber value={remaining} /> kcal remaining
          </p>
        )}
      </motion.div>
    </div>
  );
}
