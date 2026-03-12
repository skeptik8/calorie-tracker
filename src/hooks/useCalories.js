import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { getTodayKey, getLast7Days } from '../utils/dateUtils';
import {
  calcTotalCalories,
  calcTotalMacro,
  calcMealTypeCalories,
  generateId,
} from '../utils/calculations';

const DEFAULT_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
  saturatedFat: 20,
  transFat: 2,
  sodium: 2300,
  water: 2.0, // liters
};

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snacks'];

export function useCalories() {
  // All daily logs indexed by date string
  const [logs, setLogs] = useLocalStorage('nutricore-logs', {});
  // User goals
  const [goals, setGoals] = useLocalStorage('nutricore-goals', DEFAULT_GOALS);
  // User profile
  const [profile, setProfile] = useLocalStorage('nutricore-profile', {
    name: 'User',
    weight: 70,
    height: 175,
    age: 25,
    gender: 'male',
    activityLevel: 'moderately_active',
  });
  // User-created quick add foods
  const [quickFoods, setQuickFoods] = useLocalStorage('nutricore-quick-foods', []);

  const today = getTodayKey();

  // Get or create today's log
  const todayLog = useMemo(() => {
    return logs[today] || { meals: [], water: 0, date: today };
  }, [logs, today]);

  const todayMeals = todayLog.meals || [];
  const todayWater = todayLog.water || 0;

  // Computed totals for today
  const todayTotals = useMemo(() => ({
    calories: calcTotalCalories(todayMeals),
    protein: Math.round(calcTotalMacro(todayMeals, 'protein') * 10) / 10,
    carbs: Math.round(calcTotalMacro(todayMeals, 'carbs') * 10) / 10,
    fat: Math.round(calcTotalMacro(todayMeals, 'fat') * 10) / 10,
    saturatedFat: Math.round(calcTotalMacro(todayMeals, 'saturatedFat') * 10) / 10,
    transFat: Math.round(calcTotalMacro(todayMeals, 'transFat') * 10) / 10,
    sodium: Math.round(calcTotalMacro(todayMeals, 'sodium')),
    breakfast: calcMealTypeCalories(todayMeals, 'breakfast'),
    lunch: calcMealTypeCalories(todayMeals, 'lunch'),
    dinner: calcMealTypeCalories(todayMeals, 'dinner'),
    snacks: calcMealTypeCalories(todayMeals, 'snacks'),
  }), [todayMeals]);

  // Helper: update a specific day's log
  const updateDayLog = useCallback((date, updater) => {
    setLogs((prev) => {
      const existing = prev[date] || { meals: [], water: 0, date };
      return {
        ...prev,
        [date]: updater(existing),
      };
    });
  }, [setLogs]);

  // Add a food item to today
  const addFood = useCallback((foodData) => {
    const newFood = {
      id: generateId(),
      name: foodData.name.trim(),
      calories: Number(foodData.calories) || 0,
      protein: Number(foodData.protein) || 0,
      carbs: Number(foodData.carbs) || 0,
      fat: Number(foodData.fat) || 0,
      saturatedFat: Number(foodData.saturatedFat) || 0,
      transFat: Number(foodData.transFat) || 0,
      sodium: Number(foodData.sodium) || 0,
      mealType: foodData.mealType || 'breakfast',
      addedAt: new Date().toISOString(),
    };

    updateDayLog(today, (log) => ({
      ...log,
      meals: [...log.meals, newFood],
    }));

    return newFood;
  }, [today, updateDayLog]);

  // Remove a food item from today
  const removeFood = useCallback((foodId) => {
    updateDayLog(today, (log) => ({
      ...log,
      meals: log.meals.filter((m) => m.id !== foodId),
    }));
  }, [today, updateDayLog]);

  // Update water intake for today (in liters)
  const setWater = useCallback((liters) => {
    const clamped = Math.max(0, Math.min(10, Math.round(liters * 100) / 100));
    updateDayLog(today, (log) => ({ ...log, water: clamped }));
  }, [today, updateDayLog]);

  const addWaterAmount = useCallback((amount) => {
    updateDayLog(today, (log) => ({
      ...log,
      water: Math.min(10, Math.round(((log.water || 0) + amount) * 100) / 100),
    }));
  }, [today, updateDayLog]);

  const removeWaterAmount = useCallback((amount = 0.25) => {
    updateDayLog(today, (log) => ({
      ...log,
      water: Math.max(0, Math.round(((log.water || 0) - amount) * 100) / 100),
    }));
  }, [today, updateDayLog]);

  // Quick Add food management
  const saveQuickFood = useCallback((foodData) => {
    const newFood = {
      id: generateId(),
      name: foodData.name.trim(),
      calories: Number(foodData.calories) || 0,
      protein: Number(foodData.protein) || 0,
      carbs: Number(foodData.carbs) || 0,
      fat: Number(foodData.fat) || 0,
      saturatedFat: Number(foodData.saturatedFat) || 0,
      transFat: Number(foodData.transFat) || 0,
      sodium: Number(foodData.sodium) || 0,
      createdAt: new Date().toISOString(),
    };
    setQuickFoods((prev) => [...prev, newFood]);
    return newFood;
  }, [setQuickFoods]);

  const deleteQuickFood = useCallback((id) => {
    setQuickFoods((prev) => prev.filter((f) => f.id !== id));
  }, [setQuickFoods]);

  // Update goals
  const updateGoals = useCallback((newGoals) => {
    setGoals((prev) => ({ ...prev, ...newGoals }));
  }, [setGoals]);

  // Update profile
  const updateProfile = useCallback((newProfile) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  }, [setProfile]);

  // Get meals filtered by type
  const getMealsByType = useCallback((type) => {
    return todayMeals.filter((m) => m.mealType === type);
  }, [todayMeals]);

  // Get last 7 days data for charts
  const weeklyData = useMemo(() => {
    const days = getLast7Days();
    return days.map((date) => {
      const log = logs[date] || { meals: [], water: 0 };
      const meals = log.meals || [];
      return {
        date,
        calories: calcTotalCalories(meals),
        protein: Math.round(calcTotalMacro(meals, 'protein')),
        carbs: Math.round(calcTotalMacro(meals, 'carbs')),
        fat: Math.round(calcTotalMacro(meals, 'fat')),
        sodium: Math.round(calcTotalMacro(meals, 'sodium')),
        water: log.water || 0,
        goal: goals.calories,
      };
    });
  }, [logs, goals.calories]);

  // Streak calculation
  const streak = useMemo(() => {
    let count = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      const log = logs[key];
      if (log && log.meals && log.meals.length > 0) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return count;
  }, [logs]);

  // Total foods logged ever
  const totalFoodsLogged = useMemo(() => {
    return Object.values(logs).reduce((sum, log) => {
      return sum + (log.meals ? log.meals.length : 0);
    }, 0);
  }, [logs]);

  // Clear today's data
  const clearToday = useCallback(() => {
    updateDayLog(today, () => ({ meals: [], water: 0, date: today }));
  }, [today, updateDayLog]);

  return {
    // State
    logs,
    goals,
    profile,
    quickFoods,
    today,
    todayMeals,
    todayWater,
    todayTotals,
    weeklyData,
    streak,
    totalFoodsLogged,
    MEAL_TYPES,

    // Actions
    addFood,
    removeFood,
    setWater,
    addWaterAmount,
    removeWaterAmount,
    saveQuickFood,
    deleteQuickFood,
    updateGoals,
    updateProfile,
    getMealsByType,
    clearToday,
  };
}
