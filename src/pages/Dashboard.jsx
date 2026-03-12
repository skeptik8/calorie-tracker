import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Flame, TrendingUp, Info } from 'lucide-react';
import CalorieRing from '../components/Dashboard/CalorieRing';
import MacroCard from '../components/Dashboard/MacroCard';
import QuickStats from '../components/Dashboard/QuickStats';
import WaterTracker from '../components/Water/WaterTracker';
import AddFoodModal from '../components/Meals/AddFoodModal';
import NeonButton from '../components/UI/NeonButton';
import ProgressBar from '../components/UI/ProgressBar';
import { useCalories } from '../hooks/useCalories';
import { formatDate, getGreeting, getTodayKey } from '../utils/dateUtils';
import { calcCaloriesRemaining, getCalorieStatus } from '../utils/calculations';

const NUTRIENT_TOOLTIPS = {
  calories: 'Total energy consumed today in kilocalories',
  protein: 'Protein — essential for muscle repair and growth (4 kcal/g)',
  carbs: 'Carbohydrates — primary energy source for the body (4 kcal/g)',
  fat: 'Total Fat — includes all fats in your diet (9 kcal/g)',
  saturatedFat: 'Saturated Fat — found in animal products; limit to reduce cardiovascular risk',
  transFat: 'Trans Fat — artificially produced fats; minimize as much as possible',
  sodium: 'Sodium — total salt intake in milligrams; WHO recommends < 2,300 mg/day',
};

function NutrientBar({ label, value, goal, unit, color, tooltip, indent = false, subItems }) {
  const percent = goal > 0 ? Math.min(100, (value / goal) * 100) : 0;
  return (
    <div className={indent ? 'pl-4 border-l-2 border-dark-600' : ''}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          {indent && <span className="text-dark-400 text-xs">↳</span>}
          <span className={`text-sm font-medium ${indent ? 'text-dark-100' : 'text-white'}`}>{label}</span>
          {tooltip && (
            <span
              className="text-dark-400 text-xs cursor-help"
              title={tooltip}
            >
              <Info size={11} />
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-semibold" style={{ color: indent ? '#aaa' : color }}>
            {value}{unit}
          </span>
          {goal > 0 && (
            <span className="text-dark-300">/ {goal}{unit}</span>
          )}
          {goal > 0 && (
            <span
              className="font-mono ml-1 px-1.5 py-0.5 rounded text-xs"
              style={{ backgroundColor: `${color}15`, color }}
            >
              {Math.round(percent)}%
            </span>
          )}
        </div>
      </div>
      <ProgressBar
        value={value}
        max={goal || 1}
        color={color}
        height={indent ? 'h-1' : 'h-1.5'}
      />
    </div>
  );
}

export default function Dashboard() {
  const {
    goals,
    profile,
    todayTotals,
    todayWater,
    streak,
    totalFoodsLogged,
    addFood,
    addWaterAmount,
    removeWaterAmount,
  } = useCalories();

  const [modalOpen, setModalOpen] = useState(false);
  const [defaultMealType, setDefaultMealType] = useState('breakfast');

  const remaining = calcCaloriesRemaining(goals.calories, todayTotals.calories);
  const status = getCalorieStatus(todayTotals.calories, goals.calories);

  const openModal = (mealType = 'breakfast') => {
    setDefaultMealType(mealType);
    setModalOpen(true);
  };

  const handleAddFood = (foodData) => {
    addFood(foodData);
    setModalOpen(false);
  };

  const mealSummary = [
    { type: 'breakfast', label: 'Breakfast', emoji: '🌅', cal: todayTotals.breakfast },
    { type: 'lunch',     label: 'Lunch',     emoji: '☀️', cal: todayTotals.lunch },
    { type: 'dinner',    label: 'Dinner',    emoji: '🌙', cal: todayTotals.dinner },
    { type: 'snacks',    label: 'Snacks',    emoji: '🍎', cal: todayTotals.snacks },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-sm text-dark-100 flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(getTodayKey())}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {getGreeting()},{' '}
            <span className="text-neon">{profile.name}</span> 👋
          </h1>
        </div>

        <NeonButton
          onClick={() => openModal()}
          variant="primary"
          size="md"
          icon={<Plus size={16} />}
        >
          Log Food
        </NeonButton>
      </motion.div>

      {/* Status Banner */}
      {todayTotals.calories > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border"
          style={{
            background: `${status.color}10`,
            borderColor: `${status.color}30`,
          }}
        >
          <Flame size={16} style={{ color: status.color }} />
          <span className="text-sm font-medium" style={{ color: status.color }}>
            Status: {status.label}
          </span>
          <span className="text-sm text-dark-100 ml-auto">
            {Math.round((todayTotals.calories / goals.calories) * 100)}% of daily goal
          </span>
        </motion.div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="lg:col-span-1 bg-dark-800 border border-dark-500/50 rounded-2xl p-6 flex flex-col items-center"
          style={{ background: 'radial-gradient(ellipse at center, rgba(57,255,20,0.06) 0%, transparent 65%), #111111' }}
        >
          <p className="text-xs text-dark-100 uppercase tracking-widest mb-4">Today's Progress</p>
          <CalorieRing
            consumed={todayTotals.calories}
            goal={goals.calories}
            remaining={remaining}
          />

          <div className="w-full mt-6 grid grid-cols-2 gap-3">
            {[
              { label: 'Consumed', value: todayTotals.calories, color: '#FF6B00' },
              { label: 'Remaining', value: remaining, color: '#39FF14' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-dark-700/50 rounded-xl p-3 text-center border border-dark-500/30"
              >
                <p className="text-xs text-dark-100 mb-1">{item.label}</p>
                <p className="text-lg font-bold" style={{ color: item.color }}>
                  {item.value.toLocaleString()}
                </p>
                <p className="text-xs text-dark-300">kcal</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Macros */}
          <div>
            <p className="text-xs text-dark-100 uppercase tracking-widest mb-3">Macronutrients</p>
            <div className="grid grid-cols-3 gap-3">
              <MacroCard macro="protein" value={todayTotals.protein} goal={goals.protein} delay={0.2} />
              <MacroCard macro="carbs" value={todayTotals.carbs} goal={goals.carbs} delay={0.3} />
              <MacroCard macro="fat" value={todayTotals.fat} goal={goals.fat} delay={0.4} />
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <p className="text-xs text-dark-100 uppercase tracking-widest mb-3">Quick Stats</p>
            <QuickStats
              streak={streak}
              totalFoods={totalFoodsLogged}
              todayWater={todayWater}
              waterGoal={goals.water || 2.0}
            />
          </div>
        </div>
      </div>

      {/* Nutrient Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(167,139,250,0.05) 0%, transparent 50%), #111111' }}
      >
        <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <TrendingUp size={18} className="text-neon" />
          Nutrient Breakdown
        </h3>

        <div className="space-y-4">
          {/* Calories */}
          <NutrientBar
            label="Calories"
            value={todayTotals.calories}
            goal={goals.calories}
            unit=" kcal"
            color="#39FF14"
            tooltip={NUTRIENT_TOOLTIPS.calories}
          />

          {/* Protein */}
          <NutrientBar
            label="Protein"
            value={todayTotals.protein}
            goal={goals.protein}
            unit="g"
            color="#00D4FF"
            tooltip={NUTRIENT_TOOLTIPS.protein}
          />

          {/* Carbs */}
          <NutrientBar
            label="Carbohydrates"
            value={todayTotals.carbs}
            goal={goals.carbs}
            unit="g"
            color="#FFD60A"
            tooltip={NUTRIENT_TOOLTIPS.carbs}
          />

          {/* Fat section */}
          <div className="space-y-2">
            <NutrientBar
              label="Total Fat"
              value={todayTotals.fat}
              goal={goals.fat}
              unit="g"
              color="#FF6B00"
              tooltip={NUTRIENT_TOOLTIPS.fat}
            />
            {/* Sub-items */}
            <div className="space-y-2 mt-1">
              <NutrientBar
                label="Saturated Fat"
                value={todayTotals.saturatedFat}
                goal={goals.saturatedFat || 20}
                unit="g"
                color="#FF8C00"
                tooltip={NUTRIENT_TOOLTIPS.saturatedFat}
                indent
              />
              <NutrientBar
                label="Trans Fat"
                value={todayTotals.transFat}
                goal={goals.transFat || 2}
                unit="g"
                color="#FF4500"
                tooltip={NUTRIENT_TOOLTIPS.transFat}
                indent
              />
            </div>
          </div>

          {/* Sodium */}
          <NutrientBar
            label="Sodium"
            value={todayTotals.sodium}
            goal={goals.sodium || 2300}
            unit="mg"
            color="#A78BFA"
            tooltip={NUTRIENT_TOOLTIPS.sodium}
          />
        </div>
      </motion.div>

      {/* Meal Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-neon" />
            Meal Summary
          </h3>
          <button
            onClick={() => openModal()}
            className="text-xs text-neon hover:text-neon-bright flex items-center gap-1 transition-colors"
          >
            <Plus size={12} /> Add Food
          </button>
        </div>

        <div className="space-y-3">
          {mealSummary.map(({ type, label, emoji, cal }) => (
            <div key={type}>
              <div className="flex items-center justify-between mb-1.5">
                <button
                  onClick={() => openModal(type)}
                  className="flex items-center gap-2 text-sm text-dark-100 hover:text-white transition-colors"
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                  <Plus size={12} className="text-dark-300" />
                </button>
                <span className="text-sm font-semibold text-white">
                  {cal} <span className="text-dark-300 font-normal text-xs">kcal</span>
                </span>
              </div>
              <ProgressBar
                value={cal}
                max={goals.calories / 4}
                color="auto"
                height="h-1.5"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Water Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-dark-800 border border-dark-500/50 rounded-2xl p-6"
        style={{ background: 'radial-gradient(ellipse at bottom right, rgba(0,212,255,0.05) 0%, transparent 50%), #111111' }}
      >
        <WaterTracker
          liters={todayWater}
          goal={goals.water || 2.0}
          onAdd={addWaterAmount}
          onRemove={removeWaterAmount}
        />
      </motion.div>

      <AddFoodModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddFood}
        defaultMealType={defaultMealType}
      />
    </div>
  );
}
