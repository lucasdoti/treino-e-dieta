import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  EXERCISES: '@treino-e-dieta/exercises',
  WORKOUT_TEMPLATES: '@treino-e-dieta/workoutTemplates',
  WORKOUT_LOGS: '@treino-e-dieta/workoutLogs',
  FOODS: '@treino-e-dieta/foods',
  MEAL_LOGS: '@treino-e-dieta/mealLogs',
  BODY_WEIGHT_LOGS: '@treino-e-dieta/bodyWeightLogs',
  PROFILE: '@treino-e-dieta/profile',
};

export async function getCollection(key) {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveCollection(key, items) {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

export async function getObject(key, fallback) {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

export async function saveObject(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
