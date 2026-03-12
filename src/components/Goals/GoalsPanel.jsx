import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Target, Dumbbell, Droplets } from 'lucide-react';
import NeonButton from '../UI/NeonButton';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'lightly_active', label: 'Lightly Active', description: '1-3 days/week' },
  { value: 'moderately_active', label: 'Moderately Active', description: '3-5 days/week' },
  { value: 'very_active', label: 'Very Active', description: '6-7 days/week' },
  { value: 'extra_active', label: 'Extra Active', description: 'Very hard exercise' },
];

export default function GoalsPanel({ goals, profile, onUpdateGoals, onUpdateProfile }) {
  const [goalForm, setGoalForm] = useState({ ...goals });
  const [profileForm, setProfileForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const handleGoalChange = (field, value) => {
    setGoalForm((prev) => ({ ...prev, [field]: field === 'water' ? parseFloat(value) || 0 : Number(value) || 0 }));
  };

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdateGoals(goalForm);
    onUpdateProfile(profileForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const goalFields = [
    {
      field: 'calories',
      label: 'Daily Calories',
      tooltip: 'Total energy target for the day',
      icon: Target,
      color: '#39FF14',
      unit: 'kcal',
      min: 800,
      max: 6000,
      step: 50,
    },
    {
      field: 'protein',
      label: 'Protein Goal',
      tooltip: 'Protein builds and repairs muscle tissue',
      icon: Dumbbell,
      color: '#00D4FF',
      unit: 'g',
      min: 0,
      max: 500,
      step: 5,
    },
    {
      field: 'carbs',
      label: 'Carbs Goal',
      tooltip: 'Carbohydrates are your primary energy source',
      icon: () => <span>🌾</span>,
      color: '#FFD60A',
      unit: 'g',
      min: 0,
      max: 800,
      step: 5,
    },
    {
      field: 'fat',
      label: 'Total Fat Goal',
      tooltip: 'Total fat including saturated, trans, and unsaturated fats',
      icon: () => <span>🥑</span>,
      color: '#FF6B00',
      unit: 'g',
      min: 0,
      max: 300,
      step: 5,
    },
    {
      field: 'saturatedFat',
      label: 'Saturated Fat Goal',
      tooltip: 'Saturated fat — limit to reduce cardiovascular risk. WHO recommends < 10% of calories.',
      icon: () => <span>🧈</span>,
      color: '#FF8C00',
      unit: 'g',
      min: 0,
      max: 100,
      step: 1,
    },
    {
      field: 'transFat',
      label: 'Trans Fat Goal',
      tooltip: 'Trans fat — artificially produced fats. WHO recommends < 1% of calories.',
      icon: () => <span>⚠️</span>,
      color: '#FF4500',
      unit: 'g',
      min: 0,
      max: 20,
      step: 0.5,
    },
    {
      field: 'sodium',
      label: 'Sodium Goal',
      tooltip: 'Sodium — total salt intake in milligrams. WHO recommends < 2,300 mg/day.',
      icon: () => <span>🧂</span>,
      color: '#A78BFA',
      unit: 'mg',
      min: 500,
      max: 5000,
      step: 100,
    },
    {
      field: 'water',
      label: 'Water Goal',
      tooltip: 'Daily water intake target in liters. Recommended: 2.0–3.0 L/day.',
      icon: Droplets,
      color: '#00D4FF',
      unit: 'L',
      min: 0.5,
      max: 5,
      step: 0.25,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Nutrition Goals */}
      <div
        className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(57,255,20,0.05) 0%, transparent 50%), #111111' }}
      >
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <Target size={20} className="text-neon" />
          Nutrition Goals
        </h3>

        <div className="space-y-5">
          {goalFields.map((field, i) => (
            <motion.div
              key={field.field}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-sm font-medium text-white flex items-center gap-2 cursor-help"
                  title={field.tooltip}
                >
                  <span style={{ color: field.color }}>
                    {typeof field.icon === 'function' ? <field.icon size={16} /> : null}
                  </span>
                  {field.label}
                  <span className="text-dark-400 text-xs" title={field.tooltip}>ⓘ</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold" style={{ color: field.color }}>
                    {field.field === 'water'
                      ? (goalForm[field.field] ?? 2.0).toFixed(2)
                      : (goalForm[field.field] ?? 0)}
                  </span>
                  <span className="text-xs text-dark-200">{field.unit}</span>
                </div>
              </div>

              <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={goalForm[field.field] ?? (field.field === 'water' ? 2.0 : 0)}
                onChange={(e) => handleGoalChange(field.field, e.target.value)}
                className="w-full"
                style={{ accentColor: field.color }}
              />

              <div className="flex justify-between text-xs text-dark-300 mt-1">
                <span>{field.min}{field.unit}</span>
                <span>{field.max}{field.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Profile */}
      <div
        className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6"
        style={{ background: 'radial-gradient(ellipse at bottom right, rgba(0,212,255,0.04) 0%, transparent 50%), #111111' }}
      >
        <h3 className="text-lg font-bold text-white mb-5">Profile Settings</h3>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs text-dark-100 uppercase tracking-widest mb-1.5">Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              className="input-dark"
              placeholder="Your name"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-dark-100 uppercase tracking-widest mb-1.5">Age</label>
              <input
                type="number"
                value={profileForm.age}
                onChange={(e) => handleProfileChange('age', e.target.value)}
                className="input-dark"
                min="10" max="120"
              />
            </div>
            <div>
              <label className="block text-xs text-dark-100 uppercase tracking-widest mb-1.5">Weight (kg)</label>
              <input
                type="number"
                value={profileForm.weight}
                onChange={(e) => handleProfileChange('weight', e.target.value)}
                className="input-dark"
                min="20" max="300"
              />
            </div>
            <div>
              <label className="block text-xs text-dark-100 uppercase tracking-widest mb-1.5">Height (cm)</label>
              <input
                type="number"
                value={profileForm.height}
                onChange={(e) => handleProfileChange('height', e.target.value)}
                className="input-dark"
                min="100" max="250"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs text-dark-100 uppercase tracking-widest mb-1.5">Gender</label>
            <div className="flex gap-2">
              {['male', 'female'].map((g) => (
                <button
                  key={g}
                  onClick={() => handleProfileChange('gender', g)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-150 ${
                    profileForm.gender === g
                      ? 'bg-neon/15 border border-neon/40 text-neon'
                      : 'bg-dark-700 border border-dark-500 text-dark-100 hover:border-dark-300'
                  }`}
                >
                  {g === 'male' ? '♂ Male' : '♀ Female'}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs text-dark-100 uppercase tracking-widest mb-1.5">
              Activity Level
            </label>
            <div className="space-y-1.5">
              {ACTIVITY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleProfileChange('activityLevel', level.value)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                    profileForm.activityLevel === level.value
                      ? 'bg-neon/10 border border-neon/30 text-white'
                      : 'bg-dark-700 border border-dark-500 text-dark-100 hover:border-dark-300'
                  }`}
                >
                  <span className="font-medium">{level.label}</span>
                  <span className="text-xs text-dark-200">{level.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <motion.div animate={saved ? { scale: [1, 1.02, 1] } : {}}>
        <NeonButton
          onClick={handleSave}
          variant={saved ? 'outline' : 'primary'}
          fullWidth
          size="lg"
          icon={<Save size={16} />}
        >
          {saved ? 'Saved! ✓' : 'Save Changes'}
        </NeonButton>
      </motion.div>
    </div>
  );
}
