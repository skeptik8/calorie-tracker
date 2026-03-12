import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Search, Zap, Trash2, ChevronLeft, Star } from 'lucide-react';
import NeonButton from '../UI/NeonButton';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { generateId } from '../../utils/calculations';

const COMMON_FOODS = [
  { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, saturatedFat: 0.1, transFat: 0, sodium: 1 },
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, saturatedFat: 0, transFat: 0, sodium: 1 },
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, saturatedFat: 1, transFat: 0, sodium: 74 },
  { name: 'Brown Rice (cooked, 100g)', calories: 112, protein: 2.6, carbs: 23.5, fat: 0.9, saturatedFat: 0.2, transFat: 0, sodium: 5 },
  { name: 'Egg (large)', calories: 72, protein: 6, carbs: 0.4, fat: 5, saturatedFat: 1.6, transFat: 0, sodium: 71 },
  { name: 'Greek Yogurt (100g)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, saturatedFat: 0.1, transFat: 0, sodium: 36 },
  { name: 'Avocado (half)', calories: 161, protein: 2, carbs: 9, fat: 15, saturatedFat: 2.1, transFat: 0, sodium: 7 },
  { name: 'Oatmeal (100g dry)', calories: 389, protein: 17, carbs: 66, fat: 7, saturatedFat: 1.2, transFat: 0, sodium: 6 },
  { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13, saturatedFat: 3, transFat: 0, sodium: 59 },
  { name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fat: 14, saturatedFat: 1.1, transFat: 0, sodium: 1 },
  { name: 'Broccoli (100g)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, saturatedFat: 0.1, transFat: 0, sodium: 33 },
  { name: 'Sweet Potato (medium)', calories: 103, protein: 2.3, carbs: 24, fat: 0.1, saturatedFat: 0, transFat: 0, sodium: 41 },
];

const MEAL_TYPES = [
  { value: 'breakfast', label: '🌅 Breakfast' },
  { value: 'lunch', label: '☀️ Lunch' },
  { value: 'dinner', label: '🌙 Dinner' },
  { value: 'snacks', label: '🍎 Snacks' },
];

const DEFAULT_FORM = {
  name: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  saturatedFat: '',
  transFat: '',
  sodium: '',
  mealType: 'breakfast',
};

const DEFAULT_QUICK_FORM = {
  name: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  saturatedFat: '',
  transFat: '',
  sodium: '',
};

export default function AddFoodModal({ isOpen, onClose, onAdd, defaultMealType = 'breakfast' }) {
  const [form, setForm] = useState({ ...DEFAULT_FORM, mealType: defaultMealType });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('custom'); // 'custom' | 'myfoods' | 'common'
  const [errors, setErrors] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [quickForm, setQuickForm] = useState({ ...DEFAULT_QUICK_FORM });
  const [quickErrors, setQuickErrors] = useState({});
  const [justAdded, setJustAdded] = useState(null);

  const [savedFoods, setSavedFoods] = useLocalStorage('nutricore-quick-foods', []);

  const filteredCommon = COMMON_FOODS.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredSaved = savedFoods.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleQuickFormChange = (field, value) => {
    setQuickForm((prev) => ({ ...prev, [field]: value }));
    if (quickErrors[field]) setQuickErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Food name is required';
    if (!form.calories || isNaN(Number(form.calories)) || Number(form.calories) < 0) {
      newErrors.calories = 'Valid calorie amount required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateQuickForm = () => {
    const newErrors = {};
    if (!quickForm.name.trim()) newErrors.name = 'Food name is required';
    if (!quickForm.calories || isNaN(Number(quickForm.calories)) || Number(quickForm.calories) < 0) {
      newErrors.calories = 'Valid calorie amount required';
    }
    setQuickErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd(form);
    setForm({ ...DEFAULT_FORM, mealType: form.mealType });
    setErrors({});
  };

  const handleQuickAdd = (food) => {
    onAdd({ ...food, mealType: form.mealType });
    setJustAdded(food.id || food.name);
    setTimeout(() => setJustAdded(null), 1000);
  };

  const handleSaveQuickFood = () => {
    if (!validateQuickForm()) return;
    const newFood = {
      id: generateId(),
      name: quickForm.name.trim(),
      calories: Number(quickForm.calories) || 0,
      protein: Number(quickForm.protein) || 0,
      carbs: Number(quickForm.carbs) || 0,
      fat: Number(quickForm.fat) || 0,
      saturatedFat: Number(quickForm.saturatedFat) || 0,
      transFat: Number(quickForm.transFat) || 0,
      sodium: Number(quickForm.sodium) || 0,
      createdAt: new Date().toISOString(),
    };
    setSavedFoods((prev) => [...prev, newFood]);
    setQuickForm({ ...DEFAULT_QUICK_FORM });
    setQuickErrors({});
    setShowCreateForm(false);
  };

  const handleDeleteSaved = (id, e) => {
    e.stopPropagation();
    setSavedFoods((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClose = () => {
    setForm({ ...DEFAULT_FORM, mealType: defaultMealType });
    setErrors({});
    setSearchQuery('');
    setShowCreateForm(false);
    setQuickForm({ ...DEFAULT_QUICK_FORM });
    setQuickErrors({});
    onClose();
  };

  const tabs = [
    { id: 'custom', label: 'Custom Entry' },
    { id: 'myfoods', label: 'My Foods' },
    { id: 'common', label: 'Common' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-lg bg-dark-800 border border-dark-500/50 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
              style={{ background: 'radial-gradient(ellipse at top, rgba(57,255,20,0.05) 0%, transparent 50%), #111111' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-dark-500/30">
                <div className="flex items-center gap-2.5">
                  {showCreateForm && activeTab === 'myfoods' ? (
                    <button
                      onClick={() => { setShowCreateForm(false); setQuickForm({ ...DEFAULT_QUICK_FORM }); setQuickErrors({}); }}
                      className="w-8 h-8 bg-dark-700 border border-dark-500 rounded-lg flex items-center justify-center text-dark-100 hover:text-white hover:border-dark-300 transition-all"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  ) : (
                    <div className="w-8 h-8 bg-neon/10 border border-neon/30 rounded-lg flex items-center justify-center">
                      <Plus size={16} className="text-neon" />
                    </div>
                  )}
                  <h2 className="text-lg font-bold text-white">
                    {showCreateForm && activeTab === 'myfoods' ? 'Create Quick Food' : 'Add Food'}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 bg-dark-700 border border-dark-500 rounded-lg flex items-center justify-center text-dark-100 hover:text-white hover:border-dark-300 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Meal Type Selector */}
              <div className="p-4 border-b border-dark-500/30">
                <p className="text-xs text-dark-100 uppercase tracking-widest mb-2">Meal Type</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {MEAL_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleChange('mealType', type.value)}
                      className={`py-2 px-1 rounded-lg text-xs font-medium transition-all duration-150 ${
                        form.mealType === type.value
                          ? 'bg-neon/15 border border-neon/40 text-neon'
                          : 'bg-dark-700 border border-dark-500 text-dark-100 hover:border-dark-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-dark-500/30">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setShowCreateForm(false); setSearchQuery(''); }}
                    className={`flex-1 py-3 text-sm font-medium transition-all duration-150 relative ${
                      activeTab === tab.id ? 'text-neon' : 'text-dark-100 hover:text-white'
                    }`}
                  >
                    {tab.label}
                    {tab.id === 'myfoods' && savedFoods.length > 0 && (
                      <span className="ml-1 text-xs bg-neon/20 text-neon rounded-full px-1.5 py-0.5">
                        {savedFoods.length}
                      </span>
                    )}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="modal-tab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon"
                        style={{ boxShadow: '0 0 8px #39FF14' }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {/* ── CUSTOM ENTRY ── */}
                {activeTab === 'custom' && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Food name */}
                    <div>
                      <label className="block text-xs text-dark-100 uppercase tracking-widest mb-1.5">
                        Food Name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="e.g. Grilled Chicken Breast"
                        className={`input-dark ${errors.name ? 'border-accent-red/60' : ''}`}
                      />
                      {errors.name && <p className="text-accent-red text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Calories */}
                    <div>
                      <label className="block text-xs text-dark-100 uppercase tracking-widest mb-1.5">
                        Calories *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={form.calories}
                        onChange={(e) => handleChange('calories', e.target.value)}
                        placeholder="e.g. 350"
                        className={`input-dark ${errors.calories ? 'border-accent-red/60' : ''}`}
                      />
                      {errors.calories && <p className="text-accent-red text-xs mt-1">{errors.calories}</p>}
                    </div>

                    {/* Macros */}
                    <div>
                      <p className="text-xs text-dark-100 uppercase tracking-widest mb-1.5">
                        Macronutrients <span className="text-dark-300 normal-case">(optional)</span>
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { field: 'protein', label: 'Protein (g)', color: '#00D4FF' },
                          { field: 'carbs',   label: 'Carbs (g)',   color: '#FFD60A' },
                          { field: 'fat',     label: 'Total Fat (g)', color: '#FF6B00' },
                        ].map(({ field, label, color }) => (
                          <div key={field}>
                            <label className="block text-xs mb-1" style={{ color }}>{label}</label>
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={form[field]}
                              onChange={(e) => handleChange(field, e.target.value)}
                              placeholder="0"
                              className="input-dark text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fat breakdown */}
                    <div>
                      <p className="text-xs text-dark-100 uppercase tracking-widest mb-1.5">
                        Fat Breakdown <span className="text-dark-300 normal-case">(optional)</span>
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { field: 'saturatedFat', label: 'Saturated Fat (g)', color: '#FF8C00' },
                          { field: 'transFat',     label: 'Trans Fat (g)',     color: '#FF4500' },
                        ].map(({ field, label, color }) => (
                          <div key={field}>
                            <label className="block text-xs mb-1" style={{ color }}>{label}</label>
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={form[field]}
                              onChange={(e) => handleChange(field, e.target.value)}
                              placeholder="0"
                              className="input-dark text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sodium */}
                    <div>
                      <label
                        className="block text-xs text-dark-100 uppercase tracking-widest mb-1.5"
                        title="Sodium — total salt intake in milligrams"
                      >
                        Sodium (mg) <span className="text-dark-300 normal-case">(optional)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={form.sodium}
                        onChange={(e) => handleChange('sodium', e.target.value)}
                        placeholder="e.g. 400"
                        className="input-dark"
                      />
                    </div>

                    {/* Preview */}
                    {(form.protein || form.carbs || form.fat) ? (
                      <div className="bg-dark-700 rounded-xl p-3 border border-dark-500/50">
                        <p className="text-xs text-dark-100 mb-2">Macro Breakdown</p>
                        <div className="flex gap-3 text-xs flex-wrap">
                          {form.protein && (
                            <span style={{ color: '#00D4FF' }}>
                              P: {form.protein}g ({Math.round(form.protein * 4)} kcal)
                            </span>
                          )}
                          {form.carbs && (
                            <span style={{ color: '#FFD60A' }}>
                              C: {form.carbs}g ({Math.round(form.carbs * 4)} kcal)
                            </span>
                          )}
                          {form.fat && (
                            <span style={{ color: '#FF6B00' }}>
                              F: {form.fat}g ({Math.round(form.fat * 9)} kcal)
                            </span>
                          )}
                        </div>
                      </div>
                    ) : null}

                    <NeonButton type="submit" variant="primary" fullWidth size="lg" icon={<Zap size={16} />}>
                      Log Food
                    </NeonButton>
                  </form>
                )}

                {/* ── MY FOODS ── */}
                {activeTab === 'myfoods' && !showCreateForm && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-dark-200">
                        {savedFoods.length > 0 ? `${savedFoods.length} saved food${savedFoods.length !== 1 ? 's' : ''}` : 'No saved foods yet'}
                      </p>
                      <motion.button
                        onClick={() => setShowCreateForm(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neon border border-neon/30 bg-neon/10 hover:bg-neon/20 transition-all"
                      >
                        <Plus size={12} />
                        Create Food
                      </motion.button>
                    </div>

                    {savedFoods.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-16 h-16 bg-neon/5 border border-neon/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Star size={24} className="text-neon/40" />
                        </div>
                        <p className="text-white font-semibold mb-1">No quick foods saved</p>
                        <p className="text-dark-200 text-sm mb-4">Create your own quick-add foods for instant logging</p>
                        <motion.button
                          onClick={() => setShowCreateForm(true)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-4 py-2 rounded-xl text-sm font-semibold text-neon border border-neon/30 bg-neon/10 hover:bg-neon/20 transition-all"
                        >
                          Create Your First Food
                        </motion.button>
                      </motion.div>
                    ) : (
                      <>
                        {/* Search */}
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-200" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search my foods..."
                            className="input-dark pl-9"
                          />
                        </div>

                        {/* Cards grid */}
                        <div className="grid grid-cols-2 gap-2">
                          {filteredSaved.map((food) => {
                            const isJustAdded = justAdded === food.id;
                            return (
                              <motion.div
                                key={food.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className="relative group cursor-pointer p-3 rounded-xl border transition-all duration-200"
                                style={{
                                  backgroundColor: isJustAdded ? 'rgba(57,255,20,0.12)' : '#1a1a1a',
                                  borderColor: isJustAdded ? 'rgba(57,255,20,0.5)' : '#2a2a2a',
                                }}
                                onClick={() => handleQuickAdd(food)}
                              >
                                {/* Delete button */}
                                <button
                                  onClick={(e) => handleDeleteSaved(food.id, e)}
                                  className="absolute top-2 right-2 w-5 h-5 rounded-md bg-dark-600 border border-dark-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:border-red-500/40"
                                >
                                  <Trash2 size={10} className="text-dark-200 hover:text-red-400" />
                                </button>

                                <p className="text-sm font-semibold text-white mb-1 pr-5 leading-tight">{food.name}</p>
                                <p className="text-xl font-bold text-neon">{food.calories}</p>
                                <p className="text-xs text-dark-300 mb-1.5">kcal</p>
                                <div className="flex gap-1.5 text-xs flex-wrap">
                                  <span style={{ color: '#00D4FF' }}>P:{food.protein}g</span>
                                  <span style={{ color: '#FFD60A' }}>C:{food.carbs}g</span>
                                  <span style={{ color: '#FF6B00' }}>F:{food.fat}g</span>
                                </div>
                                {food.sodium > 0 && (
                                  <p className="text-xs text-dark-300 mt-0.5">{food.sodium}mg Na</p>
                                )}

                                {/* Added flash */}
                                <AnimatePresence>
                                  {isJustAdded && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      className="absolute inset-0 rounded-xl flex items-center justify-center"
                                      style={{ backgroundColor: 'rgba(57,255,20,0.15)' }}
                                    >
                                      <span className="text-neon font-bold text-sm">Added!</span>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            );
                          })}
                        </div>

                        {filteredSaved.length === 0 && searchQuery && (
                          <p className="text-center text-dark-200 py-6 text-sm">No foods match your search.</p>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* ── CREATE QUICK FOOD FORM ── */}
                {activeTab === 'myfoods' && showCreateForm && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-dark-100 uppercase tracking-widest mb-1.5">
                        Food Name *
                      </label>
                      <input
                        type="text"
                        value={quickForm.name}
                        onChange={(e) => handleQuickFormChange('name', e.target.value)}
                        placeholder="e.g. Protein Bar"
                        className={`input-dark ${quickErrors.name ? 'border-accent-red/60' : ''}`}
                        autoFocus
                      />
                      {quickErrors.name && <p className="text-accent-red text-xs mt-1">{quickErrors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs text-dark-100 uppercase tracking-widest mb-1.5">
                        Calories *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={quickForm.calories}
                        onChange={(e) => handleQuickFormChange('calories', e.target.value)}
                        placeholder="e.g. 220"
                        className={`input-dark ${quickErrors.calories ? 'border-accent-red/60' : ''}`}
                      />
                      {quickErrors.calories && <p className="text-accent-red text-xs mt-1">{quickErrors.calories}</p>}
                    </div>

                    <div>
                      <p className="text-xs text-dark-100 uppercase tracking-widest mb-1.5">
                        Macronutrients <span className="text-dark-300 normal-case">(optional)</span>
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { field: 'protein', label: 'Protein (g)', color: '#00D4FF' },
                          { field: 'carbs',   label: 'Carbs (g)',   color: '#FFD60A' },
                          { field: 'fat',     label: 'Total Fat (g)', color: '#FF6B00' },
                        ].map(({ field, label, color }) => (
                          <div key={field}>
                            <label className="block text-xs mb-1" style={{ color }}>{label}</label>
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={quickForm[field]}
                              onChange={(e) => handleQuickFormChange(field, e.target.value)}
                              placeholder="0"
                              className="input-dark text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-dark-100 uppercase tracking-widest mb-1.5">
                        Fat Breakdown <span className="text-dark-300 normal-case">(optional)</span>
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { field: 'saturatedFat', label: 'Saturated Fat (g)', color: '#FF8C00' },
                          { field: 'transFat',     label: 'Trans Fat (g)',     color: '#FF4500' },
                        ].map(({ field, label, color }) => (
                          <div key={field}>
                            <label className="block text-xs mb-1" style={{ color }}>{label}</label>
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={quickForm[field]}
                              onChange={(e) => handleQuickFormChange(field, e.target.value)}
                              placeholder="0"
                              className="input-dark text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-xs text-dark-100 uppercase tracking-widest mb-1.5"
                        title="Sodium — total salt intake in milligrams"
                      >
                        Sodium (mg) <span className="text-dark-300 normal-case">(optional)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={quickForm.sodium}
                        onChange={(e) => handleQuickFormChange('sodium', e.target.value)}
                        placeholder="e.g. 400"
                        className="input-dark"
                      />
                    </div>

                    <NeonButton
                      onClick={handleSaveQuickFood}
                      variant="primary"
                      fullWidth
                      size="lg"
                      icon={<Star size={16} />}
                    >
                      Save Quick Food
                    </NeonButton>
                  </div>
                )}

                {/* ── COMMON FOODS ── */}
                {activeTab === 'common' && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-200" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search common foods..."
                        className="input-dark pl-9"
                      />
                    </div>

                    <div className="space-y-2">
                      {filteredCommon.map((food) => {
                        const isJustAdded = justAdded === food.name;
                        return (
                          <motion.button
                            key={food.name}
                            onClick={() => handleQuickAdd(food)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-between p-3 border rounded-xl hover:bg-neon/5 transition-all duration-150 text-left"
                            style={{
                              backgroundColor: isJustAdded ? 'rgba(57,255,20,0.1)' : '#1a1a1a',
                              borderColor: isJustAdded ? 'rgba(57,255,20,0.4)' : '#2a2a2a',
                            }}
                          >
                            <div>
                              <p className="text-sm font-medium text-white">{food.name}</p>
                              <div className="flex gap-3 mt-0.5 text-xs text-dark-200">
                                <span style={{ color: '#00D4FF' }}>P: {food.protein}g</span>
                                <span style={{ color: '#FFD60A' }}>C: {food.carbs}g</span>
                                <span style={{ color: '#FF6B00' }}>F: {food.fat}g</span>
                                {food.sodium > 0 && <span className="text-dark-300">{food.sodium}mg Na</span>}
                              </div>
                            </div>
                            <div className="text-right ml-3">
                              <span className="text-sm font-bold text-neon">{food.calories}</span>
                              <p className="text-xs text-dark-200">kcal</p>
                            </div>
                          </motion.button>
                        );
                      })}
                      {filteredCommon.length === 0 && (
                        <p className="text-center text-dark-200 py-8 text-sm">
                          No foods found. Try a custom entry.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
