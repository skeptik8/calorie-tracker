import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Droplets, Award, Activity } from 'lucide-react';
import CalorieChart from '../components/Charts/CalorieChart';
import MacroChart from '../components/Charts/MacroChart';
import { useCalories } from '../hooks/useCalories';
import { formatShortDate } from '../utils/dateUtils';

const StatCard = ({ icon: Icon, label, value, unit, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-dark-800 border border-dark-500/50 rounded-2xl p-5"
    style={{
      background: `radial-gradient(ellipse at top right, ${color}08 0%, transparent 60%), #111111`,
    }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
      style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
    >
      <Icon size={18} style={{ color }} />
    </div>
    <p className="text-xs text-dark-100 mb-0.5">{label}</p>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-white">{value}</span>
      {unit && <span className="text-sm text-dark-200">{unit}</span>}
    </div>
  </motion.div>
);

export default function Statistics() {
  const { weeklyData, goals, streak, totalFoodsLogged } = useCalories();

  // Calculate weekly averages
  const activeDays = weeklyData.filter((d) => d.calories > 0);
  const avgCalories = activeDays.length > 0
    ? Math.round(activeDays.reduce((s, d) => s + d.calories, 0) / activeDays.length)
    : 0;
  const avgWater = activeDays.length > 0
    ? (activeDays.reduce((s, d) => s + (d.water || 0), 0) / activeDays.length).toFixed(2)
    : '0.00';
  const avgProtein = activeDays.length > 0
    ? Math.round(activeDays.reduce((s, d) => s + d.protein, 0) / activeDays.length)
    : 0;
  const avgSodium = activeDays.length > 0
    ? Math.round(activeDays.reduce((s, d) => s + (d.sodium || 0), 0) / activeDays.length)
    : 0;

  const bestDay = weeklyData.reduce(
    (best, d) => (!best || d.calories > best.calories ? d : best),
    null
  );

  const totalWeekCalories = weeklyData.reduce((s, d) => s + d.calories, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
          <BarChart3 size={28} className="text-neon" />
          Statistics
        </h1>
        <p className="text-dark-100 text-sm mt-1">Last 7 days overview</p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Avg Daily Calories"
          value={avgCalories.toLocaleString()}
          unit="kcal"
          color="#39FF14"
          delay={0.1}
        />
        <StatCard
          icon={Droplets}
          label="Avg Water Intake"
          value={avgWater}
          unit="L / day"
          color="#00D4FF"
          delay={0.15}
        />
        <StatCard
          icon={Award}
          label="Day Streak"
          value={streak}
          unit="days"
          color="#FFD60A"
          delay={0.2}
        />
        <StatCard
          icon={BarChart3}
          label="Total Foods Logged"
          value={totalFoodsLogged}
          unit="items"
          color="#BD00FF"
          delay={0.25}
        />
      </div>

      {/* Calorie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(57,255,20,0.05) 0%, transparent 50%), #111111' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-white">Calorie Intake</h3>
            <p className="text-xs text-dark-100 mt-0.5">7-day trend with goal line</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-neon rounded" style={{ boxShadow: '0 0 6px #39FF14' }} />
              <span className="text-xs text-dark-200">Calories</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-dark-300 rounded border-dashed" />
              <span className="text-xs text-dark-200">Goal</span>
            </div>
          </div>
        </div>

        <CalorieChart data={weeklyData} goal={goals.calories} />

        {/* Day breakdown */}
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {weeklyData.map((day) => {
            const pct = goals.calories > 0 ? Math.min(100, (day.calories / goals.calories) * 100) : 0;
            const isToday = day.date === new Date().toISOString().split('T')[0];
            return (
              <div key={day.date} className="text-center">
                <div className="h-1.5 bg-dark-600 rounded-full mb-1 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pct >= 100 ? '#FF6B00' : '#39FF14',
                    }}
                  />
                </div>
                <p className={`text-xs ${isToday ? 'text-neon font-bold' : 'text-dark-300'}`}>
                  {formatShortDate(day.date).split(' ')[0]}
                </p>
                <p className="text-xs text-dark-200">{day.calories || '—'}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Macro Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-white">Macronutrient Breakdown</h3>
            <p className="text-xs text-dark-100 mt-0.5">7-day protein, carbs & fat distribution</p>
          </div>
          <div className="flex gap-3">
            {[
              { label: 'Protein', color: '#00D4FF' },
              { label: 'Carbs', color: '#FFD60A' },
              { label: 'Fat', color: '#FF6B00' },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: m.color }} />
                <span className="text-xs text-dark-200">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <MacroChart data={weeklyData} type="bar" />
      </motion.div>

      {/* Sodium Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(167,139,250,0.05) 0%, transparent 50%), #111111' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} style={{ color: '#A78BFA' }} />
          <h3 className="text-base font-semibold text-white">Sodium Intake</h3>
          <span className="text-xs text-dark-300 ml-auto">Goal: {(goals.sodium || 2300).toLocaleString()} mg</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {weeklyData.map((day) => {
            const sodiumGoal = goals.sodium || 2300;
            const pct = sodiumGoal > 0 ? Math.min(100, ((day.sodium || 0) / sodiumGoal) * 100) : 0;
            const isToday = day.date === new Date().toISOString().split('T')[0];
            const barColor = pct >= 100 ? '#FF2D55' : pct >= 80 ? '#FFD60A' : '#A78BFA';
            return (
              <div key={day.date} className="text-center">
                <div className="relative h-16 bg-dark-700 rounded-lg mb-1.5 overflow-hidden flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="w-full rounded-b-lg"
                    style={{ backgroundColor: barColor, opacity: 0.8 }}
                  />
                </div>
                <p className={`text-xs ${isToday ? 'text-neon font-bold' : 'text-dark-300'}`}>
                  {formatShortDate(day.date).split(' ')[0]}
                </p>
                <p className="text-xs text-dark-200">
                  {day.sodium > 0 ? `${day.sodium}` : '—'}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-dark-300">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-purple-400" />
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-yellow-400" />
            <span>&gt; 80% of goal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-red-400" />
            <span>Over goal</span>
          </div>
        </div>
      </motion.div>

      {/* Water Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6"
        style={{ background: 'radial-gradient(ellipse at bottom left, rgba(0,212,255,0.05) 0%, transparent 50%), #111111' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Droplets size={18} style={{ color: '#00D4FF' }} />
          <h3 className="text-base font-semibold text-white">Water Intake</h3>
          <span className="text-xs text-dark-300 ml-auto">Goal: {(goals.water || 2.0).toFixed(1)} L/day</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {weeklyData.map((day) => {
            const waterGoal = goals.water || 2.0;
            const pct = waterGoal > 0 ? Math.min(100, ((day.water || 0) / waterGoal) * 100) : 0;
            const isToday = day.date === new Date().toISOString().split('T')[0];
            const barColor = pct >= 100 ? '#39FF14' : pct >= 60 ? '#00D4FF' : '#006B8E';
            return (
              <div key={day.date} className="text-center">
                <div className="relative h-16 bg-dark-700 rounded-lg mb-1.5 overflow-hidden flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.55 }}
                    className="w-full rounded-b-lg"
                    style={{ backgroundColor: barColor, opacity: 0.8 }}
                  />
                </div>
                <p className={`text-xs ${isToday ? 'text-neon font-bold' : 'text-dark-300'}`}>
                  {formatShortDate(day.date).split(' ')[0]}
                </p>
                <p className="text-xs text-dark-200">
                  {day.water > 0 ? `${(day.water).toFixed(1)}L` : '—'}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Weekly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6"
      >
        <h3 className="text-base font-semibold text-white mb-4">Weekly Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Days Tracked',
              value: activeDays.length,
              unit: '/ 7',
              color: '#39FF14',
            },
            {
              label: 'Total Calories',
              value: totalWeekCalories.toLocaleString(),
              unit: 'kcal',
              color: '#FFD60A',
            },
            {
              label: 'Avg Protein',
              value: avgProtein,
              unit: 'g / day',
              color: '#00D4FF',
            },
            {
              label: 'Best Day',
              value: bestDay && bestDay.calories > 0 ? bestDay.calories.toLocaleString() : '—',
              unit: bestDay && bestDay.calories > 0 ? formatShortDate(bestDay.date) : '',
              color: '#BD00FF',
            },
            {
              label: 'Goal Hit',
              value: weeklyData.filter(
                (d) => d.calories >= goals.calories * 0.9 && d.calories <= goals.calories * 1.1
              ).length,
              unit: 'days',
              color: '#FF6B00',
            },
            {
              label: 'Avg Water',
              value: avgWater,
              unit: 'L / day',
              color: '#00D4FF',
            },
            {
              label: 'Avg Sodium',
              value: avgSodium > 0 ? avgSodium.toLocaleString() : '—',
              unit: avgSodium > 0 ? 'mg / day' : '',
              color: '#A78BFA',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-dark-700 border border-dark-500/30 rounded-xl p-4"
            >
              <p className="text-xs text-dark-100 mb-1">{item.label}</p>
              <p className="text-xl font-bold" style={{ color: item.color }}>{item.value}</p>
              {item.unit && <p className="text-xs text-dark-300">{item.unit}</p>}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
