import { motion } from 'framer-motion';

export default function ProgressBar({
  value = 0,
  max = 100,
  color = '#39FF14',
  height = 'h-2',
  showLabel = false,
  label = '',
  className = '',
  animate = true,
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const getColor = () => {
    if (color === 'auto') {
      if (percent < 70) return '#39FF14';
      if (percent < 90) return '#FFD60A';
      if (percent <= 100) return '#FF6B00';
      return '#FF2D55';
    }
    return color;
  };

  const barColor = getColor();

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-dark-100 mb-1.5">
          <span>{label}</span>
          <span>{Math.round(percent)}%</span>
        </div>
      )}
      <div className={`${height} bg-dark-500 rounded-full overflow-hidden`}>
        <motion.div
          className="h-full rounded-full"
          initial={animate ? { width: 0 } : { width: `${percent}%` }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            backgroundColor: barColor,
            boxShadow: `0 0 8px ${barColor}80`,
          }}
        />
      </div>
    </div>
  );
}
