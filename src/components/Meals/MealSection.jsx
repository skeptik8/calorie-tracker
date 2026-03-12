import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import FoodItem from './FoodItem';

const MEAL_CONFIG = {
  breakfast: {
    label: 'Breakfast',
    emoji: '🌅',
    color: '#FFD60A',
    description: 'Start your day right',
  },
  lunch: {
    label: 'Lunch',
    emoji: '☀️',
    color: '#39FF14',
    description: 'Midday fuel',
  },
  dinner: {
    label: 'Dinner',
    emoji: '🌙',
    color: '#BD00FF',
    description: 'Evening meal',
  },
  snacks: {
    label: 'Snacks',
    emoji: '🍎',
    color: '#FF6B00',
    description: 'Between meals',
  },
};

export default function MealSection({ type, foods = [], totalCalories, onAdd, onRemove, delay = 0 }) {
  const [expanded, setExpanded] = useState(true);
  const config = MEAL_CONFIG[type] || MEAL_CONFIG.breakfast;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-dark-800 border border-dark-500/50 rounded-2xl overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at top right, ${config.color}08 0%, transparent 50%), #111111`,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.emoji}</span>
          <div className="text-left">
            <p className="font-semibold text-white">{config.label}</p>
            <p className="text-xs text-dark-100">{config.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span
              className="text-lg font-bold"
              style={{ color: config.color }}
            >
              {totalCalories}
            </span>
            <span className="text-xs text-dark-200 ml-1">kcal</span>
          </div>
          <div className="text-dark-300">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </button>

      {/* Foods list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-4 space-y-2 border-t border-dark-500/30 pt-3">
              <AnimatePresence mode="popLayout">
                {foods.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-dark-200 text-sm py-4"
                  >
                    No foods logged yet
                  </motion.p>
                ) : (
                  foods.map((food, i) => (
                    <FoodItem
                      key={food.id}
                      food={food}
                      onRemove={onRemove}
                      index={i}
                    />
                  ))
                )}
              </AnimatePresence>

              {/* Add button */}
              <motion.button
                onClick={onAdd}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 mt-1 rounded-xl border border-dashed text-sm font-medium transition-all duration-150 hover:bg-white/5"
                style={{
                  borderColor: `${config.color}30`,
                  color: `${config.color}80`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${config.color}60`;
                  e.currentTarget.style.color = config.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${config.color}30`;
                  e.currentTarget.style.color = `${config.color}80`;
                }}
              >
                <Plus size={15} />
                Add to {config.label}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
