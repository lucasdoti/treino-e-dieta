// Cálculos nutricionais compartilhados entre o diário e os cardápios.

export function toGrams(value) {
  return parseFloat(String(value).replace(',', '.')) || 0;
}

// Macros de uma porção (grams) de um alimento cujos valores são por 100g.
export function computeItemMacros(food, grams) {
  const factor = toGrams(grams) / 100;
  return {
    calories: Math.round((food?.caloriesPer100 ?? 0) * factor),
    protein: Math.round((food?.proteinPer100 ?? 0) * factor),
    carbs: Math.round((food?.carbsPer100 ?? 0) * factor),
    fat: Math.round((food?.fatPer100 ?? 0) * factor),
  };
}

// Macro "definidor" de cada categoria — é ele que as substituições mantêm igual.
const CATEGORY_MAIN_MACRO = {
  proteina: 'protein',
  laticinio: 'protein',
  carboidrato: 'carbs',
  fruta: 'carbs',
  legume: 'carbs',
  gordura: 'fat',
};

const MACRO_FIELD = {
  protein: 'proteinPer100',
  carbs: 'carbsPer100',
  fat: 'fatPer100',
};

export function categoryMainMacro(category) {
  return CATEGORY_MAIN_MACRO[category] ?? null;
}

// Substituições equivalentes: outros alimentos da mesma categoria, com a porção
// ajustada para bater o mesmo tanto do macro principal (proteína↔proteína,
// carbo↔carbo, gordura↔gordura). Ordena pelas opções de caloria mais próxima.
export function computeSubstitutions(food, grams, allFoods, limit = 6) {
  const macro = categoryMainMacro(food?.category);
  const field = MACRO_FIELD[macro];
  if (!field) return [];

  const baseGrams = toGrams(grams);
  const targetMacroGrams = ((food[field] ?? 0) / 100) * baseGrams;
  if (targetMacroGrams <= 0) return [];

  const baseCalories = ((food.caloriesPer100 ?? 0) / 100) * baseGrams;

  return allFoods
    .filter((f) => f.category === food.category && f.id !== food.id && (f[field] ?? 0) > 0)
    .map((f) => {
      const gramsNeeded = (targetMacroGrams * 100) / f[field];
      const roundedGrams = Math.max(5, Math.round(gramsNeeded / 5) * 5);
      return { food: f, grams: roundedGrams, ...computeItemMacros(f, roundedGrams) };
    })
    .sort((a, b) => Math.abs(a.calories - baseCalories) - Math.abs(b.calories - baseCalories))
    .slice(0, limit);
}
