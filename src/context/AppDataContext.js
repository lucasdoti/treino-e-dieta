import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { KEYS, getCollection, saveCollection, getObject, saveObject } from '../storage/db';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { FOOD_LIBRARY } from '../data/foodLibrary';
import { computeItemMacros, toGrams } from '../utils/nutrition';
import { generateId } from '../utils/id';
import { useAuth } from './AuthContext';
import { isSupabaseConfigured } from '../config/supabase';
import { fetchCloudData, saveCloudData } from '../sync/cloudSync';

const DEFAULT_PROFILE = {
  name: '',
  heightCm: null,
  weightKg: null,
  birthDate: null,
  sex: 'masculino',
  activityKey: 'moderado',
  goalKey: 'manter',
  calorieMode: 'manual',
  calorieTarget: null,
  macroTargets: { proteinG: null, carbsG: null, fatG: null },
  weightFrequency: 'semanal',
  incrementUpperKg: 2.5,
  incrementLowerKg: 5,
  restSeconds: 90,
  waterGoalMl: 2500,
};

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [customExercises, setCustomExercises] = useState([]);
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [foods, setFoods] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [mealLogs, setMealLogs] = useState([]);
  const [waterLogs, setWaterLogs] = useState([]);
  const [bodyWeightLogs, setBodyWeightLogs] = useState([]);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  const { user } = useAuth();
  const hydratedRef = useRef(false); // já puxou/inicializou a nuvem?
  const skipNextPushRef = useRef(false); // evita reenviar logo após puxar
  const prevUserRef = useRef(null);

  useEffect(() => {
    (async () => {
      const [ex, tpl, wLogs, fd, mPlans, mLogs, water, bwLogs, prof] = await Promise.all([
        getCollection(KEYS.EXERCISES),
        getCollection(KEYS.WORKOUT_TEMPLATES),
        getCollection(KEYS.WORKOUT_LOGS),
        getCollection(KEYS.FOODS),
        getCollection(KEYS.MEAL_PLANS),
        getCollection(KEYS.MEAL_LOGS),
        getCollection(KEYS.WATER_LOGS),
        getCollection(KEYS.BODY_WEIGHT_LOGS),
        getObject(KEYS.PROFILE, DEFAULT_PROFILE),
      ]);
      setCustomExercises(ex);
      setWorkoutTemplates(tpl);
      setWorkoutLogs(wLogs);
      setFoods(fd);
      setMealPlans(mPlans);
      setMealLogs(mLogs);
      setWaterLogs(water);
      setBodyWeightLogs(bwLogs);
      setProfile(prof);
      setLoading(false);
    })();
  }, []);

  // ---- Sincronização com a nuvem (só quando há Supabase + usuário logado) ----
  function currentSnapshot() {
    return {
      exercises: customExercises,
      workoutTemplates,
      workoutLogs,
      foods,
      mealPlans,
      mealLogs,
      waterLogs,
      bodyWeightLogs,
      profile,
    };
  }

  async function hydrateFromSnapshot(snap) {
    const ex = snap.exercises ?? [];
    const tpl = snap.workoutTemplates ?? [];
    const wLogs = snap.workoutLogs ?? [];
    const fd = snap.foods ?? [];
    const mPlans = snap.mealPlans ?? [];
    const mLogs = snap.mealLogs ?? [];
    const water = snap.waterLogs ?? [];
    const bwLogs = snap.bodyWeightLogs ?? [];
    const prof = { ...DEFAULT_PROFILE, ...(snap.profile ?? {}) };

    setCustomExercises(ex);
    setWorkoutTemplates(tpl);
    setWorkoutLogs(wLogs);
    setFoods(fd);
    setMealPlans(mPlans);
    setMealLogs(mLogs);
    setWaterLogs(water);
    setBodyWeightLogs(bwLogs);
    setProfile(prof);

    await Promise.all([
      saveCollection(KEYS.EXERCISES, ex),
      saveCollection(KEYS.WORKOUT_TEMPLATES, tpl),
      saveCollection(KEYS.WORKOUT_LOGS, wLogs),
      saveCollection(KEYS.FOODS, fd),
      saveCollection(KEYS.MEAL_PLANS, mPlans),
      saveCollection(KEYS.MEAL_LOGS, mLogs),
      saveCollection(KEYS.WATER_LOGS, water),
      saveCollection(KEYS.BODY_WEIGHT_LOGS, bwLogs),
      saveObject(KEYS.PROFILE, prof),
    ]);
  }

  // Ao logar: puxa os dados da nuvem. Se a conta for nova (sem dados), envia o
  // que já existe localmente (migra os dados locais para a conta).
  useEffect(() => {
    if (!isSupabaseConfigured || !user || loading) return;
    let cancelled = false;
    (async () => {
      try {
        const cloud = await fetchCloudData(user.id);
        if (cancelled) return;
        if (cloud) {
          skipNextPushRef.current = true;
          await hydrateFromSnapshot(cloud);
        } else {
          await saveCloudData(user.id, currentSnapshot());
        }
      } catch (e) {
        console.warn('Falha ao sincronizar (puxar):', e?.message);
      } finally {
        if (!cancelled) hydratedRef.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  // Ao mudar qualquer dado (já hidratado): envia para a nuvem (com debounce).
  useEffect(() => {
    if (!isSupabaseConfigured || !user || !hydratedRef.current) return;
    if (skipNextPushRef.current) {
      skipNextPushRef.current = false;
      return;
    }
    const snapshot = currentSnapshot();
    const timer = setTimeout(() => {
      saveCloudData(user.id, snapshot).catch((e) =>
        console.warn('Falha ao sincronizar (enviar):', e?.message)
      );
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customExercises, workoutTemplates, workoutLogs, foods, mealPlans, mealLogs, waterLogs, bodyWeightLogs, profile, user]);

  // Ao deslogar: limpa os dados locais para não vazar entre contas no aparelho.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const prev = prevUserRef.current;
    prevUserRef.current = user;
    if (prev && !user) {
      hydratedRef.current = false;
      setCustomExercises([]);
      setWorkoutTemplates([]);
      setWorkoutLogs([]);
      setFoods([]);
      setMealPlans([]);
      setMealLogs([]);
      setWaterLogs([]);
      setBodyWeightLogs([]);
      setProfile(DEFAULT_PROFILE);
      Promise.all([
        saveCollection(KEYS.EXERCISES, []),
        saveCollection(KEYS.WORKOUT_TEMPLATES, []),
        saveCollection(KEYS.WORKOUT_LOGS, []),
        saveCollection(KEYS.FOODS, []),
        saveCollection(KEYS.MEAL_PLANS, []),
        saveCollection(KEYS.MEAL_LOGS, []),
        saveCollection(KEYS.WATER_LOGS, []),
        saveCollection(KEYS.BODY_WEIGHT_LOGS, []),
        saveObject(KEYS.PROFILE, DEFAULT_PROFILE),
      ]).catch(() => {});
    }
  }, [user]);

  const allExercises = useMemo(
    () => [...EXERCISE_LIBRARY, ...customExercises],
    [customExercises]
  );

  function getExerciseById(exerciseId) {
    return allExercises.find((e) => e.id === exerciseId) ?? null;
  }

  // Alimentos = biblioteca padrão + os cadastrados pelo usuário
  const allFoods = useMemo(() => [...FOOD_LIBRARY, ...foods], [foods]);

  function getFoodById(foodId) {
    return allFoods.find((f) => f.id === foodId) ?? null;
  }

  // ---- Exercises (custom only) ----
  async function addCustomExercise({ name, muscleGroup, equipment }) {
    const item = { id: generateId(), name, muscleGroup, equipment, isCustom: true };
    const next = [...customExercises, item];
    setCustomExercises(next);
    await saveCollection(KEYS.EXERCISES, next);
    return item;
  }

  async function updateCustomExercise(id, changes) {
    const next = customExercises.map((e) => (e.id === id ? { ...e, ...changes } : e));
    setCustomExercises(next);
    await saveCollection(KEYS.EXERCISES, next);
  }

  async function deleteCustomExercise(id) {
    const next = customExercises.filter((e) => e.id !== id);
    setCustomExercises(next);
    await saveCollection(KEYS.EXERCISES, next);
  }

  // ---- Workout templates ----
  async function saveWorkoutTemplate(template) {
    const exists = workoutTemplates.some((t) => t.id === template.id);
    const next = exists
      ? workoutTemplates.map((t) => (t.id === template.id ? template : t))
      : [...workoutTemplates, { ...template, id: template.id ?? generateId() }];
    setWorkoutTemplates(next);
    await saveCollection(KEYS.WORKOUT_TEMPLATES, next);
  }

  // Salva vários templates de uma vez (usado pelo gerador). Não dá pra chamar
  // saveWorkoutTemplate em loop porque cada chamada leria o mesmo estado antigo.
  async function saveWorkoutTemplates(templates) {
    const withIds = templates.map((t) => ({ ...t, id: t.id ?? generateId() }));
    const next = [...workoutTemplates, ...withIds];
    setWorkoutTemplates(next);
    await saveCollection(KEYS.WORKOUT_TEMPLATES, next);
    return withIds;
  }

  async function deleteWorkoutTemplate(id) {
    const next = workoutTemplates.filter((t) => t.id !== id);
    setWorkoutTemplates(next);
    await saveCollection(KEYS.WORKOUT_TEMPLATES, next);
  }

  // ---- Workout logs ----
  async function addWorkoutLog(log) {
    const item = { ...log, id: generateId() };
    const next = [...workoutLogs, item];
    setWorkoutLogs(next);
    await saveCollection(KEYS.WORKOUT_LOGS, next);
    return item;
  }

  async function deleteWorkoutLog(id) {
    const next = workoutLogs.filter((l) => l.id !== id);
    setWorkoutLogs(next);
    await saveCollection(KEYS.WORKOUT_LOGS, next);
  }

  function getLogsForExercise(exerciseId) {
    return workoutLogs
      .filter((log) => log.entries.some((e) => e.exerciseId === exerciseId))
      .map((log) => ({
        date: log.date,
        sets: log.entries.find((e) => e.exerciseId === exerciseId).sets,
      }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  }

  // ---- Foods ----
  async function saveFood(food) {
    const exists = foods.some((f) => f.id === food.id);
    const next = exists
      ? foods.map((f) => (f.id === food.id ? food : f))
      : [...foods, { ...food, id: food.id ?? generateId() }];
    setFoods(next);
    await saveCollection(KEYS.FOODS, next);
  }

  async function deleteFood(id) {
    const next = foods.filter((f) => f.id !== id);
    setFoods(next);
    await saveCollection(KEYS.FOODS, next);
  }

  // ---- Cardápios (planos de refeição) ----
  async function saveMealPlan(plan) {
    const exists = mealPlans.some((p) => p.id === plan.id);
    const next = exists
      ? mealPlans.map((p) => (p.id === plan.id ? plan : p))
      : [...mealPlans, { ...plan, id: plan.id ?? generateId() }];
    setMealPlans(next);
    await saveCollection(KEYS.MEAL_PLANS, next);
  }

  async function deleteMealPlan(id) {
    const next = mealPlans.filter((p) => p.id !== id);
    setMealPlans(next);
    await saveCollection(KEYS.MEAL_PLANS, next);
  }

  // Lança todas as refeições do cardápio no diário de uma data (de uma vez, para
  // não ler estado antigo em loop). Cada refeição vira um mealLog.
  async function applyMealPlanToDate(plan, date) {
    const newLogs = plan.meals
      .filter((meal) => meal.items.length > 0)
      .map((meal) => ({
        id: generateId(),
        date,
        mealType: meal.mealType,
        entries: meal.items.map((item) => {
          const food = getFoodById(item.foodId);
          return {
            foodId: item.foodId,
            foodName: food?.name ?? '',
            grams: toGrams(item.grams),
            ...computeItemMacros(food, item.grams),
          };
        }),
      }));
    const next = [...mealLogs, ...newLogs];
    setMealLogs(next);
    await saveCollection(KEYS.MEAL_LOGS, next);
    return newLogs;
  }

  // ---- Meal logs ----
  async function addMealLog(mealLog) {
    const item = { ...mealLog, id: generateId() };
    const next = [...mealLogs, item];
    setMealLogs(next);
    await saveCollection(KEYS.MEAL_LOGS, next);
    return item;
  }

  async function deleteMealLog(id) {
    const next = mealLogs.filter((m) => m.id !== id);
    setMealLogs(next);
    await saveCollection(KEYS.MEAL_LOGS, next);
  }

  // ---- Água (uma linha por dia com o total em ml) ----
  function getWaterForDate(date) {
    return waterLogs.find((w) => w.date === date)?.ml ?? 0;
  }

  async function addWater(date, deltaMl) {
    const existing = waterLogs.find((w) => w.date === date);
    const next = existing
      ? waterLogs.map((w) => (w.date === date ? { ...w, ml: Math.max(0, w.ml + deltaMl) } : w))
      : [...waterLogs, { date, ml: Math.max(0, deltaMl) }];
    setWaterLogs(next);
    await saveCollection(KEYS.WATER_LOGS, next);
  }

  // ---- Body weight logs ----
  async function addBodyWeightLog(entry) {
    const item = { ...entry, id: generateId() };
    const next = [...bodyWeightLogs, item].sort((a, b) => (a.date < b.date ? -1 : 1));
    setBodyWeightLogs(next);
    await saveCollection(KEYS.BODY_WEIGHT_LOGS, next);
    return item;
  }

  async function deleteBodyWeightLog(id) {
    const next = bodyWeightLogs.filter((b) => b.id !== id);
    setBodyWeightLogs(next);
    await saveCollection(KEYS.BODY_WEIGHT_LOGS, next);
  }

  // ---- Profile ----
  async function updateProfile(changes) {
    const next = { ...profile, ...changes };
    setProfile(next);
    await saveObject(KEYS.PROFILE, next);
  }

  const value = {
    loading,
    allExercises,
    customExercises,
    getExerciseById,
    addCustomExercise,
    updateCustomExercise,
    deleteCustomExercise,

    workoutTemplates,
    saveWorkoutTemplate,
    saveWorkoutTemplates,
    deleteWorkoutTemplate,

    workoutLogs,
    addWorkoutLog,
    deleteWorkoutLog,
    getLogsForExercise,

    foods,
    allFoods,
    getFoodById,
    saveFood,
    deleteFood,

    mealPlans,
    saveMealPlan,
    deleteMealPlan,
    applyMealPlanToDate,

    mealLogs,
    addMealLog,
    deleteMealLog,

    waterLogs,
    getWaterForDate,
    addWater,

    bodyWeightLogs,
    addBodyWeightLog,
    deleteBodyWeightLog,

    profile,
    updateProfile,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData deve ser usado dentro de AppDataProvider');
  return ctx;
}
