export const ACTIVITY_LEVELS = [
  { key: 'sedentario', label: 'Sedentário (pouco ou nenhum exercício)', factor: 1.2 },
  { key: 'leve', label: 'Leve (exercício 1-3x/semana)', factor: 1.375 },
  { key: 'moderado', label: 'Moderado (exercício 3-5x/semana)', factor: 1.55 },
  { key: 'intenso', label: 'Intenso (exercício 6-7x/semana)', factor: 1.725 },
];

export const GOALS = [
  { key: 'emagrecer', label: 'Emagrecer' },
  { key: 'manter', label: 'Manter o peso' },
  { key: 'ganhar_massa', label: 'Ganhar massa' },
];

// Mifflin-St Jeor
export function computeBMR({ weightKg, heightCm, age, sex }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'feminino' ? base - 161 : base + 5;
}

export function computeTDEE(bmr, activityKey) {
  const activity = ACTIVITY_LEVELS.find((a) => a.key === activityKey) ?? ACTIVITY_LEVELS[0];
  return bmr * activity.factor;
}

export function applyGoalAdjustment(tdee, goalKey) {
  if (goalKey === 'emagrecer') return tdee - 500;
  if (goalKey === 'ganhar_massa') return tdee + 400;
  return tdee;
}

export function computeMacroTargets(calories, weightKg) {
  const proteinG = Math.round(weightKg * 2);
  const proteinCal = proteinG * 4;
  const fatCal = calories * 0.25;
  const fatG = Math.round(fatCal / 9);
  const carbsCal = Math.max(calories - proteinCal - fatCal, 0);
  const carbsG = Math.round(carbsCal / 4);
  return { proteinG, fatG, carbsG };
}

export function generateGoal({ weightKg, heightCm, age, sex, activityKey, goalKey }) {
  const bmr = computeBMR({ weightKg, heightCm, age, sex });
  const tdee = computeTDEE(bmr, activityKey);
  const calories = Math.round(applyGoalAdjustment(tdee, goalKey));
  const macros = computeMacroTargets(calories, weightKg);
  return { calories, ...macros };
}
