import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Minus } from 'lucide-react';

const QUICK_AMOUNTS = [0.25, 0.5, 1];

export default function WaterTracker({ liters = 0, goal = 2.0, onAdd, onRemove }) {
  const displayGoal = goal || 2.0;
  const percent = Math.min(100, (liters / displayGoal) * 100);

  const getWaterColor = () => {
    if (percent >= 100) return '#39FF14';
    if (percent >= 60) return '#00D4FF';
    if (percent >= 30) return '#00A8CC';
    return '#006B8E';
  };

  const color = getWaterColor();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets size={18} style={{ color }} />
          <span className="font-semibold text-white">Water Intake</span>
        </div>
        <span className="text-sm font-mono" style={{ color }}>
          {liters.toFixed(2)}L / {displayGoal}L
        </span>
      </div>

      {/* Wave progress visualization */}
      <div className="relative h-24 bg-dark-700 rounded-2xl overflow-hidden border border-dark-500/50">
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-b-2xl"
          initial={{ height: 0 }}
          animate={{ height: `${Math.max(0, percent)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            background: `linear-gradient(180deg, ${color}40 0%, ${color}80 100%)`,
          }}
        >
          {/* Wave effect */}
          <svg
            viewBox="0 0 200 20"
            preserveAspectRatio="none"
            className="absolute -top-4 left-0 w-full"
            style={{ height: '20px' }}
          >
            <motion.path
              animate={{
                d: [
                  'M0,10 C50,0 150,20 200,10 L200,20 L0,20 Z',
                  'M0,10 C50,20 150,0 200,10 L200,20 L0,20 Z',
                  'M0,10 C50,0 150,20 200,10 L200,20 L0,20 Z',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              fill={color}
              fillOpacity={0.6}
            />
          </svg>
        </motion.div>

        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{liters.toFixed(2)}</p>
            <p className="text-xs text-dark-100">liters</p>
          </div>
        </div>

        {/* Percent badge */}
        <div
          className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-xs font-bold"
          style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
        >
          {Math.round(percent)}%
        </div>
      </div>

      {/* Quick Add buttons */}
      <div>
        <p className="text-xs text-dark-100 uppercase tracking-widest mb-2">Quick Add</p>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_AMOUNTS.map((amount) => (
            <motion.button
              key={amount}
              onClick={() => onAdd(amount)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                backgroundColor: `${color}12`,
                border: `1px solid ${color}35`,
                color: color,
              }}
            >
              +{amount}L
            </motion.button>
          ))}
        </div>
      </div>

      {/* Remove button */}
      <motion.button
        onClick={() => onRemove(0.25)}
        disabled={liters <= 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dark-500 text-dark-100 hover:border-dark-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
      >
        <Minus size={14} />
        Remove 0.25L
      </motion.button>

      {/* Status message */}
      <AnimatePresence>
        {percent >= 100 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-2 rounded-xl text-sm font-semibold"
            style={{
              background: `${color}15`,
              border: `1px solid ${color}30`,
              color,
            }}
          >
            Daily water goal achieved! 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
