import { motion } from 'framer-motion';
import { Flame, Droplets, Trophy, TrendingUp } from 'lucide-react';

export default function QuickStats({ streak, totalFoods, todayWater, waterGoal }) {
  const stats = [
    {
      icon: Flame,
      label: 'Day Streak',
      value: streak,
      unit: 'days',
      color: '#FF6B00',
      bgColor: 'rgba(255, 107, 0, 0.1)',
    },
    {
      icon: Droplets,
      label: 'Water Today',
      value: `${(todayWater || 0).toFixed(2)}L`,
      unit: `/ ${(waterGoal || 2.0).toFixed(1)}L`,
      color: '#00D4FF',
      bgColor: 'rgba(0, 212, 255, 0.1)',
      isString: true,
    },
    {
      icon: Trophy,
      label: 'Foods Logged',
      value: totalFoods,
      unit: 'total',
      color: '#FFD60A',
      bgColor: 'rgba(255, 214, 10, 0.1)',
    },
    {
      icon: TrendingUp,
      label: 'Active Days',
      value: Math.max(1, streak),
      unit: 'logged',
      color: '#39FF14',
      bgColor: 'rgba(57, 255, 20, 0.1)',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 + 0.3, duration: 0.4 }}
          className="bg-dark-800 border border-dark-500/50 rounded-xl p-4 hover:border-dark-400/70 transition-all duration-200"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
            style={{ backgroundColor: stat.bgColor }}
          >
            <stat.icon size={16} style={{ color: stat.color }} />
          </div>
          <p className="text-xs text-dark-100 mb-0.5">{stat.label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">{stat.value}</span>
            <span className="text-xs text-dark-200">{stat.unit}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
