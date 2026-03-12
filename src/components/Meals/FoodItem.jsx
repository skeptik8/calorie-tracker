import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function FoodItem({ food, onRemove, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
      className="group flex items-center justify-between p-3 bg-dark-700/50 border border-dark-500/30 rounded-xl hover:border-neon/20 hover:bg-dark-700 transition-all duration-200"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{food.name}</p>
        {(food.protein > 0 || food.carbs > 0 || food.fat > 0) && (
          <div className="flex gap-2 mt-0.5 text-xs">
            {food.protein > 0 && <span style={{ color: '#00D4FF' }}>P:{food.protein}g</span>}
            {food.carbs > 0 && <span style={{ color: '#FFD60A' }}>C:{food.carbs}g</span>}
            {food.fat > 0 && <span style={{ color: '#FF6B00' }}>F:{food.fat}g</span>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 ml-3">
        <span className="text-sm font-bold text-neon whitespace-nowrap">
          {food.calories} kcal
        </span>
        <motion.button
          onClick={() => onRemove(food.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-7 h-7 rounded-lg bg-transparent border border-transparent flex items-center justify-center text-dark-300 opacity-0 group-hover:opacity-100 hover:border-accent-red/40 hover:text-accent-red hover:bg-accent-red/10 transition-all duration-150"
        >
          <Trash2 size={13} />
        </motion.button>
      </div>
    </motion.div>
  );
}
