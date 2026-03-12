export const calcTotalCalories = (meals) => {
  if (!meals || meals.length === 0) return 0;
  return meals.reduce((sum, meal) => sum + (Number(meal.calories) || 0), 0);
};

export const calcTotalMacro = (meals, macro) => {
  if (!meals || meals.length === 0) return 0;
  return meals.reduce((sum, meal) => sum + (Number(meal[macro]) || 0), 0);
};

export const calcCaloriesRemaining = (goal, consumed) => {
  return Math.max(0, goal - consumed);
};

export const calcCaloriesProgress = (consumed, goal) => {
  if (!goal) return 0;
  return Math.min(100, (consumed / goal) * 100);
};

export const calcMacroPercent = (meals) => {
  const protein = calcTotalMacro(meals, 'protein');
  const carbs = calcTotalMacro(meals, 'carbs');
  const fat = calcTotalMacro(meals, 'fat');

  const totalCalFromMacros = protein * 4 + carbs * 4 + fat * 9;

  if (totalCalFromMacros === 0) {
    return { protein: 0, carbs: 0, fat: 0 };
  }

  return {
    protein: Math.round((protein * 4 / totalCalFromMacros) * 100),
    carbs: Math.round((carbs * 4 / totalCalFromMacros) * 100),
    fat: Math.round((fat * 9 / totalCalFromMacros) * 100),
  };
};

export const getMealsByType = (meals, type) => {
  return meals.filter((meal) => meal.mealType === type);
};

export const calcMealTypeCalories = (meals, type) => {
  return calcTotalCalories(getMealsByType(meals, type));
};

export const calcBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return Math.round(88.362 + 13.397 * weight + 4.799 * height - 5.677 * age);
  }
  return Math.round(447.593 + 9.247 * weight + 3.098 * height - 4.330 * age);
};

export const calcTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.55));
};

export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return Math.round(num).toLocaleString();
};

export const clamp = (value, min, max) => {
  return Math.min(max, Math.max(min, value));
};

export const getCalorieStatus = (consumed, goal) => {
  const percent = (consumed / goal) * 100;
  if (percent < 50) return { label: 'On Track', color: '#39FF14' };
  if (percent < 85) return { label: 'Good', color: '#39FF14' };
  if (percent < 100) return { label: 'Almost Full', color: '#FFD60A' };
  if (percent <= 110) return { label: 'At Goal', color: '#FF6B00' };
  return { label: 'Over Goal', color: '#FF2D55' };
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
