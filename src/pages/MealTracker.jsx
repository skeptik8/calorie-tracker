import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, UtensilsCrossed, RotateCcw, AlertTriangle } from 'lucide-react';
import MealSection from '../components/Meals/MealSection';
import AddFoodModal from '../components/Meals/AddFoodModal';
import NeonButton from '../components/UI/NeonButton';
import { useCalories } from '../hooks/useCalories';
import { formatDate, getTodayKey } from '../utils/dateUtils';

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snacks'];

export default function MealTracker() {
  const {
    todayMeals,
    todayTotals,
    goals,
    addFood,
    removeFood,
    clearToday,
    getMealsByType,
  } = useCalories();

  const [modalOpen, setModalOpen] = useState(false);
  const [defaultMealType, setDefaultMealType] = useState('breakfast');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const openModal = (mealType = 'breakfast') => {
    setDefaultMealType(mealType);
    setModalOpen(true);
  };

  const handleAddFood = (foodData) => {
    addFood(foodData);
    setModalOpen(false);
  };

  const handleClear = () => {
    clearToday();
    setShowClearConfirm(false);
  };

  const totalMeals = todayMeals.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-sm text-dark-100">{formatDate(getTodayKey())}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 flex items-center gap-2">
            <UtensilsCrossed size={28} className="text-neon" />
            Meal Tracker
          </h1>
        </div>

        <div className="flex gap-2">
          {totalMeals > 0 && (
            <NeonButton
              onClick={() => setShowClearConfirm(true)}
              variant="ghost"
              size="md"
              icon={<RotateCcw size={15} />}
            >
              Clear Day
            </NeonButton>
          )}
          <NeonButton
            onClick={() => openModal()}
            variant="primary"
            size="md"
            icon={<Plus size={16} />}
          >
            Add Food
          </NeonButton>
        </div>
      </motion.div>

      {/* Daily Summary Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-800 border border-dark-500/50 rounded-2xl p-4"
        style={{ background: 'radial-gradient(ellipse at top, rgba(57,255,20,0.06) 0%, transparent 50%), #111111' }}
      >
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div className="flex flex-wrap gap-6">
            {[
              { label: 'Total Calories', value: `${todayTotals.calories} / ${goals.calories}`, color: '#39FF14' },
              { label: 'Protein', value: `${todayTotals.protein}g`, color: '#00D4FF' },
              { label: 'Carbs', value: `${todayTotals.carbs}g`, color: '#FFD60A' },
              { label: 'Fat', value: `${todayTotals.fat}g`, color: '#FF6B00' },
              { label: 'Sodium', value: `${todayTotals.sodium}mg`, color: '#A78BFA' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-dark-100">{item.label}</p>
                <p className="text-base font-bold" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="text-right">
            <p className="text-xs text-dark-100">Foods logged</p>
            <p className="text-2xl font-bold text-white">{totalMeals}</p>
          </div>
        </div>
      </motion.div>

      {/* Clear Confirmation */}
      {showClearConfirm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-dark-800 border border-accent-red/30 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle size={18} className="text-accent-red" />
            <p className="font-medium text-white">Clear all food entries for today?</p>
          </div>
          <p className="text-sm text-dark-100 mb-4">This action cannot be undone.</p>
          <div className="flex gap-2">
            <NeonButton onClick={() => setShowClearConfirm(false)} variant="ghost" size="sm">
              Cancel
            </NeonButton>
            <NeonButton onClick={handleClear} variant="danger" size="sm">
              Yes, clear all
            </NeonButton>
          </div>
        </motion.div>
      )}

      {/* Meal Sections */}
      <div className="space-y-4">
        {MEAL_ORDER.map((type, i) => (
          <MealSection
            key={type}
            type={type}
            foods={getMealsByType(type)}
            totalCalories={todayTotals[type] || 0}
            onAdd={() => openModal(type)}
            onRemove={removeFood}
            delay={i * 0.08}
          />
        ))}
      </div>

      {/* Empty State */}
      {totalMeals === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center py-12 bg-dark-800 border border-dark-500/50 border-dashed rounded-2xl"
        >
          <p className="text-4xl mb-4">🍽️</p>
          <h3 className="text-lg font-semibold text-white mb-2">No meals logged yet</h3>
          <p className="text-dark-100 text-sm mb-6">
            Start tracking your nutrition by adding your first meal
          </p>
          <NeonButton onClick={() => openModal()} variant="primary" icon={<Plus size={16} />}>
            Add Your First Meal
          </NeonButton>
        </motion.div>
      )}

      <AddFoodModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddFood}
        defaultMealType={defaultMealType}
      />
    </div>
  );
}
