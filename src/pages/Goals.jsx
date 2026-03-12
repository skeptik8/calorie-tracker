import { motion } from 'framer-motion';
import { Target, Zap, Info } from 'lucide-react';
import GoalsPanel from '../components/Goals/GoalsPanel';
import { useCalories } from '../hooks/useCalories';
import { calcBMR, calcTDEE } from '../utils/calculations';

export default function Goals() {
  const { goals, profile, updateGoals, updateProfile } = useCalories();

  const bmr = calcBMR(
    Number(profile.weight),
    Number(profile.height),
    Number(profile.age),
    profile.gender
  );

  const tdee = calcTDEE(bmr, profile.activityLevel);

  const suggestions = [
    { label: 'Lose Weight (500 deficit)', value: Math.max(1200, tdee - 500), tag: '🔥 Fat Loss' },
    { label: 'Maintain Weight', value: tdee, tag: '⚖️ Maintenance' },
    { label: 'Gain Muscle (250 surplus)', value: tdee + 250, tag: '💪 Muscle Gain' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
          <Target size={28} className="text-neon" />
          Goals & Profile
        </h1>
        <p className="text-dark-100 text-sm mt-1">Set your nutrition targets and personal info</p>
      </motion.div>

      {/* TDEE Calculator Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(57,255,20,0.06) 0%, transparent 50%), #111111' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-neon" />
          <h3 className="text-base font-semibold text-white">Estimated Daily Needs (TDEE)</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-dark-700 border border-dark-500/50 rounded-xl p-4 text-center">
            <p className="text-xs text-dark-100 mb-1">BMR (Base)</p>
            <p className="text-2xl font-bold text-white">{bmr.toLocaleString()}</p>
            <p className="text-xs text-dark-300">kcal / day at rest</p>
          </div>
          <div className="bg-neon/5 border border-neon/20 rounded-xl p-4 text-center">
            <p className="text-xs text-dark-100 mb-1">TDEE (With Activity)</p>
            <p className="text-2xl font-bold text-neon">{tdee.toLocaleString()}</p>
            <p className="text-xs text-dark-300">kcal / day total</p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-dark-700/50 border border-dark-500/30 rounded-xl">
          <Info size={14} className="text-dark-200 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-dark-200">
            TDEE is calculated using the Mifflin-St Jeor equation based on your profile. Update your weight, height, age, and activity level for accurate results.
          </p>
        </div>
      </motion.div>

      {/* Smart Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6"
      >
        <h3 className="text-base font-semibold text-white mb-4">Smart Goal Suggestions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => updateGoals({ calories: s.value })}
              className={`p-4 rounded-xl border text-left transition-all duration-200 hover:border-neon/40 hover:-translate-y-0.5 group ${
                goals.calories === s.value
                  ? 'bg-neon/10 border-neon/40'
                  : 'bg-dark-700 border-dark-500/50 hover:bg-dark-600'
              }`}
            >
              <p className="text-xs mb-1">{s.tag}</p>
              <p className="font-bold text-white group-hover:text-neon transition-colors text-lg">
                {s.value.toLocaleString()} kcal
              </p>
              <p className="text-xs text-dark-200 mt-0.5">{s.label}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Goals Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GoalsPanel
          goals={goals}
          profile={profile}
          onUpdateGoals={updateGoals}
          onUpdateProfile={updateProfile}
        />
      </motion.div>
    </div>
  );
}
