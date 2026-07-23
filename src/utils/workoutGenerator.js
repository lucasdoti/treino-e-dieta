import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';

const EQUIPMENT_BY_PLACE = {
  academia: ['barra', 'halteres', 'maquina', 'cabo', 'peso_corporal', 'cardio_equip'],
  casa: ['halteres', 'peso_corporal', 'elastico'],
  peso_corporal: ['peso_corporal'],
};

const SET_REP_BY_GOAL = {
  forca: { sets: 4, repsMin: 4, repsMax: 6 },
  hipertrofia: { sets: 3, repsMin: 8, repsMax: 12 },
  resistencia: { sets: 3, repsMin: 15, repsMax: 20 },
  emagrecimento: { sets: 3, repsMin: 12, repsMax: 15 },
};

const SPLITS_BY_DAYS = {
  2: [
    { label: 'Full Body A', groups: ['peito', 'costas', 'quadriceps', 'ombro', 'core'] },
    { label: 'Full Body B', groups: ['costas', 'peito', 'posterior', 'ombro', 'core'] },
  ],
  3: [
    { label: 'Full Body A', groups: ['peito', 'costas', 'quadriceps', 'ombro', 'core'] },
    { label: 'Full Body B', groups: ['costas', 'peito', 'posterior', 'biceps', 'core'] },
    { label: 'Full Body C', groups: ['quadriceps', 'posterior', 'ombro', 'triceps', 'core'] },
  ],
  4: [
    { label: 'Superior A', groups: ['peito', 'costas', 'ombro', 'triceps', 'biceps'] },
    { label: 'Inferior A', groups: ['quadriceps', 'posterior', 'panturrilha', 'core'] },
    { label: 'Superior B', groups: ['costas', 'peito', 'ombro', 'biceps', 'triceps'] },
    { label: 'Inferior B', groups: ['posterior', 'quadriceps', 'panturrilha', 'core'] },
  ],
  5: [
    { label: 'Peito/Tríceps', groups: ['peito', 'triceps'] },
    { label: 'Costas/Bíceps', groups: ['costas', 'biceps'] },
    { label: 'Pernas', groups: ['quadriceps', 'posterior', 'panturrilha'] },
    { label: 'Ombro/Core', groups: ['ombro', 'core'] },
    { label: 'Full Body', groups: ['peito', 'costas', 'quadriceps', 'core'] },
  ],
  6: [
    { label: 'Push A', groups: ['peito', 'ombro', 'triceps'] },
    { label: 'Pull A', groups: ['costas', 'biceps'] },
    { label: 'Legs A', groups: ['quadriceps', 'posterior', 'panturrilha', 'core'] },
    { label: 'Push B', groups: ['peito', 'ombro', 'triceps'] },
    { label: 'Pull B', groups: ['costas', 'biceps'] },
    { label: 'Legs B', groups: ['quadriceps', 'posterior', 'panturrilha', 'core'] },
  ],
};

function nearestSupportedDayCount(days) {
  const supported = Object.keys(SPLITS_BY_DAYS).map(Number);
  return supported.reduce((closest, d) =>
    Math.abs(d - days) < Math.abs(closest - days) ? d : closest
  );
}

function pickExercisesForGroup(group, allowedEquipment, offset, count) {
  const options = EXERCISE_LIBRARY.filter(
    (ex) => ex.muscleGroup === group && allowedEquipment.includes(ex.equipment)
  );
  if (options.length === 0) return [];
  const rotated = [...options.slice(offset % options.length), ...options.slice(0, offset % options.length)];
  return rotated.slice(0, count);
}

export function generateWorkoutPlan({ goalKey, daysPerWeek, placeKey, levelKey }) {
  const dayCount = nearestSupportedDayCount(daysPerWeek);
  const split = SPLITS_BY_DAYS[dayCount];
  const allowedEquipment = EQUIPMENT_BY_PLACE[placeKey] ?? EQUIPMENT_BY_PLACE.academia;
  const setRep = SET_REP_BY_GOAL[goalKey] ?? SET_REP_BY_GOAL.hipertrofia;
  const exercisesPerGroup = levelKey === 'iniciante' ? 1 : 2;

  const templates = split.map((day, dayIndex) => {
    const exerciseEntries = [];
    day.groups.forEach((group) => {
      const picked = pickExercisesForGroup(group, allowedEquipment, dayIndex, exercisesPerGroup);
      picked.forEach((exercise) => {
        exerciseEntries.push({
          exerciseId: exercise.id,
          targetSets: setRep.sets,
          targetRepsMin: setRep.repsMin,
          targetRepsMax: setRep.repsMax,
        });
      });
    });

    if (goalKey === 'emagrecimento') {
      const cardioOptions = EXERCISE_LIBRARY.filter(
        (ex) => ex.muscleGroup === 'cardio' && allowedEquipment.includes(ex.equipment)
      );
      const cardio = cardioOptions[dayIndex % cardioOptions.length] ?? cardioOptions[0];
      if (cardio) {
        exerciseEntries.push({
          exerciseId: cardio.id,
          targetSets: 1,
          targetRepsMin: 20,
          targetRepsMax: 30,
          isCardioMinutes: true,
        });
      }
    }

    return { name: day.label, exerciseEntries };
  });

  return templates;
}

export const GENERATOR_GOALS = [
  { key: 'hipertrofia', label: 'Hipertrofia' },
  { key: 'forca', label: 'Força' },
  { key: 'resistencia', label: 'Resistência' },
  { key: 'emagrecimento', label: 'Emagrecimento' },
];

export const GENERATOR_PLACES = [
  { key: 'academia', label: 'Academia completa' },
  { key: 'casa', label: 'Casa (pouco equipamento)' },
  { key: 'peso_corporal', label: 'Só peso do corpo' },
];

export const GENERATOR_LEVELS = [
  { key: 'iniciante', label: 'Iniciante' },
  { key: 'intermediario', label: 'Intermediário' },
  { key: 'avancado', label: 'Avançado' },
];
