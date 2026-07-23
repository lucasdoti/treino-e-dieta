import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { KEYS, getCollection, saveCollection, getObject, saveObject } from '../storage/db';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { generateId } from '../utils/id';

const DEFAULT_PROFILE = {
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
};

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [customExercises, setCustomExercises] = useState([]);
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [foods, setFoods] = useState([]);
  const [mealLogs, setMealLogs] = useState([]);
  const [bodyWeightLogs, setBodyWeightLogs] = useState([]);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    (async () => {
      const [ex, tpl, wLogs, fd, mLogs, bwLogs, prof] = await Promise.all([
        getCollection(KEYS.EXERCISES),
        getCollection(KEYS.WORKOUT_TEMPLATES),
        getCollection(KEYS.WORKOUT_LOGS),
        getCollection(KEYS.FOODS),
        getCollection(KEYS.MEAL_LOGS),
        getCollection(KEYS.BODY_WEIGHT_LOGS),
        getObject(KEYS.PROFILE, DEFAULT_PROFILE),
      ]);
      setCustomExercises(ex);
      setWorkoutTemplates(tpl);
      setWorkoutLogs(wLogs);
      setFoods(fd);
      setMealLogs(mLogs);
      setBodyWeightLogs(bwLogs);
      setProfile(prof);
      setLoading(false);
    })();
  }, []);

  const allExercises = useMemo(
    () => [...EXERCISE_LIBRARY, ...customExercises],
    [customExercises]
  );

  function getExerciseById(exerciseId) {
    return allExercises.find((e) => e.id === exerciseId) ?? null;
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
    saveFood,
    deleteFood,

    mealLogs,
    addMealLog,
    deleteMealLog,

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
